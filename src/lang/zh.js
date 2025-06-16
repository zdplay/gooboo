import { zh } from 'vuetify/lib/locale'
import card from './zh/card'
import consumable from './zh/consumable'
import currency from './zh/currency'
import mult from './zh/mult'
import note from './zh/note'
import relic from './zh/relic'
import stat from './zh/stat'
import unlock from './zh/unlock'
import upgrade from './zh/upgrade'
import patchnote from './zh/patchnote'
import tag from './zh/tag'

export default {
  ...zh,
  badge: '徽章',
  gooboo: {
    buy: '购买',
    craft: '制作',
    feature: '功能',
    features: '功能',
    cantAfford: '无法购买',
    capTooLow: '容量不足',
    equip: '装备',
    unequip: '卸下',
    unequipAll: '全部卸下',
    select: '选择',
    deselect: '取消选择',
    take: '拿取',
    max: '最大',
    maxed: '已满',
    free: '免费',
    capacity: '容量',
    multCapacity: '{0} 容量',
    gain: '增益',
    multGain: '{0} 增益',
    apply: '应用',
    reset: '重置',
    unlock: '解锁',
    keep: '保留',
    consumable: '消耗品',
    lock: '未解锁',
    upgrade: '升级',
    upgrades: '升级',
    upgradeVerb: '升级',
    upgradesPrestige: '声望升级',
    prestige: '声望',
    prestigeDescription: '重置此功能以获得声望货币',
    prestigeTime: '本次声望周期已用时间',
    saveManual: '保存',
    saveExport: '导出存档',
    saveImport: '导入存档',
    cloudsave: '云存档',
    cloudloadlatest: '加载最新云存档',
    cloudloadlist: '云存档列表',
    resetProgress: '重置进度',
    closeAll: '全部关闭',
    draw: '画画',
    finish: '完成',
    boost: '提升',
    skip: '跳过',
    level: '等级',
    chance: '几率',
    effect: '效果',
    effects: '效果',
    confirm: '确认',
    cancel: '取消',
    queue: '队列',
    maxLevel: '最大等级',
    inventory: '库存',
    newGame: '新游戏',
    levelSuffix: '等级',
    delete: '删除',
    convert: '转换',
    add: '增加',
    cloudlogin: '云登录',
    playedBefore: {
      0: '以前玩过吗？ 加载你的保存文件 ',
      1: '这里'
    },
    offlineSummary: {
      title: '欢迎回来! 你已经离开了 {0}',
      newVersion: '新版本! ',
      upgradesFinished: '升级完成',
      downloadBackup: '下载存档备份',
      eventEnded: '事件结束',
      eventStarted: '事件开始',
      toFeature: '进入功能'
    },
    operator: {
      '>=': 'at least',
      '>': 'over',
      '<=': 'at most',
      '<': 'under',
      '==': 'exactly'
    }
  },
  endOfContent: {
    name: '内容结束',
    description: '您已到达此功能的内容末尾，这会使进度比预期慢。等待未来更新或专注于其他功能以继续前进'
  },
  message: {
    achievement: {
      get: '成就获得!',
      gained: '获得',
      relicGained: '获得圣遗物'
    },
    card: {
      get: '卡包内容',
      new: '新!'
    },
    farm: {
      harvest: '收获物品',
      plant: '使用物品'
    },
    feature: {
      feature: '新的功能已解锁!',
      subfeature: '新的子功能已解锁!',
      school: '新的科目已解锁!',
      general: '新的将军已解锁!'
    },
    heirloom: {
      get: '发现了传家宝'
    },
    note: {
      get: '发现笔记 #{0}',
      read: '阅读'
    },
    save: {
      success: '游戏已保存',
      error: '自动保存失败'
    },
    prize: {
      get: '你赢得了奖品!',
      bingo1: 'BINGO!',
      bingo2: '双倍 BINGO!',
      bingo3: '三倍 BINGO!'
    },
    school: {
      get: '课程完成!',
      getExam: '考试完成!',
      score: '分数: {0}',
      perfectScore: '(完美!)',
      grade: '{0}% 成绩',
      gradePlus: '你的成绩提高了!',
      dust: '+{0} 金尘'
    },
    update: {
      get: '新的更新!',
      apply: '刷新 + 应用'
    },
    import: {
      message: '文件无法加载',
      base64: '解码失败',
      json: 'JSON 无法解码',
      key: '加载的存档文件缺少所需数据',
      version: '该文件来自游戏的较新版本（v{0}，当前版本: v{1})',
      testing: '测试版本中的文件无法在发布版本中使用',
      testingVersion: '来自旧测试版本的文件不能使用',
      migration: '从 v{0} 迁移到 v{1} 时出错',
      checksum: '校验和无效',
    }
  },
  duplicateTab: {
    title: 'Gooboo 已在另一个选项卡中运行',
    description: '为了防止与您的保存文件不一致，Gooboo 只能运行一个。 请关闭此选项卡并返回现有选项卡上的游戏。'
  },
  reset: {
    feature: '想重新开始吗?在这里，你可以在不触及游戏其他部分的情况下重置单个功能的进度。',
    warning: '这不是一种声望，这样做不会有任何奖励或退款。重置后无法恢复',
    deleteSave: '您也可以在这里删除整个保存文件:',
    deleteButton: '删除保存文件'
  },
  prestigeDescription: {
    mining_ember: '获得相当于当前居民深度百分比的余烬',
    village_blessing: '信仰会转化为祝福',
    village_shares: '获得相当于当前铜币数量0.1%的股票',
    horde_soulEmpowered: '堕落的灵魂将转化为强大的灵魂',
    horde_courage: '达到10级时获得勇气，之后每升一级获得更多勇气',
    gallery_cash: '根据获得的美丽总量获得现金',
  },
  confirm: {
    title: '确认操作',
    prestige: '您即将获得声望，重置您在此功能中的所有进度，以换取声望货币。 你确定你想要声望吗？',
    prestigeNoGain: '你即将获得声望，重置你所有的进步。 由于您缺乏进度，您不会获得任何声望货币。 你确定你想要声望吗？',
    prestigeCrop: '您将要声望这种作物，重置其所有等级、经验和基因，以换取所有作物的永久增益奖励。 你确定你想要声望吗？',
    upgrade: {
      0: '您即将购买升级 ',
      1: ', 这需要稀有货币。 您确定要购买这个吗？'
    },
    shop: '您将要购买活动奖励，这需要花费稀有货币。 您确定要购买这个吗？',
    theme: {
      0: '您即将购买主题 ',
      1: ', 这需要稀有货币。 您确定要购买这个吗？'
    },
    cardPack: {
      0: '您即将购买卡包 ',
      1: ', 这需要稀有货币。 您确定要购买这个吗？'
    },
    weatherChaosFishingRodBuy: '您将要购买钓鱼竿"{0}"，它需要花费稀有货币。 您确定要购买这个吗？',
    summerFestivalCellBuy: '您将要购买一个新的岛屿细胞，这需要花费稀有货币。 您确定要购买这个吗？',
    farmCrop: '您将要种植需要稀有货币的农作物。 您确定要购买这个吗？',
    galleryMotivation: '你将购买动机，这需要稀有货币。你确定要买这个吗?',
    treasure: '您将要购买一件新的宝藏，该宝藏需要花费稀有货币。 您确定要购买这个吗？',
    schoolExamPass: '您将要购买一张考试通行证，这需要花费稀有货币。 您确定要购买这个吗？',
    treasureFragment: '您将要购买碎片，这需要花费稀有货币。 您确定要购买这个吗？',
    treasureDelete: '你即将摧毁一个宝藏，这将给予碎片作为回报。 您确定要购买这个吗？',
    casinoBingoBuy: '您将要购买一张宾果卡，该卡需要稀有货币。 您确定要购买这个吗？',
    casinoWheelSpin: '您即将转动命运之轮，这需要花费稀有货币。 您确定要购买这个吗？',
    consumable: '此操作需要您没有的消耗品。 您想用稀有货币购买这些吗？',
    reset: {
      text: '您确定要重置{0}功能吗? 此操作不能撤销!',
    },
    resetAll: '您确定要删除保存文件吗? 此操作不能撤销!'
  },
  feature: {
    subfeature: '子功能',

    // Main features
    mining: '采矿',
    village: '村庄',
    horde: '部落',
    farm: '农场',
    gallery: '画廊',

    // Side features
    note: '笔记',
    relic: '圣遗物',
    gem: '宝石',
    achievement: '成就',
    school: '学校',
    card: '卡片',
    general: '将军',
    event: '事件',
    treasure: '宝藏',
    cryolab: '冷冻实验室',
    strategy: '攻略',
    debug: '调试',

    // Subfeatures
    miningGas: '气体',
    villageCrafting: '制作',
    hordeClasses: '职业',
    schoolLiterature: '文学',
    schoolHistory: '历史',
    schoolArt: '艺术',
    generalOrladee: '奥拉迪',
    generalOppenschroe: '奥本施罗',
    generalBellux: '贝卢克斯',
    generalOnoclua: '奥诺克卢亚',
    generalOmnisolix: '奥尼索利克斯',

    // Meta
    meta: '游戏'
  },
  subfeature: {
    mining: {
      0: '矿石开采',
      1: '气态巨行星',
    },
    village: {
      0: '工人',
      1: '工匠行会',
    },
    horde: {
      0: '装备',
      1: '职业',
    },
    farm: {
      0: '花园',
    },
    gallery: {
      0: '花式',
    }
  },
  unlock,
  mult,
  tag,
  text: {
    villageIngredientBoxGet: '收到3成分盒子',
    hordeBattlePassUpgrade: '新的升级',
    hordeBattlePassPrestigeUpgrade: '新的声望升级',
    farmUnlockDna: '解锁 1 级基因的所有 DNA 升级',
    farmGnomeBoost: '每个附近的花园侏儒都会增加收获产量4%，高级花园侏儒效果翻倍',
    farmLonelyGrow: '当田地中没有其他同类作物时，生长速度翻倍',
    farmFertileBoost: '每消耗1单位蓝宝石肥料，产量提升30%',
    farmYieldConversion: '将5%的产量转化为其他类型的资源',
    farmFastPrestige: '声望时作物等级只降低5级，而不是重置为0级',
    farmLuckyHarvest: '有1%的几率获得8倍收获奖励',
    farmSelfless: '所有作物产量提升5%',
    farmUnyielding: '收割后有40%的几率自动免费重新种植',
    farmTeamwork: '每种拥有此基因的作物都会使所有作物的产量翻倍',
    farmHunter: '猎杀稀有资源的原生植物。狩猎几率等于你稀有掉落几率的1%。每次狩猎成功，资源容量增加基础值的10%，基础狩猎几率降低5%',
    farmPatient: '选择该基因后，每天产量增加3%，最多持续60天（总计+180%）'
  },
  upgrade,
  currency,
  stat,
  consumable,
  patchnote,
  info: {
    title: 'Gooboo',
    subtitle: '开发者：Tendsty',
    testing: '测试版',
    text: 'Gooboo 是一款放置/增量游戏，你将在神秘未知的世界中管理多种功能。收集各种资源购买升级，提升资源获取速度。推进主要功能以解锁新内容，了解更多世界信息。当进度放缓时，可以对单个功能进行声望重置，将你的收益提升到新高度。',
    updates: {
      web: '你正在使用网页版。游戏会定期检查更新，自动使用最新版本，并在有更新时通知你。',
      desktop: {
        0: '你正在使用桌面版。你需要在',
        1: '发布页面',
        2: '手动检查更新。'
      },
      offline: {
        0: '你正在使用离线版。你需要在',
        1: '发布页面',
        2: '手动检查更新。'
      },
      steam: '你正在使用Steam版本。更新通过Steam自动处理。'
    },
    testingDescription: {
      0: '你正在玩测试版。功能可能未完成或存在错误，游戏机制可能随时变化。你可以在',
      1: '这里',
      2: '玩正式版（测试版存档无法在正式版中使用）'
    },
    viewPatchnotes: '查看更新日志',
    numberFormatting: '数字格式',
    numberFormattingDescription: '为了保持数字可读，极大（和极小）的数字使用以下单位进行格式化.',
    bigNumbers: '大数字',
    smallNumbers: '小数字',
    timeUnits: '时间单位',
    timeUnit: {
      s: '秒',
      m: '分钟',
      h: '小时',
      d: '天'
    },
    socials: {
      title: '社交',
      text: 'Gooboo 可以单独玩，无需外部指南。 但如果你想和其他玩家一起出去玩，你可以参观这些地方:',
      viewCode: '查看源码',
      patreon: 'Patreon',
      reddit: 'Reddit',
      discord: 'Discord'
    },
    supportMe: {
      title: '支持我',
      text: '该游戏是免费的，没有微交易或广告。 如果您想支持开发，请查看我的 patreon 页面:',
      patreon: 'Patreon'
    },
    tech: {
      title: '用到的技术',
      web: 'Web',
      fonts: '字体',
      testing: '自动化测试',
      vue: 'Vue.js',
      vuetify: 'Vuetify',
      vuex: 'vuex',
      snackbars: 'v-snackbars',
      color: 'color',
      mdi: 'Material Design Icons',
      jsfiledownload: 'Javascript File Download',
      seedrandom: 'seedrandom',
      caveat: 'Caveat',
      roboto: 'Roboto',
      robotomono: 'Roboto Mono',
      cypress: 'Cypress',
      jest: 'Jest',
      github: 'GitHub',
      website: '网站',
      googlefonts: 'Google Fonts'
    },
    cheater: {
      0: {
        title: '光荣',
        description: '在没有使用以下任何工具的情况下玩了游戏',
      },
      100: {
        title: '自动化',
        description: '使用工具自动执行类似人类的动作，同时仍然遵循游戏规则',
      },
      200: {
        title: '作弊',
        description: '编辑游戏变量或使用工具实现不可能的结果或预测/改变结果',
      },
      selfMark: '设置作弊者状态',
      selfMarkDescription: '你可以在这里把自己标记为作弊者。这是纯粹的视觉效果，可以在任何时候逆转',
      noDetected: '未检测到作弊行为',
      featureDetected: '在以下功能中检测到作弊:',
      featureDetected2: '您可以通过完全重置这些功能来删除作弊标记',
      globalDetected: '作弊已被检测到，您的保存文件已被永久标记',
      selfMarkClick: '如果你作弊了，而游戏没有正确检测到，你可以点击查看将自己标记为作弊者的选项',
    },
    statistics: {
      name: '统计',
      overview: '概览',
      other: '其他',
      gained: '获得',
      maxOwned: '最高数量',
      currentTotal: '当前 / 总计',
      defaultPlayerName: '玩家',
    }
  },
  error: {
    tech: {
      vuejs: 'Vue.js',
      javascript: 'Javascript'
    },
    title: '{0} 错误',
    source: '来源: {0}',
    position: '第 {0} 行，第 {1} 列',
    reportBug: '报告错误'
  },
  note,
  school: {
    school: '学校',
    beginner: {
      title: '仍在学习',
      description: '您是这所学校的新手，您的金尘奖励减少至 {0}%。 达到更高的全局等级可以减少此惩罚，并通过达到全局等级 175 来完全消除它。'
    },
    subjectBookGain: '每个解锁的科目每小时都会提供 10 本书，无论年级如何。',
    passCapGain: '您每天都会获得一张新的考试通行证（{0} 中的下一个考试通行证），并且每 10 个全局级别都会获得一张新的考试通行证。',
    buyPass: '购买一张考试通行证花费',
    library: '图书馆',
    practice: '练习',
    practiceDescription: '在没有时间压力的情况下练习该科目，但不会获得任何奖励或成绩',
    study: '学习',
    studyDescription: '在{0}中获得尽可能高的分数，如果您以最好的成绩学习，就有机会提高您的成绩。 根据您的分数，您会获得（或失去）升入下一年级的进度。 预计平均得分为 {1}。',
    studyNoF: '您不能失去 F 级的成绩进度。',
    takeExam: '参加考试',
    takeExamDescription: '参加考试，您有 {0} 的机会获得最高分。 您将收到金粉作为奖励（{1} - {2}，根据您的表现和所选等级）。 如果您获得 {3} 分，则考试被评为完美，您可以解锁下一个等级。',
    takeExamNoF: '您不能参加 F 级考试。',
    takeExamNoFStudy: '先稍微学习一下吧！',
    takeExamCost: '要求',
    examDustFull: '你古老的沙漏已经满了！ 这次考试获得的所有金尘都将丢失！',
    examDustOvercap: '你古老的沙漏快满了。 通过这次考试获得的一些金粉可能会因为上限而丢失。',
    answer: '答题',
    begin: '课程开始了！',
    beginExam: '考试开始了！',
    grade: '成绩',
    gradeDescription: '成绩决定了该科目的难度。 您可以随时切换成绩，通过足够的学习或获得完美的考试成绩来解锁更好的成绩。',
    math: {
      name: '数学',
      subtitle: '求解方程式',
      description: '回答各种方程式来提高你的分数。 每个正确答案得 1 分，每个错误答案扣 1 分（不能低于 0）。 随着等级的提高，数量会越来越多，并且会引入新的操作员。',
    },
    literature: {
      name: '文学',
      subtitle: '写句子',
      description: '输入显示的句子来提高你的分数。 每输入一个句子即可获得 1 分。 同一个句子将一直保留到正确输入为止，并且您可以看到下一个句子的开头。 随着等级的提高，句子和单词会变得更长，并且会引入新的特殊字符。',
    },
    history: {
      name: '历史',
      subtitle: '记住日期',
      description: '记住显示的日期并正确输入它们以提高您的分数。 一开始您可以看到所有日期。 当您记住它们后，您可以继续做问题，这会使日期消失。 您将被问到 5 个问题，与您刚刚看到的日期有关，每个正确的日期将获得 1 分。 随着你的成绩提高，年份会变长，并且会引入更多的日期。',
      year: '年份 {0}',
      examInfo: '在考试中，您有两次记住日期的机会。 完成第一个答案后，您会收到一组新的日期和问题'
    },
    art: {
      name: '艺术',
      subtitle: '混合颜色',
      description: '正确猜测颜色以提高你的分数。 将显示两种颜色，猜测它们混合的结果。 每个正确答案得 1 分，每个错误答案扣 1 分（不能低于 0）。 随着您的成绩提高，会添加更多答案，并且答案会变得更加相似。',
    }
  },
  hourglass: {
    title: '古老的沙漏',
    subtitle: '跳过此功能的时间',
    subtitleSchool: '将考试合格证转化为金粉',
    timeInMinutes: '时间 (分钟)'
  },
  eventHourglass: {
    title: '事件时间沙漏',
    subtitle: '使用紫水晶加速当前事件',
    timeInMinutes: '时间（分钟）',
    description: '每消耗1个紫水晶可以加速当前事件1.5分钟'
  },
  cryolab: {
    frozen: '{0} / {1} 功能冻结',
    active: '主动: {0}%',
    activeTitle: '声望增益 (主动)',
    activeDescription: '每天被动获得相当于您最佳声望的 {0}% 的声望货币。 仅当功能被冻结时此功能才有效。',
    passive: '被动: {0}%',
    passiveTitle: '声望增益 (被动)',
    passiveDescription: '每天被动获得相当于您最佳声望的 {0}% 的声望货币。 仅当功能未冻结时此功能才处于激活状态。',
    expDescription: '你有 {0} / {1} 经验和获得 {2} 经验每天如果此功能被冻结, 升级还需 {3} 天。',
    expDescription2: '经验获取基于您的最佳声望。',
    expNext: '下一级效果:',
    expNoGain: '要获得此功能的经验，请先获得一些声望货币',
    cropExp: '为每种作物获得最多此数量的经验（基础生长时间和黄金成本会减少获得的经验）。 然后乘以最高和当前作物等级之间的差异（最高等级的作物没有经验）',
    frozenFeature: {
      title: '功能被冻结',
      description: '此功能已被冷冻实验室冻结。 您不会在此功能中获得任何进展，但会自动获得声望货币。'
    }
  },
  general: {
    completionReward: '完成奖励',
    questGained: '{0} 增益',
    grobodal: {
      name: '格罗博达尔',
      diggingDeeper: '挖掘得更深',
      combatTraining: '战斗训练',
      gardening: '园艺',
      pitchBlack: '漆黑一片',
      masterOfTheSystem: '系统大师',
      thinkPlayerThink: '想一想，玩家，想一想!',
    },
    orladee: {
      name: '奥拉迪',
      beautyOfThisWorld: '这世间的美丽'
    },
    oppenschroe: {
      name: '奥本施罗'
    },
    bellux: {
      name: '贝卢克斯'
    },
    onoclua: {
      name: '奥诺克卢亚'
    },
    omnisolix: {
      name: '奥尼索利克斯'
    },
  },
  event: {
    shop: {
      notFound: '没有找到商店',
      bought: '有库存'
    },
    cinders: {
      name: '煤渣',
      perProducer: '每个生产者',
      candle: {
        tealight: '茶烛',
        regular: '蜡烛',
        aroma: '香薰蜡烛',
        chandelier: '吊灯',
        duration: '持续 {0}',
        sootGain: {
          0: '燃烧后产生 ',
          1: ' ',
          2: ' 在燃烧后'
        }
      }
    },
    bloom: {
      name: '开花',
      tier: '层级',
      canSell: '可以出售获得 {0} ',
      sell: '选择一朵花出售。当你获得一朵库存充足的花时，该类型的最低级别的花会自动出售。',
      dragToBreeder: '拖动一朵花到这里开始繁殖',
      wildGrowth: '在你的库存中的所有花上随机获取一个基因。这不能绕过每朵花3个基因的限制。',
      boost: '立即获得1天的进度',
      genes: '基因',
      wildgrowth: '野性生长',
      flower: {
        daisy: '雏菊',
        poppy: '罂粟',
        iris: '鸢尾花',
        lily: '百合',
        orchid: '兰花',
        cornflower: '矢车菊',
      },
      gene: {
        valuable: {
          name: '宝贵',
          description: '3x 绽放价值'
        },
        mutating: {
          name: '变异',
          description: '2x 基因几率'
        },
        splitting: {
          name: '分裂',
          description: '25% 几率培育 2 朵新花'
        },
        resistant: {
          name: '抗性',
          description: '+10% 层级几率'
        },
        huge: {
          name: '巨大',
          description: '+1 层级并在合并时消耗该基因'
        }
      }
    },
    weatherChaos: {
      name: '天气混乱',
      chanceToCatch: '几率抓住',
      powerNeeded: '需要的钓鱼力量',
      maxSize: '最大尺寸',
      owned: '拥有的',
      fishingPowerDescription: '钓鱼能力决定了你能钓到什么鱼。 达到双倍钓鱼力量要求，以最大程度地捕获该鱼。',
      fishSizeDescription: '大小等于或低于平均水平的鱼被捕获的几率相同。 当尺寸高于平均水平时，其他尺寸就变得更难捕获。',
      fishDescription: '如果你没有钓到宝藏，你还有机会钓到鱼。 可用的鱼类类型取决于地点和天气。',
      trashTitle: '垃圾几率',
      trashDescription: '当你没能钓到宝藏或鱼时，你就会钓到垃圾。',
      treasureDescription: '您有很小的机会捕获宝藏。 如果您的钓鱼能力至少为 {0}，它可能包含鱼饵、新钓鱼竿或新地点的钥匙。',
      treasureDescriptionFinal: '您有很小的机会捕获宝藏。 它可以包含鱼饵或新的钓鱼竿。',
      changeWeather: '改变天气',
      location: {
        pond: '池塘',
        lake: '湖泊',
        river: '河流',
        ocean: '海洋',
        mountain: '高山',
        cave: '洞穴',
      },
      fish: {
        bronzefish: '青铜鱼',
        snail: '蜗牛',
        cablebiter: '电缆咬鱼',
        blueshimmer: '蓝闪鱼',
        introvero: '内敛鱼',
        zapling: '小芽鱼',
        starcone: '星锥鱼',
        phelaria: '费拉利亚鱼',
        coldgil: '冷鳃鱼',
        silverbrass: '银铜鱼',
        circlejelly: '圆形水母',
        woodcrawler: '木爬鱼',
        longdano: '长达诺鱼',
        legabara: '腿巴拉鱼',
        biggiesnail: '大蜗牛',
        sunshine: '阳光鱼',
        platiglob: '铂金球鱼',
        stormdazer: '风暴眩鱼',
        riverTurtle: '河龟',
        streamsnail: '溪流蜗牛',
        ralmon: '拉尔蒙鱼',
        wonelle: '沃内尔鱼',
        grillgil: '烤鳃鱼',
        sleepysoo: '睡眠苏鱼',
        oozior: '软泥怪鱼',
        paleblob: '苍白水球',
        crystakin: '晶族鱼',
        shadowbiter: '影咬鱼',
      },
      fishingRod: {
        name: '鱼竿',
        basic: '基础',
        fast: '快速',
        leafy: '绿叶',
        heavy: '重',
        hardwood: '硬木',
        master: '精通',
        smelly: '臭',
        turbo: '涡轮',
        golden: '金色',
        dull: '迟钝',
        mystical: '神秘',
        twins: '双胞胎',
        novice: '儿童版',
        bamboo: '竹制',
        net: '捞网',
        lucky: '幸运',
      },
      bait: {
        juicyBait: '多汁的诱饵',
        rainbowBait: '彩虹饵',
        trashNet: '垃圾网',
        magnet: '磁铁',
      }
    },
    summerFestival: {
      name: '夏日祭典',
      produces: '生产',
      producesNothing: '什么也不产生',
      empty: '空',
      constructing: '建造中',
      upgrading: '升级',
      deleting: '删除',
      emptyQueue: '建筑队列为空',
      inQueue: '在队列中',
      inDeletionQueue: '队列待删除',
      placeOn: '必须放置在',
      rotateDescription: '旋转建筑物',
      deleteDescription: '删除该建筑物。 资源不会退还，这需要在建造队列中花费时间。',
      complete: '完成',
      build: '建造',
      freeExpansion: {
        s: '{0} 自由扩张',
        p: '{0} 自由扩张'
      },
      quest: {
        name: '任务',
        currency: '收集 {0} ',
        building: '构造 {0}x 等级 {1} {2}'
      },
      tile: {
        beach: '海滩',
        water: '水',
        palm: '棕榈树',
        forest: '森林',
        mountain: '高山',
        plain: '平原',
        land: '陆地'
      },
      tilePos: {
        0: 'center',
        1: 'right',
        2: 'bottom right',
        3: 'bottom left',
        4: 'left',
        5: 'top left',
        6: 'top right'
      },
      building: {
        collector: {
          name: '收集者',
          description: '自动从相邻地块收集资源'
        },
        mainStage: {
          name: '主舞台',
          description: '产生音乐并解锁更多建筑物'
        },
        speaker: {
          name: '扬声器',
          description: ''
        },
        vegetablePatch: {
          name: '菜地',
          description: ''
        },
        kitchen: {
          name: '厨房',
          description: '使用食材制作餐点',
          action: {
            coconutSalad: '椰子沙拉',
            saltyShell: '咸贝壳',
            lemonCandy: '柠檬糖',
            steak: '牛扒',
            fishSticks: '鱼条',
          }
        },
        sawmill: {
          name: '锯木厂',
          description: '将建筑材料切割成组件',
          action: {
            cutPlates: '切割板材',
            cutSandstone: '切割砂岩',
            smeltSteel: '冶炼钢铁',
            combineMaterial: '组合材料'
          }
        },
        huntingArea: {
          name: '狩猎区',
          description: ''
        },
        excavator: {
          name: '挖掘机',
          description: ''
        },
        lighthouse: {
          name: '灯塔',
          description: ''
        },
        grill: {
          name: '烤架',
          description: '用煤做饭',
          action: {
            cookMeat: '烹饪肉类',
            cookFish: '烹饪鱼类'
          }
        },
        mine: {
          name: '矿山',
          description: '从山上开采资源'
        },
        hugeSpade: {
          name: '巨大的铲子',
          description: '从海滩上挖沙子'
        },
        shellOpener: {
          name: '开壳器',
          description: '打开金属零件和稀有物品的外壳',
          action: {
            openShell: '打开外壳'
          }
        },
        waterPurifier: {
          name: '净水器',
          description: '净化咸海水并提取盐'
        },
        fishingNet: {
          name: '捕鱼网',
          description: '从海洋中捕获鱼'
        },
        pepperField: {
          name: '胡椒田',
          description: '种植和收获胡椒植物'
        },
        beehive: {
          name: '蜂窝',
          description: '从勤劳的蜜蜂那里采集蜂蜜'
        },
        citrusPlantation: {
          name: '柑橘种植园',
          description: '种植柑橘类水果并收获它们'
        }
      },
      buildingEffect: {
        autocollectMult: '自动收集数量',
        pearlChance: '珍珠几率',
      }
    },
    nightHunt: {
      name: '夜间狩猎',
      potions: '药水',
      performRitual: '进行仪式',
      performRitualDescription: '消耗所有选定的成分来执行仪式。 如果找到正确的成分组合，即可解锁新药水。 位置也很重要！',
      asBonusIngredient: '一个好的成分',
      findablePotions: '此层可找到的药水',
      ritualStabilityDescription: '稳定性会影响基于百分比的批量几率:',
      ritualStabilityDescription1: '100% - 200%: 保留基础成分的几率 (当前 {0}%)',
      ritualStabilityDescription2: '0% - 100%: 保留奖励成分的几率 (当前 {0}%)',
      ritualStabilityDescription3: '-100% - 0%: 仪式有几率失败而不会获得任何奖励 (当前 {0}%)',
      ritualSuccessDescription: '一次成功的仪式将产生用于新仪式的夜间狩猎代币，并有可能找到新的药水。 对已知药水进行成功的仪式会提高其等级，产生夜间狩猎代币，并使该药水更难达到下一个等级。',
      ritualFamiliarityDescription: '如果该仪式失败，则将该仪式的稳定性和成功几率提高一定量。 此奖励会在仪式成功时叠加并重置。',
      ritualHintDescription: '有几率揭示有关插槽或成分数量的提示。 仅对成功的新仪式给出提示。 对于每个找到的提示，此几率会降低 {0}%。 当发现暗示的仪式时，提示和提示几率惩罚会重置。',
      clickToAdd: '单击成分将其添加到仪式中',
      ingredientSizeDescription: '成分尺寸可让您以每种魔法货币找到更多成分',
      favouriteIngredient: {
        title: '最喜欢的成分',
        description: '你可以选择一种最喜欢的食材，每次你找到一种食材，你也会收到你最喜欢的食材',
        copy: '复制发现的成分',
      },
      sackDescription: '麻袋可以出现高魔法量，消耗10倍的魔法，包含10倍的成分，平均分配给所有可用的',
      newDescription: {
        empty: '在这里你可以看到当前配方是否是新的（之前没有成功过）',
        isNew: '这是一个新配方，如果成功，您将收到夜间狩猎代币',
        isNewPotion: '你还可能发现一种新药水',
        discoveredPotion: '这是已知的药剂配方。 如果这个仪式成功，你会升级药水并获得夜间狩猎代币',
        pointless: '这是一个已知的配方，没有必要在这个配方上进行更多的仪式'
      },
      potion: {
        power: '力量药水',
        insight: '洞察药水',
        rage: '愤怒药水',
        calming: '镇静药水',
        sorrow: '悲伤药水',
        energy: '能量药水',
        nature: '自然药水',
        intensity: '强化药水',
        hysteria: '癔症药水',
        insanity: '疯狂药水',
        patience: '耐心药水',
        transformation: '变身药水',
        silence: '沉默药水',
        photosynthesis: '光合药水',
        sun: '太阳药水',
        growth: '生长药水',
        solidification: '凝固药水',
        liquification: '液化药水',
        glowing: '发光药水',
        stasis: '瘀滞药水',
        creativity: '创意药水',
        poison: '毒药药水',
        warmth: '温暖药水',
      }
    },
    snowdown: {
      name: '降雪',
      fightCount: '战斗',
      fight: '战斗',
      fightDescription: '以几个雪球为代价与显示的对手战斗。',
      fightWin: '如果你赢，你会获得',
      fightWinProducer: '您选择的生产商',
      fightWinItem: '三件随机物品中的一件',
      pickProducer: '选择一个生产者',
      pickItem: '选择一个物品',
      reroll: '重掷',
      rerollDescription: '将拥有的物品重掷成另一个物品。',
      buyItem: '购买物品',
      buyItemDescription: '从三个随机物品中选择一个',
      attackDescription: '你的攻击造成的伤害。最终的伤害将在你攻击的80%到120%之间',
      healthDescription: '在被冻结和无法战斗之前，你可以承受的伤害数量',
      defenseDescription: '减少一定数量的伤害',
      critDescription: '每暴击等级增加1%的暴击几率。暴击造成+10点伤害。在25%暴击率以上，当你的暴击率接近75%时，你的暴击率会减少。每损失1%的暴击机会，获得+0.2的暴击伤害。乘数攻击增加也会增加暴击伤害',
      blockDescription: '增加你格挡攻击且不受伤害的几率',
      boost: '立即获得 1 天的进度',
      revenge: {
        name: '复仇',
        description: '你已经连续输掉{0}场战斗。这会增加你的属性，直到你赢得一场打雪仗',
        statsBase: '战斗失败时增加5%的攻击力和生命值',
        statsScaling: '获得+5%的攻击和生命值，+{1}暴击等级和+{1}格挡等级当你输了一场战斗。每次你输掉一场战斗，你也会得到额外的+{2}%的攻击和生命值'
      },
      fighter: {
        snowOwl: '雪鸮',
        dog: '狗',
        cat: '猫',
        penguin: '企鹅',
        rabbit: '兔子',
        turtle: '乌龟',
        toddler: '学步儿童',
        babysitter: '保姆',
        kid: '小孩',
        toughKid: '坚强的孩子',
        teenager: '少年',
        bully: '恶霸',
        youngAdult: '青年人',
        hooligan: '流氓',
        adult: '成人',
        veteran: '老兵',
        wallOfIce: '冰墙',
        snowBot: '雪地机器人'
      },
      item: {
        rollingPin: {
          name: '擀面杖',
          description: ''
        },
        forest: {
          name: '森林',
          description: ''
        },
        snowCannon: {
          name: '雪炮',
          description: ''
        },
        shepherd: {
          name: '牧羊人',
          description: ''
        },
        animalTooth: {
          name: '动物牙齿',
          description: ''
        },
        collar: {
          name: '项圈',
          description: ''
        },
        chili: {
          name: '辣椒',
          description: ''
        },
        drumstick: {
          name: '鼓槌',
          description: ''
        },
        mouse: {
          name: '老鼠',
          description: '当你的一只宠物攻击时治疗玩家 1'
        },
        bone: {
          name: '骨头',
          description: '你的宠物攻击时会治愈 1 点'
        },
        gravestone: {
          name: '墓碑',
          description: '宠物冻结可以治疗玩家和其他宠物 15'
        },
        spikedCollar: {
          name: '尖刺项圈',
          description: '随机宠物有 30 点暴击和格挡等级，此奖励在冻结时转移到另一只随机宠物'
        },
        heartCollar: {
          name: '心形项圈',
          description: '随机宠物复活一次'
        },
        treatBag: {
          name: '治疗袋',
          description: '宠物可以选择治疗 50% 最大生命值而不是攻击。 每袋 3 份零食'
        },
        tennisBall: {
          name: '网球',
          description: '当玩家冻结时所有宠物都会复活'
        },
        appleJuice: {
          name: '苹果汁',
          description: '玩家可以选择治疗 50% 最大生命值而不是攻击。 一次性使用'
        },
        hotWater: {
          name: '热水',
          description: '玩家以 25% 生命值复活一次'
        },
        dumbbell: {
          name: '哑铃',
          description: '玩家受到攻击时获得 0.5 攻击力'
        },
        target: {
          name: '目标',
          description: '玩家攻击时获得 4 暴击等级'
        },
        gloves: {
          name: '手套',
          description: '玩家受到攻击时获得 0.2 攻击力和 1 暴击等级'
        },
        snowboard: {
          name: '滑雪板',
          description: '前5次玩家攻击暴击'
        },
        tea: {
          name: '茶',
          description: '敌人被冻结后，玩家可以治疗 25 点并在下一次攻击中暴击'
        },
        starShield: {
          name: '星盾',
          description: '玩家在前 3 回合内获得 5 点防御'
        },
        coffee: {
          name: '咖啡',
          description: '玩家暴击时治疗 8 点'
        },
        pebbles: {
          name: '鹅卵石',
          description: '玩家在暴击时击晕目标 1 回合'
        },
        sunShield: {
          name: '日盾',
          description: ''
        },
        moonShield: {
          name: '月盾',
          description: ''
        },
        fireplace: {
          name: '壁炉',
          description: ''
        },
        specialSnowflake: {
          name: '特殊雪花',
          description: ''
        },
        candyCane: {
          name: '糖果手杖',
          description: ''
        },
        shovel: {
          name: '铲子',
          description: ''
        },
        turkey: {
          name: '火鸡',
          description: ''
        }
      }
    },
    merchant: {
      name: '商人'
    },
    casino: {
      name: '赌场',
      prize: '奖品',
      bingo: {
        1: '1x 宾果',
        2: '2x 宾果',
        3: '3x 宾果'
      }
    },
    bank: {
      name: '银行',
      description: '通过 3 个选项之一管理您的黄玉。 使用一个选项会禁用所有其他选项。 偿还贷款不需要或消耗任何行动。',
      project: {
        name: '项目',
        expandVault: '扩展金库',
        persuadeInvestors: '说服投资者',
        improveCreditScore: '提高信用评分',
        businessMarketing: '商业营销',
        cardTournament: '赞助卡片锦标赛',
        fund: '基金'
      },
      investment: {
        name: '投资',
        description: '投资黄玉可在下次银行活动时连本带利地收回。 前 {1} 颗黄玉获得 {0}% 的利息，以上所有物品均获得 {2}% 的利息',
        invest: '投资'
      },
      loan: {
        name: '贷款',
        description: '以 {0}% 的利息借用黄玉并稍后偿还。 当您获得满容量的黄玉时，黄玉债务会自动偿还。',
        repay: '偿还',
        borrow: '借用'
      }
    },
    calendar: '日历',
    rewards: '奖励'
  },
  globalLevel: {
    name: '全局等级',
    description: '基于多个值的总和。 用于解锁新功能',
    mining_0: '击碎最深矿井岩石击碎',
    mining_1: '最深的气态巨岩击碎',
    village_0: '最大容纳量',
    village_1: '制作里程碑达到',
    horde_0: '击败最高区域首领',
    horde_1: '战斗通关等级',
    farm_0: '所有作物等级的总和',
    gallery_0: 'Log4 整体美丽',
    debug: '调试'
  },
  theme: {
    name: '主题',
    icon: {
      hasCustomNavbar: '自定义导航栏',
      hasCustomBackground: '自定义背景',
      hasCustomColors: '自定义配色',
      hasCustomUI: '自定义界面',
      hasAnimations: '包含动画',
      hasParticles: '包含粒子效果',
    },
    default: '默认',
    cyan: '青色',
    green: '绿色',
    yellow: '黄色',
    orange: '橙色',
    brown: '棕色',
    red: '红色',
    pink: '粉色',
    purple: '紫色',
    grey: '灰色',
    sepia: '复古',
    factory: '工厂',
    forest: '森林',
    cherry: '樱花',
    sky: '天空',
    polar: '极地',
    prismatic: '棱镜',
    candlelight: '烛光',
    colorful: '多彩',
    rain: '雨天',
    waves: '波浪',
    autumnForest: '秋林',
    frozen: '冰冻',
    dream: '梦幻',
    scifi: '科幻',
  },
  settings: {
    keybinds: {
      name: '键盘绑定',
      prevMainFeature: {
        name: '上一个主要功能'
      },
      nextMainFeature: {
        name: '下一个主要功能'
      },
      debugSkip1m: {
        name: '跳过 1 分钟'
      },
      debugSkip10m: {
        name: '跳过 10 分钟'
      },
      debugSkip1h: {
        name: '跳过 1 小时'
      },
      debugSkip1d: {
        name: '跳过 1 天'
      },
      achievement: {
        name: '成就'
      },
      gem: {
        name: '宝石'
      },
      treasure: {
        name: '宝藏'
      },
      card: {
        name: '卡片'
      },
      cryolab: {
        name: '冷冻实验室'
      },
      mining: {
        name: '采矿'
      },
      village: {
        name: '村庄'
      },
      horde: {
        name: '部落'
      },
      farm: {
        name: '农场'
      },
      gallery: {
        name: '画廊'
      },
      general: {
        name: '将军'
      },
      school: {
        name: '学校'
      },
      farmGalleryRefresh: {
        name: '农场重新种植/画廊形状重洗'
      },
      event: {
        name: '事件'
      },
      nextTab: {
        name: '下一个标签页'
      },
      prevTab: {
        name: '上一个标签页'
      },
      fixedKeys: '注意：快捷键1-0固定用于部落技能释放。'
    },
    theme: {
      name: '主题'
    },
    general: {
      name: '通用',
      pause: {
        name: '暂停'
      },
      dark: {
        name: '深色模式'
      },
      autosaveTimer: {
        name: '自动保存'
      },
      lang: {
        name: '语言',
        zh: '简体中文',
        en: '英文',
        de: '德文'
      },
      tabDisplayDesktop: {
        name: '标签显示方式',
        icon: '仅图标',
        text: '仅文字',
        both: '图标和文字'
      },
      tabDisplayMobile: {
        name: '标签显示方式',
        icon: '仅图标',
        text: '仅文字',
        both: '图标和文字'
      },
      relativeUpgradeStats: {
        name: '相对升级数据',
        description: '显示变化值而非前/后值'
      },
      useLegacyFarmSelect: {
        name: '旧农场选择',
        description: '使用旧菜单选择农场中的作物和建筑'
      },
      cloudautosaveTimer: {
        name: '云端自动保存'
      },
      clouduser: {
        name: '云端用户名',
        description: '无需注册，用户名随便写，只要用户名没别人用过即可'
      },
      cloudpwd: {
        name: '云端密码',
        description: '请谨记，用户名和密码不提供找回'
      }
    },
    automation: {
      name: '自动化',
      progressMining: {
        name: '挖掘自动进度限制',
        description: '第一次破碎岩石时，如果破碎需要 X 秒或更短时间，您会自动前进到下一个深度'
      },
      fightHordeBoss: {
        name: '自动战斗部落首领'
      }
    },
    performance: {
      name: '性能',
      upgradeListItems: {
        name: '每页升级数'
      },
      cssShadows: {
        name: '文字阴影',
        0: '无',
        1: '简单',
        2: '光滑'
      },
      particleAmount: {
        name: '粒子数量',
        0: '无',
        1: '减少',
        2: '平均',
        3: '增加'
      },
      recordAutoplay: {
        name: '记录自动播放数据'
      }
    },
    notification: {
      name: '通知',
      position: {
        name: '位置',
        0: '左上',
        1: '顶部',
        2: '右上',
        3: '右下',
        4: '底部',
        5: '左下'
      },
      autosave: {
        name: '自动保存提示'
      },
      backupHint: {
        name: '备份提示',
        0: '关闭',
        1: '稀少',
        2: '平均',
        3: '普通'
      },
      updateCheck: {
        name: '检查更新'
      },
      note: {
        name: '笔记提示'
      },
      achievement: {
        name: '成就提示'
      },
      heirloom: {
        name: '传家宝提示'
      },
      cardPackContent: {
        name: '卡包内容'
      },
      cropReady: {
        name: '作物成熟'
      },
      farmHarvest: {
        name: '农场通知'
      }
    },
    confirm: {
      name: '确认',
      prestige: {
        name: '声望'
      },
      gem: {
        name: '宝石购买'
      },
      eventToken: {
        name: '活动代币购买'
      },
      farmRareResources: {
        name: '稀有农场资源购买'
      },
      treasureDelete: {
        name: '宝藏删除'
      }
    },
      experiment: {
        name: '实验性',
        warning: '这些设置仍处于实验阶段，可能存在错误、未完成、性能不佳或令人困惑。 启用它们的风险由您自行承担，如果您正在使用它们，请留下反馈！ 如果此部分为空，则表示当时没有可用的实验设置，或者您尚未取得足够的进展，无法看到它们',
        layoutSettings: '界面布局设置',
        featureSettings: '功能性设置',
        treasurePreview: {
          name: '宝藏预测',
          description: '显示购买宝藏时可能获得的未来宝藏效果预览'
        },
        cardPackPreview: {
          name: '卡包购买预览',
          description: '显示购买卡包时可能获得的卡片预览'
        },
        mobileHordeLoadoutLayout: {
          name: '手机部落预载新布局',
          description: '在手机和中屏幕下，在部落玩家状态右边显示预载按钮，点击可在玩家容器上方展开预载功能'
        },
        autoUseExamPass: {
          name: '自动使用考试通行证',
          description: '自动使用考试通行证，无需手动点击'
        },
        qutickSchoolExam: {
          name: '秒考100分最棒就是你',
          description: '快速考试，无需等待考试时间'
        },
        dailyCheckIn: {
          name: '每日签到',
          description: '显示每日签到按钮，每天可以签到一次获得随机奖励'
        },
        currencyLabel: {
          name: '显示货币标签',
          description: '显示货币收益和达到容量所需的时间，无需悬停'
        },
        currencynewLabel: {
          name: '新UI标签',
          description: '需要同时开启【显示货币标签】才生效'
        },
        card1newLabel: {
          name: '卡片抽奖显示卡包',
        },
        card2newLabel: {
          name: '声望卡片显示卡包',
        },
        wallpaperPath: {
          name: '壁纸路径',
          description: '设置壁纸路径，支持网络图片'
        },
        wallpaperBlur: {
          name: '壁纸毛玻璃效果',
          description: '调整壁纸的模糊程度，0为无模糊效果，100为最大模糊效果'
        },
        mobileMenuAtBottom: {
          name: '手机菜单移动底部',
          description: '将手机界面的主菜单栏从顶部移动到底部'
        },
        screenLayoutMode: {
          name: '屏幕布局模式',
          description: '设置界面布局大小，自动将根据设备屏幕自动调整，其他选项可以强制使用特定布局尺寸。注意：在手机设备上此设置将无效',
          auto: '自动',
          medium: '中屏幕',
          large: '大屏幕',
          xlarge: '超大屏幕'
        },
        upgradeFilterFeature: {
          name: '升级菜单筛选功能',
          description: '在升级菜单中添加材料筛选功能，方便快速查找所需的升级项目'
        },
        upgradeBuyProgress: {
          name: '升级购买按钮进度条',
          description: '在购买按钮上显示进度条，指示您根据所需材料有多接近能够购买该升级'
        },
        showFarmCropName: {
          name: '显示农场植物名称',
          description: '在农场单元格中显示植物的名称，方便识别不同作物'
        },
        showFarmIconLevel: {
          name: '显示农场植物等级',
          description: '在旧农场植物选择图标上显示等级信息'
        },
        showFarmHarvestNotify: {
          name: '农场收获通知',
          description: '收获农场作物时显示获得的物品通知，批量收获时会显示汇总通知'
        },
        showScientificNotation: {
          name: '显示科学记数法',
          description: '使用科学记数法(如9.73×10^9)代替缩略表示(如9.738B)'
        },
        showFarmOfflineSummary: {
          name: '农场离线汇总',
          description: '在离线汇总页面中显示农场收获预估'
        },
        farmNoGeneBlock: {
          name: '跳过基因阻断',
          description: '跳过基因阻断'
        },
        enableUpgradeQueue: {
          name: '启用升级队列',
          description: '启用升级队列功能，自动处理队列中的升级，点击【已升级】按钮添加'
        },
        bingoPrediction: {
          name: '启用宾果预测和撤销',
          description: '在宾果游戏中启用数字预测功能和点击撤销倍率功能，预测最可能被抽中的数字'
        },
        enablePlayerName: {
          name: '显示玩家名称',
          description: '在部落界面显示自定义玩家名称，或使用默认名称'
        },
        tierProgress: {
          name: '创意进度条',
          description: '显示创意层级的升级进度条'
        },
        canvasPreview: {
          name: '画布预览',
          description: '显示画布解锁预测时间'
        },
        enableMenuShortcuts: {
          name: '菜单栏快捷按钮',
          description: '启用顶部菜单栏的快捷按钮功能，Pc页面才能使用。完美摘抄白神(>▽<)'
        },
        enableSnakeGame: {
          name: '贪吃神秘碎片',
          description: '给部落的神秘碎片加上彩蛋游戏，离线超过10分钟增加神秘碎片保底为1。'
        },
        enableGalleryIdeaReset: {
          name: '灵感重置',
          description: '重置灵感和创意为0，重新开始，冷却时间1天，每轮声望可重置3次。打开开关后需要声望一次才可以使用。'
        }
      }
  },
  statBreakdown: {
    base: '基础值',
    min: '最小值',
    max: '最大值',
    globalLevel: '全局等级',
    prestige: '声望',
    graniteBreaksMult: 'Log10 中断',
    miningTemperature: '温度',
    villageOffering: '供品',
    zoneCleared: '区域已清理',
    zoneClearedTotal: '清除最高区域',
    zone: '区域',
    hordeMaxDifficulty: '难度已通关',
    hordeBasicLoot: '基础战利品',
    hordeItemPermanent: '装备效果',
    hordeMastery: '装备精通',
    hordeRest: '休息',
    hordeNostalgia: '怀旧之情',
    hordeNostalgiaLost: '发现传家宝',
    hordeClassMult: '职业乘数',
    hordeClassLevel: '职业等级',
    hordeBattlePass: '战斗通过',
    hordeEnergy: '能量',
    hordeMana: '法力',
    hordeTime: '时间',
    hordeSacrifice: '牺牲',
    farmEarlyGame: '第一作物',
    galleryCanvas: '画布',
    cards: '卡片',
    cardsShiny: '闪亮卡片',
    treasure: '宝藏',
    debug: '调试',
    bankInvestment: '投资',
    alloying: '合金化',
    miningResin: '树脂',
    cryolab: '冷冻实验室',
    ritualTier: '仪式层级',
    ritualPotionLevel: '药水等级',
    ritualHint: '发现提示',
    ritualIngredient: '奖励成分',
    snowdownRevenge: '复仇',
    interest: '兴趣',
    multiplier: '乘数',
  },

  // Feature specific translations
  mining: {
    mine: '矿井',
    gainSummary: '击打获得 {0}，破碎获得 {1} (x{2})，每秒自动获得 {3}',
    gainSummaryHit: '击打获得 {0}',
    gainSummaryBreak: '破碎获得 {0}',
    depthDweller: '深度居民',
    dweller: {
      title: '当前/最高可能的居民深度',
      description1: '居民初始移动速度较快，越接近极限速度越慢。',
      description2: '当前居民每深入半米，你的声望奖励就会增加。',
      description3: '最高可能的居民深度是矿井最大深度的 {0}%。',
      description4: '最大居民深度',
      descriptionOvercap: '居民达到最高可能深度后可获得额外奖励深度，使声望奖励线性增加。居民速度会降至 {0}%，之后每超过最高可能深度10%，速度再次降至 {0}%',
      nextTime: '预计 {1} 后达到 {0}米'
    },
    pickaxePower: '这是你镐的力量和基础伤害。通过制作更好的镐来提升它。',
    damage: '伤害',
    timeToBreak: '破碎当前岩石所需时间',
    durability: '耐久度',
    durabilityDescription: '破碎这块岩石所需的伤害总量',
    durabilityBreaks: {
      s: '这块岩石已被破碎 {0} 次',
      p: '这块岩石已被破碎 {0} 次'
    },
    toughness: '韧性',
    toughnessDescription: '将受到的伤害减少固定数量',
    toughnessHigh: '韧性正在大幅减少你的伤害',
    toughnessTooHigh: '韧性太高，无法造成任何伤害',
    scrapDescription: '在你摧毁这块岩石至少一次后，每次造成伤害都会获得碎片。 当您摧毁一块岩石时，您将获得 {0}x 的废料奖励',
    scrapNotBroken: '你还没有获得废料，因为这块岩石从未被破碎过',
    oreNotBroken: '您还没有获得矿石，因为这块岩石从未被破碎过',
    oreDescription: {
      short: '可以在 {0}米 或以下找到',
      long: '可以在 {0}米 - {1}米 处找到，如果深度能被 {2} 整除，则可以在以下位置找到'
    },
    rareEarthNotBroken: '你还没有获得稀土，因为这块岩石从未被破碎过',
    rareEarthDescription: {
      granite: '可以在 {0}m 或以下找到已破碎 1000 次或以上的岩石。 每突破 10 次，获得的数量就会翻倍',
      salt: '可以在 {0}m 或以下找到含有 1 个矿石的岩石',
      coal: '可以在每块岩石第一次破碎处的 {0} 米或以下位置找到',
      sulfur: '当撞到最深的岩石时，可以在 {0} 米或以下找到',
      niter: '可以在 {0} 米或以下的地方找到，力量为 10 次岩石破碎',
      obsidian: '如果你的镐没有增强，可以在 {0}m 或以下找到',
      deeprock: '如果当前深度的数字加到14或更高，在{0}m或以下可以找到',
      glowshard: '可以在{0}m或以下找到，每米低于限值0.1%的几率。获得一个需要你挖1米深，这个限制每天减少10%',
    },
    rareEarthNotAffected: '该资源不受稀土增益影响',
    scrapGainHint: '当击打从未破碎过的岩石时，不会产生废料。有时候在当前深度收集更多废料比立即向下挖掘更明智。',
    oreCrafting: '点击矿石将其添加到制作槽中',
    crafting: {
      power: '力量',
      purity: '纯度',
      impurity: '杂质',
      oreQuality: '制作镐所需的矿石量除以矿石品质',
      craftPickaxe: '制作镐',
      purityDescription: '要达到50%的最低品质，你的纯度需要与杂质相匹配。',
      premiumSlot: '这是高级制作槽。高于x1的杂质减半，纯度加倍。',
      minPurity: '制作镐需要至少0.1%的最低品质'
    },
    craftingDescription: '消耗选定的矿石并创建具有随机力量值的新镐。如果它比你当前的镐（{0}力量）更好，就替换它。',
    resinDescription: '每块树脂增加30%的力量和25%的纯度。每个镐制作最多可使用{0}块树脂。',
    smokeDescription: '消耗所有烟雾以创建具有固定力量值的新镐',
    smeltery: '冶炼厂',
    smelteryTemperatureDescription: '达到一定温度可解锁更多冶炼厂。冶炼厂的速度也会随温度每度提升+{0}%',
    smelteryTemperatureDescription2: '由于温度原因，该冶炼厂的速度提升了+{0}%',
    smelterySpeedDescription: '该冶炼厂的基准时间为{0}',
    smelt: '冶炼',
    enhance: '强化',
    enhancement: {
      title: '强化',
      description: '使用金属锭强化你的镐。每种金属锭都有独特的强化效果，可多次应用。但要注意，每次成功强化都会使下一次变得更困难，所以要慎重考虑放置哪些强化。',
      barsDescription: '强化首先需要任意类型的金属锭。这个数量会随每次强化增加。',
      enhancementDescription: '然后，你需要特定类型的金属锭来决定强化类型。这个数量也会随该金属锭类型的每次强化而增加。',
      barAluminium: '轻量化',
      barBronze: '坚固',
      barSteel: '锋利',
      barTitanium: '挖掘机',
      barShiny: '丰产',
      barIridium: '熔岩',
      barDarkIron: '虚空'
    },
    gasGain: {
      0: '打破该层可以获得 ',
      1: '% 该气体 ',
      2: ' ，但如果你已拥有超过 ',
      3: ' ，则无法在该层获得任何收益。'
    },
    beacon: {
      noBeacon: '无信标',
      clickToPlace: '点击放置信标',
      selectToPlace: '选择要放置的信标',
      place: '放置',
      remove: '移除信标',
      removeDescription: '你可以在任何时候移除一个信标，但是你需要等待20个小时才能移除另一个',
      removeCooldown: '等待{0}才能再次移除信标',
      piercing: '穿刺信标',
      rich: '富有信标',
      wonder: '奇迹信标',
      hope: '希望信标',
    },
    anomaly: {
      name: '异常',
      toughness: '这块岩石有100倍的韧性',
    }
  },
  village: {
    job: {
      name: '职业',
      collector: '收集者',
      farmer: '农夫',
      harvester: '收割机',
      miner: '矿工',
      wellWorker: '井工',
      librarian: '图书管理员',
      glassblower: '玻璃工匠',
      entertainer: '艺人',
      lumberjack: '伐木工',
      blastMiner: '爆破矿工',
      fisherman: '渔夫',
      scientist: '科学家',
      gardener: '园丁',
      oilWorker: '石油工人',
      sculptor: '雕塑家',
      explorer: '探险家',
      remoteMiner: '遥控矿车',
    },
    policy: {
      name: '政策',
      taxes: '税收',
      immigration: '移民',
      religion: '宗教',
      scanning: '扫描',
    },
    crafting: {
      unlockNew: '新解锁配方: ',
      owned: '已拥有 {0}',
      changeStat: {
        value: '将数值提升至 {0}',
        timeNeeded: '将制作时间减少至 {0}'
      },
      nextEffect: '下一个制作效果',
      special: {
        description: '特殊工艺品在制作时提供永久加成，其进度不会因声望而重置。每制作一件，成本会增加，且没有里程碑奖励'
      },
      crafts: '{0} / {1} 制作',
      sellEvery: '出售 1 每个 ~{0}',
      sellPrice: '出售价格 (值: {0})',
      rope: '绳子',
      woodenPlanks: '木板',
      brick: '砖块',
      screws: '螺丝',
      waterBottle: '水瓶',
      cocktailGlass: '鸡尾酒杯',
      boomerang: '回旋镖',
      polishedGem: '抛光宝石',
      oilLamp: '油灯',
      shower: '淋浴',
      pouch: '袋子',
      cupboard: '橱柜',
      weight: '哑铃',
      scissors: '剪刀',
      herbTea: '草药茶',
      glasses: '杯子',
      arrows: '箭头',
      bowl: '碗',
      chain: '链',
      spear: '矛',
      goldenRing: '金戒指',
      poisonedArrows: '毒箭',
      frostSpear: '冰霜长矛',
      spicySoup: '麻辣汤',
      stopwatch: '秒表',
      smallChest: '小宝箱',
      bush: '灌木',
      handSaw: '手锯',
      garage: '车库',
      diamondRing: '钻石戒指',
    },
    buildings: '建筑',
    village: '村庄',
    pray: '祈祷',
    unemployed: '未分配',
    unemployedDescription: '未分配的村民不生产资源。请将他们分配到以下职业',
    taxpayers: '纳税人',
    taxpayersDescription1: '所有工作的村民每秒最多消耗每种食物 {0} 单位，并缴纳相当于 {1} 的税款',
    taxpayersDescription2: '每消耗一单位食物。',
    happinessDescription: '幸福度会影响所有资源获取（金币和信仰除外）',
    powerDescription: '每点力量使所有材料和食物获取增加20%。你当前的力量使材料和食物获取乘以 x{0}',
    pollutionDescription: '每点污染会降低幸福度1%。如果污染超过你的容忍度，每超出一点会额外降低幸福度1%。下一点污染将使幸福度降低 {0}%',
    lootDescription: '每当进度条填满时，会发现新的战利品',
    lootRarity: '战利品质量决定了战利品的稀有度分布:',
    lootNeedQuality: '需要超过 {0} 的质量',
    buildingStat: '已建成建筑总数',
    housingStat: '已建成住房总数（每种建筑前25栋）',
    coinNotAffected: '金币不受"所有资源获取"的影响',
    faithNotAffected: '信仰不受"所有资源获取"和"精神资源获取"影响',
    artisanDescription: '工匠可以被指派为你制作物品',
    counterDescription: '柜台可以用来向你的村民出售精心制作的物品',
    offering: {
      name: '供品',
      description: {
        0: '牺牲 ',
        1: ' 获得 ',
        2: ' 并提升供品数量 ',
        3: '/小时'
      },
      sacrifice: '牺牲',
      notUnlocked: '此产品尚未解锁。 您仍然可以花费产品，但不能牺牲，并且在解锁产品之前不会应用资源容量',
      notUnlockedHint: '该产品尚未解锁，因此资源容量尚未适用',
    },
    material: '材料',
    food: '食物',
    mental: '精神资源',
    loot: '掠夺',
    specialIngredient: '特殊成分',
    foodConsume: '消耗高达 {0} 每秒'
  },
  horde: {
    horde: '部落',
    zone: '区域',
    player: '玩家',
    enemy: '敌人',
    loadoutName: '配装名称',
    newLoadout: '新配装',
    noLoadouts: '无配装',
    monsterPartHint: '前往10+区域并击败第101个敌人来解锁新资源！这种资源对于后续进度至关重要，它能帮助你提升骨骼容量。',
    enemyDescription: '同一区域中，每个敌人相比前一个敌人拥有{0}倍攻击力、{1}倍生命值和+{2}%骨骼。当前是第{3}个敌人，拥有{4}倍攻击力、{5}倍生命值和+{6}%骨骼。这些加成效果会在你死亡后重置。',
    enemyDescriptionClasses: '与前一个敌人相比，同一区域的每个敌人都有x{0}攻击，x{1}生命值和+{2}%血值。这是敌人#{3}，攻击力x{4}，生命值x{5}，生命值+{6}%。所有这些效果都会在你死亡时重置。',
    enemySigil1: {
      s: '该区域内的敌人有 {0} 印记',
      p: '该区域内的敌人有 {0} 印记',
    },
    enemySigil2: {
      s: '.',
      p: ', 选择自 {0} 不同种类.',
    },
    damageTypes: {
      title: '伤害类型',
      description: '每次攻击都有三种伤害类型之一。 每种伤害类型所造成和承受的伤害都可以修改。',
      dealt: '造成',
      taken: '受到',
      physic: '物理',
      magic: '魔法',
      bio: '生物武器'
    },
    itemFindDescription: '击败敌人后有几率获得该装备',
    attackDescription: '每次攻击造成的伤害量',
    attackConversion: {
      text: '每秒发生一次常规攻击，伤害分布如下: ',
      physic: '{0}% 物理伤害',
      magic: '{0}% 魔法伤害',
      bio: '{0}% 生物伤害',
      strengthAmp: '每增加一点力量，你的常规攻击伤害提高+{0}%，总计+{1}%。这将使你的常规攻击伤害提高到{2}。'
    },
    healthDescription: '你在死亡前可承受的伤害数量',
    respawnDescription: '你需要多少时间才能从死亡中恢复过来',
    reviveDescription: '使用复活来恢复完全健康，而不是死亡',
    critDescription: '常规攻击有几率造成更高的伤害。 暴击率可以达到100%以上，此时攻击力会成倍增加',
    toxicDescription: '造成的毒伤（生物）伤害等于攻击造成的伤害的百分比',
    divisionShieldDescription: '将你受到的所有伤害除以（师盾 + 1），并在受到攻击后失去 1 个师盾',
    firstStrikeDescription: '如果这是你的第一次攻击，则造成额外魔法伤害',
    spellbladeDescription: '使用装备效果后造成额外魔法伤害。 对于冷却时间低于 10 秒的装备效果，这并不总是有效',
    cuttingDescription: '攻击后对目标当前生命值造成一定百分比的生物伤害',
    recoveryDescription: '杀死敌人后恢复一定百分比的损失生命值',
    defenseDescription: '以你最大生命值的百分比减少伤害',
    executeDescription: '立即杀死敌人，如果他们低于一定的生命值',
    energyDescription: '有些活动需要能量来使用。随着时间的推移，它会自动填充',
    manaDescription: '有些活动需要法力才能使用。随着时间的推移，它会慢慢地重新填充',
    boss: 'Boss',
    miniboss: '小Boss',
    minibossDescription: '小Boss 会代替普通敌人出现，并且更强一些。 他们拥有宝贵的战利品，并且最多可以同时等待 2 个。 击败 1 名也算击败 4 名普通敌人',
    minibossSoul: '小Boss 拥有 {0} 灵魂',
    minibossHeirloom: '小Boss 拥有 {0} 灵魂并有一个 {1}% 的传家宝几率（{2} 怀旧之情）',
    poisonPlayer: '你中毒了，每秒受到 {0} 点伤害',
    poisonEnemy: '该敌人中毒并每秒受到 {0} 点伤害',
    silencePlayer: '你被沉默并且无法使用主动',
    silenceEnemy: '该敌人已被沉默且无法使用主动技能',
    stunPlayer: '你被眩晕并且无法攻击',
    stunEnemy: '该敌人处于眩晕状态，无法攻击',
    shieldbreak: '更快打破分裂盾',
    stunResist: '从眩晕中恢复得更快',
    stunBoss: 'Boss 获得 +2 眩晕抗性',
    stunMiniboss: '小Boss获得 +1 眩晕抗性',
    bossBioResist: 'Boss 只受到 10% 的生物伤害，但是受到 35% 的魔法伤害',
    minibossBioResist: '小 Boss 只受到 50% 的生物伤害，但是受到 10% 的魔法伤害',
    enemyRespawn: '敌人需要 {0} 时间才能重生，最多可以等待 {1} 个敌人。 击败 Boss 后所有敌人都会立即重生',
    bossBonusDifficulty: 'Boss难度',
    bossNoReward: '你可以在任何难度下再次与这个boss战斗，但不会因此获得奖励',
    energyIncompatible: '你当前选择的职业不能使用这个饰品，因为它需要能量',
    manaIncompatible: '你当前选择的职业不能使用这个饰品，因为它需要法力值',
    taunt: {
      title: '嘲讽模式',
      description: '当被嘲讽时，即使没有人在等待，敌人也会继续生成，但所有提前生成的敌人都不会携带战利品。 嘲讽仅在试图接近Boss时有效',
      on: '嘲讽模式已开启',
      off: '嘲讽模式已关闭',
      clickToToggle: '点击切换'
    },
    reachBoss: {
      title: '到达Boss',
      description: '要挑战该区域的Boss，您需要在不死亡的情况下击败 {0} 个敌人'
    },
    fightBoss: {
      title: '打Boss',
      description: '你已经击败了足够多的敌人来挑战这个区域的Boss'
    },
    fleeBoss: {
      title: '逃离Boss',
      description: '逃离这场战斗并继续与普通敌人战斗'
    },
    defeatedBoss: {
      title: 'Boss被击败',
      description: '你已经击败了这个区域的Boss，这让你可以前往下一个区域'
    },
    souls: '灵魂',
    stat: {
      crit: '暴击'
    },
    rampage: {
      name: '横冲直撞',
      description: '与同一个敌人战斗太久，它会生气！ 您已经与这个敌人战斗了 {0}，它每 {1} 就会开始狂暴。',
      effect: '敌人每次狂暴时，都会获得 x{0} 次攻击、+{1}% 暴击几率、+{2}% 暴击伤害、+{3} 眩晕抗性，并且免疫攻击减少效果。',
      effectCurrent: '该敌人已狂暴 {0} 次。 它具有 x{1} 攻击力、+{2}% 暴击几率、+{3}% 暴击伤害和 {4} 眩晕抗性。'
    },
    sigil: {
      name: '印记',
      hasActive: '具有积极作用',
      min: '出现在区域 {0} 或更高区域',
      special: '仅在特殊条件下出现',
      inactive: '未激活',
      power: '力量',
      health: '生命值',
      bashing: '猛击',
      recovery: '恢复',
      toughness: '韧性',
      strength: '力量',
      magic: '魔法',
      magicBolt: '魔法箭',
      fireball: '火球',
      incorporeal: '无形',
      focus: '聚焦',
      wisdom: '智慧',
      sparks: '火花',
      protection: '保护',
      shielding: '屏蔽',
      resistance: '抵抗',
      precision: '精确',
      screaming: '尖叫',
      cure: '治愈',
      sharp: '尖锐',
      spitting: '喷吐',
      burst: '爆裂',
      resilience: '弹力',
      growing: '生长',
      cold: '寒冷',
      fury: '暴怒',
      angelic: '天使',
      toxic: '有毒',
      foulBreath: '口臭',
      nuke: '核弹',
      rainbow: '彩虹',
      drain: '流失',
      shocking: '令人震惊',
      defense: '防御',
      executing: '处决',
      berserk: '狂暴',
      iceGiant: '冰巨人',
      generic: '通用',
    },
    corruption: {
      name: '腐败',
      effects: '效果',
      power: '攻击和生命值 x{0}',
      sigil: '印记 +{0}',
      revive: '复活 +{0}',
      execute: '处决 +{0}%'
    },
    activeCooldown: '主动冷却时间',
    activeBuffFor: 'For {0}:',
    itemsEquipped: '已使用装备槽位数',
    cleared: '已清理',
    fighting: '战斗',
    items: {
      name: '装备',
      usableInStun: '可以在眩晕时使用',
      utilityOvertime: 'CD充满之后，以一半的速度充第二个CD',
      inactive: '不活动的装备效果以正常速度的 {0}% 恢复冷却时间',
      takeEquipped: '携带装备',
      dagger: '匕首',
      shirt: '衬衫',
      guardianAngel: '守护天使',
      milkCup: '一杯牛奶',
      starShield: '星盾',
      longsword: '长剑',
      mace: '狼牙棒',
      boots: '靴子',
      liver: '肝脏',
      fireOrb: '火球',
      campfire: '营火',
      clover: '三叶草',
      snowflake: '雪花',
      oppressor: '压迫者',
      toxin: '毒素',
      corruptEye: '腐败的眼睛',
      meatShield: '肉盾',
      wizardHat: '巫师帽',
      redStaff: '红色杖',
      cleansingSpring: '净化泉',
      marblePillar: '大理石柱',
      rainbowStaff: '彩虹之杖',
      antidote: '解毒剂',
      brokenStopwatch: '坏了的秒表',
      luckyCharm: '幸运符',
      mailbreaker: '邮件破坏者',
      club: '击棍',
      goldenStaff: '金色杖',
      toxicSword: '毒剑',
      scissors: '剪刀',
      cat: '猫',
      healthyFruit: '健康水果',
      glasses: '杯子',
      deadBird: '死鸟',
      shieldDissolver: '护盾溶解器',
      calmingPill: '安神丸',
      cleansingFluid: '洁面液',
      forbiddenSword: '禁忌之剑',
      corruptedBone: '腐烂的骨头',
      plaguebringer: '瘟疫使者',
      forbiddenShield: '禁忌之盾',
      dangerShield: '危险之盾',
      forbiddenToxin: '禁忌毒素',
      glowingEye: '发光的眼睛',
      experimentalVaccine: '实验疫苗',
      microscope: '显微镜',
      moltenShield: '熔火之盾',
      cutter: '美工刀',
      book: '书籍',
      chocolateMilk: '巧克力牛奶',
      bigHammer: '大锤',
      spookyPumpkin: '古怪的南瓜',
      strangeChemical: '奇怪的化学物质',
      forbiddenHeartShield: '禁心之盾',
      cloudStaff: '云杖',
      secretWeapon: '秘密武器',
      bomb: '炸弹',
      leechingStaff: '吸血杖',
      shatteredGem: '破碎的宝石',
      hourglass: '沙漏',
      glue: '胶水',
      firework: '烟花',
      bowTie: '蝴蝶结',
      forbiddenStopwatch: '禁用秒表',
      mysticalAccelerator: '神秘加速器',
      blazingStaff: '炽热之杖',
      shield: '护盾',
      armor: '护甲',
      natureStone: '自然之石',
      evergrowingVine: '常生藤',
      energyDrink: '能量饮料',
      dragonheart: '龙心',
      prism: '棱镜',
      deathsword: '死亡之剑',
      needle: '针',
      mine: '矿山',
      maskOfJoy: '欢乐面具',

      // Chess pieces
      pawn: '士兵',
      knight: '骑士',
      bishop: '主教',
      rook: '骗子',
      queen: '女王',
      king: '国王'
    },
    active: {
      damagePhysic: {
        0: '造成',
        1: '物理伤害'
      },
      damageMagic: {
        0: '造成',
        1: '魔法伤害'
      },
      damageBio: {
        0: '造成',
        1: '生物伤害'
      },
      maxdamagePhysic: {
        0: '造成',
        1: '敌人生命值的物理伤害'
      },
      maxdamageMagic: {
        0: '造成',
        1: '敌人生命值的魔法伤害'
      },
      maxdamageBio: {
        0: '造成',
        1: '敌人生命值的生物伤害'
      },
      heal: {
        0: '回复',
        1: '生命值'
      },
      bone: {
        0: '获得',
        1: '最高区域骨头'
      },
      blood: {
        0: '获得',
        1: '最高难度血液'
      },
      monsterPart: {
        0: '获得',
        1: '最高区域怪物零件'
      },
      stun: {
        0: '击晕对手',
        1: ''
      },
      silence: {
        0: '沉默对手',
        1: ''
      },
      revive: {
        0: '重新填充',
        1: '恢复'
      },
      removeAttack: {
        0: '移除',
        1: '来自对手的攻击'
      },
      poison: {
        0: '应用',
        1: '药水'
      },
      antidote: {
        0: '移除',
        1: '中毒效果'
      },
      permanentStat: {
        0: '提高 ',
        2: ' ',
        1: '(直到声望)'
      },
      gainStat: {
        0: '永久增加 ',
        2: ' ',
        1: ''
      },
      divisionShield: {
        0: '获得',
        1: '分裂盾'
      },
      removeDivisionShield: {
        0: '移除',
        1: '来自对手的分裂盾'
      },
      executeKill: {
        0: '击杀一个敌人低于',
        1: '生命值'
      },
      refillEnergy: {
        0: '恢复',
        1: '能量'
      },
      refillMana: {
        0: '恢复',
        1: '法力'
      },
      buff: {
        duration: '增益持续时间',
        suffix: '(增益)',
      },
      canCrit: '能以{0}%的效率暴击',
      canCritDiff: '激活暴击效率',
      reviveAll: '恢复所有生命值',
      removeStun: '移除眩晕',
    },
    heirloom: {
      name: '传家宝',
      min: '出现在区域 {0} 或更高区域',
      special: '不会出现在普通小Boss身上',
      description: '传家宝是强大的神器，可以从小Boss那里找到并永远保留。 到达更高的区域以找到更多类型',
      descriptionTower: '传家宝是强大的神器，每 {0} 层都可以找到并永久保留。 到达更高的区域或不同的塔楼以找到更多类型',
      descriptionDouble: '数量最低的传家宝被给予的可能性是前者的两倍。 如果您有多件传家宝数量最低，则此规定不适用。',
      descriptionNostalgia: '怀旧之情会增加您找到传家宝的机会。 在怀旧之情的帮助下找到一个可以消除 1 怀旧之情，直到你的下一个声望',
      power: '力量',
      fortitude: '坚韧',
      wealth: '财富',
      spirit: '精神',
      sharpsight: '锐视',
      reaping: '收割',
      remembrance: '纪念',
      holding: '保持',
      expertise: '经验值',
      mystery: '神秘',
      brick: '砖',
      heat: '热',
      ice: '冰',
      crystal: '水晶',
      vitality: '活力',
    },
    itemMastery: {
      name: '精通',
      description: '装备此装备击败 {0} 区或更高区域的Boss或小Boss，即可获得精通点数。 更高的区域Boss可以获得更多的精通点。',
      gain: '从该区域的 Boss 处获得 {0} 精通点，并从小 Boss 处获得该值的 {1}% ({2})',
      bonuses: '提高你的精通等级来解锁该装备的奖励',
      current: '该装备拥有 {0} / {1} 精通点',
      1: '声望后保留装备',
      2: '添加了禁用主动装备的选项，使被动效果提高 +{0}%',
      3: '声望后保留装备等级',
      4: '主动冷却时间减半，禁用主动冷却时间会增加 +{1}%，而不是 +{0}%',
      5: '最多可以收集 {0} 个神秘碎片。 每次精通此值都会增加 {1}'
    },
    tower: {
      name: '塔楼',
      description: '塔楼是需要塔楼钥匙才能进入的特殊场所。 你可以与敌人战斗，争夺王冠和独特的传家宝，直到死去。 到达特定楼层即可永久解锁新奖励',
      zoneDescription: '位于您到达的最高楼层的这座塔中的敌人大约与 {0} 区敌人一样强大。 他们以 {1} 区敌人的力量开始，并在每层获得相当于 {2} 区的属性。',
      floorTitle: '最高层被击败',
      floorDescription: '击败某些楼层的敌人即可解锁永久奖励：',
      rewardTitle: '奖励',
      rewardDescription1: '每击败一个敌人获得 {0} 皇冠',
      rewardDescription2: '敌人每 {0} 层都会提供传家宝，有些传家宝是这座塔独有的:',
      keyDescription: '解锁新塔楼时获得 {0} 个塔楼钥匙，每周获得 1 个塔楼钥匙（下一个在 {1}）',
      enter: '进入',
      enterCost: '需要',
      floor: '层 {0}',
      brick: '砖塔',
      fire: '火塔',
      ice: '冰塔',
      danger: '危险塔',
      toxic: '毒塔',
    },
    classes: {
      skill: '技能',
      skillPointsLeft: '{0} 剩余技能点',
      skillPointCost: '需要 {0} 技能点以升级',
      skillTreeChoice: '在这里你可以做出选择，选择其中一种技能将锁定其他路径',
      adventurer: {
        name: '冒险家',
        description: '一个多才多艺的战士，可以处理任何情况'
      },
      archer: {
        name: '射手',
        description: '远程战斗机，专注于暴击和持续伤害'
      },
      mage: {
        name: '法师',
        description: '使用法术快速对付敌人并允许自动施放的战士'
      },
      knight: {
        name: '骑士',
        description: '一个持久的战士，慢慢地击倒对手，但可以对付强大的敌人'
      },
      assassin: {
        name: '刺客',
        description: '敏捷的战士，专注于快速杀死敌人'
      },
      shaman: {
        name: '萨满',
        description: '依附于自然的战士，利用治疗和毒药赢得战斗'
      },
      pirate: {
        name: '海盗',
        description: '海盗可能不是最好的战士，但擅长抢劫'
      },
      undead: {
        name: '不死',
        description: '以优势兵力弥补劣势的弱小战士'
      },
      cultist: {
        name: '信徒',
        description: '一个多才多艺的战士，一次只擅长一项任务'
      },
      scholar: {
        name: '学者',
        description: '帮助其他阶级的支持性斗士'
      }
    },
    battlePass: {
      name: '战斗通行证',
      quest: {
        stat: '达到 {0} {1}',
        zone: '清理 {0} 区域 {1}',
        level: '达到等级 {0}',
        boss: '击败 {0} (+{1})'
      },
      statType: {
        base: '基础 {0}',
        total: '总计 {0}',
      }
    },
    enemyName: {
      soldier: '士兵',
      officer: '警务人员',
      hunter: '猎人',
      sniper: '狙击手',
      strongMonkey: '强壮的猴子',
      angryMonkey: '愤怒的猴子',
      dartMonkey: '飞镖猴',
      monkeyWizard: '猴子巫师',
      monkeyDefender: '猴子卫士',
      monkeyMonk: '猴僧',
      puppy: '小狗',
      kitten: '小猫',
      seal: '海豹',
      piglet: '小猪',
      panda: '熊猫',
      koala: '考拉',
      rabbit: '兔子',
      guineaPig: '豚鼠',
    },
    bossName: {
      ohilio_guard1: '警卫 A',
      ohilio_guard2: '警卫 B',
      ohilio: 'ohilio',
      chriz1: 'Chriz',
      chriz2: 'Chriz',
      mina: 'mina',
    },
    area: {
      zoneEndless: '无尽区域',
      zoneBoss: 'Boss ({0})',
      zone: '区域 {0}',
      difficulty: '{0} 难度',
      enemyAmount: '{0} 敌人在此区域',
      warzone: '战场',
      monkeyJungle: '猴子丛林',
      loveIsland: '爱岛',
    },
    sign: {
      sign_1: {
        text: '我的瞄准很准，从不失手!你最好小心点!',
        signed: 'ohilio',
      },
      sign_2: {
        text: '你以为你能伤害我吗?从来没有!我会躲避一切，你连打我都打不到!休想碰我!',
        signed: 'ohilio',
      },
      sign_3: {
        text: '我是最伟大的，最好的，完美的，不可战胜的!连我的守卫都比不上我!你觉得你有机会打败我吗?哈!准备去死吧!',
        signed: 'ohilio',
      },
      sign_4: {
        text: '仔细观察这些可爱的动物后，你会发现它们不是真的。他们不过是些空话而已!但他们为什么在这里?让你难受?没有时间去想它，你需要战斗来克服这些动物精神',
        signed: '???',
      },
    },
    quest: {
      name: '任务',
      description: '完成任务来推进你的战斗通行证和解锁永久奖励',
      completed: '{0} 已完成',
      allCompleted: '任务已全部完成',
    },
    trinket: {
      rarity: {
        0: '无主',
        1: '普通',
        2: '罕见',
        3: '稀有',
        4: '史诗',
        5: '传说',
        6: '神话',
        7: '非凡',
        8: '辐射',
        9: '棱镜',
        10: '终极',
        timeless: '永恒'
      },
      equipped: '饰品已选择 (声望后装备)',
      vitality: '活力',
      energy: '能量',
      magic: '魔法',
      fists: '拳头',
      sparks: '火花',
      haste: '急速',
      precision: '精确',
      wrath: '愤怒',
      strength: '力量',
      toxins: '毒素',
      wisdom: '智慧',
      extraction: '提取',
      learning: '学习',
      preservation: '维持',
      energize: '激励',
      automation: '自动化',
      cure: '治愈',
      duality: '二元性',
      love: '爱',
    },
    sacrifice: {
      name: '牺牲',
      description: '在这里，你可以暂时牺牲装备插槽来换取强大的奖励'
    }
  },
  farm: {
    farm: '农场',
    unlockSeed: '解锁种子',
    experience: '经验值',
    expToLevelUp: '还需收获{0}次才能升级',
    yield: '产量',
    rareDrops: '稀有掉落',
    huntedRareDrops: '已猎获的稀有资源',
    addRareDrop: '增加稀有掉落 ({0})',
    addRareDropAmount: '{0} 数量',
    prestige: {
      description: '当作物达到4级时，你可以对其进行声望，将声望等级提高到当前等级以获得奖励。这会重置该作物的所有经验、等级和基因。每个声望等级会使所有作物增益乘以1.04倍。',
      current: '你当前的声望等级为{0}，使所有农作物收益乘以{1}倍。',
      next: '对此作物进行声望可将你的声望等级提高{0}级。这会将你的总声望等级提高到{1}，使你的农作物收益增加到{2}倍。',
      nextNoEffect: '你的等级不高于该作物的声望等级。声望不会增加你的声望等级，但仍会重置等级和基因。',
      cropOnField: '你现在无法进行声望，因为这种作物已经在田地中种植',
      increasedGLRequirement: '升到10级后，农作物每升1级才会增加全局等级',
    },
    button: {
      plantAll: '在所有空地块上种植选定的作物 ({0})。 您还可以通过单击空地块来种植单一作物',
      replant: '所有生长的作物都被收获并再次种植在同一块地块上',
      replantFertilizer: '也将使用相同的肥料（如果可能）',
      harvestAll: '所有生长的农作物均已收获。 您还可以通过单击来收割单一作物',
      delete: '从地块上移除作物。 消耗的资源不予退还',
      deleteBuilding: '建筑物也可以通过这种方式移除并返回到您的库存中',
      color: '地块可以着色，以便更轻松地管理大片土地。 选择一种颜色并单击地块来绘制它。 当您选择颜色时，批量操作仅影响相同颜色的地块',
      colorFilter: '仅影响该颜色的地块',
    },
    timeDescription: '成长所需时间',
    overgrowDescription: '完全生长后，您的植物可以再次生长，但需要 {0}x (1 / 过度生长 + 1)x 时间才能生长。 每个完成的生长周期都算作一次额外的收获，具有所有好处。',
    fertilizerCostDescription: '每种作物所需肥料',
    goldChance: '黄金几率',
    goldChanceDescription: '根据农作物的生长时间和放置的花园侏儒的数量，收获植物有机会获得黄金',
    goldChanceMultiple: '超过 100% 的金币几率仍然会增加金币收益，保证您找到 {0} 个金币，并且有 {1}% 的机会再找到 1 个金币',
    goldChanceWarning: '在地块上放置一个花园侏儒即可开始寻找黄金',
    freeUpgrades: {
      s: '基因剩余',
      p: '基因剩余'
    },
    fertilizerCannotBeBought: '无法购买',
    crop: {
      carrot: '胡萝卜',
      blueberry: '蓝莓',
      wheat: '小麦',
      tulip: '郁金香',
      potato: '土豆',
      raspberry: '覆盆子',
      barley: '大麦',
      dandelion: '蒲公英',
      corn: '玉米',
      watermelon: '西瓜',
      rice: '大米',
      rose: '玫瑰',
      leek: '韭菜',
      honeymelon: '蜜瓜',
      rye: '黑麦',
      daisy: '雏菊',
      cucumber: '黄瓜',
      grapes: '葡萄',
      hops: '啤酒花',
      violet: '紫罗兰',
      goldenRose: '金玫瑰',
      sweetPotato: '红薯',
      strawberry: '草莓',
      sesame: '芝麻',
      sunflower: '向日葵',
      spinach: '菠菜',
    },
    gene: {
      name: '基因',
      pickLevel: '选择级别 {0} 的基因',
      dnaDescription: '当这种作物达到新的等级时，你就会获得 DNA，并可以将其用于基因升级。 下一个作物等级提供 {0} DNA',
      dnaDuplicate: '您选择的基因不会出现在您的下一个声望中。 不挑选基因可以在下一个声望中使用所有 4 个基因',
      dnaBlocked: '阻断的基因',
      hasUpgrade: '有基因升级',
      lockOnField: '这种基因不能在田里与这种作物一起采摘',
      basics: '基础',
      yield: '产量',
      gold: '黄金',
      exp: '经验值',
      rareDrop: '稀有掉落',
      grow: '生长',
      overgrow: '过度生长',
      giant: '巨人',
      grass: '草',
      dna: 'DNA',
      gnome: '侏儒',
      lonely: '孤独',
      fertile: '肥沃',
      mystery: '神秘',
      conversion: '转换',
      prestige: '声望',
      rareDropChance: '发现',
      lucky: '幸运',
      finalize: '敲定',
      selfless: '无私',
      unyielding: '不屈',
      teamwork: '团队合作',
      hunter: '猎人',
      patient: '病人',
    },
    fertilizerEffect: {
      vegetable: '仅蔬菜',
      berry: '仅浆果',
      grain: '仅粮食',
      flower: '仅鲜花'
    },
    building: {
      premium: '高级 {0}',
      premiumOwned: '高级: {0} 已拥有',
      owned: '{0} 已拥有',
      gardenGnome: {
        name: '花园侏儒',
        description: '当花园侏儒放置在田野上时，田野上的农作物可能会在收获时产生黄金。 几率取决于作物的生长时间。',
        descriptionPremium: '当花园侏儒放置在田野上时，田野上的农作物可能会在收获时产生黄金。 根据作物生长时间，几率加倍。',
      },
      sprinkler: {
        name: '洒水装置',
        description: '同一行中的农作物生长速度加快 50%，并且过度生长 +150%',
        descriptionPremium: '同一行中的农作物生长速度加快 100%，并且过度生长 +300%',
      },
      lectern: {
        name: '讲台',
        description: '同一列作物给予三倍经验',
        descriptionPremium: '同一列中的农作物可提供五倍经验',
      },
      pinwheel: {
        name: '风车',
        description: '周围 8 格中每种独特农作物的掉落几率增加 +0.015x',
        descriptionPremium: '周围 8 格中每种独特农作物的掉落几率增加 +0.03x',
      },
      flag: {
        name: '旗帜',
        description: '如果作物位于与旗帜相关的正确位置，则作物增益增加 +50%。 蔬菜：左上，浆果：右上、谷物：左下、花：右下',
        descriptionPremium: '如果作物位于与旗帜相关的正确位置，则作物增益增加 +100%。 蔬菜：左上，浆果：右上、谷物：左下、花：右下',
      }
    }
  },
  gallery: {
    gallery: '画廊',
    auction: '拍卖会',
    colorSuffix: '颜色',
    openPackage: '开启',
    colorGainReduced: '超过100种颜色后，额外增益将降低为平方根',
    drumCompounding: '要找到这个鼓，你必须在同一包装中找到所有前置颜色的鼓。这会降低找到该鼓的实际概率',
    allConverterInfo: '转换颜色时会消耗所有转换器',
    converterOverload: '你的转换器数量远超颜色数量，获得{0}倍转换收益',
    idea: {
      tier: '层 {0} 创意',
      unlock: '解锁创意',

      makeItPretty: '让它变得漂亮',
      stompBerries: '踩碎浆果',
      carvePumpkins: '雕刻南瓜',
      sortWaste: '垃圾分类',
      advertise: '广告宣传',
      beImpatient: '缺乏耐心',
      beExcited: '感到兴奋',

      makeLemonade: '制作柠檬水',
      growATree: '种植一棵树',
      buildComposter: '建造堆肥机',
      observeRainbow: '观察彩虹',
      buildRedReservoir: '建造红色储备',
      orderMassiveSafe: '订购大型保险箱',
      buyPen: '购买钢笔',

      drawOcean: '画海洋',
      makeWine: '酿酒',
      calculateOdds: '计算胜算',
      buildOrangeReservoir: '建造橙色储备',
      thinkHarder: '更加努力地思考',
      paintFaster: '涂得更快',
      buyBrush: '购买画刷',

      harvestOranges: '收获橙子',
      pulverizeGold: '粉碎黄金',
      buildYellowReservoir: '建造黄色储备',
      paintForFun: '为了乐趣而作画',
      printNewspaper: '印刷报纸',
      expandCanvas: '扩大画布',
      hyperfocus: '高度专注',

      cutGrass: '割草',
      shapeClay: '形状粘土',
      buildGreenReservoir: '建造绿色储备',
      beMysterious: '保持神秘',

      lookAtTheSky: '看看天空',
      chewBubblegum: '嚼泡泡糖',
      buildBlueReservoir: '建造蓝色储备',
    },
    nextInspiration: {
      0: '获得下一个 ',
      1: ' 还要 '
    },
    shapes: {
      name: '形状',
      upgrades: '形状升级',
      description: '将一个形状拖到相邻的形状上以切换位置，或单击一个形状以收集它。收集需要连接5个相同类型的形状，每个形状获得的形状数量等于收集组合。',
      cost: '每个行动的成本',
      special: {
        name: '特殊形状',
        description: '特殊形状有{0}%的几率出现，而不是普通形状，特殊集合给出{1}x个形状。网格上只能有一种特殊形状',
        bomb: '所有+形的形状都是特别收集的',
        dice: '所有与上面(或下面)的形状不匹配的形状将被重洗',
        accelerator: '周围的8个形状是特别收集的。如果这8个都是一样的，那就用所有的动机去获得更多的形状',
        sparkles: '如果可能的话，4个直接相邻的形状被规则地收集起来，算作一个大组合',
        hourglass: '立即获得转换器和包装，收集形状以增加时间',
        chest: '特别收集10个附近的形状，8个周围的形状和左右的形状。如果所有10个形状都不相同，则获得特殊奖励，并在其根值处再次应用特殊形状乘数'
      },
      buyFor: {
        0: '购买',
        1: '花费'
      },
      reroll: '重洗整个网格花费',
      unlock: '解锁形状: {0}',
      circle: '圆圈',
      rectangle: '矩形',
      triangle: '三角形',
      star: '星形',
      ellipse: '椭圆',
      heart: '心形',
      square: '正方形',
      octagon: '八边形',
      pentagon: '五边形',
      hexagon: '六边形',
      bomb: '炸弹',
      dice: '骰子',
      accelerator: '加速器',
      sparkles: '闪光',
      hourglass: '沙漏',
      chest: '宝箱',
    },
    canvas: {
      name: '画布',
      description: '把颜色放在画布上，慢慢提高他们的画布等级，给你永久的奖励',
      level: '画布等级',
      untilNextLevel: '{0} 到达下一级'
    }
  },
  gem: {
    newGemsTime: '每次进度条填满时都会获得新的宝石。 生成器创建新宝石每 {0}.',
    newGemsTimeAchievement: '每次进度条填满时都会获得新的宝石。 每项成就都会使生成速度提高 +{0}%。 您的 {1} 成就将生成速度提高了 +{2}%，从 {3} 提高到了 {4}。'
  },
  achievement: {
    relicReward: '此圣遗物是在完成此成就的下一级时作为奖励而给予的。',
    secret: '这项成就是秘密的，不提供任何奖励。'
  },
  treasure: {
    effectSummary: '效果总结',
    tier: '层',
    tierItem: '层 {0} 宝藏',
    tierEffect: {
      globalLevel: '你的全局等级增加了宝藏层级和获得更高层级宝藏的机会。',
      upgrade: '升级成本',
      destroy: '碎片当被摧毁时',
      regular: '普通效果',
      special: '特殊效果'
    },
    buyFragment: {
      0: '购买碎片 (',
      1: ') 花费'
    },
    buyTreasure: '获得具有随机等级和效果的宝藏',
    upgradeDescription: '使用碎片升级宝藏。 碎片成本取决于宝藏的层级和等级。',
    destroyDescription: '摧毁宝藏即可根据宝藏层级获得碎片。 所有用于升级该宝藏的碎片也将被返还。'
  },
  relic,
  card
}
