from app.schemas.logistics import RouteOption
import math

def haversine(lat1, lon1, lat2, lon2):
    R = 6371.0
    lat1_rad = math.radians(lat1)
    lon1_rad = math.radians(lon1)
    lat2_rad = math.radians(lat2)
    lon2_rad = math.radians(lon2)
    
    dlon = lon2_rad - lon1_rad
    dlat = lat2_rad - lat1_rad
    
    a = math.sin(dlat / 2)**2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

def get_city_coords(city_name: str):
    name_lower = (city_name or "").lower()
    if 'ahmedabad' in name_lower: return 23.0225, 72.5714
    if 'surat' in name_lower: return 21.1702, 72.8311
    if 'jamnagar' in name_lower: return 22.4707, 70.0700
    if 'hazira' in name_lower: return 21.1100, 72.6500
    if 'vadodara' in name_lower: return 22.3072, 73.1812
    if 'mundra' in name_lower: return 22.8400, 69.7200
    if 'mumbai' in name_lower: return 19.0760, 72.8777
    if 'pune' in name_lower: return 18.5204, 73.8567
    if 'chennai' in name_lower: return 13.0827, 80.2707
    return 22.0, 72.0

class LogisticsService:
    def calculate_routes(self, origin: str, destination: str, volume: float, purity: float) -> list[RouteOption]:
        lat1, lon1 = get_city_coords(origin)
        lat2, lon2 = get_city_coords(destination)
        
        distance_km = haversine(lat1, lon1, lat2, lon2)
        if distance_km < 10:
            distance_km = 10.0 # min distance
            
        routes = []
        
        # Handle invalid volume
        safe_volume = 0.0 if volume is None or math.isnan(volume) else volume

        # Pipeline option if purity is high
        if purity >= 97.0:
            routes.append(RouteOption(
                id=f"ROUTE-PIPE-{int(distance_km)}",
                name="Regional Supercritical Trunk",
                modeId="pipeline",
                modeName="Pipeline",
                distance_km=round(distance_km, 1),
                travel_time_hrs=round(distance_km / 150.0, 1), # Pipeline flow speed roughly
                estimated_cost_inr=round(distance_km * safe_volume * 0.5, 2),
                emissions_tco2e=round((distance_km * 0.1) / 1000.0, 4), # Convert kg to tonnes
                volume_tonnes=safe_volume,
                reliability_score=99.5,
                isRecommended=True,
                riskLevel="Low",
                steps=[f"{origin.split(',')[0]} Compression", "Trunk Line", f"{destination.split(',')[0]} Decompression"]
            ))
        
        # Truck option always available
        routes.append(RouteOption(
            id=f"ROUTE-TRUCK-{int(distance_km)}",
            name="Highway Express Corridor",
            modeId="cryogenic_truck",
            modeName="Cryogenic Truck",
            distance_km=round(distance_km * 1.2, 1), # Road distance is longer than straight line
            travel_time_hrs=round(distance_km * 1.2 / 50.0, 1), # 50 km/h average
            estimated_cost_inr=round(distance_km * 1.2 * safe_volume * 1.5, 2),
            emissions_tco2e=round((distance_km * 1.2 * safe_volume * 0.05) / 1000.0, 4), # Convert kg to tonnes
            volume_tonnes=safe_volume,
            reliability_score=92.0,
            isRecommended=not (purity >= 97.0), # Recommended if pipeline not available
            riskLevel="Medium",
            steps=[f"Loading at {origin.split(',')[0]}", "Highway Transit", f"Unloading at {destination.split(',')[0]}"]
        ))
        return routes

    def get_shipment_for_order(self, order_id: str, clerk_user_id: str):
        from app.repositories.order_repository import OrderRepository
        from app.repositories.marketplace_repository import MarketplaceRepository
        from app.repositories.user_repository import UserRepository

        # Fetch basic roles and permissions
        user_repo = UserRepository()
        user = user_repo.get_user_by_clerk_id(clerk_user_id)
        if not user:
            raise Exception("User not found")

        # Fetch Order
        order_repo = OrderRepository()
        order = order_repo.get_order_by_id(order_id)
        if not order:
            raise Exception("Order not found")

        # Access check
        if user["role"] == "buyer" and order["buyer_id"] != user["id"]:
            raise Exception("Unauthorized to view this logistics manifest")
        if user["role"] == "supplier" and order["supplier_id"] != user["id"]:
            raise Exception("Unauthorized to view this logistics manifest")

        # Fetch Listing (Origin Details)
        market_repo = MarketplaceRepository()
        listing = market_repo.get_listing_by_id(order["listing_id"]) if order.get("listing_id") else None

        # Format Origin
        origin_name = listing.get("facility_name", "Unknown Origin") if listing else "Unknown Origin"
        origin_city = listing.get("location_name", "Unknown Location") if listing else "Unknown Location"
        origin_lat = listing.get("latitude", 22.0) if listing else 22.0
        origin_lng = listing.get("longitude", 72.0) if listing else 72.0

        # Format Destination (Buyer context)
        buyer_details = order.get("buyer", {})
        # If no strict facility for buyer, use generic city helper or fallback
        dest_name = f"{buyer_details.get('first_name', 'Buyer')} Facility"
        dest_city = "Ahmedabad, Gujarat" # Generic fallback if we don't have a co2_requests relation
        dest_lat, dest_lng = get_city_coords("Ahmedabad")

        # Construct Shipment shape for frontend
        shipment = {
            "id": f"SHP-{order['id'].split('-')[0].upper()}",
            "emitterLocation": {
                "name": origin_name,
                "facility": "Capture Node",
                "city": origin_city.split(",")[0],
                "state": origin_city.split(",")[1].strip() if "," in origin_city else "",
                "coordinates": [origin_lat, origin_lng]
            },
            "buyerLocation": {
                "name": dest_name,
                "facility": "Offtake Terminal",
                "city": dest_city.split(",")[0],
                "state": dest_city.split(",")[1].strip() if "," in dest_city else "",
                "coordinates": [dest_lat, dest_lng]
            },
            "volume": float(order.get("volume", 0)),
            "purity": float(listing.get("purity_percentage", 99.0)) if listing else 99.0,
            "physicalState": "liquefied" if order.get("transport_mode", "").lower() in ["road", "rail"] else "gas",
            "status": order.get("status", "scheduled"),
            "scheduledDispatch": order.get("eta") or "Pending Allocation",
            "orderRef": f"ORD-{order['id'].split('-')[0].upper()}",
            "isLiveTelemetry": False # True if connected to real sensor
        }

        return shipment
