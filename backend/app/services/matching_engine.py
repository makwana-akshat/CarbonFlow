import math
from typing import Dict, Any, List

class MatchingEngine:
    """
    Deterministic baseline recommendation scoring engine.
    This serves as the foundational feature engineering and scoring step
    before a true ML model is implemented.
    """
    
    # Constants for weights
    WEIGHTS = {
        "purity": 0.25,
        "price": 0.20,
        "distance": 0.20,
        "quantity": 0.15,
        "segment": 0.10,
        "reliability": 0.10,
    }

    @staticmethod
    def _haversine(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        """Calculate the great circle distance in kilometers between two points on the earth."""
        if lat1 is None or lon1 is None or lat2 is None or lon2 is None:
            return 0.0
            
        R = 6371.0
        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)
        a = (math.sin(dlat / 2) ** 2 +
             math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2) ** 2)
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        return R * c

    def calculate_match(self, supply: Dict[str, Any], demand: Dict[str, Any]) -> Dict[str, Any]:
        """
        Calculates a deterministic match score and provides a breakdown.
        
        Args:
            supply: Dictionary of the supply listing
            demand: Dictionary of the buyer's requirement
        
        Returns:
            Dictionary containing final score, breakdown, reasons, and derived features (like distance).
        """
        reasons = []
        
        # 1. Chemical Purity (25%)
        # Exact match = 80 pts, extra purity = bonus points up to 100
        supply_purity = float(supply.get("purity_percentage") or 0)
        req_purity = float(demand.get("min_purity_required") or 0)
        
        if supply_purity < req_purity:
            return {"is_match": False} # Hard constraint failed
            
        purity_diff = supply_purity - req_purity
        p_score = min(100.0, 80.0 + (purity_diff * 10))
        
        if supply_purity > req_purity:
            reasons.append(f"Purity is {supply_purity}% (exceeds {req_purity}% minimum requirement).")
        else:
            reasons.append(f"Meets exact purity requirement of {req_purity}%.")

        # 2. Economic / Price (20%)
        # Exact match = 80 pts. Every 1% cheaper = +2 pts. Max 100. Over budget drops score.
        supply_price = float(supply.get("price_per_ton") or 0)
        req_price = float(demand.get("target_price") or 0)
        
        if req_price > 0 and supply_price > req_price:
            return {"is_match": False} # Hard constraint failed (strict budget)
            
        pr_score = 100.0
        if req_price > 0:
            price_diff_pct = ((req_price - supply_price) / req_price) * 100
            pr_score = min(100.0, 80.0 + (price_diff_pct * 2))
            if supply_price < req_price:
                reasons.append(f"Unit price of ₹{supply_price:,.0f}/t is {price_diff_pct:.1f}% below target budget.")
            else:
                reasons.append(f"Unit price exactly matches target budget of ₹{req_price:,.0f}/t.")

        # 3. Logistics / Distance (20%)
        # 0 km = 100 pts. Drops 1 pt every 10 km.
        distance_km = self._haversine(
            supply.get("latitude"), supply.get("longitude"),
            demand.get("latitude"), demand.get("longitude")
        )
        
        dist_score = max(0.0, 100.0 - (distance_km / 10.0)) if distance_km > 0 else 80.0
        
        if distance_km > 0:
            reasons.append(f"Located {distance_km:.0f} km from delivery site.")

        # 4. Quantity / Volume (15%)
        # Capable of full fulfillment = 100. Partial = prorated.
        supply_vol = float(supply.get("volume_tpa") or 0)
        req_vol = float(demand.get("volume_needed") or 0)
        
        q_score = 100.0 if supply_vol >= req_vol else (supply_vol / max(req_vol, 1)) * 100.0
        if supply_vol >= req_vol:
            reasons.append(f"Can fulfill entire {req_vol:,.0f} t requested volume.")
        else:
            reasons.append(f"Can partially fulfill request ({supply_vol:,.0f} t available).")
            
        # 5. Segment Alignment (10%)
        # e.g. DAC, Biogenic, Industrial. 
        supply_source = (supply.get("source_type") or "").lower()
        req_app = (demand.get("application") or "").lower()
        
        seg_score = 100.0 if supply_source == req_app else 85.0
        if supply_source:
            reasons.append(f"Segment match: {supply.get('source_type', 'Standard')} verified.")

        # 6. Reliability Index (10%)
        # Using a deterministic baseline for this mock ML stage
        # e.g., verified users get 98-99%, unverified get ~85%
        is_verified = supply.get("is_verified", True)
        rel_score = 98.5 if is_verified else 85.0
        
        if is_verified:
            reasons.append("High historical reliability and custody transfer accuracy.")

        # Calculate Final Weighted Score
        final_score = (
            (p_score * self.WEIGHTS["purity"]) +
            (pr_score * self.WEIGHTS["price"]) +
            (dist_score * self.WEIGHTS["distance"]) +
            (q_score * self.WEIGHTS["quantity"]) +
            (seg_score * self.WEIGHTS["segment"]) +
            (rel_score * self.WEIGHTS["reliability"])
        )
        
        # Prevent edge cases
        if math.isnan(final_score): final_score = 0
        final_score = min(100.0, max(0.0, final_score))

        return {
            "is_match": True,
            "final_score": round(final_score, 1),
            "distance_km": round(distance_km, 0) if distance_km > 0 else 0,
            "reliability_pct": rel_score,
            "segment_name": supply.get("source_type", "Industrial"),
            "reasons": reasons[:5], # Keep max 5 reasons for UI fit
            "breakdown": {
                "purity": round(p_score),
                "price": round(pr_score),
                "distance": round(dist_score),
                "reliability": round(rel_score),
                "segmentFit": round(seg_score)
            }
        }
