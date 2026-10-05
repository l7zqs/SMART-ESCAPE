export type NodeType = 'room' | 'junction' | 'exit'
export type BuildingNode = { id: string; label: string; type: NodeType; x: number; y: number }
export type BuildingEdge = { id: string; from: string; to: string; cost: number }
export type HazardState = {
  blocked_nodes: string[]
  blocked_edges: string[]
  closed_exits: string[]
}
export type BuildingData = {
  building: string
  nodes: BuildingNode[]
  edges: BuildingEdge[]
  initial_state: HazardState
}
export type RouteResult =
  | { found: true; path: string[]; exitId: string; cost: number }
  | { found: false; reason: 'NO_ROUTE' | 'START_BLOCKED' }

export const cloneHazards = (state: HazardState): HazardState => ({
  blocked_nodes: [...state.blocked_nodes],
  blocked_edges: [...state.blocked_edges],
  closed_exits: [...state.closed_exits],
})

export const toggleValue = (values: string[], value: string) =>
  values.includes(value) ? values.filter((item) => item !== value) : [...values, value]

/** First room/junction that is not blocked by the given hazards. */
export const pickStart = (data: BuildingData, hazards: HazardState) =>
  data.nodes.find((n) => n.type !== 'exit' && !hazards.blocked_nodes.includes(n.id))?.id ??
  data.nodes.find((n) => n.type !== 'exit')?.id ??
  ''
