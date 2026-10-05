import type { RouteResult as Result } from '@/lib/types'
import { t, type Language } from '@/lib/i18n'

export function RouteResult({ route, start, language }: { route: Result; start: string; language: Language }) {
  const copy = (key: string) => t(language, key)
  return (
    <div aria-live="polite">
      <div className={`route-status ${route.found ? 'success' : 'warning'}`}>
        <span className="status-dot" aria-hidden="true" />
        <strong>{route.found ? copy('routeFound') : route.reason === 'START_BLOCKED' ? copy('startBlocked') : copy('noRoute')}</strong>
      </div>
      {route.found ? (
        <div className="route-details">
          <div className="metric-grid">
            <div><span>{copy('start')}</span><strong>{start}</strong></div>
            <div><span>{copy('exit')}</span><strong>{route.exitId}</strong></div>
            <div><span>{copy('cost')}</span><strong>{route.cost}<small> {copy('units')}</small></strong></div>
          </div>
          <div className="path-block">
            <span>{copy('path')}</span>
            <p>{route.path.map((id, i) => <span key={`${id}-${i}`}><b>{id}</b>{i < route.path.length - 1 && <i aria-hidden="true">→</i>}</span>)}</p>
          </div>
        </div>
      ) : (
        <div className="empty-route"><p>{route.reason === 'START_BLOCKED' ? copy('startBlockedHint') : copy('noRouteHint')}</p></div>
      )}
    </div>
  )
}
