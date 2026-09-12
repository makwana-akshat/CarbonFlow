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
    
    # 1. Fetch some users
    users_resp = supabase.table('users').select('*').execute()
    users = users_resp.data
    
    if not users:
        print("No users found. Please sign in via Clerk at least once to create a user record.")
        return

    # Assuming first user is supplier, second is buyer, or just random
    supplier_id = users[0]['id']
    buyer_id = users[len(users)-1]['id']

    # 2. Seed CO2 Listings
    listings = [
        {
            "supplier_id": supplier_id,
            "facility_name": "Direct Air Capture & Liquefaction Facility #2",
            "co2_grade": "Food/Beverage Grade 99.98%",
            "volume_tpa": 8500 * 12,
            "price_per_ton": 39.20,
            "purity_percentage": 99.98,
            "transport_modes": ["ISO Rail Tanker"],
            "status": "active"
        },
        {
            "supplier_id": supplier_id,
            "facility_name": "Biogenic Fermentation Plant",
            "co2_grade": "Industrial Tech Grade 99.9%",
            "volume_tpa": 14200 * 12,
            "price_per_ton": 36.80,
            "purity_percentage": 99.90,
            "transport_modes": ["Pipeline"],
            "status": "active"
        }
    ]
    
    supabase.table('co2_listings').insert(listings).execute()
    print("Seeded co2_listings.")

    # 3. Seed CO2 Requests
    requests = [
        {
            "buyer_id": buyer_id,
            "required_grade": "Food Grade E290 Pure",
            "volume_needed": 4500 * 12,
            "target_price": 40.00,
            "status": "active"
        },
        {
            "buyer_id": buyer_id,
            "required_grade": "Mineralization Grade 98.5%+",
            "volume_needed": 12000 * 12,
            "target_price": 42.50,
            "status": "active"
        }
    ]
    
    supabase.table('co2_requests').insert(requests).execute()
    print("Seeded co2_requests.")

    # 4. Seed Facilities
    facilities = [
        {
            "owner_id": supplier_id,
            "name": "DAC Array Alpha",
            "type": "capture",
            "latitude": 51.9225,
            "longitude": 4.47917,
            "region": "Rotterdam, NL",
            "operational_status": "active"
        },
        {
            "owner_id": buyer_id,
            "name": "Beverage Bottler Hub",
            "type": "terminal",
            "latitude": 48.1351,
            "longitude": 11.5820,
            "region": "Munich, DE",
            "operational_status": "active"
        }
    ]
    
    fac_res = supabase.table('facilities').insert(facilities).execute()
    print("Seeded facilities.")

    # 5. Seed Orders
    from datetime import datetime, timedelta
    
    eta = datetime.utcnow() + timedelta(days=2)
    orders = [
        {
            "buyer_id": buyer_id,
            "supplier_id": supplier_id,
            "volume": 8500,
            "total_value": 333200,
            "status": "In Transit",
            "transport_mode": "ISO Rail",
            "eta": eta.isoformat()
        },
        {
            "buyer_id": buyer_id,
            "supplier_id": supplier_id,
            "volume": 14200,
            "total_value": 522560,
            "status": "Continuous Flow",
            "transport_mode": "Pipeline Trunk",
            "eta": None
        }
    ]
    supabase.table('orders').insert(orders).execute()
    print("Seeded orders.")

    # 6. Seed Alerts
    alerts = [
        {
            "facility_id": fac_res.data[0]['id'],
            "severity": "critical",
            "title": "Pressure Drop Detected",
            "description": "Compressor 2 pressure drop detected. Risk of supply disruption to ISO rail manifests.",
            "is_resolved": False
        },
        {
            "facility_id": fac_res.data[1]['id'],
            "severity": "warning",
            "title": "Purity Fluctuation",
            "description": "Purity fluctuation detected (98.2%). Check upstream feed.",
            "is_resolved": False
        },
        {
            "facility_id": fac_res.data[0]['id'],
            "severity": "info",
            "title": "Scheduled Maintenance",
            "description": "Scheduled maintenance window begins in 48 hours.",
            "is_resolved": False
        }
    ]
    supabase.table('alerts').insert(alerts).execute()
    print("Seeded alerts.")

    # 7. Seed Recommendations
    import uuid as libuuid
    recs = [
        {
            "user_role": "buyer",
            "company_name": "EcoSynthetics Group",
            "facility_type": "Refinery",
            "location": "Jamnagar Hub, GJ",
            "match_score": 98.4,
            "is_best_match": True,
            "is_verified": True,
            "tags": ["Low-Carbon Pipeline", "High Purity"],
            "co2_grade": "Food Grade CO₂",
            "volume": "12,000 t/mo",
            "price_per_ton": "₹2,200",
            "co2_source": "Biogenic",
            "transport_mode": "Pipeline",
            "purity": "99.99%",
            "delivery_timeline": "Continuous Flow",
            "certification": "Verra / ISO-14064",
            "route_steps": [
                {"icon_type": "capture", "label": "Bio-Fermentation"},
                {"icon_type": "pipeline", "label": "Regional Trunk"},
                {"icon_type": "terminal", "label": "Jamnagar Terminal"}
            ]
        },
        {
            "user_role": "buyer",
            "company_name": "Deccan Cement Works",
            "facility_type": "Cement Plant",
            "location": "Hyderabad, TS",
            "match_score": 87.2,
            "is_best_match": False,
            "is_verified": True,
            "tags": ["Rail Connected", "Spot Volume"],
            "co2_grade": "Industrial Grade CO₂",
            "volume": "5,000 t",
            "price_per_ton": "₹1,850",
            "co2_source": "Point-Source Capture",
            "transport_mode": "ISO Rail Tanker",
            "purity": "95.00%",
            "delivery_timeline": "Next Week",
            "certification": "Self-Declared",
            "route_steps": [
                {"icon_type": "capture", "label": "Flue Gas Scrubber"},
                {"icon_type": "rail", "label": "Dedicated Freight Corridor"},
                {"icon_type": "terminal", "label": "Hyderabad Hub"}
            ]
        }
    ]
    supabase.table('recommendations').insert(recs).execute()
    print("Seeded recommendations.")

if __name__ == "__main__":
    seed_db()
