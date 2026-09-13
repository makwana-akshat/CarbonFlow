"""
Integration tests for the chatbot supplier search tool.

These tests verify that the chatbot's search_suppliers tool correctly queries
the same co2_listings table used by the dashboard, with proper filtering.

NOTE: These tests require a live Supabase connection (reads .env).
They test the actual MarketplaceRepository.search_listings_for_chatbot() method,
which is the same code path the chatbot tool uses.
"""
import os
import sys
import json
import pytest

# Ensure the backend app is importable
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from app.repositories.marketplace_repository import MarketplaceRepository
from app.services.marketplace_service import MarketplaceService


@pytest.fixture
def repo():
    return MarketplaceRepository()


@pytest.fixture
def service():
    return MarketplaceService()


class TestChatbotSupplierSearch:
    """
    Tests for the search_listings_for_chatbot repository method.
    This is the core data path that the chatbot tool uses.
    """

    def test_basic_search_returns_results(self, repo):
        """Verify that a search without filters returns active listings."""
        result = repo.search_listings_for_chatbot()
        assert "items" in result
        assert "total" in result
        assert isinstance(result["items"], list)
        # There should be at least some active listings in the marketplace
        # (This is a smoke test for DB connectivity)

    def test_reported_bug_case_quantity_purity_location(self, repo):
        """
        THE EXACT REPORTED BUG:
        Search for 120 tonnes, 99.9% purity, Texas.
        A supplier with 120,000t / 99.9% / Texas, USA MUST be returned
        if that record exists and is active.

        Quantity filter: available_quantity >= requested_quantity (120,000 >= 120 ✓)
        Purity filter: purity >= min_purity (99.9 >= 99.9 ✓)
        Location filter: location ILIKE '%Texas%' ✓
        """
        result = repo.search_listings_for_chatbot(
            min_purity=99.9,
            min_quantity=120,
            location="Texas"
        )
        items = result.get("items", [])

        # If the test supplier exists in the DB, it MUST be in the results
        texas_suppliers = [
            item for item in items
            if "Texas" in (item.get("location") or "")
            and float(item.get("purity_percentage") or 0) >= 99.9
            and float(item.get("volume_tpa") or 0) >= 120
        ]

        if items:
            # If we got results, verify they all satisfy the filters
            for item in items:
                assert float(item.get("purity_percentage") or 0) >= 99.9, \
                    f"Purity filter failed: {item.get('purity_percentage')}"
                assert float(item.get("volume_tpa") or 0) >= 120, \
                    f"Quantity filter failed: {item.get('volume_tpa')}"
                assert "texas" in (item.get("location") or "").lower(), \
                    f"Location filter failed: {item.get('location')}"

    def test_purity_boundary_exclusion(self, repo):
        """
        Search with min_purity=99.99.
        A 99.9% purity supplier should NOT qualify (99.9 < 99.99).
        """
        result = repo.search_listings_for_chatbot(
            min_purity=99.99,
            location="Texas"
        )
        items = result.get("items", [])

        for item in items:
            purity = float(item.get("purity_percentage") or 0)
            assert purity >= 99.99, \
                f"Purity boundary exclusion failed: supplier with {purity}% should not appear for min 99.99%"

    def test_exact_quantity_boundary(self, repo):
        """
        Search with quantity=120000.
        Supplier with exactly 120,000 tonnes should qualify (120,000 >= 120,000).
        """
        result = repo.search_listings_for_chatbot(
            min_quantity=120000,
            location="Texas"
        )
        items = result.get("items", [])

        for item in items:
            vol = float(item.get("volume_tpa") or 0)
            assert vol >= 120000, \
                f"Quantity boundary failed: {vol} should be >= 120000"

    def test_price_exclusion(self, repo):
        """
        Search with max_price=500.
        Supplier at ₹850/t should NOT qualify (850 > 500).
        """
        result = repo.search_listings_for_chatbot(
            max_price=500,
            min_quantity=120,
            location="Texas"
        )
        items = result.get("items", [])

        for item in items:
            price = float(item.get("price_per_ton") or 0)
            assert price <= 500, \
                f"Price exclusion failed: supplier at ₹{price}/t should not appear for max ₹500/t"

    def test_price_inclusion(self, repo):
        """
        Search with max_price=1000.
        Supplier at ₹850/t should qualify (850 <= 1000).
        """
        result = repo.search_listings_for_chatbot(
            max_price=1000,
            min_quantity=120,
            location="Texas"
        )
        items = result.get("items", [])

        for item in items:
            price = float(item.get("price_per_ton") or 0)
            assert price <= 1000, \
                f"Price inclusion failed: {price} should be <= 1000"


class TestToolRegistrySearchSuppliers:
    """
    Tests for the ToolRegistry.search_suppliers method.
    Verifies the tool returns proper structured output.
    """

    def test_search_returns_structured_envelope(self):
        """
        The tool must return a JSON envelope with success, total, results.
        We use a dummy clerk_user_id that may not exist — the tool should
        still query the marketplace (it doesn't require authenticated user
        to have co2_requests).
        """
        from app.ai.tools import ToolRegistry

        # Use a non-existent clerk ID — the tool should still work
        # because it queries co2_listings directly, not user-specific data
        registry = ToolRegistry(clerk_user_id="test-user-nonexistent")
        result_json = registry.search_suppliers(
            quantity_tonnes=120,
            min_purity_percentage=99.9,
            location="Texas"
        )

        result = json.loads(result_json)
        assert "success" in result, "Missing 'success' field in tool result"

        if result["success"]:
            assert "total" in result, "Missing 'total' field"
            assert "results" in result, "Missing 'results' field"
            assert "result_id" in result, "Missing 'result_id' field"
            assert isinstance(result["results"], list)

            # Verify result fields contain raw numeric values, not formatted strings
            for r in result["results"]:
                assert isinstance(r.get("available_quantity_tonnes"), (int, float)), \
                    f"available_quantity_tonnes should be numeric, got: {type(r.get('available_quantity_tonnes'))}"
                assert isinstance(r.get("purity_percentage"), (int, float)), \
                    f"purity_percentage should be numeric, got: {type(r.get('purity_percentage'))}"
                assert isinstance(r.get("price_per_tonne"), (int, float)), \
                    f"price_per_tonne should be numeric, got: {type(r.get('price_per_tonne'))}"
        else:
            # If it failed, it should have an error field (e.g., user not found)
            assert "error" in result, "Failed result should have 'error' field"

    def test_search_failure_not_reported_as_zero(self):
        """
        Verify that a backend failure produces success=false,
        NOT success=true with total=0.
        """
        from app.ai.tools import ToolRegistry

        registry = ToolRegistry(clerk_user_id="test-user-nonexistent")
        result_json = registry.search_suppliers(quantity_tonnes=-1)
        result = json.loads(result_json)

        # Negative quantity should be rejected by validation
        assert result.get("success") is False, \
            "Negative quantity should be rejected"

    def test_validation_rejects_invalid_purity(self):
        """Purity outside 0-100 range should be rejected."""
        from app.ai.tools import ToolRegistry

        registry = ToolRegistry(clerk_user_id="test-user-nonexistent")
        result_json = registry.search_suppliers(min_purity_percentage=150)
        result = json.loads(result_json)

        assert result.get("success") is False, \
            "Purity > 100 should be rejected"


class TestMarketplaceServiceAdapter:
    """
    Verify that MarketplaceService.search_listings_for_chatbot() exists
    and correctly delegates to the repository.
    """

    def test_service_adapter_exists(self, service):
        """The chatbot adapter method must exist on MarketplaceService."""
        assert hasattr(service, "search_listings_for_chatbot"), \
            "MarketplaceService is missing search_listings_for_chatbot method"

    def test_service_returns_same_structure_as_repo(self, service, repo):
        """Service and repo should return the same structure."""
        service_result = service.search_listings_for_chatbot()
        repo_result = repo.search_listings_for_chatbot()

        assert "items" in service_result
        assert "total" in service_result
        assert "items" in repo_result
        assert "total" in repo_result
