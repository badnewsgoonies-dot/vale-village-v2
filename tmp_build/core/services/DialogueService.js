"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startDialogue = startDialogue;
exports.getCurrentNode = getCurrentNode;
exports.evaluateCondition = evaluateCondition;
exports.getAvailableChoices = getAvailableChoices;
exports.selectChoice = selectChoice;
exports.advanceDialogue = advanceDialogue;
exports.isDialogueComplete = isDialogueComplete;
function startDialogue(tree) {
    return {
        treeId: tree.id,
        currentNodeId: tree.startNodeId,
        history: [tree.startNodeId],
        variables: {},
    };
}
function getCurrentNode(tree, state) {
    return tree.nodes.find(node => node.id === state.currentNodeId);
}
function evaluateCondition(condition, context) {
    switch (condition.type) {
        case 'flag':
            return context.flags[condition.key] === condition.value;
        case 'item':
            return context.inventory.items.includes(condition.key);
        case 'gold':
            if (condition.operator === 'greaterThan')
                return context.gold > condition.value;
            if (condition.operator === 'lessThan')
                return context.gold < condition.value;
            return context.gold === condition.value;
        case 'level':
            if (condition.operator === 'greaterThan')
                return context.level > condition.value;
            if (condition.operator === 'lessThan')
                return context.level < condition.value;
            return context.level === condition.value;
        default:
            return false;
    }
}
function getAvailableChoices(node, context) {
    if (!node.choices)
        return [];
    return node.choices.filter(choice => {
        if (!choice.condition)
            return true;
        return evaluateCondition(choice.condition, context);
    });
}
function selectChoice(tree, state, choiceId, context) {
    const currentNode = getCurrentNode(tree, state);
    if (!currentNode)
        return state;
    const choice = currentNode.choices?.find(c => c.id === choiceId);
    if (!choice)
        return state;
    if (choice.condition && (!context || !evaluateCondition(choice.condition, context))) {
        return state;
    }
    return {
        ...state,
        currentNodeId: choice.nextNodeId,
        history: [...state.history, choice.nextNodeId],
        variables: choice.effects ? { ...state.variables, ...choice.effects } : state.variables,
    };
}
function advanceDialogue(tree, state, context) {
    const currentNode = getCurrentNode(tree, state);
    if (!currentNode)
        return null;
    if (currentNode.choices && currentNode.choices.length > 0) {
        if (!context)
            return null;
        const availableChoices = getAvailableChoices(currentNode, context);
        if (availableChoices.length > 0)
            return null;
    }
    if (currentNode.nextNodeId) {
        return {
            ...state,
            currentNodeId: currentNode.nextNodeId,
            history: [...state.history, currentNode.nextNodeId],
            // Copy effects from current node to state variables so they get processed
            variables: currentNode.effects ? { ...state.variables, ...currentNode.effects } : state.variables,
        };
    }
    return null;
}
function isDialogueComplete(tree, state, context) {
    const currentNode = getCurrentNode(tree, state);
    if (!currentNode)
        return true;
    if (currentNode.choices && currentNode.choices.length > 0) {
        if (!context)
            return false;
        const availableChoices = getAvailableChoices(currentNode, context);
        if (availableChoices.length > 0)
            return false;
    }
    return !currentNode.nextNodeId;
}
