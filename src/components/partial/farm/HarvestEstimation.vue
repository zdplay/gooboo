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
        <price-tag
          v-for="(item, itemName) in readyHarvests"
          :key="itemName"
          class="ma-1"
          :currency="itemName"
          :amount="item"
          add
        />
      </div>
    </template>
    
    <template v-if="futureHarvests && futureHarvests.length > 0">
      <div v-for="(harvest, index) in futureHarvests" :key="index" class="harvest-group">
        <div class="harvest-time">{{ harvest.timeLabel }}</div>
        <div class="harvest-items">
          <price-tag
            v-for="(item, itemName) in harvest.items"
            :key="itemName"
            class="ma-1"
            :currency="itemName"
            :amount="item"
            add
          />
        </div>
      </div>
    </template>
    
    <div v-if="(!readyHarvests || Object.keys(readyHarvests).length === 0) && (!futureHarvests || futureHarvests.length === 0)" class="text-center">
      
    </div>
  </div>
</template>

<script>
import { capitalize } from '../../../js/utils/format';
import { chance, randomRound } from '../../../js/utils/random';
import PriceTag from '../../render/PriceTag.vue';

export default {
  components: { PriceTag },
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
        
        timeGroups['ready'].forEach(({ cell }) => {
          const estimatedItems = this.estimateHarvest(cell);

          Object.keys(estimatedItems).forEach(itemName => {
            if (!readyItems[itemName]) {
              readyItems[itemName] = 0;
            }
            readyItems[itemName] += estimatedItems[itemName];
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
        
        cells.forEach(({ cell }) => {
          const estimatedItems = this.estimateHarvest(cell, true);

          Object.keys(estimatedItems).forEach(itemName => {
            if (!harvestItems[itemName]) {
              harvestItems[itemName] = 0;
            }
            harvestItems[itemName] += estimatedItems[itemName];
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
                beyond3HoursItems[itemName] = 0;
              }
              beyond3HoursItems[itemName] += sortedItems[itemName];
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
          timeLabel: `未来可获取`,
          items: this.sortHarvestItems(beyond3HoursItems)
        });
      }
    },
    
    sortHarvestItems(items) {
      const sortedItems = {};
      
      // 基础农作物资源
      ['farm_vegetable', 'farm_berry', 'farm_grain', 'farm_flower'].forEach(type => {
        if (items[type]) {
          sortedItems[type] = items[type];
        }
      });
      
      // 金币
      if (items['farm_gold']) {
        sortedItems['farm_gold'] = items['farm_gold'];
      }
      
      // 其他在farm.js中定义的材料
      const validMaterials = [
        'farm_seedHull', 'farm_grass', 'farm_petal', 'farm_bug', 
        'farm_butterfly', 'farm_ladybug', 'farm_spider', 'farm_bee', 
        'farm_mysteryStone', 'farm_goldenPetal', 'farm_smallSeed'
      ];
      
      Object.keys(items).forEach(key => {
        if (!sortedItems[key] && validMaterials.includes(key)) {
          sortedItems[key] = items[key];
        }
      });
      
      return sortedItems;
    },
    
    estimateHarvest(cell, isFuture = false) {
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

      // 完全按照原始 harvestCrop 函数的逻辑
      const field = cell; // 在原始代码中是 field，这里是 cell
      // 注意：原始代码中 o.crop 在 harvestAll 调用时是 undefined！
      const rngGen = this.$store.getters['system/getRngById'](`farmCrop_undefined`, field.rng);
      const geneStats = this.$store.getters['farm/cropGeneStats'](field.crop, field.fertilizer);

      const allGainBoost =
          (0.04 * (field.buildingEffect.gnomeBoost ?? 0) / field.time + 1) *
          ((geneStats.tag.includes('farmLuckyHarvest') && chance(0.01, rngGen())) ? this.$store.getters['mult/get']('farmLuckyHarvestMult', geneStats.mult.farmLuckyHarvestMult.baseValue) : 1);

      // Gain currency based on crop value and all bonuses
      if (this.$store.state.unlock && this.$store.state.unlock.farmCurrency && this.$store.state.unlock.farmCurrency.use) {
          const currencies = crop.currencyGain || {};
          for (const [key, elem] of Object.entries(currencies)) {
              const gainAmount = randomRound(elem * this.$store.getters['mult/get'](
                  'farmCropGain',
                  geneStats.mult.farmCropGain.baseValue,
                  ((field.buildingEffect.scarecrow ?? 0) * 0.1 / field.time + 1) * geneStats.mult.farmCropGain.multValue
              ) * allGainBoost * field.grow, rngGen());

              if (gainAmount > 0) {
                  harvestItems[`farm_${key}`] = (harvestItems[`farm_${key}`] || 0) + gainAmount;
              }
          }
      }

      // Gold gain
      const goldAmount = randomRound(
          this.$store.getters['mult/get'](
              'farmGoldChance',
              this.$store.getters['farm/baseGoldChance'](field.crop) + geneStats.mult.farmGoldChance.baseValue,
              ((field.buildingEffect.gardenGnome ?? 0) / field.time) * geneStats.mult.farmGoldChance.multValue
          ) * allGainBoost * field.grow,
          rngGen()
      );
      if (goldAmount) {
          harvestItems['farm_gold'] = (harvestItems['farm_gold'] || 0) + goldAmount;
      }

      // Gain currency based on crop type
      const gainAmount = this.$store.getters['mult/get'](
          'currencyFarm' + capitalize(crop.type) + 'Gain',
          (crop.yield || 0) + geneStats.mult.farmCropGain.baseValue,
          (((field.buildingEffect.flag ?? 0) / field.time) * 0.5 + 1) * geneStats.mult.farmCropGain.multValue
      ) * allGainBoost * field.grow;
      harvestItems[`farm_${crop.type}`] = (harvestItems[`farm_${crop.type}`] || 0) + gainAmount;

      if (geneStats.tag.includes('farmYieldConversion')) {
          ['vegetable', 'berry', 'grain', 'flower'].forEach(croptype => {
              if (crop.type !== croptype) {
                  const conversionAmount = this.$store.getters['mult/get'](
                      'currencyFarm' + capitalize(croptype) + 'Gain',
                      (crop.yield || 0) + geneStats.mult.farmCropGain.baseValue,
                      (((field.buildingEffect.flag ?? 0) / field.time) * 0.5 + 1) * geneStats.mult.farmCropGain.multValue
                  ) * allGainBoost * field.grow;
                  harvestItems[`farm_${croptype}`] = (harvestItems[`farm_${croptype}`] || 0) + conversionAmount * 0.05;
              }
          });
      }

      // Chance to gain rare drops
      let geneDrops = geneStats.rareDrop.map(elem => {
          return {
              name: elem.name,
              type: 'currency',
              chance: elem.chance,
              mult: elem.mult,
              value: elem.amount,
              found: true
          };
      });
      const pinwheelMult = (((field.buildingEffect.pinwheel ?? 0) / field.time) * 0.015) + 1;
      [...crop.rareDrop, ...geneDrops].forEach((elem) => {
          const times = randomRound(this.$store.getters['mult/get'](
              'farmRareDropChance',
              elem.chance + geneStats.mult.farmRareDropChance.baseValue,
              geneStats.mult.farmRareDropChance.multValue * pinwheelMult * elem.mult
          ) * allGainBoost * field.grow, rngGen());
          if (times > 0) {
              switch (elem.type) {
                  case 'consumable':
                      harvestItems[elem.name] = (harvestItems[elem.name] || 0) + elem.value * times;
                      break;
                  case 'currency':
                      harvestItems[elem.name] = (harvestItems[elem.name] || 0) + elem.value * times;
                      break;
              }
          }
      });

      // Chance to gain hunted rare drops
      if (geneStats.tag.includes('farmHunter')) {
          crop.rareDrop.forEach((elem) => {
              chance(this.$store.getters['mult/get'](
                  'farmHuntChance',
                  elem.chance + geneStats.mult.farmRareDropChance.baseValue + geneStats.mult.farmHuntChance.baseValue - elem.hunter * 0.05,
                  geneStats.mult.farmRareDropChance.multValue * geneStats.mult.farmHuntChance.multValue * pinwheelMult * elem.mult
              ) * allGainBoost * field.grow, rngGen());
              // 注意：这里只是为了消耗随机数，保持与原始代码一致
          });
      }

      // Clear field - 免费重植检查
      if (geneStats.tag.includes('farmUnyielding')) {
          chance(0.4, rngGen());
      }
      // 注意：这里只是为了消耗随机数，保持与原始代码一致

      return harvestItems;
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