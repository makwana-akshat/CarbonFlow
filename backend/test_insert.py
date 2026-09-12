from app.services.marketplace_service import MarketplaceService
import uuid

svc = MarketplaceService()
listing_id = svc.repo.db.table("co2_listings").select("id").limit(1).execute().data[0]["id"]
buyer_id = svc.repo.db.table("users").select("id").eq("role", "buyer").limit(1).execute().data[0]["id"]

data = {
    "buyer_id": buyer_id,
    "listing_id": listing_id,
    "volume_needed": 100,
    "delivery_method": "ISO Rail Tanker",
    "required_by_date": "2026-12-01",
    "application": "Test Notes",
    "title": "Inquiry Test",
    "required_grade": "Industrial",
    "target_price": 50.0,
    "min_purity_required": 95.0,
    "status": "pending"
}

try:
    res = svc.repo.db.table("co2_requests").insert(data).execute()
    print("Success:", res.data[0]["id"])
    svc.repo.db.table("co2_requests").delete().eq("id", res.data[0]["id"]).execute()
except Exception as e:
    print("Error:", str(e))
