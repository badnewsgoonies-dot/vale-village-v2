"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const jsx_runtime_1 = require("preact/jsx-runtime");
const hooks_1 = require("preact/hooks");
const shallow_1 = require("zustand/shallow");
const gameStore_1 = require("./store/gameStore");
const TitleScreen_1 = require("./screens/TitleScreen");
const OverworldMap_1 = require("./screens/OverworldMap");
const QueueBattleView_1 = require("./screens/QueueBattleView");
const MainMenu_1 = require("./screens/MainMenu");
const CompendiumScreen_1 = require("./ui/components/CompendiumScreen");
const PreBattleTeamSelectScreenV2_1 = require("./ui/components/PreBattleTeamSelectScreenV2");
const RewardsScreen_1 = require("./ui/components/RewardsScreen");
const ShopScreen_1 = require("./ui/components/ShopScreen");
const TowerHubScreen_1 = require("./ui/components/TowerHubScreen");
const IntroScreen_1 = require("./ui/components/IntroScreen");
const store_1 = require("./ui/state/store");
const dialogues_1 = require("@/data/definitions/dialogues");
const postBattleDialogues_1 = require("@/data/definitions/postBattleDialogues");
const TransitionSpiral_1 = require("./ui/components/TransitionSpiral");
const DevModeOverlay_1 = require("./ui/components/debug/DevModeOverlay");
// Wrapper that reads team-select props from V1 store
const TeamSelectWrapper = () => {
    const { pendingBattleEncounterId, confirmBattleTeam, setPendingBattle, setMode, towerEntryContext } = (0, store_1.useStore)((s) => ({
        pendingBattleEncounterId: s.pendingBattleEncounterId,
        confirmBattleTeam: s.confirmBattleTeam,
        setPendingBattle: s.setPendingBattle,
        setMode: s.setMode,
        towerEntryContext: s.towerEntryContext,
    }));
    const startTransition = (0, gameStore_1.useGameStore)((s) => s.startTransition);
    const handleConfirm = () => {
        confirmBattleTeam();
        if (store_1.useStore.getState().mode === "battle") {
            startTransition("battle");
        }
        else {
            console.error("Failed to start battle - validation or creation error");
        }
    };
    const handleCancel = () => {
        setPendingBattle(null);
        if (towerEntryContext) {
            setMode('tower');
            startTransition('tower');
        }
        else {
            startTransition('overworld');
        }
    };
    if (!pendingBattleEncounterId) {
        return ((0, jsx_runtime_1.jsxs)("div", { style: { color: '#fff', textAlign: 'center', padding: '2rem' }, children: [(0, jsx_runtime_1.jsx)("div", { style: { marginBottom: '1rem' }, children: "No battle pending..." }), (0, jsx_runtime_1.jsx)("button", { onClick: () => {
                        if (towerEntryContext) {
                            setMode('tower');
                            startTransition('tower');
                        }
                        else {
                            setMode('overworld');
                            startTransition('overworld');
                        }
                    }, class: "gs-button", style: { margin: '0 auto' }, children: "Return" })] }));
    }
    return ((0, jsx_runtime_1.jsx)(PreBattleTeamSelectScreenV2_1.PreBattleTeamSelectScreenV2, { encounterId: pendingBattleEncounterId, onConfirm: handleConfirm, onCancel: handleCancel }));
};
// Wrapper that reads rewards props from V1 store
const RewardsWrapper = () => {
    const { lastBattleRewards, team, lastBattleNewDjinnIds, lastBattleBonusEquipment, lastBattleBonusRecruits, claimRewards, selectEquipmentChoice, returnToOverworld, setBattle, towerStatus, setMode, lastBattleEncounterId, startDialogueTree, } = (0, store_1.useStore)((s) => ({
        lastBattleRewards: s.lastBattleRewards,
        team: s.team,
        lastBattleNewDjinnIds: s.lastBattleNewDjinnIds,
        lastBattleBonusEquipment: s.lastBattleBonusEquipment,
        lastBattleBonusRecruits: s.lastBattleBonusRecruits,
        claimRewards: s.claimRewards,
        selectEquipmentChoice: s.selectEquipmentChoice,
        returnToOverworld: s.returnToOverworld,
        setBattle: s.setBattle,
        towerStatus: s.towerStatus,
        setMode: s.setMode,
        lastBattleEncounterId: s.lastBattleEncounterId,
        startDialogueTree: s.startDialogueTree,
    }));
    const startTransition = (0, gameStore_1.useGameStore)((s) => s.startTransition);
    (0, hooks_1.useEffect)(() => {
        if (lastBattleRewards && team) {
            return;
        }
        if (towerStatus === 'in-run' || towerStatus === 'completed') {
            setMode('tower');
            startTransition('tower');
            return;
        }
        returnToOverworld();
        startTransition('overworld');
    }, [lastBattleRewards, team, towerStatus, returnToOverworld, setMode, startTransition]);
    const handleRewardsContinue = () => {
        claimRewards();
        setBattle(null, 0);
        const encounterId = lastBattleEncounterId;
        if (encounterId) {
            const postId = postBattleDialogues_1.ENCOUNTER_TO_POST_BATTLE_DIALOGUE[encounterId] ?? null;
            if (postId && dialogues_1.DIALOGUES[postId]) {
                store_1.store.setState({ lastBattleEncounterId: null });
                startDialogueTree(dialogues_1.DIALOGUES[postId]);
                return;
            }
            store_1.store.setState({ lastBattleEncounterId: null });
        }
        if (towerStatus === 'in-run' || towerStatus === 'completed') {
            setMode('tower');
            startTransition('tower');
        }
        else {
            returnToOverworld();
            startTransition('overworld');
        }
    };
    if (!lastBattleRewards || !team) {
        return (0, jsx_runtime_1.jsx)("div", { style: { color: '#fff', textAlign: 'center', padding: '2rem' }, children: "No rewards available..." });
    }
    return ((0, jsx_runtime_1.jsx)(RewardsScreen_1.RewardsScreen, { rewards: lastBattleRewards, team: team, newDjinnIds: lastBattleNewDjinnIds, bonusEquipment: lastBattleBonusEquipment, bonusRecruits: lastBattleBonusRecruits, onContinue: handleRewardsContinue, onSelectEquipment: selectEquipmentChoice }));
};
// Wrapper that reads shop props from V1 store
const ShopWrapper = () => {
    const { currentShopId, shopEntryContext, exitShop, setMode } = (0, store_1.useStore)((s) => ({
        currentShopId: s.currentShopId,
        shopEntryContext: s.shopEntryContext,
        exitShop: s.exitShop,
        setMode: s.setMode,
    }));
    const startTransition = (0, gameStore_1.useGameStore)((s) => s.startTransition);
    const handleClose = () => {
        const entryContext = shopEntryContext;
        exitShop();
        startTransition(entryContext === 'menu' ? 'menu' : 'overworld');
    };
    (0, hooks_1.useEffect)(() => {
        if (currentShopId) {
            return;
        }
        if (shopEntryContext === 'menu') {
            setMode('main-menu');
            startTransition('menu');
            return;
        }
        setMode('overworld');
        startTransition('overworld');
    }, [currentShopId, shopEntryContext, setMode, startTransition]);
    if (!currentShopId) {
        return (0, jsx_runtime_1.jsx)("div", { style: { color: '#fff', textAlign: 'center', padding: '2rem' }, children: "No shop available..." });
    }
    return (0, jsx_runtime_1.jsx)(ShopScreen_1.ShopScreen, { shopId: currentShopId, onClose: handleClose });
};
const PauseMenu_1 = require("./modals/PauseMenu");
const DialogueChatOverlay_1 = require("./ui/components/DialogueChatOverlay");
const InventoryModal_1 = require("./modals/InventoryModal");
const SettingsModal_1 = require("./modals/SettingsModal");
const SaveMenu_1 = require("./ui/components/SaveMenu");
const HowToPlay_1 = require("./modals/HowToPlay");
const PartyManagementScreen_1 = require("./ui/components/PartyManagementScreen");
const DjinnCollectionScreen_1 = require("./ui/components/DjinnCollectionScreen");
const CreditsScreen_1 = require("./ui/components/CreditsScreen");
const EpilogueScreen_1 = require("./ui/components/EpilogueScreen");
require("./index.css");
function useStoreSync() {
    const mode = (0, store_1.useStore)((s) => s.mode);
    const setMode = (0, store_1.useStore)((s) => s.setMode);
    const isDialogueActive = (0, store_1.useStore)((s) => Boolean(s.currentDialogueState));
    const towerStatus = (0, store_1.useStore)((s) => s.towerStatus);
    const pendingBattleEncounterId = (0, store_1.useStore)((s) => s.pendingBattleEncounterId);
    const currentScreen = (0, gameStore_1.useGameStore)((s) => s.flow.screen);
    const activeModal = (0, gameStore_1.useGameStore)((s) => s.flow.modal);
    const isTransitioning = (0, gameStore_1.useGameStore)((s) => s.flow.isTransitioning);
    const startTransition = (0, gameStore_1.useGameStore)((s) => s.startTransition);
    const openModal = (0, gameStore_1.useGameStore)((s) => s.openModal);
    const closeModal = (0, gameStore_1.useGameStore)((s) => s.closeModal);
    (0, hooks_1.useEffect)(() => {
        if (isTransitioning) {
            return;
        }
        if (pendingBattleEncounterId && currentScreen !== 'team-select') {
            startTransition('team-select');
            return;
        }
        switch (mode) {
            case 'tower':
                if ((towerStatus === 'in-run' || towerStatus === 'completed' || towerStatus === 'idle') &&
                    currentScreen !== 'tower') {
                    startTransition('tower');
                }
                break;
            case 'team-select':
                if (currentScreen !== 'team-select') {
                    startTransition('team-select');
                }
                break;
            case 'battle':
                if (currentScreen !== 'battle') {
                    startTransition('battle');
                }
                break;
            case 'rewards':
                if (currentScreen !== 'rewards') {
                    startTransition('rewards');
                }
                break;
            case 'shop':
                if (currentScreen !== 'shop') {
                    startTransition('shop');
                }
                break;
            case 'compendium':
                if (currentScreen !== 'compendium') {
                    startTransition('compendium');
                }
                break;
            case 'team-management':
                if (currentScreen !== 'team-management') {
                    startTransition('team-management');
                }
                break;
            case 'djinn-collection':
                if (currentScreen !== 'djinn-collection') {
                    startTransition('djinn-collection');
                }
                break;
            case 'credits':
                if (currentScreen !== 'credits') {
                    startTransition('credits');
                }
                break;
            case 'epilogue':
                if (currentScreen !== 'epilogue') {
                    startTransition('epilogue');
                }
                break;
            case 'overworld':
                if (currentScreen !== 'overworld') {
                    startTransition('overworld');
                }
                break;
            case 'intro':
                if (currentScreen !== 'intro') {
                    startTransition('intro');
                }
                break;
            case 'main-menu':
                if (currentScreen !== 'menu') {
                    startTransition('menu');
                }
                break;
            case 'title-screen':
                if (currentScreen !== 'title') {
                    startTransition('title');
                }
                break;
            case 'dialogue':
                if (activeModal !== 'dialogue') {
                    openModal('dialogue');
                }
                break;
            default:
                break;
        }
    }, [mode, towerStatus, currentScreen, activeModal, isTransitioning, startTransition, openModal, closeModal]);
    (0, hooks_1.useEffect)(() => {
        if (isTransitioning) {
            return;
        }
        const screenToMode = {
            title: 'title-screen',
            menu: 'main-menu',
            intro: 'intro',
            overworld: 'overworld',
            battle: 'battle',
            rewards: 'rewards',
            shop: 'shop',
            'team-select': 'team-select',
            compendium: 'compendium',
            tower: 'tower',
            'team-management': 'team-management',
            'djinn-collection': 'djinn-collection',
            credits: 'credits',
            epilogue: 'epilogue',
        };
        const desiredMode = screenToMode[currentScreen];
        if (desiredMode && desiredMode !== mode) {
            if (desiredMode === 'overworld' && mode === 'team-select' && pendingBattleEncounterId) {
                return;
            }
            setMode(desiredMode);
            return;
        }
        if (activeModal === 'dialogue' && mode !== 'dialogue') {
            if (isDialogueActive) {
                setMode('dialogue');
            }
            else {
                closeModal();
            }
        }
    }, [activeModal, currentScreen, isDialogueActive, isTransitioning, pendingBattleEncounterId, setMode, closeModal]);
}
const App = () => {
    useStoreSync();
    const { showCredits, setShowCredits, setMode } = (0, store_1.useStore)((s) => ({
        showCredits: s.showCredits,
        setShowCredits: s.setShowCredits,
        setMode: s.setMode,
    }));
    const { screen, modal, isTransitioning, startTransition, openModal, closeModal, closeCompendium } = (0, gameStore_1.useGameStore)((state) => ({
        screen: state.flow.screen,
        modal: state.flow.modal,
        isTransitioning: state.flow.isTransitioning,
        startTransition: state.startTransition,
        openModal: state.openModal,
        closeModal: state.closeModal,
        closeCompendium: state.closeCompendium,
    }), shallow_1.shallow);
    const closeCompendiumFlow = (0, store_1.useStore)((state) => state.closeCompendium);
    const setModal = (m) => {
        if (m === null) {
            closeModal();
        }
        else {
            openModal(m);
        }
    };
    const renderScreen = () => {
        switch (screen) {
            case 'title': return (0, jsx_runtime_1.jsx)(TitleScreen_1.TitleScreen, {});
            case 'intro': return (0, jsx_runtime_1.jsx)(IntroScreen_1.IntroScreen, {});
            case 'overworld': return (0, jsx_runtime_1.jsx)(OverworldMap_1.OverworldMap, {});
            case 'battle': return (0, jsx_runtime_1.jsx)(QueueBattleView_1.QueueBattleView, {});
            case 'menu': return (0, jsx_runtime_1.jsx)(MainMenu_1.MainMenu, {});
            case 'compendium': return (0, jsx_runtime_1.jsx)(CompendiumScreen_1.CompendiumScreen, { onClose: () => { closeCompendiumFlow(); closeCompendium(); } });
            case 'team-select': return (0, jsx_runtime_1.jsx)(TeamSelectWrapper, {});
            case 'rewards': return (0, jsx_runtime_1.jsx)(RewardsWrapper, {});
            case 'shop': return (0, jsx_runtime_1.jsx)(ShopWrapper, {});
            case 'team-management': return (0, jsx_runtime_1.jsx)(PartyManagementScreen_1.PartyManagementScreen, { onClose: () => startTransition('overworld') });
            case 'djinn-collection': return (0, jsx_runtime_1.jsx)(DjinnCollectionScreen_1.DjinnCollectionScreen, { onClose: () => startTransition('overworld') });
            case 'tower': return (0, jsx_runtime_1.jsx)(TowerHubScreen_1.TowerHubScreen, {});
            case 'credits': return (0, jsx_runtime_1.jsx)(CreditsScreen_1.CreditsScreen, { onExit: () => startTransition('epilogue') });
            case 'epilogue': return (0, jsx_runtime_1.jsx)(EpilogueScreen_1.EpilogueScreen, { onComplete: () => startTransition('title') });
            default: return (0, jsx_runtime_1.jsx)(TitleScreen_1.TitleScreen, {});
        }
    };
    const renderModal = () => {
        if (!modal)
            return null;
        switch (modal) {
            case 'inventory': return (0, jsx_runtime_1.jsx)(InventoryModal_1.InventoryModal, { onClose: closeModal });
            case 'settings': return (0, jsx_runtime_1.jsx)(SettingsModal_1.SettingsModal, { onClose: closeModal });
            case 'save': return (0, jsx_runtime_1.jsx)(SaveMenu_1.SaveMenu, { onClose: closeModal });
            case 'help': return (0, jsx_runtime_1.jsx)(HowToPlay_1.HowToPlay, { onClose: closeModal });
            case 'pause':
                return (0, jsx_runtime_1.jsx)(PauseMenu_1.PauseMenu, { onClose: closeModal, onTeamManagement: () => { setMode('team-management'); startTransition('team-management'); }, onInventory: () => openModal('inventory'), onDjinnCollection: () => { setMode('djinn-collection'); startTransition('djinn-collection'); }, onSaveGame: () => openModal('save'), onSettings: () => openModal('settings'), onHowToPlay: () => openModal('help'), onReturnToTitle: () => startTransition('title') });
            default: return null;
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: `app-root${isTransitioning ? ' app-root--transitioning' : ''}`, children: [renderScreen(), renderModal(), (0, jsx_runtime_1.jsx)(TransitionSpiral_1.TransitionSpiral, { isVisible: isTransitioning && screen === 'battle' }), (0, jsx_runtime_1.jsx)(DialogueChatOverlay_1.DialogueChatOverlay, {}), (0, jsx_runtime_1.jsx)(DevModeOverlay_1.DevModeOverlay, {})] }));
};
exports.App = App;
exports.default = App;
