// Minimal screen shake manager
export function createScreenShakeManager() {
  let end = 0
  let intensity = 0

  function trigger(_intensity = 6, duration = 200) {
    intensity = _intensity
    end = Date.now() + duration
  }

  function isActive() {
    return Date.now() < end
  }

  // Returns a small offset to apply to camera based on time and intensity
  function getOffset() {
    if (!isActive()) return { x: 0, y: 0 }
    const t = (Date.now() % 1000) / 1000
    const x = (Math.sin(t * 50) * intensity) | 0
    const y = (Math.cos(t * 37) * intensity) | 0
    return { x, y }
  }

  return { trigger, isActive, getOffset }
}
