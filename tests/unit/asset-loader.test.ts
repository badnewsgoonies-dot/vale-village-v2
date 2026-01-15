import { describe, it, expect, test } from 'vitest'

// This is a scaffold expressing the expected behaviour of the asset loader.
// Tests are intentionally minimal and declarative (todo) to avoid coupling
// to an implementation that doesn't yet exist.

describe('Asset loader manifest shape', () => {
  const exampleManifest = {
    manifestVersion: '1.0',
    generatedAt: '2026-01-15T00:00:00Z',
    baseUrl: '/assets/',
    bundles: {
      main: {
        version: 'v1',
        assets: {
          hero: { type: 'sprite-sheet', path: 'sprites/hero.png', meta: 'sprites/hero.json' }
        }
      }
    }
  }

  it('has top-level fields', () => {
    expect(exampleManifest).toHaveProperty('manifestVersion')
    expect(exampleManifest).toHaveProperty('baseUrl')
    expect(exampleManifest).toHaveProperty('bundles')
  })

  test.todo('loader.loadManifest(url) should return parsed manifest and cache it')
  test.todo('loader.resolveUrl(path) should join baseUrl + path and be deterministic')
  test.todo('loader.loadAsset(bundle, assetId) should return a LoadedAsset with data and meta')
  test.todo('loader.preloadBundle(bundle) should fetch all assets in the bundle in parallel')
  test.todo('cache keys should include bundle + assetId + version to avoid cross-version collisions')
})
