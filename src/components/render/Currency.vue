<style scoped>
/* 旧样式 - 当 hasLabels 为 false 时使用 */
.render-currency-small {
  width: 210px;
  font-size: 16px;
}
.render-currency-large {
  width: 380px;
  font-size: 16px;
}
.currency-border {
  width: 100%;
  border: 2px solid white;
}
.currency-text {
  z-index: 1;
  line-height: 1;
}
.currency-line {
  position: absolute;
  bottom: 0;
  border-left: 1px solid #FFFFFF30;
  border-right: 1px solid #FFFFFF30;
}
.currency-line--small {
  height: 10px;
}
.currency-line--medium {
  height: 16px;
}
.currency-line--large {
  height: 24px;
  left: 50%;
}
.currency-container-old {
  position: relative;
  height: 44px;
}
.render-currency-mobile.currency-container-old {
  font-size: 80%;
  height: 40px;
}
.currency-container-old .currency-labels {
  position: absolute;
  font-size: 10px;
  bottom: -1px;
  left: 15px;
  right: 0;
}
.render-currency-mobile.currency-container-old .currency-labels {
  font-size: 10px;
  bottom: -5px;
  left: 32px;
}

/* 新样式 - 当 hasLabels 为 true 时使用 */
.render-currency-small-new {
  width: 190px;
  font-size: 16px;
}
.render-currency-large-new {
  width: 280px;
  font-size: 16px;
}

.currency-container-new {
  position: relative;
  height: 30px;
  padding-top: 0px !important;
}
.render-currency-mobile.currency-container-new {
  font-size: 80%;
  height: 30px;
}
.currency-container-new .currency-labels {
  position: absolute;
  font-size: 12px;
  bottom: -2px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between !important;
  padding: 0 2px;
}
.render-currency-mobile.currency-container-new .currency-labels {
  font-size: 10px;
  bottom: 0px;
  padding: 0 2px;
}
.currency-clickable {
  cursor: pointer;
}
.currency-label {
  border: none;
}
.custom-progress-wrapper {
  position: relative;
  margin-top: -12px;
}
.custom-progress-icon {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
}
.custom-progress-text-left {
  position: absolute;
  left: 5px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
}
.custom-progress-text-right {
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
}
</style>

<template>
  <gb-tooltip v-if="alwaysShow || stat > 0" :title-text="$vuetify.lang.t(`$vuetify.currency.${ name }.name`)">
    <template v-slot:activator="{ on, attrs }">
      <div
        class="rounded d-flex flex-nowrap pa-2"
        :class="[transparent ? 'transparent' : currency.color, $vnode.data.class, $vnode.data.staticClass, {
          'elevation-0': transparent,
          'darken-2': $vuetify.theme.dark,
          'render-currency-mobile': $vuetify.breakpoint.xsOnly,
          'mb-2': $vuetify.breakpoint.xsOnly && hasLabels,
          'mb-3': $vuetify.breakpoint.smAndUp && hasLabels,
          'currency-container-old': !hasLabels,
          'currency-container-new': hasLabels,
          'render-currency-small': !large && !hasLabels,
          'render-currency-large': large && !hasLabels,
          'render-currency-small-new': !large && hasLabels,
          'render-currency-large-new': large && hasLabels,
          'mt-3': hasLabels
        }]"
        v-bind="attrs"
        v-on="{...$listeners, ...on}"
        @mouseover="handleHover"
      >
        <template v-if="!hasLabels">
          <!-- 旧样式内容 -->
          <v-icon :color="transparent ? currency.color : undefined" class="mr-2">{{ icon }}</v-icon>
          <div class="currency-border rounded">
            <v-progress-linear
              :background-color="transparent ? undefined : (currency.color + ($vuetify.theme.dark ? ' darken-4' : ' darken-2'))"
              :color="transparent ? undefined : (currency.color + ($vuetify.theme.dark ? '' : ' lighten-2'))"
              :value="percent"
              :height="$vuetify.breakpoint.xsOnly ? 20 : 24"
              style="overflow: visible;"
            >
              <span class="balloon-text-dynamic currency-text text-center">{{ $formatNum(currency.value) }}{{ finalCap !== null ? (' / ' + $formatNum(finalCap)) : '' }}</span>
              <template v-if="finalCap !== null">
                <div v-for="i in (large ? largeLinesSmall : smallLinesSmall)" :key="i" class="currency-line currency-line--small" :style="'left: ' + i + '%;'"></div>
                <div v-for="i in (large ? largeLinesMedium : smallLinesMedium)" :key="i" class="currency-line currency-line--medium" :style="'left: ' + i + '%;'"></div>
                <div class="currency-line currency-line--large"></div>
              </template>
            </v-progress-linear>
          </div>
        </template>
        
        <template v-else>
          <!-- 新样式内容 -->
          <div class="w-100">
            <div class="custom-progress-wrapper">
              <div class="currency-border rounded">
                <v-progress-linear
                  :background-color="transparent ? undefined : (currency.color + ($vuetify.theme.dark ? ' darken-4' : ' darken-2'))"
                  :color="transparent ? undefined : (currency.color + ($vuetify.theme.dark ? '' : ' lighten-2'))"
                  :value="percent"
                  height="24"
                  style="overflow: visible;"
                >
                  <span class="balloon-text-dynamic custom-progress-text-left">{{ $formatNum(currency.value) }}</span>
                  <v-icon class="custom-progress-icon" :color="transparent ? currency.color : undefined">{{ icon }}</v-icon>
                  <span class="balloon-text-dynamic custom-progress-text-right" v-if="finalCap !== null">{{ $formatNum(finalCap) }}</span>
                  <template v-if="finalCap !== null">
                    <div v-for="i in (large ? largeLinesSmall : smallLinesSmall)" :key="i" class="currency-line currency-line--small" :style="'left: ' + i + '%;'"></div>
                    <div v-for="i in (large ? largeLinesMedium : smallLinesMedium)" :key="i" class="currency-line currency-line--medium" :style="'left: ' + i + '%;'"></div>
                    <div class="currency-line currency-line--large"></div>
                  </template>
                </v-progress-linear>
              </div>
            </div>
            <div class="currency-labels d-flex justify-center">
              <div
                v-if="!currency.hideGainTag && gainTimerAmount > 0"
                class="currency-label balloon-text-dynamic mx-1 px-1"
              >+{{ $formatNum(gainTimerAmount, true) }}{{ gainUnit }}</div>
              <div
                v-if="capTimerNeeded !== null"
                class="currency-label balloon-text-dynamic mx-1 px-1"
              >{{ $formatTime(capTimerNeeded) }}</div>
            </div>
          </div>
        </template>
      </div>
    </template>
    <currency-tooltip :name="name" :gain-base="gainBase" :base-array="baseArray" :mult-array="multArray" :bonus-array="bonusArray">
      <slot></slot>
    </currency-tooltip>
  </gb-tooltip>
</template>


<script>
import CurrencyTooltip from '../partial/render/CurrencyTooltip.vue';

export default {
  components: { CurrencyTooltip },
  inheritAttrs: false,
  props: {
    name: {
      type: String,
      required: true
    },
    large: {
      type: Boolean,
      required: false,
      default: false
    },
    transparent: {
      type: Boolean,
      required: false,
      default: false
    },
    alwaysShow: {
      type: Boolean,
      required: false,
      default: false
    },
    customCap: {
      type: Number,
      required: false,
      default: null
    },
    customFloor: {
      type: Number,
      required: false,
      default: null
    },
    customPercent: {
      type: Number,
      required: false,
      default: null
    },
    gainBase: {
      type: Number,
      required: false,
      default: null
    },
    baseArray: {
      type: Array,
      required: false,
      default: (() => [])
    },
    multArray: {
      type: Array,
      required: false,
      default: (() => [])
    },
    bonusArray: {
      type: Array,
      required: false,
      default: (() => [])
    },
    hideLabels: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data: (() => ({
    smallLinesMedium: [],
    largeLinesMedium: [25, 75],
    smallLinesSmall: [10, 20, 30, 40, 60, 70, 80, 90],
    largeLinesSmall: [5, 10, 15, 20, 30, 35, 40, 45, 55, 60, 65, 70, 80, 85, 90, 95]
  })),
  computed: {
    currency() {
      return this.$store.state.currency[this.name];
    },
    icon() {
      if (this.$store.state.nightHunt.changedCurrency[this.name] === 'sack') {
        return 'mdi-sack';
      } else if (this.$store.state.nightHunt.changedCurrency[this.name] !== undefined) {
        return this.$store.state.currency['event_' + this.$store.state.nightHunt.changedCurrency[this.name]].icon;
      }
      return this.currency.icon;
    },
    finalCap() {
      return this.customCap !== null ? this.customCap : this.currency.cap;
    },
    finalFloor() {
      return this.customFloor !== null ? this.customFloor : 0;
    },
    percent() {
      return this.customPercent ?? (this.finalCap === null ? 100 : (100 * (this.currency.value - this.finalFloor) / (this.finalCap - this.finalFloor)));
    },
    stat() {
      return this.$store.state.stat[this.name].total;
    },
    showTimer() {
      return (this.currency.showGainTimer && this.gainAmount !== null && this.gainAmount > 0) ||
        (this.timerFunction !== null && this.timerFunction > 0);
    },
    gainName() {
      return this.currency.showGainMult ? this.$store.getters['currency/gainMultName'](...this.name.split('_')) : null;
    },
    gainAmount() {
      return this.gainName === null ? null : this.$store.getters['mult/get'](this.gainName);
    },
    gainDisplay() {
      return this.gainName === null ? null : this.$store.state.mult.items[this.gainName].display;
    },
    gainTimeMult() {
      switch (this.gainDisplay) {
        case 'perSecond':
          return 1;
        case 'perHour':
          return 3600;
        default:
          return 1;
      }
    },
    gainUnit() {
      switch (this.gainDisplay) {
        case 'perSecond':
          return '/s';
        case 'perHour':
          return '/h';
        default:
          return '/s';
      }
    },
    timerFunction() {
      return this.currency.gainTimerFunction === null ? null : this.currency.gainTimerFunction();
    },
    gainTimerAmount() {
      return (this.currency.showGainTimer ? this.gainAmount : this.timerFunction) * this.overcapMult;
    },
    isOvercap() {
      return this.currency.cap !== null && this.currency.value >= this.currency.cap;
    },
    overcapStage() {
      if (!this.isOvercap) {
        return 0;
      }
      return Math.floor(this.currency.value / this.currency.cap);
    },
    overcapMult() {
      if (!this.isOvercap) {
        return 1;
      }
      return this.currency.overcapMult * Math.pow(this.currency.overcapScaling, this.overcapStage - 1);
    },
    capTimerNeeded() {
      if (this.currency.cap === null || this.overcapMult <= 0) {
        return null;
      }
      const gainAmount = this.currency.showGainTimer ? this.gainAmount : this.timerFunction;
      return Math.ceil((this.currency.cap * (this.overcapStage + 1) - this.currency.value) * this.gainTimeMult / (gainAmount * this.overcapMult));
    },
    hasLabels() {
      //return !this.hideLabels && this.$store.state.system.settings.experiment.items.currencyLabel.value && this.showTimer && ((!this.currency.hideGainTag && this.gainTimerAmount > 0) || this.capTimerNeeded !== null);
      return !this.hideLabels && this.$store.state.system.settings.experiment.items.currencyLabel.value;
    }
  },
  methods: {
    handleHover() {
      if (this.$store.state.nightHunt.changedCurrency[this.name] !== undefined) {
        this.$store.dispatch('nightHunt/claimChangedCurrency', this.name);
      }
    }
  }
}
</script>
