Build a complete, polished frontend-only web application called:

SMART ESCAPE
Interactive Evacuation Route Simulator

This is a competition project, so prioritize:
1. Correct functionality
2. Exact routing logic
3. Clean and professional UI
4. Responsive design
5. Fast implementation
6. Maintainable, organized code
7. No unnecessary features or over-engineering

The application must work entirely in the browser with no backend, database, authentication, or external API.

==================================================
1. PROJECT GOAL
==================================================

Smart Escape is an interactive building evacuation route simulator.

The application receives a building.json dataset containing:
- Building name
- Rooms
- Junctions
- Exits
- Weighted corridors/edges
- Initial hazard state

The user can:
- View the building graph/map
- Select a starting room/junction
- Find the lowest-cost route to an accessible exit
- Block/unblock rooms or junctions
- Block/unblock corridors
- Close/reopen exits
- See the route update immediately
- Reset everything to the original initial_state
- Switch between English and Bangla

The application is an educational simulation only.

Do NOT implement real fire detection, hazard prediction, AI evacuation prediction, or real-world emergency planning.

==================================================
2. RECOMMENDED TECH STACK
==================================================

Use:

- React
- TypeScript
- Vite
- Tailwind CSS
- Lucide React icons
- SVG for the interactive map

Do NOT use a backend.

Do NOT use:
- Firebase
- MongoDB
- Supabase
- Express
- External APIs
- Authentication
- Remote databases

All data and calculations must happen locally in the browser.

Keep dependencies minimal.

==================================================
3. IMPORTANT CONTEST CONSTRAINTS
==================================================

This is a frontend-only challenge.

The application must:
- Run completely offline after loading the app
- Work without login
- Work without a backend
- Work without external APIs
- Load the supplied building.json locally
- Be deployable as a static website
- Work on the latest Chrome
- Be responsive on desktop, tablet and mobile

Do not create unnecessary architecture.

Do not add fake backend/API functionality.

==================================================
4. PROJECT STRUCTURE
==================================================

Organize the project cleanly.

Suggested structure:

src/
  components/
    Header.tsx
    BuildingMap.tsx
    Node.tsx
    Edge.tsx
    RoutePanel.tsx
    ControlPanel.tsx
    HazardControls.tsx
    StatusMessage.tsx
    Legend.tsx
    DatasetInfo.tsx
    LanguageToggle.tsx

  data/
    building.json

  hooks/
    useBuilding.ts
    useRoute.ts

  utils/
    graph.ts
    routing.ts
    validation.ts
    i18n.ts

  types/
    building.ts

  App.tsx
  main.tsx
  index.css

Also create:

README.md
LICENSE
design.md
skill.md

Keep files reasonably small and responsibilities separated.

==================================================
5. DATA FORMAT
==================================================

The application must support this JSON structure:

{
  "building": "Building Name",

  "nodes": [
    {
      "id": "R1",
      "label": "Room 1",
      "type": "room",
      "x": 100,
      "y": 100
    },
    {
      "id": "C1",
      "label": "Corridor 1",
      "type": "junction",
      "x": 200,
      "y": 100
    },
    {
      "id": "E1",
      "label": "Exit 1",
      "type": "exit",
      "x": 300,
      "y": 100
    }
  ],

  "edges": [
    {
      "id": "edge-1",
      "from": "R1",
      "to": "C1",
      "cost": 4
    }
  ],

  "initial_state": {
    "blocked_nodes": [],
    "blocked_edges": [],
    "closed_exits": []
  }
}

Important:

Do not assume exact node names, labels, coordinates, or graph size.

The judges may use unseen datasets using the same schema.

The application must work with different valid datasets.

==================================================
6. INPUT VALIDATION
==================================================

Validate the imported JSON before using it.

Required:

- building must be a non-empty string
- nodes must be an array
- every node must have:
  - unique id
  - non-empty label
  - valid type
  - numeric x
  - numeric y

Valid node types:

- room
- junction
- exit

Edges must:
- have unique IDs
- reference valid node IDs
- contain a positive integer cost

initial_state must contain:

- blocked_nodes
- blocked_edges
- closed_exits

These arrays may be empty.

Reject malformed datasets gracefully.

Show a clear error message instead of crashing.

Do not silently modify invalid input.

==================================================
7. IMPORT AND MAP
==================================================

Provide a way to import building.json locally.

The map must display:

- Every node
- Every edge/corridor
- Node labels
- Corridor costs
- Node types
- Supplied x/y coordinates

Use SVG for the map.

Do NOT use the coordinates as routing cost.

Coordinates are only for visual positioning.

The number of corridors is NOT the route cost.

The route cost is ONLY the sum of edge costs.

==================================================
8. MAP DESIGN
==================================================

Create a professional interactive map.

Visual hierarchy:

ROOM:
- blue/neutral circular or rounded node

JUNCTION:
- another clearly distinguishable node style

EXIT:
- green node

BLOCKED NODE:
- red/danger appearance
- visually disabled
- preferably show a lock/block indicator

CLOSED EXIT:
- red/gray appearance
- clearly distinguishable from an available exit

BLOCKED EDGE:
- red/dashed/struck-through appearance

NORMAL EDGE:
- subtle gray/blue line

ACTIVE ROUTE:
- strong highlighted line
- animated flow/dash is allowed but keep it subtle

Route nodes should also receive a clear highlight.

Every edge should display its cost.

Do not make the UI look like a generic dashboard.

The map should be the primary visual focus.

==================================================
9. RESPONSIVE MAP
==================================================

The map must work on:

- Desktop
- Tablet
- Mobile

Do not allow the SVG to overflow horizontally.

Use a responsive container.

On small screens:
- controls can stack vertically
- map remains usable
- labels should remain readable
- route information should remain accessible

==================================================
10. START LOCATION
==================================================

The user must be able to select an unblocked:

- room
- junction

as the starting location.

Exit nodes cannot be selected as starting locations.

When a node is selected:
- visually highlight it
- calculate the best route immediately

If the selected starting node later becomes blocked:

Display:

"Starting location blocked"

Bangla:

"শুরুর অবস্থান ব্লক করা হয়েছে"

Do not calculate a route while the starting location is blocked.

==================================================
11. ROUTING ALGORITHM
==================================================

This is one of the MOST IMPORTANT requirements.

Implement a correct weighted shortest-path algorithm.

Use Dijkstra's algorithm.

The graph is undirected.

Every edge has a positive integer cost.

Route cost:

TOTAL COST = SUM OF EDGE COSTS

Never use:
- coordinate distance
- number of corridors
- visual distance

as a substitute for cost.

==================================================
12. HAZARD RULES
==================================================

Blocked rooms and junctions:

A blocked room or junction:
- cannot be entered
- cannot be crossed
- cannot be used as a starting location
- makes all incident edges unusable

Blocked node = remove the node and all its connected edges from the usable graph.

Blocked corridor:

A blocked edge removes ONLY that connection.

Its endpoint nodes remain usable.

Example:

If C1-C2 is blocked:
- C1 remains usable
- C2 remains usable
- other corridors connected to C1/C2 remain usable

Closed exit:

A closed exit cannot be used as a destination.

A closed exit should also not be treated as a valid intermediate destination.

The route must end only at an accessible/open exit.

==================================================
13. EXIT SELECTION / TIE BREAKING
==================================================

After calculating shortest paths, choose the reachable OPEN exit with the minimum total cost.

If multiple exits have the same minimum cost:

Choose the lexicographically smallest exit ID.

Example:

E1 and E2 both cost 10.

Choose E1.

If paths to the same exit have equal cost:

Choose the lexicographically smallest sequence of node IDs.

Example:

R1 -> C2 -> E1

versus

R1 -> C10 -> E1

Compare node ID sequences lexicographically and choose the correct smallest sequence.

Implement deterministic tie-breaking.

The result must always be predictable.

==================================================
14. ROUTE RESULT
==================================================

When a route exists, display:

Starting node
Route sequence
Destination exit
Total cost

Example:

Start:
R1

Route:
R1 → C1 → C2 → E1

Exit:
E1

Cost:
7

The active route must be highlighted on the map.

==================================================
15. NO ROUTE CASE
==================================================

If no open exit is reachable:

English:

"No route available"

Bangla:

"কোনো পথ পাওয়া যায়নি"

Do not show a fake route.

Clear the previously highlighted route.

The map should clearly communicate that no route currently exists.

==================================================
16. LIVE HAZARD CHANGES
==================================================

Every change must immediately recalculate the route.

The user must NOT need to reload the page.

Examples:

Block C2
→ calculate new route immediately

Unblock C2
→ restore possible route immediately

Block corridor
→ calculate new route immediately

Close E1
→ choose another reachable exit

Reopen E1
→ calculate the best route again

Change starting node
→ calculate immediately

==================================================
17. HAZARD CONTROL UI
==================================================

Provide an easy-to-understand control panel.

Users should be able to:

### Nodes
- Block node
- Unblock node

### Corridors
- Block edge
- Unblock edge

### Exits
- Close exit
- Reopen exit

Controls must clearly show current state.

Do not make the user edit JSON manually to change hazards.

The interaction should feel like a simulator.

==================================================
18. RESET
==================================================

Provide a Reset button.

Reset must restore the EXACT original:

initial_state

from the imported dataset.

It must restore:

- blocked nodes
- blocked edges
- closed exits

Do not simply clear everything unless the original initial_state was empty.

Example:

initial_state:

blocked_nodes: ["C2"]
blocked_edges: ["edge-4"]
closed_exits: ["E1"]

After Reset, exactly those states must return.

Recalculate the route after reset.

==================================================
19. LANGUAGE SUPPORT
==================================================

Provide:

English / বাংলা

toggle.

All principal UI text must support both languages.

Translate:

- Header
- Instructions
- Buttons
- Route information
- Status messages
- Error messages
- Hazard controls
- Reset
- Import
- Starting location
- Exit
- Cost
- Blocked
- Closed
- Available
- No route available
- Starting location blocked
- Legend
- Dataset information

Dataset-provided labels do NOT need translation.

Example:

English:
"No route available"

Bangla:
"কোনো পথ পাওয়া যায়নি"

English:
"Starting location blocked"

Bangla:
"শুরুর অবস্থান ব্লক করা হয়েছে"

Use a simple centralized translation object.

Do not duplicate UI components just for languages.

==================================================
20. UI / UX DESIGN
==================================================

Create a premium, modern competition-quality interface.

Design direction:

- Clean
- Professional
- Minimal
- Technical
- Map-focused
- High readability
- No excessive gradients
- No excessive glassmorphism
- No unnecessary animations
- No AI-generated-looking generic dashboard design

Suggested visual style:

Dark navy / slate interface with subtle blue accents and green/red status colors.

However, prioritize accessibility and readability over decoration.

The UI should feel like a real simulation tool rather than a template.

==================================================
21. MAIN LAYOUT
==================================================

Desktop:

------------------------------------------------
HEADER
Smart Escape        Building Name
English | বাংলা    Reset
------------------------------------------------

LEFT / MAIN:
Interactive Building Map

RIGHT:
Route Result
Start Selection
Hazard Controls
Legend
Dataset Information

------------------------------------------------

Mobile:

HEADER

Route Result

Interactive Map

Start Selection

Hazard Controls

Legend

==================================================
22. HEADER
==================================================

Show:

SMART ESCAPE

Subtitle:

Interactive Evacuation Route Simulator

Also show:

- Building name
- Language toggle
- Reset button

Keep the header compact.

==================================================
23. ROUTE PANEL
==================================================

Show a prominent route summary.

If route exists:

"Route Found"

Start:
R1

Exit:
E1

Cost:
7

Path:
R1 → C1 → C2 → E1

If no route:

"No route available"

If start blocked:

"Starting location blocked"

Use clear status indicators.

==================================================
24. START SELECTION
==================================================

Provide a select/dropdown or clickable node selection.

Only allow:

room
junction

that are currently unblocked.

Blocked nodes should either be disabled in the selection list or clearly marked.

The currently selected node must be obvious.

Clicking a valid node on the map should also select it.

==================================================
25. HAZARD CONTROLS
==================================================

Organize controls into sections:

Node Hazards
- list nodes
- block/unblock buttons

Corridor Hazards
- list corridors
- block/unblock buttons

Exit Status
- list exits
- close/reopen buttons

Avoid making the control panel unnecessarily huge.

Use compact cards, dropdowns or accordions if needed.

==================================================
26. LEGEND
==================================================

Show a small legend explaining:

Room
Junction
Open Exit
Blocked Node
Closed Exit
Normal Corridor
Blocked Corridor
Selected Route

The legend must also support Bangla.

==================================================
27. ANIMATIONS
==================================================

Use subtle animations only.

Allowed:
- node selection transition
- route highlight transition
- panel transitions
- subtle edge animation for active route
- hazard state transition

Avoid:
- flashing
- excessive motion
- slow transitions
- distracting effects

Respect:

prefers-reduced-motion

==================================================
28. SAMPLE DATA
==================================================

Include a sample building.json matching the challenge example.

The sample must demonstrate:

Baseline:

R1 → C1 → C2 → E1
Cost: 7

After blocking C2:

R1 → C1 → C3 → C4 → E2
Cost: 11

Also ensure these cases work:

1. Baseline
Select R1

Expected:
R1 - C1 - C2 - E1
Cost: 7

2. Blocked junction
Select R1
Block C2

Expected:
R1 - C1 - C3 - C4 - E2
Cost: 11

3. Exits closed
Select R1
Close E1 and E2

Expected:
No route available

4. Different start
Select R2

Expected:
R2 - C3 - C4 - E2
Cost: 7

5. Blocked start
Select R1
Then block R1

Expected:
Starting location blocked

==================================================
29. IMPORTANT TESTING
==================================================

Before considering the project complete, manually test:

- JSON import
- Invalid JSON
- Missing fields
- Duplicate node IDs
- Invalid edge references
- Negative/zero edge costs
- Baseline route
- Multiple exits
- Multiple equal-cost exits
- Equal-cost paths
- Blocked node
- Unblocked node
- Blocked edge
- Unblocked edge
- Closed exit
- Reopened exit
- All exits closed
- Disconnected graph
- Starting node blocked
- Reset
- Language switching
- Mobile layout

Do not assume the sample dataset is the only dataset.

==================================================
30. ACCESSIBILITY
==================================================

Use:

- Semantic HTML
- Keyboard accessible buttons
- Visible focus states
- Accessible labels
- Sufficient contrast
- aria-label where appropriate
- Do not rely only on color to communicate state

The application should remain usable with reduced motion.

==================================================
31. PERFORMANCE
==================================================

The dataset can contain approximately:

2–60 nodes
1–150 edges

The application should comfortably handle this size.

Do not implement unnecessary complex rendering engines.

SVG is sufficient.

Routing should run instantly for these dataset sizes.

==================================================
32. CODE QUALITY
==================================================

Use TypeScript properly.

Create types for:

Node
Edge
InitialState
BuildingData
RouteResult
HazardState

Do not use:

any

unless absolutely unavoidable.

Keep routing logic independent from UI.

Example:

findBestRoute(
  nodes,
  edges,
  startNodeId,
  hazardState
)

should return something similar to:

{
  found: true,
  path: ["R1", "C1", "C2", "E1"],
  exitId: "E1",
  cost: 7
}

For failure:

{
  found: false,
  reason: "NO_ROUTE"
}

or:

{
  found: false,
  reason: "START_BLOCKED"
}

==================================================
33. STATE MANAGEMENT
==================================================

Do not introduce Redux or other heavy state management unless genuinely necessary.

React state/hooks are enough.

Maintain a clear separation between:

Original imported data
+
Current hazard state
+
Selected start
+
Calculated route
+
Language

Never mutate the original initial_state directly.

Keep original data immutable.

==================================================
34. DESIGN.MD
==================================================

Create a design.md file.

Document:

- Design philosophy
- Color system
- Typography
- Map visualization rules
- Node states
- Edge states
- Route visualization
- Responsive behavior
- Accessibility decisions
- Animation rules

The design should emphasize:

"Map first, controls second."

==================================================
35. SKILL.MD
==================================================

Create skill.md documenting implementation knowledge.

Include:

- React architecture
- TypeScript types
- SVG map rendering
- Dijkstra algorithm
- Graph representation
- Hazard filtering
- Exit selection
- Tie-breaking logic
- State management
- JSON validation
- Internationalization
- Accessibility
- Testing checklist

This file should help another developer understand how the application works.

==================================================
36. README.MD
==================================================

Create a professional README.

Include:

# Smart Escape

Short description.

## Features

## Tech Stack

## How It Works

## Routing Algorithm

## Hazard Simulation

## Supported JSON Format

## Running Locally

Example:

npm install
npm run dev

## Build

npm run build

## Deployment

Explain how to deploy to:

- GitHub Pages
- Vercel
- Netlify
- Cloudflare Pages

No backend is required.

==================================================
37. LICENSE
==================================================

Add an MIT LICENSE file.

==================================================
38. VISUAL QUALITY REQUIREMENT
==================================================

Do NOT produce an "AI slop" interface.

Avoid:

- excessive gradients
- random glowing cards
- huge hero sections
- unnecessary statistics
- fake analytics
- fake users
- fake activity
- unnecessary charts
- excessive rounded containers
- random icons everywhere
- generic SaaS dashboard appearance
- excessive glassmorphism

This is an evacuation map simulator.

The interactive map and routing result should be the visual center of the application.

Make the design feel intentionally designed by a developer/designer.

==================================================
39. NO UNNECESSARY FEATURES
==================================================

Do NOT add:

- Login
- Signup
- User profiles
- Database
- Backend
- Chatbot
- AI assistant
- Fire prediction
- Weather
- Notifications
- Analytics
- Payment
- Admin dashboard

unless explicitly required.

Focus only on the challenge requirements.

==================================================
40. FINAL ACCEPTANCE CRITERIA
==================================================

The project is complete only if:

[ ] Application runs successfully
[ ] No TypeScript errors
[ ] No console errors
[ ] building.json can be imported
[ ] All nodes render at supplied coordinates
[ ] All edges render
[ ] Edge costs are visible
[ ] Room/junction/exit types are visually distinct
[ ] User can select a start
[ ] Dijkstra finds lowest-cost route
[ ] Route cost uses edge costs only
[ ] Blocked nodes are excluded
[ ] Blocked edges are excluded
[ ] Closed exits are excluded
[ ] Open exit with minimum cost is selected
[ ] Exit ID lexicographic tie-breaking works
[ ] Path lexicographic tie-breaking works
[ ] Route updates immediately
[ ] No route state works
[ ] Starting location blocked state works
[ ] Reset restores original initial_state
[ ] English mode works
[ ] Bangla mode works
[ ] Mobile layout works
[ ] Keyboard accessibility works
[ ] Reduced motion is respected
[ ] Invalid input is handled
[ ] README exists
[ ] design.md exists
[ ] skill.md exists
[ ] LICENSE exists
[ ] Project can be built for static hosting

==================================================
41. IMPORTANT IMPLEMENTATION INSTRUCTION
==================================================

Before writing the application:

1. Understand the requirements completely.
2. Create the data types.
3. Create the graph/routing logic.
4. Create validation utilities.
5. Create the UI.
6. Connect state and routing.
7. Add bilingual support.
8. Test all required scenarios.
9. Polish the responsive UI.
10. Verify the production build.

Do not create unnecessary abstractions.

Do not leave TODO placeholders.

Do not use mock functionality for required features.

Everything described above must be implemented and functional.

If a requirement conflicts with visual design preferences, correctness and the exact routing rules take priority.

The final result should look like a polished competition submission, not a tutorial/demo project.


after that

Do a complete audit of the entire application.

Review the app as if you are a senior frontend engineer, UX designer, and code reviewer. Check the whole project—not just the homepage or visual design.

1. Overall App Review

Inspect every page, component, feature, interaction, and user flow.

Check:

- UI/UX consistency
- Navigation and user flow
- Responsive behavior on mobile, tablet, and desktop
- Accessibility
- Loading, error, empty, and success states
- Animations and transitions
- Performance
- Component structure
- Code organization
- Reusability
- Maintainability
- Security issues
- Unnecessary dependencies or duplicated code

2. Detect AI-Slop

Look specifically for anything that makes the app feel AI-generated, generic, overly polished, or template-like.

Check for:

- Generic AI-generated layouts
- Excessive gradients, glow, glassmorphism, shadows, or unnecessary effects
- Overuse of rounded cards
- Repetitive card-based layouts
- Fake-looking statistics or unnecessary sections
- Generic marketing copy
- Unnatural wording
- Excessive emojis or icons
- Unnecessary animations
- Inconsistent spacing or typography
- Too many visual elements competing for attention
- Design patterns that look copied from common AI website templates
- Components that exist only for decoration and don't improve usability
- Over-engineered UI
- Unnecessary buttons or interactions
- Anything that makes the product feel like a "vibe-coded" project rather than a real product

For every AI-slop issue you find, tell me:

1. Where it is
2. Why it feels AI-generated/generic
3. What should be changed
4. A better design/implementation direction

3. Design Quality

Evaluate whether the visual design feels intentional and human-designed.

Check:

- Typography hierarchy
- Font sizes and weights
- Spacing system
- Color usage
- Contrast
- Border radius
- Shadows
- Icons
- Buttons
- Cards
- Forms
- Navigation
- Visual hierarchy
- Information density

Do not add design effects just to make the UI look impressive. Prefer a clean, purposeful, professional design.

4. UX Review

Try to use the application like a real user.

Identify:

- Confusing interactions
- Unnecessary steps
- Missing feedback
- Poor navigation
- Unclear buttons
- Missing states
- Bad mobile interactions
- Accessibility problems
- Places where users may not know what to do next

5. Code Review

Review the actual implementation as well.

Look for:

- Duplicate code
- Poor component structure
- Large components that should be split
- Bad naming
- Unnecessary abstractions
- Hardcoded values that should be configurable
- Unused code
- Unused dependencies
- Poor error handling
- Performance problems
- Incorrect state management
- Security issues
- Poor API handling

Do not rewrite working code unnecessarily. Only recommend changes that provide a real benefit.

6. Content Review

Check all visible text.

Identify:

- Generic AI-style copy
- Unnatural wording
- Repeated phrases
- Unnecessary descriptions
- Overly promotional language
- Placeholder-like content
- Grammar or clarity issues

Rewrite only where necessary and keep the language natural and human.

7. Prioritized Improvements

After the audit, give me a prioritized list:

🔴 Critical — Must fix
🟠 Important — Should fix
🟡 Improvement — Nice to have
🟢 Optional — Only if it adds real value

For every recommendation, explain the reason and expected benefit.

8. Final Verdict

At the end, give the application an overall score out of 10 for:

- UI/Visual Design
- UX
- Responsiveness
- Accessibility
- Performance
- Code Quality
- Real-world/Product Quality
- AI-Slop Level

Then answer:

"If I showed this project to a university teacher, recruiter, or professional developer, what would make them think this is AI-generated or amateur?"

Be honest and critical. Do not praise something just because it looks visually impressive.

Important Rules

- Do NOT redesign everything automatically.
- Do NOT add unnecessary features.
- Do NOT use trendy design patterns just because they are popular.
- Do NOT make the app more complicated without a clear reason.
- Preserve the existing project's identity and purpose.
- Prefer simple, intentional, human-looking design.
- Keep the existing good parts.
- Only recommend changes that meaningfully improve the product.
- If something is already good, explicitly say "Keep this as it is."
- Before making changes, inspect the existing implementation and understand how the app works.
- If a change affects multiple components, explain the impact before implementing it.
- Keep the code clean and organized.
- Avoid AI-slop while fixing AI-slop.

First, audit the entire application and give me the findings.

Do not start changing code until the audit is complete.

 i
