/**
 * Fault-Injecting Policy Server Stub
 *
 * Implements the API contract required by `HttpLLMClient` but adds
 * chaos engineering modes to test harness robustness.
 *
 * Modes:
 *   --mode normal      Delegates to heuristic (default)
 *   --mode slow        Adds latency (500ms)
 *   --mode flaky       Randomly returns 500s or malformed JSON
 *   --mode invalid     Returns schema-violating actions
 *   --mode adversarial Returns legal but "bad" actions (NOOP preferred)
 *
 * Usage:
 *   npx ts-node validation/llm_server_stub.ts --mode flaky
 */

import * as http from 'http';
import { heuristicAction } from './policies/heuristic';
import type { GameState, GameAction } from '../src/dev/driver';

// ============================================================================ 
// Configuration
// ============================================================================ 

const DEFAULT_PORT = 8765;

type ServerConfig = {
  port: number;
  mode: 'normal' | 'slow' | 'flaky' | 'invalid' | 'adversarial';
};

function parseArgs(): ServerConfig {
  const args = process.argv.slice(2);
  const config: ServerConfig = {
    port: DEFAULT_PORT,
    mode: 'normal',
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--port':
        config.port = parseInt(args[++i], 10);
        break;
      case '--mode': {
        const val = args[++i];
        if (['normal', 'slow', 'flaky', 'invalid', 'adversarial'].includes(val)) {
          config.mode = val as ServerConfig['mode'];
        } else {
          console.error(`Unknown mode: ${val}`);
          process.exit(1);
        }
        break;
      }
    }
  }
  return config;
}

// ============================================================================ 
// Logic
// ============================================================================ 

const config = parseArgs();

const server = http.createServer(async (req, res) => {
  if (req.method !== 'POST') {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Method Not Allowed' }));
    return;
  }

  // 1. Fault Injection: Flaky (Pre-Parse)
  if (config.mode === 'flaky' && Math.random() < 0.3) {
    if (Math.random() < 0.5) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Injected flaky failure' }));
    } else {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('this is not json');
    }
    return;
  }

  // 2. Read Body
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', async () => {
    try {
      // 3. Fault Injection: Slow (Latency)
      if (config.mode === 'slow') {
        await new Promise(r => setTimeout(r, 500));
      }

      const payload = JSON.parse(body);
      const { state, episode, legalActions, policyLabel } = payload as {
        state: GameState;
        episode: { seed: number; tick: number };
        legalActions: GameAction[];
        policyLabel?: string;
      };

      // Log receipt
      process.stdout.write(
        `[server mode=${config.mode}] tick=${episode?.tick ?? '?'} seed=${episode?.seed ?? '?'} label=${policyLabel ?? 'none'}\r`
      );

      let action: any; // Allow invalid types for 'invalid' mode

      // 4. Mode Selection
      switch (config.mode) {
        case 'invalid':
          // Schema violation
          action = { type: 'TELEPORT', dx: 999, dy: 999, secret: 'forbidden' };
          break;

        case 'adversarial':
          // Legal but bad
          // Prefer NOOP (do nothing)
          if (legalActions.some(a => a.type === 'NOOP')) {
            action = { type: 'NOOP' };
          } else {
            // Or pick last legal action (often backward/random depending on gen order)
            action = legalActions[legalActions.length - 1];
          }
          break;

        case 'flaky':
        case 'slow':
        case 'normal':
        default:
          // Heuristic (Competent baseline)
          action = heuristicAction(state);
          break;
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ action }));

    } catch (e) {
      console.error('\n[server] Error processing request:', e);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: String(e) }));
    }
  });
});

server.listen(config.port, () => {
  console.log(`
🤖 LLM Policy Stub Server running at http://localhost:${config.port}
   Mode: ${config.mode.toUpperCase()}

   To test integration:
     npx ts-node validation/run_ci.ts \
       --sim-only \
       --policy llm \
       --llm-endpoint http://localhost:${config.port} \
       --runs 5
  `);
});