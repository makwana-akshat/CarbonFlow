from app.repositories.marketplace_repository import MarketplaceRepository
repo = MarketplaceRepository()
res = repo.db.table("users").select("*").limit(1).execute()
print("users schema:", res.data[0].keys() if res.data else "Empty")
