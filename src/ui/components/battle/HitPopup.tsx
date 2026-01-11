import { h } from 'preact'
import { useEffect, useState } from 'preact/hooks'
import './HitPopup.css'

export type HitPopupPayload = {
  id?: string
  x: number
  y: number
  value: number
  critical?: boolean
}

export const POPUP_LIFETIME_MS = 600

export function createHitPopupManager() {
  let popups: HitPopupPayload[] = []
  const subscribers: Array<(p: HitPopupPayload[]) => void> = []

  function notify() {
    for (const s of subscribers) s(popups.slice())
  }

  function add(payload: Omit<HitPopupPayload, 'id'>) {
    const p: HitPopupPayload = { ...payload, id: String(Date.now()) + '-' + Math.random().toString(36).slice(2, 8) }
    popups.push(p)
    notify()
    setTimeout(() => {
      popups = popups.filter((x) => x.id !== p.id)
      notify()
    }, POPUP_LIFETIME_MS)
    return p
  }
  function get() {
    return popups.slice()
  }
  function clear() {
    popups = []
    notify()
  }
  function subscribe(cb: (p: HitPopupPayload[]) => void) {
    subscribers.push(cb)
    cb(get())
    return () => {
      const i = subscribers.indexOf(cb)
      if (i >= 0) subscribers.splice(i, 1)
    }
  }
  return { add, get, clear, subscribe }
}

export function HitPopupList({ manager }: { manager: ReturnType<typeof createHitPopupManager> }) {
  const [items, setItems] = useState(manager.get())
  useEffect(() => {
    const unsub = manager.subscribe(setItems)
    return () => unsub()
  }, [manager])

  return (
    <div class="hit-popup-layer">
      {items.map((p) => (
        <div key={p.id} class={`hit-popup ${p.critical ? 'critical' : ''}`} style={`left:${p.x}px;top:${p.y}px`}>
          {p.value}
        </div>
      ))}
    </div>
  )
}

// Compatibility wrappers used by unit tests and external callers
const _globalManager = createHitPopupManager()

export function createHitPopup(payload: { x: number; y: number; damage: number; critical?: boolean }) {
  return _globalManager.add({ x: payload.x, y: payload.y, value: payload.damage, critical: payload.critical })
}

export function subscribeHitPopups(cb: (arr: any[]) => void) {
  return _globalManager.subscribe(cb)
}
