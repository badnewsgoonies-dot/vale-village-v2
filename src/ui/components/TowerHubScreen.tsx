import { JSX } from 'preact';
import { useMemo, useState, useEffect } from 'preact/hooks';
import { useGameStore } from '../../store/gameStore';
import './TowerHubScreen.css';
import { useStore } from '../state/store';
import type { Store } from '../state/store';
import type { TowerFloor } from '@/data/schemas/TowerFloorSchema';
import type { TowerRewardEntry } from '@/data/schemas/TowerRewardSchema';
import type { TowerRunState } from '@/core/services/TowerService';
import { DEFAULT_TOWER_CONFIG } from '@/core/config/towerConfig';
import { TOWER_REWARDS } from '@/data/definitions/towerRewards';
import { calculateEffectiveStats } from '@/core/algorithms/stats';
import { DJINN } from '@/data/definitions/djinn';
import { PartyManagementScreen } from './PartyManagementScreen';
import { ShopEquipScreen } from './ShopEquipScreen';
import { DjinnCollectionScreen } from './DjinnCollectionScreen';

type ConfirmAction = 'quit' | 'restart' | null;
type LoadoutPanel = 'party' | 'equipment' | 'djinn' | null;

export function TowerHubScreen(): JSX.Element {
  const setScreen = useGameStore((s) => s.setScreen);

  const {
    towerRun,
    towerStatus,
    towerRecord,
    getCurrentTowerFloor,
    startTowerRun,
    beginTowerFloorBattle,
    applyTowerRest,
    quitTowerRun,
    exitTowerMode,
    towerEntryContext,
    team,
    mode,
  } = useStore((state) => ({
    towerRun: state.towerRun,
    towerStatus: state.towerStatus,
    towerRecord: state.towerRecord,
    getCurrentTowerFloor: state.getCurrentTowerFloor,
    startTowerRun: state.startTowerRun,
    beginTowerFloorBattle: state.beginTowerFloorBattle,
    applyTowerRest: state.applyTowerRest,
    quitTowerRun: state.quitTowerRun,
    exitTowerMode: state.exitTowerMode,
    towerEntryContext: state.towerEntryContext,
    team: state.team,
    mode: state.mode,
  }));

  // Sync V1 store mode to V2 gameStore screen (for battle transitions from tower)
  useEffect(() => {
    if (mode === 'team-select') {
      setScreen('team-select');
    } else if (mode === 'battle') {
      setScreen('battle');
    } else if (mode === 'rewards') {
      setScreen('rewards');
    }
  }, [mode, setScreen]);

  const currentFloor = getCurrentTowerFloor();
  const isRestFloor = currentFloor?.type === 'rest';
  const isCompleted = towerStatus === 'completed';
  const upcomingReward = useMemo(() => getNextReward(towerRun), [towerRun]);
  const partySummary = useMemo(() => buildPartySummary(team), [team]);
  const djinnStatus = useMemo(() => buildDjinnStatus(team), [team]);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);
  const [loadoutPanel, setLoadoutPanel] = useState<LoadoutPanel>(null);

  const handleStartRun = () => {
    if (towerStatus === 'idle' || !towerRun) {
      startTowerRun({ difficulty: 'normal' });
      return;
    }
    setConfirmAction('restart');
  };

  const handleConfirmAction = () => {
    if (confirmAction === 'quit') {
      quitTowerRun();
    } else if (confirmAction === 'restart') {
      startTowerRun({ difficulty: towerRun?.difficulty ?? 'normal' });
    }
    setConfirmAction(null);
  };

  const handleQuitRun = () => {
    setConfirmAction('quit');
  };

  const closeLoadoutPanel = () => setLoadoutPanel(null);

  if (towerStatus === 'idle' || !towerRun) {
    return (
      <div class="tower-hub">
        <section class="tower-card intro">
          <h1>Battle Tower</h1>
          <p>
            Step into an infinite gauntlet built on the queue battle engine. Assemble any four heroes, keep their HP between fights,
            and chase your highest floor on this save-independent sandbox.
          </p>
          <div class="tower-actions">
            <button class="primary" onClick={handleStartRun}>
              Start Tower Run
            </button>
            <button onClick={exitTowerMode}>
              {towerEntryContext?.type === 'overworld' ? 'Return to Vale' : 'Back to Menu'}
            </button>
          </div>
        </section>
        <TowerRecords towerRecord={towerRecord} />
      </div>
    );
  }

  const stats = towerRun.stats;

  return (
    <div class="tower-hub">
      <section class="tower-card status">
        <header>
          <div>
            <p class="label">Difficulty</p>
            <p class="value">{towerRun.difficulty}</p>
          </div>
          <div>
            <p class="label">Highest Floor</p>
            <p class="value">{stats.highestFloor}</p>
          </div>
          <div>
            <p class="label">Battles Won</p>
            <p class="value">{stats.victories}</p>
          </div>
        </header>
        <div class="timeline">
          <p class="label">Current Floor</p>
          {renderFloor(currentFloor)}
        </div>
        <div class="next-reward" data-testid="tower-next-reward">
          <p class="label">Next Reward Floor</p>
          {upcomingReward ? (
            <div class="reward-row">
              <span class={`floor-pill reward`}>{`Floor ${upcomingReward.floorNumber}`}</span>
              <span>{describeRewardBundle(upcomingReward.rewards)}</span>
            </div>
          ) : (
            <span class="value">All milestone rewards claimed</span>
          )}
        </div>
      </section>

      <section class="tower-card actions">
        {isCompleted ? (
          <>
            <h2>Run Complete</h2>
            <p>
              {towerRun.isFailed
                ? 'The party fell, but their record stands in the archive.'
                : 'You cleared every defined floor for this phase.'}
            </p>
            <div class="tower-actions">
              <button class="primary" onClick={handleStartRun}>
                Start New Run
              </button>
              <button onClick={exitTowerMode}>
                {towerEntryContext?.type === 'overworld' ? 'Return to Vale' : 'Back to Menu'}
              </button>
            </div>
          </>
        ) : isRestFloor ? (
          <>
            <h2>Rest Floor</h2>
            <p>Restore {Math.round(REST_HEAL * 100)}% HP and reset Djinn before the next stretch.</p>
            <div class="tower-actions">
              <button class="primary" onClick={applyTowerRest}>
                Take Rest
              </button>
              <button onClick={beginTowerFloorBattle}>Skip Rest</button>
              <button class="ghost" onClick={handleQuitRun}>
                Quit Run
              </button>
            </div>
            <div class="tower-loadout-actions">
              <span>Adjust loadouts:</span>
              <div class="tower-rest-buttons">
                <button onClick={() => setLoadoutPanel('party')}>Party</button>
                <button onClick={() => setLoadoutPanel('equipment')}>Equipment</button>
                <button onClick={() => setLoadoutPanel('djinn')}>Djinn</button>
              </div>
            </div>
          </>
        ) : (
          <>
            <h2>{currentFloor ? `Floor ${currentFloor.floorNumber}` : 'All Floors Cleared'}</h2>
            <p>
              {currentFloor
                ? `Encounter: ${currentFloor.encounterId}`
                : 'There are no more encounters defined for this build.'}
            </p>
            <div class="tower-actions">
              <button
                class="primary"
                disabled={!currentFloor || isRestFloor}
                onClick={beginTowerFloorBattle}
              >
                Begin Battle
              </button>
              <button class="ghost" onClick={handleQuitRun}>
                Quit Run
              </button>
              <button onClick={exitTowerMode}>
                {towerEntryContext?.type === 'overworld' ? 'Return to Vale' : 'Back to Menu'}
              </button>
            </div>
          </>
        )}
      </section>

      <section class="tower-card stats">
        <h3>Run Stats</h3>
        <ul>
          <li>
            <span>Turns Taken</span>
            <span>{stats.turnsTaken}</span>
          </li>
          <li>
            <span>Total Damage Dealt</span>
            <span>{stats.totalDamageDealt}</span>
          </li>
          <li>
            <span>Total Damage Taken</span>
            <span>{stats.totalDamageTaken}</span>
          </li>
          <li>
            <span>Retreats</span>
            <span>{stats.retreats}</span>
          </li>
        </ul>
      </section>

      <section class="tower-card party" data-testid="tower-party-summary">
        <h3>Party Status</h3>
        {partySummary.length === 0 ? (
          <p class="value">No party data available.</p>
        ) : (
          <div class="party-grid">
            {partySummary.map((unit) => (
              <div key={unit.id} class="party-unit">
                <div class="unit-header">
                  <span>{unit.name}</span>
                  <span>
                    {unit.currentHp} / {unit.maxHp}
                  </span>
                </div>
                <div class="hp-bar">
                  <div style={{ width: `${unit.hpPercent}%` }} />
                </div>
                {unit.djinn.length > 0 && (
                  <div class="djinn-badges">
                    {unit.djinn.map((djinnId) => {
                      const tracker = djinnStatus[djinnId];
                      return (
                        <span key={djinnId} class={`djinn-pill state-${tracker?.state ?? 'Set'}`}>
                          {tracker?.name ?? djinnId} · {tracker?.state ?? 'Set'}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <TowerRecords towerRecord={towerRecord} />

      {confirmAction && (
        <div class="tower-modal" role="dialog" aria-modal="true">
          <div class="tower-modal-content">
            <p>
              {confirmAction === 'quit'
                ? 'Are you sure? This will end the current Tower run.'
                : 'Start a new run? Your existing Tower progress will be lost.'}
            </p>
            <div class="tower-modal-actions">
              <button class="primary" onClick={handleConfirmAction}>
                {confirmAction === 'quit' ? 'Confirm Quit' : 'Start New Run'}
              </button>
              <button onClick={() => setConfirmAction(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {loadoutPanel === 'party' && <PartyManagementScreen onClose={closeLoadoutPanel} />}
      {loadoutPanel === 'equipment' && <ShopEquipScreen shopId="vale-armory" onClose={closeLoadoutPanel} />}
      {loadoutPanel === 'djinn' && <DjinnCollectionScreen onClose={closeLoadoutPanel} />}
    </div>
  );
}

const REST_HEAL = DEFAULT_TOWER_CONFIG.healFractionAtRest;

function renderFloor(floor: TowerFloor | null): JSX.Element {
  if (!floor) {
    return <p class="value">No remaining floors</p>;
  }

  const badgeClass = floor.type === 'boss' ? 'boss' : floor.type === 'rest' ? 'rest' : 'normal';
  const badgeLabel = floor.type === 'boss' ? 'Boss' : floor.type === 'rest' ? 'Rest' : 'Battle';

  return (
    <div class="floor-display" data-testid="tower-current-floor">
      <span class={`floor-pill ${badgeClass}`}>{badgeLabel}</span>
      {floor.type === 'rest' ? (
        <p class="value rest">Floor {floor.floorNumber} · Heal & Regroup</p>
      ) : (
        <p class={`value ${badgeClass}`}>
          Floor {floor.floorNumber} · {floor.encounterId}
        </p>
      )}
    </div>
  );
}

function describeRewardBundle(rewards: readonly TowerRewardEntry[]): string {
  return rewards
    .map((reward) => {
      const ids = reward.ids.join(', ');
      switch (reward.type) {
        case 'equipment':
          return `Equipment: ${ids}`;
        case 'djinn':
          return `Djinn: ${ids}`;
        case 'recruit':
          return `Recruit: ${ids}`;
        default:
          return ids;
      }
    })
    .join(' · ');
}

function getNextReward(
  run: TowerRunState | null
): { floorNumber: number; rewards: TowerRewardEntry[] } | null {
  if (!run) {
    return TOWER_REWARDS[0] ?? null;
  }

  const rewardedFloors = new Set(
    run.history
      .filter((entry) => entry.rewardsGranted.length > 0)
      .map((entry) => entry.floorNumber)
  );

  const currentEntry = run.history[run.floorIndex];
  const pivotFloor =
    currentEntry?.floorNumber ??
    ((run.history[run.history.length - 1]?.floorNumber ?? 0) + (run.isCompleted ? 0 : 1));

  return (
    TOWER_REWARDS.find(
      (reward) => !rewardedFloors.has(reward.floorNumber) && reward.floorNumber >= pivotFloor
    ) ?? null
  );
}

function buildPartySummary(team: Store['team']) {
  if (!team) {
    return [];
  }

  return team.units.map((unit) => {
    const { hp: maxHp } = calculateEffectiveStats(unit, team);
    const percent = maxHp > 0 ? Math.round((Math.max(unit.currentHp, 0) / maxHp) * 100) : 0;
    return {
      id: unit.id,
      name: unit.name,
      currentHp: unit.currentHp,
      maxHp,
      hpPercent: Math.max(0, Math.min(100, percent)),
      djinn: unit.djinn,
    };
  });
}

function buildDjinnStatus(team: Store['team']) {
  if (!team) {
    return {};
  }

  const entries: Record<
    string,
    {
      name: string;
      state: 'Set' | 'Standby' | 'Recovery';
    }
  > = {};

  for (const [djinnId, tracker] of Object.entries(team.djinnTrackers)) {
    entries[djinnId] = {
      name: DJINN[djinnId]?.name ?? djinnId,
      state: tracker.state,
    };
  }

  return entries;
}

function TowerRecords({ towerRecord }: { towerRecord: Store['towerRecord'] }): JSX.Element {
  return (
    <section class="tower-card record" data-testid="tower-record-panel">
      <h3>Tower Record</h3>
      <div class="record-grid">
        <div>
          <span class="label">Highest Floor Ever</span>
          <span class="value">{towerRecord.highestFloorEver}</span>
        </div>
        <div>
          <span class="label">Total Runs</span>
          <span class="value">{towerRecord.totalRuns}</span>
        </div>
        <div>
          <span class="label">Best Run (Turns)</span>
          <span class="value">{towerRecord.bestRunTurns ?? '—'}</span>
        </div>
        <div>
          <span class="label">Best Run (Damage)</span>
          <span class="value">{towerRecord.bestRunDamageDealt ?? '—'}</span>
        </div>
      </div>
    </section>
  );
}
