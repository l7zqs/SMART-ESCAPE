import { MapPin } from 'lucide-react'
import type { BuildingData, HazardState, RouteResult } from '@/lib/types'
import { t, type Language } from '@/lib/i18n'

const palette = { room: '#5b8def', junction: '#9a8cf2', exit: '#39c98a' }
const pairKey = (a: string, b: string) => [a, b].sort().join('::')

type Props = {
  data: BuildingData
  hazards: HazardState
  route: RouteResult
  start: string
  language: Language
  onSelect: (id: string) => void
}

export function MapView({ data, hazards, route, start, language, onSelect }: Props) {
  const copy = (key: string) => t(language, key)
  const blockedNodes = new Set(hazards.blocked_nodes)
  const blockedEdges = new Set(hazards.blocked_edges)
  const nodesById = new Map(data.nodes.map((node) => [node.id, node]))

  const pathEdges = new Set<string>()
  if (route.found) route.path.slice(1).forEach((id, i) => pathEdges.add(pairKey(route.path[i], id)))

  // Fit the view to the dataset's own coordinates (labels need room below nodes).
  const xs = data.nodes.map((n) => n.x)
  const ys = data.nodes.map((n) => n.y)
  const vx = Math.min(...xs) - 80
  const vy = Math.min(...ys) - 70
  const vw = Math.max(Math.max(...xs) - Math.min(...xs) + 160, 320)
  const vh = Math.max(Math.max(...ys) - Math.min(...ys) + 170, 220)

  return (
    <div className="map-shell">
      <div className="map-toolbar">
        <span><MapPin size={14} aria-hidden="true" /> {copy('mapTitle')}</span>
        <span className="map-coords">{copy('coordsNote')}</span>
      </div>
      <div className="map-canvas">
        <svg
          viewBox={`${vx} ${vy} ${vw} ${vh}`}
          style={{ aspectRatio: `${vw} / ${vh}` }}
          role="group"
          aria-label={copy('mapLabel')}
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#1d2a40" strokeWidth="1" />
            </pattern>
            {/* userSpaceOnUse: a default box-based filter region collapses on straight horizontal/vertical lines */}
            <filter id="routeGlow" filterUnits="userSpaceOnUse" x={vx} y={vy} width={vw} height={vh}>
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <rect x={vx} y={vy} width={vw} height={vh} fill="url(#grid)" />

          {data.edges.map((edge) => {
            const from = nodesById.get(edge.from)!
            const to = nodesById.get(edge.to)!
            const blocked = blockedEdges.has(edge.id) || blockedNodes.has(edge.from) || blockedNodes.has(edge.to)
            const active = !blocked && pathEdges.has(pairKey(edge.from, edge.to))
            const mx = (from.x + to.x) / 2
            const my = (from.y + to.y) / 2
            return (
              <g key={edge.id}>
                <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} className={`edge ${blocked ? 'edge-blocked' : active ? 'edge-active' : ''}`} />
                <rect x={mx - 17} y={my - 12} width="34" height="22" rx="5" className="cost-bg" />
                <text x={mx} y={my + 4} textAnchor="middle" className="edge-cost">{edge.cost}</text>
              </g>
            )
          })}

          {data.nodes.map((node) => {
            const isExit = node.type === 'exit'
            const blocked = blockedNodes.has(node.id)
            const closed = isExit && hazards.closed_exits.includes(node.id)
            const onRoute = route.found && route.path.includes(node.id)
            const selected = node.id === start
            const selectable = !isExit && !blocked
            const states = [
              copy(node.type),
              blocked && copy('blocked'),
              closed && copy('closed'),
              selected && copy('selected'),
              onRoute && copy('onRoute'),
            ].filter(Boolean).join(', ')
            return (
              <g
                key={node.id}
                className={`node ${blocked ? 'node-blocked' : ''} ${closed ? 'node-closed' : ''} ${onRoute ? 'node-route' : ''}`}
                tabIndex={selectable ? 0 : -1}
                role={selectable ? 'button' : 'img'}
                aria-pressed={selectable ? selected : undefined}
                aria-label={`${node.label} (${node.id}) — ${states}`}
                onClick={() => selectable && onSelect(node.id)}
                onKeyDown={(event) => {
                  if (selectable && (event.key === 'Enter' || event.key === ' ')) {
                    event.preventDefault()
                    onSelect(node.id)
                  }
                }}
              >
                <circle cx={node.x} cy={node.y} r={isExit ? 28 : 24} fill={blocked || closed ? '#6b3545' : palette[node.type]} className="node-circle" />
                <circle cx={node.x} cy={node.y} r="33" fill="none" className={selected ? 'selected-ring' : ''} />
                <text x={node.x} y={node.y + 5} textAnchor="middle" className="node-id">{blocked || closed ? '×' : node.id}</text>
                <text x={node.x} y={node.y + 52} textAnchor="middle" className="node-label">{node.label}</text>
              </g>
            )
          })}
        </svg>
      </div>
    </div>
  )
}
