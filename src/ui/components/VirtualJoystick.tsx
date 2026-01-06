/**
 * VirtualJoystick Component
 * Touch-based joystick for mobile movement controls
 */

import { useRef, useEffect, useCallback } from 'preact/hooks';
import type { InputSystem } from './overworld-v2/systems/InputSystem';
import './VirtualJoystick.css';
import { JOYSTICK_DEAD_ZONE } from '../../constants/input';

interface VirtualJoystickProps {
  inputSystem?: InputSystem | null;
  onMove?: (horizontal: number, vertical: number) => void;
  onAction?: (pressed: boolean) => void;
}

export function VirtualJoystick({ inputSystem, onMove, onAction }: VirtualJoystickProps) {
  const joystickRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const activeTouchId = useRef<number | null>(null);
  const centerRef = useRef({ x: 0, y: 0 });

  // Dead zone threshold for the virtual joystick (named constant to avoid magic numbers)


  const emitMove = useCallback((horizontal: number, vertical: number) => {
    if (inputSystem) {
      inputSystem.setTouchInput(horizontal, vertical);
    }
    if (onMove) {
      onMove(horizontal, vertical);
    }
  }, [inputSystem, onMove]);

  const emitAction = useCallback((pressed: boolean) => {
    if (inputSystem) {
      inputSystem.setTouchAction(pressed);
    }
    if (onAction) {
      onAction(pressed);
    }
  }, [inputSystem, onAction]);

  const updateJoystick = useCallback((clientX: number, clientY: number) => {
    if (!joystickRef.current || !knobRef.current) return;

    const rect = joystickRef.current.getBoundingClientRect();
    const knobRect = knobRef.current.getBoundingClientRect();

    // Dynamically derive radii from DOM measurements instead of hard-coded values
    const joystickRadius = Math.min(rect.width, rect.height) / 2;
    const knobRadius = Math.min(knobRect.width, knobRect.height) / 2;
    const maxDistance = joystickRadius - knobRadius / 2;

    const dx = clientX - centerRef.current.x;
    const dy = clientY - centerRef.current.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Clamp to circle
    let clampedX = dx;
    let clampedY = dy;
    if (distance > maxDistance) {
      const scale = maxDistance / distance;
      clampedX = dx * scale;
      clampedY = dy * scale;
    }

    // Update knob position
    knobRef.current.style.transform = `translate(${clampedX}px, ${clampedY}px)`;

    // Calculate normalized input (-1 to 1)
    const normalizedX = clampedX / maxDistance;
    const normalizedY = clampedY / maxDistance;

    // Apply dead zone
    const horizontal = Math.abs(normalizedX) > JOYSTICK_DEAD_ZONE ? normalizedX : 0;
    const vertical = Math.abs(normalizedY) > JOYSTICK_DEAD_ZONE ? normalizedY : 0;

    emitMove(horizontal, vertical);
  }, [emitMove]);

  const resetJoystick = useCallback(() => {
    if (!knobRef.current) return;
    knobRef.current.style.transform = 'translate(0px, 0px)';
    emitMove(0, 0);
    activeTouchId.current = null;
  }, [emitMove]);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (activeTouchId.current !== null) return;
    if (!joystickRef.current) return;

    const touch = e.touches.item(0);
    if (!touch) return;

    const rect = joystickRef.current.getBoundingClientRect();
    centerRef.current = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };

    activeTouchId.current = touch.identifier;
    updateJoystick(touch.clientX, touch.clientY);
    e.preventDefault();
  }, [updateJoystick]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (activeTouchId.current === null) return;

    for (let i = 0; i < e.touches.length; i++) {
      const touch = e.touches.item(i);
      if (touch && touch.identifier === activeTouchId.current) {
        updateJoystick(touch.clientX, touch.clientY);
        e.preventDefault();
        break;
      }
    }
  }, [updateJoystick]);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (activeTouchId.current === null) return;

    let found = false;
    for (let i = 0; i < e.touches.length; i++) {
      const touch = e.touches.item(i);
      if (touch && touch.identifier === activeTouchId.current) {
        found = true;
        break;
      }
    }

    if (!found) {
      resetJoystick();
    }
  }, [resetJoystick]);

  // Pointer-based handlers provide unified mouse/touch support (Pointer Events)
  const handlePointerDown = useCallback((e: PointerEvent) => {
    if (activeTouchId.current !== null) return;
    if (!joystickRef.current) return;

    const rect = joystickRef.current.getBoundingClientRect();
    centerRef.current = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };

    // Use pointerId for tracking
    e.preventDefault();
    activeTouchId.current = e.pointerId;
    // capture so we continue receiving moves even if pointer leaves element
    try { (e.target as Element).setPointerCapture(e.pointerId); } catch (_) {}
    updateJoystick(e.clientX, e.clientY);
  }, [updateJoystick]);

  const handlePointerMove = useCallback((e: PointerEvent) => {
    if (activeTouchId.current === null || activeTouchId.current !== e.pointerId) return;
    e.preventDefault();
    updateJoystick(e.clientX, e.clientY);
  }, [updateJoystick]);

  const handlePointerUp = useCallback((e: PointerEvent) => {
    if (activeTouchId.current === null) return;
    if (activeTouchId.current === e.pointerId) {
      resetJoystick();
    }
  }, [resetJoystick]);

  const handleActionStart = useCallback((e: Event) => {
    // Prevent default to stop inadvertent clicks/scrolls
    e.preventDefault();
    emitAction(true);
  }, [emitAction]);

  const handleActionEnd = useCallback((e: Event) => {
    e.preventDefault();
    emitAction(false);
  }, [emitAction]);

  useEffect(() => {
    const joystick = joystickRef.current;
    if (!joystick) return;

    // Pointer events for unified mouse/touch behaviour
    joystick.addEventListener('pointerdown', handlePointerDown, { passive: false });
    window.addEventListener('pointermove', handlePointerMove, { passive: false });
    window.addEventListener('pointerup', handlePointerUp, { passive: false });

    // Fallback touch listeners for older platforms
    joystick.addEventListener('touchstart', handleTouchStart, { passive: false });
    joystick.addEventListener('touchmove', handleTouchMove, { passive: false });
    joystick.addEventListener('touchend', handleTouchEnd, { passive: false });
    joystick.addEventListener('touchcancel', handleTouchEnd, { passive: false });

    return () => {
      joystick.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);

      joystick.removeEventListener('touchstart', handleTouchStart);
      joystick.removeEventListener('touchmove', handleTouchMove);
      joystick.removeEventListener('touchend', handleTouchEnd);
      joystick.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, handlePointerDown, handlePointerMove, handlePointerUp]);

  // Check if touch device
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (!isTouchDevice) {
    return null;
  }

  return (
    <div class="virtual-controls">
      <div class="virtual-joystick" ref={joystickRef}>
        <div class="virtual-joystick-knob" ref={knobRef} />
      </div>
      <button
        class="virtual-action-button"
        onPointerDown={(e) => handleActionStart(e as unknown as PointerEvent)}
        onPointerUp={(e) => handleActionEnd(e as unknown as PointerEvent)}
        onPointerCancel={(e) => handleActionEnd(e as unknown as PointerEvent)}
        onTouchStart={(e) => handleActionStart(e as unknown as TouchEvent)}
        onTouchEnd={(e) => handleActionEnd(e as unknown as TouchEvent)}
        onTouchCancel={(e) => handleActionEnd(e as unknown as TouchEvent)}
      >
        A
      </button>
    </div>
  );
}
