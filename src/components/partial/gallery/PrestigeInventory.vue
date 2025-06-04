<template>
  <div>
    <inventory-template :currencies="currencies" :prestige-stones="prestigeStone" :disabled="isFrozen"></inventory-template>
    <div class="beauty-level-container">
      <gb-tooltip :title-text="'全局美丽等级'" class="beauty-level-tooltip">
        <template v-slot:activator="{ on, attrs }">
          <div
            class="currency-container rounded"
            :class="[beautyCurrency.color, {
              'darken-2': $vuetify.theme.dark,
              'render-currency-mobile': $vuetify.breakpoint.xsOnly,
              'render-currency-large': !hasNewLabels2,
              'render-currency-large-new': hasNewLabels2,
              'currency-container-new': hasNewLabels2,
              'mt-3': hasNewLabels2
            }]"
            v-bind="attrs"
            v-on="on"
          >
            <template v-if="!hasNewLabels2">
              <div class="d-flex align-center w-100">
                <v-icon :color="transparent ? beautyCurrency.color : undefined" class="mr-2">{{ beautyCurrency.icon }}</v-icon>
                <div class="currency-border rounded flex-grow-1">
                  <v-progress-linear
                    :background-color="beautyCurrency.color + ($vuetify.theme.dark ? ' darken-4' : ' darken-2')"
                    :color="beautyCurrency.color + ($vuetify.theme.dark ? '' : ' lighten-2')"
                    :value="beautyPercent"
                    :height="$vuetify.breakpoint.xsOnly ? 20 : 24"
                    style="overflow: visible;"
                  >
                    <span class="balloon-text-dynamic currency-text text-center">
                      {{ $formatNum(totalBeauty) }} ({{ globalLevel }}) / {{ $formatNum(nextTotalBeauty) }} ({{ globalLevel + 1 }})
                    </span>
                    <!-- 刻度线 -->
                    <template>
                      <div v-for="i in largeLinesSmall" :key="i" class="currency-line currency-line--small" :style="'left: ' + i + '%;'"></div>
                      <div v-for="i in largeLinesMedium" :key="i" class="currency-line currency-line--medium" :style="'left: ' + i + '%;'"></div>
                      <div class="currency-line currency-line--large"></div>
                    </template>
                  </v-progress-linear>
                </div>
              </div>
              <div class="currency-labels d-flex justify-center">
                <div
                  class="currency-label balloon-text-dynamic rounded mx-1 px-1"
                  :style="`background-color: var(--v-${ beautyCurrency.color }-base);`"
                >+{{ $formatNum(beautyGainAmount, true) }}/秒</div>
                <div
                  class="currency-label balloon-text-dynamic rounded mx-1 px-1"
                  :style="`background-color: var(--v-${ beautyCurrency.color }-base);`"
                >{{ $formatTime(beautyCapTimerNeeded) }}</div>
              </div>
            </template>
            <template v-else>
              <div class="d-flex flex-column w-100">
                <div class="custom-progress-wrapper">
                  <div class="currency-border rounded">
                    <v-progress-linear
                      :background-color="beautyCurrency.color + ($vuetify.theme.dark ? ' darken-4' : ' darken-2')"
                      :color="beautyCurrency.color + ($vuetify.theme.dark ? '' : ' lighten-2')"
                      :value="beautyPercent"
                      height="24"
                      style="overflow: visible;"
                    >
                      <span class="balloon-text-dynamic custom-progress-text-left">{{ $formatNum(totalBeauty) }} ({{ globalLevel }})</span>
                      <v-icon class="custom-progress-icon" :color="transparent ? beautyCurrency.color : undefined">{{ beautyCurrency.icon }}</v-icon>
                      <span class="balloon-text-dynamic custom-progress-text-right">{{ $formatNum(nextTotalBeauty) }} ({{ globalLevel + 1 }})</span>
                      <template>
                        <div v-for="i in largeLinesSmall" :key="i" class="currency-line currency-line--small" :style="'left: ' + i + '%;'"></div>
                        <div v-for="i in largeLinesMedium" :key="i" class="currency-line currency-line--medium" :style="'left: ' + i + '%;'"></div>
                        <div class="currency-line currency-line--large"></div>
                      </template>
                    </v-progress-linear>
                  </div>
                </div>
                <div class="currency-labels d-flex justify-space-between mt-1">
                  <div
                    class="currency-label balloon-text-dynamic mx-1 px-1 currency-label-adaptive"
                  >+{{ $formatNum(beautyGainAmount, true) }}/秒</div>
                  <div
                    class="currency-label balloon-text-dynamic mx-1 px-1 currency-label-adaptive"
                  >{{ $formatTime(beautyCapTimerNeeded) }}</div>
                </div>
              </div>
            </template>
          </div>
        </template>
        <div>
          <div class="d-flex justify-space-between mb-1">
            <span>当前等级:</span>
            <span class="font-weight-bold">{{ globalLevel }}</span>
          </div>
          <div class="d-flex justify-space-between mb-1">
            <span>当前美丽值:</span>
            <span class="font-weight-bold">{{ $formatNum(totalBeauty) }}</span>
          </div>
          <div class="d-flex justify-space-between mb-1">
            <span>下一级所需:</span>
            <span class="font-weight-bold">{{ $formatNum(nextTotalBeauty) }}</span>
          </div>
          <div class="d-flex justify-space-between mb-1">
            <span>距离下一级:</span>
            <span class="font-weight-bold">{{ $formatNum(nextTotalBeauty - totalBeauty) }}</span>
          </div>
          <div class="d-flex justify-space-between mb-1">
            <span>美丽产能:</span>
            <span class="font-weight-bold">{{ $formatNum(beautyGainAmount, true) }}/秒</span>
          </div>
          <div class="d-flex justify-space-between mb-1">
            <span>升级所需时间:</span>
            <span class="font-weight-bold">{{ $formatTime(beautyCapTimerNeeded) }}</span>
          </div>
        </div>
      </gb-tooltip>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import InventoryTemplate from '../prestige/InventoryTemplate.vue';
import { logBase } from "../../../js/utils/math";

export default {
  components: { InventoryTemplate },
  data: () => ({
    currencies: ['gallery_cash'],
    transparent: false,
    largeLinesMedium: [25, 75],
    largeLinesSmall: [10, 20, 30, 40, 60, 70, 80, 90]
  }),
  computed: {
    ...mapState({
      isFrozen: state => state.cryolab.gallery.active,
      totalBeauty: state => state.stat.gallery_beauty.total
    }),
    prestigeStone() {
      let arr = [];
      if (this.$store.state.unlock.galleryDrums.see) {
        arr.push({currency: 'gallery_cash', stat: 'gallery_bestPrestige'});
      }
      return arr;
    },
    beautyCurrency() {
      return this.$store.state.currency.gallery_beauty;
    },
    globalLevel() {
      return Math.floor(logBase(this.totalBeauty, 4));
    },
    nextTotalBeauty() {
      return Math.exp((this.globalLevel+1)*Math.log(4));
    },
    beautyPercent() {
      return 100 * this.totalBeauty / this.nextTotalBeauty;
    },
    beautyGainName() {
      return this.beautyCurrency.showGainMult ? this.$store.getters['currency/gainMultName']('gallery', 'beauty') : null;
    },
    beautyGainAmount() {
      return this.beautyGainName === null ? null : this.$store.getters['mult/get'](this.beautyGainName);
    },
    beautyTimerFunction() {
      return this.beautyCurrency.gainTimerFunction === null ? null : this.beautyCurrency.gainTimerFunction();
    },
    beautyCapTimerNeeded() {
      const gainAmount = this.beautyCurrency.showGainTimer ? this.beautyGainAmount : this.beautyTimerFunction;
      return Math.ceil((this.nextTotalBeauty - this.totalBeauty) / gainAmount);
    },
    hasNewLabels2() {
      return this.$store.state.system.settings.experiment.items.currencynewLabel && 
             this.$store.state.system.settings.experiment.items.currencynewLabel.value;
    }
  }
}
</script>

<style scoped>
.render-currency-large {
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
.currency-container {
  position: relative;
  height: 44px;
  width: 100%;  
  margin: 0 auto;  
}
.render-currency-mobile {
  font-size: 80%;
  height: 40px;
}
.currency-labels {
  position: absolute;
  font-size: 12px;
  bottom: -8px;
  left: 32px;
  right: 0;
}
.render-currency-mobile .currency-labels {
  font-size: 10px;
  bottom: -5px;
  left: 32px;
}
.currency-label {
  border: 2px solid white;
}

.render-currency-large-new {
  width: 100% !important;
  max-width: 500px;  
  margin: 0 auto;
  font-size: 16px;
}
@media (max-width: 768px) {
  .render-currency-large-new {
    width: 100% !important;
    max-width: 500px;  
    margin: 0 auto;
    font-size: 16px;
  }
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
  width: 100%;
}
.currency-container-new .currency-label {
  border: none;
  white-space: nowrap;
  flex: 0 1 auto;
  margin: 0 1px;
}
.render-currency-mobile.currency-container-new .currency-labels {
  font-size: 10px;
  bottom: 0px;
  padding: 0 2px;
}
@media (max-width: 400px) {
  .render-currency-mobile.currency-container-new .currency-labels {
    font-size: 8px;
  }
  .currency-container-new .currency-label {
    padding: 0 2px !important;
  }
}
.currency-label-adaptive {
  font-size: inherit;
}
@media (max-width: 400px) {
  .currency-label-adaptive {
    font-size: 9px;
  }
}
.custom-progress-wrapper {
  position: relative;
  width: 100%;
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

.beauty-level-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 16px;
}

.beauty-level-tooltip {
  width: 100%;
  max-width: 500px;
}

.currency-container {
  position: relative;
  width: 100%;
  padding: 8px;
  margin: 8px 0;
}

.custom-progress-container {
  width: 100%;
  position: relative;
}

.currency-border {
  width: 100%;
  border: 2px solid white;
}

.render-currency-large {
  font-size: 16px;
}

.render-currency-large-new {
  font-size: 16px;
}

.currency-labels {
  position: relative;
  font-size: 12px;
  width: 100%;
  margin-top: 4px;
}

@media (max-width: 600px) {
  .beauty-level-tooltip {
    width: 95%;
  }
  
  .currency-container {
    padding: 4px;
  }
  
  .currency-labels {
    font-size: 10px;
  }
}
</style>