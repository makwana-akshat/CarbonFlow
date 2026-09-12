import json
import uuid
import datetime
from supabase import create_client, Client
from app.core.config import settings

class MonitoringService:
    def __init__(self):
        self.db: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)
        self.FACILITY_WARNING_VARIANCE = 5   # Warning if output is 5% below expected
        self.FACILITY_CRITICAL_VARIANCE = 10 # Critical if output is 10% below expected

    def evaluate_facilities(self):
        # We need to simulate the captureOutput and expectedOutput since it's not in the DB directly.
        # We'll use random or static mock logic per facility based on its status for demo.
        res = self.db.table("facilities").select("*").execute()
        facilities = res.data

        for fac in facilities:
            expected_output = 95
            if fac["operational_status"] == "active":
                capture_output = 96
                variance = capture_output - expected_output
            elif fac["operational_status"] == "warning":
                capture_output = 88
                variance = capture_output - expected_output
            else:
                capture_output = 80
                variance = capture_output - expected_output

            if variance <= -self.FACILITY_CRITICAL_VARIANCE:
                self.generate_alert(
                    facility_id=fac["id"],
                    severity="critical",
                    title="CO₂ capture output critically below expected level",
                    desc_dict={
                        "currentMetric": f"{capture_output}%",
                        "expectedMetric": f"{expected_output}%",
                        "variance": f"{variance}%",
                        "operationalImpact": "High impact on delivery obligations",
                        "recommendedAction": "Investigate capture unit diagnostics",
                        "actionType": "investigate",
                        "actionLabel": "View diagnostics"
                    }
                )
            elif variance <= -self.FACILITY_WARNING_VARIANCE:
                self.generate_alert(
                    facility_id=fac["id"],
                    severity="warning",
                    title="CO₂ capture output below expected level",
                    desc_dict={
                        "currentMetric": f"{capture_output}%",
                        "expectedMetric": f"{expected_output}%",
                        "variance": f"{variance}%",
                        "operationalImpact": "Moderate impact on buffer storage",
                        "recommendedAction": "Monitor capture unit",
                        "actionType": "investigate",
                        "actionLabel": "View diagnostics"
                    }
                )

    def evaluate_shipments(self):
        res = self.db.table("shipments").select("*").execute()
        shipments = res.data
        now = datetime.datetime.now(datetime.timezone.utc)

        for shp in shipments:
            if not shp.get("eta"):
                continue
            
            try:
                eta = datetime.datetime.fromisoformat(shp["eta"].replace("Z", "+00:00"))
            except ValueError:
                continue

            if shp["status"] != "delivered" and now > eta:
                # Update shipment status to delayed if not already
                if shp["status"] != "delayed":
                    self.db.table("shipments").update({"status": "delayed", "risk": "high"}).eq("id", shp["id"]).execute()
                
                self.generate_alert(
                    facility_id=None,
                    severity="warning",
                    title=f"Shipment {shp['shipment_ref']} is delayed",
                    desc_dict={
                        "currentMetric": "Delayed",
                        "expectedMetric": "On-Time",
                        "variance": "N/A",
                        "operationalImpact": "Delayed delivery to buyer",
                        "recommendedAction": "Contact carrier for ETA update",
                        "actionType": "view-route",
                        "actionLabel": "Track Shipment"
                    }
                )

    def generate_alert(self, facility_id, severity, title, desc_dict):
        # Deduplication check
        # Check if an unresolved alert with same title and facility_id exists
        query = self.db.table("alerts").select("id").eq("title", title).eq("is_resolved", False)
        if facility_id:
            query = query.eq("facility_id", facility_id)
        
        res = query.execute()
        if res.data and len(res.data) > 0:
            return # Alert already active
        
        # Insert new alert
        self.db.table("alerts").insert({
            "facility_id": facility_id,
            "severity": severity,
            "title": title,
            "description": json.dumps(desc_dict),
            "is_resolved": False
        }).execute()
        
    def get_active_alerts(self, clerk_user_id: str):
        # We run evaluation lazily here for demo purposes (API-triggered evaluation)
        self.evaluate_facilities()
        self.evaluate_shipments()

        response = self.db.table("alerts").select("*, facilities(name, region)").eq("is_resolved", False).order("created_at", desc=True).execute()
        alerts = []
        for a in response.data:
            extra = {}
            try:
                if a.get("description"):
                    extra = json.loads(a["description"])
            except:
                extra = {"description": a.get("description", "")}
            
            # calculate duration
            dt = datetime.datetime.fromisoformat(a["created_at"].replace("Z", "+00:00"))
            delta = datetime.datetime.now(datetime.timezone.utc) - dt
            mins = int(delta.total_seconds() / 60)
            
            # Fill default structure for frontend
            extra["detectedTime"] = f"{mins} minutes ago"
            extra["duration"] = f"{mins} minutes"
            
            alerts.append({
                "id": a["id"],
                "facility_id": a["facility_id"],
                "severity": a["severity"],
                "title": a["title"],
                "is_resolved": a["is_resolved"],
                "created_at": a["created_at"],
                "facilities": a.get("facilities"),
                "extra_fields": extra
            })
        return alerts

    def get_alert_history(self):
        response = self.db.table("alerts").select("*, facilities(name, region)").eq("is_resolved", True).order("created_at", desc=True).limit(20).execute()
        alerts = []
        for a in response.data:
            extra = {}
            try:
                if a.get("description"):
                    extra = json.loads(a["description"])
            except:
                pass
            alerts.append({
                "id": a["id"],
                "severity": a["severity"],
                "title": a["title"],
                "created_at": a["created_at"],
                "facilities": a.get("facilities"),
                "extra_fields": extra
            })
        return alerts

    def get_alert_summary(self):
        # Active counts
        res = self.db.table("alerts").select("severity", count="exact").eq("is_resolved", False).execute()
        critical = sum(1 for a in res.data if a["severity"] == "critical")
        warnings = sum(1 for a in res.data if a["severity"] == "warning")
        
        # Resolved today
        today = datetime.datetime.now(datetime.timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0).isoformat()
        res_resolved = self.db.table("alerts").select("id", count="exact").eq("is_resolved", True).gte("created_at", today).execute()
        
        return {
            "critical": critical,
            "warnings": warnings,
            "active": len(res.data),
            "resolvedToday": len(res_resolved.data)
        }

    def acknowledge_alert(self, alert_id: str):
        # We just update extra_fields in description
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

    def get_facilities_monitoring(self):
        res = self.db.table("facilities").select("*").execute()
        results = []
        for fac in res.data:
            expected_output = 95
            if fac["operational_status"] == "active":
                capture_output = 96
            elif fac["operational_status"] == "warning":
                capture_output = 88
            else:
                capture_output = 80
            
            results.append({
                "id": fac["id"],
                "facility": fac["name"],
                "region": fac["region"],
                "captureOutput": capture_output,
                "expectedOutput": expected_output,
                "status": fac["operational_status"],
                "lastUpdate": "Just now",
                "designCapacity": "100k tpa"
            })
        return results

    def get_shipments_monitoring(self):
        res = self.db.table("shipments").select("*").execute()
        results = []
        for shp in res.data:
            results.append({
                "id": shp["id"],
                "shipmentId": shp["shipment_ref"],
                "route": shp["route_label"],
                "origin": shp["origin"],
                "destination": shp["destination"],
                "mode": shp["transport_mode"],
                "eta": shp["eta"],
                "status": shp["status"],
                "risk": shp["risk"],
                "volume": shp.get("volume", "0 t"),
                "carrier": shp.get("carrier", "Unknown")
            })
        return results
