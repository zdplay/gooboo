import Vue from "vue";
import { WEATHER_CHAOS_BAIT_COST, WEATHER_CHAOS_RESET_COST } from "../js/constants";
import { capitalize } from "../js/utils/format";
import { chance, randomElem, weightSelect } from "../js/utils/random";

export default {
    namespaced: true,
    state: {
        weather: {},
        fishingRod: {},
        location: {},
        fish: {},
        bait: {},
        condition: {
            sun: {on: 'mdi-weather-sunny', off: 'mdi-weather-sunny-off'},
            rain: {on: 'mdi-water', off: 'mdi-water-off'},
            snow: {on: 'mdi-snowflake', off: 'mdi-snowflake-off'},
            thunder: {on: 'mdi-flash', off: 'mdi-flash-off'},
            wind: {on: 'mdi-weather-windy', off: 'mdi-weather-cloudy'}
        },
        currentLocation: 'pond',
        currentFishingRod: 'basic',
        currentBait: null,
        nextWeather: [],
        fishingProgress: 0,
        treasureRods: 0,
        boughtRods: 0,
        fishingHistory: [],
        piratesTreasureDebug: false,
        piratesTreasureSeed: 0,
    },
    getters: {
        eventMult: (state, getters, rootState, rootGetters) => {
            return Math.pow(1.0075, rootGetters['meta/globalEventLevel']);
        },
        fishList: (state) => {
            let obj = {};
            for (const [key, elem] of Object.entries(state.fish)) {
                if (elem.location === state.currentLocation) {
                    obj[key] = elem;
                }
            }
            return obj;
        },
        fishWeights: (state, getters, rootState, rootGetters) => {
            let obj = {};
            const fishingPower = rootGetters['mult/get']('weatherChaosFishingPower');
            const ignoreWeather = rootGetters['mult/get']('weatherChaosIgnoreWeather');
            const weather = getters.currentWeather;
            let condition = {};
            Object.keys(state.condition).forEach(elem => {
                condition[elem] = state.weather[weather][elem];
            });
            for (const [key, elem] of Object.entries(getters.fishList)) {
                let fulfillsCondition = true;
                for (const [subkey, subelem] of Object.entries(condition)) {
                    if (elem[subkey] !== null && elem[subkey] !== subelem) {
                        fulfillsCondition = false;
                    }
                }
                if ((fulfillsCondition || ignoreWeather > 0) && elem.minPower <= fishingPower) {
                    const maxPower = elem.minPower * 2;
                    obj[key] = ((maxPower <= 0 || fishingPower >= maxPower) ? 1 : ((fishingPower - elem.minPower) / elem.minPower)) * (fulfillsCondition ? 1 : ignoreWeather) * elem.weight;
                }
            }
            return obj;
        },
        trashWeights: (state, getters, rootState, rootGetters) => {
            let obj = {};
            ['algae', 'driftwood', 'plastic'].forEach(elem => {
                const weight = rootGetters['mult/get'](`weatherChaos${ capitalize(elem) }Weight`);
                if (weight > 0) {
                    obj[elem] = weight;
                }
            });
            return obj;
        },
        treasureWeights: (state, getters, rootState, rootGetters) => {
            let obj = {bait: 2};

            const fishingPower = rootGetters['mult/get']('weatherChaosFishingPower');
            const next = state.location[state.currentLocation].next;
            const rodPower = Math.pow(2, state.treasureRods) * 75;

            if (getters.hasUnownedRod && fishingPower > rodPower) {
                obj.fishingRod = 0.1 * (fishingPower - rodPower) / rodPower;
            }
            if (next && !state.location[next.name].owned && fishingPower >= next.minPower) {
                obj.next = 0.5 * (fishingPower - next.minPower * 0.9) / next.minPower;
            }

            return obj;
        },
        currentWeather: (state) => {
            return state.nextWeather[0];
        },
        hasUnownedRod: (state) => {
            for (const [, elem] of Object.entries(state.fishingRod)) {
                if (!elem.owned) {
                    return true;
                }
            }
            return false;
        },
        rodCost: (state) => {
            return state.boughtRods * 150 + 400;
        }
    },
    mutations: {
        initWeather(state, o) {
            Vue.set(state.weather, o.name, {
                icon: o.icon,
                next: o.next,
                sun: o.sun ?? false,
                rain: o.rain ?? false,
                snow: o.snow ?? false,
                thunder: o.thunder ?? false,
                wind: o.wind ?? false,
            });
        },
        initFishingRod(state, o) {
            Vue.set(state.fishingRod, o.name, {
                owned: o.owned ?? false,
                ownedDefault: o.owned ?? false,
                icon: o.icon ?? 'mdi-sack',
                effect: o.effect ?? [],
            });
        },
        initLocation(state, o) {
            Vue.set(state.location, o.name, {
                owned: o.owned ?? false,
                ownedDefault: o.owned ?? false,
                next: o.next ?? null,
                effect: o.effect ?? [],
            });
        },
        initFish(state, o) {
            Vue.set(state.fish, o.name, {
                icon: o.icon ?? 'mdi-fish',
                iconSize: o.iconSize ?? 1,
                color: o.color ?? 'grey',
                size: o.size ?? 1,
                location: o.location,
                minPower: o.minPower ?? 0,
                weight: o.weight ?? 1,
                sun: o.sun ?? null,
                rain: o.rain ?? null,
                snow: o.snow ?? null,
                thunder: o.thunder ?? null,
                wind: o.wind ?? null,
                catchRecord: null,
            });
        },
        initBait(state, o) {
            Vue.set(state.bait, o.name, {
                icon: o.icon ?? 'mdi-sack',
                effect: o.effect ?? [],
                stackSize: o.stackSize ?? 1,
                owned: 0,
            });
        },
        updateKey(state, o) {
            Vue.set(state, o.key, o.value);
        },
        updateSubkey(state, o) {
            Vue.set(state[o.name][o.key], o.subkey, o.value);
        },
        addFishingRecord(state, record) {
            state.fishingHistory.unshift(record);
            
            if (state.fishingHistory.length > 50) {
                state.fishingHistory.pop();
            }
        }
    },
    actions: {
        cleanState({ state, commit }) {
            for (const [key, elem] of Object.entries(state.fishingRod)) {
                commit('updateSubkey', {name: 'fishingRod', key, subkey: 'owned', value: elem.ownedDefault});
            }
            for (const [key, elem] of Object.entries(state.location)) {
                commit('updateSubkey', {name: 'location', key, subkey: 'owned', value: elem.ownedDefault});
            }
            for (const [key] of Object.entries(state.fish)) {
                commit('updateSubkey', {name: 'fish', key, subkey: 'catchRecord', value: null});
            }
            for (const [key] of Object.entries(state.bait)) {
                commit('updateSubkey', {name: 'bait', key, subkey: 'owned', value: 0});
            }
            commit('updateKey', {key: 'currentLocation', value: 'pond'});
            commit('updateKey', {key: 'currentFishingRod', value: 'basic'});
            commit('updateKey', {key: 'currentBait', value: null});
            commit('updateKey', {key: 'nextWeather', value: []});
            commit('updateKey', {key: 'fishingProgress', value: 0});
            commit('updateKey', {key: 'treasureRods', value: 0});
            commit('updateKey', {key: 'boughtRods', value: 0});
            commit('updateKey', {key: 'fishingHistory', value: []});
            commit('updateKey', {key: 'piratesTreasureSeed', value: 0});
        },
        catchFish({ state, rootGetters, commit, dispatch }, name) {
            const fish = state.fish[name];
            const averageSize = rootGetters['mult/get']('weatherChaosFishSizeAverage');
            const maxSize = Math.round(rootGetters['mult/get']('weatherChaosFishSizeMax', fish.size));
            let size = 1;
            while (size < maxSize) {
                if (!chance((1 - (1 / (1 + maxSize - size))) * Math.min(averageSize / size, 1))) {
                    break;
                }
                size++;
            }

            dispatch('currency/gain', {feature: 'event', name: 'slime', gainMult: true, amount: size}, {root: true});

            commit('addFishingRecord', {
                type: 'fish',
                fishName: name,
                size: size,
                location: state.currentLocation,
                time: Date.now()
            });

            if (state.fish[name].catchRecord === null || state.fish[name].catchRecord < size) {
                dispatch('event/giveTokens', {event: 'weatherChaos', amount: size - (state.fish[name].catchRecord ?? 0)}, {root: true});
                commit('updateSubkey', {name: 'fish', key: name, subkey: 'catchRecord', value: size});
                dispatch('note/find', 'event_18', {root: true});
            }
        },
        getCatch({ state, getters, rootGetters, commit, dispatch }, amount = 1) {
            const fishChance = rootGetters['mult/get']('weatherChaosFishChance');
            const fishDoubleChance = rootGetters['mult/get']('weatherChaosFishDoubleChance');
            const treasureChance = rootGetters['mult/get']('weatherChaosTreasureChance');
            const piratesTreasureChance = 0.005;
            let fishNames = [];
            let fishWeights = [];
            let trashNames = [];
            let trashWeights = [];
            for (const [key, elem] of Object.entries(getters.fishWeights)) {
                fishNames.push(key);
                fishWeights.push(elem);
            }
            for (const [key, elem] of Object.entries(getters.trashWeights)) {
                trashNames.push(key);
                trashWeights.push(elem);
            }
            for (let i = 0; i < amount; i++) {
                let rngGen = rootGetters['system/getRng']('weatherChaos_catch');
                commit('system/nextRng', {name: 'weatherChaos_catch', amount: 1}, {root: true});
                
                if (chance(treasureChance, rngGen())) {
                    let treasureNames = [];
                    let treasureWeights = [];
                    for (const [key, elem] of Object.entries(getters.treasureWeights)) {
                        treasureNames.push(key);
                        treasureWeights.push(elem);
                    }
                    const treasureCaught = treasureNames[weightSelect(treasureWeights, rngGen())];

                    if (treasureCaught === 'next') {
                        const next = state.location[state.currentLocation].next;
                        if (next) {
                            commit('updateSubkey', {name: 'location', key: next.name, subkey: 'owned', value: true});
                            
                            commit('addFishingRecord', {
                                type: 'treasure',
                                treasureType: 'location',
                                location: next.name,
                                time: Date.now()
                            });
                            
                            dispatch('note/find', 'event_17', {root: true});
                        }
                    } else if (treasureCaught === 'fishingRod') {
                        let eligible = [];
                        for (const [key, elem] of Object.entries(state.fishingRod)) {
                            if (!elem.owned) {
                                eligible.push(key);
                            }
                        }
                        if (eligible.length > 0) {
                            let rngGenRod = rootGetters['system/getRng']('weatherChaos_fishingRod');
                            commit('system/nextRng', {name: 'weatherChaos_fishingRod', amount: 1}, {root: true});
                            const rodName = randomElem(eligible, rngGenRod());
                            commit('updateSubkey', {name: 'fishingRod', key: rodName, subkey: 'owned', value: true});
                            commit('updateKey', {key: 'treasureRods', value: state.treasureRods + 1});
                            
                            commit('addFishingRecord', {
                                type: 'treasure',
                                treasureType: 'fishingRod',
                                fishingRod: rodName,
                                time: Date.now()
                            });
                        }
                    } else if (treasureCaught === 'bait') {
                        const baitName = randomElem(Object.keys(state.bait), rngGen());
                        const bait = state.bait[baitName];
                        const amount = bait.stackSize;
                        commit('updateSubkey', {name: 'bait', key: baitName, subkey: 'owned', value: bait.owned + amount});
                        
                        commit('addFishingRecord', {
                            type: 'treasure',
                            treasureType: 'bait',
                            bait: baitName,
                            amount: amount,
                            time: Date.now()
                        });
                    }
                } else if (chance(fishChance, rngGen())) {
                    for (let i = 0, n = chance(fishDoubleChance) ? 2 : 1; i < n; i++) {
                        dispatch('catchFish', fishNames[weightSelect(fishWeights, rngGen())]);
                    }
                    dispatch('note/find', 'event_16', {root: true});
                } else {
                    const trashName = trashNames[weightSelect(trashWeights, rngGen())];
                    const trashAmount = 100 * getters.eventMult;
                    const actualAmount = rootGetters['mult/get'](rootGetters['currency/gainMultName']('event', trashName), trashAmount);
                    
                    commit('addFishingRecord', {
                        type: 'trash',
                        trashName: trashName,
                        amount: actualAmount,
                        time: Date.now()
                    });
                    
                    dispatch('currency/gain', {feature: 'event', name: trashName, gainMult: true, amount: trashAmount}, {root: true});
                }
                
                // 使用基于日期的固定种子判断宝藏掉落
                // 获取当天日期作为基础种子
                const today = new Date();
                const dateSeed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
                
                // 将种子与玩家特有状态结合（如当前钓鱼地点、装备、历史记录数量等）
                // 这确保同一天内相同玩家状态下结果一致，但不同状态下结果不同
                const playerState = state.currentLocation + state.currentFishingRod + (state.currentBait || "") + state.fishingHistory.length;
                let hash = 0;
                for (let j = 0; j < playerState.length; j++) {
                    hash = ((hash << 5) - hash) + playerState.charCodeAt(j);
                    hash = hash & hash; // 转换为32位整数
                }
                
                // 合并日期种子和玩家状态种子
                const combinedSeed = dateSeed ^ hash;
                
                // 使用伪随机数生成器，每次掉落判断都使用不同的"随机"位置
                const pseudoRandom = (seed, position) => {
                    const x = Math.sin(seed + position) * 10000;
                    return x - Math.floor(x);
                };
                
                // 计算今天的掉落结果，使用固定种子
                if (pseudoRandom(combinedSeed, state.piratesTreasureSeed) < piratesTreasureChance) {
                    // 使用固定种子确定黄玉数量，确保刷新页面时数量也一致
                    const topazSeed = combinedSeed * 31 + state.piratesTreasureSeed;
                    const topazAmount = Math.floor(1 + pseudoRandom(topazSeed, 0) * 100);
                    
                    dispatch('currency/gain', {feature: 'gem', name: 'topaz', amount: topazAmount}, {root: true});
                    
                    commit('addFishingRecord', {
                        type: 'treasure',
                        treasureType: 'piratesTreasure',
                        amount: topazAmount,
                        time: Date.now()
                    });
                }
                
                // 增加种子值，确保下次判断使用不同的"随机"位置
                commit('updateKey', {key: 'piratesTreasureSeed', value: state.piratesTreasureSeed + 1});
            }
        },
        applyLocationEffects({ state, dispatch }, name) {
            state.location[name].effect.forEach(eff => {
                dispatch('system/applyEffect', {type: eff.type, name: eff.name, multKey: `weatherChaosLocation_${ name }`, value: eff.value, trigger: true}, {root: true});
            });
        },
        resetLocationEffects({ state, dispatch }, name) {
            state.location[name].effect.forEach(eff => {
                dispatch('system/resetEffect', {type: eff.type, name: eff.name, multKey: `weatherChaosLocation_${ name }`}, {root: true});
            });
        },
        changeLocation({ state, commit, dispatch }, name) {
            if (state.location[name].owned && state.currentLocation !== name) {
                dispatch('resetLocationEffects', state.currentLocation);
                commit('updateKey', {key: 'currentLocation', value: name});
                commit('updateKey', {key: 'fishingProgress', value: 0});
                dispatch('applyLocationEffects', name);
            }
        },
        applyFishingRodEffects({ state, dispatch }, name) {
            state.fishingRod[name].effect.forEach(eff => {
                dispatch('system/applyEffect', {type: eff.type, name: eff.name, multKey: `weatherChaosFishingRod_${ name }`, value: eff.value, trigger: true}, {root: true});
            });
        },
        resetFishingRodEffects({ state, dispatch }, name) {
            state.fishingRod[name].effect.forEach(eff => {
                dispatch('system/resetEffect', {type: eff.type, name: eff.name, multKey: `weatherChaosFishingRod_${ name }`}, {root: true});
            });
        },
        changeFishingRod({ state, commit, dispatch }, name) {
            if (state.fishingRod[name].owned && state.currentFishingRod !== name) {
                dispatch('resetFishingRodEffects', state.currentFishingRod);
                commit('updateKey', {key: 'currentFishingRod', value: name});
                commit('updateKey', {key: 'fishingProgress', value: 0});
                dispatch('applyFishingRodEffects', name);
            }
        },
        buyFishingRod({ state, getters, rootGetters, commit, dispatch }, name) {
            if (!state.fishingRod[name].owned && rootGetters['currency/value']('gem_topaz') >= getters.rodCost) {
                dispatch('currency/spend', {feature: 'gem', name: 'topaz', amount: getters.rodCost}, {root: true});
                commit('updateSubkey', {name: 'fishingRod', key: name, subkey: 'owned', value: true});
                commit('updateKey', {key: 'boughtRods', value: state.boughtRods + 1});
            }
        },
        applyBaitEffects({ state, dispatch }, name) {
            state.bait[name].effect.forEach(eff => {
                dispatch('system/applyEffect', {type: eff.type, name: eff.name, multKey: `weatherChaosBait_${ name }`, value: eff.value, trigger: true}, {root: true});
            });
        },
        resetBaitEffects({ state, dispatch }, name) {
            state.bait[name].effect.forEach(eff => {
                dispatch('system/resetEffect', {type: eff.type, name: eff.name, multKey: `weatherChaosBait_${ name }`}, {root: true});
            });
        },
        changeBait({ state, commit, dispatch }, name) {
            if ((name === null && state.currentBait !== null) || (name !== null && state.bait[name].owned > 0)) {
                if (state.currentBait !== null) {
                    dispatch('resetBaitEffects', state.currentBait);
                }
                commit('updateKey', {key: 'currentBait', value: name});
                commit('updateKey', {key: 'fishingProgress', value: 0});
                if (name !== null) {
                    dispatch('applyBaitEffects', name);
                }
            }
        },
        buyBait({ state, rootGetters, commit, dispatch }, name) {
            if (rootGetters['currency/value']('event_cloud') >= WEATHER_CHAOS_BAIT_COST) {
                const bait = state.bait[name];
                dispatch('currency/spend', {feature: 'event', name: 'cloud', amount: WEATHER_CHAOS_BAIT_COST}, {root: true});
                commit('updateSubkey', {name: 'bait', key: name, subkey: 'owned', value: bait.owned + bait.stackSize * 10});
            }
        },
        initWeatherCycle({ state, commit }) {
            let arr = [];
            let same = 0;
            let current = null;

            for (let i = 0; i < 24; i++) {
                if (current === null || chance(same / 4)) {
                    current = randomElem(current === null ? Object.keys(state.weather) : state.weather[current].next);
                    same = 1;
                } else {
                    same++;
                }
                arr.push(current);
            }

            commit('updateKey', {key: 'nextWeather', value: arr});
        },
        nextWeatherStep({ state, commit }) {
            let arr = [...state.nextWeather];
            let same = 0;
            let current = null;
            if (arr.length > 0) {
                const rev = [...arr].reverse();
                current = rev[0];
                same = rev.findIndex(elem => elem !== current);
                if (same === -1) {
                    same = arr.length;
                }
            }

            arr.push((current === null || chance(same / 4)) ? randomElem(current === null ? Object.keys(state.weather) : state.weather[current].next) : current);
            if (arr.length > 24) {
                arr.splice(0, arr.length - 24);
            }

            commit('updateKey', {key: 'nextWeather', value: arr});
        },
        resetWeatherCycle({ rootGetters, dispatch }) {
            if (rootGetters['currency/value']('event_cloud') >= WEATHER_CHAOS_RESET_COST) {
                dispatch('currency/spend', {feature: 'event', name: 'cloud', amount: WEATHER_CHAOS_RESET_COST}, {root: true});
                dispatch('initWeatherCycle');
            }
        },
        togglePiratesTreasureDebug({ state, commit }) {
            commit('updateKey', {key: 'piratesTreasureDebug', value: !state.piratesTreasureDebug});
        },
        debugGetPiratesTreasure({ state, commit, dispatch }) {
            if (state.piratesTreasureDebug) {
                const topazAmount = Math.floor(1 + Math.random() * 100);
                dispatch('currency/gain', {feature: 'gem', name: 'topaz', amount: topazAmount}, {root: true});
                
                commit('addFishingRecord', {
                    type: 'treasure',
                    treasureType: 'piratesTreasure',
                    amount: topazAmount,
                    time: Date.now()
                });
            }
        }
    }
}