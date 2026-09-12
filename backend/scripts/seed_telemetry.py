import os
import uuid
import datetime
from supabase import create_client, Client

url = os.environ.get("SUPABASE_URL", "https://fevpmtqmrqpclaeeiaoz.supabase.co")
key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZldnBtdHFtcnFwY2xhZWVpYW96Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTE0ODY4NSwiZXhwIjoyMTA0NzI0Njg1fQ.YOjOGHJ48Nxk5FIjFs_fTLEkLs7IgK0gFaKkpGEjNWs")
supabase: Client = create_client(url, key)

# Get a user ID for ownership
user_res = supabase.table("users").select("id").limit(1).execute()
if not user_res.data:
    print("No users found to own facilities/shipments.")
    exit(1)
user_id = user_res.data[0]["id"]

# Seed Facilities
facilities = [
    {
        "owner_id": user_id,
        "name": "Hazira Carbon Hub",
        "type": "Point-Source",
        "latitude": 21.11,
        "longitude": 72.65,
        "region": "Hazira Industrial Zone",
        "operational_status": "active"
    },
    {
        "owner_id": user_id,
        "name": "Jamnagar Refinery Unit 4",
        "type": "Refining",
        "latitude": 22.47,
        "longitude": 70.07,
        "region": "Jamnagar",
        "operational_status": "warning"
    }
]

for f in facilities:
    supabase.table("facilities").insert(f).execute()
print("Seeded facilities.")

# Wait, shipments requires order_id!
# Get an order_id
order_res = supabase.table("orders").select("id").limit(1).execute()
order_id = None
if order_res.data:
    order_id = order_res.data[0]["id"]
else:
    print("No orders found. Creating dummy order.")
    # create dummy order
    res = supabase.table("orders").insert({
        "order_ref": "ORD-1001",
        "buyer_id": user_id,
        "supplier_id": user_id,
        "volume": 500,
        "total_value": 10000,
        "transport_mode": "Cryogenic Truck",
        "status": "active"
    }).execute()
    order_id = res.data[0]["id"]

# Seed Shipments
eta_future = (datetime.datetime.now() + datetime.timedelta(hours=5)).isoformat()
eta_past = (datetime.datetime.now() - datetime.timedelta(hours=2)).isoformat()

shipments = [
    {
        "shipment_ref": "SHP-8924",
        "order_id": order_id,
        "origin": "Hazira",
        "destination": "Ahmedabad",
        "route_label": "NH-48",
        "transport_mode": "Cryogenic Truck",
        "eta": eta_future,
        "status": "in-transit",
        "risk": "low",
        "volume": "320 t",
        "carrier": "BlueDart Logistics"
    },
    {
        "shipment_ref": "SHP-8925",
        "order_id": order_id,
        "origin": "Jamnagar",
        "destination": "Surat",
        "route_label": "Coastal Highway",
        "transport_mode": "Cryogenic Truck",
        "eta": eta_past,
        "status": "delayed",
        "risk": "high",
        "volume": "180 t",
        "carrier": "SafeTrans"
    }
]

for s in shipments:
    supabase.table("shipments").insert(s).execute()
print("Seeded shipments.")
