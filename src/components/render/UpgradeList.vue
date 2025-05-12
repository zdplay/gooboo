<style scoped>
.upgrade-pagination {
  position: sticky;
  z-index: 2;
  top: 0;
}
.upgrade-pagination-mobile {
  top: 104px;
}
.upgrade-pagination-mobile-notabs {
  top: 56px;
}
.upgrade-queue-speed {
  position: absolute;
  right: 8px;
}
.filter-container {
  display: flex;
  align-items: center;
  margin: 8px;
}
</style>

<template>
  <div v-if="items.length > 0">
    <div class="d-flex upgrade-pagination justify-center align-center bg-tile-default rounded-b elevation-2 mx-2" :class="{'upgrade-pagination-mobile': $vuetify.breakpoint.smAndDown && !noTabs, 'upgrade-pagination-mobile-notabs': $vuetify.breakpoint.smAndDown && noTabs, 'pr-10': showQueueSpeed}" v-if="pages > 1 || requirementStat.length > 0">
      <v-pagination v-if="pages > 1" v-model="page" :length="pages" :total-visible="7"></v-pagination>
      <gb-tooltip v-for="item in requirementFiltered" :key="item.key" :min-width="0">
        <template v-slot:activator="{ on, attrs }">
          <v-chip small label class="flex-shrink-0 ma-1 px-2" v-bind="attrs" v-on="on"><v-icon class="mr-1">mdi-chevron-double-up</v-icon>{{ $formatNum(requirementNext[item.key]) }}</v-chip>
        </template>
        <div class="mt-0">{{ $vuetify.lang.t('$vuetify.upgrade.keyset.default.nextRequirement') }}{{ $formatNum(requirementNext[item.key]) }} {{ $vuetify.lang.t(`$vuetify.stat.${ item.stat }.description`) }}</div>
      </gb-tooltip>
      <gb-tooltip v-for="(item, index) in requirementCustom" :key="index" :min-width="0">
        <template v-slot:activator="{ on, attrs }">
          <v-chip small label class="flex-shrink-0 ma-1 px-2" v-bind="attrs" v-on="on"><v-icon class="mr-1">mdi-chevron-double-up</v-icon>{{ $formatNum(item.value) }}</v-chip>
        </template>
        <div class="mt-0">{{ item.text }}</div>
      </gb-tooltip>
      <gb-tooltip v-if="speedMultName" :title-text="$vuetify.lang.t(`$vuetify.mult.${speedMultName}`)">
        <template v-slot:activator="{ on, attrs }">
          <div class="flex-shrink-0 upgrade-queue-speed" v-bind="attrs" v-on="on"><v-icon>mdi-chevron-double-right</v-icon></div>
        </template>
        <stat-breakdown :name="speedMultName"></stat-breakdown>
      </gb-tooltip>
    </div>
    
    <div class="filter-container">
      <v-select
        outlined
        dense
        hide-details
        clearable
        class="mx-2"
        v-model="selectedMaterial"
        :items="availableMaterials"
        label="按材料筛选"
        @change="page = 1"
      >
        <template v-slot:selection="{ item }">
          <v-icon small class="mr-2">{{ getMaterialIcon(item) }}</v-icon>
          {{ $vuetify.lang.t(`$vuetify.currency.${ item }.name`) }}
        </template>
        <template v-slot:item="{ item }">
          <v-icon small class="mr-2">{{ getMaterialIcon(item) }}</v-icon>
          {{ $vuetify.lang.t(`$vuetify.currency.${ item }.name`) }}
        </template>
      </v-select>
      <v-btn small class="ml-2" @click="toggleSatisfyMode" :color="satisfyMode ? 'error' : 'primary'">
        {{ satisfyMode ? '清空' : '满足' }}
      </v-btn>
    </div>
    
    <v-row class="pa-1" no-gutters>
      <v-col class="pa-1" v-for="(item, key) in finalItems" :key="`${feature}-${type}-${key}`" :cols="cols">
        <upgrade :name="item" :disabled="isFrozen" :upgrade-translation="upgradeTranslation" :translation-set="translationSet">
          <slot :upgrade-name="item"></slot>
        </upgrade>
      </v-col>
    </v-row>
  </div>
  <div v-else>
    <div class="text-center">{{ $vuetify.lang.t(`$vuetify.upgrade.keyset.${ translationSet }.notFound`) }}</div>
    <alert-text v-if="type === 'book'" class="ma-2" type="info">{{ $vuetify.lang.t(`$vuetify.upgrade.${ feature === 'village' ? 'bookNotFoundVillage' : 'bookNotFound' }`) }}</alert-text>
  </div>
</template>

<script>
import { capitalize } from '../../js/utils/format';
import AlertText from '../partial/render/AlertText.vue';
import StatBreakdown from './StatBreakdown.vue';
import Upgrade from './Upgrade.vue';

export default {
  components: { Upgrade, StatBreakdown, AlertText },
  props: {
    feature: {
      type: String,
      required: true
    },
    subfeature: {
      type: Number,
      required: false,
      default: 0
    },
    type: {
      type: String,
      required: false,
      default: 'regular'
    },
    cols: {
      type: Number,
      required: false,
      default: 12
    },
    requirementStat: {
      type: Array,
      required: false,
      default: (() => [])
    },
    requirementCustom: {
      type: Array,
      required: false,
      default: (() => [])
    },
    noTabs: {
      type: Boolean,
      required: false,
      default: false
    },
    showQueueSpeed: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data: () => ({
    page: 1,
    selectedMaterial: null,
    satisfyMode: false,
    originalItems: null
  }),
  mounted() {
    const cachePage = this.$store.state.system.cachePage[this.cacheKey];
    if (cachePage !== undefined) {
      this.page = Math.min(Math.max(cachePage, 1), this.pages);
    }
  },
  computed: {
    baseItems() {
      return [...this.$store.state.upgrade.cache[`${this.feature}_${this.subfeature}_${this.type}`]];
    },
    items() {
      if (this.satisfyMode) {
        return this.getSatisfyItems();
      }
      
      return this.baseItems.filter(elem => {
        const upgrade = this.$store.state.upgrade.item[elem];
        const baseRequirement = upgrade.requirement(upgrade.level);
        
        // 如果没有选择材料筛选，或者没有通过基本要求，直接返回基本要求结果
        if (!this.selectedMaterial || !baseRequirement) {
          return baseRequirement;
        }
        
        // 检查升级所需的材料是否包含选中的材料
        const price = upgrade.price(upgrade.level);
        return price && Object.keys(price).includes(this.selectedMaterial);
      });
    },
    finalItems() {
      if (this.upgradeLimit === null) {
        return this.items;
      }
      return this.items.slice(this.upgradeLimit * (this.page - 1), this.upgradeLimit * this.page);
    },
    upgradeLimit() {
      return ['smeltery', 'cindersProducer'].includes(this.type) && this.$vuetify.breakpoint.xlOnly ? 12 : this.$store.state.system.settings.performance.items.upgradeListItems.value;
    },
    pages() {
      return this.upgradeLimit === null ? null : Math.ceil(this.items.length / this.upgradeLimit);
    },
    requirementNext() {
      return this.requirementStat.map(statName => {
        let next = null;
        const stat = this.$store.state.stat[statName].total;
        this.baseItems.forEach(elem => {
          const upgrade = this.$store.state.upgrade.item[elem];
          if (upgrade.requirementValue !== null && upgrade.requirementStat === statName && stat < upgrade.requirementValue && (next === null || upgrade.requirementValue < next)) {
            next = upgrade.requirementValue;
          }
        });
        return next;
      });
    },
    requirementFiltered() {
      return this.requirementStat.map((el, key) => {
        return {stat: el, key};
      }).filter(el => {
        return this.requirementNext[el.key] !== null;
      });
    },
    speedMultName() {
      return this.showQueueSpeed ? ('queueSpeed' + capitalize(this.feature) + capitalize(this.type)) : null;
    },
    isFrozen() {
      return !['premium', 'book'].includes(this.type) && !!this.$store.state.cryolab[this.feature] && this.$store.state.cryolab[this.feature].active;
    },
    upgradeTranslation() {
      if (this.feature === 'village' && this.type === 'building') {
        return '$vuetify.upgrade.build';
      }
      return undefined;
    },
    translationSet() {
      if (this.feature === 'village' && this.type === 'building') {
        return 'building';
      }
      return 'default';
    },
    cacheKey() {
      return `${ this.feature }_${ this.subfeature }_${ this.type }`;
    },
    availableMaterials() {
      // 收集所有升级所需的材料
      const materials = new Set();
      this.baseItems.forEach(elem => {
        const upgrade = this.$store.state.upgrade.item[elem];
        if (upgrade.requirement(upgrade.level)) {
          const price = upgrade.price(upgrade.level);
          if (price) {
            Object.keys(price).forEach(material => materials.add(material));
          }
        }
      });
      return Array.from(materials).sort().reverse();
    }
  },
  methods: {
    getMaterialIcon(material) {
      return this.$store.state.currency[material]?.icon || 'mdi-help-circle';
    },
    printMaterialsToConsole() {
      console.group(`升级材料信息 - ${this.feature} (${this.type})`);
      
      // 创建材料到升级的映射
      const materialToUpgrades = {};
      
      this.baseItems.forEach(elem => {
        const upgrade = this.$store.state.upgrade.item[elem];
        if (upgrade.requirement(upgrade.level)) {
          const price = upgrade.price(upgrade.level);
          if (price) {
            Object.keys(price).forEach(material => {
              if (!materialToUpgrades[material]) {
                materialToUpgrades[material] = [];
              }
              materialToUpgrades[material].push({
                name: elem,
                displayName: this.$vuetify.lang.t(`$vuetify.upgrade.${elem.split('_')[1]}`),
                amount: price[material]
              });
            });
          }
        }
      });
      
      // 打印每种材料及其相关升级
      Object.keys(materialToUpgrades).sort().forEach(material => {
        const materialName = this.$vuetify.lang.t(`$vuetify.currency.${material}.name`);
        console.group(`${materialName} (${material})`);
        
        materialToUpgrades[material].forEach(upgrade => {
          console.log(`${upgrade.displayName}: ${upgrade.amount}`);
        });
        
        console.groupEnd();
      });
      
      console.groupEnd();
    },
    toggleSatisfyMode() {
      this.satisfyMode = !this.satisfyMode;
      this.page = 1;
    },
    getSatisfyItems() {
      // 如果没有选择材料，则只显示"建造"可用的升级
      if (!this.selectedMaterial) {
        const result = this.baseItems.filter(elem => {
          const upgrade = this.$store.state.upgrade.item[elem];
          
          // 检查是否满足基本要求
          const baseRequirement = upgrade.requirement(upgrade.level);
          if (!baseRequirement) {
            return false;
          }
          
          // 使用游戏内部的canAfford方法检查是否可以建造
          const feature = elem.split('_')[0];
          const name = elem.split('_')[1];
          const canAfford = this.$store.getters['upgrade/canAfford'](feature, name);
          
          return canAfford;
        });
        
        return result;
      } else {
        const result = this.baseItems.filter(elem => {
          const upgrade = this.$store.state.upgrade.item[elem];
          
          // 检查是否满足基本要求
          const baseRequirement = upgrade.requirement(upgrade.level);
          if (!baseRequirement) {
            return false;
          }
          
          // 检查是否包含选定材料
          const price = upgrade.price(upgrade.level);
          if (!price || !Object.keys(price).includes(this.selectedMaterial)) {
            return false;
          }
          
          // 使用游戏内部的canAfford方法检查是否可以建造
          const feature = elem.split('_')[0];
          const name = elem.split('_')[1];
          const canAfford = this.$store.getters['upgrade/canAfford'](feature, name);
          
          return canAfford;
        });
        
        return result;
      }
    }
  },
  watch: {
    page(newVal) {
      this.$store.commit('system/updateCachePageKey', {key: this.cacheKey, value: newVal});
    },
    pages(newVal) {
      if (this.page > newVal) {
        this.page = Math.max(newVal, 1);
      } else if (this.page <= 0 && newVal > 0) {
        this.page = 1;
      }
    }
  }
}
</script>
