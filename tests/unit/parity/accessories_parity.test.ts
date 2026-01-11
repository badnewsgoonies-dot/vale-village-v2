import { describe, it, expect } from 'vitest'

describe('Parity - Accessories wiring (partial)', () => {
  it('equipment registry includes new accessory jesters-armlet', async () => {
    const { EQUIPMENT } = await import('../../../src/data/definitions/equipment')
    expect(EQUIPMENT['jesters-armlet']).toBeDefined()
  })
})
