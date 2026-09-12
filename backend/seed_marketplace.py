import os
import sys
import uuid

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from app.core.config import settings
from supabase import create_client, Client

def seed_db():
    supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)
    
    # 1. Fetch existing users or create dummy ones
    users_resp = supabase.table('users').select('*').execute()
    users = users_resp.data
    
    if len(users) < 2:
        # Create dummy users
        new_users = [
            {
                "clerk_user_id": f"dummy_{uuid.uuid4()}",
                "email": "supplier1@example.com",
                "first_name": "Acme",
                "last_name": "Supplier",
                "role": "supplier"
            },
            {
                "clerk_user_id": f"dummy_{uuid.uuid4()}",
                "email": "buyer1@example.com",
                "first_name": "Global",
                "last_name": "Buyer",
                "role": "buyer"
            }
        ]
        supabase.table('users').insert(new_users).execute()
        users = supabase.table('users').select('*').execute().data
        
    supplier = next((u for u in users if u['role'] == 'supplier'), users[0])
    buyer = next((u for u in users if u['role'] == 'buyer'), users[1])
    
    # 2. Seed CO2 Listings (Marketplace Supply)
    listings = [
        {
            "supplier_id": supplier['id'],
            "facility_name": "Gulf Coast Carbon Hub",
            "co2_grade": "Food Grade",
            "volume_tpa": 120000,
            "price_per_ton": 850,
            "purity_percentage": 99.9,
            "transport_modes": ["Pipeline", "Truck"],
            "status": "active",
            "location": "Texas, USA",
            "distance_km": 150,
            "source_type": "Direct Air Capture",
            "availability_window": "Immediate",
            "is_verified": True
        },
        {
            "supplier_id": supplier['id'],
            "facility_name": "Nordic BioEnergy",
            "co2_grade": "Industrial Grade",
            "volume_tpa": 50000,
            "price_per_ton": 600,
            "purity_percentage": 95.0,
            "transport_modes": ["Ship", "Rail"],
            "status": "active",
            "location": "Oslo, Norway",
            "distance_km": 1200,
            "source_type": "Biomass",
            "availability_window": "Q3 2024",
            "is_verified": False
        },
        {
            "supplier_id": supplier['id'],
            "facility_name": "EuroChem Capture",
            "co2_grade": "EOR Grade",
            "volume_tpa": 250000,
            "price_per_ton": 450,
            "purity_percentage": 90.0,
            "transport_modes": ["Pipeline"],
            "status": "active",
            "location": "Rotterdam, NL",
            "distance_km": 300,
            "source_type": "Ammonia Production",
            "availability_window": "Q1 2025",
            "is_verified": True
        }
    ]
    
    print("Seeding listings...")
    supabase.table('co2_listings').insert(listings).execute()
    
    # 3. Seed CO2 Requests (Marketplace Demand)
    requests = [
        {
            "buyer_id": buyer['id'],
            "title": "High Purity CO2 for Beverage",
            "application": "Fuel synthesis",
            "volume_needed": 10000,
            "min_purity_required": 99.9,
            "target_price": 900,
            "location": "Atlanta, GA",
            "status": "active",
            "required_grade": "Food Grade",
            "is_urgent": True,
            "delivery_method": "Truck"
        },
        {
            "buyer_id": buyer['id'],
            "title": "EOR CO2 for Texas Field",
            "application": "EOR",
            "volume_needed": 500000,
            "min_purity_required": 95.0,
            "target_price": 400,
            "location": "Midland, TX",
            "status": "active",
            "required_grade": "EOR Grade",
            "is_urgent": False,
            "delivery_method": "Pipeline"
        },
        {
            "buyer_id": buyer['id'],
            "title": "Building Materials CO2",
            "application": "Building materials",
            "volume_needed": 50000,
            "min_purity_required": 90.0,
            "target_price": 500,
            "location": "Berlin, Germany",
            "status": "active",
            "required_grade": "Industrial",
            "is_urgent": False,
            "delivery_method": "Rail"
        }
    ]
    
    print("Seeding requests...")
    supabase.table('co2_requests').insert(requests).execute()
    
    print("Database seeded with Marketplace dummy data!")

if __name__ == "__main__":
    seed_db()
