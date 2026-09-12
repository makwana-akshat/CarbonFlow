import os
from supabase import create_client

url = os.environ.get('SUPABASE_URL', 'https://fevpmtqmrqpclaeeiaoz.supabase.co')
key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZldnBtdHFtcnFwY2xhZWVpYW96Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTE0ODY4NSwiZXhwIjoyMTA0NzI0Njg1fQ.YOjOGHJ48Nxk5FIjFs_fTLEkLs7IgK0gFaKkpGEjNWs')
db = create_client(url, key)

def get_coords_from_name(name: str):
    name_lower = (name or "").lower()
    if 'ahmedabad' in name_lower: return {'lat': 23.0225, 'lng': 72.5714}
    if 'surat' in name_lower: return {'lat': 21.1702, 'lng': 72.8311}
    if 'jamnagar' in name_lower: return {'lat': 22.4707, 'lng': 70.0700}
    if 'hazira' in name_lower: return {'lat': 21.1100, 'lng': 72.6500}
    if 'vadodara' in name_lower: return {'lat': 22.3072, 'lng': 73.1812}
    if 'mundra' in name_lower: return {'lat': 22.8400, 'lng': 69.7200}
    if 'mumbai' in name_lower: return {'lat': 19.0760, 'lng': 72.8777}
    if 'pune' in name_lower: return {'lat': 18.5204, 'lng': 73.8567}
    if 'chennai' in name_lower: return {'lat': 13.0827, 'lng': 80.2707}
    if 'gujarat' in name_lower: return {'lat': 22.2587, 'lng': 71.1924}
    return {'lat': 22.0, 'lng': 72.0}

print("Backfilling co2_listings...")
listings = db.table('co2_listings').select('id, location, facility_name').execute()
for l in listings.data:
    loc_text = l.get('location') or l.get('facility_name') or ""
    coords = get_coords_from_name(loc_text)
    try:
        db.table('co2_listings').update({'latitude': coords['lat'], 'longitude': coords['lng']}).eq('id', l['id']).execute()
    except Exception as e:
        print(f"Failed to update listing {l['id']}: {e}")

print("Backfilling co2_requests...")
requests = db.table('co2_requests').select('id, location').execute()
for r in requests.data:
    coords = get_coords_from_name(r.get('location') or "")
    try:
        db.table('co2_requests').update({'latitude': coords['lat'], 'longitude': coords['lng']}).eq('id', r['id']).execute()
    except Exception as e:
        print(f"Failed to update request {r['id']}: {e}")

print("Backfill complete.")
