# Implementation guide

- `lib/types.ts` holds the data model and small state helpers; `lib/validate.ts` validates imports; `lib/route.ts` holds Dijkstra routing; `lib/i18n.ts` holds all English/Bangla text; `lib/sample.ts` loads `public/building.json`.
- The graph is represented by nodes and undirected edges. `findBestRoute` filters blocked nodes, blocked edges, and closed exits before running Dijkstra.
- Every queue candidate stores its full node-ID path. Cost is compared first; equal-cost candidates use lexicographic path comparison. Exit candidates then use cost, exit ID, and path order.
- `components/` has the map, hazard controls and route result. `app/page.tsx` owns browser state: imported data, current hazards, selected start, language, and validation error. `useMemo` recalculates the route whenever data, hazards, or start changes.
- The SVG map renders the supplied coordinates and derives active route edges from adjacent route nodes.
- Validation rejects malformed JSON rather than coercing or silently changing it.
- Every visible string, including validation errors, lives in `lib/i18n.ts` and is read through `t(language, key)`. Never hardcode UI text.
- Controls use native buttons/selects for keyboard access, with visible status text and focus behavior.

## Testing checklist
Test baseline routing, blocked nodes and edges, closed exits, reset, all exits closed, disconnected graphs, blocked starts, equal-cost exit and path ties, malformed JSON, language switching, keyboard node selection, reduced motion, and narrow mobile layouts.
