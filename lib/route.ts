import type { BuildingEdge, BuildingNode, HazardState, RouteResult } from './types'

type Candidate = { cost: number; path: string[] }

const comparePath = (a: string[], b: string[]) => {
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    if (a[i] !== b[i]) return a[i] < b[i] ? -1 : 1
  }
  return a.length - b.length
}

/**
 * Dijkstra on the undirected graph. Equal-cost ties are broken by comparing
 * node-ID paths lexicographically; equal-cost exits by exit ID, then path.
 */
export function findBestRoute(
  nodes: BuildingNode[],
  edges: BuildingEdge[],
  startId: string,
  hazards: HazardState,
): RouteResult {
  const blockedNodes = new Set(hazards.blocked_nodes)
  const blockedEdges = new Set(hazards.blocked_edges)
  const closedExits = new Set(hazards.closed_exits)

  if (blockedNodes.has(startId)) return { found: false, reason: 'START_BLOCKED' }
  if (!nodes.some((n) => n.id === startId)) return { found: false, reason: 'NO_ROUTE' }

  const neighbours = new Map<string, { to: string; cost: number }[]>()
  for (const edge of edges) {
    if (blockedEdges.has(edge.id) || blockedNodes.has(edge.from) || blockedNodes.has(edge.to)) continue
    if (!neighbours.has(edge.from)) neighbours.set(edge.from, [])
    if (!neighbours.has(edge.to)) neighbours.set(edge.to, [])
    neighbours.get(edge.from)!.push({ to: edge.to, cost: edge.cost })
    neighbours.get(edge.to)!.push({ to: edge.from, cost: edge.cost })
  }

  const best = new Map<string, Candidate>([[startId, { cost: 0, path: [startId] }]])
  const queue: (Candidate & { id: string })[] = [{ id: startId, cost: 0, path: [startId] }]

  while (queue.length) {
    queue.sort((a, b) => a.cost - b.cost || comparePath(a.path, b.path))
    const current = queue.shift()!
    const known = best.get(current.id)!
    if (known.cost !== current.cost || comparePath(known.path, current.path) !== 0) continue // stale entry

    for (const { to, cost } of neighbours.get(current.id) ?? []) {
      const candidate: Candidate = { cost: current.cost + cost, path: [...current.path, to] }
      const previous = best.get(to)
      if (
        !previous ||
        candidate.cost < previous.cost ||
        (candidate.cost === previous.cost && comparePath(candidate.path, previous.path) < 0)
      ) {
        best.set(to, candidate)
        queue.push({ id: to, ...candidate })
      }
    }
  }

  const reachableExits = nodes
    .filter((n) => n.type === 'exit' && !closedExits.has(n.id) && best.has(n.id))
    .map((n) => ({ id: n.id, ...best.get(n.id)! }))
    .sort((a, b) => a.cost - b.cost || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0) || comparePath(a.path, b.path))

  const winner = reachableExits[0]
  return winner
    ? { found: true, path: winner.path, exitId: winner.id, cost: winner.cost }
    : { found: false, reason: 'NO_ROUTE' }
}
