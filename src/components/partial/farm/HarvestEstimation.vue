<style scoped>
.harvest-title {
  font-weight: bold;
  margin-bottom: 8px;
  text-align: center;
  font-size: 16px;
}
.harvest-subtitle {
  font-weight: bold;
  margin: 8px 0 4px 0;
  color: #ccc;
}
.harvest-items {
  display: flex;
  flex-wrap: wrap;
}
.harvest-item {
  display: flex;
  align-items: center;
  margin-bottom: 4px;
  margin-right: 8px;
  flex: 0 0 calc(30% - 8px);
}
.harvest-time {
  font-size: 12px;
  color: #aaa;
  margin-top: 8px;
  margin-bottom: 4px;
}
.harvest-group {
  margin-bottom: 8px;
  border-bottom: 1px solid rgba(128, 128, 128, 0.2);
}
.harvest-group:last-child {
  border-bottom: none;
  margin-bottom: 0;
}
</style>

<template>
  <div class="harvest-estimation">

    <!-- 已准备好收获的作物 -->
    <template v-if="readyHarvests && Object.keys(readyHarvests).length > 0">
      <div class="harvest-subtitle">可收获的作物</div>
      <div class="harvest-items">
        <div v-for="(item, itemName) in readyHarvests" :key="itemName" class="harvest-item">
          <v-icon small :color="getItemColor(itemName)" class="mr-1">{{ getItemIcon(itemName) }}</v-icon>
          <span>{{ getTranslatedName(itemName) }}:</span>
          <span class="ml-1">{{ formatItemAmount(item) }}</span>
        </div>
      </div>
    </template>
    
    <!-- 未来可收获的作物 -->
    <template v-if="futureHarvests && futureHarvests.length > 0">
      <div v-for="(harvest, index) in futureHarvests" :key="index" class="harvest-group">
        <div class="harvest-time">{{ harvest.timeLabel }}</div>
        <div class="harvest-items">
          <div v-for="(item, itemName) in harvest.items" :key="itemName" class="harvest-item">
            <v-icon small :color="getItemColor(itemName)" class="mr-1">{{ getItemIcon(itemName) }}</v-icon>
            <span>{{ getTranslatedName(itemName) }}:</span>
            <span class="ml-1">{{ formatItemAmount(item) }}</span>
          </div>
        </div>
      </div>
    </template>
    
    <!-- 没有作物可收获时显示 -->
    <div v-if="(!readyHarvests || Object.keys(readyHarvests).length === 0) && (!futureHarvests || futureHarvests.length === 0)" class="text-center">
      空
    </div>
  </div>
</template>

<script>
import { capitalize } from '../../../js/utils/format';

export default {
  data: () => ({
    readyHarvests: null,
    futureHarvests: []
  }),
  mounted() {
    this.calculateEstimatedHarvests();
  },
  methods: {
    calculateEstimatedHarvests() {
      // 重置数据
      this.readyHarvests = {};
      this.futureHarvests = [];
      
      // 获取农场字段
      const field = this.$store.state.farm.field;
      
      // 按收获时间分组
      const timeGroups = {};
      
      // 遍历所有单元格
      for (let y = 0; y < field.length; y++) {
        for (let x = 0; x < field[y].length; x++) {
          const cell = field[y][x];
          if (cell && cell.type === 'crop') {
            // 已成熟的作物
            if (cell.grow >= 1) {
              if (!timeGroups['ready']) {
                timeGroups['ready'] = [];
              }
              timeGroups['ready'].push({ x, y, cell });
            } 
            // 生长中的作物
            else if (cell.cache && cell.cache.grow > 0) {
              const timeToHarvest = Math.ceil(60 * (1 - cell.grow) / cell.cache.grow);
              if (!timeGroups[timeToHarvest]) {
                timeGroups[timeToHarvest] = [];
              }
              timeGroups[timeToHarvest].push({ x, y, cell });
            }
          }
        }
      }
      
      // 处理已准备好收获的作物
      if (timeGroups['ready'] && timeGroups['ready'].length > 0) {
        const readyItems = {};
        
        timeGroups['ready'].forEach(({ x, y, cell }) => {
          const estimatedItems = this.estimateHarvest(x, y, cell);
          
          // 合并物品
          Object.keys(estimatedItems).forEach(itemName => {
            this.mergeItemsWithCap(readyItems, estimatedItems[itemName], itemName);
          });
        });
        
        this.readyHarvests = this.sortHarvestItems(readyItems);
      }
      
      // 处理未来可收获的作物
      const futureTimes = Object.keys(timeGroups)
        .filter(time => time !== 'ready')
        .sort((a, b) => parseInt(a) - parseInt(b));
      
      futureTimes.forEach(time => {
        const cells = timeGroups[time];
        const harvestItems = {};
        
        cells.forEach(({ x, y, cell }) => {
          const estimatedItems = this.estimateHarvest(x, y, cell, true); // 传入true表示是未来收获
          
          // 合并物品
          Object.keys(estimatedItems).forEach(itemName => {
            this.mergeItemsWithCap(harvestItems, estimatedItems[itemName], itemName);
          });
        });
        
        // 只有当有物品时才添加到未来收获列表
        if (Object.keys(harvestItems).length > 0) {
          this.futureHarvests.push({
            timeLabel: `${this.$formatTime(parseInt(time))}后可获取`,
            items: this.sortHarvestItems(harvestItems)
          });
        }
      });
    },
    
    sortHarvestItems(items) {
      const sortedItems = {};
      
      // 首先添加主要作物类型
      ['farm_vegetable', 'farm_berry', 'farm_grain', 'farm_flower'].forEach(type => {
        if (items[type]) {
          sortedItems[type] = items[type];
        }
      });
      
      // 然后添加金币
      if (items['farm_gold']) {
        sortedItems['farm_gold'] = items['farm_gold'];
      }
      
      // 然后添加所有其他物品（稀有掉落等）
      Object.keys(items).forEach(key => {
        if (!sortedItems[key] && !['farm_vegetable', 'farm_berry', 'farm_grain', 'farm_flower', 'farm_gold'].includes(key)) {
          sortedItems[key] = items[key];
        }
      });
      
      return sortedItems;
    },
    
    estimateHarvest(x, y, cell, isFuture = false) {
      const harvestItems = {};
      
      // 如果是未来收获，需要模拟作物成熟
      if (isFuture) {
        // 模拟未来作物成熟时的计算
        cell = { ...cell, grow: 1 };
      } else if (cell.type !== 'crop' || cell.grow < 1) {
        // 只有成熟的作物才能收获
        return harvestItems;
      }
      
      const crop = this.$store.state.farm.crop[cell.crop];
      if (!crop) {
        return harvestItems;
      }
      
      const geneStats = this.$store.getters['farm/cropGeneStats'](cell.crop, cell.fertilizer);
      
      // 计算 allGainBoost（确定性部分）
      const gnomeBoostBase = 0.04 * ((cell.buildingEffect?.gnomeBoost ?? 0) / cell.time) + 1;
      
      // 幸运收获是概率性的
      const luckyHarvestChance = geneStats.tag.includes('farmLuckyHarvest') ? 0.01 : 0;
      const luckyHarvestMult = this.$store.getters['mult/get']('farmLuckyHarvestMult', geneStats.mult.farmLuckyHarvestMult.baseValue);
      
      // 计算 allGainBoost 的最小/最大值
      const allGainBoostMin = isNaN(gnomeBoostBase) ? 1 : gnomeBoostBase;
      const allGainBoostMax = isNaN(gnomeBoostBase) ? 1 : (gnomeBoostBase * (luckyHarvestChance > 0 ? luckyHarvestMult : 1));
      
      // 金币几率计算
      const goldChanceBase = this.$store.getters['farm/baseGoldChance'](cell.crop) + geneStats.mult.farmGoldChance.baseValue;
      const goldChanceMult = ((cell.buildingEffect?.gardenGnome ?? 0) / cell.time) * geneStats.mult.farmGoldChance.multValue;
      const goldChance = this.$store.getters['mult/get']('farmGoldChance', goldChanceBase, goldChanceMult);
      
      // 计算金币收获
      if (goldChance > 0) {
        const goldMin = Math.floor(goldChance * allGainBoostMin * cell.grow);
        const goldMax = Math.ceil(goldChance * allGainBoostMax * cell.grow);
        
        if (goldMin === goldMax) {
          harvestItems['farm_gold'] = isNaN(goldMin) ? 0 : goldMin;
        } else {
          harvestItems['farm_gold'] = { 
            min: isNaN(goldMin) ? 0 : goldMin, 
            max: isNaN(goldMax) ? 0 : goldMax 
          };
        }
      }
      
      // 计算作物类型收获
      const yieldMultName = 'currencyFarm' + capitalize(crop.type) + 'Gain';
      const flagBoost = (((cell.buildingEffect?.flag ?? 0) / cell.time) * 0.5 + 1);
      const cropGainBase = (crop.yield || 0) + geneStats.mult.farmCropGain.baseValue;
      const cropGainMult = flagBoost * geneStats.mult.farmCropGain.multValue;
      
      const cropGainValue = this.$store.getters['mult/get'](yieldMultName, cropGainBase, cropGainMult);
      
      const cropGainMin = Math.floor(cropGainValue * allGainBoostMin * cell.grow);
      const cropGainMax = Math.ceil(cropGainValue * allGainBoostMax * cell.grow);
      
      if (cropGainMin === cropGainMax) {
        harvestItems[`farm_${crop.type}`] = isNaN(cropGainMin) ? 0 : cropGainMin;
      } else {
        harvestItems[`farm_${crop.type}`] = { 
          min: isNaN(cropGainMin) ? 0 : cropGainMin, 
          max: isNaN(cropGainMax) ? 0 : cropGainMax 
        };
      }
      
      // 计算产量转换（如果适用）
      if (geneStats.tag.includes('farmYieldConversion')) {
        ['vegetable', 'berry', 'grain', 'flower'].forEach(croptype => {
          if (crop.type !== croptype) {
            const conversionMultName = 'currencyFarm' + capitalize(croptype) + 'Gain';
            const conversionValue = this.$store.getters['mult/get'](
              conversionMultName, 
              cropGainBase,
              cropGainMult
            );
            
            const conversionMin = Math.floor(conversionValue * allGainBoostMin * cell.grow * 0.05);
            const conversionMax = Math.ceil(conversionValue * allGainBoostMax * cell.grow * 0.05);
            
            if (conversionMin === conversionMax) {
              harvestItems[`farm_${croptype}`] = isNaN(conversionMin) ? 0 : conversionMin;
            } else {
              harvestItems[`farm_${croptype}`] = { 
                min: isNaN(conversionMin) ? 0 : conversionMin, 
                max: isNaN(conversionMax) ? 0 : conversionMax 
              };
            }
          }
        });
      }
      
      // 计算稀有掉落
      const rareDrops = [...(crop.rareDrop || []), ...(geneStats.rareDrop || [])];
      
      // 查找基因中的addRareDrop类型
      const findGeneRareDrop = (dropName) => {
        // 检查所有激活的基因
        for (const geneName in this.$store.state.farm.gene) {
          const gene = this.$store.state.farm.gene[geneName];
          if (!gene.active) continue;
          
          // 检查基因效果
          if (gene.effect) {
            for (const effect of gene.effect) {
              if (effect.type === 'addRareDrop' && effect.name === dropName) {
                return effect;
              }
            }
          }
        }
        return null;
      };
      
      rareDrops.forEach(drop => {
        if (!drop || drop.chance === undefined) return;
        
        // 如果value是undefined，尝试从基因中获取
        if (drop.name === 'farm_grass' && drop.value === undefined) {
          const geneEffect = findGeneRareDrop(drop.name);
          if (geneEffect) {
            drop.value = geneEffect.value;
          }
        }
        
        // 处理负面几率（这些是需要升级才能获得的特殊掉落）
        let effectiveChance = drop.chance;
        if (effectiveChance <= 0) {
          // 尝试从 mult 系统获取有效几率
          const rareDropChance = this.$store.getters['mult/get']('farmRareDropChance', effectiveChance);
          if (rareDropChance <= 0) return; // 仍然不可用
          effectiveChance = rareDropChance;
        }
        
        const pinwheelMult = (((cell.buildingEffect?.pinwheel ?? 0) / cell.time) * 0.015) + 1;
        const dropChance = effectiveChance * pinwheelMult;
        
        if (dropChance > 0) {
          // 对于稀有掉落，我们显示从 0 到最大可能值的范围
          let dropValue = drop.value;
          
          // 如果仍然是undefined，尝试获取基因升级的额外值
          if (drop.name === 'farm_grass' && (dropValue === undefined || dropValue === 0)) {
            // 查找基因系统中的farm_grass定义
            const grassGene = this.$store.state.farm.gene.grass;
            if (grassGene && grassGene.active) {
              // 使用基因定义中的默认值
              dropValue = 8; // 基础值
              
              // 添加升级值
              if (grassGene.level > 0) {
                dropValue += grassGene.level; // 每级+1
              }
            } else {
              // 如果没有激活grass基因，使用默认值
              dropValue = 40;
            }
          }
          
          const finalDropValue = dropValue * (drop.mult || 1);
          // 添加NaN检查
          const safeDropValue = isNaN(finalDropValue) ? 0 : finalDropValue;
          
          // 特殊处理farm_grass资源，确保其上限正确计算
          if (drop.name === 'farm_grass') {
            // 获取farm_grass的上限
            const grassCap = this.$store.state.currency['farm_grass']?.cap || 200;
            const grassMin = 0;
            const grassMax = Math.min(safeDropValue, grassCap);
            
            harvestItems[drop.name] = { 
              min: grassMin, 
              max: grassMax 
            };
          } else {
            harvestItems[drop.name] = { min: 0, max: safeDropValue };
          }
        }
      });
      
      // 特殊处理corn作物，corn作物可能会产出grass
      if (cell.crop === 'corn') {
        // 获取farm_grass的上限
        const grassCap = this.$store.state.currency['farm_grass']?.cap || 200;
        
        // 如果还没有grass记录，添加一个
        if (!harvestItems['farm_grass']) {
          const cornGrassMin = 0;
          const cornGrassMax = Math.min(40, grassCap); // corn产出grass的默认值
          
          harvestItems['farm_grass'] = { min: cornGrassMin, max: cornGrassMax };
        }
      }
      
      return harvestItems;
    },
    
    getItemIcon(itemName) {
      const currency = this.$store.state.currency[itemName];
      return currency ? currency.icon : 'mdi-help-circle';
    },
    
    getItemColor(itemName) {
      const currency = this.$store.state.currency[itemName];
      return currency ? currency.color : 'grey';
    },
    
    getTranslatedName(itemName) {
      if (!itemName || typeof itemName !== 'string') {
        return 'Unknown';
      }
      
      if (itemName.startsWith('farm_')) {
        // 首先检查是否存在于currency中
        if (this.$store.state.currency[itemName]) {
          return this.$vuetify.lang.t(`$vuetify.currency.${itemName}.name`);
        } 
        // 然后检查是否存在于consumable中
        else if (this.$store.state.consumable[itemName]) {
          return this.$vuetify.lang.t(`$vuetify.consumable.${itemName}.name`);
        }
      } else {
        // 非farm_开头的物品，在consumable中查找
        if (this.$store.state.consumable[itemName]) {
          return this.$vuetify.lang.t(`$vuetify.consumable.${itemName}.name`);
        }
      }
      
      // 如果都不存在，返回原始ID（去除前缀）
      return itemName.replace('farm_', '');
    },
    
    formatItemAmount(item) {
      if (typeof item === 'object' && item.min !== undefined && item.max !== undefined) {
        // 检查NaN值并修复
        const min = isNaN(item.min) ? 0 : item.min;
        const max = isNaN(item.max) ? 0 : item.max;
        
        // 如果最小值和最大值相同，只显示一个值
        if (min === max) {
          return this.$formatNum(min);
        }
        
        // 格式化数值进行比较
        const formattedMin = this.$formatNum(min);
        const formattedMax = this.$formatNum(max);
        
        // 如果格式化后的数值相同，只显示最小值
        if (formattedMin === formattedMax) {
          return formattedMin;
        }
        
        // 如果最小值为0，显示为0~最大值
        if (min === 0 && max > 0) {
          return `0~${formattedMax}`;
        }
        
        // 否则显示范围
        return `${formattedMin}~${formattedMax}`;
      }
      
      // 检查单个值是否为NaN
      const value = isNaN(item) ? 0 : item;
      // 如果是单个值，直接显示
      return this.$formatNum(value);
    },
    
    // 获取货币的上限
    getCurrencyCap(currencyName) {
      if (!currencyName || !this.$store.state.currency[currencyName]) {
        return Infinity; // 如果货币不存在，返回无限大
      }
      
      const currency = this.$store.state.currency[currencyName];
      return currency.cap !== null ? currency.cap : Infinity;
    },
    
    // 合并物品时考虑资源上限
    mergeItemsWithCap(items, newItem, itemName) {
      // 获取资源上限
      const cap = this.getCurrencyCap(itemName);
      
      if (!items[itemName]) {
        // 如果是对象类型，确保不超过上限
        if (typeof newItem === 'object' && newItem.min !== undefined && newItem.max !== undefined) {
          items[itemName] = {
            min: Math.min(newItem.min, cap),
            max: Math.min(newItem.max, cap)
          };
        } else {
          // 如果是数值，确保不超过上限
          items[itemName] = Math.min(newItem, cap);
        }
      } else {
        // 如果都是范围
        if (typeof items[itemName] === 'object' && typeof newItem === 'object') {
          // 合并并应用上限
          const newMin = Math.min(items[itemName].min + newItem.min, cap);
          const newMax = Math.min(items[itemName].max + newItem.max, cap);
          
          items[itemName].min = newMin;
          items[itemName].max = newMax;
        } 
        // 如果当前是范围但新的是数字
        else if (typeof items[itemName] === 'object' && typeof newItem === 'number') {
          // 合并并应用上限
          const newMin = Math.min(items[itemName].min + newItem, cap);
          const newMax = Math.min(items[itemName].max + newItem, cap);
          
          items[itemName].min = newMin;
          items[itemName].max = newMax;
        }
        // 如果当前是数字但新的是范围
        else if (typeof items[itemName] === 'number' && typeof newItem === 'object') {
          // 合并并应用上限
          const newMin = Math.min(items[itemName] + newItem.min, cap);
          const newMax = Math.min(items[itemName] + newItem.max, cap);
          
          items[itemName] = {
            min: newMin,
            max: newMax
          };
        }
        // 如果都是数字
        else {
          // 合并并应用上限
          const newValue = Math.min(items[itemName] + newItem, cap);
          
          items[itemName] = newValue;
        }
      }
      
      // 特殊处理farm_grass，始终确保显示为范围形式
      if (itemName === 'farm_grass') {
        // 如果是单个值，转换为范围形式
        if (typeof items[itemName] === 'number') {
          const value = items[itemName];
          items[itemName] = {
            min: 0,
            max: value
          };
        }
      }
    }
  },
  watch: {
    '$store.state.farm.field': {
      deep: true,
      handler() {
        this.calculateEstimatedHarvests();
      }
    }
  }
}
</script> 