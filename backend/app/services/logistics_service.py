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
        
        # Pipeline option if purity is high
        if purity >= 97.0:
            routes.append(RouteOption(
                id=f"ROUTE-PIPE-{int(distance_km)}",
                name="Regional Supercritical Trunk",
                modeId="pipeline",
                modeName="Pipeline",
                distanceKm=round(distance_km, 1),
                durationHrs=round(distance_km / 150.0, 1), # Pipeline flow speed roughly
                costInr=round(distance_km * volume * 0.5, 2),
                carbonEmissionsKg=round(distance_km * 0.1, 1),
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
            distanceKm=round(distance_km * 1.2, 1), # Road distance is longer than straight line
            durationHrs=round(distance_km * 1.2 / 50.0, 1), # 50 km/h average
            costInr=round(distance_km * 1.2 * volume * 1.5, 2),
            carbonEmissionsKg=round(distance_km * 1.2 * volume * 0.05, 1),
            isRecommended=not (purity >= 97.0), # Recommended if pipeline not available
            riskLevel="Medium",
            steps=[f"Loading at {origin.split(',')[0]}", "Highway Transit", f"Unloading at {destination.split(',')[0]}"]
        ))
        
        return routes
