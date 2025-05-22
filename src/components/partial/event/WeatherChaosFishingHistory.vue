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
      
      <div v-else class="fishing-records">
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
  height: 500px;
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

@media (max-width: 600px) {
  .fishing-records {
    height: 300px;
  }
}
</style> 