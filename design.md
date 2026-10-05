# Design system

## Philosophy
Map first, controls second. The interface treats the building graph as the primary workspace and keeps simulation controls compact, visible, and reversible.

## Color system
Deep navy backgrounds support long map sessions. Slate borders define structure. Blue identifies rooms, violet identifies junctions, green identifies available exits and active routes, red identifies hazards, and amber identifies selection or warnings.

## Typography
System sans-serif typography keeps the UI fast and readable. Small uppercase labels provide technical hierarchy while route data uses larger, high-contrast values.

## Map visualization
The SVG preserves supplied x/y coordinates. Edge labels show costs; no visual distance is used in routing. Nodes are keyboard-focusable when selectable and have distinct type, route, blocked, and closed states.

## Responsive behavior
Desktop uses a wide map with a fixed-width control rail. At tablet and mobile sizes the layout becomes a vertical sequence: route result, map, start selection, controls, legend, and dataset information.

## Accessibility
Semantic buttons, labels, focus outlines, keyboard-selectable nodes, text labels, and non-color state indicators are used. Reduced motion disables the route dash animation and shortens transitions.

## Animation rules
Motion is limited to route emphasis, hover/focus transitions, and subtle state changes. Nothing flashes or delays access to route information.
