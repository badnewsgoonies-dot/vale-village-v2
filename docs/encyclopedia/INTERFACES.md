# Vale Village Interfaces & Types
<!-- Generated: 2026-01-06T09:18:24-05:00 -->

## Type Definitions
```
export type Line = { speaker: string; text: string };
export type ScreenType = 'title' | 'intro' | 'overworld' | 'battle' | 'menu' | 'team-select' | 'shop' | 'compendium' | 'rewards' | 'team-management' | 'djinn-collection' | 'tower' | 'credits' | 'epilogue';
export type ModalType = 'inventory' | 'settings' | 'dialogue' | 'pause' | 'team-management' | 'djinn-collection' | 'save' | 'help';
export interface FlowState {
export type BattlePhase = 'idle' | 'playerTurn' | 'enemyTurn' | 'victory' | 'defeat';
export type BattleEventType = 'attack' | 'ability' | 'item' | 'system';
export interface BattleEvent {
export interface BattleState {
export interface InventoryItem {
export interface InventoryState {
export interface BattleRewards {
export interface BattleSession {
export interface TeamMemberStats {
export interface TeamMember {
export interface SaveSlot {
export interface PlayerData {
export interface GameSlice {
export interface StartBattleParams {
export interface BattleSlice {
export interface TeamSlice {
export interface InventorySlice {
export type GameStore = GameSlice & BattleSlice & TeamSlice & InventorySlice;
export type SpeedPreset = keyof typeof SPEED_PRESETS;
export interface TeamSlice {
export interface StorySlice {
export interface RewardsSlice {
export interface BattleStateUpdate {
export interface QueueBattleSlice {
export interface DevModeSlice {
export interface InventorySlice {
export interface DialogueSlice {
export interface SaveSlice {
export type Store = QueueBattleSlice &
export interface GameFlowSlice {
export interface BattleSlotConfig {
export interface BattleConfig {
export interface BattleConfigValidationResult {
export interface OverworldSlice {
export type OverworldStore = OverworldSlice;
export interface TowerRecord {
```

## Exported Functions
```
export const DIALOGUE_TREES: Record<string, Line[]> = {
export const useGameStore = createWithEqualityFn<GameStore>()(
export const useFlowStore = <T>(
export const useBattleStore = <T>(
export const useTeamStore = <T>(
export const useInventoryStore = <T>(
export const TOUCH_TARGET_MIN = 44; // WCAG recommended minimum touch target
export const PORTRAIT_SIZE_SM = TOUCH_TARGET_MIN;
export const PORTRAIT_SIZE_MD = 56;
export const ANIMATION_TIMING = {
export function getEventTiming(eventType: string, _isGifCached: boolean): number {
export const SPEED_PRESETS = {
export function isAvailableInCampaign(entry: AvailabilityLike): boolean {
export function isAvailableInTower(entry: AvailabilityLike): boolean {
export function filterByAvailability<T extends AvailabilityLike>(items: readonly T[], target: AvailabilityTarget): T[] {
export function renderEventText(e: BattleEvent): string {
export function createStore() {
export const useStore = import.meta.env.DEV
export const store = useStore;
export const DEFAULT_BATTLE_SLOT_COUNT = MAX_PARTY_SIZE;
export const DEFAULT_DJINN_SLOT_COUNT = 3;
export function cloneEquipmentLoadout(loadout: EquipmentLoadout): EquipmentLoadout {
export function createDefaultDjinnSlots(selectedDjinn?: readonly string[]): readonly (string | null)[] {
export function buildBattleConfigForNextBattle(team: Team | null, roster: readonly Unit[], slotCount = DEFAULT_BATTLE_SLOT_COUNT): BattleConfig {
export function getActiveSlotUnitIds(config: BattleConfig): readonly string[] {
export function getEquipmentLoadoutForSlot(config: BattleConfig, slotIndex: number): EquipmentLoadout {
export function updateDjinnSlots(slots: readonly (string | null)[], slotIndex: number, djinnId: string | null): readonly (string | null)[] {
export function validateBattleConfig(
export const createOverworldSlice: StateCreator<OverworldSlice> = (set, get) => {
export const DEFAULT_TOWER_RECORD: TowerRecord = Object.freeze({
export const VALID_TRANSITIONS: Record<BattleUIPhase, readonly BattleUIPhase[]> = {
export function isValidTransition(from: BattleUIPhase, to: BattleUIPhase): boolean {
export function assertValidTransition(from: BattleUIPhase, to: BattleUIPhase): void {
export function deriveUIPhase(battlePhase: string | null | undefined): BattleUIPhase {
export function setPendingMenuSelection(modal: ModalType, selection: MenuSelectionSnapshot): void {
export function consumePendingMenuSelection(modal: ModalType): MenuSelectionSnapshot | null {
export const settingsHowToPlayMenu = new SettingsHowToPlayMenu();
export function EnemyPortalTile({ encounterId }: EnemyPortalTileProps): JSX.Element {
export function ManaCirclesBar({ remainingMana, maxMana, className, style }: ManaCirclesBarProps) {
export function EquipmentChoicePicker({ options, onSelect }: EquipmentChoicePickerProps): JSX.Element {
```
