import { Check, LockKeyhole } from 'lucide-react'
import type { BuildingData, HazardState } from '@/lib/types'
import { t, type Language } from '@/lib/i18n'

type RowProps = {
  label: string
  meta: string
  active: boolean
  activeLabel: string
  inactiveLabel: string
  onToggle: () => void
}

function ToggleRow({ label, meta, active, activeLabel, inactiveLabel, onToggle }: RowProps) {
  return (
    <div className="control-row">
      <div><strong>{label}</strong><small>{meta}</small></div>
      <button className={`mini-button ${active ? 'danger' : ''}`} onClick={onToggle} aria-pressed={active}>
        {active ? <><LockKeyhole size={14} aria-hidden="true" />{activeLabel}</> : <><Check size={14} aria-hidden="true" />{inactiveLabel}</>}
      </button>
    </div>
  )
}

type Props = {
  data: BuildingData
  hazards: HazardState
  language: Language
  onToggle: (key: keyof HazardState, id: string) => void
}

export function HazardControls({ data, hazards, language, onToggle }: Props) {
  const copy = (key: string) => t(language, key)
  const exits = data.nodes.filter((n) => n.type === 'exit')
  const others = data.nodes.filter((n) => n.type !== 'exit')
  return (
    <>
      <div className="subheading">{copy('nodes')}</div>
      {others.map((node) => (
        <ToggleRow key={node.id} label={node.id} meta={node.label} active={hazards.blocked_nodes.includes(node.id)}
          activeLabel={copy('unblock')} inactiveLabel={copy('block')} onToggle={() => onToggle('blocked_nodes', node.id)} />
      ))}
      <div className="subheading spaced">{copy('corridors')}</div>
      {data.edges.map((edge) => (
        <ToggleRow key={edge.id} label={`${edge.from} — ${edge.to}`} meta={`${edge.id} · ${edge.cost} ${copy('cost')}`}
          active={hazards.blocked_edges.includes(edge.id)} activeLabel={copy('unblock')} inactiveLabel={copy('block')}
          onToggle={() => onToggle('blocked_edges', edge.id)} />
      ))}
      <div className="subheading spaced">{copy('exits')}</div>
      {exits.map((node) => (
        <ToggleRow key={node.id} label={node.id} meta={node.label} active={hazards.closed_exits.includes(node.id)}
          activeLabel={copy('reopen')} inactiveLabel={copy('close')} onToggle={() => onToggle('closed_exits', node.id)} />
      ))}
    </>
  )
}
