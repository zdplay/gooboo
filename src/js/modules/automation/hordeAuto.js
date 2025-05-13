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
    
    if (this._equipTimeout) {
      clearTimeout(this._equipTimeout);
      this._equipTimeout = null;
    }
    
    if (this._prestigeTimeout) {
      clearTimeout(this._prestigeTimeout);
      this._prestigeTimeout = null;
    }
    
    this.isRunning = true;
    this.currentState = 'starting';
    
    this.timerId = setInterval(() => {
      try {
        this.tick();
      } catch (e) {
        this.stop();
      }
    }, 1000);
    
    try {
      this.tick();
    } catch (e) {
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
    
    if (this._equipTimeout) {
      clearTimeout(this._equipTimeout);
      this._equipTimeout = null;
    }
    
    if (this._prestigeTimeout) {
      clearTimeout(this._prestigeTimeout);
      this._prestigeTimeout = null;
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

  equipLoadout(loadoutName) {
    if (!store.state.horde) {
      return;
    }
    
    const loadouts = store.state.horde.loadout;
    
    if (!loadouts) {
      return;
    }
    
    if (!loadouts[loadoutName]) {
      return;
    }
    
    store.dispatch('horde/unequipAll');
    
    setTimeout(() => {
      store.dispatch('horde/equipLoadout', loadoutName);
    }, 500);
  }

  tick() {
    if (!this.isRunning) {
      return;
    }
    
    const state = store.state;
    const currentZone = state.horde.zone;
    const isFighting = state.horde.enemyTimer > 0 || state.horde.enemy !== null;
    const canPrestige = state.unlock.hordePrestige?.use || false;
    
    if (document.hidden) {
      console.log(`[HordeAuto] ${new Date().toLocaleString('zh-CN', {day: '2-digit', hour: '2-digit', minute: '2-digit'})} 浏览器处于后台，自动化暂停运行`);
      return;
    }
    
    if (this.currentState === 'idle') {
      this.stop();
      return;
    }
    
    switch (this.currentState) {
      case 'starting':
        if (currentZone >= this.config.targetZone && this.config.prestigeAfterReaching && canPrestige) {
          this.currentState = 'prestiging';
          return;
        }
        
        if (currentZone < this.config.targetZone) {
          if (this.config.equipmentLoadout) {
            this.currentState = 'equipping';
            return;
          }
          
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
            this.currentState = 'idle';
            this.prestigeInProgress = false;
            this.stop();
            return;
          }
        }
        
        this._prestigeTimeout = setTimeout(() => {
          this.currentState = 'equipping';
          this.prestigeInProgress = false;
          this._prestigeTimeout = null;
        }, 1500);
        
        break;

      case 'equipping':
        if (this.equipmentInProgress) {
          return;
        }
        
        this.equipmentInProgress = true;
        
        if (this.config.equipmentLoadout) {
          console.log(`[HordeAuto] ${new Date().toLocaleString('zh-CN', {day: '2-digit', hour: '2-digit', minute: '2-digit'})} 开始装备预载: ${this.config.equipmentLoadout}`);
          store.dispatch('horde/unequipAll');
          
          setTimeout(() => {
            store.dispatch('horde/equipLoadout', this.config.equipmentLoadout);
            
            this._equipTimeout = setTimeout(() => {
              this.currentState = 'fighting';
              this.equipmentInProgress = false;
              this._equipTimeout = null;
            }, 500);
          }, 500);
        } else {
          this.currentState = 'fighting';
          this.equipmentInProgress = false;
        }
        break;

      default:
        this.currentState = 'idle';
        break;
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