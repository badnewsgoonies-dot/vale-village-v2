#!/usr/bin/env python3
"""
Simple Playwright-based neural bridge for local development.
- Launches a browser and navigates to a URL
- Polls window.__TELEMETRY__ for telemetry items
- Sends telemetry to a local LLM stub (configurable endpoint) and receives an action
- Pushes action into window.__INPUT_BUFFER__
- Supports Wait Mode: sets Time.timeScale = 0 while awaiting LLM decision
- Configurable retry/timeout and logging

Usage: python tools/neural_bridge.py --url http://localhost:5173 --poll-interval 0.5
"""

import argparse
import json
import logging
import sys
import time
from typing import Any, Dict, Optional

# Use Playwright if available; if not, provide a helpful error
try:
    from playwright.sync_api import sync_playwright, TimeoutError as PlaywrightTimeout
except Exception as e:  # pragma: no cover - environment-dependent
    sync_playwright = None
    PlaywrightTimeout = Exception


DEFAULT_POLL_INTERVAL = 0.5
DEFAULT_TIMEOUT = 30.0
DEFAULT_RETRIES = 3
LOG_FORMAT = '%(asctime)s %(levelname)s %(message)s'


def llm_stub(telemetry: Any, llm_url: Optional[str] = None) -> Dict[str, Any]:
    """Very small deterministic stub that echoes a command based on telemetry shape.
    Replace this with real HTTP call to a model endpoint if required.
    """
    # Simple heuristic: if telemetry contains an object with type 'player_near', ask to 'INTERACT'
    try:
        if not telemetry:
            return {"decision": "NO_OP", "confidence": 0.0}
        # If telemetry is list, inspect last item
        item = telemetry[-1] if isinstance(telemetry, (list, tuple)) and telemetry else telemetry
        t = None
        if isinstance(item, dict):
            t = item.get("type") or item.get("event")
        elif isinstance(item, str):
            t = item
        # deterministic mapping
        if t and "near" in str(t):
            return {"decision": "INTERACT", "meta": item}
        if t and "danger" in str(t):
            return {"decision": "RETREAT", "meta": item}
        # fallback
        return {"decision": "PRESS_A", "meta": item}
    except Exception:
        return {"decision": "NO_OP", "confidence": 0.0}


def safe_eval_page(page, script: str, timeout: float = 5.0):
    """Evaluate script on page with timeout and return None on failure."""
    try:
        return page.evaluate(script, timeout=timeout * 1000)
    except PlaywrightTimeout:
        logging.warning("Playwright evaluate timed out")
        return None
    except Exception as exc:
        logging.debug("Page evaluate error: %s", exc)
        return None


def main():
    parser = argparse.ArgumentParser(description="Neural bridge: telemetry -> LLM -> input buffer")
    parser.add_argument("--url", required=True, help="URL of the game page to attach to (http://localhost:5173)")
    parser.add_argument("--llm-url", default=None, help="LLM endpoint URL (unused by stub)")
    parser.add_argument("--poll-interval", type=float, default=DEFAULT_POLL_INTERVAL)
    parser.add_argument("--timeout", type=float, default=DEFAULT_TIMEOUT, help="Global timeout for operations in seconds")
    parser.add_argument("--retries", type=int, default=DEFAULT_RETRIES)
    parser.add_argument("--wait-mode", action="store_true", help="Enable Wait Mode: set Time.timeScale=0 while awaiting LLM")
    parser.add_argument("--headless", action="store_true", help="Run browser headless (default: visible)")
    args = parser.parse_args()

    logging.basicConfig(level=logging.INFO, format=LOG_FORMAT)
    logging.info("Starting neural bridge for %s", args.url)

    if sync_playwright is None:
        logging.error("Playwright is not installed or failed to import. Install with: pip install playwright && playwright install")
        sys.exit(2)

    start_time = time.time()
    tries = 0
    while tries <= args.retries:
        try:
            with sync_playwright() as pw:
                browser = pw.chromium.launch(headless=args.headless)
                context = browser.new_context()
                page = context.new_page()
                logging.info("Opening page %s", args.url)
                page.goto(args.url, timeout=int(args.timeout * 1000))

                # Ensure input buffer and telemetry exist on window
                page.evaluate("() => { window.__TELEMETRY__ = window.__TELEMETRY__ || []; window.__INPUT_BUFFER__ = window.__INPUT_BUFFER__ || []; window.Time = window.Time || {timeScale:1}; }")

                logging.info("Attached to page. Polling every %ss", args.poll_interval)

                # Main polling loop
                while True:
                    if args.timeout and (time.time() - start_time) > args.timeout:
                        logging.info("Global timeout reached, exiting")
                        return

                    try:
                        telemetry = page.evaluate("() => { return Array.isArray(window.__TELEMETRY__) ? window.__TELEMETRY__.slice() : window.__TELEMETRY__; }")
                    except Exception as e:
                        logging.debug("Failed to read telemetry: %s", e)
                        telemetry = None

                    if not telemetry:
                        time.sleep(args.poll_interval)
                        continue

                    logging.info("Telemetry snapshot: %s", json.dumps(telemetry, default=str)[:1000])

                    # Enter Wait Mode if requested
                    previous_timescale = None
                    if args.wait_mode:
                        try:
                            previous_timescale = page.evaluate("() => { window.Time = window.Time || {}; var prev = window.Time.timeScale || 1; window.Time.timeScale = 0; return prev; }")
                            logging.info("Wait Mode: set Time.timeScale=0 (previous=%s)", previous_timescale)
                        except Exception:
                            logging.warning("Failed to set Wait Mode on page")

                    # Call LLM (stub or endpoint)
                    decision = None
                    try:
                        decision = llm_stub(telemetry, args.llm_url)
                        logging.info("LLM decision: %s", decision)
                    except Exception as e:
                        logging.error("LLM call failed: %s", e)
                        decision = {"decision": "NO_OP"}

                    # Push decision into input buffer
                    try:
                        # Ensure decision is JSON-serializable
                        payload = json.dumps(decision)
                        push_script = f"(d) => {{ window.__INPUT_BUFFER__ = window.__INPUT_BUFFER__ || []; try {{ window.__INPUT_BUFFER__.push(JSON.parse(d)); }} catch(e) {{ window.__INPUT_BUFFER__.push(d); }} }}"
                        page.evaluate(push_script, payload)
                        logging.info("Pushed decision into window.__INPUT_BUFFER__")
                    except Exception as e:
                        logging.error("Failed to push decision into input buffer: %s", e)

                    # Optional: clear telemetry or shift processed items
                    try:
                        page.evaluate("() => { if (Array.isArray(window.__TELEMETRY__)) { window.__TELEMETRY__ = []; } }")
                    except Exception:
                        logging.debug("Failed to clear telemetry")

                    # Exit Wait Mode by restoring timeScale
                    if args.wait_mode:
                        try:
                            restore = previous_timescale if previous_timescale is not None else 1
                            page.evaluate(f"() => {{ window.Time = window.Time || {{}}; window.Time.timeScale = {restore}; }}")
                            logging.info("Restored Time.timeScale=%s", restore)
                        except Exception:
                            logging.warning("Failed to restore Time.timeScale")

                    # small pause before next poll; this avoids hot-looping
                    time.sleep(args.poll_interval)

        except Exception as exc:  # top-level try for retries
            tries += 1
            logging.exception("Bridge error (attempt %s/%s): %s", tries, args.retries, exc)
            if tries > args.retries:
                logging.error("Exceeded maximum retries, exiting")
                sys.exit(1)
            sleep_for = min(5 * tries, 30)
            logging.info("Retrying in %s seconds...", sleep_for)
            time.sleep(sleep_for)


if __name__ == '__main__':
    main()
