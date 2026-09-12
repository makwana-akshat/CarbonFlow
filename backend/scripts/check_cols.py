import os
from supabase import create_client, Client
url = os.environ.get("SUPABASE_URL", "https://fevpmtqmrqpclaeeiaoz.supabase.co")
key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZldnBtdHFtcnFwY2xhZWVpYW96Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTE0ODY4NSwiZXhwIjoyMTA0NzI0Njg1fQ.YOjOGHJ48Nxk5FIjFs_fTLEkLs7IgK0gFaKkpGEjNWs")
supabase: Client = create_client(url, key)

try:
    print("Alerts:", supabase.table("alerts").select("*").limit(1).execute().data)
except Exception as e:
    print("Alerts table err:", e)
try:
    print("Shipments:", supabase.table("shipments").select("*").limit(1).execute().data)
except Exception as e:
    print("Shipments table err:", e)
try:
    print("Facilities:", supabase.table("facilities").select("*").limit(1).execute().data)
except Exception as e:
    print("Facilities table err:", e)
