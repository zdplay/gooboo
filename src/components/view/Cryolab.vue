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
        for (const [, elem] of Object.entries(this.$store.state.cryolab)) {
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
      for (const [, elem] of Object.entries(this.$store.state.cryolab)) {
        if (elem.active) {
          count++;
        }
      }
      return count;
    },
    features() {
      let arr = [];
      for (const [key, elem] of Object.entries(this.$store.state.cryolab)) {
        if (elem.unlock === null || this.$store.state.unlock[elem.unlock].see) {
          arr.push(key);
        }
      }
      return arr;
    },
    maxFrozen() {
      return this.$store.getters['mult/get']('cryolabMaxFeatures');
    }
  }
}
</script>
