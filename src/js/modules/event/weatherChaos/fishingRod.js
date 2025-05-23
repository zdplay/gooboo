export default {
    basic: {
        owned: true,
    },
    novice: {
        owned: true,
        icon: 'mdi-baby-bottle',
        effect: [
            {name: 'weatherChaosFishingPower', type: 'base', value: 8},
            {name: 'weatherChaosFishingTime', type: 'mult', value: 1.05},
        ],
    },
    net: {
        owned: true,
        icon: 'mdi-search-web',
        effect: [
            {name: 'weatherChaosTrashGain', type: 'mult', value: 1.08},
            {name: 'weatherChaosFishChance', type: 'base', value: -0.07},
        ],
    },

    bamboo: {
        owned: true,
        icon: 'mdi-tree-outline',
        effect: [
            {name: 'weatherChaosFishSizeMax', type: 'base', value: 0.7},
            {name: 'weatherChaosFishSizeAverage', type: 'mult', value: 1 / 1.07},
        ],
    },

    lucky: {
        owned: true,
        icon: 'mdi-clover',
        effect: [
            {name: 'weatherChaosFishChance', type: 'base', value: 0.025},
            {name: 'weatherChaosTreasureChance', type: 'base', value: 0.012},
        ],
    },
    fast: {
        icon: 'mdi-run-fast',
        effect: [
            {name: 'weatherChaosFishingTime', type: 'mult', value: 1 / 1.4},
            {name: 'weatherChaosFishSizeAverage', type: 'mult', value: 1 / 1.6},
            {name: 'weatherChaosTrashGain', type: 'mult', value: 1 / 1.5},
        ],
    },
    leafy: {
        icon: 'mdi-leaf',
        effect: [
            {name: 'weatherChaosFishChance', type: 'base', value: -0.1},
            {name: 'currencyEventAlgaeGain', type: 'mult', value: 1.75},
        ],
    },
    heavy: {
        icon: 'mdi-weight',
        effect: [
            {name: 'weatherChaosFishingTime', type: 'mult', value: 1.1},
            {name: 'weatherChaosFishSizeMax', type: 'base', value: 1},
            {name: 'weatherChaosFishSizeAverage', type: 'mult', value: 1 / 1.1},
        ],
    },
    hardwood: {
        icon: 'mdi-palm-tree',
        effect: [
            {name: 'weatherChaosFishingPower', type: 'mult', value: 1 / 1.1},
            {name: 'currencyEventDriftwoodGain', type: 'mult', value: 1.75},
        ],
    },
    master: {
        icon: 'mdi-trophy-award',
        effect: [
            {name: 'weatherChaosFishingPower', type: 'base', value: 12},
            {name: 'weatherChaosFishingTime', type: 'mult', value: 1.15},
        ],
    },
    smelly: {
        icon: 'mdi-scent',
        effect: [
            {name: 'currencyEventSlimeGain', type: 'mult', value: 2},
            {name: 'weatherChaosFishingTime', type: 'mult', value: 1.5},
        ],
    },
    turbo: {
        icon: 'mdi-truck-fast',
        effect: [
            {name: 'weatherChaosFishingTime', type: 'mult', value: 0.5},
            {name: 'weatherChaosFishChance', type: 'base', value: -0.2},
            {name: 'weatherChaosTreasureChance', type: 'base', value: -0.04},
            {name: 'weatherChaosTrashGain', type: 'mult', value: 1 / 1.75},
        ],
    },
    golden: {
        icon: 'mdi-gold',
        effect: [
            {name: 'weatherChaosFishChance', type: 'base', value: 0.05},
            {name: 'weatherChaosTreasureChance', type: 'base', value: 0.025},
            {name: 'weatherChaosTrashGain', type: 'mult', value: 1 / 1.75},
        ],
    },
    dull: {
        icon: 'mdi-square-opacity',
        effect: [
            {name: 'weatherChaosTreasureChance', type: 'base', value: -0.025},
            {name: 'currencyEventPlasticGain', type: 'mult', value: 1.75},
        ],
    },
    mystical: {
        icon: 'mdi-auto-fix',
        effect: [
            {name: 'weatherChaosIgnoreWeather', type: 'base', value: 0.1},
            {name: 'weatherChaosFishSizeMax', type: 'mult', value: 1 / 1.2},
            {name: 'weatherChaosFishSizeAverage', type: 'mult', value: 1 / 1.4},
        ],
    },
    twins: {
        icon: 'mdi-call-split',
        effect: [
            {name: 'weatherChaosFishingTime', type: 'mult', value: 1.1},
            {name: 'weatherChaosFishDoubleChance', type: 'base', value: 0.2},
            {name: 'weatherChaosTrashGain', type: 'mult', value: 1 / 1.6},
        ],
    },
}
