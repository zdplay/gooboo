<style scoped>
.upgrade-pagination {
  position: sticky;
  z-index: 2;
  top: 0;
}
.upgrade-pagination-mobile {
  top: 56px;
}
.upgrade-pagination-mobile-notabs {
  top: 8px;
}
.upgrade-queue-speed {
  position: absolute;
  right: 8px;
}

.bottom-menu-mode .upgrade-pagination {
  position: fixed;
  top: auto;
  bottom: 104px;
  left: 0;
  right: 0;
  z-index: 4;
}
.bottom-menu-mode .filter-section {
  position: fixed;
  top: auto;
  bottom: 152px;
  left: 0;
  right: 0;
  z-index: 4;
}
/* 为底部菜单模式添加底部间距 */
.bottom-menu-mode {
  padding-bottom: 100px;
}
.filter-container {
  display: flex;
  align-items: center;
  margin: 8px;
  flex-wrap: wrap;
  justify-content: center;
}
.material-button {
  margin: 2px;
  border-radius: 4px;
  min-width: 36px;
  height: 36px;
  transition: transform 0.2s ease;
}
.material-button:hover {
  transform: scale(1.1);
}
.material-button-active {
  border: 2px solid white !important;
  box-shadow: 0 0 8px 3px rgb(0, 255, 242) !important;
}
.material-tooltip {
  max-width: none !important;
  display: inline-block;
  white-space: nowrap;
}
.satisfy-button {
  margin: 2px;
  min-width: 64px;
  height: 36px;
  transition: transform 0.2s ease;
}
.satisfy-button:hover {
  transform: scale(1.1);
}
.list-button {
  margin: 2px;
  min-width: 64px;
  height: 36px;
  transition: transform 0.2s ease;
}
.list-button:hover {
  transform: scale(1.1);
}
.filter-section {
  margin-bottom: 8px;
}
.filter-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 4px;
  justify-content: center;
}
</style>

<template>
  <div :class="{'bottom-menu-mode': bottomPositioned}">
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
    
    <div class="filter-section" v-if="showFilterFeature">
      <div class="filter-container">
        <v-btn 
          small 
          class="satisfy-button" 
          @click="toggleSatisfyMode" 
          :color="satisfyMode ? 'error' : 'primary'" 
          v-if="availableMaterials.length > 0"
        >
          {{ satisfyMode ? '清空' : '满足' }}
        </v-btn>
        
        <v-btn 
          small 
          class="satisfy-button ml-2" 
          @click="toggleUnsatisfyMode" 
          :color="unsatisfyMode ? 'warning' : 'primary'" 
          v-if="availableMaterials.length > 0"
        >
          {{ unsatisfyMode ? '清空' : '未满足' }}
        </v-btn>
        
        <v-btn 
          small 
          class="list-button ml-2" 
          @click="toggleMaterialsRow" 
          :color="showMaterialsRow ? 'info' : 'primary'"
        >
          {{ showMaterialsRow ? '隐藏' : '列表' }}
        </v-btn>
        
        <gb-tooltip v-if="showMaterialsRow" :min-width="250">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              small
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>mdi-help-circle-outline</v-icon>
            </v-btn>
          </template>
          <div class="pa-2">如果材质的所有升级都已折叠，则该材质将显示为半透明。</div>
        </gb-tooltip>
      </div>
      
      <div class="filter-row" v-if="showMaterialsRow">
        <gb-tooltip v-for="material in availableMaterials" :key="material" :min-width="0">
          <template v-slot:activator="{ on, attrs }">
            <v-btn 
              small
              class="material-button"
              :class="{'material-button-active': selectedMaterial === material}"
              :style="materialCollapsedStatus[material] ? 'opacity: 0.2;' : ''"
              :color="getMaterialColor(material)"
              @click="toggleMaterial(material)"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon small :color="selectedMaterial === material ? 'white' : undefined">{{ getMaterialIcon(material) }}</v-icon>
            </v-btn>
          </template>
          <span class="material-tooltip">{{ $vuetify.lang.t(`$vuetify.currency.${material}.name`) }}</span>
        </gb-tooltip>
      </div>
    </div>
    
    <module-queue-list :module-name="feature" :type="type"></module-queue-list>
    <div v-if="items.length > 0">
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
  </div>
</template>

<script>
import { capitalize } from '../../js/utils/format';
import AlertText from '../partial/render/AlertText.vue';
import StatBreakdown from './StatBreakdown.vue';
import Upgrade from './Upgrade.vue';
import ModuleQueueList from './ModuleQueueList.vue';

export default {
  components: { Upgrade, StatBreakdown, AlertText, ModuleQueueList },
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
    unsatisfyMode: false,
    originalItems: null,
    showMaterialsRow: false
  }),
  mounted() {
    const cachePage = this.$store.state.system.cachePage[this.cacheKey];
    if (cachePage !== undefined) {
      this.page = Math.min(Math.max(cachePage, 1), this.pages);
    }
  },
  computed: {
    bottomPositioned() {
      return this.$vuetify.breakpoint.smAndDown && this.$store.state.system.settings.experiment.items.mobileMenuAtBottom.value;
    },
    showFilterFeature() {
      return this.$store.state.system.settings.experiment.items.upgradeFilterFeature.value || false;
    },
    baseItems() {
      return [...this.$store.state.upgrade.cache[`${this.feature}_${this.subfeature}_${this.type}`]];
    },
    items() {
      if (this.satisfyMode) {
        return this.getSatisfyItems();
      }
      
      if (this.unsatisfyMode) {
        return this.getUnsatisfyItems();
      }
      
      return this.baseItems.filter(elem => {
        const upgrade = this.$store.state.upgrade.item[elem];
        const baseRequirement = upgrade.requirement(upgrade.level);
        
        if (!this.selectedMaterial || !baseRequirement) {
          return baseRequirement;
        }
        
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
      return !['premium', 'book'].includes(this.type) && !!this.$store.state.cryolab[this.feature] && this.$store.getters['cryolab/isFeatureFrozen'](this.feature);
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
    },
    materialCollapsedStatus() {
      const materialStatus = {};
      
      // 初始化每个材料的状态对象
      this.availableMaterials.forEach(material => {
        materialStatus[material] = {
          totalUpgrades: 0,
          collapsedUpgrades: 0
        };
      });
      
      // 统计每个材料相关的升级项数量和已折叠数量
      this.baseItems.forEach(elem => {
        const upgrade = this.$store.state.upgrade.item[elem];
        if (upgrade.requirement(upgrade.level)) {
          const price = upgrade.price(upgrade.level);
          if (price) {
            Object.keys(price).forEach(material => {
              if (materialStatus[material]) {
                materialStatus[material].totalUpgrades++;
                if (upgrade.collapse) {
                  materialStatus[material].collapsedUpgrades++;
                }
              }
            });
          }
        }
      });
      
      const result = {};
      Object.keys(materialStatus).forEach(material => {
        const status = materialStatus[material];
        result[material] = status.totalUpgrades > 0 && status.totalUpgrades === status.collapsedUpgrades;
      });
      
      return result;
    },
    enabled() {
      return this.$store.state.system.settings.experiment.items.enableUpgradeQueue.value;
    }
  },
  methods: {
    getMaterialIcon(material) {
      return this.$store.state.currency[material]?.icon || 'mdi-help-circle';
    },
    getMaterialColor(material) {
      return this.$store.state.currency[material]?.color || 'grey';
    },
    toggleMaterial(material) {
      if (this.selectedMaterial === material) {
        this.selectedMaterial = null;
      } else {
        this.selectedMaterial = material;
      }
      this.page = 1;
    },
    toggleMaterialsRow() {
      this.showMaterialsRow = !this.showMaterialsRow;
      if (!this.showMaterialsRow) {
        this.selectedMaterial = null;
        this.page = 1;
      }
    },
    printMaterialsToConsole() {
      console.group(`升级材料信息 - ${this.feature} (${this.type})`);

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
      if (this.satisfyMode) {
        this.unsatisfyMode = false;
      }
      this.page = 1;
    },
    toggleUnsatisfyMode() {
      this.unsatisfyMode = !this.unsatisfyMode;
      if (this.unsatisfyMode) {
        this.satisfyMode = false;
      }
      this.page = 1;
    },
    getSatisfyItems() {
      if (!this.selectedMaterial) {
        const result = this.baseItems.filter(elem => {
          const upgrade = this.$store.state.upgrade.item[elem];
          
          const baseRequirement = upgrade.requirement(upgrade.level);
          if (!baseRequirement) {
            return false;
          }
          
          const feature = elem.split('_')[0];
          const name = elem.split('_')[1];
          const canAfford = this.$store.getters['upgrade/canAfford'](feature, name);
          
          return canAfford;
        });
        
        return result;
      } else {
        const result = this.baseItems.filter(elem => {
          const upgrade = this.$store.state.upgrade.item[elem];
          
          const baseRequirement = upgrade.requirement(upgrade.level);
          if (!baseRequirement) {
            return false;
          }
          
          const price = upgrade.price(upgrade.level);
          if (!price || !Object.keys(price).includes(this.selectedMaterial)) {
            return false;
          }
          
          const feature = elem.split('_')[0];
          const name = elem.split('_')[1];
          const canAfford = this.$store.getters['upgrade/canAfford'](feature, name);
          
          return canAfford;
        });
        
        return result;
      }
    },
    getUnsatisfyItems() {
      if (!this.selectedMaterial) {
        const result = this.baseItems.filter(elem => {
          const upgrade = this.$store.state.upgrade.item[elem];
          
          const baseRequirement = upgrade.requirement(upgrade.level);
          if (!baseRequirement) {
            return false;
          }
          
          const feature = elem.split('_')[0];
          const name = elem.split('_')[1];
          const canAfford = this.$store.getters['upgrade/canAfford'](feature, name);
          
          return !canAfford;
        });
        
        return result;
      } else {
        const result = this.baseItems.filter(elem => {
          const upgrade = this.$store.state.upgrade.item[elem];
          
          const baseRequirement = upgrade.requirement(upgrade.level);
          if (!baseRequirement) {
            return false;
          }
          
          const price = upgrade.price(upgrade.level);
          if (!price || !Object.keys(price).includes(this.selectedMaterial)) {
            return false;
          }
          
          const feature = elem.split('_')[0];
          const name = elem.split('_')[1];
          const canAfford = this.$store.getters['upgrade/canAfford'](feature, name);
          
          return !canAfford;
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
