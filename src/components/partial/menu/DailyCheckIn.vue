<template>
  <div>
    <!-- 菜单按钮 -->
    <v-btn
      icon
      :color="availableCheckIns > 0 ? 'red' : ($vuetify.theme.dark ? 'grey darken-3' : 'grey lighten-3')"
      class="menu-button"
      @click="openDailyCheckIn"
      :disabled="disabled"
    >
      <v-icon>mdi-calendar-check</v-icon>
    </v-btn>
    
    <!-- 签到弹窗 -->
    <v-dialog v-model="dialog" max-width="400" @click:outside="closeDailyCheckIn">
      <v-card class="default-card pa-2">
        <v-card-title class="pa-2 justify-center">每日签到</v-card-title>
        <v-card-subtitle class="pa-1 text-center">每天签到一次获得随机奖励</v-card-subtitle>
        
        <v-card-text class="px-0">
          <div class="d-flex justify-center align-center mb-3">
            <v-chip outlined class="ma-1">
              <v-icon left>mdi-calendar-check</v-icon>
              今日签到次数: {{availableCheckIns}}/{{maxCheckIns}}
            </v-chip>
          </div>
          
          <div class="d-flex justify-center">
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
          </div>
          
          <v-divider v-if="prizeHistory.length > 0" class="my-2"></v-divider>
          
          <div v-if="prizeHistory.length > 0" class="px-2">
            <div class="subtitle-1 mb-2 text-center">今日获得</div>
            <div class="d-flex justify-center">
              <div v-if="prizeHistory.length === 1" class="prize-wrapper" style="width: 100px; max-width: 100px;">
                <div 
                  class="prize-container"
                  :style="{borderColor: prizeHistory[0].poolColor || 'white'}"
                >
                  <div class="prize-content">
                    <prize 
                      v-if="prizeHistory[0].id"
                      :pool="prizeHistory[0].poolLevel || prizeHistory[0].poolName" 
                      :prizeBase="{
                        prize: prizeHistory[0].id,
                        data: prizeHistory[0].data,
                        amount: prizeHistory[0].amount
                      }"
                    />
                    <div v-else class="d-flex align-center">
                      <v-icon small class="mr-2" :color="getPrizeColor(prizeHistory[0])">{{getPrizeIcon(prizeHistory[0])}}</v-icon>
                      <span>{{formatPrizeText(prizeHistory[0])}}</span>
                    </div>
                  </div>
                  
                  <div v-if="prizeHistory[0].animation === 'small-confetti'" class="confetti-container small-confetti">
                    <div v-for="n in 15" :key="n" class="confetti-item" :style="getConfettiStyle(n)"></div>
                  </div>
                  <div v-if="prizeHistory[0].animation === 'large-confetti'" class="confetti-container large-confetti">
                    <div v-for="n in 30" :key="n" class="confetti-item" :style="getConfettiStyle(n)"></div>
                  </div>
                </div>
              </div>
              
              <div v-else-if="prizeHistory.length === 2" class="d-flex justify-center" style="width: 220px;">
                <div v-for="(prize, index) in prizeHistory" :key="index" class="prize-wrapper" style="width: 100px; margin: 0 5px;">
                  <div 
                    class="prize-container"
                    :style="{borderColor: prize.poolColor || 'white'}"
                  >
                    <div class="prize-content">
                      <prize 
                        v-if="prize.id"
                        :pool="prize.poolLevel || prize.poolName" 
                        :prizeBase="{
                          prize: prize.id,
                          data: prize.data,
                          amount: prize.amount
                        }"
                      />
                      <div v-else class="d-flex align-center">
                        <v-icon small class="mr-2" :color="getPrizeColor(prize)">{{getPrizeIcon(prize)}}</v-icon>
                        <span>{{formatPrizeText(prize)}}</span>
                      </div>
                    </div>
                    
                    <div v-if="prize.animation === 'small-confetti'" class="confetti-container small-confetti">
                      <div v-for="n in 15" :key="n" class="confetti-item" :style="getConfettiStyle(n)"></div>
                    </div>
                    <div v-if="prize.animation === 'large-confetti'" class="confetti-container large-confetti">
                      <div v-for="n in 30" :key="n" class="confetti-item" :style="getConfettiStyle(n)"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div v-else class="prizes-grid">
                <div v-for="(prize, index) in prizeHistory" :key="index" class="prize-wrapper">
                  <div 
                    class="prize-container"
                    :style="{borderColor: prize.poolColor || 'white'}"
                  >
                    <div class="prize-content">
                      <prize 
                        v-if="prize.id"
                        :pool="prize.poolLevel || prize.poolName" 
                        :prizeBase="{
                          prize: prize.id,
                          data: prize.data,
                          amount: prize.amount
                        }"
                      />
                      <div v-else class="d-flex align-center">
                        <v-icon small class="mr-2" :color="getPrizeColor(prize)">{{getPrizeIcon(prize)}}</v-icon>
                        <span>{{formatPrizeText(prize)}}</span>
                      </div>
                    </div>
                    
                    <div v-if="prize.animation === 'small-confetti'" class="confetti-container small-confetti">
                      <div v-for="n in 15" :key="n" class="confetti-item" :style="getConfettiStyle(n)"></div>
                    </div>
                    <div v-if="prize.animation === 'large-confetti'" class="confetti-container large-confetti">
                      <div v-for="n in 30" :key="n" class="confetti-item" :style="getConfettiStyle(n)"></div>
                    </div>
                  </div>
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
  </div>
</template>

<style scoped>
.prize-container {
  position: relative;
  overflow: hidden;
  border: 2px solid;
  border-radius: 8px;
  aspect-ratio: 1;
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.prize-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 5px;
  text-align: center;
  z-index: 2;
}

/* 礼花容器 */
.confetti-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

/* 礼花粒子改为彩带 */
.confetti-item {
  position: absolute;
  width: 4px;
  height: 12px;
  border-radius: 1px;
  animation: confetti-fall 5s ease-in-out forwards;
  opacity: 0;
  transform-origin: center;
}

/* 大礼花的彩带更多更大 */
.large-confetti .confetti-item {
  width: 5px;
  height: 15px;
  animation-duration: 7s;
}

/* 礼花下落动画 */
@keyframes confetti-fall {
  0% {
    transform: translateY(0) translateX(0) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  30%, 40% {
    opacity: 1;
  }
  60% {
    opacity: 0.7;
  }
  100% {
    transform: translateY(80px) translateX(var(--random-x)) rotate(var(--random-rotate));
    opacity: 0;
  }
}

/* 移除旧的动画 */
.floating-animation, .pulse-animation {
  display: none;
}

.prizes-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  width: 100%;
}

.prize-wrapper {
  padding: 5px;
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
      maxCheckIns: 1
    };
  },
  computed: {
    availableCheckIns() {
      return this.$store.state.system.dailyCheckIn?.available || 0;
    },
    prizeHistory() {
      return this.$store.state.system.dailyCheckIn?.history || [];
    }
  },
  methods: {
    openDailyCheckIn() {
      // 确保数据存在
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
      
      // 使用setTimeout模拟抽奖动画
      setTimeout(() => {
        const result = dailyCheckIn.rollPrize();
        
        if (result) {
          this.prizeText = result.prizeText;
        } else {
          this.prizeText = '未获得奖励';
        }
        
        this.isRolling = false;
      }, 1000);
    },
    
    getPrizeIcon(prize) {
      if (prize.type === 'currency') {
        return this.$store.state.currency[prize.item]?.icon || 'mdi-cash';
      } else if (prize.type === 'consumable') {
        return this.$store.state.consumable[prize.item]?.icon || 'mdi-package-variant';
      }
      return 'mdi-help-circle';
    },
    
    getPrizeColor(prize) {
      if (prize.type === 'currency') {
        return this.$store.state.currency[prize.item]?.color || 'grey';
      } else if (prize.type === 'consumable') {
        return this.$store.state.consumable[prize.item]?.color || 'grey';
      }
      return 'grey';
    },
    
    formatPrizeText(prize) {
      let name = '';
      if (prize.type === 'currency') {
        name = prize.item;
      } else if (prize.type === 'consumable') {
        name = prize.item;
      }
      return `${name}: +${this.$formatNum(prize.amount)}`;
    },
    
    getConfettiStyle(n) {
      // 使用n作为种子让每个彩带有确定的位置
      const seed = n || 1;
      // 在容器内均匀分布，使用n来确定位置
      const left = ((seed * 17) % 100); // 使用质数乘法创造伪随机感
      const top = ((seed * 23) % 100);
      const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ff8800', '#8800ff'];
      const colorIndex = (seed - 1) % colors.length;
      const randomX = (((seed * 13) % 100) / 100 - 0.5) * 60; // 基于n的水平位移
      const randomRotate = (seed * 11) % 360; // 基于n的旋转角度
      
      return {
        left: `${left}%`,
        top: `${top}%`,
        backgroundColor: colors[colorIndex],
        animationDelay: `${(seed * 7) % 2}s`, // 基于n的延迟
        '--random-x': `${randomX}px`,
        '--random-rotate': `${randomRotate}deg`
      };
    }
  }
}
</script> 