'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { AlertTriangle, ChevronDown, CircleHelp, FileJson, RefreshCcw, Route, Upload, X } from 'lucide-react'
import { HazardControls } from '@/components/hazard-controls'
import { MapView } from '@/components/map-view'
import { RouteResult } from '@/components/route-result'
import { t, type Language } from '@/lib/i18n'
import { findBestRoute } from '@/lib/route'
import { SAMPLE_BUILDING } from '@/lib/sample'
import { cloneHazards, pickStart, toggleValue, type BuildingData, type HazardState } from '@/lib/types'
import { validateBuilding } from '@/lib/validate'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="panel-section">
      <h3 className="section-title">{title}</h3>
      {children}
    </section>
  )
}

export default function Page() {
  const [data, setData] = useState<BuildingData>(SAMPLE_BUILDING)
  const [hazards, setHazards] = useState<HazardState>(() => cloneHazards(SAMPLE_BUILDING.initial_state))
  const [start, setStart] = useState(() => pickStart(SAMPLE_BUILDING, SAMPLE_BUILDING.initial_state))
  const [language, setLanguage] = useState<Language>('en')
  const [errorKey, setErrorKey] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const copy = (key: string) => t(language, key)

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  const route = useMemo(() => findBestRoute(data.nodes, data.edges, start, hazards), [data, hazards, start])
  const startNodes = data.nodes.filter((node) => node.type !== 'exit')

  const toggleHazard = (key: keyof HazardState, id: string) =>
    setHazards((current) => ({ ...current, [key]: toggleValue(current[key], id) }))

  const resetHazards = () => {
    const initial = cloneHazards(data.initial_state)
    setHazards(initial)
    setStart((current) => (initial.blocked_nodes.includes(current) ? pickStart(data, initial) : current))
    setErrorKey('')
  }

  const importFile = (file: File) => {
    const reader = new FileReader()
    reader.onerror = () => setErrorKey('errRead')
    reader.onload = () => {
      let parsed: unknown
      try {
        parsed = JSON.parse(String(reader.result))
      } catch {
        setErrorKey('errJson')
        return
      }
      const result = validateBuilding(parsed)
      if (!result.valid) {
        setErrorKey(result.error)
        return
      }
      setData(result.data)
      setHazards(cloneHazards(result.data.initial_state))
      setStart(pickStart(result.data, result.data.initial_state))
      setErrorKey('')
    }
    reader.readAsText(file)
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark"><Route size={21} aria-hidden="true" /></div>
          <div>
            <h1>Smart Escape</h1>
            <p>{copy('simulator')}</p>
          </div>
        </div>
        <div className="header-actions">
          <div className="building-chip"><span>{copy('activeBuilding')}</span><strong>{data.building}</strong></div>
          <div className="language-toggle" role="group" aria-label={copy('language')}>
            <button className={language === 'en' ? 'selected' : ''} aria-pressed={language === 'en'} onClick={() => setLanguage('en')}>EN</button>
            <button className={language === 'bn' ? 'selected' : ''} aria-pressed={language === 'bn'} onClick={() => setLanguage('bn')} lang="bn">বাংলা</button>
          </div>
          <button className="icon-button" onClick={resetHazards} title={copy('reset')}>
            <RefreshCcw size={17} aria-hidden="true" /><span>{copy('reset')}</span>
          </button>
        </div>
      </header>

      <div className="content-grid">
        <div className="primary-column">
          <div className="intro">
            <div>
              <h2>{copy('headline')}</h2>
              <p>{copy('instructions')}</p>
            </div>
            <div className="import-wrap">
              <input
                ref={fileRef}
                type="file"
                accept="application/json,.json"
                className="sr-only"
                tabIndex={-1}
                onChange={(event) => {
                  const file = event.target.files?.[0]
                  if (file) importFile(file)
                  event.target.value = '' // allow re-importing the same file
                }}
              />
              <div className="import-actions">
                <button className="secondary-button" onClick={() => fileRef.current?.click()}>
                  <Upload size={16} aria-hidden="true" />{copy('import')}
                </button>
              </div>
            </div>
          </div>

          {errorKey && (
            <div className="error-banner" role="alert">
              <AlertTriangle size={17} aria-hidden="true" />
              <div><strong>{copy('invalid')}</strong><p>{copy(errorKey)}</p></div>
              <button onClick={() => setErrorKey('')} aria-label={copy('dismiss')}><X size={16} /></button>
            </div>
          )}

          <MapView data={data} hazards={hazards} route={route} start={start} language={language} onSelect={setStart} />
          <div className="map-caption">
            <span><CircleHelp size={14} aria-hidden="true" /> {copy('mapHint')}</span>
            <span>{copy('simOnly')}</span>
          </div>
        </div>

        <aside className="sidebar">
          <Section title={copy('route')}>
            <RouteResult route={route} start={start} language={language} />
          </Section>

          <Section title={copy('start')}>
            <label className="field-label" htmlFor="start">{copy('selectStart')}</label>
            <div className="select-wrap">
              <select id="start" value={start} onChange={(event) => setStart(event.target.value)}>
                {startNodes.map((node) => {
                  const blocked = hazards.blocked_nodes.includes(node.id)
                  return (
                    <option key={node.id} value={node.id} disabled={blocked}>
                      {node.id} · {node.label}{blocked ? ` · ${copy('blocked')}` : ''}
                    </option>
                  )
                })}
              </select>
              <ChevronDown size={16} aria-hidden="true" />
            </div>
          </Section>

          <Section title={copy('hazards')}>
            <HazardControls data={data} hazards={hazards} language={language} onToggle={toggleHazard} />
          </Section>

          <Section title={copy('legend')}>
            <div className="legend-grid">
              {[['room', 'room'], ['junction', 'junction'], ['exit', 'openExit'], ['blocked', 'blockedNode'], ['closed', 'closedExit'], ['corridor', 'normalCorridor'], ['route', 'selectedRoute']].map(([kind, label]) => (
                <div className="legend-item" key={kind}><span className={`legend-swatch ${kind}`} />{copy(label)}</div>
              ))}
            </div>
          </Section>

          <Section title={copy('dataset')}>
            <div className="dataset-info">
              <FileJson size={16} aria-hidden="true" />
              <div>
                <strong>{data.building}</strong>
                <span>{data.nodes.length} {copy('nodesCount')} · {data.edges.length} {copy('edgesCount')}</span>
              </div>
            </div>
          </Section>
        </aside>
      </div>
    </main>
  )
}
