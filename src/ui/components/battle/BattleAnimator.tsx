import { createHitPopupManager } from './HitPopup'
import { createHitStop } from './HitStop'
import { createScreenShakeManager } from './ScreenShake'

export function createBattleAnimator() {
  const popups = createHitPopupManager()
  const hitstop = createHitStop()
  const shake = createScreenShakeManager()

  function applyDamage({ x, y, value, critical = false }: { x: number; y: number; value: number; critical?: boolean }) {
    popups.add({ x, y, value, critical })
    hitstop.trigger(100)
    if (critical) shake.trigger(8, 220)
  }

  return { popups, hitstop, shake, applyDamage }
}
