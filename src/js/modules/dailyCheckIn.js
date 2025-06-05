import store from '../../store';
import dailyCheckInPrize from './dailyCheckIn/prize';

const dailyCheckIn = {
  debug: true,

  poolProbabilities: [
    { name: 'dailyCheckIn0', chance: 50, color: 'white', animation: null },
    { name: 'dailyCheckIn1', chance: 30, color: 'blue', animation: null },
    { name: 'dailyCheckIn2', chance: 15, color: 'orange', animation: null },
    { name: 'dailyCheckIn3', chance: 4, color: 'purple', animation: 'small-confetti' },
    { name: 'dailyCheckIn4', chance: 1, color: 'red', animation: 'large-confetti' }
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

    this.registerPrizesToEventStore();
  },

  registerPrizesToEventStore() {
    try {
      if (!store.state.event) {
        return;
      }

      for (const [key, prize] of Object.entries(dailyCheckInPrize)) {
        const prizeForEvent = {
          ...prize,
          amountMult: prize.amountMult || (() => 1),
          requirement: prize.requirement || (() => true)
        };

        if (store.state.event.prize) {
          store.state.event.prize[key] = prizeForEvent;
        }
      }

      if (this.debug) {
        console.log('Daily check-in prizes registered to event store:', Object.keys(dailyCheckInPrize).length, 'prizes');
      }
    } catch (e) {
      console.warn('Failed to register daily check-in prizes to event store:', e);
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
    // 使用每日签到专用奖励池
    const prizeList = dailyCheckInPrize;
    const availablePrizes = [];
    let totalWeight = 0;

    // 遍历每日签到奖励池中的所有奖励
    for (const [key, prize] of Object.entries(prizeList)) {
      // 使用事件系统相同的逻辑：检查requirement和pool存在
      let requirementMet = true;
      if (prize.requirement) {
        try {
          requirementMet = prize.requirement();
        } catch (e) {
          // 如果unlock路径不存在，说明功能未解锁
          requirementMet = false;
        }
      }

      if (requirementMet && prize.pool[poolName]) {
        const weight = prize.pool[poolName].weight || prize.weight || 1;
        totalWeight += weight;
        availablePrizes.push({
          id: key,
          ...prize,
          calculatedWeight: weight
        });
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
    // 处理随机物品
    let itemName = typeof prize.item === 'function' ? prize.item() : prize.item;
    let name = itemName;

    if (prize.type === 'currency') {
      const currencyObj = store.state.currency[itemName];
      if (currencyObj && currencyObj.name) {
        name = currencyObj.name;
      }
    } else if (prize.type === 'consumable') {
      const consumableObj = store.state.consumable[itemName];
      if (consumableObj && consumableObj.name) {
        name = consumableObj.name;
      }
    } else if (prize.type === 'cardPack') {
      // 处理卡包名称
      const cardPackName = typeof prize.item === 'function' ? prize.item() : prize.item;
      name = cardPackName;
    }

    return name;
  },
  
  distributePrize(prize) {
    try {
      if (dailyCheckIn.debug) {
        console.log(`📦 开始分发奖励: ${prize.id}`);
      }

      // 步骤1：计算奖励数量
      let originalAmount, amount;
      try {
        originalAmount = prize.poolDetails.amount !== undefined ? prize.poolDetails.amount : 1;
        amount = originalAmount;

        if (prize.amountMult) {
          if (dailyCheckIn.debug) {
            console.log(`🔢 应用倍率: ${prize.amountMult.toString()}`);
          }
          const multiplier = prize.amountMult();
          amount *= multiplier;
          if (dailyCheckIn.debug) {
            console.log(`🔢 倍率计算: ${originalAmount} × ${multiplier} = ${amount}`);
          }
        }

        if (prize.roundAmount) {
          const beforeRound = amount;
          amount = Math.round(amount);
          if (dailyCheckIn.debug) {
            console.log(`🔢 数量取整: ${beforeRound} → ${amount}`);
          }
        }
      } catch (error) {
        console.error('❌ 计算奖励数量时出错:', error);
        throw new Error(`计算奖励数量失败: ${error.message}`);
      }

      // 步骤2：获取奖励名称
      let prizeName;
      try {
        prizeName = this.getPrizeName(prize);
        if (dailyCheckIn.debug) {
          console.log(`📝 奖励名称: ${prizeName}`);
        }
      } catch (error) {
        console.error('❌ 获取奖励名称时出错:', error);
        throw new Error(`获取奖励名称失败: ${error.message}`);
      }

      // 步骤3：根据奖励类型分发
      try {
        if (prize.type === 'currency') {
          if (dailyCheckIn.debug) {
            console.log(`💰 分发货币奖励: ${prize.item}`);
          }
          // 处理随机货币（如随机宝石）
          const itemName = typeof prize.item === 'function' ? prize.item() : prize.item;
          if (dailyCheckIn.debug) {
            console.log(`💰 实际货币名称: ${itemName}`);
          }

          const parts = itemName.split('_');
          if (parts.length !== 2) {
            throw new Error(`货币名称格式错误: ${itemName} (应为 feature_name 格式)`);
          }

          const [feature, name] = parts;
          if (dailyCheckIn.debug) {
            console.log(`💰 分发到: ${feature}.${name}, 数量: ${amount}`);
          }

          store.dispatch('currency/gain', {
            feature,
            name,
            amount
          });

        } else if (prize.type === 'consumable') {
          if (dailyCheckIn.debug) {
            console.log(`🧪 分发消耗品奖励: ${prize.item}, 数量: ${amount}`);
          }
          store.dispatch('consumable/gain', {
            name: prize.item,
            amount
          });

        } else if (prize.type === 'treasure' && prize.data) {
          if (dailyCheckIn.debug) {
            console.log(`🏺 分发宝藏奖励:`, prize.data);
          }
          store.dispatch('treasure/winItem', prize.data);

        } else if (prize.type === 'relic') {
          if (dailyCheckIn.debug) {
            console.log(`💍 分发圣物奖励: ${prize.item}`);
          }
          store.dispatch('relic/find', prize.item);

        } else if (prize.type === 'cardPack') {
          if (dailyCheckIn.debug) {
            console.log(`🃏 分发卡包奖励: ${prize.item}, 数量: ${amount}`);
          }
          const cardPackName = typeof prize.item === 'function' ? prize.item() : prize.item;
          if (dailyCheckIn.debug) {
            console.log(`🃏 实际卡包名称: ${cardPackName}`);
          }

          store.dispatch('card/openPack', {
            name: cardPackName,
            amount,
            notify: true
          });

        } else {
          throw new Error(`未知的奖励类型: ${prize.type}`);
        }

        if (dailyCheckIn.debug) {
          console.log(`✅ 奖励分发成功: ${prize.type} - ${prizeName}`);
        }

      } catch (error) {
        console.error('❌ 分发奖励到游戏系统时出错:', error);
        console.error('奖励详情:', {
          id: prize.id,
          type: prize.type,
          item: prize.item,
          amount: amount,
          originalAmount: originalAmount
        });
        throw new Error(`分发 ${prize.type} 奖励失败: ${error.message}`);
      }

      // 步骤4：生成奖励文本和历史记录
      try {
        const prizeText = `${prizeName}: +${amount}`;

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
          item: typeof prize.item === 'function' ? prize.item() : prize.item,
          amount: originalAmount,
          amountMult: specialAmountMult,
          poolName: prize.poolColor || 'white',  // 使用池颜色作为池名称
          timestamp: Math.floor(Date.now() / 1000),
          poolColor: prize.poolColor || 'white',
          animation: prize.animation || null,
          // 添加Prize组件需要的pool字段
          pool: {
            [prize.poolColor || 'white']: {
              amount: originalAmount
            }
          }
        };

        if (prize.type === 'treasure' && prize.data) {
          historyItem.data = prize.data;
          historyItem.prize = prize.id;
        } else {
          historyItem.prize = prize.id;
        }

        if (dailyCheckIn.debug) {
          console.log(`📝 生成历史记录:`, historyItem);
        }

        // 步骤5：更新签到状态
        const dailyCheckInState = store.state.system.dailyCheckIn;
        store.commit('system/updateKey', {
          key: 'dailyCheckIn',
          value: {
            available: dailyCheckInState.available - 1,
            timestamp: Math.floor(Date.now() / 1000),
            history: [historyItem, ...dailyCheckInState.history]
          }
        });

        if (dailyCheckIn.debug) {
          console.log(`✅ distributePrize 完成: ${prizeText}`);
        }

        return {
          prize: historyItem,
          prizeText
        };

      } catch (error) {
        console.error('❌ 生成历史记录或更新状态时出错:', error);
        throw new Error(`生成历史记录失败: ${error.message}`);
      }

    } catch (error) {
      console.error('🚨 distributePrize 出现严重错误:', error);
      console.error('奖励详情:', prize);
      throw error;
    }
  },
  
  rollPrize() {
    try {
      const dailyCheckIn = store.state.system.dailyCheckIn;
      if (!dailyCheckIn || dailyCheckIn.available <= 0) {
        return null;
      }

      // 步骤1：选择奖励池
      let pool, poolName;
      try {
        pool = this.selectPrizePool();
        poolName = pool.name;
        if (dailyCheckIn.debug) {
          console.log(`🎯 选中奖励池: ${poolName} (${pool.color}池, ${pool.chance}%概率)`);
        }
      } catch (error) {
        console.error('❌ 选择奖励池时出错:', error);
        throw new Error(`选择奖励池失败: ${error.message}`);
      }

      // 步骤2：从奖励池中选择奖励
      let prize;
      try {
        prize = this.selectPrizeFromPool(poolName);
        if (!prize) {
          console.warn(`⚠️ 奖励池 ${poolName} 中没有可用奖励`);
          return {
            prizeText: '未获得奖励',
            prize: null
          };
        }
        if (dailyCheckIn.debug) {
          console.log(`🎁 选中奖励: ${prize.id} (类型: ${prize.type}, 物品: ${prize.item})`);
        }
      } catch (error) {
        console.error('❌ 从奖励池选择奖励时出错:', error);
        console.error('奖励池信息:', pool);
        throw new Error(`从奖励池 ${poolName} 选择奖励失败: ${error.message}`);
      }

      // 步骤3：处理宝藏类型奖励
      if (prize.type === 'treasure') {
        try {
          const prizeData = dailyCheckInPrize[prize.id];
          if (!prizeData) {
            throw new Error(`找不到奖励数据: ${prize.id}`);
          }

          if (dailyCheckIn.debug) {
            console.log(`🏺 生成宝藏: ${prizeData.item}, bonusTier: ${prizeData.bonusTier || 0}`);
          }
          store.commit('system/nextRng', {name: 'treasure_' + prizeData.item, amount: 1}, {root: true});

          const bonusTier = prizeData.bonusTier || 0;
          prize.data = store.getters['treasure/generateItem'](prizeData.item, 0, true, 0, bonusTier);

          if (!prize.data) {
            throw new Error(`生成宝藏数据失败: ${prizeData.item}`);
          }
        } catch (error) {
          console.error('❌ 处理宝藏奖励时出错:', error);
          console.error('奖励信息:', prize);
          throw new Error(`处理宝藏奖励 ${prize.id} 失败: ${error.message}`);
        }
      }

      // 步骤4：设置奖励属性
      try {
        prize.poolColor = pool.color;
        prize.animation = pool.animation;
      } catch (error) {
        console.error('❌ 设置奖励属性时出错:', error);
        throw new Error(`设置奖励属性失败: ${error.message}`);
      }

      // 步骤5：分发奖励
      try {
        if (dailyCheckIn.debug) {
          console.log(`💰 开始分发奖励: ${prize.id}`);
        }
        const result = this.distributePrize(prize);
        if (dailyCheckIn.debug) {
          console.log(`✅ 奖励分发成功: ${result.prizeText}`);
        }
        return result;
      } catch (error) {
        console.error('❌ 分发奖励时出错:', error);
        console.error('奖励信息:', prize);
        throw new Error(`分发奖励 ${prize.id} 失败: ${error.message}`);
      }

    } catch (error) {
      console.error('🚨 每日签到抽奖出现严重错误:', error);

      // 详细错误信息
      console.error('错误堆栈:', error.stack);
      console.error('当前游戏状态:');
      console.error('- 签到数据:', store.state.system.dailyCheckIn);
      console.error('- 解锁状态:', Object.keys(store.state.unlock).filter(key => store.state.unlock[key]?.see));

      // 重新抛出错误，让上层处理
      throw error;
    }
  },


  getPoolInfo() {
    const poolInfo = [];

    for (const pool of this.poolProbabilities) {
      const poolData = {
        name: pool.name,
        chance: pool.chance,
        color: pool.color,
        items: []
      };

      const treasureFound = new Set();
      const fertilizerFound = new Set();

      // 获取该奖池中的所有可用奖励
      for (const [key, prize] of Object.entries(dailyCheckInPrize)) {
        if (prize.pool && prize.pool[pool.name] !== undefined) {
          // 检查解锁条件
          let isUnlocked = true;
          if (prize.requirement) {
            try {
              isUnlocked = prize.requirement();
            } catch (e) {
              // 如果解锁条件检查失败，默认为未解锁
              isUnlocked = false;
            }
          }

          if (isUnlocked) {
            const itemInfo = {
              id: key,
              type: prize.type,
              item: prize.item,
              weight: prize.pool[pool.name].weight || prize.weight || 1,
              amount: prize.pool[pool.name].amount
            };

            // 获取物品名称（在组件中会被翻译函数替换）
            if (prize.type === 'currency') {
              if (typeof prize.item === 'function') {
                // 处理随机宝石
                if (key === 'gem_random5') {
                  itemInfo.name = '随机宝石(5种)';
                } else if (key === 'gem_random4') {
                  itemInfo.name = '随机宝石(4种)';
                } else {
                  itemInfo.name = '随机货币';
                }
                itemInfo.nameKey = null;
              } else {
                itemInfo.name = prize.item;
                itemInfo.nameKey = `$vuetify.currency.${prize.item}.name`;
              }
            } else if (prize.type === 'consumable') {
              // 合并所有肥料显示为一个
              if (prize.item.startsWith('farm_') && prize.item !== 'farm_premium') {
                if (!fertilizerFound.has('fertilizer')) {
                  fertilizerFound.add('fertilizer');
                  itemInfo.name = '随机肥料';
                  itemInfo.nameKey = null;
                  poolData.items.push(itemInfo);
                }
                continue; // 跳过后续处理，避免重复添加
              } else {
                itemInfo.name = prize.item;
                itemInfo.nameKey = `$vuetify.consumable.${prize.item}.name`;
              }
            } else if (prize.type === 'treasure') {
              // 合并所有宝藏显示为一个
              if (!treasureFound.has('treasure')) {
                treasureFound.add('treasure');
                itemInfo.name = '随机宝藏';
                itemInfo.nameKey = null;
                poolData.items.push(itemInfo);
              }
              continue; // 跳过后续处理，避免重复添加
            } else if (prize.type === 'cardPack') {
              if (typeof prize.item === 'function') {
                // 根据奖励ID区分普通卡包和事件卡包
                if (key === 'cardPack_normal') {
                  itemInfo.name = '随机普通卡包';
                } else if (key === 'cardPack_event') {
                  itemInfo.name = '随机活动卡包';
                } else {
                  itemInfo.name = '随机卡包';
                }
                itemInfo.nameKey = null;
              } else {
                itemInfo.name = prize.item;
                itemInfo.nameKey = `$vuetify.card.pack.${prize.item}`;
              }
            }

            poolData.items.push(itemInfo);
          }
        }
      }

      poolInfo.push(poolData);
    }

    return poolInfo;
  }
};

export default dailyCheckIn; 