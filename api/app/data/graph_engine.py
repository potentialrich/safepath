import os
import pandas as pd
import osmnx as ox
import networkx as nx
from scipy.spatial import cKDTree

# Global variables to hold our in-memory data
G_safe = None
df_crime = None
crime_tree = None

# Path to the pre-generated graph file (committed to the repo)
GRAPHML_CACHE_PATH = os.path.join(os.path.dirname(__file__), "dc_walk_graph.graphml.gz")

def get_graph_data():
    return G_safe, df_crime, crime_tree

def build_and_save_graph(csv_path: str, graphml_path: str):
    """Download the DC walk network, apply safety costs, and save to disk."""
    print("[*] Loading and processing crime data...")
    df = pd.read_csv(csv_path)

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

    print("[*] Downloading Washington D.C. walk network from OSM...")
    G = ox.graph_from_place('Washington, D.C., USA', network_type='walk')

    print("[*] Calculating safety costs for all streets...")
    for u, v, key, data in G.edges(keys=True, data=True):
        distance = data.get('length', 1.0)
        node_y, node_x = G.nodes[u]['y'], G.nodes[u]['x']
        nearby_indices = tree.query_ball_point([node_y, node_x], r=0.001)
        total_risk = sum(crime_weights[i] for i in nearby_indices)
        data['safety_cost'] = distance * (1 + (total_risk * 0.5))
        data['pheromone'] = 1.0

    print(f"[*] Saving graph to {graphml_path}...")
    ox.save_graphml(G, filepath=graphml_path)
    print("[+] Graph saved successfully.")
    return G, valid_crimes, tree

def load_graph_from_disk(csv_path: str, graphml_path: str):
    """Load the pre-built graph from disk (fast, low memory)."""
    print(f"[*] Loading pre-built graph from {graphml_path}...")
    G = ox.load_graphml(filepath=graphml_path)
    
    # Cast custom attributes from string to float globally
    for u, v, k, data in G.edges(keys=True, data=True):
        if 'safety_cost' in data:
            data['safety_cost'] = float(data['safety_cost'])
        if 'pheromone' in data:
            data['pheromone'] = float(data['pheromone'])

    print("[*] Loading crime data...")
    df = pd.read_csv(csv_path)
    df['RISK_SCORE'] = df.apply(lambda row: 5 if str(row.get('METHOD', '')).upper() in ['GUN', 'KNIFE'] else 1, axis=1)
    valid_crimes = df.dropna(subset=['LATITUDE', 'LONGITUDE']).copy()
    tree = cKDTree(valid_crimes[['LATITUDE', 'LONGITUDE']].values)
    print("[+] Graph and crime data loaded from disk. Ready!")
    return G, valid_crimes, tree

def initialize_graph_engine(csv_path: str):
    global G_safe, df_crime, crime_tree
    try:
        if os.path.exists(GRAPHML_CACHE_PATH):
            # Fast path: load pre-built graph from disk
            G_safe, df_crime, crime_tree = load_graph_from_disk(csv_path, GRAPHML_CACHE_PATH)
        elif os.path.exists(csv_path):
            # Slow path: build from scratch and save for next time
            print("[!] No cached graph found. Building from scratch (this takes a few minutes)...")
            G_safe, df_crime, crime_tree = build_and_save_graph(csv_path, GRAPHML_CACHE_PATH)
        else:
            print(f"⚠️ WARNING: CSV not found at {csv_path}. Graph will not be initialized.")
    except Exception as e:
        print(f"Error during graph initialization: {e}")
