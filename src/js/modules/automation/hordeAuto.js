import store from "../../../store";

class HordeAutomation {
  constructor() {
    this.isRunning = false;
    this.config = {
      targetZone: 100,
      equipmentLoadout: null,
      prestigeAfterReaching: true,
      autoUseSkills: true,
      autoUpgradeItems: true,
    };
    this.currentState = 'idle';
    this.timerId = null;
    this.equipmentInProgress = false;
    this.prestigeInProgress = false;
    
    this._equipTimeout = null;
    this._prestigeTimeout = null;
    this._lastCheckTime = 0;
    this._lastBossCheckTime = 0;
    
    // 从 store 加载状态
    this.loadStateFromStore();
  }

  // 从 store 加载状态
  loadStateFromStore() {
    const savedState = store.state.horde.hordeAutomation;
    if (savedState) {
      this.isRunning = savedState.isRunning;
      this.config = savedState.config || this.config;
      this.currentState = savedState.currentState || 'idle';
      
      // 如果正在运行，重新启动定时器
      if (this.isRunning) {
        this.startTimer();
      }
    }
  }

  // 保存状态到 store
  saveStateToStore() {
    store.dispatch('horde/saveAutomationState', {
      isRunning: this.isRunning,
      config: this.config,
      currentState: this.currentState,
      startTime: Date.now(),
    });
  }

  startTimer() {
    if (this.timerId) {
      clearInterval(this.timerId);
    }
    
    this.timerId = setInterval(() => {
      try {
        this.tick();
      } catch (e) {
        console.error('[HordeAuto] 运行错误:', e);
        this.stop();
      }
    }, 1000);
  }

  start() {
    if (this.isRunning) {
      return;
    }
    
    this.isRunning = true;
    this.currentState = 'starting';
    this.equipmentInProgress = false;
    this.prestigeInProgress = false;
    this._lastBossCheckTime = Date.now();
    store.dispatch('horde/unequipAll');
    
    this.startTimer();
    this.saveStateToStore();
    
    try {
      this.tick();
    } catch (e) {
      console.error('[HordeAuto] 初始运行错误:', e);
      this.stop();
    }
  }

  stop() {
    this.isRunning = false;
    this.currentState = 'idle';
    this.equipmentInProgress = false;
    this.prestigeInProgress = false;

    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }

    this.saveStateToStore();
  }

  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    this.saveStateToStore();
  }

  performChecks() {
    const now = Date.now();

    if (now - this._lastCheckTime < 1000) {
      return;
    }
    this._lastCheckTime = now;
    this.checkUpgrades();
    this.checkSkills();
    this.checkEquipment();
    this.checkBoss();
  }

  checkUpgrades() {
    if (!this.config.autoUpgradeItems) {
      return;
    }
    
    const upgradeItems = store.state.upgrade.item || {};
    
    const gemHordeUpgrades = [
      'horde_balance',
      'horde_wrath',
      'horde_peace',
      'horde_milk',
      'horde_butcher',
      'horde_beginnerLuck',
      'horde_advancedLuck',
      'horde_boneTrader',
      'horde_soulCage',
      'horde_offenseBook',
      'horde_defenseBook',
      'horde_candleCircle',
      'horde_ashCircle',
      'horde_containmentChamber',
      'horde_mausoleum',
      'horde_lastWill',
      'horde_combatStudies',
      'horde_boneChamber',
      'horde_deepHatred',
      'horde_spiritLure',
      'horde_mysticalCondenser',
      'horde_precision',
      'horde_resolve',
      'horde_determination',
      'horde_education',
      'horde_bloodChamber',
      'horde_stoneSkin',
      'horde_university',
      'horde_discovery',
      'horde_innerFocus',
      'horde_purge',
      'horde_chaosCrate',
      'horde_royalSword',
      'horde_royalArmor',
      'horde_royalStorage',
      'horde_royalButcher',
      'horde_royalCrypt',
      'horde_royalSecret',
      'horde_morePower',
      'horde_moreBones',
      'horde_moreMonsterParts',
      'horde_moreSouls',
      'horde_moreMastery',
      'horde_ancientPower',
      'horde_ancientFortitude',
      'horde_ancientWealth',
      'horde_ancientSpirit',
      'horde_ancientSharpsight',
      'horde_ancientReaping',
      'horde_ancientRemembrance',
      'horde_ancientHolding',
      'horde_ancientExpertise',
      'horde_ancientMystery',
      'horde_bookTraining',
      'horde_bookLuckyStrike',
      'horde_bookLooting',
      'horde_bookSurvivalGuide',
      'horde_bookCarving',
      'horde_bookWhitePaint',
    ];
    
    for (const [key] of Object.entries(upgradeItems)) {
      if (!key.startsWith('horde_')) {
        continue;
      }

      if (gemHordeUpgrades.includes(key)) {
        continue;
      }

      const feature = 'horde';
      const name = key.split('_').slice(1).join('_');
      
      if (store.getters['upgrade/canAfford'](feature, name)) {
        try {
          store.dispatch('upgrade/buyMax', { feature, name });
        } catch (e) {
          // 忽略错误
        }
      }
    }
  }

  checkSkills() {
    if (!this.config.autoUseSkills) {
      return;
    }
    
    const state = store.state;
    if (!state.horde) {
      return;
    }
    
    const allSkills = [];
    
    if (state.system.features.horde.currentSubfeature === 1) {
      const selectedClass = state.horde.selectedClass;
      const fighterClass = state.horde.fighterClass[selectedClass];
      const skillLevel = state.horde.skillLevel || {};
      
      for (const [skillName, skillInfo] of Object.entries(fighterClass.skills || {})) {
        if (skillInfo.type === 'active' && (skillLevel[skillName] || 0) > 0) {
          allSkills.push(`skill_${skillName}`);
        }
      }
      
      for (const [trinketName, trinketInfo] of Object.entries(state.horde.trinket || {})) {
        if (trinketInfo.equipped && trinketInfo.isActive && trinketInfo.activeType !== null) {
          allSkills.push(`trinket_${trinketName}`);
        }
      }
    } else {
      for (const [itemName, itemInfo] of Object.entries(state.horde.items || {})) {
        if (itemInfo.equipped && !itemInfo.passive) {
          allSkills.push(itemName);
        }
      }
    }
    
    for (const skillKey of allSkills) {
      try {
        store.dispatch('horde/useActive', skillKey);
      } catch (e) {
        // 忽略错误
      }
    }
  }

  checkEquipment() {
    const state = store.state;
    if (!state.horde) {
      return;
    }
    
    if (this.equipmentInProgress) {
      //console.log(`[HordeAuto] ${new Date().toLocaleString('zh-CN', {day: '2-digit', hour: '2-digit', minute: '2-digit'})} 装备操作正在进行中，跳过检查`);
      return;
    }
    
    let loadoutName = this.config.equipmentLoadout;
    if (!loadoutName && state.horde.selectedLoadout) {
      loadoutName = state.horde.selectedLoadout;
    }
    
    if (!loadoutName || !state.horde.loadout || !state.horde.loadout[loadoutName]) {
      console.log(`[HordeAuto] ${new Date().toLocaleString('zh-CN', {day: '2-digit', hour: '2-digit', minute: '2-digit'})} 未找到有效的装备配置`);
      return;
    }
    
    const maxEquipped = store.getters['mult/get']('hordeMaxItems');
    
    const equippedItems = [];
    for (const [itemId, item] of Object.entries(state.horde.items)) {
      if (item.equipped) {
        equippedItems.push(itemId);
      }
    }
    
    const hasEmptySlots = equippedItems.length < maxEquipped;
    
    //console.log(`[HordeAuto] ${new Date().toLocaleString('zh-CN', {day: '2-digit', hour: '2-digit', minute: '2-digit'})} 当前已装备: ${equippedItems.length}/${maxEquipped}`);
    
    if (hasEmptySlots) {
      //console.log(`[HordeAuto] ${new Date().toLocaleString('zh-CN', {day: '2-digit', hour: '2-digit', minute: '2-digit'})} 应用装备配置: ${loadoutName}`);
      
      this.equipmentInProgress = true;
      
      store.dispatch('horde/equipLoadout', loadoutName);

      this._equipTimeout = setTimeout(() => {
        console.log(`[HordeAuto] ${new Date().toLocaleString('zh-CN', {day: '2-digit', hour: '2-digit', minute: '2-digit'})} 装备操作完成`);
        this.equipmentInProgress = false;
        this._equipTimeout = null;
      }, 2000);
    }
  }

  checkBoss() {
    const now = Date.now();
    if (now - this._lastBossCheckTime < 60000) {
      return;
    }
    
    this._lastBossCheckTime = now;
    
    const state = store.state;
    if (state.horde.bossAvailable && state.horde.bossFight === 0) {
      console.log(`[HordeAuto] ${new Date().toLocaleString('zh-CN', {day: '2-digit', hour: '2-digit', minute: '2-digit'})} 检测到 boss 可用，开始战斗`);
      store.dispatch('horde/fightBoss');
    }
  }

  tick() {
    if (!this.isRunning) {
      return;
    }

    if (!document.hidden) {
      const state = store.state;
      const currentZone = state.horde.zone;
      const isFighting = state.horde.enemyTimer > 0 || state.horde.enemy !== null;
      const canPrestige = state.unlock.hordePrestige?.use || false;
      const maxZone = state.stat.horde_maxZone.value; // 在函数开头声明一次

      if (this.currentState === 'idle') {
        this.stop();
        return;
      }

      this.performChecks();

      switch (this.currentState) {
        case 'starting':
          if (this.config.equipmentLoadout && state.horde.loadout && state.horde.loadout[this.config.equipmentLoadout]) {
            const loadoutObj = state.horde.loadout[this.config.equipmentLoadout];
            this.loadoutItems = loadoutObj && loadoutObj.content ? loadoutObj.content : [];
          }

          if (currentZone < maxZone) {
            store.dispatch('horde/updateZone', maxZone);
          }

          if (currentZone >= this.config.targetZone && this.config.prestigeAfterReaching && canPrestige) {
            this.currentState = 'prestiging';
            return;
          }

          if (currentZone < this.config.targetZone) {
            this.currentState = 'fighting';
          } else {
            this.currentState = 'idle';
            this.stop();
          }
          break;

        case 'fighting':
          if (currentZone >= this.config.targetZone) {
            if (this.config.prestigeAfterReaching && canPrestige) {
              this.currentState = 'prestiging';
            } else {
              this.currentState = 'idle';
              this.stop();
            }
            return;
          }

          if (currentZone < maxZone) {
            store.dispatch('horde/updateZone', maxZone);
          }

          if (!isFighting) {
            const nextZone = Math.min(currentZone + 1, this.config.targetZone);
            store.dispatch('horde/updateZone', nextZone);
          }
          break;

        case 'prestiging':
          if (this.prestigeInProgress) {
            return;
          }
          
          console.log(`[HordeAuto] ${new Date().toLocaleString('zh-CN', {day: '2-digit', hour: '2-digit', minute: '2-digit'})} 执行声望操作`);
          this.prestigeInProgress = true;
          
          try {
            store.dispatch('horde/prestige', 0);
          } catch (error) {
            try {
              store.dispatch('prestige/execute', {feature: 'horde', subfeature: 0});
            } catch (fallbackError) {
              console.error('[HordeAuto] 声望操作失败:', fallbackError);
              this.currentState = 'idle';
              this.prestigeInProgress = false;
              this.stop();
              return;
            }
          }
          
          this._prestigeTimeout = setTimeout(() => {
            this.currentState = 'fighting';
            this.prestigeInProgress = false;
            this._prestigeTimeout = null;
          }, 1500);
          
          break;

        default:
          this.currentState = 'idle';
          break;
      }
    }
  }

  getStatus() {
    return {
      isRunning: this.isRunning,
      currentState: this.currentState,
      config: this.config,
    };
  }
}

const hordeAutomation = new HordeAutomation();

export default hordeAutomation;
