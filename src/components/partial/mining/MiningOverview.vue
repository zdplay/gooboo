<template>
  <v-dialog
    v-model="dialogVisible"
    :max-width="$vuetify.breakpoint.xsOnly ? '100%' : '50%'"
    :fullscreen="$vuetify.breakpoint.xsOnly"
    scrollable
  >
    <v-card class="default-card">
      <v-card-title class="headline">
        矿层总览
        <v-spacer></v-spacer>
        <v-btn icon @click="dialogVisible = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <div class="d-flex align-center mb-3 flex-wrap">
          <v-select
            v-model="selectedOres"
            :items="availableOres"
            item-text="text"
            item-value="value"
            chips
            label="筛选矿物"
            multiple
            outlined
            dense
            class="flex-grow-1"
            hide-details
          >
            <template v-slot:selection="{ item }">
              <v-chip
                x-small
                :color="getCurrencyColor(item.value)"
                text-color="white"
                class="mr-1"
              >
                <v-icon x-small left>{{ getCurrencyIcon(item.value) }}</v-icon>
                {{ item.text }}
              </v-chip>
            </template>
          </v-select>
          <v-btn 
            small 
            icon 
            class="ml-2" 
            @click="selectedOres = []" 
            :disabled="selectedOres.length === 0"
            title="清除筛选"
          >
            <v-icon small>mdi-close-circle</v-icon>
          </v-btn>
        </div>
        
        <v-data-table
          v-if="!$vuetify.breakpoint.xsOnly"
          :headers="headers"
          :items="filteredDepths"
          fixed-header
          height="calc(60vh)"
          dense
          single-sort
          hide-default-footer
          :items-per-page="-1"
          :sort-by="['id']"
          :sort-desc="[true]"
          class="mining-table"
        >
          <template #[`item.id`] = "{ item }">
            <div class="d-flex align-center">
              <span :class="{'primary--text': item.id===depth}">{{ item.id }}</span>
              <v-btn v-if="!isFrozen && item.id <= maxDepth" x-small fab text class="ml-2" @click="depthTo(item.id)">
                <v-icon>mdi-arrow-right-bold</v-icon>
              </v-btn>
            </div>
          </template>
          <template #[`item.time`] = "{ item }">
            {{ $formatTime(item.time) }}
          </template>
          <template #[`item.resources`] = "{ item }">
            <div class="d-flex flex-wrap">
              <gb-tooltip 
                v-for="(amount, ore) in item.resources" 
                :key="ore"
                :title-text="$vuetify.lang.t(`$vuetify.currency.mining_${ore}.name`)"
                :min-width="120"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-chip 
                    x-small
                    label
                    class="ma-1 resource-chip"
                    :color="getCurrencyColor(ore)"
                    :class="$vuetify.theme.dark ? 'darken-2' : 'lighten-2'"
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon x-small class="mr-1">{{ getCurrencyIcon(ore) }}</v-icon>
                    <span>{{ $formatNum(amount,true) }}</span>
                  </v-chip>
                </template>
              </gb-tooltip>
            </div>
          </template>
        </v-data-table>
        
        <div v-else class="mobile-mining-list">
          <div class="mobile-header">
            <div class="depth-header" @click="toggleSort('id')">
              深度
              <v-icon small>{{ getSortIcon('id') }}</v-icon>
            </div>
            <div class="break-header" @click="toggleSort('break')">
              次数
              <v-icon small v-if="sortBy === 'break'">{{ getSortIcon('break') }}</v-icon>
            </div>
            <div class="time-header" @click="toggleSort('time')">
              时间
              <v-icon small v-if="sortBy === 'time'">{{ getSortIcon('time') }}</v-icon>
            </div>
            <div class="resources-header">资源</div>
          </div>
          
          <div class="mobile-list-container">
            <div 
              v-for="item in sortedMobileItems" 
              :key="item.id" 
              class="mobile-list-item"
              :class="{'current-depth': item.id === depth}"
            >
              <div class="depth-cell">
                <span :class="{'primary--text': item.id===depth}">{{ item.id }}</span>
                <v-btn v-if="!isFrozen && item.id <= maxDepth" x-small fab text @click="depthTo(item.id)">
                  <v-icon>mdi-arrow-right-bold</v-icon>
                </v-btn>
              </div>
              <div class="break-cell">{{ item.break }}</div>
              <div class="time-cell">{{ $formatTime(item.time) }}</div>
              <div class="resources-cell">
                <div class="d-flex flex-wrap">
                  <v-menu
                    v-for="(amount, ore) in item.resources"
                    :key="ore"
                    v-model="tooltips[ore+item.id]"
                    :close-on-content-click="false"
                    :nudge-width="200"
                    offset-y
                  >
                    <template v-slot:activator="{ on: menu, attrs }">
                      <v-chip 
                        x-small
                        label
                        class="ma-1 resource-chip"
                        :color="getCurrencyColor(ore)"
                        :class="$vuetify.theme.dark ? 'darken-2' : 'lighten-2'"
                        v-bind="attrs"
                        v-on="{ ...menu, click: () => toggleTooltip(ore+item.id) }"
                      >
                        <v-icon x-small class="mr-1">{{ getCurrencyIcon(ore) }}</v-icon>
                        <span>{{ $formatNum(amount,true) }}</span>
                      </v-chip>
                    </template>
                    <v-card>
                      <v-card-title class="subtitle-1">
                        <v-icon small class="mr-2" :color="getCurrencyColor(ore)">
                          {{ getCurrencyIcon(ore) }}
                        </v-icon>
                        {{ $vuetify.lang.t(`$vuetify.currency.mining_${ore}.name`) }}
                      </v-card-title>
                      <v-card-text>
                        <div>每秒获取: {{ $formatNum(amount,true) }}</div>
                        <div v-if="ore === 'salt'">
                          盐在深度 {{ MINING_SALT_DEPTH }} 以上的单矿层中出现
                          <div>击碎获得: {{ $formatNum(amount * (item.time === Infinity ? 0 : item.time), true) }}</div>
                        </div>
                        <div v-else-if="ore === 'deeprock'">深岩在深度 {{ MINING_DEEPROCK_DEPTH }} 以上且数位和大于等于14的深度中出现</div>
                        <div v-else-if="ingredients[ore]">
                          <div>最小深度: {{ ingredients[ore].minDepth }}</div>
                          <div>最大深度: {{ ingredients[ore].maxDepth }}</div>
                          <div v-if="ingredients[ore].modulo">每 {{ ingredients[ore].modulo }} 层出现一次</div>
                        </div>
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn text @click="tooltips[ore+item.id] = false">关闭</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-menu>
                </div>
              </div>
            </div>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { MINING_SALT_DEPTH, MINING_DEEPROCK_DEPTH } from '../../../js/constants';
import { digitSum } from '../../../js/utils/math';

export default {
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data: ()=> ({
    depths: [],
    headers: [],
    ores: [],
    selectedOres: [],
    sortBy: 'id',
    sortDesc: true,
    tooltips: {},
    MINING_SALT_DEPTH,
    MINING_DEEPROCK_DEPTH
  }),
  computed: {
    ...mapState({
      depth: state => state.mining.depth,
      subfeature: state => state.system.features.mining.currentSubfeature,
      isFrozen: (state) => state.system.settings.experiment.items.doubleDoorFridge.value ? (state.cryolab.mining.active || state.cryolab.mining.freeze) : state.cryolab.mining.active,
      ingredients: state => state.mining.ingredient,
      currency: state => state.currency,
    }),
    ...mapGetters({
      hitsNeeded: 'mining/depthHitsNeeded',
      ore: 'mining/depthOre',
      mult: 'mult/get',
    }),
    maxDepth() {
      return this.$store.state.stat[`mining_maxDepth${this.subfeature}`].value;
    },
    dialogVisible: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      }
    },
    availableOres() {
      return this.ores.map(ore => ({
        text: this.$vuetify.lang.t(`$vuetify.currency.mining_${ore}.name`),
        value: ore
      }));
    },
    filteredDepths() {
      if (this.selectedOres.length === 0) {
        return this.depths;
      }
      
      return this.depths.filter(depth => 
        this.selectedOres.every(ore => Object.keys(depth.resources).includes(ore))
      );
    },
    sortedMobileItems() {
      return [...this.filteredDepths].sort((a, b) => {
        let comparison = 0;
        
        switch(this.sortBy) {
          case 'id':
            comparison = a.id - b.id;
            break;
          case 'break':
            comparison = a.break - b.break;
            break;
          case 'time':
            comparison = this.compareTime(a.time, b.time);
            break;
          default:
            comparison = a.id - b.id;
        }
        
        return this.sortDesc ? -comparison : comparison;
      });
    }
  },
  watch: {
    value(newVal) {
      if (newVal) {
        this.refreshData();
      }
    }
  },
  mounted() {
    this.refreshData();
  },
  methods: {
    refreshData() {
      this.getOres();
      this.getHeaders();
      this.getDepths();
      this.selectedOres = [];
      this.sortBy = 'id';
      this.sortDesc = true;
    },
    toggleSort(column) {
      if (this.sortBy === column) {
        this.sortDesc = !this.sortDesc;
      } else {
        this.sortBy = column;
        this.sortDesc = true;
      }
    },
    getSortIcon(column) {
      if (this.sortBy !== column) {
        return 'mdi-arrow-down';
      }
      return this.sortDesc ? 'mdi-arrow-down' : 'mdi-arrow-up';
    },
    toggleTooltip(key) {
      this.$set(this.tooltips, key, !this.tooltips[key]);
      
      // 自动关闭其他提示
      Object.keys(this.tooltips).forEach(tooltipKey => {
        if (tooltipKey !== key && this.tooltips[tooltipKey]) {
          this.$set(this.tooltips, tooltipKey, false);
        }
      });
    },
    getDepths() {
      try {
        const depths = [];
        const maxDepth = this.maxDepth;
        const breakData = this.$store.state.mining?.breaks || {};
        
        for (let i = 0; i <= maxDepth; i++) {
          const depth = i + 1;
          const hitsRequired = this.hitsNeeded(depth);
          const ores = this.ore(depth) || {};
          
          const depthData = { 
            id: depth,
            break: breakData[i] || 0,
            time: hitsRequired,
            resources: {}
          };
          
          // 计算击碎乘数
          const breakMultiplier = hitsRequired === Infinity ? 0 : (hitsRequired + 1) / hitsRequired;
          
          // 处理普通矿石
          Object.entries(ores).forEach(([ore, elem]) => {
            if (elem && typeof elem.amount !== 'undefined') {
              const amount = elem.amount * breakMultiplier;
              if (amount > 0) {
                depthData.resources[ore] = amount;
              }
            }
          });
          
          // 处理特殊矿石，使用相同的乘数逻辑
          this.processSpecialOres(depthData, depth, breakMultiplier);
          
          depths.push(depthData);
        }
        this.depths = depths;
      } catch (error) {
        console.error('Error in getDepths:', error);
        this.depths = [];
      }
    },
    processSpecialOres(depthData, depth, breakMultiplier) {
      const ores = Object.keys(depthData.resources);
      
      // 处理盐
      if (depth >= MINING_SALT_DEPTH && ores.length === 1) {
        const saltBase = Math.pow(1.05, depth - MINING_SALT_DEPTH) * 0.1;
        const saltAmount = this.mult('currencyMiningSaltGain', saltBase) * breakMultiplier;
        if (saltAmount > 0) {
          depthData.resources['salt'] = saltAmount;
        }
      }
      
      // 处理深岩
      if (depth >= MINING_DEEPROCK_DEPTH && digitSum(depth) >= 14) {
        const deeprockBase = Math.pow(1.05, depth - MINING_DEEPROCK_DEPTH) * Math.pow(1.5, digitSum(depth) - 14);
        const deeprockAmount = this.mult('currencyMiningDeeprockGain', deeprockBase) * breakMultiplier;
        if (deeprockAmount > 0) {
          depthData.resources['deeprock'] = deeprockAmount;
        }
      }
    },
    getOres() {
      try {
        if (this.ingredients) {
          this.ores = [
            ...Object.entries(this.ingredients)
              .filter(([, elem]) => (elem && elem.minDepth <= this.maxDepth + 1))
              .map(([ore]) => ore),
            'salt',
            'deeprock'
          ];
        } else {
          this.ores = ['salt', 'deeprock'];
        }
      } catch (error) {
        console.error('Error in getOres:', error);
        this.ores = [];
      }
    },
    getHeaders() {
      try {
        this.headers = [
          {
            text: '深度',
            value: 'id',
            sortable: true,
            divider: true,
            width: '80px'
          },
          {
            text: '次数',
            value: 'break',
            sortable: true,
            divider: true,
            width: '100px'
          },
          {
            text: '时间',
            value: 'time',
            sortable: true,
            divider: true,
            width: '100px'
          },
          {
            text: '资源',
            value: 'resources',
            sortable: false,
            divider: true
          }
        ];
      } catch (error) {
        console.error('Error in getHeaders:', error);
        this.headers = [];
      }
    },
    depthTo(depth) {
      this.$store.commit('mining/updateKey', {key: 'depth', value: depth});
      this.$store.commit('mining/updateKey', {key: 'durability', value: this.$store.getters['mining/currentDurability']});
      this.$store.dispatch('mining/applyBeaconEffects');
      this.dialogVisible = false;
    },
    getCurrencyInfo(ore) {
      return {
        color: this.getCurrencyColor(ore),
        icon: this.getCurrencyIcon(ore)
      };
    },
    getCurrencyColor(ore) {
      return this.currency[`mining_${ore}`]?.color || 'primary';
    },
    getCurrencyIcon(ore) {
      return this.currency[`mining_${ore}`]?.icon || 'mdi-help-circle';
    },
    compareTime(timeA, timeB) {
      if (timeA === Infinity && timeB === Infinity) return 0;
      if (timeA === Infinity) return 1;
      if (timeB === Infinity) return -1;
      return timeA - timeB;
    }
  }
}
</script>

<style scoped>
.resource-chip {
  height: 20px !important;
  font-size: 0.75rem !important;
}

.mining-table {
  width: 100%;
}

.mobile-mining-list {
  width: 100%;
  height: calc(80vh - 120px);
  overflow-y: auto;
  background-color: rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: calc(100vh - 200px);
}

.mobile-header {
  display: flex;
  background-color: #1E1E1E;
  color: white;
  font-weight: bold;
  padding: 8px 0;
  position: sticky;
  top: 0;
  z-index: 1;
}

.mobile-header > div {
  cursor: pointer;
  user-select: none;
  display: flex;
  align-items: center;
}

.mobile-list-container {
  overflow-y: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.mobile-list-item {
  display: flex;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  padding: 8px 0;
}

.mobile-list-item:nth-child(odd) {
  background-color: rgba(0, 0, 0, 0.05);
}

.current-depth {
  background-color: rgba(var(--v-primary-base), 0.1) !important;
}

.depth-header, .depth-cell {
  width: 80px;
  display: flex;
  align-items: center;
  padding-left: 8px;
}

.break-header, .break-cell {
  width: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.time-header, .time-cell {
  width: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.resources-header, .resources-cell {
  flex: 1;
  display: flex;
  align-items: center;
  padding-right: 8px;
}

.depth-cell .v-btn {
  margin-left: 4px;
  height: 20px !important;
  width: 20px !important;
}

.depth-cell .v-btn .v-icon {
  font-size: 14px;
}
</style>

























