from app.core.config import settings
from supabase import create_client, Client
from app.repositories.user_repository import UserRepository

import uuid
from decimal import Decimal

MATCH_WEIGHTS = {
    "purity": 0.40,
    "price": 0.40,
    "quantity": 0.20,
}

class RecommendationService:
    def __init__(self):
        self.db: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)
        self.user_repo = UserRepository()

    def _get_company_name(self, user_dict):
        # Gracefully handle the fact that company_name might be named differently
        if not user_dict: return "Unknown Company"
        return user_dict.get("company_name") or user_dict.get("organisation") or "Unknown Company"

    def get_recommendations_for_user(self, clerk_user_id: str, role: str):
        user = self.user_repo.get_user_by_clerk_id(clerk_user_id)
        if not user:
            return []
            
        user_id = user["id"]
        recommendations = []
        
        if role == "buyer":
            # Fetch all active requests for this buyer
            reqs_resp = self.db.table("co2_requests").select("*").eq("buyer_id", user_id).eq("status", "active").execute()
            reqs = reqs_resp.data if reqs_resp else []
            if not reqs:
                return []
                
            # Fetch all active listings platform-wide
            listings_resp = self.db.table("co2_listings").select("*, supplier:supplier_id(company_name, organisation)").eq("status", "active").execute()
            listings = listings_resp.data if listings_resp else []
            
            for req in reqs:
                for lst in listings:
                    # Hard constraints
                    listing_purity = float(lst.get("purity_percentage") or 0)
                    req_purity = float(req.get("min_purity_required") or 0)
                    if listing_purity < req_purity:
                        continue
                        
                    listing_price = float(lst.get("price_per_ton") or 0)
                    req_price = float(req.get("target_price") or 0)
                    if req_price > 0 and listing_price > req_price:
                        continue
                        
                    listing_vol = float(lst.get("volume_tpa") or 0)
                    req_vol = float(req.get("volume_needed") or 0)
                    if listing_vol <= 0:
                        continue
                        
                    # Calculate Score
                    # Purity score (40%)
                    # Exact match = 50 pts, +1 pt per 0.1% over requirement, capped at 100
                    purity_diff = listing_purity - req_purity
                    p_score = min(100, 50 + (purity_diff * 10))
                    
                    # Price score (40%)
                    # Exact match = 50 pts. Every 1% cheaper = +2.5 pts. Capped at 100
                    if req_price > 0:
                        price_diff_pct = ((req_price - listing_price) / req_price) * 100
                        pr_score = min(100, 50 + (price_diff_pct * 2.5))
                    else:
                        pr_score = 100
                        
                    # Quantity score (20%)
                    # Full fulfillment = 100 pts. Partial = prorated
                    q_score = 100 if listing_vol >= req_vol else (listing_vol / req_vol) * 100
                    
                    total_score = (p_score * MATCH_WEIGHTS["purity"]) + (pr_score * MATCH_WEIGHTS["price"]) + (q_score * MATCH_WEIGHTS["quantity"])
                    total_score = min(100, max(0, total_score))
                    
                    tags = []
                    if listing_purity >= 99.0: tags.append("High Purity")
                    if listing_price < req_price: tags.append("Under Budget")
                    if listing_vol >= req_vol: tags.append("Full Fulfillment")
                    
                    explanations = []
                    if listing_purity > req_purity:
                        explanations.append(f"Purity is {listing_purity}% (exceeds requirement by {purity_diff:.1f}%)")
                    if listing_price < req_price:
                        explanations.append(f"Price is ₹{req_price - listing_price:,.0f} below target")
                        
                    supplier_data = lst.get("supplier", {})
                    company_name = self._get_company_name(supplier_data)
                    
                    recommendations.append({
                        "id": str(uuid.uuid4()),
                        "user_id": user_id,
                        "user_role": "buyer",
                        "listing_id": lst["id"],
                        "requirement_id": req["id"],
                        "company_name": company_name,
                        "facility_type": lst.get("facility_name") or "Capture Facility",
                        "match_score": Decimal(str(round(total_score, 1))),
                        "is_best_match": False,
                        "is_verified": True,
                        "tags": tags,
                        "co2_grade": lst.get("co2_grade"),
                        "volume": f"{listing_vol:,.0f} t",
                        "price_per_ton": f"₹{listing_price:,.0f}/t",
                        "purity": f"{listing_purity}%",
                        "created_at": lst.get("created_at")
                    })
                    
        elif role == "supplier":
            # Fetch all active listings for this supplier
            listings_resp = self.db.table("co2_listings").select("*").eq("supplier_id", user_id).eq("status", "active").execute()
            listings = listings_resp.data if listings_resp else []
            if not listings:
                return []
                
            # Fetch all active requests platform-wide
            reqs_resp = self.db.table("co2_requests").select("*, buyer:buyer_id(company_name, organisation)").eq("status", "active").execute()
            reqs = reqs_resp.data if reqs_resp else []
            
            for lst in listings:
                for req in reqs:
                    # Hard constraints
                    listing_purity = float(lst.get("purity_percentage") or 0)
                    req_purity = float(req.get("min_purity_required") or 0)
                    if listing_purity < req_purity:
                        continue
                        
                    listing_price = float(lst.get("price_per_ton") or 0)
                    req_price = float(req.get("target_price") or 0)
                    if req_price > 0 and listing_price > req_price:
                        continue
                        
                    listing_vol = float(lst.get("volume_tpa") or 0)
                    req_vol = float(req.get("volume_needed") or 0)
                    if req_vol <= 0:
                        continue
                        
                    # Calculate Score
                    purity_diff = listing_purity - req_purity
                    p_score = min(100, 50 + (purity_diff * 10))
                    
                    if req_price > 0:
                        price_diff_pct = ((req_price - listing_price) / req_price) * 100
                        pr_score = min(100, 50 + (price_diff_pct * 2.5))
                    else:
                        pr_score = 100
                        
                    q_score = 100 if listing_vol >= req_vol else (listing_vol / req_vol) * 100
                    
                    total_score = (p_score * MATCH_WEIGHTS["purity"]) + (pr_score * MATCH_WEIGHTS["price"]) + (q_score * MATCH_WEIGHTS["quantity"])
                    total_score = min(100, max(0, total_score))
                    
                    tags = []
                    if listing_vol >= req_vol: tags.append("Can Fulfill")
                    if listing_price <= req_price: tags.append("Price Match")
                    
                    buyer_data = req.get("buyer", {})
                    company_name = self._get_company_name(buyer_data)
                    
                    recommendations.append({
                        "id": str(uuid.uuid4()),
                        "user_id": user_id,
                        "user_role": "supplier",
                        "listing_id": lst["id"],
                        "requirement_id": req["id"],
                        "company_name": company_name,
                        "facility_type": req.get("application") or "Industrial",
                        "match_score": Decimal(str(round(total_score, 1))),
                        "is_best_match": False,
                        "is_verified": True,
                        "tags": tags,
                        "co2_grade": req.get("required_grade"),
                        "volume": f"{req_vol:,.0f} t",
                        "price_per_ton": f"Target: ₹{req_price:,.0f}/t",
                        "purity": f"Min: {req_purity}%",
                        "created_at": req.get("created_at")
                    })
        
        # Rank by score DESC
        recommendations.sort(key=lambda x: x["match_score"], reverse=True)
        
        # Apply tie-breaker explicitly by putting newest created first if scores tie
        # But for simplicity, the sort above is stable, we just need the highest score to be Best Match
        if recommendations:
            recommendations[0]["is_best_match"] = True
            
        return recommendations[:10]
