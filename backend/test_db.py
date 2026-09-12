from app.services.marketplace_service import MarketplaceService
svc = MarketplaceService()
res = svc.repo.db.table("co2_requests").select("*").limit(1).execute()
print("co2_requests schema:", res.data[0].keys() if res.data else "Empty Table")
