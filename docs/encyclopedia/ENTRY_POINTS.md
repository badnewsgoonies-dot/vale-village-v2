# Vale Village Entry Points
<!-- Generated: 2026-01-06T09:18:24-05:00 -->

## Main Entry
src/index.css
src/main.tsx

## App Component (first 40 lines)
```tsx
import { FunctionComponent, JSX } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { shallow } from 'zustand/shallow';

import { useGameStore, ScreenType, ModalType, GameStore } from './store/gameStore';

import { TitleScreen } from './screens/TitleScreen';
import { OverworldMap } from './screens/OverworldMap';
import { QueueBattleView } from './screens/QueueBattleView';
import { MainMenu } from './screens/MainMenu';
import { CompendiumScreen } from './ui/components/CompendiumScreen';
import { PreBattleTeamSelectScreenV2 } from './ui/components/PreBattleTeamSelectScreenV2';
import { RewardsScreen } from './ui/components/RewardsScreen';
import { ShopScreen } from './ui/components/ShopScreen';
import { TowerHubScreen } from './ui/components/TowerHubScreen';
import { IntroScreen } from './ui/components/IntroScreen';
import { useStore, store } from './ui/state/store';
import { DIALOGUES } from '@/data/definitions/dialogues';
import { ENCOUNTER_TO_POST_BATTLE_DIALOGUE } from '@/data/definitions/postBattleDialogues';
import type { GameFlowSlice } from './ui/state/gameFlowSlice';
import { ToolboxHelpers } from './ui/components/debug/ToolboxHelpers';

// Wrapper that reads team-select props from V1 store
const TeamSelectWrapper: FunctionComponent = () => {
  const { pendingBattleEncounterId, confirmBattleTeam, setPendingBattle, setMode, towerEntryContext } = useStore((s) => ({
    pendingBattleEncounterId: s.pendingBattleEncounterId,
    confirmBattleTeam: s.confirmBattleTeam,
    setPendingBattle: s.setPendingBattle,
    setMode: s.setMode,
    towerEntryContext: s.towerEntryContext,
  }));
  const startTransition = useGameStore((s) => s.startTransition);

  const handleConfirm = () => {
    confirmBattleTeam();
    if (useStore.getState().mode === "battle") {
      startTransition("battle");
    } else {
      console.error("Failed to start battle - validation or creation error");
    }
```
