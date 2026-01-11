type Listener = (active: boolean) => void
let active = false
let timeoutId: ReturnType<typeof setTimeout> | null = null
const listeners = new Set<Listener>()

function notify() {
  for (const l of listeners) l(active)
}

export function startHitStop(duration = 100) {
  if (timeoutId) clearTimeout(timeoutId)
  active = true
  notify()
  timeoutId = setTimeout(() => {
    active = false
    timeoutId = null
    notify()
  }, duration)
}

export function onChange(cb: Listener) {
  listeners.add(cb)
  return () => listeners.delete(cb)
}

const hitStop = {
  isActive: () => active,
  onChange,
}

export function createHitStop() {
  return {
    trigger: startHitStop,
    isActive: () => hitStop.isActive(),
  }
}

export default hitStop
