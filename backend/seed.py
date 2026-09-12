import os
import sys
import uuid
import random

# Add backend directory to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.config import settings
from supabase import create_client, Client

def seed_db():
    supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)
    
    # Skip previous seeds
    print("Skipping previous seeds...")
    
    users_resp = supabase.table('users').select('*').execute()
    users = users_resp.data
    
    if not users or len(users) < 2:
        print("Need at least 2 users")
        return
    # 9. Seed Routes
    routes = [
        {
            "route_ref": "RT-901",
            "supplier_id": users[0]['id'],
            "buyer_id": users[1]['id'],
            "supplier_name": "Nordic Cryo Carbon",
            "buyer_name": "Synthetica Fuels",
            "from_lat": 51.9225,
            "from_lng": 4.47917,
            "to_lat": 48.1351,
            "to_lng": 11.5820,
            "distance_km": 850.5,
            "travel_time_hrs": 12.5,
            "estimated_cost_inr": 120000.0,
            "transport_mode": "Road",
            "is_recommended": True,
            "emissions_tco2e": 4.2,
            "reliability_score": 98.5,
            "geometry": [
                {"lat": 51.9225, "lng": 4.47917},
                {"lat": 50.1109, "lng": 8.6821},
                {"lat": 48.1351, "lng": 11.5820}
            ]
        }
    ]
    supabase.table('routes').insert(routes).execute()
    print("Seeded routes.")

if __name__ == "__main__":
    seed_db()
