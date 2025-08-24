import Vue from "vue";
import { TREASURE_FRAGMENT_BUY_COST, TREASURE_FRAGMENT_BUY_GAIN, TREASURE_TIER_DESTROY_MULT, TREASURE_TIER_REGULAR_MULT, TREASURE_TIER_SPECIAL_MULT, TREASURE_TIER_UPGRADE_MULT } from "../js/constants";
import { chance, randomElem } from "../js/utils/random";

export default {
    namespaced: true,
    state: {
        // Contains all equipped treasure items
        items: [],

        // Contains the new bought item (or null)
        newItem: null,

        // Contains temporarily stored treasure items (max 10, not active)
        temporaryStorage: [],

        // Contains crafting slots (max 3, not active, can also be used as temporary storage)
        craftingSlots: [],

        // Contains all features with their possible effects
        effect: {},

        // Contains translations from mult to feature
        effectToFeature: {},

        // Contains all different types of treasure
        type: {},

        // Contains all tier colors
        tierColor: ['white', 'yellow', 'orange', 'red', 'pink', 'purple', 'indigo', 'blue', 'teal', 'green', 'light-green', 'lime', 'amber', 'orange-red', 'red-pink', 'pink-purple', 'dark-blue', 'light-blue', 'cyan'],

        // Contains all item icons
        iconList: [
            'mdi-star', 'mdi-hexagram', 'mdi-star-four-points', 'mdi-star-three-points', 'mdi-lightning-bolt',
            'mdi-spear', 'mdi-stamper', 'mdi-magnify', 'mdi-shaker', 'mdi-checkerboard', 'mdi-sd', 'mdi-bullseye',
            'mdi-spa', 'mdi-sim', 'mdi-drama-masks', 'mdi-tag', 'mdi-water-pump', 'mdi-asterisk', 'mdi-filmstrip',
            'mdi-pillar', 'mdi-vhs'
        ],

        // Contains a list of all effects, also used to apply the mults
        effectCache: {},

        // Special modes (upgrade item using fragments or destroy items to get fragments)
        upgrading: false,
        deleting: false
    },
    getters: {
        tierChances: (state, getters, rootState) => {
            let chances = [];
            let chanceValue = rootState.meta.globalLevel / 1000;

            while (chanceValue > 0) {
                chances.push(chanceValue);

                chanceValue *= 0.9;
                chanceValue -= 0.2;
            }

            return chances;
        },
        tierChancesRaw: (state, getters) => {
            let arr = [];
            let tier = 0;
            let totalChance = 0;

            const upgradeChances = getters.tierChances;

            if (upgradeChances.length <= 0) {
                return [{tier: 0, chance: 1}];
            }

            upgradeChances.forEach((elem, key) => {
                if (elem < 1) {
                    const chance = (1 - totalChance) * (1 - elem)
                    arr.push({tier, chance});
                    totalChance += chance;
                }
                tier++;
                if ((key + 1) >= upgradeChances.length) {
                    arr.push({tier, chance: (1 - totalChance)});
                }
            });

            return arr;
        },
        effectValue: () => (base, tier = 0, level = 0, type) => {
            return base * Math.pow(type === 'special' ? TREASURE_TIER_SPECIAL_MULT : TREASURE_TIER_REGULAR_MULT, tier) * (level * (type === 'special' ? 0.05 : 0.2) + 1);
        },
        destroyFragments: (state, getters, rootState, rootGetters) => (tier, type) => {
            return rootGetters['mult/get']('currencyTreasureFragmentGain', Math.pow(TREASURE_TIER_DESTROY_MULT, tier) * state.type[type].destroyPrice);
        },
        upgradeFragments: (state) => (tier, level, type) => {
            const typeObj = state.type[type];
            if (typeObj.upgradePrice === null || (level >= typeObj.upgradeLimit && typeObj.upgradeScaling === null)) {
                return null;
            }
            return Math.round(Math.pow(TREASURE_TIER_UPGRADE_MULT, tier) * Math.pow(typeObj.upgradeScaling, Math.max(0, level - typeObj.upgradeLimit)) * typeObj.upgradePrice);
        },
        averageFragments: (state, getters) => {
            return getters.tierChancesRaw.reduce((a, b) => a + b.chance * getters.destroyFragments(b.tier, 'regular'), 0);
        },
        fragmentGain: (state, getters) => {
            return Math.round(getters.averageFragments * TREASURE_FRAGMENT_BUY_GAIN);
        },
        generateItem: (state, getters, rootState, rootGetters) => (type, tier = 0, auto = false, rngSkip = 0, bonusTier = 0, targetEffect = null) => {
            let rngGen = rootGetters['system/getRng']('treasure_' + type, rngSkip);

            let effectList = {};
            for (const [key, elem] of Object.entries(state.effect)) {
                if (key === 'mining' || rootState.unlock[`${key}Feature`].see) {
                    for (const [subkey, subelem] of Object.entries(elem)) {
                        if (subelem.unlock === null || rootState.unlock[subelem.unlock].see) {
                            if (!effectList[subelem.type]) {
                                effectList[subelem.type] = [];
                            }
                            effectList[subelem.type].push(subkey);
                        }
                    }
                }
            }

            let chosenEffect = [];
            if (targetEffect && state.type[type].slots.length > 0) {
                // If target effect is specified, use it for the first slot
                chosenEffect.push(targetEffect);
                // For remaining slots (if any), choose randomly
                for (let i = 1; i < state.type[type].slots.length; i++) {
                    const slot = state.type[type].slots[i];
                    const chosenElem = randomElem(effectList[slot.type], rngGen());
                    effectList[slot.type] = effectList[slot.type].filter(el => el !== chosenElem);
                    chosenEffect.push(chosenElem);
                }
            } else {
                // Normal random generation
                state.type[type].slots.forEach(slot => {
                    const chosenElem = randomElem(effectList[slot.type], rngGen());
                    effectList[slot.type] = effectList[slot.type].filter(el => el !== chosenElem);
                    chosenEffect.push(chosenElem);
                });
            }

            let level = 0;
            if (auto) {
                const tierChances = getters.tierChances;
                const tierValue = Math.max(0, tierChances.length * 5 + Math.floor(tierChances[tierChances.length - 1] * 22.5) + bonusTier);
                tier = Math.floor(tierValue / 5);
                level = tierValue % 5;
            }

            return {
                tier,
                type: type,
                level,
                fragmentsSpent: Math.round(state.type[type].destroyPrice * level * 0.6), // track spent fragments to refund the correct amount, even after balance changes
                icon: randomElem(state.iconList, rngGen()),
                effect: chosenEffect,
                valueCache: chosenEffect.map((el, i) => getters.effectValue(
                    state.effect[state.effectToFeature[el]][el].value * state.type[type].slots[i].power,
                    tier,
                    level,
                    type
                ))
            };
        },
        firstEmptySlot: (state, getters, rootState, rootGetters) => {
            if (state.newItem === null) {
                return -1;
            }
            const id = state.items.findIndex(elem => elem === null);
            if (id !== -1) {
                return id;
            }
            if (state.items.length < rootGetters['mult/get']('treasureSlots')) {
                return state.items.length;
            }
            return null;
        },
        previewNextTreasure: (state, getters, rootState, rootGetters) => (type, offset = 0) => {
            // 创建一个临时的RNG状态，不影响实际游戏
            const rngTierGen = rootGetters['system/getRng']('treasureTier_' + type, offset);
            const rngGen = rootGetters['system/getRng']('treasure_' + type, offset);
            
            // 计算预期的宝藏层级
            const tierChances = getters.tierChancesRaw;
            let tier = null;
            let totalChance = 0;
            const nextChance = rngTierGen();
            
            tierChances.forEach(elem => {
                totalChance += elem.chance;
                if (tier === null && nextChance < totalChance) {
                    tier = elem.tier;
                }
            });
            
            if (tier === null) {
                return null;
            }
            
            // 使用与generateItem相同的逻辑生成预览物品
            let effectList = {};
            for (const [key, elem] of Object.entries(state.effect)) {
                if (key === 'mining' || rootState.unlock[`${key}Feature`].see) {
                    for (const [subkey, subelem] of Object.entries(elem)) {
                        if (subelem.unlock === null || rootState.unlock[subelem.unlock].see) {
                            if (!effectList[subelem.type]) {
                                effectList[subelem.type] = [];
                            }
                            effectList[subelem.type].push(subkey);
                        }
                    }
                }
            }
            
            let chosenEffect = [];
            state.type[type].slots.forEach(slot => {
                const arr = effectList[slot.type];
                if (arr && arr.length > 0) {
                    const chosenElem = arr[Math.floor(rngGen() * arr.length)];
                    effectList[slot.type] = arr.filter(el => el !== chosenElem);
                    chosenEffect.push(chosenElem);
                }
            });
            
            const icon = state.iconList[Math.floor(rngGen() * state.iconList.length)];
            
            // 计算效果值
            const valueCache = chosenEffect.map((el, i) => {
                const feature = state.effectToFeature[el];
                const effectObj = state.effect[feature][el];
                return getters.effectValue(
                    effectObj.value * state.type[type].slots[i].power,
                    tier,
                    0,
                    type
                );
            });
            
            return {
                tier,
                type,
                icon,
                effect: chosenEffect,
                valueCache
            };
        },
        canCraft: (state) => {
            const items = state.craftingSlots.filter(item => item !== null);
            if (items.length !== 3) return false;

            // Check if all items have the same tier (color)
            const firstTier = items[0].tier;
            return items.every(item => item.tier === firstTier);
        },
        getRandomCraftUpgradeChance: (state, getters) => (currentTier) => {
            const tierChancesRaw = getters.tierChancesRaw;
            // Use the maximum tier from tierChancesRaw instead of tierChances.length
            const maxTier = Math.max(...tierChancesRaw.map(item => item.tier));

            if (currentTier === maxTier - 1) {
                return 30;
            } else if (currentTier === maxTier) {
                return 5;
            } else if (currentTier === maxTier + 1) {
                return 0;
            } else {
                return 50;
            }
        },
        craftingResult: (state, getters) => {
            if (!getters.canCraft) return null;

            const items = state.craftingSlots.filter(item => item !== null);
            const firstTier = items[0].tier;
            const firstType = items[0].type;
            const firstEffect = items[0].effect[0];
            const sameEffect = items.every(item => item.effect[0] === firstEffect);

            if (sameEffect) {
                // Same color same effect: upgrade tier by 1, keep same effect
                const tierChancesRaw = getters.tierChancesRaw;
                // Use the maximum tier from tierChancesRaw instead of tierChances.length
                const maxAllowedTier = Math.max(...tierChancesRaw.map(item => item.tier)) + 1;

                if (firstTier >= maxAllowedTier) {
                    return {
                        type: 'upgrade',
                        tier: firstTier,
                        treasureType: firstType,
                        targetEffect: firstEffect,
                        maxReached: true
                    };
                }

                const newTier = Math.min(firstTier + 1, maxAllowedTier);
                return {
                    type: 'upgrade',
                    tier: newTier,
                    treasureType: firstType,
                    targetEffect: firstEffect,
                    maxReached: newTier === maxAllowedTier
                };
            } else {
                // Same color different effects: random treasure
                return {
                    type: 'random',
                    tier: firstTier,
                    treasureType: 'regular', // Default type for random generation
                    items: items, // Pass items for seed generation
                    upgradeChance: getters.getRandomCraftUpgradeChance(firstTier)
                };
            }
        }
    },
    mutations: {
        initType(state, o) {
            Vue.set(state.type, o.name, {
                buyPrice: o.buyPrice ?? null,
                upgradePrice: o.upgradePrice ?? null,
                upgradeLimit: o.upgradeLimit ?? null,
                upgradeScaling: o.upgradeScaling ?? null,
                destroyPrice: o.destroyPrice ?? 10,
                slots: o.slots,
                icon: o.icon ?? null
            });
        },
        initEffect(state, o) {
            // Create feature if it doesn't exist
            const feature = o.feature ?? 'meta';
            if (!state.effect[feature]) {
                Vue.set(state.effect, feature, {});
            }

            Vue.set(state.effect[feature], o.name, {
                unlock: o.unlock ?? null,
                type: o.type ?? 'regular',
                icon: o.icon ?? 'mdi-circle',
                unique: o.unique ?? false,
                value: o.value ?? 0
            });

            // Create entry in translation object
            Vue.set(state.effectToFeature, o.name, o.feature);
        },
        updateKey(state, o) {
            Vue.set(state, o.key, o.value);
        },
        setItem(state, o) {
            if (o.id === -1) {
                Vue.set(state, 'newItem', o.item);
            } else {
                Vue.set(state.items, o.id, o.item);
            }
        },
        updateItemKey(state, o) {
            if (o.id === -1) {
                Vue.set(state.newItem, o.key, o.value);
            } else {
                Vue.set(state.items[o.id], o.key, o.value);
            }
        },
        updateTemporaryStorageItem(state, { index, item }) {
            if (index >= 0 && index < 10) {
                Vue.set(state.temporaryStorage, index, item);
            }
        },
        updateCraftingSlotItem(state, { index, item }) {
            if (index >= 0 && index < 3) {
                Vue.set(state.craftingSlots, index, item);
            }
        },
        initializeTemporaryStorage(state) {
            // Initialize temporary storage with 10 empty slots
            state.temporaryStorage = new Array(10).fill(null);
        },
        initializeCraftingSlots(state) {
            // Initialize crafting slots with 3 empty slots
            state.craftingSlots = new Array(3).fill(null);
        },
        clearTemporaryStorage(state) {
            state.temporaryStorage = new Array(10).fill(null);
        },
        clearCraftingSlots(state) {
            state.craftingSlots = new Array(3).fill(null);
        },
        moveItem(state, o) {
            while (state.items.length < (Math.max(o.from, o.to) + 1)) {
                state.items.push(null);
            }
            const fromContent = o.from === -1 ? state.newItem : state.items[o.from];
            const toContent = o.to === -1 ? state.newItem : state.items[o.to];

            // Cannot switch treasure in the temp slot
            if (o.from === -1 && fromContent && toContent) {
                return;
            }

            if (o.from === -1) {
                Vue.set(state, 'newItem', toContent);
            } else {
                Vue.set(state.items, o.from, toContent);
            }
            if (o.to === -1) {
                Vue.set(state, 'newItem', fromContent);
            } else {
                Vue.set(state.items, o.to, fromContent);
            }
        },
        deleteItem(state, id) {
            if (id === -1) {
                Vue.set(state, 'newItem', null);
            } else {
                Vue.set(state.items, id, null);
            }
        }
    },
    actions: {
        cleanState({ commit }) {
            commit('updateKey', {key: 'items', value: []});
            commit('updateKey', {key: 'newItem', value: null});
            commit('updateKey', {key: 'effectCache', value: {}});
            commit('updateKey', {key: 'upgrading', value: false});
            commit('updateKey', {key: 'deleting', value: false});

            // Clear temporary storage and crafting slots
            commit('clearTemporaryStorage');
            commit('clearCraftingSlots');
        },
        sortItems({ state, commit, dispatch }) {
            const featureOrder = {
                'mining': 1,
                'village': 2,
                'horde': 3,
                'farm': 4,
                'gallery': 5
            };
            const nullCount = state.items.filter(item => item === null).length;
            const filteredItems = state.items.filter(item => item !== null);
            filteredItems.sort((a, b) => {
                const featureA = state.effectToFeature[a.effect[0]];
                const featureB = state.effectToFeature[b.effect[0]];
                if (featureOrder[featureA] !== featureOrder[featureB]) {
                    return featureOrder[featureA] - featureOrder[featureB];
                }
                if (a.effect[0] !== b.effect[0]) {
                    return a.effect[0].localeCompare(b.effect[0]);
                }
                if (a.tier !== b.tier) {
                    return a.tier - b.tier;
                }
                return a.level - b.level;
            });
            const newItems = Array(state.items.length).fill(null);
            filteredItems.forEach((item, index) => {
                newItems[nullCount + index] = item;
            });
            commit('updateKey', {key: 'items', value: newItems});
            dispatch('updateEffectCache');
        },
        gain({ state, getters, rootGetters, commit }, type) {
            if (state.newItem === null) {

                // get tier based on first stored chance
                let rngGen = rootGetters['system/getRng']('treasureTier_' + type);
                commit('system/nextRng', {name: 'treasureTier_' + type, amount: 1}, {root: true});
                const nextChance = rngGen();

                let tier = null;
                let totalChance = 0;
                getters.tierChancesRaw.forEach(elem => {
                    totalChance += elem.chance;
                    if (tier === null && chance(totalChance, nextChance)) {
                        tier = elem.tier;
                    }
                });

                if (tier !== null) {
                    commit('updateKey', {key: 'newItem', value: getters.generateItem(type, tier)});
                    commit('system/nextRng', {name: 'treasure_' + type, amount: 1}, {root: true});
                } else {
                    console.error('Tier could not be defined');
                }
            }
        },
        buy({ state, rootGetters, dispatch }, type) {
            const price = state.type[type].buyPrice;
            if (state.newItem === null && rootGetters['currency/value']('gem_emerald') >= price) {
                dispatch('currency/spend', {feature: 'gem', name: 'emerald', amount: price}, {root: true});
                dispatch('gain', type);
            }
        },
        buyFragments({ getters, rootGetters, dispatch }) {
            if (rootGetters['currency/value']('gem_emerald') >= TREASURE_FRAGMENT_BUY_COST) {
                dispatch('currency/gain', {feature: 'treasure', name: 'fragment', amount: getters.fragmentGain}, {root: true});
                dispatch('currency/spend', {feature: 'gem', name: 'emerald', amount: TREASURE_FRAGMENT_BUY_COST}, {root: true});
            }
        },
        upgradeItem({ state, getters, rootGetters, commit, dispatch }, id) {
            const item = id === -1 ? state.newItem : state.items[id];
            if (item) {
                const cost = getters.upgradeFragments(item.tier, item.level, item.type);
                if (cost !== null && rootGetters['currency/value']('treasure_fragment') >= cost) {
                    dispatch('currency/spend', {feature: 'treasure', name: 'fragment', amount: cost}, {root: true});

                    // Increase level and update value cache
                    commit('updateItemKey', {id, key: 'valueCache', value: item.effect.map((el, i) => getters.effectValue(
                        state.effect[state.effectToFeature[el]][el].value * state.type[item.type].slots[i].power,
                        item.tier,
                        item.level + 1,
                        item.type
                    ))});
                    commit('updateItemKey', {id, key: 'fragmentsSpent', value: item.fragmentsSpent + cost});
                    commit('updateItemKey', {id, key: 'level', value: item.level + 1});

                    // Refresh cache
                    dispatch('updateEffectCache');
                }
            }
        },
        upgradeTemporaryItem({ state, getters, rootGetters, commit, dispatch }, index) {
            const item = state.temporaryStorage[index];
            if (item) {
                const cost = getters.upgradeFragments(item.tier, item.level, item.type);
                if (cost !== null && rootGetters['currency/value']('treasure_fragment') >= cost) {
                    //console.log('Upgrading temporary item at index', index, 'from level', item.level, 'to', item.level + 1, 'cost:', cost);
                    dispatch('currency/spend', {feature: 'treasure', name: 'fragment', amount: cost}, {root: true});

                    // Create updated item
                    const updatedItem = {
                        ...item,
                        level: item.level + 1,
                        fragmentsSpent: item.fragmentsSpent + cost,
                        valueCache: item.effect.map((el, i) => getters.effectValue(
                            state.effect[state.effectToFeature[el]][el].value * state.type[item.type].slots[i].power,
                            item.tier,
                            item.level + 1,
                            item.type
                        ))
                    };

                    // Update temporary storage item
                    commit('updateTemporaryStorageItem', { index, item: updatedItem });
                }
            }
        },
        winItem({ getters, commit, dispatch }, item) {
            const id = getters.firstEmptySlot;
            if (id !== null) {
                commit('setItem', {id, item});
            } else {
                dispatch('currency/gain', {feature: 'treasure', name: 'fragment', amount: item.fragmentsSpent + getters.destroyFragments(item.tier, item.type)}, {root: true});
            }
        },
        moveItem({ commit, dispatch }, o) {
            commit('moveItem', o);
            dispatch('updateEffectCache');
        },
        deleteItem({ state, getters, commit, dispatch }, id) {
            const item = id === -1 ? state.newItem : state.items[id];
            if (item) {
                dispatch('currency/gain', {feature: 'treasure', name: 'fragment', amount: item.fragmentsSpent + getters.destroyFragments(item.tier, item.type)}, {root: true});
                item.effect.forEach(ef => {
                    commit('mult/removeKey', {name: ef, type: 'mult', key: 'treasure'}, {root: true});
                });
                commit('deleteItem', id);
                dispatch('updateEffectCache');
            }
        },
        updateEffectCache({ state, commit, dispatch }) {
            let effects = {};

            // Only include main inventory items in effect calculation
            // Temporary storage and crafting slots never contribute to effects
            state.items.forEach(item => {
                if (item) {
                    item.effect.forEach((el, i) => {
                        const effectFeature = state.effectToFeature[el];
                        if (effects[effectFeature] === undefined) {
                            effects[effectFeature] = {};
                        }
                        if (effects[effectFeature][el] === undefined) {
                            effects[effectFeature][el] = 1;
                        }
                        effects[effectFeature][el] += item.valueCache[i];
                    });
                }
            });

            commit('updateKey', {key: 'effectCache', value: effects});

            for (const [, group] of Object.entries(effects)) {
                for (const [key, elem] of Object.entries(group)) {
                    dispatch('mult/setMult', {name: key, key: 'treasure', value: elem}, {root: true});
                }
            }
        },
        moveToTemporaryStorage({ state, commit, dispatch }, { itemIndex, storageIndex }) {
            // Move item from main inventory to temporary storage
            const item = state.items[itemIndex];
            if (item && storageIndex >= 0 && storageIndex < 10) {
                commit('setItem', { id: itemIndex, item: null });
                commit('updateTemporaryStorageItem', { index: storageIndex, item });
                dispatch('updateEffectCache');
            }
        },
        moveFromTemporaryStorage({ state, commit, dispatch }, { storageIndex, itemIndex }) {
            // Move item from temporary storage to main inventory
            const item = state.temporaryStorage[storageIndex];
            if (item && itemIndex >= 0) {
                commit('updateTemporaryStorageItem', { index: storageIndex, item: null });
                commit('setItem', { id: itemIndex, item });
                dispatch('updateEffectCache');
            }
        },
        moveToCraftingSlot({ state, commit, dispatch }, { fromType, fromIndex, slotIndex }) {
            // Move item to crafting slot from various sources
            let item = null;

            if (fromType === 'inventory') {
                item = state.items[fromIndex];
                if (item) {
                    commit('setItem', { id: fromIndex, item: null });
                    dispatch('updateEffectCache');
                }
            } else if (fromType === 'temporary') {
                item = state.temporaryStorage[fromIndex];
                if (item) {
                    commit('updateTemporaryStorageItem', { index: fromIndex, item: null });
                }
            } else if (fromType === 'newItem') {
                item = state.newItem;
                if (item) {
                    commit('updateKey', { key: 'newItem', value: null });
                }
            }

            if (item && slotIndex >= 0 && slotIndex < 3) {
                commit('updateCraftingSlotItem', { index: slotIndex, item });
            }
        },
        moveFromCraftingSlot({ state, commit, dispatch }, { slotIndex, toType, toIndex }) {
            // Move item from crafting slot to various destinations
            const item = state.craftingSlots[slotIndex];
            if (!item) return;

            commit('updateCraftingSlotItem', { index: slotIndex, item: null });

            if (toType === 'inventory') {
                commit('setItem', { id: toIndex, item });
                dispatch('updateEffectCache');
            } else if (toType === 'temporary') {
                commit('updateTemporaryStorageItem', { index: toIndex, item });
            }
        },
        craftTreasure({ state, getters, commit, dispatch }) {
            if (!getters.canCraft) return;

            const result = getters.craftingResult;
            if (!result) return;

            if (result.maxReached && result.type === 'upgrade') {
                dispatch('system/addNotification', {
                    color: 'warning',
                    timeout: 3000,
                    message: {
                        type: 'text',
                        text: '已到最高合成，无法继续合成'
                    }
                }, { root: true });
                return;
            }

            const items = state.craftingSlots.filter(item => item !== null);

            // Calculate fragments to return from consumed items
            let fragmentsToReturn = 0;
            items.forEach(item => {
                fragmentsToReturn += item.fragmentsSpent;
            });

            // Clear crafting slots
            for (let i = 0; i < 3; i++) {
                commit('updateCraftingSlotItem', { index: i, item: null });
            }

            let newItem;
            if (result.type === 'upgrade') {
                // Same color same effect: create upgraded treasure with same effect
                newItem = getters.generateItem(result.treasureType, result.tier, false, 0, 0, result.targetEffect);
            } else {
                // Same color different effects: create random treasure with custom seed
                // Generate seed based on items and daily timestamp for consistent daily randomness
                let seedString = '';
                items.forEach(item => {
                    seedString += item.effect[0] + item.level + item.tier;
                });

                // Add daily timestamp (YYYY-MM-DD format) to make patterns change daily
                const today = new Date();
                const dailyTimestamp = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
                seedString += dailyTimestamp.toString();

                const customSeed = seedString.split('').reduce((a, b) => {
                    a = ((a << 5) - a) + b.charCodeAt(0);
                    return a & a;
                }, 0);

                // Use custom seed to determine if tier should be upgraded
                const seedForTier = Math.abs(customSeed) % 100;
                const upgradeChance = result.upgradeChance || 30; // 使用动态概率
                const shouldUpgradeTier = seedForTier < upgradeChance;

                const finalTier = shouldUpgradeTier ?
                    Math.min(result.tier + 1, state.tierColor.length - 1) :
                    result.tier;

                newItem = getters.generateItem(result.treasureType, finalTier, false, Math.abs(customSeed) % 1000);
            }

            // Return fragments from consumed items
            if (fragmentsToReturn > 0) {
                dispatch('currency/gain', {feature: 'treasure', name: 'fragment', amount: fragmentsToReturn}, {root: true});
            }

            // Place in first crafting slot instead of inventory
            commit('updateCraftingSlotItem', { index: 0, item: newItem });
        }
    }
}
