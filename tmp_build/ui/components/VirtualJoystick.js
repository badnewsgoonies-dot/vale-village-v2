"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VirtualJoystick = VirtualJoystick;
const jsx_runtime_1 = require("preact/jsx-runtime");
/**
 * VirtualJoystick Component
 * Touch-based joystick for mobile movement controls
 */
const hooks_1 = require("preact/hooks");
require("./VirtualJoystick.css");
const input_1 = require("../../constants/input");
function VirtualJoystick({ inputSystem, onMove, onAction }) {
    const joystickRef = (0, hooks_1.useRef)(null);
    const knobRef = (0, hooks_1.useRef)(null);
    const activeTouchId = (0, hooks_1.useRef)(null);
    const centerRef = (0, hooks_1.useRef)({ x: 0, y: 0 });
    // Dead zone threshold for the virtual joystick (named constant to avoid magic numbers)
    const emitMove = (0, hooks_1.useCallback)((horizontal, vertical) => {
        if (inputSystem) {
            inputSystem.setTouchInput(horizontal, vertical);
        }
        if (onMove) {
            onMove(horizontal, vertical);
        }
    }, [inputSystem, onMove]);
    const emitAction = (0, hooks_1.useCallback)((pressed) => {
        if (inputSystem) {
            inputSystem.setTouchAction(pressed);
        }
        if (onAction) {
            onAction(pressed);
        }
    }, [inputSystem, onAction]);
    const updateJoystick = (0, hooks_1.useCallback)((clientX, clientY) => {
        if (!joystickRef.current || !knobRef.current)
            return;
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
        const horizontal = Math.abs(normalizedX) > input_1.JOYSTICK_DEAD_ZONE ? normalizedX : 0;
        const vertical = Math.abs(normalizedY) > input_1.JOYSTICK_DEAD_ZONE ? normalizedY : 0;
        emitMove(horizontal, vertical);
    }, [emitMove]);
    const resetJoystick = (0, hooks_1.useCallback)(() => {
        if (!knobRef.current)
            return;
        knobRef.current.style.transform = 'translate(0px, 0px)';
        emitMove(0, 0);
        activeTouchId.current = null;
    }, [emitMove]);
    const handleTouchStart = (0, hooks_1.useCallback)((e) => {
        if (activeTouchId.current !== null)
            return;
        if (!joystickRef.current)
            return;
        const touch = e.touches.item(0);
        if (!touch)
            return;
        const rect = joystickRef.current.getBoundingClientRect();
        centerRef.current = {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
        };
        activeTouchId.current = touch.identifier;
        updateJoystick(touch.clientX, touch.clientY);
        e.preventDefault();
    }, [updateJoystick]);
    const handleTouchMove = (0, hooks_1.useCallback)((e) => {
        if (activeTouchId.current === null)
            return;
        for (let i = 0; i < e.touches.length; i++) {
            const touch = e.touches.item(i);
            if (touch && touch.identifier === activeTouchId.current) {
                updateJoystick(touch.clientX, touch.clientY);
                e.preventDefault();
                break;
            }
        }
    }, [updateJoystick]);
    const handleTouchEnd = (0, hooks_1.useCallback)((e) => {
        if (activeTouchId.current === null)
            return;
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
    const handlePointerDown = (0, hooks_1.useCallback)((e) => {
        if (activeTouchId.current !== null)
            return;
        if (!joystickRef.current)
            return;
        const rect = joystickRef.current.getBoundingClientRect();
        centerRef.current = {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
        };
        // Use pointerId for tracking
        e.preventDefault();
        activeTouchId.current = e.pointerId;
        // capture so we continue receiving moves even if pointer leaves element
        try {
            e.target.setPointerCapture(e.pointerId);
        }
        catch (_) { }
        updateJoystick(e.clientX, e.clientY);
    }, [updateJoystick]);
    const handlePointerMove = (0, hooks_1.useCallback)((e) => {
        if (activeTouchId.current === null || activeTouchId.current !== e.pointerId)
            return;
        e.preventDefault();
        updateJoystick(e.clientX, e.clientY);
    }, [updateJoystick]);
    const handlePointerUp = (0, hooks_1.useCallback)((e) => {
        if (activeTouchId.current === null)
            return;
        if (activeTouchId.current === e.pointerId) {
            resetJoystick();
        }
    }, [resetJoystick]);
    const handleActionStart = (0, hooks_1.useCallback)((e) => {
        // Prevent default to stop inadvertent clicks/scrolls
        e.preventDefault();
        emitAction(true);
    }, [emitAction]);
    const handleActionEnd = (0, hooks_1.useCallback)((e) => {
        e.preventDefault();
        emitAction(false);
    }, [emitAction]);
    (0, hooks_1.useEffect)(() => {
        const joystick = joystickRef.current;
        if (!joystick)
            return;
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
    return ((0, jsx_runtime_1.jsxs)("div", { class: "virtual-controls", children: [(0, jsx_runtime_1.jsx)("div", { class: "virtual-joystick", ref: joystickRef, children: (0, jsx_runtime_1.jsx)("div", { class: "virtual-joystick-knob", ref: knobRef }) }), (0, jsx_runtime_1.jsx)("button", { class: "virtual-action-button", onPointerDown: (e) => handleActionStart(e), onPointerUp: (e) => handleActionEnd(e), onPointerCancel: (e) => handleActionEnd(e), onTouchStart: (e) => handleActionStart(e), onTouchEnd: (e) => handleActionEnd(e), onTouchCancel: (e) => handleActionEnd(e), children: "A" })] }));
}
