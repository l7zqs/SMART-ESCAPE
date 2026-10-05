import type { BuildingData, BuildingEdge, BuildingNode } from './types'

// Errors are translation keys, so they show in the selected language.
export type ValidationResult = { valid: true; data: BuildingData } | { valid: false; error: string }

const isNodeType = (v: unknown) => v === 'room' || v === 'junction' || v === 'exit'
const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v)
const isStringArray = (v: unknown): v is string[] =>
  Array.isArray(v) && v.every((item) => typeof item === 'string')
const fail = (error: string): ValidationResult => ({ valid: false, error })

export function validateBuilding(value: unknown): ValidationResult {
  if (!isObject(value)) return fail('errObject')
  if (typeof value.building !== 'string' || !value.building.trim()) return fail('errBuilding')
  if (!Array.isArray(value.nodes) || !Array.isArray(value.edges) || !isObject(value.initial_state)) {
    return fail('errFields')
  }

  const nodeIds = new Set<string>()
  for (const node of value.nodes) {
    if (
      !isObject(node) ||
      typeof node.id !== 'string' || !node.id || nodeIds.has(node.id) ||
      typeof node.label !== 'string' || !node.label.trim() ||
      !isNodeType(node.type) ||
      typeof node.x !== 'number' || !Number.isFinite(node.x) ||
      typeof node.y !== 'number' || !Number.isFinite(node.y)
    ) return fail('errNode')
    nodeIds.add(node.id)
  }
  const nodes = value.nodes as unknown as BuildingNode[]
  if (!nodes.some((n) => n.type === 'exit')) return fail('errNoExit')
  if (!nodes.some((n) => n.type !== 'exit')) return fail('errNoStart')

  const edgeIds = new Set<string>()
  for (const edge of value.edges) {
    if (
      !isObject(edge) ||
      typeof edge.id !== 'string' || !edge.id || edgeIds.has(edge.id) ||
      typeof edge.from !== 'string' || typeof edge.to !== 'string' ||
      !nodeIds.has(edge.from) || !nodeIds.has(edge.to) || edge.from === edge.to ||
      typeof edge.cost !== 'number' || !Number.isInteger(edge.cost) || edge.cost <= 0
    ) return fail('errEdge')
    edgeIds.add(edge.id)
  }
  const edges = value.edges as unknown as BuildingEdge[]

  const state = value.initial_state
  if (!isStringArray(state.blocked_nodes) || !isStringArray(state.blocked_edges) || !isStringArray(state.closed_exits)) {
    return fail('errState')
  }
  const exitIds = new Set(nodes.filter((n) => n.type === 'exit').map((n) => n.id))
  if (
    !state.blocked_nodes.every((id) => nodeIds.has(id)) ||
    !state.blocked_edges.every((id) => edgeIds.has(id)) ||
    !state.closed_exits.every((id) => exitIds.has(id))
  ) return fail('errStateRefs')

  return {
    valid: true,
    data: {
      building: value.building,
      nodes,
      edges,
      initial_state: {
        blocked_nodes: [...state.blocked_nodes],
        blocked_edges: [...state.blocked_edges],
        closed_exits: [...state.closed_exits],
      },
    },
  }
}
