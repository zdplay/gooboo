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
      {{ $vuetify.lang.t('$vuetify.farm.harvestEstimation.empty') }}
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
            if (!readyItems[itemName]) {
              readyItems[itemName] = estimatedItems[itemName];
            } else {
              // 如果都是范围
              if (typeof readyItems[itemName] === 'object' && typeof estimatedItems[itemName] === 'object') {
                readyItems[itemName].min += estimatedItems[itemName].min;
                readyItems[itemName].max += estimatedItems[itemName].max;
              } 
              // 如果当前是范围但新的是数字
              else if (typeof readyItems[itemName] === 'object' && typeof estimatedItems[itemName] === 'number') {
                readyItems[itemName].min += estimatedItems[itemName];
                readyItems[itemName].max += estimatedItems[itemName];
              }
              // 如果当前是数字但新的是范围
              else if (typeof readyItems[itemName] === 'number' && typeof estimatedItems[itemName] === 'object') {
                readyItems[itemName] = {
                  min: readyItems[itemName] + estimatedItems[itemName].min,
                  max: readyItems[itemName] + estimatedItems[itemName].max
                };
              }
              // 如果都是数字
              else {
                readyItems[itemName] += estimatedItems[itemName];
              }
            }
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
            if (!harvestItems[itemName]) {
              harvestItems[itemName] = estimatedItems[itemName];
            } else {
              // 如果都是范围
              if (typeof harvestItems[itemName] === 'object' && typeof estimatedItems[itemName] === 'object') {
                harvestItems[itemName].min += estimatedItems[itemName].min;
                harvestItems[itemName].max += estimatedItems[itemName].max;
              } 
              // 如果当前是范围但新的是数字
              else if (typeof harvestItems[itemName] === 'object' && typeof estimatedItems[itemName] === 'number') {
                harvestItems[itemName].min += estimatedItems[itemName];
                harvestItems[itemName].max += estimatedItems[itemName];
              }
              // 如果当前是数字但新的是范围
              else if (typeof harvestItems[itemName] === 'number' && typeof estimatedItems[itemName] === 'object') {
                harvestItems[itemName] = {
                  min: harvestItems[itemName] + estimatedItems[itemName].min,
                  max: harvestItems[itemName] + estimatedItems[itemName].max
                };
              }
              // 如果都是数字
              else {
                harvestItems[itemName] += estimatedItems[itemName];
              }
            }
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
      const gnomeBoostBase = 0.04 * (cell.buildingEffect?.gnomeBoost ?? 0) / cell.time + 1;
      
      // 幸运收获是概率性的
      const luckyHarvestChance = geneStats.tag.includes('farmLuckyHarvest') ? 0.01 : 0;
      const luckyHarvestMult = this.$store.getters['mult/get']('farmLuckyHarvestMult', geneStats.mult.farmLuckyHarvestMult.baseValue);
      
      // 计算 allGainBoost 的最小/最大值
      const allGainBoostMin = gnomeBoostBase;
      const allGainBoostMax = gnomeBoostBase * (luckyHarvestChance > 0 ? luckyHarvestMult : 1);
      
      // 金币几率计算
      const goldChanceBase = this.$store.getters['farm/baseGoldChance'](cell.crop) + geneStats.mult.farmGoldChance.baseValue;
      const goldChanceMult = ((cell.buildingEffect?.gardenGnome ?? 0) / cell.time) * geneStats.mult.farmGoldChance.multValue;
      const goldChance = this.$store.getters['mult/get']('farmGoldChance', goldChanceBase, goldChanceMult);
      
      // 计算金币收获
      if (goldChance > 0) {
        const goldMin = Math.floor(goldChance * allGainBoostMin * cell.grow);
        const goldMax = Math.ceil(goldChance * allGainBoostMax * cell.grow);
        
        if (goldMin === goldMax) {
          harvestItems['farm_gold'] = goldMin;
        } else {
          harvestItems['farm_gold'] = { min: goldMin, max: goldMax };
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
        harvestItems[`farm_${crop.type}`] = cropGainMin;
      } else {
        harvestItems[`farm_${crop.type}`] = { min: cropGainMin, max: cropGainMax };
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
              harvestItems[`farm_${croptype}`] = conversionMin;
            } else {
              harvestItems[`farm_${croptype}`] = { min: conversionMin, max: conversionMax };
            }
          }
        });
      }
      
      // 计算稀有掉落
      const rareDrops = [...(crop.rareDrop || []), ...(geneStats.rareDrop || [])];
      
      rareDrops.forEach(drop => {
        if (!drop || drop.chance === undefined) return;
        
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
          const dropValue = drop.value * (drop.mult || 1);
          harvestItems[drop.name] = { min: 0, max: dropValue };
        }
      });
      
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
        // 如果最小值和最大值相同，只显示一个值
        if (item.min === item.max) {
          return this.$formatNum(item.min);
        }
        
        // 格式化数值进行比较
        const formattedMin = this.$formatNum(item.min);
        const formattedMax = this.$formatNum(item.max);
        
        // 如果格式化后的数值相同，只显示最小值
        if (formattedMin === formattedMax) {
          return formattedMin;
        }
        
        // 如果最小值为0，显示为0~最大值
        if (item.min === 0 && item.max > 0) {
          return `0~${formattedMax}`;
        }
        
        // 否则显示范围
        return `${formattedMin}~${formattedMax}`;
      }
      
      // 如果是单个值，直接显示
      return this.$formatNum(item);
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