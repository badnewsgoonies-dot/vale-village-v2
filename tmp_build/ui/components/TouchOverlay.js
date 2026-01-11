"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TouchOverlay = TouchOverlay;
const jsx_runtime_1 = require("preact/jsx-runtime");
const hooks_1 = require("preact/hooks");
require("./TouchOverlay.css");
const input_1 = require("../../constants/input");
function TouchOverlay({ onMove, onAction }) {
    const dpadRef = (0, hooks_1.useRef)(null);
    const activeId = (0, hooks_1.useRef)(null);
    const update = (0, hooks_1.useCallback)((clientX, clientY) => {
        const el = dpadRef.current;
        if (!el)
            return;
        const rect = el.getBoundingClientRect();
        const radius = Math.min(rect.width, rect.height) / 2;
        const dx = clientX - (rect.left + rect.width / 2);
        const dy = clientY - (rect.top + rect.height / 2);
        const dist = Math.sqrt(dx * dx + dy * dy);
        const max = radius * input_1.JOYSTICK_INSET;
        const clampedX = dist > max ? (dx * max) / dist : dx;
        const clampedY = dist > max ? (dy * max) / dist : dy;
        const nx = clampedX / max;
        const ny = clampedY / max;
        const horizontal = Math.abs(nx) > input_1.JOYSTICK_DEAD_ZONE ? nx : 0;
        const vertical = Math.abs(ny) > input_1.JOYSTICK_DEAD_ZONE ? ny : 0;
        onMove(horizontal, vertical);
    }, [onMove]);
    const reset = (0, hooks_1.useCallback)(() => {
        onMove(0, 0);
        activeId.current = null;
    }, [onMove]);
    (0, hooks_1.useEffect)(() => {
        const el = dpadRef.current;
        if (!el)
            return;
        const onPointerDown = (e) => {
            if (activeId.current !== null)
                return;
            activeId.current = e.pointerId;
            try {
                e.target.setPointerCapture(e.pointerId);
            }
            catch (_) { }
            update(e.clientX, e.clientY);
            e.preventDefault();
        };
        const onPointerMove = (e) => {
            if (activeId.current === null || activeId.current !== e.pointerId)
                return;
            update(e.clientX, e.clientY);
            e.preventDefault();
        };
        const onPointerUp = (e) => {
            if (activeId.current === null)
                return;
            if (activeId.current === e.pointerId)
                reset();
            try {
                e.target.releasePointerCapture(e.pointerId);
            }
            catch (_) { }
        };
        el.addEventListener('pointerdown', onPointerDown, { passive: false });
        window.addEventListener('pointermove', onPointerMove, { passive: false });
        window.addEventListener('pointerup', onPointerUp, { passive: false });
        // fallback touch
        const onTouchStart = (ev) => {
            if (activeId.current !== null)
                return;
            const t = ev.touches.item(0);
            if (!t)
                return;
            activeId.current = t.identifier;
            update(t.clientX, t.clientY);
            ev.preventDefault();
        };
        const onTouchMove = (ev) => {
            if (activeId.current === null)
                return;
            for (let i = 0; i < ev.touches.length; i++) {
                const t = ev.touches.item(i);
                if (t && t.identifier === activeId.current) {
                    update(t.clientX, t.clientY);
                    ev.preventDefault();
                    break;
                }
            }
        };
        const onTouchEnd = (_ev) => {
            reset();
        };
        el.addEventListener('touchstart', onTouchStart, { passive: false });
        el.addEventListener('touchmove', onTouchMove, { passive: false });
        el.addEventListener('touchend', onTouchEnd, { passive: false });
        el.addEventListener('touchcancel', onTouchEnd, { passive: false });
        return () => {
            el.removeEventListener('pointerdown', onPointerDown);
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('pointerup', onPointerUp);
            el.removeEventListener('touchstart', onTouchStart);
            el.removeEventListener('touchmove', onTouchMove);
            el.removeEventListener('touchend', onTouchEnd);
            el.removeEventListener('touchcancel', onTouchEnd);
        };
    }, [update, reset]);
    const handleActionDown = (e) => {
        e.preventDefault();
        onAction(true);
    };
    const handleActionUp = (e) => {
        e.preventDefault();
        onAction(false);
    };
    const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
    if (!isTouchDevice)
        return null;
    return ((0, jsx_runtime_1.jsxs)("div", { class: "touch-overlay", children: [(0, jsx_runtime_1.jsx)("div", { class: "dpad", ref: dpadRef, "aria-hidden": "true" }), (0, jsx_runtime_1.jsx)("button", { class: "touch-action", onPointerDown: (e) => handleActionDown(e), onPointerUp: (e) => handleActionUp(e), onPointerCancel: (e) => handleActionUp(e), onTouchStart: (e) => handleActionDown(e), onTouchEnd: (e) => handleActionUp(e), onTouchCancel: (e) => handleActionUp(e), children: "A" })] }));
}
