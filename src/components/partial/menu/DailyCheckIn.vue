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
            
            <div class="prize-list">
              <div 
                v-for="(prize, index) in prizeHistory" 
                :key="index" 
                class="prize-row"
                :style="{borderColor: prize.poolColor || 'white'}"
              >
                <div class="prize-row-content">
                  <div class="prize-icon">
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
                      <v-icon class="mr-2" :color="getPrizeColor(prize)">{{getPrizeIcon(prize)}}</v-icon>
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
    
    playFullscreenConfetti() {
      this.showFullscreenConfetti = true;

      setTimeout(() => {
        this.showFullscreenConfetti = false;
      }, 5000);
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
    }
  }
}
</script> 
