import { describe, it, expect, beforeEach } from 'vitest';
import { createWithEqualityFn } from 'zustand/traditional';
import { createTowerSlice, DEFAULT_TOWER_RECORD } from '../../../src/ui/state/towerSlice';

describe('towerSlice', () => {
  let useStore: any;

  beforeEach(() => {
    useStore = createWithEqualityFn()((set, get, api) => ({ ...createTowerSlice(set, get, api) }));
  });

  describe('Initial State', () => {
    it('should start with null towerRun', () => {
      const s = useStore.getState();
      expect(s.towerRun).toBeNull();
    });

    it('should start with idle tower status', () => {
      const s = useStore.getState();
      expect(s.towerStatus).toBe('idle');
    });

    it('should have default tower record on initialization', () => {
      const s = useStore.getState();
      expect(s.towerRecord).toEqual(DEFAULT_TOWER_RECORD);
      expect(s.towerRecord.highestFloorEver).toBe(0);
      expect(s.towerRecord.totalRuns).toBe(0);
      expect(s.towerRecord.bestRunTurns).toBeNull();
      expect(s.towerRecord.bestRunDamageDealt).toBeNull();
    });

    it('should start with null towerEntryContext', () => {
      const s = useStore.getState();
      expect(s.towerEntryContext).toBeNull();
    });

    it('should start with null activeTowerEncounterId', () => {
      const s = useStore.getState();
      expect(s.activeTowerEncounterId).toBeNull();
    });
  });

  describe('API Methods', () => {
    it('exposes expected keys and methods', () => {
      const s = useStore.getState();
      expect(typeof s.getCurrentTowerFloor).toBe('function');
      expect(typeof s.startTowerRun).toBe('function');
      expect(typeof s.beginTowerFloorBattle).toBe('function');
      expect(typeof s.handleTowerBattleCompleted).toBe('function');
      expect(typeof s.applyTowerRest).toBe('function');
      expect(typeof s.setTowerRecord).toBe('function');
    });
  });

  describe('setTowerRecord', () => {
    it('should update tower record with new values', () => {
      const newRecord = {
        highestFloorEver: 10,
        totalRuns: 5,
        bestRunTurns: 45,
        bestRunDamageDealt: 1200,
      };

      useStore.getState().setTowerRecord(newRecord);

      const s = useStore.getState();
      expect(s.towerRecord.highestFloorEver).toBe(10);
      expect(s.towerRecord.totalRuns).toBe(5);
      expect(s.towerRecord.bestRunTurns).toBe(45);
      expect(s.towerRecord.bestRunDamageDealt).toBe(1200);
    });

    it('should handle partial record updates with defaults', () => {
      const partialRecord = {
        highestFloorEver: 7,
      };

      useStore.getState().setTowerRecord(partialRecord as any);

      const s = useStore.getState();
      expect(s.towerRecord.highestFloorEver).toBe(7);
      expect(s.towerRecord.totalRuns).toBe(0);
      expect(s.towerRecord.bestRunTurns).toBeNull();
      expect(s.towerRecord.bestRunDamageDealt).toBeNull();
    });

    it('should handle null values in record update', () => {
      const recordWithNulls = {
        highestFloorEver: 5,
        totalRuns: 3,
        bestRunTurns: null,
        bestRunDamageDealt: null,
      };

      useStore.getState().setTowerRecord(recordWithNulls);

      const s = useStore.getState();
      expect(s.towerRecord.bestRunTurns).toBeNull();
      expect(s.towerRecord.bestRunDamageDealt).toBeNull();
    });

    it('should completely replace the tower record', () => {
      // Set initial record
      useStore.setState({
        towerRecord: {
          highestFloorEver: 20,
          totalRuns: 10,
          bestRunTurns: 100,
          bestRunDamageDealt: 5000,
        },
      });

      // Update with new record
      const newRecord = {
        highestFloorEver: 15,
        totalRuns: 2,
        bestRunTurns: 30,
        bestRunDamageDealt: 800,
      };

      useStore.getState().setTowerRecord(newRecord);

      const s = useStore.getState();
      expect(s.towerRecord.highestFloorEver).toBe(15);
      expect(s.towerRecord.totalRuns).toBe(2);
      expect(s.towerRecord.bestRunTurns).toBe(30);
      expect(s.towerRecord.bestRunDamageDealt).toBe(800);
    });
  });
});
