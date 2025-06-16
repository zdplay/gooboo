<style scoped>
.crop-button-container {
  position: relative;
  display: inline-block;
}
.crop-level-badge {
  position: absolute;
  color: white;
  font-size: 12px;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
  z-index: 1;
  line-height: 1;
  pointer-events: none;
  border-radius: 2px;
  padding: 1px 3px;
  min-width: 14px;
  text-align: center;
}
.crop-level-badge-small {
  font-size: 10px;
  padding: 1px 2px;
  min-width: 12px;
}
.crop-level-prestige {
  top: 0px;
  right: 0px;
}
.crop-level-current {
  bottom: 0px;
  right: 0px;
}
.crop-level-current-higher {
  color: #4CAF50;
}
</style>

<template>
  <div>
    <div class="d-flex flex-wrap justify-center ma-1">
      <currency v-for="(item, key) in currencies" class="ma-1" :key="'currency-' + key" :name="'farm_' + item">
        <div v-if="rareDropSource[`farm_${item}`]">
          掉落作物：
          <v-chip v-for="crop in rareDropSource[`farm_${item}`]" :key="crop" class="ma-1 balloon-text-dynamic" :color="crops[crop].color" small label>
            <v-icon class="mr-1">{{ crops[crop].icon }}</v-icon>
            {{ $vuetify.lang.t(`$vuetify.farm.crop.${ crop }`) }}
          </v-chip>
        </div>
      </currency>
    </div>
    <template v-if="useLegacySelect">
      <div class="d-flex flex-wrap justify-center ma-1">
        <template v-for="(item, key) in crops">
          <div v-if="item.found" class="crop-button-container ma-1" :key="'crop-' + key">
            <v-btn :data-cy="`farm-crop-${ key }`" class="px-2" :class="{'selected-primary': selectedCropName === key}" min-width="0" :color="item.color" @click="selectCrop(key)">
              <v-icon>{{ item.icon }}</v-icon>
            </v-btn>
            <!-- 等级显示 -->
            <span v-if="showIconLevel" class="crop-level-badge crop-level-prestige" :class="{'crop-level-badge-small': $vuetify.breakpoint.smAndDown}">
              {{ item.levelMax || 0 }}
            </span>
            <span v-if="showIconLevel" class="crop-level-badge crop-level-current" :class="{'crop-level-badge-small': $vuetify.breakpoint.smAndDown, 'crop-level-current-higher': (item.level || 0) > (item.levelMax || 0)}">
              {{ item.level || 0 }}
            </span>
          </div>
        </template>
      </div>
      <div class="d-flex flex-wrap justify-center ma-1">
        <template v-for="(item, key) in buildings">
          <v-btn v-if="item.max > 0 && item.cacheAmount < item.max" class="ma-1 px-2" min-width="0" :key="'building-' + key" @click="selectBuilding(key)">
            <v-icon class="mr-2">{{ item.icon }}</v-icon>
            <div>{{ $formatNum(item.max - item.cacheAmount) + ' / ' + $formatNum(item.max) }}</div>
          </v-btn>
        </template>
      </div>
    </template>
    <div v-else class="ma-1">
      <v-select class="w-100" outlined hide-details clearable item-value="name" v-model="selectedPlaceable" :items="placeableList" @change="selectPlaceable">
        <template v-slot:selection="{ item }"><placeable-select-display :item="item" is-simple></placeable-select-display></template>
        <template v-slot:item="{ item }"><placeable-select-display :item="item"></placeable-select-display></template>
      </v-select>
    </div>
    <div v-if="unlock.farmFertilizer.see && selectedCropName" class="d-flex flex-wrap justify-center ma-1">
      <consumable v-for="(item, key) in fertilizers" class="ma-1" :key="'fertilizer-' + key" :name="`farm_${key}`" :is-selected="selectedFertilizerName === key" @click="selectFertilizer(key)">
        <fertilizer-card :name="key"></fertilizer-card>
      </consumable>
    </div>
    <crop-card class="ma-1" v-if="selectedCropName" :name="selectedCropName"></crop-card>
    <building-card class="ma-1" v-if="selectedBuildingName" :name="selectedBuildingName"></building-card>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Consumable from '../../render/Consumable.vue';
import Currency from '../../render/Currency.vue';
import BuildingCard from './BuildingCard.vue';
import CropCard from './CropCard.vue';
import FertilizerCard from './FertilizerCard.vue';
import PlaceableSelectDisplay from './PlaceableSelectDisplay.vue';

export default {
  components: { Currency, CropCard, FertilizerCard, Consumable, BuildingCard, PlaceableSelectDisplay },
  data: () => ({
    currencies: ['vegetable', 'berry', 'grain', 'flower', 'gold', 'seedHull', 'grass', 'petal', 'bug', 'butterfly', 'ladybug', 'spider', 'bee', 'mysteryStone', 'goldenPetal', 'smallSeed'],
    selectedPlaceable: null
  }),
  computed: {
    ...mapState({
      crops: state => state.farm.crop,
      buildings: state => state.farm.building,
      selectedCropName: state => state.farm.selectedCropName,
      selectedBuildingName: state => state.farm.selectedBuildingName,
      selectedFertilizerName: state => state.farm.selectedFertilizerName,
      unlock: state => state.unlock,
      consumable: state => state.consumable
    }),
    fertilizers() {
      let obj = {};

      const selectedCropType = this.selectedCropName ? this.crops[this.selectedCropName].type : null;

      for (const [key, elem] of Object.entries(this.$store.state.farm.fertilizer)) {
        if (this.consumable[`farm_${key}`].found && (elem.type === 'all' || elem.type === selectedCropType)) {
          obj[key] = elem;
        }
      }

      return obj;
    },
    placeableList() {
      let arr = [];
      for (const [key, elem] of Object.entries(this.crops)) {
        if (elem.found) {
          arr.push({...elem, name: `crop_${ key }`});
        }
      }
      for (const [key, elem] of Object.entries(this.buildings)) {
        if (elem.max > 0 && elem.cacheAmount < elem.max) {
          arr.push({...elem, name: `building_${ key }`});
        }
      }
      return arr;
    },
    useLegacySelect() {
      return this.$store.state.system.settings.general.items.useLegacyFarmSelect.value;
    },
    showIconLevel() {
      return this.$store.state.system.settings.experiment.items.showFarmIconLevel.value;
    },
    rareDropSource() {
      const drops = {};

      // Process crop rare drops
      for(const cropName in this.crops) {
        const crop = this.crops[cropName];
        if (crop.rareDrop) {
          crop.rareDrop.forEach((drop) => {
            // Only show found rare drops
            if (drop.found) {
              if (drops[drop.name] === undefined) {
                drops[drop.name] = [];
              }
              if (!drops[drop.name].includes(cropName)) {
                drops[drop.name].push(cropName);
              }
            }
          });
        }
        
        // Check crop gene stats for rare drops
        const cropGeneStats = this.$store.getters['farm/cropGeneStats'](cropName);
        if (cropGeneStats && cropGeneStats.rareDrop && cropGeneStats.rareDrop.length > 0) {
          cropGeneStats.rareDrop.forEach(drop => {
            if (drops[drop.name] === undefined) {
              drops[drop.name] = [];
            }
            if (!drops[drop.name].includes(cropName)) {
              drops[drop.name].push(cropName);
            }
          });
        }
      }
      
      // Check grass gene
      const genes = this.$store.state.farm.gene;
      if (genes && genes.grass && genes.grass.active) {
        if (drops['farm_grass'] === undefined) {
          drops['farm_grass'] = [];
        }
        if (!drops['farm_grass'].includes('gene_system')) {
          drops['farm_grass'].push('gene_system');
        }
      }
      
      return drops;
    }
  },
  mounted() {
    if (this.selectedCropName !== null) {
      this.selectedPlaceable = `crop_${ this.selectedCropName }`;
    } else if (this.selectedBuildingName !== null) {
      this.selectedPlaceable = `building_${ this.selectedBuildingName }`;
    }
  },
  methods: {
    selectPlaceable() {
      if (this.selectedPlaceable === null) {
        this.$store.commit('farm/updateKey', {key: 'selectedCropName', value: null});
        this.$store.commit('farm/updateKey', {key: 'selectedBuildingName', value: null});
        this.$store.commit('farm/updateKey', {key: 'selectedFertilizerName', value: null});
        this.$store.commit('farm/updateKey', {key: 'deleting', value: false});
      } else {
        const split = this.selectedPlaceable.split('_');
        if (split[0] === 'crop') {
          this.selectCrop(split[1]);
        } else if (split[0] === 'building') {
          this.selectBuilding(split[1]);
        }
      }
    },
    selectCrop(name) {
      this.$store.commit('farm/updateKey', {key: 'selectedBuildingName', value: null});
      this.$store.commit('farm/updateKey', {key: 'selectedFertilizerName', value: null});
      this.$store.commit('farm/updateKey', {key: 'deleting', value: false});
      this.$store.commit('farm/updateKey', {key: 'selectedCropName', value: this.selectedCropName === name ? null : name});
    },
    selectBuilding(name) {
      this.$store.commit('farm/updateKey', {key: 'selectedCropName', value: null});
      this.$store.commit('farm/updateKey', {key: 'selectedFertilizerName', value: null});
      this.$store.commit('farm/updateKey', {key: 'deleting', value: false});
      this.$store.commit('farm/updateKey', {key: 'selectedBuildingName', value: this.selectedBuildingName === name ? null : name});
    },
    selectFertilizer(name) {
      this.$store.commit('farm/updateKey', {key: 'selectedBuildingName', value: null});
      this.$store.commit('farm/updateKey', {key: 'deleting', value: false});
      this.$store.commit('farm/updateKey', {key: 'selectedFertilizerName', value: this.selectedFertilizerName === name ? null : name});
    }
  }
}
</script>
