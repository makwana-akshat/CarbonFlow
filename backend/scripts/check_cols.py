import os
from supabase import create_client, Client
url = os.environ.get("SUPABASE_URL", "https://fevpmtqmrqpclaeeiaoz.supabase.co")
key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZldnBtdHFtcnFwY2xhZWVpYW96Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTE0ODY4NSwiZXhwIjoyMTA0NzI0Njg1fQ.YOjOGHJ48Nxk5FIjFs_fTLEkLs7IgK0gFaKkpGEjNWs")
supabase: Client = create_client(url, key)

res = supabase.table("co2_listings").select("*").limit(1).execute()
print("Listings Data:", res.data)

res = supabase.table("facilities").select("*").limit(1).execute()
print("Facilities Data:", res.data)
