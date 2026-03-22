import random
import networkx as nx
import osmnx as ox
from fastapi import HTTPException

# ==========================================
# 2. ANT COLONY OPTIMIZATION (ACO) ENGINE
# ==========================================
def aco_pathfinder(G, start_coord, end_coord, num_ants=10, iterations=5):
    start_node = ox.distance.nearest_nodes(G, start_coord[1], start_coord[0])
    end_node = ox.distance.nearest_nodes(G, end_coord[1], end_coord[0])

    best_path = []
    best_cost = float('inf')

    # reset pheromones for a fresh calculation
    for u, v, k, data in G.edges(keys=True, data=True): 
        data['pheromone'] = 1.0

    for it in range(iterations):
        all_paths = []
        for ant in range(num_ants):
            current = start_node
            path = [current]
            cost = 0
            visited = {current}

            for _ in range(1000): # Max steps to prevent infinite loops
                if current == end_node: break
                neighbors = list(G.neighbors(current))
                unvisited = [n for n in neighbors if n not in visited]
                if not unvisited: break 

                probs = []
                for n in unvisited:
                    edge = G[current][n][0]
                    tau = float(edge.get('pheromone', 1.0))
                    eta = 1.0 / float(edge.get('safety_cost', 1.0))
                    probs.append(tau * (eta ** 3)) # High sensitivity to danger

                if not probs: break
                total = sum(probs)
                if total == 0: break
                
                next_node = random.choices(unvisited, weights=[p/total for p in probs])[0]
                
                cost += float(G[current][next_node][0].get('safety_cost', 1.0))
                path.append(next_node)
                visited.add(next_node)
                current = next_node

            if current == end_node:
                all_paths.append((path, cost))
                if cost < best_cost:
                    best_cost, best_path = cost, path

        # Pheromone Update (Evaporation + Deposit)
        for u, v, k, data in G.edges(keys=True, data=True): data['pheromone'] = float(data.get('pheromone', 1.0)) * 0.7 
        for p, p_cost in all_paths:
            for i in range(len(p) - 1):
                G[p[i]][p[i+1]][0]['pheromone'] = float(G[p[i]][p[i+1]][0].get('pheromone', 1.0)) + (1000.0 / p_cost)

    if not best_path: # Fallback to Dijkstra if ants get trapped
        print("[!] ACO failed to converge, falling back to Dijkstra shortest path (weighted by safety)")
        try:
             best_path = nx.shortest_path(G, start_node, end_node, weight='safety_cost')
        except nx.NetworkXNoPath:
             raise HTTPException(status_code=400, detail="No path found between these locations.")

    # Return array of [lat, lng]
    return [[G.nodes[n]['y'], G.nodes[n]['x']] for n in best_path]
