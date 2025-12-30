import { useRef, useEffect, useCallback } from 'preact/hooks';
import './TouchOverlay.css';

interface TouchOverlayProps {
  onMove: (horizontal: number, vertical: number) => void;
  onAction: (pressed: boolean) => void;
}

export function TouchOverlay({ onMove, onAction }: TouchOverlayProps) {
  const dpadRef = useRef<HTMLDivElement | null>(null);
  const activeId = useRef<number | null>(null);

  const DEAD_ZONE = 0.15;

  const update = useCallback((clientX: number, clientY: number) => {
    const el = dpadRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const radius = Math.min(rect.width, rect.height) / 2;

    const dx = clientX - (rect.left + rect.width / 2);
    const dy = clientY - (rect.top + rect.height / 2);
    const dist = Math.sqrt(dx * dx + dy * dy);
    const max = radius * 0.9;
    const clampedX = dist > max ? (dx * max) / dist : dx;
    const clampedY = dist > max ? (dy * max) / dist : dy;

    const nx = clampedX / max;
    const ny = clampedY / max;

    const horizontal = Math.abs(nx) > DEAD_ZONE ? nx : 0;
    const vertical = Math.abs(ny) > DEAD_ZONE ? ny : 0;

    onMove(horizontal, vertical);
  }, [onMove]);

  const reset = useCallback(() => {
    onMove(0, 0);
    activeId.current = null;
  }, [onMove]);

  useEffect(() => {
    const el = dpadRef.current;
    if (!el) return;

    const onPointerDown = (e: PointerEvent) => {
      if (activeId.current !== null) return;
      activeId.current = e.pointerId;
      (e.target as Element).setPointerCapture(e.pointerId);
      update(e.clientX, e.clientY);
      e.preventDefault();
    };

    const onPointerMove = (e: PointerEvent) => {
      if (activeId.current === null || activeId.current !== e.pointerId) return;
      update(e.clientX, e.clientY);
      e.preventDefault();
    };

    const onPointerUp = (e: PointerEvent) => {
      if (activeId.current === null) return;
      if (activeId.current === e.pointerId) reset();
      try { (e.target as Element).releasePointerCapture(e.pointerId); } catch (_) {}
    };

    el.addEventListener('pointerdown', onPointerDown as any, { passive: false });
    window.addEventListener('pointermove', onPointerMove as any, { passive: false });
    window.addEventListener('pointerup', onPointerUp as any, { passive: false });

    // fallback touch
    const onTouchStart = (ev: TouchEvent) => {
      if (activeId.current !== null) return;
      const t = ev.touches.item(0);
      if (!t) return;
      activeId.current = t.identifier;
      update(t.clientX, t.clientY);
      ev.preventDefault();
    };
    const onTouchMove = (ev: TouchEvent) => {
      if (activeId.current === null) return;
      for (let i = 0; i < ev.touches.length; i++) {
        const t = ev.touches.item(i);
        if (t && t.identifier === activeId.current) {
          update(t.clientX, t.clientY);
          ev.preventDefault();
          break;
        }
      }
    };
    const onTouchEnd = (_ev: TouchEvent) => {
      reset();
    };

    el.addEventListener('touchstart', onTouchStart, { passive: false });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd, { passive: false });
    el.addEventListener('touchcancel', onTouchEnd, { passive: false });

    return () => {
      el.removeEventListener('pointerdown', onPointerDown as any);
      window.removeEventListener('pointermove', onPointerMove as any);
      window.removeEventListener('pointerup', onPointerUp as any);

      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
      el.removeEventListener('touchcancel', onTouchEnd);
    };
  }, [update, reset]);

  const handleActionDown = (e: PointerEvent | TouchEvent) => {
    (e as Event).preventDefault();
    onAction(true);
  };
  const handleActionUp = (e: PointerEvent | TouchEvent) => {
    (e as Event).preventDefault();
    onAction(false);
  };

  const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
  if (!isTouchDevice) return null;

  return (
    <div class="touch-overlay">
      <div class="dpad" ref={dpadRef} aria-hidden="true" />
      <button
        class="touch-action"
        onPointerDown={(e) => handleActionDown(e as unknown as PointerEvent)}
        onPointerUp={(e) => handleActionUp(e as unknown as PointerEvent)}
        onPointerCancel={(e) => handleActionUp(e as unknown as PointerEvent)}
        onTouchStart={(e) => handleActionDown(e as unknown as TouchEvent)}
        onTouchEnd={(e) => handleActionUp(e as unknown as TouchEvent)}
        onTouchCancel={(e) => handleActionUp(e as unknown as TouchEvent)}
      >
        A
      </button>
    </div>
  );
}
