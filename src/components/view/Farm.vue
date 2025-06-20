<template>
  <v-row v-if="isCustomXlOnly" no-gutters>
    <v-col class="scroll-container" cols="6">
      <field-bar @stats-toggle="onStatsToggle"></field-bar>
      <field class="mx-auto" :class="{ 'field-compact': showStats }"></field>
    </v-col>
    <v-col class="scroll-container" cols="3">
      <inventory></inventory>
    </v-col>
    <v-col class="scroll-container" cols="3">
      <upgrade-list feature="farm" :requirementCustom="upgradeNextRequired" key="farm-regular"></upgrade-list>
    </v-col>
  </v-row>
  <div v-else-if="isCustomMdAndUp">
    <v-tabs v-model="tab" grow show-arrows>
      <v-tab href="#farm"><tab-icon-text :text="$vuetify.lang.t('$vuetify.farm.farm')" icon="mdi-barn"></tab-icon-text></v-tab>
      <v-tab href="#inventory"><tab-icon-text name="inventory"></tab-icon-text></v-tab>
    </v-tabs>
    <div v-if="tab === 'farm'" class="scroll-container-tab">
      <field-bar @stats-toggle="onStatsToggle"></field-bar>
      <field class="mx-auto" :class="{ 'field-compact': showStats }"></field>
    </div>
    <div v-else-if="tab === 'inventory'">
      <v-row no-gutters>
        <v-col class="scroll-container-tab" cols="6">
          <inventory></inventory>
        </v-col>
        <v-col class="scroll-container-tab" cols="6">
          <upgrade-list feature="farm" :requirementCustom="upgradeNextRequired" key="farm-regular"></upgrade-list>
        </v-col>
      </v-row>
    </div>
  </div>
  <div v-else>
    <v-tabs class="mobile-tabs" v-model="tab" grow show-arrows>
      <v-tab href="#farm"><tab-icon-text :text="$vuetify.lang.t('$vuetify.farm.farm')" icon="mdi-barn"></tab-icon-text></v-tab>
      <v-tab href="#inventory"><tab-icon-text name="inventory"></tab-icon-text></v-tab>
      <v-tab href="#upgrades"><tab-icon-text name="upgrades"></tab-icon-text></v-tab>
    </v-tabs>
    <div v-if="tab === 'farm'">
      <field-bar @stats-toggle="onStatsToggle"></field-bar>
      <field class="mx-auto" :class="{ 'field-compact': showStats }"></field>
    </div>
    <inventory v-else-if="tab === 'inventory'"></inventory>
    <upgrade-list v-else-if="tab === 'upgrades'" feature="farm" :requirementCustom="upgradeNextRequired" key="farm-regular"></upgrade-list>
  </div>
</template>

<style scoped>
@media (max-width: 959px) {
  .field-compact {
    margin-top: -25px !important;
  }
}

@media (min-width: 960px) and (max-width: 1903px) {
  .field-compact {
    margin-top: -70px !important;
  }
}

@media (min-width: 1904px) {
  .field-compact {
    margin-top: -70px !important;
  }
}

@supports (margin-top: -5vh) {
  @media (max-width: 959px) {
    .field-compact {
      margin-top: max(-25px, -3vh) !important;
    }
  }

  @media (min-width: 960px) {
    .field-compact {
      margin-top: max(-70px, -8vh) !important;
    }
  }
}
</style>

<script>
import Field from '../partial/farm/Field.vue';
import FieldBar from '../partial/farm/FieldBar.vue';
import Inventory from '../partial/farm/Inventory.vue';
import TabIconText from '../partial/render/TabIconText.vue';
import UpgradeList from '../render/UpgradeList.vue';
import { screenLayoutMixin } from '../../mixins/screenLayout';

export default {
  components: { UpgradeList, Field, FieldBar, Inventory, TabIconText },
  mixins: [screenLayoutMixin],
  data: () => ({
    tab: 'farm',
    showStats: false
  }),
  computed: {
    upgradeNextRequired() {
      const stat = this.$store.state.upgrade.item.farm_seedBox.highestLevel;
      let next = null;
      [...this.$store.state.upgrade.cache.farm_0_regular].forEach(elem => {
        const upgrade = this.$store.state.upgrade.item[elem];
        if (upgrade.requirementValue !== null && upgrade.requirementStat === 'farm_seedBox' && stat < upgrade.requirementValue && (next === null || upgrade.requirementValue < next)) {
          next = upgrade.requirementValue;
        }
      });
      return next !== null ? [{value: next, text:
        this.$vuetify.lang.t('$vuetify.upgrade.keyset.default.nextRequirement') +
        this.$vuetify.lang.t('$vuetify.upgrade.farm_seedBox') + ' ' +
        this.$vuetify.lang.t('$vuetify.gooboo.levelSuffix') + ' ' + this.$formatNum(next)
      }] : [];
    }
  },
  methods: {
    onStatsToggle(isVisible) {
      this.showStats = isVisible;
    }
  }
}
</script>
