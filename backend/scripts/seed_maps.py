import os
import uuid
from supabase import create_client, Client
url = os.environ.get("SUPABASE_URL", "https://fevpmtqmrqpclaeeiaoz.supabase.co")
key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZldnBtdHFtcnFwY2xhZWVpYW96Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTE0ODY4NSwiZXhwIjoyMTA0NzI0Njg1fQ.YOjOGHJ48Nxk5FIjFs_fTLEkLs7IgK0gFaKkpGEjNWs")
supabase: Client = create_client(url, key)

# Ensure there is a user to own these
user_res = supabase.table("users").select("id").limit(1).execute()
if not user_res.data:
    user_id = str(uuid.uuid4())
    supabase.table("users").insert({
        "id": user_id,
        "clerk_user_id": "test_clerk",
        "email": "test@carbonflow.com",
        "role": "supplier"
    }).execute()
else:
    user_id = user_res.data[0]["id"]

listings = [
    {
        "supplier_id": user_id,
        "facility_name": "ABC Cement Capture (Ahmedabad)",
        "co2_grade": "Industrial",
        "volume_tpa": 12500,
        "price_per_ton": 4500,
        "purity_percentage": 98.7,
        "transport_modes": ["Road", "Rail"],
        "status": "active"
    },
    {
        "supplier_id": user_id,
        "facility_name": "Tata Steel Cleantech (Surat)",
        "co2_grade": "Industrial",
        "volume_tpa": 22000,
        "price_per_ton": 4200,
        "purity_percentage": 97.2,
        "transport_modes": ["Road", "Pipeline"],
        "status": "active"
    }
]

for l in listings:
    supabase.table("co2_listings").insert(l).execute()

requests = [
    {
        "buyer_id": user_id,
        "required_grade": "Industrial",
        "volume_needed": 8000,
        "target_price": 4800,
        "status": "active"
    },
    {
        "buyer_id": user_id,
        "required_grade": "Food Grade",
        "volume_needed": 5500,
        "target_price": 4200,
        "status": "active"
    }
]

for r in requests:
    supabase.table("co2_requests").insert(r).execute()

print("Seeded basic map data!")
