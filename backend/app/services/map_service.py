from app.core.config import settings
from supabase import create_client, Client
from app.schemas.maps import SupplierNode, BuyerNode, FacilityNode, RouteData, CarbonFlowEdge, GeoPoint

def get_coords_from_name(name: str):
    name_lower = (name or "").lower()
    if 'ahmedabad' in name_lower: return GeoPoint(lat=23.0225, lng=72.5714)
    if 'surat' in name_lower: return GeoPoint(lat=21.1702, lng=72.8311)
    if 'jamnagar' in name_lower: return GeoPoint(lat=22.4707, lng=70.0700)
    if 'hazira' in name_lower: return GeoPoint(lat=21.1100, lng=72.6500)
    if 'vadodara' in name_lower: return GeoPoint(lat=22.3072, lng=73.1812)
    if 'mundra' in name_lower: return GeoPoint(lat=22.8400, lng=69.7200)
    if 'mumbai' in name_lower: return GeoPoint(lat=19.0760, lng=72.8777)
    if 'pune' in name_lower: return GeoPoint(lat=18.5204, lng=73.8567)
    if 'chennai' in name_lower: return GeoPoint(lat=13.0827, lng=80.2707)
    return GeoPoint(lat=22.0, lng=72.0)

class MapService:
    def __init__(self):
        self.db: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)

    def get_suppliers(self):
        res = self.db.table("co2_listings").select("*").execute()
        suppliers = []
        for l in res.data:
            facility_name = l.get('facility_name', 'Unknown Facility')
            coords = get_coords_from_name(facility_name)
            
            suppliers.append(SupplierNode(
                id=l['id'],
                coords=coords,
                name=facility_name,
                location=facility_name,
                industry="Industrial",
                facilityType="Point-Source",
                availableTonnes=l.get('volume_tpa', 0),
                purity=l.get('purity_percentage', 99.0),
                pricePerTon=l.get('price_per_ton', 4000),
                verified=True
            ))
        return suppliers

    def get_buyers(self):
        res = self.db.table("co2_requests").select("*").execute()
        buyers = []
        for i, r in enumerate(res.data):
            # Fallback coordinate assignment based on index if no location text exists
            coords_list = [
                GeoPoint(lat=23.07, lng=72.61), # Ahmedabad area
                GeoPoint(lat=21.21, lng=72.87), # Surat area
                GeoPoint(lat=22.44, lng=70.04), # Jamnagar area
                GeoPoint(lat=19.04, lng=72.84)  # Mumbai area
            ]
            coords = coords_list[i % len(coords_list)]
            
            buyers.append(BuyerNode(
                id=r['id'],
                coords=coords,
                name=f"Buyer {r['id'][:8]}",
                organisation="CarbonFlow Buyer",
                location="Industrial Zone",
                application=r.get('required_grade', 'Industrial'),
                minPurity=95.0,
                verified=True
            ))
        return buyers

    def get_facilities(self):
        res = self.db.table("facilities").select("*").execute()
        facilities = []
        for f in res.data:
            facilities.append(FacilityNode(
                id=f['id'],
                coords=GeoPoint(lat=f['latitude'], lng=f['longitude']),
                name=f['name'],
                type=f['type'],
                operator="CarbonFlow Partner",
                location=f['region']
            ))
        return facilities

    def get_routes(self):
        res = self.db.table("routes").select("*").execute()
        routes = []
        for r in res.data:
            routes.append(RouteData(
                id=r['id'],
                supplierId=r['supplier_id'],
                buyerId=r['buyer_id'],
                supplierName=r['supplier_name'],
                buyerName=r['buyer_name'],
                geometry=[GeoPoint(lat=p['lat'], lng=p['lng']) for p in r.get('geometry', [])] if r.get('geometry') else [],
                distanceKm=r.get('distance_km') or 0,
                travelTimeHrs=r.get('travel_time_hrs') or 0,
                estimatedCostINR=r.get('estimated_cost_inr') or 0,
                transportMode=r.get('transport_mode') or "Road",
                emissionsTco2e=r.get('emissions_tco2e'),
                reliabilityScore=r.get('reliability_score')
            ))
        return routes

    def get_carbon_flows(self):
        res = self.db.table("orders").select("*").eq("status", "Continuous Flow").execute()
        flows = []
        for o in res.data:
            flows.append(CarbonFlowEdge(
                id=o['id'],
                fromId=o['supplier_id'],
                toId=o['buyer_id'],
                tonnes=o['volume'],
                active=True
            ))
        return flows
