// 增强自动释放配置
// 每个装备对应一个配置对象，如果为null则使用旧版自动释放逻辑

// utility装备列表 - 这些装备默认自动释放，不需要设置
export const utilityEquipments = [
    'iceClaws',           // 冰爪
    'milkCup',            // 牛奶杯
    'clover',             // 四叶草
    'liver',              // 肝脏
    'redStaff',           // 红法杖
    'cat',                // 猫
    'corruptedBone',      // 腐蚀骨头
    'moltenShield',       // 熔岩盾
    'chocolateMilk',      // 巧克力牛奶
    'strangeChemical',    // 奇怪化学品
    'shatteredGem',       // 破碎宝石
    'mysticalAccelerator' // 神秘加速器
];

// combat装备配置 - 只包含战斗装备的设置
export const enhancedAutocastConfig = {
    // 基础装备 - 只包含combat类型
    dagger: null,                        // 匕首
    shirt: null,                         // 衬衫
    guardianAngel: null,                 // 守护天使
    starShield: null,                    // 星盾
    longsword: null,                     // 长剑
    boots: null,                         // 靴子
    fireOrb: null,                       // 火球
    campfire: null,                      // 篝火
    snowflake: null,                     // 雪花
    oppressor: null,                     // 压迫者
    meatShield: null,                    // 肉盾
    corruptEye: null,                    // 腐蚀之眼
    wizardHat: null,                     // 巫师帽
    brokenStopwatch: null,               // 破损秒表
    marblePillar: null,                  // 大理石柱
    rainbowStaff: null,                  // 彩虹法杖
    toxin: null,                         // 毒素
    cleansingSpring: null,               // 净化泉水
    toxicSword: null,                    // 毒剑
    luckyCharm: null,                    // 幸运符
    mailbreaker: null,                   // 破甲剑
    club: null,                          // 棍棒
    goldenStaff: null,                   // 金法杖
    mace: null,                          // 狼牙棒
    scissors: null,                      // 剪刀
    healthyFruit: null,                  // 健康果实
    deadBird: null,                      // 死鸟
    shieldDissolver: null,               // 盾牌溶解器
    calmingPill: null,                   // 镇静药丸
    cleansingFluid: null,                // 净化液
    forbiddenSword: null,                // 禁忌之剑
    antidote: null,                      // 解毒剂
    plaguebringer: null,                 // 瘟疫使者
    forbiddenShield: null,               // 禁忌盾牌
    dangerShield: null,                  // 危险盾
    forbiddenToxin: null,                // 禁忌毒素
    glowingEye: null,                    // 发光之眼
    experimentalVaccine: null,           // 实验疫苗
    glasses: null,                       // 眼镜
    microscope: null,                    // 显微镜
    cutter: null,                        // 切割器
    book: null,                          // 书
    bigHammer: null,                     // 大锤
    spookyPumpkin: null,                 // 恐怖南瓜
    forbiddenHeartShield: null,          // 禁忌心盾
    cloudStaff: null,                    // 云法杖
    secretWeapon: null,                  // 秘密武器
    bomb: null,                          // 炸弹
    leechingStaff: null,                 // 吸血法杖
    hourglass: null,                     // 沙漏
    glue: null,                          // 胶水
    firework: null,                      // 烟花
    bowTie: null,                        // 蝴蝶结
    forbiddenStopwatch: null,            // 禁忌秒表
    blazingStaff: null,                  // 炽热法杖
    shield: null,                        // 盾牌
    armor: null,                         // 护甲
    natureStone: null,                   // 自然石
    evergrowingVine: null,               // 常青藤
    energyDrink: null,                   // 能量饮料
    dragonheart: null,                   // 龙心
    prism: null,                         // 棱镜
    deathsword: null,                    // 死亡剑
    needle: null,                        // 针
    mine: null,                          // 地雷
    maskOfJoy: null,                     // 欢乐面具

    // 国际象棋装备
    pawn: null,                          // 兵
    knight: null,                        // 马
    bishop: null,                        // 象
    rook: null,                          // 车
    queen: null,                         // 后
    king: null,                          // 王
};

export function isUtilityEquipment(equipmentName) {
    return utilityEquipments.includes(equipmentName);
}

export function getAutocastConfig(equipmentName) {
    const store = require('@/store').default;
    const savedSettings = store.state.horde.enhancedAutocastSettings || {};

    if (savedSettings[equipmentName]) {
        return {
            type: 'custom',
            settings: savedSettings[equipmentName]
        };
    }

    return enhancedAutocastConfig[equipmentName] || null;
}

export function getSavedAutocastConfig() {
    const store = require('@/store').default;
    return store.state.horde.enhancedAutocastSettings || {};
}

export function showSavedConfig() {
    const savedConfig = getSavedAutocastConfig();
    console.log('=== 增强自动释放存档配置 ===');
    console.log('(可复制此配置给其他用户使用)');
    console.log(JSON.stringify(savedConfig, null, 2));
    return savedConfig;
}

export function importAutocastConfig(configJson) {
    try {
        const store = require('@/store').default;
        const config = typeof configJson === 'string' ? JSON.parse(configJson) : configJson;

        store.commit('horde/updateKey', {
            key: 'enhancedAutocastSettings',
            value: config
        });

        console.log('配置导入成功:', config);
        return true;
    } catch (error) {
        console.error('配置导入失败:', error);
        return false;
    }
}

if (typeof window !== 'undefined') {
    window.showEnhancedAutocastConfig = showSavedConfig;
    window.importEnhancedAutocastConfig = importAutocastConfig;
}

export function isEnhancedAutocastEnabled(store) {
    return store.state.system.settings.experiment.items.enhancedAutocast.value;
}

export function legacyAutocastLogic(store, playerStats, subfeature) {
    if (store.state.horde.chosenActive === null && store.state.horde.autocast.length > 0) {
        const sources = store.state.horde.autocast.map(name => {
            if (subfeature === 0) {
                const item = store.state.horde.items[name];
                return {ready: item.cooldownLeft <= 0, type: item.activeType, effect: item.active(item.level), cost: item.activeCost(item.level), name};
            } else if (subfeature === 1) {
                const split = name.split('_');
                if (split[0] === 'skill') {
                    const skill = store.state.horde.fighterClass[store.state.horde.selectedClass].skills[split[1]];
                    return {ready: store.state.horde.skillActive[name] <= 0, type: skill.activeType, effect: skill.active(skill.level), cost: skill.activeCost(skill.level), name};
                } else if (split[0] === 'trinket') {
                    const trinket = store.state.horde.trinket[split[1]];
                    return {ready: store.state.horde.skillActive[name] <= 0, type: trinket.activeType, effect: trinket.active(trinket.level), cost: trinket.activeCost(trinket.level), name};
                }
            }
            return {};
        }).filter(elem => elem.ready &&
            (elem.cost.health === undefined || (store.state.horde.player.health >= elem.cost.health) && (store.state.horde.player.health / playerStats.health) >= 0.5) &&
            (elem.cost.energy === undefined || (store.state.horde.player.energy >= elem.cost.energy) && (store.state.horde.player.energy / playerStats.energy) >= 0.5) &&
            (elem.cost.mana === undefined || (store.state.horde.player.mana >= elem.cost.mana) && (store.state.horde.player.mana / playerStats.mana) >= 0.5) &&
            (elem.cost.mysticalShard === undefined || (store.state.currency.horde_mysticalShard.value >= elem.cost.mysticalShard && store.state.currency.horde_mysticalShard.value >= store.state.currency.horde_mysticalShard.cap))
        );
        
        sources.forEach(elem => {
            if (store.state.horde.chosenActive === null) {
                let usePositive = false;
                let useNegative = false;
                elem.effect.forEach(el => {
                    let condition = null;
                    if (el.type === 'heal') {
                        condition = (store.state.horde.player.health / playerStats.health) <= (1 - el.value);
                    } else if (el.type === 'stun') {
                        condition = store.state.horde.enemy.stun <= 0;
                    } else if (el.type === 'silence') {
                        condition = store.state.horde.enemy.silence <= 0;
                    } else if (el.type === 'divisionShield') {
                        condition = store.state.horde.player.divisionShield <= 0;
                    } else if (el.type === 'antidote') {
                        condition = store.state.horde.player.poison > 0;
                    } else if (el.type === 'removeStun') {
                        condition = store.state.horde.player.stun > 0;
                    }

                    if (condition === true) {
                        usePositive = true;
                    } else if (condition === false) {
                        useNegative = true;
                    }
                    if (usePositive || !useNegative) {
                        store.commit('horde/updateKey', {key: 'chosenActive', value: elem.name});
                    }
                });
            }
        });
    }
}

function checkLegacyConditions(elem, store, playerStats) {
    const reasons = [];
    let usePositive = false;
    let useNegative = false;

    elem.effect.forEach(el => {
        let condition = null;
        if (el.type === 'heal') {
            condition = (store.state.horde.player.health / playerStats.health) <= (1 - el.value);
        } else if (el.type === 'stun') {
            condition = store.state.horde.enemy.stun <= 0;
        } else if (el.type === 'silence') {
            condition = store.state.horde.enemy.silence <= 0;
        } else if (el.type === 'divisionShield') {
            condition = store.state.horde.player.divisionShield <= 0;
        } else if (el.type === 'antidote') {
            condition = store.state.horde.player.poison > 0;
        } else if (el.type === 'removeStun') {
            condition = store.state.horde.player.stun > 0;
        }

        if (condition !== null) {
            reasons.push(`${el.type} 条件 (${condition ? '满足' : '不满足'})`);
        }

        if (condition === true) {
            usePositive = true;
        } else if (condition === false) {
            useNegative = true;
        }
    });

    const shouldRelease = usePositive || !useNegative;
    reasons.unshift(`条件逻辑: 原版逻辑 - ${shouldRelease ? '满足释放条件' : '不满足释放条件'}`);

    return { should: shouldRelease, reasons };
}

function getSkillPriority(elem, store, autocastIndex) {
    let priority = 0;

    const playerStunned = store.state.horde.player.stun > 0;

    elem.effect.forEach(effect => {
        switch (effect.type) {
            case 'removeStun':
                priority += playerStunned ? 1000 : 80;
                break;
            case 'heal':
                priority += 100;
                break;
            case 'antidote':
                priority += 90;
                break;
            case 'divisionShield':
                priority += 70;
                break;
            case 'stun':
                priority += 60;
                break;
            case 'silence':
                priority += 50;
                break;
            case 'damagePhysic':
            case 'damageMagic':
            case 'damageBio':
                priority += 30;
                break;
            default:
                priority += 10;
                break;
        }
    });

    if (autocastIndex !== undefined && autocastIndex > 0) {
        priority += (1000 - autocastIndex);
    }

    return priority;
}

function checkCustomConditions(elem, store, playerStats) {
    const settings = elem.config.settings;
    const reasons = [];
    const conditions = [];

    const player = store.state.horde.player;
    const enemy = store.state.horde.enemy;
    const isAndLogic = settings.conditionLogic === 'and';

    const isEmptyValue = (value) => value === null || value === undefined || value === '' || value === 'and' || value === true;
    const allSettingsEmpty = Object.values(settings).every(isEmptyValue);
    if (allSettingsEmpty) {
        return checkLegacyConditions(elem, store, playerStats);
    }

    const isValidSetting = (value) => value !== null && value !== undefined && value !== '' && value !== 'any';

    if (isValidSetting(settings.bossType)) {
        const bossFight = store.state.horde.bossFight;
        let bossConditionMet = true;
        if (settings.bossType === 'normal' && bossFight > 0) {
            bossConditionMet = false;
            reasons.push(`当前为${bossFight === 1 ? '小Boss' : 'Boss'}，要求普通敌人 (不满足)`);
        } else if (settings.bossType === 'miniboss' && bossFight !== 1) {
            bossConditionMet = false;
            reasons.push(`当前为${bossFight === 0 ? '普通敌人' : 'Boss'}，要求小Boss (不满足)`);
        } else if (settings.bossType === 'boss' && bossFight !== 2) {
            bossConditionMet = false;
            reasons.push(`当前为${bossFight === 0 ? '普通敌人' : '小Boss'}，要求Boss (不满足)`);
        } else if (settings.bossType === 'anyboss' && bossFight === 0) {
            bossConditionMet = false;
            reasons.push(`当前为普通敌人，要求大小Boss (不满足)`);
        } else {
            const bossTypeText = bossFight === 0 ? '普通敌人' : (bossFight === 1 ? '小Boss' : 'Boss');
            reasons.push(`敌人类型: ${bossTypeText} (满足)`);
        }
        conditions.push(bossConditionMet);
    }

    if (isValidSetting(settings.enemyArmor)) {
        if (!enemy) {
            const armorConditionMet = 0 <= settings.enemyArmor;
            reasons.push(`敌方护甲 0 (无敌人) ≤ ${settings.enemyArmor} (${armorConditionMet ? '满足' : '不满足'})`);
            conditions.push(armorConditionMet);
        } else {
            const enemyArmor = enemy.divisionShield || 0;
            const armorConditionMet = enemyArmor <= settings.enemyArmor;
            if (armorConditionMet) {
                reasons.push(`敌方护甲 ${enemyArmor} ≤ ${settings.enemyArmor} (满足)`);
            } else {
                reasons.push(`敌方护甲 ${enemyArmor} > ${settings.enemyArmor} (不满足)`);
            }
            conditions.push(armorConditionMet);
        }
    }

    const hasHealEffect = elem.effect.some(effect => effect.type === 'heal');

    const hasResistanceEffect = elem.effect.some(effect => {
        if (effect.type === 'resistancePhysic' || effect.type === 'resistanceMagic' || effect.type === 'resistanceBio') {
            return true;
        }
        if (effect.type === 'buff' && effect.effect) {
            return effect.effect.some(buffEffect =>
                (buffEffect.type === 'mult' &&
                 (buffEffect.name === 'hordePhysicTaken' ||
                  buffEffect.name === 'hordeMagicTaken' ||
                  buffEffect.name === 'hordeBioTaken') &&
                 buffEffect.value < 1)
            );
        }
        return false;
    });

    if ((hasHealEffect || hasResistanceEffect) && isValidSetting(settings.healthPercent)) {
        const currentHealthPercent = (player.health / playerStats.health * 100);
        const healthConditionMet = currentHealthPercent <= settings.healthPercent;
        if (healthConditionMet) {
            const skillType = hasHealEffect && hasResistanceEffect ? '治疗/减伤技能' :
                             hasHealEffect ? '治疗技能' : '减伤技能';
            reasons.push(`血量 ${currentHealthPercent.toFixed(1)}% ≤ ${settings.healthPercent}% (${skillType}满足)`);
        } else {
            const skillType = hasHealEffect && hasResistanceEffect ? '治疗/减伤技能' :
                             hasHealEffect ? '治疗技能' : '减伤技能';
            reasons.push(`血量 ${currentHealthPercent.toFixed(1)}% > ${settings.healthPercent}% (${skillType}不满足)`);
        }
        conditions.push(healthConditionMet);
    }

    const hasStunEffect = elem.effect.some(effect => effect.type === 'stun');
    const hasSilenceEffect = elem.effect.some(effect => effect.type === 'silence');
    if (hasStunEffect || hasSilenceEffect) {
        if (!enemy) {
            reasons.push(`无敌人存在，眩晕/沉默技能不可用 (不满足)`);
            conditions.push(false);
        } else {
            const enemyStunTime = enemy.stun;
            const enemySilenceTime = enemy.silence;

            const stunSilenceConditionMet = enemyStunTime <= settings.enemyStunTime || enemySilenceTime <= settings.enemySilenceTime;
            if (stunSilenceConditionMet) {
                reasons.push(`敌人眩晕 ${enemyStunTime.toFixed(1)}s ≤ ${settings.enemyStunTime}s 或 沉默 ${enemySilenceTime.toFixed(1)}s ≤ ${settings.enemySilenceTime}s (满足)`);
            } else {
                reasons.push(`敌人眩晕 ${enemyStunTime.toFixed(1)}s > ${settings.enemyStunTime}s 且 沉默 ${enemySilenceTime.toFixed(1)}s > ${settings.enemySilenceTime}s (不满足)`);
            }
            conditions.push(stunSilenceConditionMet);
        }
    }

    const hasDivisionShieldEffect = elem.effect.some(effect => effect.type === 'divisionShield');
    if (hasDivisionShieldEffect && isValidSetting(settings.playerDivisionShield)) {
        const currentShield = player.divisionShield;
        const shieldConditionMet = currentShield <= settings.playerDivisionShield;
        if (shieldConditionMet) {
            reasons.push(`玩家分裂护盾 ${currentShield} ≤ ${settings.playerDivisionShield} (满足)`);
        } else {
            reasons.push(`玩家分裂护盾 ${currentShield} > ${settings.playerDivisionShield} (不满足)`);
        }
        conditions.push(shieldConditionMet);
    }

    const hasShieldBreakEffect = elem.effect.some(effect =>
        effect.type === 'shieldBreak' ||
        effect.type === 'removeDivisionShield'
    );
    if (hasShieldBreakEffect && isValidSetting(settings.enemyDivisionShield)) {
        const enemy = store.state.horde.enemy;
        if (!enemy) {
            reasons.push(`无敌人存在，护盾破除技能不可用 (不满足)`);
            conditions.push(false);
        } else {
            const enemyShield = enemy.divisionShield;
            const enemyShieldConditionMet = enemyShield >= settings.enemyDivisionShield;
            if (enemyShieldConditionMet) {
                reasons.push(`敌方分裂护盾 ${enemyShield} ≥ ${settings.enemyDivisionShield} (满足)`);
            } else {
                reasons.push(`敌方分裂护盾 ${enemyShield} < ${settings.enemyDivisionShield} (不满足)`);
            }
            conditions.push(enemyShieldConditionMet);
        }
    }

    const hasAntidoteEffect = elem.effect.some(effect => effect.type === 'antidote');
    if (hasAntidoteEffect && isValidSetting(settings.poisonDamagePercent)) {
        const poisonDamage = player.poison;
        const poisonPercent = (poisonDamage / playerStats.health * 100);
        const antidoteConditionMet = poisonPercent >= settings.poisonDamagePercent;
        if (antidoteConditionMet) {
            reasons.push(`中毒伤害 ${poisonPercent.toFixed(1)}% ≥ ${settings.poisonDamagePercent}% (满足)`);
        } else {
            reasons.push(`中毒伤害 ${poisonPercent.toFixed(1)}% < ${settings.poisonDamagePercent}% (不满足)`);
        }
        conditions.push(antidoteConditionMet);
    }

    const hasRemoveStunEffect = elem.effect.some(effect => effect.type === 'removeStun');
    if (hasRemoveStunEffect && isValidSetting(settings.playerStunTime)) {
        const playerStunTime = player.stun;
        const removeStunConditionMet = playerStunTime >= settings.playerStunTime;
        if (removeStunConditionMet) {
            reasons.push(`玩家眩晕 ${playerStunTime.toFixed(1)}s ≥ ${settings.playerStunTime}s (满足)`);
        } else {
            reasons.push(`玩家眩晕 ${playerStunTime.toFixed(1)}s < ${settings.playerStunTime}s (不满足)`);
        }
        conditions.push(removeStunConditionMet);
    }

    let shouldRelease;
    if (isAndLogic) {
        shouldRelease = conditions.length > 0 && conditions.every(condition => condition);
        reasons.unshift(`条件逻辑: AND - ${shouldRelease ? '所有条件满足' : '存在不满足的条件'}`);
    } else {
        shouldRelease = conditions.length > 0 && conditions.some(condition => condition);
        reasons.unshift(`条件逻辑: OR - ${shouldRelease ? '至少一个条件满足' : '所有条件都不满足'}`);
    }

    return { should: shouldRelease, reasons };
}

function getBeforeFirstStrikeSetting(skillName) {
    const config = getAutocastConfig(skillName);
    if (config === null || config.beforeFirstStrike === undefined) {
        return true;
    }
    return config.beforeFirstStrike;
}

export function enhancedAutocastLogic(store, playerStats, subfeature, inCombat) {
    const isEnhancedEnabled = store.state.system.settings.experiment.items.enhancedAutocast.value;

    if (store.state.horde.chosenActive === null && store.state.horde.autocast.length > 0) {
        store.commit('horde/updateKey', {key: 'pendingAfterFirstStrike', value: null});

        const player = store.state.horde.player;
        const enemy = store.state.horde.enemy;
        const currency = store.state.currency;
        if (!isEnhancedEnabled) {
            const sources = store.state.horde.autocast.map(name => {
                if (subfeature === 0) {
                    const item = store.state.horde.items[name];
                    return {ready: item.cooldownLeft <= 0, type: item.activeType, effect: item.active(item.level), cost: item.activeCost ? item.activeCost(item.level) : {}, name, useOldLogic: true};
                } else if (subfeature === 1) {
                    const split = name.split('_');
                    if (split[0] === 'skill') {
                        const skill = store.state.horde.fighterClass[store.state.horde.selectedClass].skills[split[1]];
                        return {ready: store.state.horde.skillActive[name] <= 0, type: skill.activeType, effect: skill.active(skill.level), cost: skill.activeCost(skill.level), name, useOldLogic: true};
                    } else if (split[0] === 'trinket') {
                        const trinket = store.state.horde.trinket[split[1]];
                        return {ready: store.state.horde.skillActive[name] <= 0, type: trinket.activeType, effect: trinket.active(trinket.level), cost: trinket.activeCost(trinket.level), name, useOldLogic: true};
                    }
                }
                return null;
            }).filter(elem => elem && elem.ready &&
                (elem.cost.health === undefined || (player.health >= elem.cost.health) && (player.health / playerStats.health) >= 0.5) &&
                (elem.cost.energy === undefined || (player.energy >= elem.cost.energy) && (player.energy / playerStats.energy) >= 0.5) &&
                (elem.cost.mana === undefined || (player.mana >= elem.cost.mana) && (player.mana / playerStats.mana) >= 0.5) &&
                (elem.cost.mysticalShard === undefined || (currency.horde_mysticalShard.value >= elem.cost.mysticalShard && currency.horde_mysticalShard.value >= currency.horde_mysticalShard.cap))
            );

            sources.forEach(elem => {
                if (store.state.horde.chosenActive === null) {
                    let usePositive = false;
                    let useNegative = false;
                    elem.effect.forEach(el => {
                        let condition = null;
                        if (el.type === 'heal') {
                            condition = (player.health / playerStats.health) <= (1 - el.value);
                        } else if (el.type === 'stun') {
                            condition = enemy ? enemy.stun <= 0 : false;
                        } else if (el.type === 'silence') {
                            condition = enemy ? enemy.silence <= 0 : false;
                        } else if (el.type === 'divisionShield') {
                            condition = player.divisionShield <= 0;
                        } else if (el.type === 'antidote') {
                            condition = player.poison > 0;
                        } else if (el.type === 'removeStun') {
                            condition = player.stun > 0;
                        }

                        if (condition === true) {
                            usePositive = true;
                        } else if (condition === false) {
                            useNegative = true;
                        }
                    });
                    if (usePositive || !useNegative) {
                        store.dispatch('horde/useActive', elem.name);
                    }
                }
            });
            return;
        }

        const sources = store.state.horde.autocast.map((name, index) => {
            if (subfeature === 0) {
                const item = store.state.horde.items[name];

                if (isUtilityEquipment(name)) {
                    const cooldown = Math.ceil(item.cooldown(item.level) / ((item.masteryLevel >= 4) ? 2 : 1));
                    const effectiveCooldownLeft = Math.min(item.cooldownLeft, cooldown);
                    const baseArg = 2 - (effectiveCooldownLeft / cooldown);
                    const charges = baseArg > 0 ? Math.floor(Math.log2(baseArg)) : 0;
                    const readyStatus = charges > 0;
                    return {ready: readyStatus, type: item.activeType, effect: item.active(item.level), cost: item.activeCost ? item.activeCost(item.level) : {}, name, isUtility: true, autocastIndex: index + 1};
                }

                const config = getAutocastConfig(name);
                if (config === null) {
                    return {ready: item.cooldownLeft <= 0, type: item.activeType, effect: item.active(item.level), cost: item.activeCost ? item.activeCost(item.level) : {}, name, useOldLogic: true, autocastIndex: index + 1};
                }
                if (!inCombat) {
                    return null;
                }
                return {ready: item.cooldownLeft <= 0, type: item.activeType, effect: item.active(item.level), cost: item.activeCost ? item.activeCost(item.level) : {}, name, useOldLogic: false, config, autocastIndex: index + 1};
            } else if (subfeature === 1) {
                const split = name.split('_');
                if (split[0] === 'skill') {
                    const skill = store.state.horde.fighterClass[store.state.horde.selectedClass].skills[split[1]];
                    return {ready: store.state.horde.skillActive[name] <= 0, type: skill.activeType, effect: skill.active(skill.level), cost: skill.activeCost(skill.level), name, useOldLogic: true, autocastIndex: index + 1};
                } else if (split[0] === 'trinket') {
                    const trinket = store.state.horde.trinket[split[1]];
                    return {ready: store.state.horde.skillActive[name] <= 0, type: trinket.activeType, effect: trinket.active(trinket.level), cost: trinket.activeCost(trinket.level), name, useOldLogic: true, autocastIndex: index + 1};
                }
            }
            return null;
        }).filter(elem => elem && elem.ready &&
            (elem.cost.health === undefined || (player.health >= elem.cost.health) && (player.health / playerStats.health) >= 0.5) &&
            (elem.cost.energy === undefined || (player.energy >= elem.cost.energy) && (player.energy / playerStats.energy) >= 0.5) &&
            (elem.cost.mana === undefined || (player.mana >= elem.cost.mana) && (player.mana / playerStats.mana) >= 0.5) &&
            (elem.cost.mysticalShard === undefined || (currency.horde_mysticalShard.value >= elem.cost.mysticalShard && currency.horde_mysticalShard.value >= currency.horde_mysticalShard.cap))
        );

        const candidateSkills = [];
        sources.forEach(elem => {
            if (elem.isUtility) {
                //console.log(`[增强自动释放] 释放 ${elem.name} (utility装备)|不占用额度|优先级: 1010|条件: utility装备直接释放`);
                store.dispatch('horde/useActive', elem.name);
                return;
            }
        });

        if (inCombat && store.state.horde.chosenActive !== null) {
            return;
        }

        sources.forEach(elem => {
            if (elem.isUtility) {
                return;
            }

            let shouldRelease = false;
            let releaseReasons = [];
            let skillPriority = 0;

            if (elem.useOldLogic) {
                let usePositive = false;
                let useNegative = false;
                const conditionDetails = [];

                elem.effect.forEach(el => {
                    let condition = null;
                    if (el.type === 'heal') {
                        condition = (player.health / playerStats.health) <= (1 - el.value);
                    } else if (el.type === 'stun') {
                        condition = enemy ? enemy.stun <= 0 : false;
                    } else if (el.type === 'silence') {
                        condition = enemy ? enemy.silence <= 0 : false;
                    } else if (el.type === 'divisionShield') {
                        condition = player.divisionShield <= 0;
                    } else if (el.type === 'antidote') {
                        condition = player.poison > 0;
                    } else if (el.type === 'removeStun') {
                        condition = player.stun > 0;
                    }

                    if (condition !== null) {
                        conditionDetails.push(`${el.type} 条件 (${condition ? '满足' : '不满足'})`);
                    }

                    if (condition === true) {
                        usePositive = true;
                    } else if (condition === false) {
                        useNegative = true;
                    }
                });

                if (usePositive || !useNegative) {
                    shouldRelease = true;
                    releaseReasons = conditionDetails;
                    skillPriority = getSkillPriority(elem, store, elem.autocastIndex);
                }
            } else {
                if (elem.config && elem.config.type === 'custom') {
                    try {
                        const conditionResult = checkCustomConditions(elem, store, playerStats);
                        if (conditionResult.should) {
                            shouldRelease = true;
                            releaseReasons = conditionResult.reasons;
                            skillPriority = getSkillPriority(elem, store, elem.autocastIndex);
                        }
                    } catch (error) {
                        console.error(`[错误] 检查自定义条件时出错: ${elem.name}`, error);
                    }
                } else {
                    shouldRelease = true;
                    releaseReasons = ['新逻辑 - 暂时无条件释放，等待配置实现'];
                    skillPriority = getSkillPriority(elem, store, elem.autocastIndex);
                }
            }

            if (shouldRelease) {
                candidateSkills.push({
                    elem,
                    reasons: releaseReasons,
                    priority: skillPriority,
                    beforeFirstStrike: getBeforeFirstStrikeSetting(elem.name)
                });
            }
        });

        if (candidateSkills.length > 0 && store.state.horde.chosenActive === null) {
            candidateSkills.sort((a, b) => b.priority - a.priority);
            const selectedSkill = candidateSkills[0];
            const configType = selectedSkill.elem.useOldLogic ? '旧逻辑' :
                              (selectedSkill.elem.config?.type === 'custom' ? '自定义配置' : '新逻辑');

            const timing = selectedSkill.beforeFirstStrike ? '先发制人前' : '先发制人后';
            const conditionsText = selectedSkill.reasons.join(', ').replace(/条件逻辑: (\w+) - 所有条件满足, /, '$1 - ').replace(/\(满足\)/g, '(满足)').replace(/\(不满足\)/g, '(不满足)');
            console.log(`[增强自动释放] 释放 ${selectedSkill.elem.name} (${configType})|${timing}|优先级: ${selectedSkill.priority}|条件: ${conditionsText}`);

            if (selectedSkill.beforeFirstStrike) {
                store.dispatch('horde/useActive', selectedSkill.elem.name);
            } else {
                store.commit('horde/updateKey', {
                    key: 'pendingAfterFirstStrike',
                    value: selectedSkill.elem.name
                });
            }
        }
    }
}
