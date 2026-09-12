import os
from supabase import create_client, Client

url: str = os.environ.get("SUPABASE_URL", "https://fevpmtqmrqpclaeeiaoz.supabase.co")
key: str = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZldnBtdHFtcnFwY2xhZWVpYW96Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTE0ODY4NSwiZXhwIjoyMTA0NzI0Njg1fQ.YOjOGHJ48Nxk5FIjFs_fTLEkLs7IgK0gFaKkpGEjNWs")
supabase: Client = create_client(url, key)

with open("migrations/004_add_coordinates.sql", "r") as f:
    sql = f.read()

# Wait, Supabase API doesn't allow executing arbitrary raw SQL from the client unless it's an RPC or REST.
# Supabase Python client does not have a raw SQL execution method by default unless through postgrest RPC.
# Let's see if we can use another method or just execute the sql manually.
