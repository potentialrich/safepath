from fastapi import APIRouter, HTTPException
import networkx as nx
import osmnx as ox
from ..schemas.route import RouteRequest, RouteResponse
from ..services.routing import aco_pathfinder
from ..data import graph_engine

router = APIRouter()

@router.post("/calculate-route", response_model=RouteResponse)
async def calculate_route(req: RouteRequest):
    G_safe, df_crime, crime_tree = graph_engine.get_graph_data()
    
    if G_safe is None or df_crime is None or crime_tree is None:
        raise HTTPException(status_code=503, detail="Graph engine is not initialized yet or failed to load data.")

    start_coords = (req.start_lat, req.start_lng)
    end_coords = (req.end_lat, req.end_lng)

    try:
        print(f"[*] Calculating standard shortest route for comparison...")
        s_node = ox.distance.nearest_nodes(G_safe, start_coords[1], start_coords[0])
        e_node = ox.distance.nearest_nodes(G_safe, end_coords[1], end_coords[0])
        std_path_nodes = nx.shortest_path(G_safe, s_node, e_node, weight='length')
        std_route = [[G_safe.nodes[n]['y'], G_safe.nodes[n]['x']] for n in std_path_nodes]

        print(f"[*] Ants are calculating the safest route...")
        safe_route = aco_pathfinder(G_safe, start_coords, end_coords)

        # Analysis: Find dangers on the standard route
        risky_crimes_indices = set()
        for node in std_path_nodes:
            lat, lon = G_safe.nodes[node]['y'], G_safe.nodes[node]['x']
            # Find crimes within 100m of this specific node
            nearby = crime_tree.query_ball_point([lat, lon], r=0.001)
            risky_crimes_indices.update(nearby)

        danger_nodes = []
        high_risk_count: int = 0
        total_risk_count: int = len(risky_crimes_indices)

        for idx in risky_crimes_indices:
            crime = df_crime.iloc[idx]
            is_high_risk = crime['METHOD'] in ['GUN', 'KNIFE']
            if is_high_risk: 
                high_risk_count += 1
            
            danger_nodes.append({
                "lat": float(crime['LATITUDE']),
                "lng": float(crime['LONGITUDE']),
                "type": "HIGH_RISK" if is_high_risk else "WARNING",
                "offense": str(crime['OFFENSE']),
                "method": str(crime['METHOD'])
            })

        # Calculate a simple safety score (0-100)
        # Assuming standard map risk: 2 pts for normal crime, 10 pts for severe crime.
        risk_penalty: int = (total_risk_count * 2) + (high_risk_count * 10)
        safety_score: int = max(0, 100 - risk_penalty)

        return RouteResponse(
            status="success",
            routes={
                "standard": std_route,
                "safepath": safe_route
            },
            analysis={
                "total_incidents_avoided": total_risk_count,
                "severe_incidents_avoided": high_risk_count,
                "danger_nodes": danger_nodes,
                "safety_score": safety_score
            }
        )

    except Exception as e:
        print(f"Error calculating route: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/health")
async def health_check():
    G_safe, _, _ = graph_engine.get_graph_data()
    return {
        "status": "healthy",
        "graph_loaded": G_safe is not None
    }
