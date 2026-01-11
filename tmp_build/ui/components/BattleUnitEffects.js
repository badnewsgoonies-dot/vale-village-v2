"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BattleUnitEffects = BattleUnitEffects;
const jsx_runtime_1 = require("preact/jsx-runtime");
const hooks_1 = require("preact/hooks");
const store_1 = require("../state/store");
function BattleUnitEffects({ unitId }) {
    // Selectors
    const events = (0, store_1.useStore)((s) => s.events);
    const critFlash = (0, store_1.useStore)((s) => s.critFlash);
    // Local State for this unit's effects
    const [floater, setFloater] = (0, hooks_1.useState)(null);
    const [isShaking, setIsShaking] = (0, hooks_1.useState)(false);
    // Refs for tracking
    const lastProcessedEventRef = (0, hooks_1.useRef)(undefined);
    const shakeTimeoutRef = (0, hooks_1.useRef)(null);
    const floatTimeoutRef = (0, hooks_1.useRef)(null);
    const counterRef = (0, hooks_1.useRef)(0);
    const currentAttackerRef = (0, hooks_1.useRef)(null);
    (0, hooks_1.useEffect)(() => {
        if (events.length === 0)
            return;
        const evt = events[0];
        if (!evt)
            return;
        // Track attacker from ability events
        if (evt.type === 'ability') {
            currentAttackerRef.current = evt.casterId;
        }
        // De-dupe processing
        if (evt === lastProcessedEventRef.current)
            return;
        // Check if this event targets US
        let isTarget = false;
        if (evt.type === 'hit' || evt.type === 'heal' || evt.type === 'status-applied' || evt.type === 'status-expired') {
            if (evt.targetId === unitId) {
                isTarget = true;
            }
        }
        if (!isTarget)
            return;
        // Mark as processed for this unit
        lastProcessedEventRef.current = evt;
        if (evt.type === 'hit' || evt.type === 'heal') {
            const attacker = currentAttackerRef.current;
            // Crit check: if hit and attacker exists and attacker has critFlash
            const isCrit = !!(evt.type === 'hit' && attacker && critFlash[attacker]);
            // 1. Trigger Floater
            setFloater({
                id: ++counterRef.current,
                amount: evt.amount,
                kind: evt.type === 'heal' ? 'heal' : 'damage',
                isCrit
            });
            if (floatTimeoutRef.current)
                clearTimeout(floatTimeoutRef.current);
            floatTimeoutRef.current = setTimeout(() => {
                setFloater(null);
            }, isCrit ? 1400 : 1150);
            // 2. Trigger Shake (Damage only)
            if (evt.type === 'hit') {
                setIsShaking(true);
                if (shakeTimeoutRef.current)
                    clearTimeout(shakeTimeoutRef.current);
                shakeTimeoutRef.current = setTimeout(() => {
                    setIsShaking(false);
                }, isCrit ? 350 : 240);
            }
        }
    }, [events, unitId, critFlash]);
    // Clean up
    (0, hooks_1.useEffect)(() => {
        return () => {
            if (shakeTimeoutRef.current)
                clearTimeout(shakeTimeoutRef.current);
            if (floatTimeoutRef.current)
                clearTimeout(floatTimeoutRef.current);
        };
    }, []);
    // Direct DOM manipulation for shake animation to avoid parent re-renders
    (0, hooks_1.useEffect)(() => {
        const el = document.getElementById(`unit-wrapper-${unitId}`);
        if (el) {
            el.style.animation = isShaking ? 'unitDamageShake 240ms ease-in-out' : 'none';
        }
    }, [isShaking, unitId]);
    if (!floater)
        return null;
    const displayValue = Math.abs(floater.amount);
    const { kind, isCrit } = floater;
    return ((0, jsx_runtime_1.jsxs)("div", { style: {
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            marginBottom: '10px',
            color: kind === 'heal' ? '#6df0a2' : isCrit ? '#FFD54A' : '#ff6b6b',
            fontSize: isCrit ? '1.4rem' : '1rem',
            fontWeight: 800,
            textShadow: isCrit
                ? '0 0 12px rgba(255, 215, 74, 0.9), 0 0 20px rgba(255, 180, 0, 0.6), 2px 2px 4px rgba(0,0,0,0.9)'
                : '0 0 6px rgba(0,0,0,0.8)',
            animation: isCrit ? 'criticalFloat 1.3s ease-out forwards' : 'floatNumber 1.05s ease-out forwards',
            pointerEvents: 'none',
            zIndex: isCrit ? 20 : 12,
            whiteSpace: 'nowrap',
        }, children: [isCrit && (0, jsx_runtime_1.jsx)("span", { style: { display: 'block', fontSize: '0.7rem', color: '#FFD54A', textAlign: 'center' }, children: "CRITICAL!" }), kind === 'heal' ? `+${displayValue}` : `-${displayValue}`] }, floater.id));
}
