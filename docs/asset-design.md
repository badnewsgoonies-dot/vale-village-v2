# Asset Design — Vale Village v2

Status: draft

Overview
- Purpose: define asset types, canonical manifest format, runtime loader API, caching strategy, and integration points for the Preact/TypeScript port.
- Goals: deterministic asset resolution, simple manifest-driven builds, efficient runtime caching, clear integration points for OverworldV2 and core systems.

1) Asset types
- sprite-sheet: PNG or WebP atlases, with accompanying JSON atlas metadata (frames, anchors, hit boxes).
- tileset: tileset images + JSON mapping (tile index -> collision/meta flags).
- tilemap: JSON Tiled-like map definitions referencing tilesets and layers.
- audio: compressed audio (OGG/MP3/WEBM) with optional metadata (loop points, volume hints).
- json-data: arbitrary JSON game data (compendia, encounters, item definitions).
- vector: SVGs used for UI or scalable assets.
- meta: small JSON files describing version, hash, and dependencies for an asset bundle.

2) Manifest format (manifest.json)
- JSON, top-level structure:
{
  "manifestVersion": "1.0",
  "generatedAt": "2026-01-15T00:00:00Z",
  "baseUrl": "/assets/",
  "bundles": {
    "overworld": {
      "version": "20260115-abcdef",
      "assets": {
        "hero_sprite": { "type": "sprite-sheet", "path": "sprites/hero.png", "meta": "sprites/hero.json" },
        "village_tileset": { "type": "tileset", "path": "tiles/village.png", "meta": "tiles/village.json" }
      }
    }
  }
}

- Key rules:
  - No magic paths: baseUrl + relative path form final URL.
  - Every bundle has a version string (semantic or hash) used for cache-busting.
  - Asset entries are small objects: { type, path, meta?, deps? }
  - Keep manifestVersion to allow migrations.

3) Runtime loader API (TypeScript sketch)
- Design goals: minimal surface area, promise-based, deterministic cache keys, explicit unload.

Interfaces:

export type AssetType = 'sprite-sheet' | 'tileset' | 'tilemap' | 'audio' | 'json-data' | 'vector' | 'meta';

export interface ManifestAssetEntry {
  type: AssetType;
  path: string;           // relative to manifest.baseUrl
  meta?: string;          // optional path to accompanying metadata
  deps?: string[];        // optional asset ids this asset depends on
}

export interface ManifestBundle {
  version: string;
  assets: Record<string, ManifestAssetEntry>;
}

export interface AssetManifest {
  manifestVersion: string;
  generatedAt: string;
  baseUrl: string;
  bundles: Record<string, ManifestBundle>;
}

export interface LoadedAsset<T = any> {
  id: string;
  type: AssetType;
  data: T;                // e.g. HTMLImageElement, AudioBuffer, parsed JSON
  meta?: any;
  version: string;
}

export interface AssetLoaderOptions {
  defaultBundle?: string;
  cacheSize?: number; // entries for LRU
}

export interface AssetLoader {
  loadManifest(url: string): Promise<AssetManifest>;
  getManifest(): AssetManifest | null;
  loadAsset(bundle: string, assetId: string): Promise<LoadedAsset>;
  resolveUrl(path: string): string; // baseUrl + path
  preloadBundle(bundle: string): Promise<void>;
  unloadAsset(bundle: string, assetId: string): void;
  clearCache(): void;
}

Notes:
- All load methods must be idempotent and return cached promises if already in flight.
- Failures should surface as rejected Promises with a consistent Error subtype (e.g. AssetLoadError with code).

4) Caching strategy
- In-memory LRU cache keyed by "bundle:assetId:version" to avoid accidental mix between versions.
- Cache holds LoadedAsset objects and optionally decoded forms (Image, AudioBuffer).
- Provide explicit unloadAsset(bundle, id) for memory-critical screens.
- Use bundle.version to form cache keys; manifest changes (different version) cause automatic reload.
- Optional Service Worker/HTTP Cache: use standard cache-control headers and include version query param when serving production assets.

5) Build & manifest generation (scripts/asset-build.js)
- Build tool produces files under build assets directory and emits manifest.json with manifestVersion, baseUrl, bundles and versions per bundle.
- Ensure deterministic ordering when generating manifest (sort asset ids) to keep hashes stable.
- Provide simple CLI (node scripts/asset-build.js --out ./public/assets --baseUrl /assets/) that produces manifest.json and writes hashes.

6) Integration points (where loader will be used)
- Overworld rendering: src/ui/components/overworld-v2/OverworldV2.tsx and its layer modules (src/ui/components/overworld-v2/layers/*)
- UI components that show sprites/avatars: src/ui/components/*
- Core systems that load data-driven definitions: src/core/*
- State slices that may reference asset ids: src/ui/state/* (towerSlice, battleSlice if they reference visuals)

source_read_files (concrete files to integrate with):
- src/ui/components/overworld-v2/OverworldV2.tsx
- src/ui/components/overworld-v2/layers/ (all layer modules)
- src/ui/components/overworld-v2/tiles/* (if present)
- src/ui/components/* (sprite display components)
- src/core/ (data loading hooks that read JSON definitions)
- tests/unit/* (unit tests will import loader types and mocks)

7) Runtime considerations
- Use requestAnimationFrame for any image-to-canvas conversions done during preload to avoid jank.
- Audio decoding should use Web Audio API decodeAudioData and run off the main rendering hot path if possible.
- Keep manifests small; reference multiple small meta files rather than a single huge manifest when incremental updates are required.

8) Versioning & backwards compatibility
- manifestVersion field must be incremented if manifest shape changes. Loader must detect unsupported manifestVersion and fail with a helpful message.
- Asset entries may include optional compatibility metadata for fallbacks.

9) Next steps / TODOs
- Implement scripts/asset-build.js to emit canonical manifest and hashed bundles.
- Implement src/assets/asset-loader.ts following the API above.
- Add runtime integration tests and E2E preloading strategies.

Appendix: example manifest snippet

See "Manifest format" section above for a minimal example.
