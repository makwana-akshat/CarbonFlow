from app.services.marketplace_service import MarketplaceService
svc = MarketplaceService()
res = svc.repo.db.table("co2_requests").select("*").limit(1).execute()
# Actually we can't query information_schema easily via rest API. We can just try to insert a minimal row and catch the error.
try:
    res = svc.repo.db.table("co2_requests").insert({"buyer_id": "00000000-0000-0000-0000-000000000000", "volume_needed": 100, "listing_id": "00000000-0000-0000-0000-000000000000"}).execute()
except Exception as e:
    print(str(e))
