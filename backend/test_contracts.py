from app.repositories.marketplace_repository import MarketplaceRepository
repo = MarketplaceRepository()
res = repo.db.table("audit_contracts").select("*").limit(1).execute()
print("audit_contracts schema:", res.data[0].keys() if res.data else "Empty Table")
if not res.data:
    try:
        repo.db.table("audit_contracts").insert({"id":"00000000-0000-0000-0000-000000000000"}).execute()
    except Exception as e:
        print(str(e))
