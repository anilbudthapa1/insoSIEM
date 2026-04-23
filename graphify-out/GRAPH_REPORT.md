# Graph Report - .  (2026-04-21)

## Corpus Check
- Corpus is ~2,198 words - fits in a single context window. You may not need a graph.

## Summary
- 12 nodes · 21 edges · 3 communities detected
- Extraction: 71% EXTRACTED · 29% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.83)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Graph Report and Storage|Graph Report and Storage]]
- [[_COMMUNITY_Update Rules and Visualization|Update Rules and Visualization]]
- [[_COMMUNITY_Wiki Navigation|Wiki Navigation]]

## God Nodes (most connected - your core abstractions)
1. `Graphify Knowledge Graph` - 6 edges
2. `Community: Graph Report and Storage` - 5 edges
3. `graphify-out/ Directory` - 4 edges
4. `vis-network Graph Visualization` - 4 edges
5. `GRAPH_REPORT.md` - 3 edges
6. `graphify-out/wiki/index.md` - 3 edges
7. `Rule: Read GRAPH_REPORT.md Before Architecture Questions` - 3 edges
8. `Rule: Navigate Wiki Instead of Raw Files` - 3 edges
9. `Rule: Run graphify update After Code Modifications` - 3 edges
10. `Community: Wiki Navigation` - 3 edges

## Surprising Connections (you probably didn't know these)
- `vis-network Graph Visualization` --references--> `Graphify Knowledge Graph`  [EXTRACTED]
  graphify-out/graph.html → CLAUDE.md
- `Community: Graph Report and Storage` --references--> `Graphify Knowledge Graph`  [EXTRACTED]
  graphify-out/graph.html → CLAUDE.md
- `Community: Graph Report and Storage` --references--> `graphify-out/ Directory`  [EXTRACTED]
  graphify-out/graph.html → CLAUDE.md
- `Community: Graph Report and Storage` --references--> `GRAPH_REPORT.md`  [EXTRACTED]
  graphify-out/graph.html → CLAUDE.md
- `Community: Wiki Navigation` --references--> `graphify-out/wiki/index.md`  [EXTRACTED]
  graphify-out/graph.html → CLAUDE.md

## Hyperedges (group relationships)
- **Graphify Project Usage Rules** — claudemd_rule_read_graph_report, claudemd_rule_navigate_wiki, claudemd_rule_run_graphify_update [EXTRACTED 1.00]
- **Graphify Project Usage Rules** —  [EXTRACTED 1.00]

## Communities

### Community 0 - "Graph Report and Storage"
Cohesion: 0.8
Nodes (5): GRAPH_REPORT.md, Graphify Knowledge Graph, graphify-out/ Directory, Rule: Read GRAPH_REPORT.md Before Architecture Questions, Community: Graph Report and Storage

### Community 1 - "Update Rules and Visualization"
Cohesion: 0.67
Nodes (4): graphify update . Command, Rule: Run graphify update After Code Modifications, Community: Incremental Update Rules, vis-network Graph Visualization

### Community 2 - "Wiki Navigation"
Cohesion: 1.0
Nodes (3): Rule: Navigate Wiki Instead of Raw Files, graphify-out/wiki/index.md, Community: Wiki Navigation

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Graphify Knowledge Graph` connect `Graph Report and Storage` to `Update Rules and Visualization`, `Wiki Navigation`?**
  _High betweenness centrality (0.370) - this node is a cross-community bridge._
- **Why does `vis-network Graph Visualization` connect `Update Rules and Visualization` to `Graph Report and Storage`, `Wiki Navigation`?**
  _High betweenness centrality (0.217) - this node is a cross-community bridge._
- **Why does `Rule: Run graphify update After Code Modifications` connect `Update Rules and Visualization` to `Graph Report and Storage`?**
  _High betweenness centrality (0.135) - this node is a cross-community bridge._
- **Are the 3 inferred relationships involving `Graphify Knowledge Graph` (e.g. with `Rule: Read GRAPH_REPORT.md Before Architecture Questions` and `Rule: Navigate Wiki Instead of Raw Files`) actually correct?**
  _`Graphify Knowledge Graph` has 3 INFERRED edges - model-reasoned connections that need verification._
- **Are the 3 inferred relationships involving `vis-network Graph Visualization` (e.g. with `Community: Graph Report and Storage` and `Community: Wiki Navigation`) actually correct?**
  _`vis-network Graph Visualization` has 3 INFERRED edges - model-reasoned connections that need verification._