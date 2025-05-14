import store from '../../store';

const dailyCheckIn = {
  debug: false,
  
  poolProbabilities: [
    { name: 'wheelOfFortune0', chance: 50, color: 'white', animation: null },
    { name: 'wheelOfFortune1', chance: 30, color: 'blue', animation: null },
    { name: 'wheelOfFortune2', chance: 10, color: 'orange', animation: null },
    { name: 'wheelOfFortune3', chance: 8, color: 'purple', animation: 'small-confetti' },
    { name: 'wheelOfFortune4', chance: 2, color: 'red', animation: 'large-confetti' }
  ],
  
  initData() {
    const now = Math.floor(Date.now() / 1000);

    if (!store.state.system.dailyCheckIn) {
      store.commit('system/updateKey', {
        key: 'dailyCheckIn',
        value: {
          available: this.debug ? 999 : 1,
          timestamp: now,
          history: []
        }
      });
    } else {

      const lastTime = store.state.system.dailyCheckIn.timestamp;
      const isNewDay = new Date(now * 1000).toDateString() !== new Date(lastTime * 1000).toDateString();
      
      if (isNewDay || this.debug) {
        store.commit('system/updateKey', {
          key: 'dailyCheckIn',
          value: {
            available: this.debug ? 999 : 1,
            timestamp: now,
            history: this.debug ? store.state.system.dailyCheckIn.history : []
          }
        });
      }
    }
  },
  

  setDebug(enabled) {
    this.debug = enabled;
    this.initData();
    return this.debug;
  },
  
  selectPrizePool() {
    const rngGen = store.getters['system/getRng']('dailyCheckIn_pool');

    const rand = rngGen() * 100;

    store.commit('system/nextRng', {name: 'dailyCheckIn_pool', amount: 1}, {root: true});

    let sum = 0;
    for (let i = 0; i < this.poolProbabilities.length; i++) {
      sum += this.poolProbabilities[i].chance;
      if (rand <= sum) {
        return this.poolProbabilities[i];
      }
    }
    
    return this.poolProbabilities[0];
  },
  

  selectPrizeFromPool(poolName) {

    const prizeList = store.state.event.prize || {};
    const availablePrizes = [];
    let totalWeight = 0;
    

    for (const [key, prize] of Object.entries(prizeList)) {
      if (prize.pool && prize.pool[poolName] !== undefined) {

        if (!prize.requirement || prize.requirement()) {
          const weight = prize.pool[poolName].weight || prize.weight || 1;
          totalWeight += weight;
          availablePrizes.push({
            id: key,
            ...prize,
            calculatedWeight: weight
          });
        }
      }
    }
    
    if (availablePrizes.length === 0) return null;

    const rngGen = store.getters['system/getRng']('dailyCheckIn_prize');

    const rand = rngGen() * totalWeight;

    store.commit('system/nextRng', {name: 'dailyCheckIn_prize', amount: 1}, {root: true});

    let currentWeight = 0;
    for (const prize of availablePrizes) {
      currentWeight += prize.calculatedWeight;
      if (rand <= currentWeight) {
        return {
          id: prize.id,
          type: prize.type,
          item: prize.item,
          poolDetails: prize.pool[poolName],
          roundAmount: prize.roundAmount,
          amountMult: prize.amountMult
        };
      }
    }
    
    return availablePrizes[0];
  },

  getPrizeName(prize) {
    let name = prize.item;

    if (prize.type === 'currency') {
      const currencyObj = store.state.currency[prize.item];
      if (currencyObj && currencyObj.name) {
        name = currencyObj.name;
      }
    } else if (prize.type === 'consumable') {
      const consumableObj = store.state.consumable[prize.item];
      if (consumableObj && consumableObj.name) {
        name = consumableObj.name;
      }
    }
    
    return name;
  },
  
  distributePrize(prize) {
    let originalAmount = prize.poolDetails.amount !== undefined ? prize.poolDetails.amount : 1;
    let amount = originalAmount;
    if (prize.amountMult) {
      amount *= prize.amountMult();
    }
    
    if (prize.roundAmount) {
      amount = Math.round(amount);
    }

    const prizeName = this.getPrizeName(prize);
    if (prize.type === 'currency') {
      const [feature, name] = prize.item.split('_');
      store.dispatch('currency/gain', {
        feature,
        name,
        amount
      });
    } else if (prize.type === 'consumable') {
      store.dispatch('consumable/gain', {
        name: prize.item,
        amount
      });
    } else if (prize.type === 'treasure' && prize.data) {
      store.dispatch('treasure/winItem', prize.data);
    }
    
    const prizeText = `${prizeName}: +${amount}`;
    console.log(prizeText);
    
    const cachedAmount = amount;
    const specialAmountMult = function() {
      if (prize.amountMult) {
        return cachedAmount / originalAmount;
      }
      return 1;
    };
    
    const historyItem = {
      id: prize.id,
      type: prize.type,
      item: prize.item,
      amount: originalAmount,
      amountMult: specialAmountMult,
      poolName: prize.poolDetails ? `wheelOfFortune${prize.poolDetails.rarity || 0}` : null,
      timestamp: Math.floor(Date.now() / 1000),
      poolColor: prize.poolColor || 'white',
      animation: prize.animation || null
    };
    
    if (prize.type === 'treasure' && prize.data) {
      historyItem.data = prize.data;
      historyItem.prize = prize.id;
    } else {
      historyItem.prize = prize.id;
    }
    
    console.log(historyItem);
    const dailyCheckIn = store.state.system.dailyCheckIn;
    store.commit('system/updateKey', {
      key: 'dailyCheckIn',
      value: {
        available: dailyCheckIn.available - 1,
        timestamp: Math.floor(Date.now() / 1000),
        history: [historyItem, ...dailyCheckIn.history]
      }
    });
    
    return {
      prize: historyItem,
      prizeText
    };
  },
  
  rollPrize() {
    const dailyCheckIn = store.state.system.dailyCheckIn;
    if (!dailyCheckIn || dailyCheckIn.available <= 0) {
      return null;
    }
    
    const pool = this.selectPrizePool();
    const poolName = pool.name;

    const prize = this.selectPrizeFromPool(poolName);
    
    if (!prize) {
      return { 
        prizeText: '未获得奖励',
        prize: null
      };
    }

    if (prize.type === 'treasure') {
      const prizeData = store.state.event.prize[prize.id];
      store.commit('system/nextRng', {name: 'treasure_' + prizeData.item, amount: 1}, {root: true});

      const bonusTier = prizeData.bonusTier || 0;
      prize.data = store.getters['treasure/generateItem'](prizeData.item, 0, true, 0, bonusTier);
    }

    prize.poolColor = pool.color;
    prize.animation = pool.animation;

    return this.distributePrize(prize);
  }
};

export default dailyCheckIn; 