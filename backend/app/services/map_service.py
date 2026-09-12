import uuid
from app.core.config import settings
from supabase import create_client, Client
from app.schemas.maps import SupplierNode, BuyerNode, FacilityNode, RouteData, CarbonFlowEdge, GeoPoint, RegionData, RegionSupply, RegionDemand

class MapService:
    def __init__(self):
        self.db: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)

class MapService:
    def __init__(self):
        self.db: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)

    def get_suppliers(self):
        res = self.db.table("co2_listings").select("*, users!supplier_id(company_name)").eq("status", "active").execute()
        suppliers = []
        for l in res.data:
            if l.get('latitude') is None or l.get('longitude') is None:
                continue
                
            facility_name = l.get('facility_name', 'Unknown Facility')
            company = l.get('users', {}).get('company_name') if l.get('users') else facility_name
            
            suppliers.append(SupplierNode(
                id=l['id'],
                coords=GeoPoint(lat=l['latitude'], lng=l['longitude']),
                name=company or facility_name,
                location=l.get('location', facility_name),
                industry="Industrial",
                facilityType=l.get('source_type', "Point-Source"),
                availableTonnes=l.get('volume_tpa', 0),
                purity=l.get('purity_percentage', 99.0),
                pricePerTon=l.get('price_per_ton', 4000),
                verified=l.get('is_verified', True)
            ))
        return suppliers

    def get_buyers(self):
        res = self.db.table("co2_requests").select("*, users!buyer_id(company_name)").eq("status", "active").is_("listing_id", "null").execute()
        buyers = []
        for r in res.data:
            if r.get('latitude') is None or r.get('longitude') is None:
                continue
                
            company = r.get('users', {}).get('company_name') if r.get('users') else "CarbonFlow Buyer"
            
            buyers.append(BuyerNode(
                id=r['id'],
                coords=GeoPoint(lat=r['latitude'], lng=r['longitude']),
                name=r.get('title', company),
                organisation=company,
                location=r.get('location', "Industrial Zone"),
                application=r.get('application', r.get('required_grade', 'Industrial')),
                minPurity=r.get('min_purity_required', 95.0),
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
        res = self.db.table("orders").select("*, routes!left(from_lat, from_lng, to_lat, to_lng)").in_("status", ["Continuous Flow", "in-transit"]).execute()
        flows = []
        for o in res.data:
            if o.get("routes") and len(o["routes"]) > 0:
                route = o["routes"][0]
                if route.get("from_lat") and route.get("to_lat"):
                    # the frontend currently does not use coords directly from CarbonFlowEdge, but rather links fromId and toId
                    pass
                    
            flows.append(CarbonFlowEdge(
                id=o['id'],
                fromId=o['supplier_id'],
                toId=o['buyer_id'],
                tonnes=o['volume'],
                active=True
            ))
        return flows

    def get_regions(self):
        # Dynamically calculate regional aggregation
        suppliers = self.get_suppliers()
        buyers = self.get_buyers()
        
        region_map = {}
        
        for s in suppliers:
            loc = s.location.strip()
            if not loc: loc = "Other"
            
            if loc not in region_map:
                region_map[loc] = {
                    "name": loc,
                    "coords": [s.coords.lat, s.coords.lng],
                    "prices": [],
                    "supply_tonnes": 0,
                    "active_suppliers": set(),
                    "demand_tonnes": 0,
                    "active_buyers": set()
                }
            
            region_map[loc]["supply_tonnes"] += s.availableTonnes
            region_map[loc]["prices"].append(s.pricePerTon)
            region_map[loc]["active_suppliers"].add(s.id)
            
        for b in buyers:
            loc = b.location.strip()
            if not loc: loc = "Other"
            
            if loc not in region_map:
                region_map[loc] = {
                    "name": loc,
                    "coords": [b.coords.lat, b.coords.lng],
                    "prices": [],
                    "supply_tonnes": 0,
                    "active_suppliers": set(),
                    "demand_tonnes": 0,
                    "active_buyers": set()
                }
            
            region_map[loc]["demand_tonnes"] += b.quantity_needed if hasattr(b, 'quantity_needed') else (b.minPurity * 100) # fallback
            region_map[loc]["active_buyers"].add(b.id)
            
        regions = []
        for key, data in region_map.items():
            avg_price = sum(data["prices"]) / len(data["prices"]) if data["prices"] else 0
            regions.append(RegionData(
                id=str(uuid.uuid4())[:8],
                name=data["name"],
                coords=GeoPoint(lat=data["coords"][0], lng=data["coords"][1]),
                avgPrice=round(avg_price, 2),
                supply=RegionSupply(totalTonnes=data["supply_tonnes"], activeSuppliers=len(data["active_suppliers"])),
                demand=RegionDemand(totalTonnes=data["demand_tonnes"], activeBuyers=len(data["active_buyers"]))
            ))
            
        return regions
