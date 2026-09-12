import json
import uuid
import datetime
from supabase import create_client, Client
from app.core.config import settings

class MonitoringService:
    def __init__(self):
        self.db: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)

    def _get_user_context(self, clerk_user_id: str):
        res = self.db.table("users").select("id, role").eq("clerk_user_id", clerk_user_id).execute()
        if not res.data:
            return None, "buyer"
        return res.data[0]["id"], res.data[0]["role"]

    def get_active_alerts(self, clerk_user_id: str, severity: str = "all", time_window: str = "24h"):
        user_id, role = self._get_user_context(clerk_user_id)
        
        query = self.db.table("alerts").select("*, facilities(name, region, owner_id)").eq("is_resolved", False)
        
        if severity and severity != "all":
            query = query.eq("severity", severity)
            
        if time_window == "24h":
            yesterday = (datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(days=1)).isoformat()
            query = query.gte("created_at", yesterday)
        elif time_window == "7d":
            last_week = (datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(days=7)).isoformat()
            query = query.gte("created_at", last_week)
            
        response = query.order("created_at", desc=True).execute()
        
        alerts = []
        for a in response.data:
            # Authorization filtering
            fac = a.get("facilities") or {}
            if role == "supplier" and fac.get("owner_id") != user_id:
                continue # Skip alerts for facilities not owned by supplier
                
            extra = {}
            try:
                if a.get("description"):
                    extra = json.loads(a["description"])
            except:
                extra = {"description": a.get("description", "")}
            
            # calculate duration
            try:
                dt = datetime.datetime.fromisoformat(a["created_at"].replace("Z", "+00:00"))
                delta = datetime.datetime.now(datetime.timezone.utc) - dt
                mins = int(delta.total_seconds() / 60)
                extra["detectedTime"] = f"{mins} minutes ago"
                extra["duration"] = f"{mins} minutes"
            except:
                pass
            
            alerts.append({
                "id": str(a["id"]),
                "facility_id": a["facility_id"],
                "severity": a["severity"],
                "title": a["title"],
                "is_resolved": a["is_resolved"],
                "created_at": a["created_at"],
                "facilities": fac,
                "extra_fields": extra
            })
        return alerts

    def get_alert_history(self, clerk_user_id: str):
        user_id, role = self._get_user_context(clerk_user_id)
        response = self.db.table("alerts").select("*, facilities(name, region, owner_id)").eq("is_resolved", True).order("created_at", desc=True).limit(50).execute()
        
        alerts = []
        for a in response.data:
            fac = a.get("facilities") or {}
            if role == "supplier" and fac.get("owner_id") != user_id:
                continue
                
            extra = {}
            try:
                if a.get("description"):
                    extra = json.loads(a["description"])
            except:
                pass
            alerts.append({
                "id": str(a["id"]),
                "severity": a["severity"],
                "title": a["title"],
                "created_at": a["created_at"],
                "facilities": fac,
                "extra_fields": extra
            })
        return alerts

    def get_alert_summary(self, clerk_user_id: str):
        user_id, role = self._get_user_context(clerk_user_id)
        res = self.db.table("alerts").select("id, severity, facilities(owner_id)").eq("is_resolved", False).execute()
        
        critical = 0
        warnings = 0
        active = 0
        for a in res.data:
            fac = a.get("facilities") or {}
            if role == "supplier" and fac.get("owner_id") != user_id:
                continue
            active += 1
            if a["severity"] == "critical":
                critical += 1
            elif a["severity"] == "warning":
                warnings += 1
        
        today = datetime.datetime.now(datetime.timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0).isoformat()
        res_resolved = self.db.table("alerts").select("id, facilities(owner_id)").eq("is_resolved", True).gte("created_at", today).execute()
        
        resolved_today = 0
        for a in res_resolved.data:
            fac = a.get("facilities") or {}
            if role == "supplier" and fac.get("owner_id") != user_id:
                continue
            resolved_today += 1
            
        return {
            "critical": critical,
            "warnings": warnings,
            "active": active,
            "resolvedToday": resolved_today
        }

    def acknowledge_alert(self, alert_id: str):
        alert = self.db.table("alerts").select("*").eq("id", alert_id).execute()
        if not alert.data:
            raise Exception("Alert not found")
        
        a = alert.data[0]
        extra = {}
        try:
            extra = json.loads(a.get("description", "{}"))
        except:
            pass
        extra["acknowledged"] = True
        
        self.db.table("alerts").update({"description": json.dumps(extra)}).eq("id", alert_id).execute()
        return True

    def resolve_alert(self, alert_id: str, resolved_by: str, resolution_note: str):
        alert = self.db.table("alerts").select("*").eq("id", alert_id).execute()
        if not alert.data:
            raise Exception("Alert not found")
        
        a = alert.data[0]
        extra = {}
        try:
            extra = json.loads(a.get("description", "{}"))
        except:
            pass
        
        extra["resolved_by"] = resolved_by
        extra["resolution_note"] = resolution_note
        extra["resolved_time"] = datetime.datetime.now(datetime.timezone.utc).isoformat()
        
        self.db.table("alerts").update({
            "is_resolved": True,
            "description": json.dumps(extra)
        }).eq("id", alert_id).execute()
        return True

    def get_facilities_monitoring(self, clerk_user_id: str):
        user_id, role = self._get_user_context(clerk_user_id)
        query = self.db.table("facilities").select("*")
        if role == "supplier":
            query = query.eq("owner_id", user_id)
        res = query.execute()
        
        results = []
        for fac in res.data:
            results.append({
                "id": str(fac["id"]),
                "facility": fac["name"],
                "region": fac["region"],
                "captureOutput": fac.get("capture_output"),
                "expectedOutput": fac.get("expected_output"),
                "status": fac["operational_status"],
                "lastUpdate": "Just now",
                "designCapacity": fac.get("design_capacity")
            })
        return results

    def get_shipments_monitoring(self, clerk_user_id: str):
        user_id, role = self._get_user_context(clerk_user_id)
        query = self.db.table("shipments").select("*, orders(buyer_id, supplier_id)")
        res = query.execute()
        
        results = []
        for shp in res.data:
            ordr = shp.get("orders") or {}
            if role == "buyer" and ordr.get("buyer_id") != user_id:
                continue
            if role == "supplier" and ordr.get("supplier_id") != user_id:
                continue
                
            results.append({
                "id": str(shp["id"]),
                "shipmentId": shp["shipment_ref"],
                "route": shp.get("route_label"),
                "origin": shp["origin"],
                "destination": shp["destination"],
                "mode": shp["transport_mode"],
                "eta": shp.get("eta"),
                "status": shp["status"],
                "risk": shp["risk"],
                "volume": shp.get("volume"),
                "carrier": shp.get("carrier")
            })
        return results

    def get_operations_health_index(self, clerk_user_id: str):
        user_id, role = self._get_user_context(clerk_user_id)
        
        fac_res = self.db.table("facilities").select("operational_status, owner_id").execute()
        fac_total = 0
        fac_counts = {"active": 0, "warning": 0, "critical": 0}
        
        shp_res = self.db.table("shipments").select("status, risk, orders(buyer_id, supplier_id)").execute()
        shp_total = 0
        shp_counts = {"in-transit": 0, "delayed": 0, "at-risk": 0, "delivered": 0}
        
        ord_res = self.db.table("orders").select("status, buyer_id, supplier_id").execute()
        ord_total = 0
        ord_counts = {"pending": 0, "active": 0, "completed": 0, "cancelled": 0}
        
        sup_res = self.db.table("co2_listings").select("status, supplier_id").execute()
        sup_total = 0
        sup_counts = {"active": 0, "draft": 0, "fulfilled": 0, "cancelled": 0}
        
        for f in fac_res.data:
            if role == "supplier" and f.get("owner_id") != user_id:
                continue
            fac_total += 1
            st = f.get("operational_status", "active")
            fac_counts[st] = fac_counts.get(st, 0) + 1
            
        for s in shp_res.data:
            ordr = s.get("orders") or {}
            if role == "buyer" and ordr.get("buyer_id") != user_id:
                continue
            if role == "supplier" and ordr.get("supplier_id") != user_id:
                continue
            shp_total += 1
            st = s.get("status", "in-transit")
            shp_counts[st] = shp_counts.get(st, 0) + 1
            
        for o in ord_res.data:
            if role == "buyer" and o.get("buyer_id") != user_id:
                continue
            if role == "supplier" and o.get("supplier_id") != user_id:
                continue
            ord_total += 1
            st = o.get("status", "pending")
            ord_counts[st] = ord_counts.get(st, 0) + 1
            
        for sp in sup_res.data:
            if role == "supplier" and sp.get("supplier_id") != user_id:
                continue
            sup_total += 1
            st = sp.get("status", "active")
            sup_counts[st] = sup_counts.get(st, 0) + 1
            
        return {
            "categories": [
                {
                    "category": "Facilities",
                    "total": fac_total,
                    "breakdown": [
                        {"label": "Normal", "count": fac_counts.get("active", 0), "color": "#10B981"},
                        {"label": "Warning", "count": fac_counts.get("warning", 0), "color": "#F59E0B"},
                        {"label": "Critical", "count": fac_counts.get("critical", 0), "color": "#EF4444"}
                    ]
                },
                {
                    "category": "Transport",
                    "total": shp_total,
                    "breakdown": [
                        {"label": "Normal", "count": shp_counts.get("in-transit", 0) + shp_counts.get("delivered", 0), "color": "#10B981"},
                        {"label": "Delayed", "count": shp_counts.get("delayed", 0), "color": "#F59E0B"},
                        {"label": "Disrupted", "count": shp_counts.get("at-risk", 0), "color": "#EF4444"}
                    ]
                },
                {
                    "category": "Supply",
                    "total": sup_total,
                    "breakdown": [
                        {"label": "Stable", "count": sup_counts.get("active", 0), "color": "#10B981"},
                        {"label": "At Risk", "count": sup_counts.get("fulfilled", 0), "color": "#F59E0B"},
                        {"label": "Critical", "count": sup_counts.get("cancelled", 0), "color": "#EF4444"}
                    ]
                },
                {
                    "category": "Orders",
                    "total": ord_total,
                    "breakdown": [
                        {"label": "On Track", "count": ord_counts.get("active", 0) + ord_counts.get("completed", 0), "color": "#10B981"},
                        {"label": "At Risk", "count": ord_counts.get("pending", 0), "color": "#F59E0B"},
                        {"label": "Delayed", "count": ord_counts.get("cancelled", 0), "color": "#EF4444"}
                    ]
                }
            ]
        }
