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
  margin: 0 -4px;
}
.harvest-item {
  margin: 4px;
  display: inline-flex;
  align-items: center;
  border-radius: 16px;
  padding: 2px 8px;
  background-color: rgba(0, 0, 0, 0.1);
  transition: background-color 0.2s ease-in-out;
}
.harvest-item:hover {
  background-color: rgba(0, 0, 0, 0.2);
}
.harvest-item-icon {
  margin-right: 4px;
  -webkit-text-stroke: 1px rgba(0, 0, 0, 0.5);
  text-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
}
.harvest-item-text {
  font-size: 14px;
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

    <template v-if="readyHarvests && Object.keys(readyHarvests).length > 0">
      <div class="harvest-subtitle">可收获的作物</div>
      <div class="harvest-items">
        <template v-for="(item, itemName) in readyHarvests">
          <gb-tooltip :key="itemName" :title-text="getTranslatedName(itemName)">
            <template v-slot:activator="{ on, attrs }">
              <div class="harvest-item v-chip v-chip--label v-size--small" 
                  :class="[$vuetify.theme.dark ? 'theme--dark darken-3' : 'theme--light lighten-3', getItemColor(itemName)]"
                  v-bind="attrs" v-on="on">
                <v-icon small :color="getItemColor(itemName)" class="harvest-item-icon">{{ getItemIcon(itemName) }}</v-icon>
                <span class="harvest-item-text">{{ formatItemAmount(item) }}</span>
              </div>
            </template>
            <div>
              <div>{{ getTranslatedName(itemName) }}</div>
              <div class="text-center mt-2">
                <span>当前拥有: {{ $formatNum($store.state.currency[itemName]?.value || 0, true) }}</span>
                <template v-if="$store.state.currency[itemName]?.cap !== null && $store.state.currency[itemName]?.cap !== undefined">
                  <span> / </span>
                  <span>{{ $formatNum($store.state.currency[itemName]?.cap, true) }}</span>
                </template>
              </div>
            </div>
          </gb-tooltip>
        </template>
      </div>
    </template>
    
    <template v-if="futureHarvests && futureHarvests.length > 0">
      <div v-for="(harvest, index) in futureHarvests" :key="index" class="harvest-group">
        <div class="harvest-time">{{ harvest.timeLabel }}</div>
        <div class="harvest-items">
          <template v-for="(item, itemName) in harvest.items">
            <gb-tooltip :key="itemName" :title-text="getTranslatedName(itemName)">
              <template v-slot:activator="{ on, attrs }">
                <div class="harvest-item v-chip v-chip--label v-size--small" 
                    :class="[$vuetify.theme.dark ? 'theme--dark darken-3' : 'theme--light lighten-3', getItemColor(itemName)]"
                    v-bind="attrs" v-on="on">
                  <v-icon small :color="getItemColor(itemName)" class="harvest-item-icon">{{ getItemIcon(itemName) }}</v-icon>
                  <span class="harvest-item-text">{{ formatItemAmount(item) }}</span>
                </div>
              </template>
              <div>
                <div>{{ getTranslatedName(itemName) }}</div>
                <div class="text-center mt-2">
                  <span>当前拥有: {{ $formatNum($store.state.currency[itemName]?.value || 0, true) }}</span>
                  <template v-if="$store.state.currency[itemName]?.cap !== null && $store.state.currency[itemName]?.cap !== undefined">
                    <span> / </span>
                    <span>{{ $formatNum($store.state.currency[itemName]?.cap, true) }}</span>
                  </template>
                </div>
              </div>
            </gb-tooltip>
          </template>
        </div>
      </div>
    </template>
    
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
      this.readyHarvests = {};
      this.futureHarvests = [];
      
      const field = this.$store.state.farm.field;
      const timeGroups = {};
      
      for (let y = 0; y < field.length; y++) {
        for (let x = 0; x < field[y].length; x++) {
          const cell = field[y][x];
          if (cell && cell.type === 'crop') {
            if (cell.grow >= 1) {
              if (!timeGroups['ready']) {
                timeGroups['ready'] = [];
              }
              timeGroups['ready'].push({ x, y, cell });
            } 
            else if (cell.cache && cell.cache.grow > 0) {
              const timeInSeconds = Math.ceil(60 * (1 - cell.grow) / cell.cache.grow);
              const timeToHarvest = Math.ceil(timeInSeconds / 60);
              if (!timeGroups[timeToHarvest]) {
                timeGroups[timeToHarvest] = [];
              }
              timeGroups[timeToHarvest].push({ x, y, cell });
            }
          }
        }
      }
      
      if (timeGroups['ready'] && timeGroups['ready'].length > 0) {
        const readyItems = {};
        
        timeGroups['ready'].forEach(({ x, y, cell }) => {
          const estimatedItems = this.estimateHarvest(x, y, cell);
          
          Object.keys(estimatedItems).forEach(itemName => {
            if (!readyItems[itemName]) {
              readyItems[itemName] = { min: 0, max: 0 };
            }
            this.mergeItemsWithCap(readyItems, estimatedItems[itemName], itemName);
          });
        });
        
        this.readyHarvests = this.sortHarvestItems(readyItems);
      }
      
      const futureTimes = Object.keys(timeGroups)
        .filter(time => time !== 'ready')
        .map(time => parseInt(time))
        .sort((a, b) => a - b);
      
      const within3Hours = [];
      let beyond3HoursItems = {};
      
      futureTimes.forEach(time => {
        const cells = timeGroups[time];
        const harvestItems = {};
        
        cells.forEach(({ x, y, cell }) => {
          const estimatedItems = this.estimateHarvest(x, y, cell, true);
          
          Object.keys(estimatedItems).forEach(itemName => {
            if (!harvestItems[itemName]) {
              harvestItems[itemName] = { min: 0, max: 0 };
            }
            this.mergeItemsWithCap(harvestItems, estimatedItems[itemName], itemName);
          });
        });
        
        if (Object.keys(harvestItems).length > 0) {
          const sortedItems = this.sortHarvestItems(harvestItems);
          
          if (time <= 180) {
            const timeLabel = `${this.$formatTime(time * 60)}后可获取`;
            
            within3Hours.push({
              time: time,
              timeLabel: timeLabel,
              items: sortedItems
            });
          } else {
            Object.keys(sortedItems).forEach(itemName => {
              if (!beyond3HoursItems[itemName]) {
                beyond3HoursItems[itemName] = { min: 0, max: 0 };
              }
              beyond3HoursItems[itemName].min += sortedItems[itemName].min;
              beyond3HoursItems[itemName].max += sortedItems[itemName].max;
            });
          }
        }
      });
      
      within3Hours
        .sort((a, b) => a.time - b.time)
        .forEach(harvest => {
          this.futureHarvests.push({
            timeLabel: harvest.timeLabel,
            items: harvest.items
          });
        });
      
      if (Object.keys(beyond3HoursItems).length > 0) {
        this.futureHarvests.push({
          timeLabel: `3小时以后可获取`,
          items: this.sortHarvestItems(beyond3HoursItems)
        });
      }
    },
    
    sortHarvestItems(items) {
      const sortedItems = {};
      ['farm_vegetable', 'farm_berry', 'farm_grain', 'farm_flower'].forEach(type => {
        if (items[type]) {
          sortedItems[type] = items[type];
        }
      });
      if (items['farm_gold']) {
        sortedItems['farm_gold'] = items['farm_gold'];
      }
      Object.keys(items).forEach(key => {
        if (!sortedItems[key] && !['farm_vegetable', 'farm_berry', 'farm_grain', 'farm_flower', 'farm_gold'].includes(key)) {
          sortedItems[key] = items[key];
        }
      });
      
      return sortedItems;
    },
    
    estimateHarvest(x, y, cell, isFuture = false) {
      const harvestItems = {};
      if (isFuture) {
        cell = { ...cell, grow: 1 };
      } else if (cell.type !== 'crop' || cell.grow < 1) {
        return harvestItems;
      }
      
      const crop = this.$store.state.farm.crop[cell.crop];
      if (!crop) {
        return harvestItems;
      }
      
      const geneStats = this.$store.getters['farm/cropGeneStats'](cell.crop, cell.fertilizer);

      const gnomeBoostBase = 0.04 * ((cell.buildingEffect?.gnomeBoost ?? 0) / cell.time) + 1;

      const luckyHarvestChance = geneStats.tag.includes('farmLuckyHarvest') ? 0.01 : 0;
      const luckyHarvestMult = this.$store.getters['mult/get']('farmLuckyHarvestMult', geneStats.mult.farmLuckyHarvestMult.baseValue);

      const allGainBoostMin = isNaN(gnomeBoostBase) ? 1 : gnomeBoostBase;
      const allGainBoostMax = isNaN(gnomeBoostBase) ? 1 : (gnomeBoostBase * (luckyHarvestChance > 0 ? luckyHarvestMult : 1));

      const goldChanceBase = this.$store.getters['farm/baseGoldChance'](cell.crop) + geneStats.mult.farmGoldChance.baseValue;
      const goldChanceMult = ((cell.buildingEffect?.gardenGnome ?? 0) / cell.time) * geneStats.mult.farmGoldChance.multValue;
      const goldChance = this.$store.getters['mult/get']('farmGoldChance', goldChanceBase, goldChanceMult);

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

      const rareDrops = [...(crop.rareDrop || []), ...(geneStats.rareDrop || [])];

      const findGeneRareDrop = (dropName) => {
        for (const geneName in this.$store.state.farm.gene) {
          const gene = this.$store.state.farm.gene[geneName];
          if (!gene.active) continue;

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

        if (drop.name === 'farm_grass' && drop.value === undefined) {
          const geneEffect = findGeneRareDrop(drop.name);
          if (geneEffect) {
            drop.value = geneEffect.value;
          }
        }

        let effectiveChance = drop.chance;
        if (effectiveChance <= 0) {

          const rareDropChance = this.$store.getters['mult/get']('farmRareDropChance', effectiveChance);
          if (rareDropChance <= 0) return;
          effectiveChance = rareDropChance;
        }
        
        const pinwheelMult = (((cell.buildingEffect?.pinwheel ?? 0) / cell.time) * 0.015) + 1;
        const dropChance = effectiveChance * pinwheelMult;
        
        if (dropChance > 0) {
          let dropValue = drop.value;

          if (drop.name === 'farm_grass' && (dropValue === undefined || dropValue === 0)) {

            const grassGene = this.$store.state.farm.gene.grass;
            if (grassGene && grassGene.active) {
              dropValue = 8;

              if (grassGene.level > 0) {
                dropValue += grassGene.level;
              }
            } else {
              dropValue = 40;
            }
          }
          
          const finalDropValue = dropValue * (drop.mult || 1);
          const safeDropValue = isNaN(finalDropValue) ? 0 : finalDropValue;

          if (drop.name === 'farm_grass') {

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
      

      if (cell.crop === 'corn') {

        const grassCap = this.$store.state.currency['farm_grass']?.cap || 200;

        if (!harvestItems['farm_grass']) {
          const cornGrassMin = 0;
          const cornGrassMax = Math.min(40, grassCap);
          
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

        if (this.$store.state.currency[itemName]) {
          return this.$vuetify.lang.t(`$vuetify.currency.${itemName}.name`);
        } 

        else if (this.$store.state.consumable[itemName]) {
          return this.$vuetify.lang.t(`$vuetify.consumable.${itemName}.name`);
        }
      } else {

        if (this.$store.state.consumable[itemName]) {
          return this.$vuetify.lang.t(`$vuetify.consumable.${itemName}.name`);
        }
      }

      return itemName.replace('farm_', '');
    },
    
    formatItemAmount(item) {
      if (typeof item === 'object' && item.min !== undefined && item.max !== undefined) {

        const min = isNaN(item.min) ? 0 : item.min;
        const max = isNaN(item.max) ? 0 : item.max;

        if (min === max) {
          return this.$formatNum(min);
        }
        
        const formattedMin = this.$formatNum(min);
        const formattedMax = this.$formatNum(max);

        if (formattedMin === formattedMax) {
          return formattedMin;
        }

        if (min === 0 && max > 0) {
          return `0~${formattedMax}`;
        }

        return `${formattedMin}~${formattedMax}`;
      }

      const value = isNaN(item) ? 0 : item;

      return this.$formatNum(value);
    },

    getCurrencyCap(currencyName) {
      if (!currencyName || !this.$store.state.currency[currencyName]) {
        return Infinity;
      }
      
      const currency = this.$store.state.currency[currencyName];
      return (currency && currency.cap !== undefined && currency.cap !== null) ? currency.cap : Infinity;
    },
    

    mergeItemsWithCap(items, newItem, itemName) {

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

        if (typeof items[itemName] === 'object' && typeof newItem === 'object') {

          const newMin = Math.min(items[itemName].min + newItem.min, cap);
          const newMax = Math.min(items[itemName].max + newItem.max, cap);
          
          items[itemName].min = newMin;
          items[itemName].max = newMax;
        } 

        else if (typeof items[itemName] === 'object' && typeof newItem === 'number') {

          const newMin = Math.min(items[itemName].min + newItem, cap);
          const newMax = Math.min(items[itemName].max + newItem, cap);
          
          items[itemName].min = newMin;
          items[itemName].max = newMax;
        }

        else if (typeof items[itemName] === 'number' && typeof newItem === 'object') {

          const newMin = Math.min(items[itemName] + newItem.min, cap);
          const newMax = Math.min(items[itemName] + newItem.max, cap);
          
          items[itemName] = {
            min: newMin,
            max: newMax
          };
        }

        else {

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