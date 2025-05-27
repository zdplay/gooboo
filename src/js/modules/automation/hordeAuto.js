import store from "../../../store";

class HordeAutomation {
  constructor() {
    this.isRunning = false;
    this.config = {
      targetZone: 100,
      equipmentLoadout: null,
      prestigeAfterReaching: true,
    };
    this.currentState = 'idle';
    this.timerId = null;
    this.equipmentInProgress = false;
    this.prestigeInProgress = false;
    
    this._equipTimeout = null;
    this._prestigeTimeout = null;
    this._lastCheckTime = 0;
  }

  start() {
    if (this.isRunning) {
      return;
    }
    
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    
    this.equipmentInProgress = false;
    this.prestigeInProgress = false;
    
    this.isRunning = true;
    this.currentState = 'starting';
    
    store.dispatch('horde/unequipAll');
    
    this.timerId = setInterval(() => {
      try {
        this.tick();
      } catch (e) {
        console.error('[HordeAuto] 运行错误:', e);
        this.stop();
      }
    }, 1000);
    
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
    
    try {
      store.commit('game/updateState');
    } catch (e) {
      return;
    }
  }

  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
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
  }

  checkUpgrades() {
    const upgradeItems = store.state.upgrade.item || {};
    
    const gemHordeUpgrades = [
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
        // 忽略错误，继续尝试下一个技能
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
      
      // 设置超时，确保装备操作完成后重置标志
      this._equipTimeout = setTimeout(() => {
        console.log(`[HordeAuto] ${new Date().toLocaleString('zh-CN', {day: '2-digit', hour: '2-digit', minute: '2-digit'})} 装备操作完成`);
        this.equipmentInProgress = false;
        this._equipTimeout = null;
      }, 2000);
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
      config: this.config
    };
  }
}

const hordeAutomation = new HordeAutomation();

export default hordeAutomation;