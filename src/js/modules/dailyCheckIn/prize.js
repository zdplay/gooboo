import store from "../../../store";

// 普通卡包池 - 用于橙色和紫色池
const normalCardPacks = [
    // 农场卡包
    'bountifulHarvest',    // 农场：丰收卡包
    'juicyYields',         // 农场：多汁收获卡包
    'insectWorld',         // 农场：昆虫世界卡包
    'beesAndFlowers',      // 农场：蜜蜂和鲜花卡包

    // 部落卡包
    'rookieOnTheBattlefield', // 部落：战场新手卡包
    'spiritualSuccess',    // 部落：精神成功卡包
    'oldMemories',         // 部落：旧记忆卡包
    'taintedWorld',        // 部落：被污染的世界卡包

    // 画廊卡包
    'newArtist',          // 画廊：新艺术家卡包
    'inspiringCreations', // 画廊：鼓舞人心的创作卡包

    // 挖矿卡包
    'intoDarkness',       // 挖矿：进入黑暗卡包
    'drillsAndDepths',    // 挖矿：钻孔和深度卡包
    'hotStuff',           // 挖矿：热门内容卡包
    'dangerZone',         // 挖矿：危险区卡包

    // 村庄卡包
    'meetingNewPeople',   // 村庄：结识新朋友卡包
    'darkCult',           // 村庄：黑暗教派卡包
    'technologicalAdvancement' // 村庄：科技进步卡包
];

// 事件卡包池 - 用于红色池
const eventCardPacks = [
    'goodDeal',           // 好交易卡包
    'connectedLine',      // 连线卡包
    'feelingLucky',       // 幸运感觉卡包
    'investorsDream',     // 投资者之梦卡包
    'greenThumb',         // 绿手指卡包
    'fishingForFun'       // 钓鱼乐趣卡包
];

// 随机宝石池 - 5种宝石（蓝、橙、紫池）- 移除钻石，因为钻石没有解锁条件
const randomGem5Pool = ['gem_ruby', 'gem_emerald', 'gem_sapphire', 'gem_topaz', 'gem_amethyst'];

// 随机宝石池 - 4种宝石（红池，除紫水晶）
const randomGem4Pool = ['gem_ruby', 'gem_emerald', 'gem_sapphire', 'gem_topaz'];

export default {
    // 随机宝石 - 5种宝石（蓝、橙、紫池）
    gem_random5: {
        type: 'currency',
        item: () => randomGem5Pool[Math.floor(Math.random() * randomGem5Pool.length)],
        weight: 1,
        pool: {
            dailyCheckIn2: {amount: 200},
            dailyCheckIn3: {amount: 300}
        }
    },

    // 随机宝石 - 4种宝石（红池，除紫水晶）
    gem_random4: {
        type: 'currency',
        item: () => randomGem4Pool[Math.floor(Math.random() * randomGem4Pool.length)],
        weight: 1,
        pool: {
            dailyCheckIn4: {amount: 1500}
        }
    },

    // 普通卡包奖励
    cardPack_normal: {
        type: 'cardPack',
        item: () => normalCardPacks[Math.floor(Math.random() * normalCardPacks.length)],
        weight: 1,
        pool: {
            dailyCheckIn2: {amount: 1},
            dailyCheckIn3: {amount: 2},
            dailyCheckIn4: {amount: 5}
        }
    },

    // 事件卡包奖励
    cardPack_event: {
        type: 'cardPack',
        item: () => eventCardPacks[Math.floor(Math.random() * eventCardPacks.length)],
        weight: 1,
        pool: {
            dailyCheckIn4: {amount: 1}
        }
    },


    // 强化宝藏N3级
    treasure_empoweredN3: {
        type: 'treasure',
        item: 'empowered',
        bonusTier: -8,
        requirement() {
            return store.state.unlock.treasureFeature.see;
        },
        pool: {
            dailyCheckIn1: {weight: 0.4}
        }
    },
    // 强化宝藏N2级
    treasure_empoweredN2: {
        type: 'treasure',
        item: 'empowered',
        bonusTier: -7,
        requirement() {
            return store.state.unlock.treasureFeature.see;
        },
        pool: {
            dailyCheckIn1: {weight: 0.8}
        }
    },
    // 强化宝藏N1级
    treasure_empoweredN1: {
        type: 'treasure',
        item: 'empowered',
        bonusTier: -6,
        requirement() {
            return store.state.unlock.treasureFeature.see;
        },
        pool: {
            dailyCheckIn2: {weight: 0.4}
        }
    },
    // 强化宝藏标准级
    treasure_empowered: {
        type: 'treasure',
        item: 'empowered',
        bonusTier: -5,
        requirement() {
            return store.state.unlock.treasureFeature.see;
        },
        pool: {
            dailyCheckIn2: {weight: 0.8}
        }
    },
    // 强化宝藏P1级
    treasure_empoweredP1: {
        type: 'treasure',
        item: 'empowered',
        bonusTier: -4,
        requirement() {
            return store.state.unlock.treasureFeature.see;
        },
        pool: {
            dailyCheckIn3: {weight: 0.4}
        }
    },
    // 强化宝藏P2级
    treasure_empoweredP2: {
        type: 'treasure',
        item: 'empowered',
        bonusTier: -3,
        requirement() {
            return store.state.unlock.treasureFeature.see;
        },
        pool: {
            dailyCheckIn4: {weight: 0.8}
        }
    },
    // 强化宝藏P3级（最强）
    treasure_empoweredP3: {
        type: 'treasure',
        item: 'empowered',
        bonusTier: -2,
        requirement() {
            return store.state.unlock.treasureFeature.see;
        },
        pool: {
            dailyCheckIn4: {weight: 0.4}
        }
    },

    // 挖矿废料 - 使用简单的基础值，参考事件系统
    mining_scrap: {
        type: 'currency',
        item: 'mining_scrap',
        weight: 1,
        amountMult: () => store.getters['mining/depthScrap'](store.state.stat[`mining_maxDepth${ store.state.system.features.mining.currentSubfeature }`].value),
        pool: {
            dailyCheckIn0: {amount: 500}
        }
    },
    // 挖矿余烬
    mining_ember: {
        type: 'currency',
        item: 'mining_ember',
        weight: 1,
        requirement() {
            return store.state.stat.mining_ember.total > 0;
        },
        amountMult: () => store.getters['mult/get']('currencyMiningEmberCap'),
        pool: {
            dailyCheckIn0: {amount: 0.01},
            dailyCheckIn1: {amount: 0.04}
        }
    },
    // 挖矿树脂
    mining_resin: {
        type: 'currency',
        item: 'mining_resin',
        weight: 1,
        requirement() {
            return store.state.stat.mining_resin.total > 0;
        },
        pool: {
            dailyCheckIn0: {amount: 2},
            dailyCheckIn1: {amount: 10}
        }
    },
    // 村庄祭品
    village_offering: {
        type: 'currency',
        item: 'village_offering',
        weight: 1,
        requirement() {
            return store.state.unlock.villageOffering1.see;
        },
        roundAmount: true,
        amountMult: () => store.getters['village/offeringScore'],
        pool: {
            dailyCheckIn0: {amount: 0.15},
            dailyCheckIn1: {amount: 0.3}
        }
    },
    // 部落骨头
    horde_bone: {
        type: 'currency',
        item: 'horde_bone',
        weight: 1,
        requirement() {
            return store.state.unlock.hordeFeature.see;
        },
        amountMult: () => store.getters['mult/get']('currencyHordeBoneGain', store.getters['horde/enemyBone'](store.state.stat.horde_maxZone.value)),
        pool: {
            dailyCheckIn0: {amount: 500}
        }
    },
    // 画廊美感 - 使用事件系统相同的公式
    gallery_beauty: {
        type: 'currency',
        item: 'gallery_beauty',
        weight: 1,
        requirement() {
            return store.state.unlock.galleryFeature.see;
        },
        amountMult: () => store.getters['mult/get']('currencyGalleryBeautyGain'),
        pool: {
            dailyCheckIn0: {amount: 500}
        }
    },

    // 学校考试通行证
    school_examPass: {
        type: 'currency',
        item: 'school_examPass',
        weight: 1,
        requirement() {
            return store.state.unlock.schoolFeature.see;
        },
        roundAmount: true,
        pool: {
            dailyCheckIn1: {amount: 2},
            dailyCheckIn2: {amount: 5}
        }
    },
    // 宝藏碎片 - 动态数量1
    treasure_fragment1: {
        type: 'currency',
        item: 'treasure_fragment',
        weight: 1,
        requirement() {
            return store.state.unlock.treasureFeature.see;
        },
        roundAmount: true,
        amountMult: () => store.getters['treasure/averageFragments'],
        pool: {
            dailyCheckIn0: {amount: 1}
        }
    },

    // 宝藏碎片 - 动态数量2
    treasure_fragment2: {
        type: 'currency',
        item: 'treasure_fragment',
        weight: 1,
        requirement() {
            return store.state.unlock.treasureFeature.see;
        },
        roundAmount: true,
        amountMult: () => store.getters['treasure/averageFragments'],
        pool: {
            dailyCheckIn1: {amount: 2}
        }
    },
    // 部落塔钥匙
    horde_towerKey: {
        type: 'currency',
        item: 'horde_towerKey',
        weight: 1,
        requirement() {
            return store.state.unlock.hordeTower.see;
        },
        roundAmount: true,
        pool: {
            dailyCheckIn3: {amount: 1},
            dailyCheckIn4: {amount: 3}
        }
    },

    // 挖矿黄金锤
    mining_goldenHammer: {
        type: 'consumable',
        item: 'mining_goldenHammer',
        weight: 1,
        requirement() {
            return store.state.unlock.miningPickaxeCrafting.see;
        },
        pool: {
            dailyCheckIn2: {amount: 4},
            dailyCheckIn3: {amount: 10},
            dailyCheckIn4: {amount: 50}
        }
    },
    // 宝石威望石
    gem_prestigeStone: {
        type: 'consumable',
        item: 'gem_prestigeStone',
        weight: 1,
        pool: {
            dailyCheckIn3: {amount: 1},
            dailyCheckIn4: {amount: 3}
        }
    },
    // 农场加速生长肥料
    farm_speedGrow: {
        type: 'consumable',
        item: 'farm_speedGrow',
        weight: 1,
        requirement() {
            return store.state.unlock.farmFertilizer.see;
        },
        pool: {
            dailyCheckIn1: {amount: 15},
            dailyCheckIn2: {amount: 50}
        }
    },
    // 农场肥沃土壤肥料
    farm_richSoil: {
        type: 'consumable',
        item: 'farm_richSoil',
        weight: 1,
        requirement() {
            return store.state.unlock.farmFertilizer.see;
        },
        pool: {
            dailyCheckIn1: {amount: 15},
            dailyCheckIn2: {amount: 50}
        }
    },
    // 农场闪亮肥料
    farm_shiny: {
        type: 'consumable',
        item: 'farm_shiny',
        weight: 1,
        requirement() {
            return store.state.unlock.farmFertilizer.see;
        },
        pool: {
            dailyCheckIn1: {amount: 15},
            dailyCheckIn2: {amount: 50}
        }
    },
    // 农场涡轮生长肥料
    farm_turboGrow: {
        type: 'consumable',
        item: 'farm_turboGrow',
        weight: 1,
        requirement() {
            return store.state.unlock.farmFertilizer.see;
        },
        pool: {
            dailyCheckIn1: {amount: 15},
            dailyCheckIn2: {amount: 50}
        }
    },
    // 农场高级肥料
    farm_premium: {
        type: 'consumable',
        item: 'farm_premium',
        weight: 1,
        requirement() {
            return store.state.consumable.farm_premium.found;
        },
        pool: {
            dailyCheckIn2: {amount: 50}
        }
    },

    // 挖矿威望（绿水晶）
    mining_prestige: {
        type: 'currency',
        item: 'mining_crystalGreen',
        weight: 1,
        requirement() {
            return store.state.stat.mining_prestigeCount.total >= 1;
        },
        amountMult: () => store.state.stat.mining_bestPrestige0.total,
        pool: {
            dailyCheckIn2: {amount: 0.3},
            dailyCheckIn3: {amount: 1.2},
            dailyCheckIn4: {amount: 2}
        }
    },
    // 村庄威望（祝福）
    village_prestige: {
        type: 'currency',
        item: 'village_blessing',
        weight: 1,
        requirement() {
            return store.state.stat.village_prestigeCount.total >= 1;
        },
        amountMult: () => store.state.stat.village_bestPrestige0.total,
        pool: {
            dailyCheckIn2: {amount: 0.3},
            dailyCheckIn3: {amount: 1.2},
            dailyCheckIn4: {amount: 2}
        }
    },
    // 部落威望（强化灵魂）
    horde_prestige: {
        type: 'currency',
        item: 'horde_soulEmpowered',
        weight: 1,
        requirement() {
            return store.state.stat.horde_prestigeCount.total >= 1;
        },
        amountMult: () => store.state.stat.horde_bestPrestige0.total,
        pool: {
            dailyCheckIn2: {amount: 0.3},
            dailyCheckIn3: {amount: 1.2},
            dailyCheckIn4: {amount: 2}
        }
    },
    // 画廊威望（现金）
    gallery_prestige: {
        type: 'currency',
        item: 'gallery_cash',
        weight: 1,
        requirement() {
            return store.state.stat.gallery_prestigeCount.total >= 1;
        },
        amountMult: () => store.state.stat.gallery_bestPrestige.total,
        pool: {
            dailyCheckIn2: {amount: 0.3},
            dailyCheckIn3: {amount: 1.2},
            dailyCheckIn4: {amount: 2}
        }
    }
}
