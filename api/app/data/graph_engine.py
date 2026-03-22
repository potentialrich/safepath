import os
import pandas as pd
import osmnx as ox
import networkx as nx
from scipy.spatial import cKDTree

# Global variables to hold our in-memory data
G_safe = None
df_crime = None
crime_tree = None

def get_graph_data():
    return G_safe, df_crime, crime_tree

def create_weighted_graph(csv_path: str):
    print("[*] Loading and processing crime data...")
    if not os.path.exists(csv_path):
        raise FileNotFoundError(f"Crime data CSV not found at {csv_path}")

    df = pd.read_csv(csv_path)
    
    # RISK SCORING: Armed/Severe crimes = 5, Others = 1
    def calculate_risk(row):
        offense = str(row.get('OFFENSE', '')).upper()
        method = str(row.get('METHOD', '')).upper()
        if method in ['GUN', 'KNIFE'] or 'WEAPON' in offense or 'ROBBERY' in offense:
            return 5
        return 1

    df['RISK_SCORE'] = df.apply(calculate_risk, axis=1)
    valid_crimes = df.dropna(subset=['LATITUDE', 'LONGITUDE']).copy()
    
    crime_coords = valid_crimes[['LATITUDE', 'LONGITUDE']].values
    crime_weights = valid_crimes['RISK_SCORE'].values
    tree = cKDTree(crime_coords)

    print("[*] Downloading Washington D.C. map (Walk network)... This may take a minute on first boot.")
    # For a real production app, we would load from a pre-saved .graphml file, but for the demo we'll fetch on boot and keep in memory.
    G = ox.graph_from_place('Washington, D.C., USA', network_type='walk')

    print("[*] Calculating safety costs for all streets...")
    for u, v, key, data in G.edges(keys=True, data=True):
        distance = data.get('length', 1.0)
        node_y, node_x = G.nodes[u]['y'], G.nodes[u]['x']
        
        # Find crimes within ~100 meters (0.001 degrees)
        nearby_indices = tree.query_ball_point([node_y, node_x], r=0.001)
        total_risk = sum(crime_weights[i] for i in nearby_indices)
        
        # COST FORMULA: Distance * (1 + (Total Risk * 0.5))
        data['safety_cost'] = distance * (1 + (total_risk * 0.5))
        data['pheromone'] = 1.0 

    print("[+] Map and Safety Engine Ready!\n")
    return G, valid_crimes, tree

def initialize_graph_engine(csv_path: str):
    global G_safe, df_crime, crime_tree
    try:
        if os.path.exists(csv_path):
             G_safe, df_crime, crime_tree = create_weighted_graph(csv_path)
        else:
            print(f"⚠️ WARNING: CSV not found at {csv_path}. Graph will not be initialized. Endpoints will fail.")
    except Exception as e:
        print(f"Error during startup graph generation: {e}")
