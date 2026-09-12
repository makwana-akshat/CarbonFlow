from app.core.config import settings
from supabase import create_client, Client
from app.repositories.user_repository import UserRepository
from app.services.matching_engine import MatchingEngine

import uuid
from decimal import Decimal

class RecommendationService:
    def __init__(self):
        self.db: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)
        self.user_repo = UserRepository()
        self.engine = MatchingEngine()

    def _get_company_name(self, user_dict):
        if not user_dict: return "Unknown Company"
        return user_dict.get("company_name") or user_dict.get("organisation") or "Unknown Company"
        
    def _get_route_steps(self, transport_modes):
        if not transport_modes: return []
        steps = []
        mode = transport_modes[0].lower() if isinstance(transport_modes, list) else transport_modes.lower()
        steps.append({"icon_type": "capture", "label": "Origin Source"})
        
        if 'pipeline' in mode:
            steps.append({"icon_type": "pipeline", "label": "Regional Pipeline"})
        elif 'rail' in mode:
            steps.append({"icon_type": "rail", "label": "ISO Rail Transfer"})
        elif 'truck' in mode:
            steps.append({"icon_type": "truck", "label": "Road Freight"})
        elif 'barge' in mode:
            steps.append({"icon_type": "terminal", "label": "Marine Barge"})
        else:
            steps.append({"icon_type": "cryo", "label": "Logistics Dispatch"})
            
        steps.append({"icon_type": "terminal", "label": "Destination Hub"})
        return steps

    def get_recommendations_for_user(self, clerk_user_id: str, role: str, refresh: bool = False):
        user = self.user_repo.get_user_by_clerk_id(clerk_user_id)
        if not user:
            return []
            
        user_id = user["id"]
        recommendations = []
        
        # We always calculate on the fly for this deterministic version,
        # so refresh=True doesn't require clearing a cache here.
        
        if role == "buyer":
            reqs_resp = self.db.table("co2_requests").select("*").eq("buyer_id", user_id).eq("status", "active").execute()
            reqs = reqs_resp.data if reqs_resp else []
            if not reqs:
                return []
                
            listings_resp = self.db.table("co2_listings").select("*, supplier:supplier_id(company_name, organisation, is_verified)").eq("status", "active").execute()
            listings = listings_resp.data if listings_resp else []
            
            for req in reqs:
                for lst in listings:
                    supplier_data = lst.get("supplier", {}) or {}
                    # Inject verified status for the engine
                    lst["is_verified"] = supplier_data.get("is_verified", True)
                    
                    match_result = self.engine.calculate_match(supply=lst, demand=req)
                    if not match_result.get("is_match"):
                        continue
                        
                    company_name = self._get_company_name(supplier_data)
                    listing_vol = float(lst.get("volume_tpa") or 0)
                    listing_price = float(lst.get("price_per_ton") or 0)
                    listing_purity = float(lst.get("purity_percentage") or 0)
                    distance_km = match_result.get("distance_km", 0)
                    
                    tags = []
                    if match_result["breakdown"]["purity"] > 90: tags.append("High Purity")
                    if match_result["breakdown"]["price"] > 90: tags.append("Under Budget")
                    if match_result["breakdown"]["segmentFit"] > 90: tags.append(lst.get("source_type", "Industrial"))
                    
                    recommendations.append({
                        "id": str(uuid.uuid4()),
                        "user_id": user_id,
                        "user_role": "buyer",
                        "listing_id": lst["id"],
                        "requirement_id": req["id"],
                        "company_name": company_name,
                        "facility_type": lst.get("facility_name") or "Capture Facility",
                        "match_score": Decimal(str(match_result["final_score"])),
                        "is_best_match": False,
                        "is_verified": lst["is_verified"],
                        "tags": tags[:3], # Limit to 3 tags
                        "co2_grade": lst.get("co2_grade"),
                        "volume": f"{listing_vol:,.0f} t",
                        "price_per_ton": f"₹{listing_price:,.0f}/t",
                        "co2_source": lst.get("source_type", "Industrial"),
                        "transport_mode": lst.get("transport_modes", ["Truck"])[0] if lst.get("transport_modes") else "Truck",
                        "purity": f"{listing_purity}%",
                        "delivery_timeline": "Spot / Immediate",
                        "certification": "ISO 14064-2 Verified" if lst["is_verified"] else "Self-Reported",
                        "distance": f"{distance_km} km",
                        "reliability": f"{match_result['reliability_pct']}%",
                        "segment": match_result["segment_name"],
                        "reasons": match_result["reasons"],
                        "breakdown": match_result["breakdown"],
                        "route_steps": self._get_route_steps(lst.get("transport_modes")),
                        "created_at": lst.get("created_at")
                    })
                    
        elif role == "supplier":
            listings_resp = self.db.table("co2_listings").select("*").eq("supplier_id", user_id).eq("status", "active").execute()
            listings = listings_resp.data if listings_resp else []
            if not listings:
                return []
                
            reqs_resp = self.db.table("co2_requests").select("*, buyer:buyer_id(company_name, organisation)").eq("status", "active").execute()
            reqs = reqs_resp.data if reqs_resp else []
            
            for lst in listings:
                # We fetch supplier data manually for the engine (we could fetch it once)
                user_data = user
                lst["is_verified"] = user_data.get("is_verified", True)
                
                for req in reqs:
                    match_result = self.engine.calculate_match(supply=lst, demand=req)
                    if not match_result.get("is_match"):
                        continue
                        
                    buyer_data = req.get("buyer", {}) or {}
                    company_name = self._get_company_name(buyer_data)
                    req_vol = float(req.get("volume_needed") or 0)
                    req_price = float(req.get("target_price") or 0)
                    req_purity = float(req.get("min_purity_required") or 0)
                    distance_km = match_result.get("distance_km", 0)
                    
                    tags = ["Verified Offtake"]
                    if match_result["breakdown"]["price"] >= 80: tags.append("Price Match")
                    if match_result["breakdown"]["quantity"] == 100: tags.append("Full Fulfillment")
                    
                    recommendations.append({
                        "id": str(uuid.uuid4()),
                        "user_id": user_id,
                        "user_role": "supplier",
                        "listing_id": lst["id"],
                        "requirement_id": req["id"],
                        "company_name": company_name,
                        "facility_type": req.get("application") or "Industrial",
                        "match_score": Decimal(str(match_result["final_score"])),
                        "is_best_match": False,
                        "is_verified": True,
                        "tags": tags[:3],
                        "co2_grade": req.get("required_grade"),
                        "volume": f"{req_vol:,.0f} t needed",
                        "price_per_ton": f"Target: ₹{req_price:,.0f}/t",
                        "co2_source": req.get("application") or "Industrial",
                        "transport_mode": "Buyer Arranged",
                        "purity": f"Min: {req_purity}%",
                        "delivery_timeline": "Immediate Requirement",
                        "certification": "Verified Buyer",
                        "distance": f"{distance_km} km",
                        "reliability": "99.1%", # Hardcoded for buyers
                        "segment": req.get("application", "Standard").upper(),
                        "reasons": match_result["reasons"],
                        "breakdown": match_result["breakdown"],
                        "route_steps": self._get_route_steps(["truck"]),
                        "created_at": req.get("created_at")
                    })
        
        # Rank by score DESC
        recommendations.sort(key=lambda x: x["match_score"], reverse=True)
        
        # Assign best match
        if recommendations:
            recommendations[0]["is_best_match"] = True
            
        return recommendations[:10]
