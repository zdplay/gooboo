<style scoped>
.fishing-rod-box {
  width: 64px;
  height: 64px;
  cursor: pointer;
}
.debug-active {
  border: 2px solid red;
}
.fishing-game-container {
  margin: 16px;
  padding: 12px;
  position: relative;
  overflow: hidden;
}
.fishing-game-header {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 8px;
  cursor: pointer;
}
.fishing-game-progress {
  height: 30px;
  position: relative;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  margin: 8px 0;
  overflow: hidden;
}
.fishing-game-target {
  position: absolute;
  height: 100%;
  background-color: #4CAF50;
  opacity: 0.5;
}
.fishing-game-cursor {
  position: absolute;
  height: 100%;
  width: 4px;
  background-color: red;
  top: 0;
  z-index: 2;
}
.fishing-game-button {
  display: flex;
  justify-content: center;
  margin-top: 8px;
}
.fishing-game-success {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(76, 175, 80, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.5s;
}
.fishing-game-success.active {
  opacity: 1;
}
</style>

<template>
  <div>
    <div class="d-flex flex-wrap ma-1">
      <gb-tooltip v-for="(item, key) in location" :key="`location-${ key }`" :title-text="$vuetify.lang.t(`$vuetify.event.weatherChaos.location.${ key }`)">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            :color="key === currentLocation ? 'primary' : 'secondary'"
            class="ma-1"
            v-bind="attrs"
            v-on="on"
            @click="changeLocation(key)"
          >{{ $vuetify.lang.t(`$vuetify.event.weatherChaos.location.${ key }`) }}</v-btn>
        </template>
        <display-row class="mt-0" v-for="(subitem, subkey) in item.effect" :key="`stat-${ key }-${ subkey }`" :name="subitem.name" :type="subitem.type" :after="subitem.value"></display-row>
      </gb-tooltip>
    </div>
    <div class="d-flex flex-wrap ma-1">
      <gb-tooltip v-for="(item, key) in fishingRod" :key="`fishing-rod-${ key }`" :title-text="$vuetify.lang.t(`$vuetify.event.weatherChaos.fishingRod.name`) + ': ' + $vuetify.lang.t(`$vuetify.event.weatherChaos.fishingRod.${ key }`)">
        <template v-slot:activator="{ on, attrs }">
          <div class="fishing-rod-box d-flex justify-center align-center bg-tile-default rounded ma-1" v-bind="attrs" v-on="on" @click="clickFishingRod(key)">
            <v-icon size="48" :color="key === currentFishingRod ? 'primary' : (item.owned ? undefined : 'secondary')">{{ item.icon }}</v-icon>
          </div>
        </template>
        <div v-if="item.owned">{{ $vuetify.lang.t(`$vuetify.event.weatherChaos.owned`) }}</div>
        <price-tag v-else currency="gem_topaz" :amount="rodCost"></price-tag>
        <display-row class="mt-0" v-for="(subitem, subkey) in item.effect" :key="`stat-${ key }-${ subkey }`" :name="subitem.name" :type="subitem.type" :after="subitem.value"></display-row>
      </gb-tooltip>
    </div>
    <div class="d-flex flex-wrap ma-1">
      <gb-tooltip v-for="(item, key) in bait" :key="`bait-${ key }`" :title-text="$vuetify.lang.t(`$vuetify.event.weatherChaos.bait.${ key }`)">
        <template v-slot:activator="{ on, attrs }">
          <div class="d-flex justify-center align-center bg-tile-default rounded ma-1 pa-1" v-bind="attrs" v-on="on">
            <v-icon class="ma-1" :color="key === currentBait ? 'primary' : undefined">{{ item.icon }}</v-icon>
            <v-btn v-on="on" small class="ma-1 px-2" color="primary" @click="buyBait(key)">{{ $vuetify.lang.t(`$vuetify.gooboo.buy`) }}</v-btn>
            <v-btn v-on="on" small class="ma-1 px-2" color="primary" :disabled="currentBait !== key && item.owned <= 0" @click="clickBait(key)">{{ $vuetify.lang.t(`$vuetify.gooboo.${ currentBait === key ? 'unequip' : 'equip' }`) }}</v-btn>
          </div>
        </template>
        <div>{{ $vuetify.lang.t(`$vuetify.event.weatherChaos.owned`) }}: {{ $formatNum(item.owned) }}</div>
        <div>{{ item.stackSize * 10 }} for <price-tag currency="event_cloud" :amount="baitCost"></price-tag></div>
        <display-row class="mt-0" v-for="(subitem, subkey) in item.effect" :key="`stat-${ key }-${ subkey }`" :name="subitem.name" :type="subitem.type" :after="subitem.value"></display-row>
      </gb-tooltip>
    </div>
    <div class="d-flex ma-1">
      <v-icon class="ma-2 flex-shrink-0" size="72">{{ weather[nextWeather[0]].icon }}</v-icon>
      <div class="d-flex flex-grow-1 flex-wrap align-center">
        <v-icon class="ma-1" v-for="(item, key) in nextWeather.slice(1)" :key="`weather-next-${ key }`" :style="`opacity: ${ 0.5 - key * 0.02 };`">{{ weather[item].icon }}</v-icon>
      </div>
    </div>
    <div class="d-flex justify-center align-center pa-1">
      <div class="bg-tile-default elevation-2 rounded ma-1 pa-1">
        <price-tag class="ma-1" currency="event_cloud" :amount="resetCost"></price-tag>
        <v-btn class="ma-1" color="primary" :disabled="cloud < resetCost" @click="resetWeather">
          <v-icon class="mr-2">mdi-refresh</v-icon>
          {{ $vuetify.lang.t(`$vuetify.event.weatherChaos.changeWeather`) }}
        </v-btn>
      </div>
    </div>
    <div class="d-flex flex-wrap justify-space-around ma-1">
      <div class="d-flex flex-wrap justify-center">
        <gb-tooltip :title-text="$vuetify.lang.t(`$vuetify.mult.weatherChaosFishingPower`)">
          <template v-slot:activator="{ on, attrs }">
            <div class="bg-tile-default rounded ma-1 pa-1" v-bind="attrs" v-on="on">
              <v-icon>mdi-hook</v-icon>
              <span class="ma-1">{{ $formatNum(fishingPower, true) }}</span>
            </div>
          </template>
          <div>{{ $vuetify.lang.t(`$vuetify.event.weatherChaos.fishingPowerDescription`) }}</div>
          <stat-breakdown name="weatherChaosFishingPower"></stat-breakdown>
        </gb-tooltip>
        <gb-tooltip :title-text="$vuetify.lang.t(`$vuetify.mult.weatherChaosFishSizeAverage`)">
          <template v-slot:activator="{ on, attrs }">
            <div class="bg-tile-default rounded ma-1 pa-1" v-bind="attrs" v-on="on">
              <v-icon>mdi-scale</v-icon>
              <span class="ma-1">{{ $formatNum(fishSizeAverage, true) }}</span>
            </div>
          </template>
          <div>{{ $vuetify.lang.t(`$vuetify.event.weatherChaos.fishSizeDescription`) }}</div>
          <stat-breakdown name="weatherChaosFishSizeAverage"></stat-breakdown>
        </gb-tooltip>
      </div>
      <div class="d-flex flex-wrap justify-center">
        <gb-tooltip :title-text="$vuetify.lang.t(`$vuetify.mult.weatherChaosFishChance`)">
          <template v-slot:activator="{ on, attrs }">
            <div class="bg-tile-default rounded ma-1 pa-1" v-bind="attrs" v-on="on">
              <v-icon>mdi-fish</v-icon>
              <span class="ma-1">{{ $formatNum(fishChance * 100, true) }}%</span>
            </div>
          </template>
          <div>{{ $vuetify.lang.t(`$vuetify.event.weatherChaos.fishDescription`) }}</div>
          <stat-breakdown name="weatherChaosFishChance"></stat-breakdown>
        </gb-tooltip>
        <gb-tooltip :title-text="$vuetify.lang.t(`$vuetify.event.weatherChaos.trashTitle`)">
          <template v-slot:activator="{ on, attrs }">
            <div class="bg-tile-default rounded ma-1 pa-1" v-bind="attrs" v-on="on">
              <v-icon>mdi-delete</v-icon>
              <span class="ma-1">{{ $formatNum(trashChance * 100, true) }}%</span>
            </div>
          </template>
          <div>{{ $vuetify.lang.t(`$vuetify.event.weatherChaos.trashDescription`) }}</div>
        </gb-tooltip>
        <gb-tooltip :title-text="$vuetify.lang.t(`$vuetify.mult.weatherChaosTreasureChance`)">
          <template v-slot:activator="{ on, attrs }">
            <div class="bg-tile-default rounded ma-1 pa-1" v-bind="attrs" v-on="on">
              <v-icon>mdi-star</v-icon>
              <span class="ma-1">{{ $formatNum(treasureChance * 100, true) }}%</span>
            </div>
          </template>
          <div v-if="currentLocationNext">{{ $vuetify.lang.t(`$vuetify.event.weatherChaos.treasureDescription`, $formatNum(currentLocationNext.minPower)) }}</div>
          <div v-else>{{ $vuetify.lang.t(`$vuetify.event.weatherChaos.treasureDescriptionFinal`) }}</div>
          <stat-breakdown name="weatherChaosTreasureChance"></stat-breakdown>
        </gb-tooltip>
        <gb-tooltip title-text="海贼王的宝藏">
          <template v-slot:activator="{ on, attrs }">
            <div class="bg-tile-default rounded ma-1 pa-1" v-bind="attrs" v-on="on" @click="getPiratesTreasure" :class="{ 'debug-active': piratesTreasureDebug }">
              <v-icon>mdi-treasure-chest</v-icon>
              <span class="ma-1">0.5%</span>
              <v-icon v-if="piratesTreasureDebug" small color="red">mdi-bug</v-icon>
            </div>
          </template>
          <div>海贼王的宝藏 - 获得1-100的黄玉</div>
          <div>每次钓鱼都有可能伴生掉落</div>
          <div v-if="piratesTreasureDebug" class="red--text">调试模式已开启，点击获得宝藏</div>
        </gb-tooltip>
      </div>
    </div>
    <div class="ma-2">
      <v-progress-linear height="24" class="rounded" :value="fishingPercent">{{ $formatTime(fishingTimeLeft) }}</v-progress-linear>
    </div>
    
    <div class="fishing-game-container">
      <div class="fishing-game-header" @click="toggleFishingGame">
        <v-icon class="mr-2">mdi-fish</v-icon>
        <span class="title">互动钓鱼</span>
        <v-icon class="ml-2">{{ fishingGameExpanded ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
      </div>
      
      <v-expand-transition>
        <div v-if="fishingGameExpanded">
          <div class="fishing-game-progress">
            <div 
              class="fishing-game-target" 
              :style="{left: `${targetPosition}%`, width: `${targetWidth}%`}">
            </div>
            <div 
              class="fishing-game-cursor" 
              :style="{left: `${cursorPosition}%`}">
            </div>
          </div>
          
          <div class="fishing-game-button">
            <v-btn color="primary" @click="catchFish" :disabled="fishingGameCooldown > 0">
              <v-icon left>mdi-hook</v-icon>
              钓起 {{ fishingGameCooldown > 0 ? `(${fishingGameCooldown}s)` : '' }}
            </v-btn>
          </div>
          
          <div class="fishing-game-success" :class="{'active': showSuccessAnimation}">
            <v-icon x-large color="success">mdi-check-circle</v-icon>
          </div>
        </div>
      </v-expand-transition>
    </div>

    <div class="d-flex flex-wrap ma-1">
      <weather-chaos-fish class="ma-1" v-for="(item, key) in fishList" :key="`fish-${key}`" :name="key" :chance="fishChances[key]"></weather-chaos-fish>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import { WEATHER_CHAOS_BAIT_COST, WEATHER_CHAOS_RESET_COST } from '../../../js/constants';
import PriceTag from '../../render/PriceTag.vue';
import StatBreakdown from '../../render/StatBreakdown.vue';
import DisplayRow from '../upgrade/DisplayRow.vue';
import WeatherChaosFish from './WeatherChaosFish.vue';

export default {
  components: { WeatherChaosFish, PriceTag, DisplayRow, StatBreakdown },
  data: () => ({
    targetPosition: 0,
    targetWidth: 5,
    cursorPosition: 0,
    cursorDirection: 1,
    fishingGameInterval: null,
    fishingGameCooldown: 0,
    fishingGameCooldownInterval: null,
    showSuccessAnimation: false,
    fishingGameExpanded: false
  }),
  computed: {
    ...mapState({
      fishingRod: state => state.weatherChaos.fishingRod,
      bait: state => state.weatherChaos.bait,
      currentLocation: state => state.weatherChaos.currentLocation,
      currentFishingRod: state => state.weatherChaos.currentFishingRod,
      currentBait: state => state.weatherChaos.currentBait,
      weather: state => state.weatherChaos.weather,
      nextWeather: state => state.weatherChaos.nextWeather,
      cloud: state => state.currency.event_cloud.value,
      piratesTreasureDebug: state => state.weatherChaos.piratesTreasureDebug,
    }),
    ...mapGetters({
      fishList: 'weatherChaos/fishList',
      rodCost: 'weatherChaos/rodCost'
    }),
    treasureChance() {
      return this.$store.getters['mult/get']('weatherChaosTreasureChance');
    },
    fishChance() {
      return (1 - this.treasureChance) * this.$store.getters['mult/get']('weatherChaosFishChance');
    },
    trashChance() {
      return 1 - this.treasureChance - this.fishChance;
    },
    fishingTimeNeeded() {
      return this.$store.getters['mult/get']('weatherChaosFishingTime');
    },
    fishingPower() {
      return this.$store.getters['mult/get']('weatherChaosFishingPower');
    },
    fishSizeAverage() {
      return this.$store.getters['mult/get']('weatherChaosFishSizeAverage');
    },
    fishingTimeLeft() {
      return this.fishingTimeNeeded - this.$store.state.weatherChaos.fishingProgress;
    },
    fishingPercent() {
      return 100 * (this.fishingTimeNeeded - this.fishingTimeLeft) / this.fishingTimeNeeded;
    },
    location() {
      let obj = {};
      for (const [key, elem] of Object.entries(this.$store.state.weatherChaos.location)) {
        if (elem.owned) {
          obj[key] = elem;
        }
      }
      return obj;
    },
    fishChances() {
      let obj = {};
      const weights = this.$store.getters['weatherChaos/fishWeights'];
      let totalWeight = 0;
      for (const [, elem] of Object.entries(weights)) {
        totalWeight += elem;
      }
      if (totalWeight > 0) {
        for (const [key, elem] of Object.entries(weights)) {
          obj[key] = elem / totalWeight;
        }
      }
      return obj;
    },
    resetCost() {
      return WEATHER_CHAOS_RESET_COST;
    },
    baitCost() {
      return WEATHER_CHAOS_BAIT_COST;
    },
    currentLocationNext() {
      const next = this.$store.state.weatherChaos.location[this.currentLocation].next;
      if (next === null || this.$store.state.weatherChaos.location[next.name].owned) {
        return null;
      }
      return next;
    }
  },
  methods: {
    changeLocation(name) {
      this.$store.dispatch('weatherChaos/changeLocation', name);
    },
    clickFishingRod(name) {
      if (this.fishingRod[name].owned) {
        this.$store.dispatch('weatherChaos/changeFishingRod', name);
      } else {
        if (this.$store.state.system.settings.confirm.items.gem.value) {
          this.$store.commit('system/updateKey', {key: 'confirm', value: {
            type: 'weatherChaosFishingRodBuy',
            name,
            price: {gem_topaz: this.rodCost},
          }});
        } else {
          this.$store.dispatch('weatherChaos/buyFishingRod', name);
        }
      }
    },
    clickBait(name) {
      if (this.currentBait === name || this.bait[name].owned > 0) {
        this.$store.dispatch('weatherChaos/changeBait', this.currentBait === name ? null : name);
      }
    },
    buyBait(name) {
      this.$store.dispatch('weatherChaos/buyBait', name);
    },
    resetWeather() {
      this.$store.dispatch('weatherChaos/resetWeatherCycle');
    },
    toggleFishingGame() {
      this.fishingGameExpanded = !this.fishingGameExpanded;
      
      // 如果展开，则初始化钓鱼游戏
      if (this.fishingGameExpanded) {
        this.initFishingGame();
      } else {
        // 折叠时清除计时器
        if (this.fishingGameInterval) {
          clearInterval(this.fishingGameInterval);
          this.fishingGameInterval = null;
        }
      }
    },
    initFishingGame() {
      // 随机生成目标位置
      this.targetPosition = Math.floor(Math.random() * (100 - this.targetWidth));
      
      // 清除现有的计时器
      if (this.fishingGameInterval) {
        clearInterval(this.fishingGameInterval);
      }
      
      // 设置光标移动
      this.cursorPosition = 0;
      this.cursorDirection = 1;
      
      this.fishingGameInterval = setInterval(() => {
        this.cursorPosition += this.cursorDirection;
        
        // 到达边界时改变方向
        if (this.cursorPosition >= 100 || this.cursorPosition <= 0) {
          this.cursorDirection *= -1;
        }
      }, 30);
    },
    catchFish() {
      if (this.fishingGameCooldown > 0) return;
      
      // 检查光标是否在目标区域内
      const isInTarget = this.cursorPosition >= this.targetPosition && 
                         this.cursorPosition <= (this.targetPosition + this.targetWidth);
      
      if (isInTarget) {
        // 成功，给予一次钓鱼奖励
        this.$store.dispatch('weatherChaos/getCatch', 1);
        
        // 显示成功动画
        this.showSuccessAnimation = true;
        setTimeout(() => {
          this.showSuccessAnimation = false;
        }, 1000);
      }
      
      // 重新生成目标区域
      this.targetPosition = Math.floor(Math.random() * (100 - this.targetWidth));
      
      // 设置冷却时间
      this.fishingGameCooldown = 2;
      
      if (this.fishingGameCooldownInterval) {
        clearInterval(this.fishingGameCooldownInterval);
      }
      
      this.fishingGameCooldownInterval = setInterval(() => {
        this.fishingGameCooldown--;
        if (this.fishingGameCooldown <= 0) {
          clearInterval(this.fishingGameCooldownInterval);
        }
      }, 1000);
    },
    getPiratesTreasure() {
      if (this.piratesTreasureDebug) { // 只在调试模式下响应点击
        this.$store.dispatch('weatherChaos/debugGetPiratesTreasure');
      }
    }
  },
  mounted() {
    // 不在mounted时初始化，等待点击展开后初始化
  },
  beforeDestroy() {
    if (this.fishingGameInterval) {
      clearInterval(this.fishingGameInterval);
    }
    if (this.fishingGameCooldownInterval) {
      clearInterval(this.fishingGameCooldownInterval);
    }
  }
}
</script>
