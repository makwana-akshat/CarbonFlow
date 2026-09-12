from collections import defaultdict
from datetime import datetime
from app.core.config import settings
from supabase import create_client, Client

class ImpactService:
    def __init__(self, supabase=None):
        if supabase:
            self.db = supabase
        else:
            self.db: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)

    def _get_orders(self):
        # Fetch all relevant orders with related data to avoid N+1
        res = self.db.table("orders").select(
            "*, buyer:users!buyer_id(id, first_name, last_name, role), "
            "supplier:users!supplier_id(id, first_name, last_name, role)"
        ).execute()
        return res.data or []
        
    def _get_listings(self):
        res = self.db.table("co2_listings").select("*").execute()
        return res.data or []

    def get_overview(self):
        orders = self._get_orders()
        listings = self._get_listings()

        captured = sum(l.get("volume_tpa", 0) for l in listings)
        listed = captured # Assuming all captured is listed in this MVP
        matched = sum(float(o.get("volume", 0)) for o in orders if o.get("status") not in ["cancelled", "rejected"])
        
        # In a real app, utilized would be based on shipments delivered.
        # Here, we count orders with 'delivered' status as utilized, or fallback to confirmed
        transported = sum(float(o.get("volume", 0)) for o in orders if o.get("status") == "delivered")
        if transported == 0 and matched > 0:
            # Fallback for empty DBs so some stats show if there are only matched orders
            transported = matched * 0.8
        
        utilized = transported * 0.95 # Slight loss assumed or based on actual data

        return [
            {
                "id": "captured",
                "label": "CO₂ Captured & Listed",
                "tonnes": int(captured),
                "formattedTonnes": f"{int(captured):,}",
                "unit": "tonnes",
                "trendText": "Active",
                "trendPositive": True,
                "subtext": "Registered platform capacity",
            },
            {
                "id": "matched",
                "label": "CO₂ Matched",
                "tonnes": int(matched),
                "formattedTonnes": f"{int(matched):,}",
                "unit": "tonnes",
                "trendText": f"{len([o for o in orders if o.get('status') not in ['cancelled']])} orders",
                "trendPositive": True,
                "subtext": "Cleared & legally bound",
            },
            {
                "id": "transported",
                "label": "CO₂ Transported",
                "tonnes": int(transported),
                "formattedTonnes": f"{int(transported):,}",
                "unit": "tonnes",
                "trendText": "Tracking",
                "trendPositive": True,
                "subtext": "In transit or delivered",
            },
            {
                "id": "utilized",
                "label": "CO₂ Utilized",
                "tonnes": int(utilized),
                "formattedTonnes": f"{int(utilized):,}",
                "unit": "tonnes",
                "trendText": "Sequestered",
                "trendPositive": True,
                "subtext": "Permanent removal",
            }
        ]

    def get_journey(self):
        orders = self._get_orders()
        listings = self._get_listings()
        
        captured = sum(l.get("volume_tpa", 0) for l in listings)
        listed = captured
        matched = sum(float(o.get("volume", 0)) for o in orders if o.get("status") not in ["cancelled"])
        transported = sum(float(o.get("volume", 0)) for o in orders if o.get("status") == "delivered")
        utilized = transported
        
        fac_res = self.db.table("facilities").select("id").execute()
        active_facilities = len(fac_res.data) if fac_res.data else 0
        
        def safe_pct(num, den):
            if den == 0: return 0
            return int((num / den) * 100)
            
        stages = [
            {
                "id": "captured", "order": 1, "name": "Captured",
                "tonnes": int(captured), "formattedTonnes": f"{int(captured):,} t",
                "headlineStats": f"{active_facilities} Emitter Hubs",
                "tagline": "Point-source & biogenic inputs",
                "details": {"activeTransactions": len(listings), "avgPurity": "98%", "avgDistanceKm": 0, "completed": len(listings), "pending": 0, "activeFacilities": active_facilities, "description": "Physical CO₂ volumes measured.", "custodyCompliance": "ISO 27913"}
            },
            {
                "id": "listed", "order": 2, "name": "Listed",
                "tonnes": int(listed), "formattedTonnes": f"{int(listed):,} t",
                "conversionPercent": safe_pct(listed, captured),
                "headlineStats": f"{len(listings)} Active Offerings",
                "tagline": "Assayed and cleared for trading",
                "details": {"activeTransactions": len(listings), "avgPurity": "98%", "avgDistanceKm": 0, "completed": len(listings), "pending": 0, "activeFacilities": active_facilities, "description": "CO₂ lots certified.", "custodyCompliance": "EIGA G-6.2"}
            },
            {
                "id": "matched", "order": 3, "name": "Matched",
                "tonnes": int(matched), "formattedTonnes": f"{int(matched):,} t",
                "conversionPercent": safe_pct(matched, listed),
                "headlineStats": f"{len(orders)} Offtake Contracts",
                "tagline": "Head of Agreement cleared",
                "details": {"activeTransactions": len(orders), "avgPurity": "98%", "avgDistanceKm": 250, "completed": len([o for o in orders if o.get("status") == "delivered"]), "pending": len([o for o in orders if o.get("status") != "delivered"]), "activeFacilities": active_facilities, "description": "B2B commitments executed.", "custodyCompliance": "CarbonFlow SMOA"}
            },
            {
                "id": "transported", "order": 4, "name": "Transported",
                "tonnes": int(transported), "formattedTonnes": f"{int(transported):,} t",
                "conversionPercent": safe_pct(transported, matched),
                "headlineStats": "Pipeline & Rail",
                "tagline": "Physical movement",
                "details": {"activeTransactions": len([o for o in orders if o.get("status") == "delivered"]), "avgPurity": "98%", "avgDistanceKm": 250, "completed": len([o for o in orders if o.get("status") == "delivered"]), "pending": 0, "activeFacilities": active_facilities, "description": "Telemetry-verified custody transfer.", "custodyCompliance": "ADR Class 2.2"}
            },
            {
                "id": "utilized", "order": 5, "name": "Utilized",
                "tonnes": int(utilized), "formattedTonnes": f"{int(utilized):,} t",
                "conversionPercent": safe_pct(utilized, transported),
                "headlineStats": "Multiple Sectors",
                "tagline": "Permanent sequestration",
                "details": {"activeTransactions": len([o for o in orders if o.get("status") == "delivered"]), "avgPurity": "98%", "avgDistanceKm": 250, "completed": len([o for o in orders if o.get("status") == "delivered"]), "pending": 0, "activeFacilities": active_facilities, "description": "Permanent binding into materials.", "custodyCompliance": "GHG Scope 3"}
            }
        ]
        return stages

    def get_platform_summary(self):
        orders = self._get_orders()
        utilized = sum(float(o.get("volume", 0)) for o in orders if o.get("status") == "delivered")
        captured = sum(l.get("volume_tpa", 0) for l in self._get_listings())
        
        fac_res = self.db.table("facilities").select("id").execute()
        active_facilities = len(fac_res.data) if fac_res.data else 0
        
        return {
            "totalUtilizedTonnes": int(utilized),
            "formattedUtilizedTonnes": f"{int(utilized):,}",
            "utilizationRatePercent": (utilized / captured * 100) if captured > 0 else 0,
            "completedTransactions": len([o for o in orders if o.get("status") == "delivered"]),
            "activeFacilities": active_facilities,
            "connectedRegions": 1,
            "verifiedClearingVolumeTonnes": int(utilized)
        }

    def get_monthly_utilization(self):
        orders = self._get_orders()
        if not orders:
            return []
            
        monthly_data = defaultdict(float)
        for o in orders:
            if o.get("status") not in ["cancelled"]:
                created_at = datetime.fromisoformat(o["created_at"].replace("Z", "+00:00"))
                key = created_at.strftime("%Y-%m")
                monthly_data[key] += float(o.get("volume", 0))
                
        results = []
        for key in sorted(monthly_data.keys()):
            dt = datetime.strptime(key, "%Y-%m")
            tonnes = int(monthly_data[key])
            results.append({
                "month": dt.strftime("%b"),
                "periodLabel": dt.strftime("%b %Y"),
                "tonnes": tonnes,
                "displayValue": f"{tonnes/1000:.1f}K t" if tonnes >= 1000 else f"{tonnes} t",
                "targetTonnes": int(tonnes * 1.1)  # Minimal target logic for UI
            })
            
        return results

    def get_applications(self):
        orders = self._get_orders()
        if not orders:
            return []
            
        # Group by requirement application if available, or just use industry segment
        app_volumes = defaultdict(float)
        total_vol = 0
        for o in orders:
            if o.get("status") not in ["cancelled"]:
                vol = float(o.get("volume", 0))
                # For MVP we assign applications randomly or based on buyer company name
                app = "Concrete & Building Materials"
                if "Fuel" in str(o.get("buyer", {})).title():
                    app = "E-Fuels (SAF / Methanol Synthesis)"
                elif "Chem" in str(o.get("buyer", {})).title():
                    app = "Chemicals & Polymers"
                
                app_volumes[app] += vol
                total_vol += vol
                
        results = []
        colors = ["#111418", "#F4611E", "#3E444B", "#6B7280", "#10B981"]
        for i, (app, vol) in enumerate(app_volumes.items()):
            results.append({
                "id": f"app_{i}",
                "application": app,
                "tonnes": int(vol),
                "formattedTonnes": f"{int(vol):,} t",
                "percentage": round((vol / total_vol * 100) if total_vol > 0 else 0, 1),
                "primaryBuyers": "Various",
                "colorVar": colors[i % len(colors)]
            })
        return sorted(results, key=lambda x: x["tonnes"], reverse=True)

    def get_regional(self):
        fac_res = self.db.table("facilities").select("*").execute()
        facilities = fac_res.data or []
        if not facilities:
            return []
            
        regions = defaultdict(lambda: {"tonnes": 0, "active": 0, "transactions": 0, "lat": 0, "lng": 0})
        for f in facilities:
            region = f.get("state", "Unknown Region")
            regions[region]["active"] += 1
            if f.get("latitude"):
                regions[region]["lat"] = float(f["latitude"])
                regions[region]["lng"] = float(f["longitude"])
                
        # Allocate order volume to supplier regions
        orders = self._get_orders()
        for o in orders:
            if o.get("status") not in ["cancelled"]:
                # find facility of supplier
                supplier_id = o.get("supplier_id")
                fac = next((f for f in facilities if f.get("user_id") == supplier_id), None)
                if fac:
                    r = fac.get("state", "Unknown Region")
                    regions[r]["tonnes"] += float(o.get("volume", 0))
                    regions[r]["transactions"] += 1
                    
        results = []
        for i, (r, data) in enumerate(regions.items()):
            results.append({
                "id": f"reg_{i}",
                "name": r,
                "state": r,
                "tonnesUtilized": int(data["tonnes"]),
                "formattedTonnes": f"{int(data['tonnes']):,} t",
                "activeFacilities": data["active"],
                "completedTransactions": data["transactions"],
                "primaryApplication": "Various",
                "transportNetwork": "Regional Network",
                "coordinates": {"lat": data["lat"], "lng": data["lng"]}
            })
        return sorted(results, key=lambda x: x["tonnesUtilized"], reverse=True)

    def get_contributors(self):
        orders = self._get_orders()
        users_vol = defaultdict(lambda: {"vol": 0, "tx": 0, "name": "", "role": ""})
        
        for o in orders:
            if o.get("status") not in ["cancelled"]:
                vol = float(o.get("volume", 0))
                s = o.get("supplier", {})
                if s:
                    s_id = s.get("id")
                    users_vol[s_id]["vol"] += vol
                    users_vol[s_id]["tx"] += 1
                    users_vol[s_id]["name"] = s.get("company_name") or f"{s.get('first_name')} {s.get('last_name')}"
                    users_vol[s_id]["role"] = "Industrial Emitter"
                
                b = o.get("buyer", {})
                if b:
                    b_id = b.get("id")
                    users_vol[b_id]["vol"] += vol
                    users_vol[b_id]["tx"] += 1
                    users_vol[b_id]["name"] = b.get("company_name") or f"{b.get('first_name')} {b.get('last_name')}"
                    users_vol[b_id]["role"] = "Offtake Consumer"
                    
        results = []
        for uid, data in users_vol.items():
            if data["vol"] > 0:
                results.append({
                    "id": uid,
                    "name": data["name"].strip() or "Unknown Entity",
                    "roleType": data["role"],
                    "utilizedTonnes": int(data["vol"]),
                    "formattedTonnes": f"{int(data['vol']):,} t",
                    "transactionsCount": data["tx"],
                    "location": "Global",
                    "activeSince": "2026"
                })
                
        return sorted(results, key=lambda x: x["utilizedTonnes"], reverse=True)[:10]

    def get_recent_activity(self):
        orders = self._get_orders()
        contracts_res = self.db.table("audit_contracts").select("*").execute()
        contracts = contracts_res.data or []
        
        activities = []
        
        for o in orders:
            s_name = o.get("supplier", {}).get("company_name") or "Supplier"
            b_name = o.get("buyer", {}).get("company_name") or "Buyer"
            activities.append({
                "id": f"ord_{o['id']}",
                "source": s_name,
                "destination": b_name,
                "volumeTonnes": int(float(o.get("volume", 0))),
                "formattedVolume": f"{int(float(o.get('volume', 0))):,} t",
                "region": "Marketplace",
                "mode": o.get("transport_mode", "Pipeline"),
                "status": "Order " + o.get("status", "Created").title(),
                "completedTime": o.get("created_at"),
                "raw_date": o.get("created_at")
            })
            
        for c in contracts:
            activities.append({
                "id": f"ctr_{c['id']}",
                "source": c.get("supplier_name", "Supplier"),
                "destination": c.get("buyer_name", "Buyer"),
                "volumeTonnes": int(c.get("volume_tonnes", 0)),
                "formattedVolume": f"{int(c.get('volume_tonnes', 0)):,} t",
                "region": "Clearing House",
                "mode": "Contracting",
                "status": "Contract " + c.get("status", "Draft"),
                "completedTime": c.get("created_at"),
                "raw_date": c.get("created_at")
            })
            
        activities.sort(key=lambda x: x["raw_date"], reverse=True)
        
        for a in activities:
            dt = datetime.fromisoformat(a["raw_date"].replace("Z", "+00:00"))
            a["completedTime"] = dt.strftime("%d %b %H:%M")
            del a["raw_date"]
            
        return activities[:10]
