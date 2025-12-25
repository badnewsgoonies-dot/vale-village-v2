/**
 * VirtualJoystick Component
 * Touch-based joystick for mobile movement controls
 */

import { useRef, useEffect, useCallback } from 'preact/hooks';
import type { InputSystem } from './overworld-v2/systems/InputSystem';
import './VirtualJoystick.css';

interface VirtualJoystickProps {
  inputSystem: InputSystem | null;
}

export function VirtualJoystick({ inputSystem }: VirtualJoystickProps) {
  const joystickRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const activeTouchId = useRef<number | null>(null);
  const centerRef = useRef({ x: 0, y: 0 });

  const JOYSTICK_RADIUS = 50;
  const KNOB_RADIUS = 25;
  const DEAD_ZONE = 0.15;

  const updateJoystick = useCallback((clientX: number, clientY: number) => {
    if (!joystickRef.current || !knobRef.current || !inputSystem) return;

    const dx = clientX - centerRef.current.x;
    const dy = clientY - centerRef.current.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const maxDistance = JOYSTICK_RADIUS - KNOB_RADIUS / 2;

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
    const horizontal = Math.abs(normalizedX) > DEAD_ZONE ? normalizedX : 0;
    const vertical = Math.abs(normalizedY) > DEAD_ZONE ? normalizedY : 0;

    inputSystem.setTouchInput(horizontal, vertical);
  }, [inputSystem]);

  const resetJoystick = useCallback(() => {
    if (!knobRef.current || !inputSystem) return;
    knobRef.current.style.transform = 'translate(0px, 0px)';
    inputSystem.setTouchInput(0, 0);
    activeTouchId.current = null;
  }, [inputSystem]);

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

  const handleActionStart = useCallback((e: TouchEvent) => {
    e.preventDefault();
    if (inputSystem) {
      inputSystem.setTouchAction(true);
    }
  }, [inputSystem]);

  const handleActionEnd = useCallback((e: TouchEvent) => {
    e.preventDefault();
    if (inputSystem) {
      inputSystem.setTouchAction(false);
    }
  }, [inputSystem]);

  useEffect(() => {
    const joystick = joystickRef.current;
    if (!joystick) return;

    joystick.addEventListener('touchstart', handleTouchStart, { passive: false });
    joystick.addEventListener('touchmove', handleTouchMove, { passive: false });
    joystick.addEventListener('touchend', handleTouchEnd, { passive: false });
    joystick.addEventListener('touchcancel', handleTouchEnd, { passive: false });

    return () => {
      joystick.removeEventListener('touchstart', handleTouchStart);
      joystick.removeEventListener('touchmove', handleTouchMove);
      joystick.removeEventListener('touchend', handleTouchEnd);
      joystick.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

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
        onTouchStart={handleActionStart}
        onTouchEnd={handleActionEnd}
        onTouchCancel={handleActionEnd}
      >
        A
      </button>
    </div>
  );
}
