from app.core.config import settings
from supabase import create_client, Client
from app.schemas.maps import SupplierNode, BuyerNode, FacilityNode, RouteData, CarbonFlowEdge, GeoPoint

class MapService:
    def __init__(self):
        self.db: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)

    def get_suppliers(self):
        # We simulate suppliers using users with role=supplier and co2_listings
        res = self.db.table("co2_listings").select("*, users(*)").execute()
        suppliers = []
        for l in res.data:
            if l['users']:
                # mock coords for demo
                suppliers.append(SupplierNode(
                    id=l['id'],
                    coords=GeoPoint(lat=22.4707, lng=70.0577), # Jamnagar roughly
                    name=l['users']['company_name'] or "Unknown Supplier",
                    location="Jamnagar, GJ",
                    industry="Refining",
                    facilityType="Point-Source",
                    availableTonnes=l['volume_tpa'],
                    purity=l['purity_percentage'],
                    pricePerTon=l['price_per_ton'],
                    verified=True
                ))
        return suppliers

    def get_buyers(self):
        res = self.db.table("co2_requests").select("*, users(*)").execute()
        buyers = []
        for r in res.data:
            if r['users']:
                buyers.append(BuyerNode(
                    id=r['id'],
                    coords=GeoPoint(lat=17.3850, lng=78.4867), # Hyderabad
                    name=r['users']['company_name'] or "Unknown Buyer",
                    organisation="Deccan Cement",
                    location="Hyderabad, TS",
                    application=r['required_grade'],
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
                geometry=[GeoPoint(lat=p['lat'], lng=p['lng']) for p in r['geometry']] if r['geometry'] else [],
                distanceKm=r['distance_km'] or 0,
                travelTimeHrs=r['travel_time_hrs'] or 0,
                estimatedCostINR=r['estimated_cost_inr'] or 0,
                transportMode=r['transport_mode'] or "Road",
                emissionsTco2e=r['emissions_tco2e'],
                reliabilityScore=r['reliability_score']
            ))
        return routes

    def get_carbon_flows(self):
        # We can map active orders to carbon flows
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
