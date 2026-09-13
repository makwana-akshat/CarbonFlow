import json
import uuid
import pytest
from unittest.mock import MagicMock, patch

from app.ai.memory import ChatSessionManager
from app.ai.orchestrator import AgentOrchestrator, ChatIntentResponse
from app.ai.context_resolver import ContextResolver
from app.ai.tools import ToolRegistry

@pytest.fixture
def mock_session_manager(monkeypatch):
    """Provides a fresh in-memory session manager for testing."""
    manager = ChatSessionManager()
    manager.use_redis = False
    manager._memory_fallback = {}
    return manager

@pytest.fixture
def sample_listings():
    """Sample listings representing real DB marketplace listings."""
    id1 = str(uuid.uuid4())
    id2 = str(uuid.uuid4())
    id3 = str(uuid.uuid4())
    return [
        {
            "id": id1,
            "supplier_id": str(uuid.uuid4()),
            "facility_name": "Gulf Coast DAC Plant",
            "co2_grade": "Food Grade",
            "volume_tpa": 120000.0,
            "price_per_ton": 850.0,
            "purity_percentage": 99.9,
            "transport_modes": ["ISO Rail Tanker", "Road"],
            "status": "active",
            "location": "Texas, USA",
            "users": {
                "first_name": "Axat",
                "last_name": "Makwana",
                "company_name": "Gulf Coast Carbon Hub",
                "is_verified": True
            }
        },
        {
            "id": id2,
            "supplier_id": str(uuid.uuid4()),
            "facility_name": "Gujarat Direct Air Node",
            "co2_grade": "Industrial",
            "volume_tpa": 50000.0,
            "price_per_ton": 1200.0,
            "purity_percentage": 99.5,
            "transport_modes": ["Road"],
            "status": "active",
            "location": "Ahmedabad, India",
            "users": {
                "first_name": "Tata",
                "last_name": "Chemicals",
                "company_name": "Tata Cleantech",
                "is_verified": True
            }
        },
        {
            "id": id3,
            "supplier_id": str(uuid.uuid4()),
            "facility_name": "Reliance Capture 3",
            "co2_grade": "Technical",
            "volume_tpa": 80000.0,
            "price_per_ton": 1400.0,
            "purity_percentage": 98.0,
            "transport_modes": ["Pipeline"],
            "status": "active",
            "location": "Hazira, Gujarat",
            "users": {
                "first_name": "Reliance",
                "last_name": "Industries",
                "company_name": "RIL Green",
                "is_verified": True
            }
        }
    ]

class TestContextResolver:
    """Test entity reference resolution, language variations, and intent detection."""

    def test_ordinal_supplier_resolution_english(self):
        session = {"last_supplier_ids": ["sup-1", "sup-2", "sup-3"]}
        assert ContextResolver.resolve_supplier_reference("I'll take the first one", session) == "sup-1"
        assert ContextResolver.resolve_supplier_reference("Use the second supplier", session) == "sup-2"
        assert ContextResolver.resolve_supplier_reference("Choose the 3rd one", session) == "sup-3"

    def test_ordinal_supplier_resolution_hindi(self):
        session = {"last_supplier_ids": ["sup-1", "sup-2", "sup-3"]}
        assert ContextResolver.resolve_supplier_reference("पहले वाले supplier से order कर दो", session) == "sup-1"
        assert ContextResolver.resolve_supplier_reference("दूसरे वाले को सेलेक्ट करो", session) == "sup-2"

    def test_ordinal_supplier_resolution_hinglish(self):
        session = {"last_supplier_ids": ["sup-1", "sup-2", "sup-3"]}
        assert ContextResolver.resolve_supplier_reference("First wale supplier ka order place kar do", session) == "sup-1"
        assert ContextResolver.resolve_supplier_reference("Dusra wala theek hai", session) == "sup-2"

    def test_positive_confirmations_multilingual(self):
        # English
        assert ContextResolver.is_positive_confirmation("yes")
        assert ContextResolver.is_positive_confirmation("Yes, do it.")
        assert ContextResolver.is_positive_confirmation("Place it.")
        assert ContextResolver.is_positive_confirmation("Confirm.")
        assert ContextResolver.is_positive_confirmation("Proceed.")
        # Hindi / Hinglish
        assert ContextResolver.is_positive_confirmation("Haan")
        assert ContextResolver.is_positive_confirmation("haan, place karo")
        assert ContextResolver.is_positive_confirmation("kar do")
        assert ContextResolver.is_positive_confirmation("order kar do")
        assert ContextResolver.is_positive_confirmation("हाँ")
        assert ContextResolver.is_positive_confirmation("कर दो")

    def test_negative_confirmations_multilingual(self):
        assert ContextResolver.is_negative_confirmation("no")
        assert ContextResolver.is_negative_confirmation("No, cancel.")
        assert ContextResolver.is_negative_confirmation("Don't place it")
        assert ContextResolver.is_negative_confirmation("Not now")
        assert ContextResolver.is_negative_confirmation("Nahi")
        assert ContextResolver.is_negative_confirmation("mat karo")
        assert ContextResolver.is_negative_confirmation("नहीं")

    def test_order_intent_distinction(self):
        # "placed the order" should be CREATE_ORDER, NOT TRACK_ORDER
        session = {}
        assert ContextResolver.detect_intent("placed the order", session) == "CREATE_ORDER"
        assert ContextResolver.detect_intent("place the order", session) == "CREATE_ORDER"
        assert ContextResolver.detect_intent("I want to buy 500 tonnes", session) == "CREATE_ORDER"
        assert ContextResolver.detect_intent("Order from this supplier", session) == "CREATE_ORDER"
        assert ContextResolver.detect_intent("First wale supplier ka order place kar do", session) == "CREATE_ORDER"

        # Tracking intents
        assert ContextResolver.detect_intent("where is my order", session) == "TRACK_ORDER"
        assert ContextResolver.detect_intent("track order ORD-1234", session) == "TRACK_ORDER"
        assert ContextResolver.detect_intent("track it", session) == "TRACK_ORDER"
        assert ContextResolver.detect_intent("kahan hai mera order", session) == "TRACK_ORDER"


class TestChatbotOrderExecutionFlow:
    """Tests the full end-to-end user flows from prompt specification."""

    def test_exact_user_flow_search_select_order_track(self, monkeypatch, sample_listings):
        """
        Scenario 47:
        User searches -> results in session -> "I'll take the first one" ->
        "Place the order" -> confirmation requested -> "Yes" -> order created ->
        "Track it" -> tracks using last_order_id with NO order ID question.
        """
        clerk_id = f"user_{uuid.uuid4().hex[:8]}"
        session_id = f"sess_{uuid.uuid4().hex[:8]}"
        orchestrator = AgentOrchestrator(clerk_user_id=clerk_id, session_id=session_id)

        # Mock DB listing retrieval
        first_listing = sample_listings[0]
        monkeypatch.setattr(orchestrator.market_repo, "get_listing_by_id", lambda lid: first_listing)

        # Seed session with previous search results (Item 47 step 1)
        session = orchestrator.memory.get_session(session_id)
        session["last_supplier_ids"] = [l["id"] for l in sample_listings]
        session["last_search_results"] = [
            {
                "listing_id": l["id"],
                "supplier_name": f"{l['users']['first_name']} {l['users']['last_name']}",
                "company_name": l["users"]["company_name"],
                "price_per_tonne": l["price_per_ton"],
                "location": l["location"]
            }
            for l in sample_listings
        ]
        session["selected_quantity_tonnes"] = 500.0
        orchestrator.memory.save_session(session_id, session)

        # 1. User says: "I'll take the first one."
        resp1 = orchestrator.process_message("I'll take the first one.")
        assert resp1.intent == "FIND_SUPPLIER"
        session = orchestrator.memory.get_session(session_id)
        assert session["selected_supplier_id"] == first_listing["id"]
        assert session["selected_supplier_name"] == "Axat Makwana"

        # 2. User says: "Place the order." (Bug 1: should NOT track order)
        resp2 = orchestrator.process_message("Place the order.")
        assert resp2.intent == "CREATE_ORDER"
        assert resp2.requires_confirmation is True
        assert "Axat Makwana" in resp2.message
        assert "500 tonnes" in resp2.message
        assert "Would you like me to place the order?" in resp2.message

        session = orchestrator.memory.get_session(session_id)
        assert session["pending_action"] == "CREATE_ORDER"
        assert session["pending_action_parameters"]["volume"] == 500.0

        # 3. User says: "Yes." (Confirmation execution)
        created_order_mock = {
            "id": str(uuid.uuid4()),
            "buyer_id": str(uuid.uuid4()),
            "supplier_id": first_listing["supplier_id"],
            "listing_id": first_listing["id"],
            "volume": 500.0,
            "total_value": 500.0 * 850.0,
            "transport_mode": "ISO Rail Tanker",
            "status": "pending"
        }
        monkeypatch.setattr(
            orchestrator.tool_registry,
            "create_order",
            lambda **kwargs: json.dumps({
                "success": True,
                "order_id": created_order_mock["id"],
                "short_id": f"ORD-{created_order_mock['id'][:4].upper()}",
                "status": "pending",
                "volume": 500.0,
                "total_value": 425000.0,
                "transport_mode": "ISO Rail Tanker"
            })
        )

        resp3 = orchestrator.process_message("Yes.")
        assert resp3.intent == "CREATE_ORDER"
        assert resp3.requires_confirmation is False
        assert "Order placed successfully!" in resp3.message
        assert created_order_mock["id"][:4].upper() in resp3.message
        assert resp3.dashboard_action is not None
        assert resp3.dashboard_action.type == "SHOW_ORDER"

        session = orchestrator.memory.get_session(session_id)
        assert session["last_order_id"] == created_order_mock["id"]
        assert session["pending_action"] is None

        # 4. User says: "Track it." (Must NOT ask for order ID!)
        monkeypatch.setattr(
            orchestrator.tool_registry,
            "track_order",
            lambda order_id: json.dumps({
                "success": True,
                "order_id": order_id,
                "id": f"ORD-{order_id[:4].upper()}",
                "status": "pending",
                "volume": 500.0,
                "transport_mode": "ISO Rail Tanker",
                "eta": "Active Telemetry"
            })
        )

        resp4 = orchestrator.process_message("Track it.")
        assert resp4.intent == "TRACK_ORDER"
        # Verify it did not ask for order ID
        assert "Could you please provide your Order ID" not in resp4.message
        assert "tracking status for Order" in resp4.message
        assert created_order_mock["id"][:4].upper() in resp4.message

    def test_observed_bug_placed_the_order_maps_to_create_order(self, monkeypatch, sample_listings):
        """
        Verifies the exact observed bug from Section 1:
        User says 'placed the order' after supplier search.
        Chatbot must NOT switch to TRACK_ORDER and ask for order ID.
        """
        clerk_id = f"user_{uuid.uuid4().hex[:8]}"
        session_id = f"sess_{uuid.uuid4().hex[:8]}"
        orchestrator = AgentOrchestrator(clerk_user_id=clerk_id, session_id=session_id)

        first_listing = sample_listings[0]
        monkeypatch.setattr(orchestrator.market_repo, "get_listing_by_id", lambda lid: first_listing)

        # Seed session with 1 supplier from search
        session = orchestrator.memory.get_session(session_id)
        session["last_supplier_ids"] = [first_listing["id"]]
        session["selected_supplier_id"] = first_listing["id"]
        session["selected_quantity_tonnes"] = 120.0
        orchestrator.memory.save_session(session_id, session)

        # User says "placed the order"
        resp = orchestrator.process_message("placed the order")

        # MUST be CREATE_ORDER with confirmation, NOT asking for order ID!
        assert resp.intent == "CREATE_ORDER"
        assert "Could you please provide the order ID" not in resp.message
        assert resp.requires_confirmation is True
        assert "Would you like me to place the order?" in resp.message

    def test_hindi_supplier_order(self, monkeypatch, sample_listings):
        """
        Scenario 48:
        User says: 'पहले वाले supplier से order कर दो'
        Expected: CREATE_ORDER, resolves 1st supplier, asks confirmation.
        """
        clerk_id = f"user_{uuid.uuid4().hex[:8]}"
        session_id = f"sess_{uuid.uuid4().hex[:8]}"
        orchestrator = AgentOrchestrator(clerk_user_id=clerk_id, session_id=session_id)

        first_listing = sample_listings[0]
        monkeypatch.setattr(orchestrator.market_repo, "get_listing_by_id", lambda lid: first_listing)

        session = orchestrator.memory.get_session(session_id)
        session["last_supplier_ids"] = [l["id"] for l in sample_listings]
        orchestrator.memory.save_session(session_id, session)

        resp = orchestrator.process_message("पहले वाले supplier से order कर दो")
        assert resp.intent == "CREATE_ORDER"
        assert resp.requires_confirmation is True
        session = orchestrator.memory.get_session(session_id)
        assert session["selected_supplier_id"] == first_listing["id"]

    def test_hinglish_supplier_order(self, monkeypatch, sample_listings):
        """
        Scenario 49:
        User says: 'First wale supplier ka order place kar do.'
        Expected: CREATE_ORDER, resolves 1st supplier, asks confirmation.
        """
        clerk_id = f"user_{uuid.uuid4().hex[:8]}"
        session_id = f"sess_{uuid.uuid4().hex[:8]}"
        orchestrator = AgentOrchestrator(clerk_user_id=clerk_id, session_id=session_id)

        first_listing = sample_listings[0]
        monkeypatch.setattr(orchestrator.market_repo, "get_listing_by_id", lambda lid: first_listing)

        session = orchestrator.memory.get_session(session_id)
        session["last_supplier_ids"] = [l["id"] for l in sample_listings]
        orchestrator.memory.save_session(session_id, session)

        resp = orchestrator.process_message("First wale supplier ka order place kar do.")
        assert resp.intent == "CREATE_ORDER"
        assert resp.requires_confirmation is True
        session = orchestrator.memory.get_session(session_id)
        assert session["selected_supplier_id"] == first_listing["id"]

    def test_tracking_with_pronoun_where_is_it(self, monkeypatch):
        """
        Scenario 50:
        User asks: 'Where is it?'
        Expected: TRACK_ORDER using last_order_id.
        """
        clerk_id = f"user_{uuid.uuid4().hex[:8]}"
        session_id = f"sess_{uuid.uuid4().hex[:8]}"
        orchestrator = AgentOrchestrator(clerk_user_id=clerk_id, session_id=session_id)

        test_order_id = str(uuid.uuid4())
        session = orchestrator.memory.get_session(session_id)
        session["last_order_id"] = test_order_id
        orchestrator.memory.save_session(session_id, session)

        monkeypatch.setattr(
            orchestrator.tool_registry,
            "track_order",
            lambda order_id: json.dumps({
                "success": True,
                "order_id": order_id,
                "id": f"ORD-{order_id[:4].upper()}",
                "status": "in-transit",
                "volume": 500.0,
                "transport_mode": "Road",
                "eta": "4 hours"
            })
        )

        resp = orchestrator.process_message("Where is it?")
        assert resp.intent == "TRACK_ORDER"
        assert "tracking status for Order" in resp.message
        assert test_order_id[:4].upper() in resp.message

    def test_cancellation_clears_pending_action(self, monkeypatch, sample_listings):
        """
        Scenario 52:
        Assistant asks confirmation -> User says 'No' -> pending action cleared, no order created.
        """
        clerk_id = f"user_{uuid.uuid4().hex[:8]}"
        session_id = f"sess_{uuid.uuid4().hex[:8]}"
        orchestrator = AgentOrchestrator(clerk_user_id=clerk_id, session_id=session_id)

        session = orchestrator.memory.get_session(session_id)
        session["pending_action"] = "CREATE_ORDER"
        session["pending_action_parameters"] = {"listing_id": sample_listings[0]["id"], "volume": 500.0}
        session["requires_confirmation"] = True
        orchestrator.memory.save_session(session_id, session)

        resp = orchestrator.process_message("No, cancel.")
        assert resp.intent == "CANCEL_ORDER"
        assert "cancelled the order placement" in resp.message

        session = orchestrator.memory.get_session(session_id)
        assert session["pending_action"] is None
        assert session["requires_confirmation"] is False

    def test_ambiguous_supplier_prompts_selection(self, monkeypatch, sample_listings):
        """
        Scenario 53:
        Multiple suppliers exist in search results, no supplier selected yet.
        User says: 'Place the order.'
        Expected: Chatbot asks which supplier to order from rather than guessing.
        """
        clerk_id = f"user_{uuid.uuid4().hex[:8]}"
        session_id = f"sess_{uuid.uuid4().hex[:8]}"
        orchestrator = AgentOrchestrator(clerk_user_id=clerk_id, session_id=session_id)

        session = orchestrator.memory.get_session(session_id)
        session["last_supplier_ids"] = [l["id"] for l in sample_listings]
        session["last_search_results"] = [
            {"listing_id": l["id"], "supplier_name": f"Supplier {i}", "price_per_tonne": 850}
            for i, l in enumerate(sample_listings, 1)
        ]
        session["selected_supplier_id"] = None
        orchestrator.memory.save_session(session_id, session)

        resp = orchestrator.process_message("Place the order.")
        assert resp.intent == "CREATE_ORDER"
        assert "Which supplier would you like to order from?" in resp.message
        assert "first one" in resp.message

    def test_session_expiration_handling(self):
        """
        Scenario 55:
        If session context is empty (expired):
        User says: 'Place the order.'
        Expected: Safely prompts user to search or select a supplier first.
        """
        clerk_id = f"user_{uuid.uuid4().hex[:8]}"
        session_id = f"sess_{uuid.uuid4().hex[:8]}"
        orchestrator = AgentOrchestrator(clerk_user_id=clerk_id, session_id=session_id)

        resp = orchestrator.process_message("Place the order.")
        assert resp.intent == "CREATE_ORDER"
        assert "I don't have an active supplier selection" in resp.message


class TestDuplicateOrderProtection:
    """Test duplicate order creation prevention (Scenario 51)."""

    def test_idempotent_order_creation(self, monkeypatch):
        registry = ToolRegistry(clerk_user_id="mock_clerk_id")
        listing_id = str(uuid.uuid4())
        existing_order_id = str(uuid.uuid4())

        # Mock OrderService to return an existing recent order for same listing and volume
        mock_recent = {
            "items": [
                {
                    "id": existing_order_id,
                    "listing_id": listing_id,
                    "volume": 500.0,
                    "total_value": 425000.0,
                    "status": "pending",
                    "transport_mode": "Road"
                }
            ]
        }
        mock_order_service = MagicMock()
        mock_order_service.get_orders.return_value = mock_recent
        monkeypatch.setattr("app.ai.tools.OrderService", lambda: mock_order_service)

        # Execute create_order with identical listing and volume
        result_str = registry.create_order(listing_id=listing_id, volume_tonnes=500.0)
        result = json.loads(result_str)

        assert result["success"] is True
        assert result["is_duplicate"] is True
        assert result["order_id"] == existing_order_id
        # OrderService.create_order must NOT be called again
        mock_order_service.create_order.assert_not_called()
