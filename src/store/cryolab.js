import Vue from "vue";
import { logBase } from "../js/utils/math";

export default {
    namespaced: true,
    state: {},
    getters: {
        expNeeded: () => (level) => {
            return Math.pow(level + 2, 2) * Math.pow(2, level) * 25;
        },
        currentFrozen: (state) => {
            let frozen = 0;
            for (const [, elem] of Object.entries(state)) {
                if (elem.active || elem.freeze) {
                    frozen++;
                }
            }
            return frozen;
        },
        featureIsFrozen: (state, getters, rootState) => {
            const feature = state[rootState.system.screen];
            return !!(feature?.active || feature?.freeze);
        },
        isFeatureFrozen: (state, getters, rootState) => (featureName) => {
            const feature = state[featureName];
            if (!feature) return false;

            const isDoubleDoorEnabled = rootState.system.settings.experiment.items.doubleDoorFridge.value;
            if (isDoubleDoorEnabled) {
                return feature.active || feature.freeze;
            } else {
                return feature.active;
            }
        },
        expGain: (state, getters, rootState) => (feature) => {
            let gain = 0;
            const subfeature = rootState.system.features[feature].currentSubfeature;
            for (const [, stat] of Object.entries(state[feature].data[subfeature])) {
                const statValue = rootState.stat[stat].total;
                if (statValue > 0) {
                    const baseValue = stat === 'farm_bestPrestige' ? statValue : logBase(statValue, stat === 'horde_bestPrestige0' ? 9 : 3);
                    gain += baseValue * Math.pow(1.1, baseValue) * 40;
                }
            }
            return gain;
        },
        prestigeGain: (state, getters, rootState, rootGetters) => (feature) => {
            const subfeature = rootState.system.features[feature].currentSubfeature;
            let obj = {};
            state[feature].data.forEach((data, index) => {
                const isActive = subfeature === index && (state[feature].active || state[feature].freeze);
                const gainMult = rootGetters['mult/get'](`${ feature }Cryolab${ isActive ? 'Active' : 'Passive' }${ index }`);
                if (gainMult > 0) {
                    for (const [currency, stat] of Object.entries(data)) {
                        const statValue = rootState.stat[stat].total;
                        if (statValue > 0) {
                            const doubleFreezeMultiplier = (state[feature].active && state[feature].freeze) ? 1.3 : 1;
                            obj[currency] = statValue * gainMult * doubleFreezeMultiplier * (stat === 'farm_bestPrestige' ? 500 : 1);
                        }
                    }
                }
            });
            return obj;
        },
        freezeTimeNetChange: (state, getters, rootState, rootGetters) => {
            const isDoubleDoorEnabled = rootState.system.settings.experiment.items.doubleDoorFridge.value;
            if (!isDoubleDoorEnabled) return 0;
            const isVillageFrozen = getters.isFeatureFrozen('village');
            const iceMakerBaseGain = isVillageFrozen ? 0 : rootGetters['mult/get']('cryolabFreezeTimeGainBase');
            let freezeConsumption = 0;
            for (const [, elem] of Object.entries(state)) {
                if (elem && elem.freeze) {
                    freezeConsumption++;
                }
            }
            return iceMakerBaseGain - freezeConsumption;
        }
    },
    mutations: {
        init(state, o) {
            const effect = o.effect ?? [[]];
            Vue.set(state, o.name, {
                unlock: o.unlock ?? null,
                active: false,
                freeze: false,
                exp: effect.map(() => 0),
                level: effect.map(() => 0),
                data: o.data ?? [{}],
                effect
            });
        },
        updateKey(state, o) {
            Vue.set(state[o.name], o.key, o.value);
        },
        updateSubfeatureKey(state, o) {
            Vue.set(state[o.name][o.key], o.subfeature, o.value);
        },
        updateFreezeTimeKey(state, o) {
            state[o.key] = o.value;
        },
        addFreezeTime(state, seconds) {
            state.freezeTimeAvailable += seconds;
            if (state.freezeTimeAvailable > 259200) {
                state.freezeTimeAvailable = 259200;
            }
        },
        consumeFreezeTime(state, seconds) {
            state.freezeTimeAvailable -= seconds;
        }
    },
    actions: {
        cleanState({ state, commit }) {
            for (const [key] of Object.entries(state)) {
                if (key === 'freezeTimeAvailable') continue;
                commit('updateKey', {name: key, key: 'active', value: false});
                commit('updateKey', {name: key, key: 'freeze', value: false});
            }
        },
        toggleActive({ state, getters, rootGetters, rootState, commit }, name) {
            const isDoubleDoorEnabled = rootState.system.settings.experiment.items.doubleDoorFridge.value;
            if (isDoubleDoorEnabled) {
                let currentActiveCount = 0;
                for (const [, elem] of Object.entries(state)) {
                    if (elem.active) {
                        currentActiveCount++;
                    }
                }
                if (state[name].active || currentActiveCount < rootGetters['mult/get']('cryolabMaxFeatures')) {
                    commit('updateKey', {name, key: 'active', value: !state[name].active});
                }
            } else {
                if (state[name].active || getters.currentFrozen < rootGetters['mult/get']('cryolabMaxFeatures')) {
                    commit('updateKey', {name, key: 'active', value: !state[name].active});
                }
            }
        },
        toggleFreeze({ state, getters, rootGetters, rootState, commit }, name) {
            const isDoubleDoorEnabled = rootState.system.settings.experiment.items.doubleDoorFridge.value;
            if (isDoubleDoorEnabled) {
                const freezeTime = rootGetters['currency/value']('cryolab_freezeTime');
                if (!state[name].freeze && freezeTime <= 0) {
                    return;
                }

                let currentFreezeCount = 0;
                for (const [, elem] of Object.entries(state)) {
                    if (elem.freeze) {
                        currentFreezeCount++;
                    }
                }
                if (state[name].freeze || currentFreezeCount < rootGetters['mult/get']('cryolabMaxFeatures')) {
                    commit('updateKey', {name, key: 'freeze', value: !state[name].freeze});
                }
            } else {
                if (state[name].freeze || getters.currentFrozen < rootGetters['mult/get']('cryolabMaxFeatures')) {
                    commit('updateKey', {name, key: 'freeze', value: !state[name].freeze});
                }
            }
        },
        clearFreezeStates({ state, commit }) {
            for (const [key] of Object.entries(state)) {
                commit('updateKey', {name: key, key: 'freeze', value: false});
            }
        },
        init({ commit }, o) {
            let modifiedEffect = [];
            (o.effect ?? [[]]).forEach((effect, subfeature) => {
                const activeMultName = `${ o.name }CryolabActive${ subfeature }`;
                const passiveMultName = `${ o.name }CryolabPassive${ subfeature }`;
                const featureMult = o.name === 'village' ? 0.4 : 1;
                modifiedEffect.push([
                    {name: activeMultName, type: 'base', value: lvl => lvl * featureMult * 0.02},
                    {name: passiveMultName, type: 'base', value: lvl => lvl * featureMult * 0.01},
                    ...effect
                ]);
                commit('mult/init', {feature: 'cryolab', name: activeMultName, display: 'percent', baseValue: 0.25 * featureMult}, {root: true});
                commit('mult/init', {feature: 'cryolab', name: passiveMultName, display: 'percent'}, {root: true});
            });
            commit('init', {...o, effect: modifiedEffect});
        },
        gainExp({ state, rootState, getters, commit, dispatch }, o) {
            const subfeature = rootState.system.features[o.feature].currentSubfeature;
            let exp = state[o.feature].exp[subfeature] + o.amount;
            const oldLevel = state[o.feature].level[subfeature];
            let newLevel = oldLevel;

            while (exp >= getters.expNeeded(newLevel)) {
                exp -= getters.expNeeded(newLevel);
                newLevel++;
                dispatch('note/find', 'cryolab_1', {root: true});
            }

            commit('updateSubfeatureKey', {name: o.feature, subfeature, key: 'exp', value: exp});
            if (newLevel > oldLevel) {
                commit('updateSubfeatureKey', {name: o.feature, subfeature, key: 'level', value: newLevel});
                dispatch('applyLevelEffects', {feature: o.feature, subfeature});
            }
        },
        applyLevelEffects({ state, dispatch }, o) {
            const level = state[o.feature].level[o.subfeature];
            if (level > 0) {
                state[o.feature].effect[o.subfeature].forEach(eff => {
                    dispatch('system/applyEffect', {
                        type: eff.type,
                        name: eff.name,
                        multKey: `cryolab_${ o.feature }_${ o.subfeature }`,
                        value: eff.value(level)
                    }, {root: true});
                });
            } else {
                state[o.feature].effect[o.subfeature].forEach(eff => {
                    dispatch('system/resetEffect', {
                        type: eff.type,
                        name: eff.name,
                        multKey: `cryolab_${ o.feature }_${ o.subfeature }`
                    }, {root: true});
                });
            }
        },
        addFreezeTime({ dispatch }, seconds) {
            dispatch('currency/gain', {feature: 'cryolab', name: 'freezeTime', amount: seconds}, {root: true});
        },
        consumeFreezeTime({ dispatch }, seconds) {
            dispatch('currency/spend', {feature: 'cryolab', name: 'freezeTime', amount: seconds}, {root: true});
        },
        checkFreezeTimeAndDisable({ state, rootGetters, commit }) {
            const freezeTime = rootGetters['currency/value']('cryolab_freezeTime');
            if (freezeTime <= 0) {
                for (const [key, elem] of Object.entries(state)) {
                    if (elem.freeze) {
                        commit('updateKey', {name: key, key: 'freeze', value: false});
                    }
                }
            }
        },
    }
}
