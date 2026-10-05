# Smart Escape

Smart Escape is a frontend-only interactive evacuation route simulator. It loads a building graph locally, applies hazard changes in real time, and finds the lowest-cost route to an accessible exit.

## Features
- SVG building graph with accessible interactions
- Deterministic Dijkstra routing with weighted corridors
- Block nodes, corridors, and exits live
- Exact reset to imported `initial_state`
- Local JSON import with validation
- English and Bangla UI
- Responsive, static-host friendly build

## Tech Stack
Next.js (static export), React, TypeScript, SVG, and Lucide React. No backend, database, authentication, or external API is used.

## How It Works
Nodes use supplied coordinates for visualization only. Routes are calculated on the undirected graph using only positive integer edge costs. Blocked nodes remove their incident connections; blocked edges remove one connection; closed exits cannot be destinations.

## Routing Algorithm
Dijkstra's algorithm selects the reachable open exit with minimum total edge cost. Ties are deterministic: exit IDs are compared lexicographically, then node-ID path sequences are compared lexicographically.

## Hazard Simulation
Use the right control panel to block or unblock nodes and corridors, or close and reopen exits. Results update immediately. Reset restores the exact dataset-provided initial state.

## Supported JSON Format
See [`public/building.json`](./public/building.json) for a complete example. The app loads this same file as its built-in sample, and validates every imported file (unique IDs, valid endpoints, positive integer costs, at least one exit, and `initial_state` references that exist).

## Running Locally
```bash
pnpm install
pnpm dev
```

## Build
```bash
pnpm build   # static site is written to ./out
```

## Deployment
The build uses `output: 'export'`, so `./out` is plain static HTML/JS/CSS. Upload it to Vercel, Netlify, Cloudflare Pages, or GitHub Pages (publish the `out` folder).

## Educational Notice
This is an educational simulation only. It is not fire detection, hazard prediction, or real-world emergency planning software.
