<template>
  <div :class="$vuetify.breakpoint.mdAndUp ? 'scroll-container' : ''">
    <div class="d-flex justify-center ma-2">
      <gb-tooltip :title-text="$vuetify.lang.t(`$vuetify.mult.cryolabMaxFeatures`)">
        <template v-slot:activator="{ on, attrs }">
          <span v-bind="attrs" v-on="on">
            <template v-if="doubleDoorFridgeEnabled">
              {{ $vuetify.lang.t('$vuetify.cryolab.refrigerate') }} {{ currentRefrigerated }}/{{ maxFrozen }}
              {{ $vuetify.lang.t('$vuetify.cryolab.freeze') }} {{ currentFrozen }}/{{ maxFrozen }}
            </template>
            <template v-else>
              {{ $vuetify.lang.t('$vuetify.cryolab.frozen', currentFrozen, maxFrozen) }}
            </template>
          </span>
        </template>
        <stat-breakdown name="cryolabMaxFeatures"></stat-breakdown>
      </gb-tooltip>
    </div>
    <div v-if="doubleDoorFridgeEnabled" class="d-flex justify-center ma-2">
      <gb-tooltip :title-text="$vuetify.lang.t('$vuetify.cryolab.freezeTimeAvailable')" :min-width="300" :max-width="400">
        <template v-slot:activator="{ on, attrs }">
          <span v-bind="attrs" v-on="on" :class="freezeTimeAvailable < 0 ? 'error--text font-weight-bold' : 'success--text'">
            {{ $vuetify.lang.t('$vuetify.cryolab.freezeTimeAvailable') }}:
            <template v-if="freezeTimeAvailable < 0">-{{ $formatTime(Math.abs(freezeTimeAvailable), Math.abs(freezeTimeAvailable) < 3600 ? 'short' : 'long') }}</template>
            <template v-else>{{ $formatTime(freezeTimeAvailable, freezeTimeAvailable < 3600 ? 'short' : 'long') }}</template>
          </span>
        </template>

        <div class="tooltip-text-container">

          <div class="text-center mb-2">
            <div v-if="freezeTimeNetChange > 0" class="success--text d-flex align-center justify-center">
              <v-icon small class="mr-1">mdi-trending-up</v-icon>
              <span>{{ $vuetify.lang.t('$vuetify.cryolab.freezeTimeIncrease') }}: +{{ formatFreezeTimeRate(freezeTimeNetChange) }}/秒</span>
              <div v-if="timeUntilFull > 0" class="ml-2">
                <v-chip small color="success">
                  <v-icon small class="mr-1">mdi-clock</v-icon>
                  {{ $vuetify.lang.t('$vuetify.cryolab.freezeTimeFull') }}: {{ $formatTime(timeUntilFull, timeUntilFull < 3600 ? 'short' : 'long') }}
                </v-chip>
              </div>
            </div>
            <div v-else-if="freezeTimeNetChange < 0" class="error--text d-flex align-center justify-center">
              <v-icon small class="mr-1">mdi-trending-down</v-icon>
              <span>{{ $vuetify.lang.t('$vuetify.cryolab.freezeTimeDecrease') }}: -{{ formatFreezeTimeRate(Math.abs(freezeTimeNetChange)) }}/秒</span>
              <div v-if="timeUntilEmpty > 0" class="ml-2">
                <v-chip small color="error">
                  <v-icon small class="mr-1">mdi-clock-alert</v-icon>
                  {{ $vuetify.lang.t('$vuetify.cryolab.freezeTimeEmpty') }}: {{ $formatTime(timeUntilEmpty, timeUntilEmpty < 3600 ? 'short' : 'long') }}
                </v-chip>
              </div>
            </div>
            <div v-else class="info--text d-flex align-center justify-center">
              <v-icon small class="mr-1">mdi-minus</v-icon>
              <span>{{ $vuetify.lang.t('$vuetify.cryolab.freezeTimeStable') }}</span>
            </div>
          </div>

          <div class="mb-2">
            <div v-if="effectiveFreezeTimeGain > 0" class="d-flex align-center">
              <v-icon small class="mr-2" color="light-blue">mdi-snowflake</v-icon>
              <span>{{ $vuetify.lang.t('$vuetify.cryolab.iceMakerOutput') }}: +{{ $formatTime(iceClawsEquipped ? baseFreezeTimeGain : effectiveFreezeTimeGain, 'short') }}/秒</span>
            </div>
            <div v-else-if="freezeTimeGainBase > 0" class="d-flex align-center">
              <v-icon small class="mr-2" color="grey">mdi-snowflake</v-icon>
              <span>{{ $vuetify.lang.t('$vuetify.cryolab.iceMakerOutput') }}: +{{ $formatTime(iceClawsEquipped ? baseFreezeTimeGain : freezeTimeGainBase, 'short') }}/秒</span>
              <v-chip x-small class="ml-2" color="warning">{{ $vuetify.lang.t('$vuetify.cryolab.villageFrozenWarning') }}</v-chip>
            </div>
            <div v-else-if="iceMakerCount === 0" class="d-flex align-center">
              <v-icon small class="mr-2" color="grey">mdi-information</v-icon>
              <span class="grey--text">{{ $vuetify.lang.t('$vuetify.cryolab.noIceMakerHint') }}</span>
            </div>
          </div>

          <div v-if="iceClawsEquipped" class="mb-2">
            <div class="d-flex align-center">
              <v-icon small class="mr-2" color="light-blue">mdi-paw</v-icon>
              <span class="light-blue--text">{{ $vuetify.lang.t('$vuetify.cryolab.iceClawsBonus') }}: +20%</span>
            </div>
          </div>
          <div v-else-if="iceClawsAvailable && !iceClawsEquipped" class="mb-2">
            <div class="d-flex align-center">
              <v-icon small class="mr-2" color="grey">mdi-paw</v-icon>
              <span class="grey--text">{{ $vuetify.lang.t('$vuetify.cryolab.iceClawsHint') }}</span>
            </div>
          </div>

          <div class="mb-2">
            <div v-if="currentFreezeConsumption > 0" class="d-flex align-center mb-1">
              <v-icon small class="mr-2" color="red">mdi-fire</v-icon>
              <span>{{ $vuetify.lang.t('$vuetify.cryolab.freezeTimeConsumption') }}: -{{ currentFreezeConsumption }}秒/秒</span>
            </div>
            <div class="d-flex align-center">
              <v-icon small class="mr-2" color="green">mdi-calendar</v-icon>
              <span>{{ $vuetify.lang.t('$vuetify.cryolab.freezeTimeDailyGain') }}: +2h/天</span>
            </div>
          </div>

          <div class="text-center">
            <v-chip small color="info">
              <v-icon small class="mr-1">mdi-database</v-icon>
              {{ $vuetify.lang.t('$vuetify.cryolab.freezeTimeMax') }}: 72h
            </v-chip>
            <div v-if="freezeTimeAvailable < 0" class="error--text mt-1">
              <v-icon small class="mr-1">mdi-alert</v-icon>
              {{ $vuetify.lang.t('$vuetify.cryolab.freezeTimeNegative') }}
            </div>
          </div>
        </div>
      </gb-tooltip>
    </div>
    <v-row class="ma-1" no-gutters>
      <v-col v-for="feature in features" :key="`feature-${ feature }`" cols="12" md="6" xl="3">
        <lab-feature class="ma-1" :name="feature"></lab-feature>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import LabFeature from '../partial/cryolab/LabFeature.vue';
import StatBreakdown from '../render/StatBreakdown.vue';

export default {
  components: { LabFeature, StatBreakdown },
  computed: {
    doubleDoorFridgeEnabled() {
      return this.$store.state.system.settings.experiment.items.doubleDoorFridge.value;
    },
    currentFrozen() {
      if (this.doubleDoorFridgeEnabled) {
        let count = 0;
        for (const [key, elem] of Object.entries(this.$store.state.cryolab)) {
          if (key === 'freezeTimeAvailable') continue;
          if (elem.freeze) {
            count++;
          }
        }
        return count;
      } else {
        return this.$store.getters['cryolab/currentFrozen'];
      }
    },
    currentRefrigerated() {
      let count = 0;
      for (const [key, elem] of Object.entries(this.$store.state.cryolab)) {
        if (key === 'freezeTimeAvailable') continue;
        if (elem.active) {
          count++;
        }
      }
      return count;
    },
    features() {
      let arr = [];
      for (const [key, elem] of Object.entries(this.$store.state.cryolab)) {
        if (key === 'freezeTimeAvailable') continue;
        if (elem.unlock === null || this.$store.state.unlock[elem.unlock].see) {
          arr.push(key);
        }
      }
      return arr;
    },
    maxFrozen() {
      return this.$store.getters['mult/get']('cryolabMaxFeatures');
    },
    freezeTimeAvailable() {
      return this.$store.getters['currency/value']('cryolab_freezeTime');
    },
    freezeTimeGainBase() {
      return this.$store.getters['mult/get']('cryolabFreezeTimeGainBase');
    },
    effectiveFreezeTimeGain() {
      const isVillageFrozen = this.$store.getters['cryolab/isFeatureFrozen']('village');
      return isVillageFrozen ? 0 : this.freezeTimeGainBase;
    },
    currentFreezeConsumption() {
      return this.currentFrozen;
    },
    freezeTimeNetChange() {
      return this.effectiveFreezeTimeGain - this.currentFreezeConsumption;
    },
    timeUntilEmpty() {
      if (this.freezeTimeNetChange >= 0 || this.freezeTimeAvailable <= 0) {
        return 0;
      }
      return Math.floor(this.freezeTimeAvailable / Math.abs(this.freezeTimeNetChange));
    },
    timeUntilFull() {
      if (this.freezeTimeNetChange <= 0) {
        return 0;
      }
      const maxTime = 259200;
      const remaining = maxTime - this.freezeTimeAvailable;
      if (remaining <= 0) {
        return 0;
      }
      return Math.floor(remaining / this.freezeTimeNetChange);
    },
    iceMakerCount() {
      return this.$store.state.village.job.iceMaker?.amount || 0;
    },
    iceClawsEquipped() {
      return this.$store.state.horde.items.iceClaws?.equipped || false;
    },
    iceClawsAvailable() {
      return this.$store.state.system.settings.experiment.items.doubleDoorFridge.value;
    },
    baseFreezeTimeGain() {
      if (this.iceClawsEquipped && this.iceMakerCount > 0) {
        const isVillageFrozen = this.$store.getters['cryolab/isFeatureFrozen']('village');
        const totalGain = isVillageFrozen ? 0 : this.freezeTimeGainBase;
        return totalGain / 1.2;
      }
      return this.freezeTimeGainBase;
    }
  },
  methods: {
    formatFreezeTimeRate(seconds) {
      if (seconds >= 1) {
        return Math.round(seconds * 10) / 10 + 's';
      } else {
        return Math.round(seconds * 10) / 10 + 's';
      }
    }
  }
}
</script>
