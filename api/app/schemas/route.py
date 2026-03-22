from pydantic import BaseModel
from typing import List, Dict, Any

class RouteRequest(BaseModel):
    start_lat: float
    start_lng: float
    end_lat: float
    end_lng: float

class DangerNode(BaseModel):
    lat: float
    lng: float
    type: str
    offense: str
    method: str

class RouteAnalysis(BaseModel):
    total_incidents_avoided: int
    severe_incidents_avoided: int
    danger_nodes: List[DangerNode]
    safety_score: int

class RouteResponse(BaseModel):
    status: str
    routes: Dict[str, List[List[float]]]
    analysis: RouteAnalysis
