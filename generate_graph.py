#!/usr/bin/env python3
"""
One-time script to pre-generate the SafePath DC walking graph
and save it as dc_walk_graph.graphml in the api/app/data/ directory.

Run this locally ONCE, then commit the graphml file to git.
Render will load from disk instead of downloading/building from scratch.
"""
import sys
import os

# Allow running from project root
sys.path.insert(0, os.path.dirname(__file__))

from api.app.data.graph_engine import build_and_save_graph, GRAPHML_CACHE_PATH

CSV_PATH = "api/Crime_Incidents_-_2026.csv"

print(f"Generating graph from: {CSV_PATH}")
print(f"Will save to: {GRAPHML_CACHE_PATH}")
print("This will take 2-5 minutes on first run...\n")

G, df, tree = build_and_save_graph(CSV_PATH, GRAPHML_CACHE_PATH)
print(f"\n✅ Done! Graph has {len(G.nodes)} nodes and {len(G.edges)} edges.")
print(f"File saved at: {GRAPHML_CACHE_PATH}")
print("\nNext step: git add + git commit + git push this file to your repo.")
