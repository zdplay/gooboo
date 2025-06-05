<template>
  <div>
    <v-btn
      icon
      :color="availableCheckIns > 0 ? 'red' : ($vuetify.theme.dark ? 'grey darken-3' : 'grey lighten-3')"
      class="menu-button"
      @click="openDailyCheckIn"
      :disabled="disabled"
    >
      <v-icon>mdi-calendar-check</v-icon>
    </v-btn>
    
    <v-dialog v-model="dialog" max-width="400" @click:outside="closeDailyCheckIn">
      <v-card class="default-card pa-2">
        <v-card-title class="pa-2 justify-center">
          每日签到
          <gb-tooltip
            :min-width="0"
            :max-width="9999"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                v-bind="attrs"
                v-on="on"
                small
                class="ml-2"
                color="info"
              >
                mdi-information
              </v-icon>
            </template>
            <div class="pool-info-tooltip">
              <div class="text-center font-weight-bold mb-2">奖池概率</div>
              <div class="pools-grid">
                <div v-for="pool in poolInfo" :key="pool.name" class="pool-item">
                  <div class="pool-header">
                    <div class="pool-title" :style="{
                      background: `linear-gradient(135deg, ${getPoolDisplayColor(pool.color)}22, ${getPoolDisplayColor(pool.color)}44)`,
                      borderLeft: `4px solid ${getPoolDisplayColor(pool.color)}`,
                      color: getPoolDisplayColor(pool.color)
                    }">
                      <v-icon small :color="pool.color" class="mr-2">mdi-circle</v-icon>
                      <span class="pool-name">{{getPoolDisplayName(pool.color)}}池</span>
                      <span class="pool-chance">{{pool.chance}}%</span>
                    </div>
                  </div>
                  <div class="pool-items">
                    <div class="items-grid">
                      <div v-for="item in pool.items" :key="item.id" class="item-name">
                        • {{item.name}}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </gb-tooltip>
        </v-card-title>
        <v-card-subtitle class="pa-1 text-center">每天签到一次获得随机奖励</v-card-subtitle>
        
        <v-card-text class="px-0">
          <div class="d-flex justify-center align-center mb-3">
            <v-chip outlined class="ma-1">
              <v-icon left>mdi-calendar-check</v-icon>
              今日签到次数: {{availableCheckIns}}/{{maxCheckIns}}
            </v-chip>
          </div>
          
          <div class="d-flex justify-center flex-wrap">
            <v-btn
              v-if="availableCheckIns > 0"
              color="primary"
              :disabled="isRolling"
              @click="rollPrize"
              class="ma-2"
              style="width: 200px;"
            >
              <span v-if="!isRolling">领取奖励</span>
              <span v-else>{{prizeText}}</span>
            </v-btn>


            <v-btn
              v-if="isDebugMode && availableCheckIns > 0"
              color="warning"
              :disabled="isRolling"
              @click="rollPrize100"
              class="ma-2"
              style="width: 200px;"
            >
              <v-icon left>mdi-gift-outline</v-icon>
              <span v-if="!isRolling">100连抽</span>
              <span v-else>抽取中...</span>
            </v-btn>
          </div>
          
          <v-divider v-if="prizeHistory.length > 0" class="my-2"></v-divider>
          
          <div v-if="prizeHistory.length > 0" class="px-2">
            <div class="subtitle-1 mb-2 text-center">今日获得</div>
            
            <div class="prize-list">
              <div 
                v-for="(prize, index) in prizeHistory" 
                :key="index" 
                class="prize-row"
                :style="{borderColor: prize.poolColor || 'white'}"
              >
                <div class="prize-row-content">
                  <prize
                    :pool="prize.poolName || 'white'"
                    :prizeBase="{
                      prize: prize.id,
                      data: prize.data,
                      amount: prize.amount,
                      item: prize.item
                    }"
                  />
                </div>
              </div>
            </div>
          </div>
        </v-card-text>
        
        <v-card-actions class="flex-wrap ma-n1">
          <v-spacer></v-spacer>
          <v-btn class="ma-1" color="error" @click="closeDailyCheckIn">关闭</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <div v-if="showFullscreenConfetti" class="fullscreen-confetti-container">
      <div v-for="i in 150" :key="i" class="confetti-piece" :style="getFullscreenConfettiStyle(i)"></div>
    </div>
  </div>
</template>

<style scoped>
.prize-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.prize-row {
  position: relative;
  border: 2px solid;
  border-radius: 8px;
  padding: 8px;
  width: 100%;
  min-height: 50px;
  display: flex;
  overflow: hidden;
}

.prize-row-content {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  z-index: 2;
}

.prize-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.fullscreen-confetti-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 9999;
  overflow: hidden;
}

.confetti-piece {
  position: absolute;
  top: -10px;
  width: 10px;
  height: 30px;
  background-color: #f00;
  opacity: 0;
  animation: confetti-drop 5s ease-in-out forwards;
}

@keyframes confetti-drop {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 1;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(720deg);
    opacity: 0;
  }
}

.pool-info-tooltip {
  width: 90vw;
  max-width: 800px;
  min-width: 280px;
  font-size: 14px;
  padding: 16px;
  box-sizing: border-box;
}

.pools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  width: 100%;
}

/* 小屏幕优化 */
@media (max-width: 600px) {
  .pool-info-tooltip {
    width: 95vw;
    font-size: 13px;
    padding: 12px;
  }
  .pools-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 12px;
  }
  .pool-item {
    padding: 10px;
  }
  .pool-title {
    padding: 8px 10px;
    font-size: 12px;
  }
  .pool-name {
    font-size: 12px;
  }
  .pool-chance {
    font-size: 11px;
  }
}

/* 超小屏幕优化 */
@media (max-width: 400px) {
  .pool-info-tooltip {
    width: 98vw;
    font-size: 12px;
    padding: 10px;
  }
  .pools-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }
  .pool-item {
    padding: 8px;
  }
  .pool-title {
    padding: 6px 8px;
    font-size: 11px;
  }
  .pool-name {
    font-size: 11px;
  }
  .pool-chance {
    font-size: 10px;
    padding: 1px 4px;
  }
  .pool-items {
    font-size: 10px;
  }
}

.pool-item {
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.05);
  min-width: 200px;
}

.pool-header {
  margin-bottom: 8px;
}

.pool-title {
  padding: 8px 12px;
  border-radius: 6px;
  font-weight: bold;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.pool-name {
  flex: 1;
  text-align: left;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.pool-chance {
  font-weight: bold;
  font-size: 12px;
  background: rgb(255, 255, 255);
  padding: 2px 6px;
  border-radius: 10px;
  backdrop-filter: blur(5px);
}

.pool-items {
  font-size: 12px;
  line-height: 1.3;
  color: rgba(255, 255, 255, 0.8);
}

.items-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px 12px;
}

.item-name {
  word-break: break-word;
  line-height: 1.4;
}
</style>

<script>
import dailyCheckIn from '../../../js/modules/dailyCheckIn';
import Prize from '../../partial/event/Prize.vue';

export default {
  components: {
    Prize
  },
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialog: false,
      isRolling: false,
      prizeText: '',
      maxCheckIns: 1,
      showFullscreenConfetti: false
    };
  },
  computed: {
    availableCheckIns() {
      return this.$store.state.system.dailyCheckIn?.available || 0;
    },
    prizeHistory() {
      return this.$store.state.system.dailyCheckIn?.history || [];
    },
    poolInfo() {
      const poolInfo = dailyCheckIn.getPoolInfo();
      // 翻译物品名称
      poolInfo.forEach(pool => {
        pool.items.forEach(item => {
          if (item.nameKey) {
            try {
              item.name = this.$vuetify.lang.t(item.nameKey);
            } catch (e) {
              console.warn(`Translation failed for ${item.nameKey}:`, e);
            }
          }
        });
      });
      return poolInfo;
    },
    isDebugMode() {
      return Boolean(dailyCheckIn && dailyCheckIn.debug);
    }
  },
  methods: {
    openDailyCheckIn() {
      dailyCheckIn.initData();
      this.dialog = true;
      this.isRolling = false;
      this.prizeText = '';
    },
    
    closeDailyCheckIn() {
      this.dialog = false;
    },
    
    rollPrize() {
      if (this.availableCheckIns <= 0 || this.isRolling) return;

      this.isRolling = true;

      setTimeout(() => {
        const result = dailyCheckIn.rollPrize();

        if (result) {
          this.prizeText = result.prizeText;

          if (result.prize && (result.prize.animation === 'large-confetti' || result.prize.animation === 'small-confetti')) {
            this.playFullscreenConfetti();
          }
        } else {
          this.prizeText = '未获得奖励';
        }

        this.isRolling = false;
      }, 1000);
    },

    rollPrize100() {
      if (this.availableCheckIns <= 0 || this.isRolling) return;

      this.isRolling = true;
      this.prizeText = '抽取中...';

      let count = 0;
      let hasSpecialAnimation = false;
      let errorOccurred = false;
      let errorDetails = null;
      const originalErrorHandler = this.$options.errorCaptured;
      this.$options.errorCaptured = (err, instance, info) => {
        if (!errorOccurred) {
          errorOccurred = true;
          errorDetails = `Vue render error: ${err.message} (${info})`;
          console.error('Vue render error in 100x draw:', err, info);
          console.error('Error component:', instance);
        }
        return false;
      };

      const rollNext = () => {
        if (count >= 100 || errorOccurred) {
          this.$options.errorCaptured = originalErrorHandler;

          this.prizeText = errorOccurred ?
            `Error at draw ${count}: ${errorDetails}` :
            `100x draw completed!`;
          this.isRolling = false;

          if (hasSpecialAnimation && !errorOccurred) {
            this.playFullscreenConfetti();
          }
          return;
        }

        try {
          if (this.$store.state.system.dailyCheckIn.available <= 0) {
            errorOccurred = true;
            errorDetails = '签到次数不足';
            rollNext();
            return;
          }

          const result = dailyCheckIn.rollPrize();
          count++;

          if (result && result.prize && (result.prize.animation === 'large-confetti' || result.prize.animation === 'small-confetti')) {
            hasSpecialAnimation = true;
          }

          this.prizeText = `抽取中... ${count}/100`;

          if (errorOccurred) {
            rollNext();
            return;
          }

          setTimeout(rollNext, 50);
        } catch (error) {
          errorOccurred = true;
          errorDetails = `Draw logic error: ${error.message}`;
          console.error('100x draw error:', error);
          console.error('Error occurred at draw', count);
          rollNext();
        }
      };

      setTimeout(rollNext, 100);
    },
    
    playFullscreenConfetti() {
      this.showFullscreenConfetti = true;

      setTimeout(() => {
        this.showFullscreenConfetti = false;
      }, 5000);
    },
    

    
    getFullscreenConfettiStyle() {
      const colors = ['#f94144', '#f3722c', '#f8961e', '#f9c74f', '#90be6d', '#43aa8b', '#577590', '#ff66ff', '#ffcc00', '#00ccff'];
      const left = Math.random() * 100;
      const size = Math.random() * 0.8 + 0.2;
      const delay = Math.random() * 3;
      const duration = Math.random() * 2 + 4;
      const colorIndex = Math.floor(Math.random() * colors.length);

      return {
        left: `${left}%`,
        width: `${5 * size}px`,
        height: `${15 * size}px`,
        backgroundColor: colors[colorIndex],
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
        transform: `rotate(${Math.random() * 360}deg)`
      };
    },

    getPoolDisplayColor(color) {
      const colorMap = {
        'white': '#9E9E9E',
        'blue': '#2196F3',
        'orange': '#FF9800',
        'purple': '#9C27B0',
        'red': '#F44336'
      };
      return colorMap[color] || color;
    },

    getPoolDisplayName(color) {
      const nameMap = {
        'white': '白色',
        'blue': '蓝色',
        'orange': '橙色',
        'purple': '紫色',
        'red': '红色'
      };
      return nameMap[color] || color;
    }
  }
}
</script> 
