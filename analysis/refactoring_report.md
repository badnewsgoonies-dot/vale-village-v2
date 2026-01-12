# Refactoring Report: UI/Logic Decoupling

## Findings

The investigation confirms significant tight coupling between UI and business logic across the codebase.

### 1. Screen UI Logic
*   **QueueBattleView.tsx:** A "god component" (~2000 lines) that mixes rendering, low-level animation timing, battle orchestration, and tutorial logic. It directly mutates store state for critical hits and victory processing.
*   **MainMenu.tsx:** Contains hardcoded business logic for creating the starter team (`createStarterTeamWithFlint`), which should reside in a service or factory.
*   **ShopScreen.tsx:** Acts as a controller, mixing view rendering with service orchestration and inventory filtering logic.

### 2. Overworld and Houses
*   **OverworldV2.tsx:** Handles interaction logic (input handling, building entry) and scene transitions (fade effects) directly within the component. It uses hardcoded logic for different building types and exit zones.
*   **VillageLayer.ts:** Contains hardcoded initial unlock states and building-specific rendering rules (glow colors, prompts) that should be data-driven.

## Decoupling Plan

We will "de-integrate" this logic by introducing a proper separation of concerns:

1.  **Extract Battle Logic:** Move orchestration and complex state management from `QueueBattleView.tsx` into a `useBattleOrchestrator` hook and specific sub-hooks.
2.  **Service-based Initialization:** Move new game setup logic from `MainMenu.tsx` to a `GameInitializationService`.
3.  **Shop Controller:** Extract shop business logic into a `useShopController` hook.
4.  **Data-Driven Overworld:** Refactor `OverworldV2` to read interaction and transition rules from external configuration files, and move rendering logic into generic renderers.

This refactoring will improve maintainability, testability, and scalability of the codebase.
