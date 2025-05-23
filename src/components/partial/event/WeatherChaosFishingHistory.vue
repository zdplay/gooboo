<template>
  <div class="fishing-history">
    <div class="title-row d-flex align-center mb-2">
      <v-icon small class="mr-1">mdi-history</v-icon>
      <div class="subtitle-1">钓鱼记录</div>
    </div>
    
    <div class="pa-2">
      <div v-if="fishingHistory.length === 0" class="text-center grey--text">
        暂无钓鱼记录
      </div>
      
      <div v-else>
        <div class="fishing-records">
          <div v-for="(record, index) in fishingHistory" :key="index" class="record-item pa-1">
            <div class="d-flex align-center">
              <!-- 鱼类记录 -->
              <template v-if="record.type === 'fish'">
                <v-icon small :color="getFishColor(record.fishName)" class="mr-1">{{ getFishIcon(record.fishName) }}</v-icon>
                <span>捕获 {{ getFishTranslatedName(record.fishName) }} (尺寸: {{ record.size }})</span>
                <span class="ml-1 grey--text">地点: {{ getLocationName(record.location) }}</span>
              </template>
              
              <!-- 垃圾记录 -->
              <template v-else-if="record.type === 'trash'">
                <v-icon small :color="getTrashColor(record.trashName)" class="mr-1">{{ getTrashIcon(record.trashName) }}</v-icon>
                <span>获得 {{ getTrashTranslatedName(record.trashName) }} x{{ formatNumber(record.amount) }}</span>
              </template>
              
              <!-- 宝藏记录 -->
              <template v-else-if="record.type === 'treasure'">
                <v-icon small color="amber" class="mr-1">mdi-treasure-chest</v-icon>
                <template v-if="record.treasureType === 'location'">
                  <span>发现新地点: {{ getLocationName(record.location) }}</span>
                </template>
                <template v-else-if="record.treasureType === 'fishingRod'">
                  <span>获得钓鱼竿: {{ getFishingRodName(record.fishingRod) }}</span>
                </template>
                <template v-else-if="record.treasureType === 'bait'">
                  <span>获得鱼饵: {{ getBaitName(record.bait) }} x{{ record.amount }}</span>
                </template>
                <template v-else-if="record.treasureType === 'piratesTreasure'">
                  <span>发现海贼王的宝藏! 获得黄玉 x{{ record.amount }}</span>
                </template>
              </template>
            </div>
          </div>
        </div>
        
        <!-- 统计汇总，移到fishing-records外面 -->
        <div class="summary-container pa-2 mt-3">
          <div class="subtitle-2 mb-2 primary--text d-flex align-center">
            <v-icon small color="primary" class="mr-1">mdi-chart-box</v-icon>
            统计汇总 (最近50条记录)
          </div>
          
          <div class="d-flex flex-wrap">
            <!-- 鱼类统计 -->
            <v-card class="ma-1 pa-2 summary-card" elevation="2">
              <div class="d-flex align-center">
                <v-icon small color="blue" class="mr-1">mdi-fish</v-icon>
                <span class="font-weight-medium">捕获鱼类:</span>
                <span class="ml-2">{{ fishCount }}条</span>
              </div>
            </v-card>
            
            <!-- 垃圾统计 -->
            <v-card class="ma-1 pa-2 summary-card" elevation="2" v-for="(amount, type) in trashSummary" :key="`trash-${type}`">
              <div class="d-flex align-center">
                <v-icon small :color="getTrashColor(type)" class="mr-1">{{ getTrashIcon(type) }}</v-icon>
                <span class="font-weight-medium">{{ getTrashTranslatedName(type) }}:</span>
                <span class="ml-2">{{ formatNumber(amount) }}</span>
              </div>
            </v-card>
            
            <!-- 宝箱统计 -->
            <v-card class="ma-1 pa-2 summary-card" elevation="2">
              <div class="d-flex align-center">
                <v-icon small color="amber" class="mr-1">mdi-treasure-chest</v-icon>
                <span class="font-weight-medium">宝箱:</span>
                <span class="ml-2">{{ treasureCount }}个</span>
              </div>
            </v-card>
            
            <!-- 宝箱内容统计 -->
            <template v-if="treasureCount > 0">
              <!-- 新地点 -->
              <v-card v-if="locationCount > 0" class="ma-1 pa-2 summary-card" elevation="2">
                <div class="d-flex align-center">
                  <v-icon small color="green" class="mr-1">mdi-map-marker</v-icon>
                  <span class="font-weight-medium">新地点:</span>
                  <span class="ml-2">{{ locationCount }}个</span>
                </div>
              </v-card>
              
              <!-- 钓鱼竿 -->
              <v-card v-if="rodCount > 0" class="ma-1 pa-2 summary-card" elevation="2">
                <div class="d-flex align-center">
                  <v-icon small color="brown" class="mr-1">mdi-hook</v-icon>
                  <span class="font-weight-medium">钓鱼竿:</span>
                  <span class="ml-2">{{ rodCount }}个</span>
                </div>
              </v-card>
              
              <!-- 鱼饵 -->
              <template v-if="Object.keys(baitSummary).length > 0">
                <v-card class="ma-1 pa-2 summary-card" elevation="2" 
                       v-for="(amount, type) in baitSummary" :key="`bait-${type}`">
                  <div class="d-flex align-center">
                    <v-icon small class="mr-1">mdi-food</v-icon>
                    <span class="font-weight-medium">{{ getBaitName(type) }}:</span>
                    <span class="ml-2">{{ amount }}个</span>
                  </div>
                </v-card>
              </template>
              
              <!-- 海贼王宝藏 -->
              <v-card v-if="piratesTreasureAmount > 0" class="ma-1 pa-2 summary-card" elevation="2">
                <div class="d-flex align-center">
                  <v-icon small color="amber" class="mr-1">mdi-treasure-chest</v-icon>
                  <span class="font-weight-medium">海贼王宝藏:</span>
                  <span class="ml-2">{{ piratesTreasureAmount }}黄玉</span>
                </div>
              </v-card>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    fishingHistory: []
  }),
  computed: {
    // 鱼类统计
    fishCount() {
      return this.fishingHistory.filter(record => record.type === 'fish').length;
    },
    
    // 垃圾统计
    trashSummary() {
      const summary = {};
      this.fishingHistory.forEach(record => {
        if (record.type === 'trash') {
          if (!summary[record.trashName]) {
            summary[record.trashName] = 0;
          }
          summary[record.trashName] += record.amount;
        }
      });
      return summary;
    },
    
    // 宝藏总数
    treasureCount() {
      return this.fishingHistory.filter(record => record.type === 'treasure').length;
    },
    
    // 地点统计
    locationCount() {
      return this.fishingHistory.filter(record => 
        record.type === 'treasure' && record.treasureType === 'location'
      ).length;
    },
    
    // 钓鱼竿统计
    rodCount() {
      return this.fishingHistory.filter(record => 
        record.type === 'treasure' && record.treasureType === 'fishingRod'
      ).length;
    },
    
    // 鱼饵统计
    baitSummary() {
      const summary = {};
      this.fishingHistory.forEach(record => {
        if (record.type === 'treasure' && record.treasureType === 'bait') {
          if (!summary[record.bait]) {
            summary[record.bait] = 0;
          }
          summary[record.bait] += record.amount;
        }
      });
      return summary;
    },
    
    // 海贼王宝藏统计
    piratesTreasureAmount() {
      return this.fishingHistory.reduce((total, record) => {
        if (record.type === 'treasure' && record.treasureType === 'piratesTreasure') {
          return total + record.amount;
        }
        return total;
      }, 0);
    }
  },
  mounted() {
    // 从本地存储加载钓鱼历史
    this.loadFishingHistory();
    
    // 监听钓鱼事件
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'weatherChaos/addFishingRecord') {
        this.fishingHistory = state.weatherChaos.fishingHistory;
      }
    });
  },
  methods: {
    loadFishingHistory() {
      const history = this.$store.state.weatherChaos.fishingHistory || [];
      this.fishingHistory = history;
    },
    formatNumber(num) {
      return this.$formatNum(num);
    },
    getFishIcon(fishName) {
      const fish = this.$store.state.weatherChaos.fish[fishName];
      return fish ? fish.icon : 'mdi-fish';
    },
    getFishColor(fishName) {
      const fish = this.$store.state.weatherChaos.fish[fishName];
      return fish ? fish.color : 'grey';
    },
    getFishTranslatedName(fishName) {
      return this.$vuetify.lang.t(`$vuetify.event.weatherChaos.fish.${fishName}`);
    },
    getLocationName(locationName) {
      return this.$vuetify.lang.t(`$vuetify.event.weatherChaos.location.${locationName}`);
    },
    getTrashIcon(trashName) {
      const trashIcons = {
        'algae': 'mdi-grass',
        'driftwood': 'mdi-tree',
        'plastic': 'mdi-bottle-soda'
      };
      return trashIcons[trashName] || 'mdi-delete';
    },
    getTrashColor(trashName) {
      const trashColors = {
        'algae': 'green',
        'driftwood': 'brown',
        'plastic': 'blue-grey'
      };
      return trashColors[trashName] || 'grey';
    },
    getTrashTranslatedName(trashName) {
      return this.$vuetify.lang.t(`$vuetify.currency.event_${trashName}.name`);
    },
    getFishingRodName(rodName) {
      return this.$vuetify.lang.t(`$vuetify.event.weatherChaos.fishingRod.${rodName}`);
    },
    getBaitName(baitName) {
      return this.$vuetify.lang.t(`$vuetify.event.weatherChaos.bait.${baitName}`);
    }
  }
}
</script>

<style scoped>
.fishing-history {
  margin-top: 16px;
}

.fishing-records {
  height: 400px;
  max-height: 100vh;
  overflow-y: auto;
}

.record-item {
  border-bottom: 1px solid rgba(128, 128, 128, 0.2);
}

.record-item:last-child {
  border-bottom: none;
}

.record-time {
  font-size: 0.8rem;
  min-width: 70px;
}

.summary-container {
  background-color: rgba(0, 0, 0, 0.02);
  border-radius: 4px;
  border-top: 1px solid rgba(128, 128, 128, 0.2);
}

.summary-card {
  min-width: 120px;
  flex-grow: 0;
}

@media (max-width: 600px) {
  .fishing-records {
    max-height: 300px;
  }
  
  .summary-card {
    min-width: 100px;
  }
}
</style> 