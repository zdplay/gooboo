<style scoped>
.settings-container >>> .v-tabs-items {
  background-color: transparent;
}
</style>

<template>
  <div>
    <v-tabs class="settings-container" v-model="tab" grow show-arrows>
      <v-tab href="#keybinds" v-if="$vuetify.breakpoint.mdAndUp">{{ $vuetify.lang.t(`$vuetify.settings.keybinds.name`) }}</v-tab>
      <v-tab href="#themes" v-if="canSeeThemes">{{ $vuetify.lang.t(`$vuetify.settings.theme.name`) }}</v-tab>
      <v-tab v-for="(item, key) in settings" :key="'tab-' + key" :href="'#' + key">{{ $vuetify.lang.t(`$vuetify.settings.${key}.name`) }}</v-tab>
    </v-tabs>
    <div v-if="tab === 'keybinds'" :class="$vuetify.breakpoint.mdAndUp ? 'scroll-container-tab' : ''">
      <keybind class="ma-2" name="prevMainFeature"></keybind>
      <keybind class="ma-2" name="nextMainFeature"></keybind>
      <keybind class="ma-2" name="prevTab"></keybind>
      <keybind class="ma-2" name="nextTab"></keybind>
      <template v-if="canSeeDebug">
        <keybind class="ma-2" name="debugSkip1m"></keybind>
        <keybind class="ma-2" name="debugSkip10m"></keybind>
        <keybind class="ma-2" name="debugSkip1h"></keybind>
        <keybind class="ma-2" name="debugSkip1d"></keybind>
      </template>
      <template v-if="(unlock.farmFeature && unlock.farmFeature.see) || (unlock.galleryFeature && unlock.galleryFeature.see)">
        <keybind class="ma-2" name="farmGalleryRefresh"></keybind>
      </template>
      <keybind class="ma-2" name="mining"></keybind>
      <template v-if="unlock.villageFeature && unlock.villageFeature.see">
        <keybind class="ma-2" name="village"></keybind>
      </template>
      <template v-if="unlock.hordeFeature && unlock.hordeFeature.see">
        <keybind class="ma-2" name="horde"></keybind>
      </template>
      <template v-if="unlock.farmFeature && unlock.farmFeature.see">
        <keybind class="ma-2" name="farm"></keybind>
      </template>
      <template v-if="unlock.galleryFeature && unlock.galleryFeature.see">
        <keybind class="ma-2" name="gallery"></keybind>
      </template>
      <template v-if="unlock.generalFeature && unlock.generalFeature.see">
        <keybind class="ma-2" name="general"></keybind>
      </template>
      <template v-if="unlock.schoolFeature && unlock.schoolFeature.see">
        <keybind class="ma-2" name="school"></keybind>
      </template>
      <template v-if="unlock.achievementFeature && unlock.achievementFeature.see">
        <keybind class="ma-2" name="achievement"></keybind>
      </template>
      <template v-if="unlock.gemFeature && unlock.gemFeature.see">
        <keybind class="ma-2" name="gem"></keybind>
      </template>
      <template v-if="unlock.treasureFeature && unlock.treasureFeature.see">
        <keybind class="ma-2" name="treasure"></keybind>
      </template>
      <template v-if="unlock.cardFeature && unlock.cardFeature.see">
        <keybind class="ma-2" name="card"></keybind>
      </template>
      <template v-if="unlock.cryolabFeature && unlock.cryolabFeature.see">
        <keybind class="ma-2" name="cryolab"></keybind>
      </template>
      <template v-if="unlock.eventFeature && unlock.eventFeature.see">
        <keybind class="ma-2" name="event"></keybind>
      </template>
      <v-card class="ma-2 pa-3">
        <div class="text-caption">{{ $vuetify.lang.t(`$vuetify.settings.keybinds.fixedKeys`) }}</div>
      </v-card>
    </div>
    <div v-else-if="tab === 'themes'" class="d-flex justify-center flex-wrap pa-1" :class="$vuetify.breakpoint.mdAndUp ? 'scroll-container-tab' : ''">
      <theme-item class="ma-1" v-for="(theme, name) in themes" :key="'theme-' + name" :name="name"></theme-item>
    </div>
    <div v-else :class="$vuetify.breakpoint.mdAndUp ? 'scroll-container-tab' : ''">
      <v-row no-gutters v-if="tab !== 'experiment'">
        <v-col v-for="(item, key) in settings[tab].items" class="d-flex align-center" :key="'setting-' + key" cols="12" sm="6" md="4" lg="3" xl="2">
          <setting-item class="ma-2" :category="tab" :name="key"></setting-item>
        </v-col>
      </v-row>
      <div v-if="tab === 'experiment'">
        <v-card class="ma-2 pa-4 elevation-2">

          <div class="px-2">
            <div v-for="(group, groupName) in sortedExperimentSettings" :key="'group-' + groupName" class="mb-6">
              <v-divider class="mb-3"></v-divider>
              <div class="d-flex align-center mb-3">
                <v-icon small class="mr-2" :color="getGroupColor(groupName)">{{ getGroupIcon(groupName) }}</v-icon>
                <span class="text-subtitle-1 font-weight-medium primary--text">
                  {{ getGroupDisplayName(groupName) }}
                </span>
              </div>
              <v-card flat class="pa-3 bg-grey-lighten-5" style="border-radius: 8px;">
                <v-row no-gutters>
                  <v-col v-for="(item, key) in group" class="d-flex align-center" :key="'setting-' + key" cols="12" sm="6" md="4" lg="3" xl="2">
                    <setting-item class="ma-1" :category="tab" :name="key"></setting-item>
                  </v-col>
                </v-row>
              </v-card>
            </div>
          </div>
        </v-card>
        <div class="d-flex justify-center ma-2">
          <alert-text type="warning" style="max-width: 600px;">{{ $vuetify.lang.t(`$vuetify.settings.experiment.warning`) }}</alert-text>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { APP_ENV } from '../../js/constants';
import AlertText from '../partial/render/AlertText.vue';
import SettingItem from '../partial/settings/Item.vue'
import Keybind from '../partial/settings/Keybind.vue'
import ThemeItem from '../partial/settings/ThemeItem.vue';

export default {
  components: { SettingItem, Keybind, ThemeItem, AlertText },
  data: () => ({
    tab: 'general'
  }),
  computed: {
    ...mapState({
      unlock: state => state.unlock
    }),
    settings() {
      let obj = {};
      for (const [key, elem] of Object.entries(this.$store.state.system.settings)) {
        if (elem.unlock === null || (this.unlock[elem.unlock] && this.unlock[elem.unlock].see)) {
          let items = {};
          for (const [subkey, subelem] of Object.entries(elem.items)) {
            if (
              (subelem.unlock === null || (this.unlock[subelem.unlock] && this.unlock[subelem.unlock].see)) &&
              (subelem.mobile === undefined || (subelem.mobile === this.$vuetify.breakpoint.smAndDown)) &&
              (this.canSeeUpdates || key !== 'notification' || subkey !== 'updateCheck')
            ) {
              items[subkey] = subelem;
            }
          }
          obj[key] = {...elem, items};
        }
      }
      return obj;
    },
    canSeeThemes() {
      return this.unlock.gemFeature && this.unlock.gemFeature.see;
    },
    canSeeDebug() {
      return this.unlock.debugFeature && this.unlock.debugFeature.see;
    },
    canSeeUpdates() {
      return APP_ENV === 'WEB';
    },
    themes() {
      let obj = {};
      for (const [key, elem] of Object.entries(this.$store.state.system.themes)) {
        if (elem.owned || elem.price !== null) {
          obj[key] = elem;
        }
      }
      return obj;
    },
    uiSettings() {
      let obj = {};
      for (const [key, elem] of Object.entries(this.$store.state.system.settings)) {
        if (key === 'ui') {
          for (const [subkey, subelem] of Object.entries(elem.items)) {
            if (
              (subelem.unlock === null || (this.unlock[subelem.unlock] && this.unlock[subelem.unlock].see)) &&
              (subelem.mobile === undefined || (subelem.mobile === this.$vuetify.breakpoint.smAndDown)) &&
              (this.canSeeUpdates || key !== 'notification' || subkey !== 'updateCheck')
            ) {
              obj[subkey] = subelem;
            }
          }
        }
      }
      return obj;
    },
    featureSettings() {
      let obj = {};
      for (const [key, elem] of Object.entries(this.$store.state.system.settings)) {
        if (key !== 'ui') {
          for (const [subkey, subelem] of Object.entries(elem.items)) {
            if (
              (subelem.unlock === null || (this.unlock[subelem.unlock] && this.unlock[subelem.unlock].see)) &&
              (subelem.mobile === undefined || (subelem.mobile === this.$vuetify.breakpoint.smAndDown)) &&
              (this.canSeeUpdates || key !== 'notification' || subkey !== 'updateCheck')
            ) {
              obj[subkey] = subelem;
            }
          }
        }
      }
      return obj;
    },
    sortedExperimentSettings() {
      const groups = {};

      if (this.settings['experiment'] && this.settings['experiment'].items) {
        for (const [key, item] of Object.entries(this.settings['experiment'].items)) {
          let unlock = item.unlock || 'general';

          if (key === 'mechanicalMine' || unlock === 'villageBuildings6') {
            unlock = 'hordeFeature';
          } else if (['weatherChaosFeature', 'bingoFeature', 'rouletteFeature'].includes(unlock)) {
            unlock = 'eventFeature';
          }

          if (!groups[unlock]) {
            groups[unlock] = {};
          }
          groups[unlock][key] = item;
        }
      }

      const sortOrder = [
        'general',
        'miningFeature',
        'villageFeature',
        'hordeFeature',
        'farmFeature',
        'galleryFeature',
        'schoolFeature',
        'cardFeature',
        'eventFeature',
        'gemFeature',
        'treasureFeature',
        'cryolabFeature',
        'debugFeature'
      ];

      const sortedGroups = {};
      sortOrder.forEach(groupName => {
        if (groups[groupName]) {
          sortedGroups[groupName] = groups[groupName];
        }
      });

      Object.keys(groups).forEach(groupName => {
        if (!sortOrder.includes(groupName)) {
          sortedGroups[groupName] = groups[groupName];
        }
      });

      return sortedGroups;
    }
  },
  methods: {
    getGroupDisplayName(unlock) {
      const groupNames = {
        'general': this.$vuetify.lang.t('$vuetify.settings.experiment.generalSettings'),
        'miningFeature': this.$vuetify.lang.t('$vuetify.feature.mining'),
        'villageFeature': this.$vuetify.lang.t('$vuetify.feature.village'),
        'hordeFeature': this.$vuetify.lang.t('$vuetify.feature.horde'),
        'farmFeature': this.$vuetify.lang.t('$vuetify.feature.farm'),
        'galleryFeature': this.$vuetify.lang.t('$vuetify.feature.gallery'),
        'schoolFeature': this.$vuetify.lang.t('$vuetify.feature.school'),
        'cardFeature': this.$vuetify.lang.t('$vuetify.feature.card'),
        'gemFeature': this.$vuetify.lang.t('$vuetify.feature.gem'),
        'eventFeature': this.$vuetify.lang.t('$vuetify.feature.event'),
        'treasureFeature': this.$vuetify.lang.t('$vuetify.feature.treasure'),
        'cryolabFeature': this.$vuetify.lang.t('$vuetify.feature.cryolab'),
        'debugFeature': this.$vuetify.lang.t('$vuetify.feature.debug'),
        'weatherChaosFeature': this.$vuetify.lang.t('$vuetify.feature.weatherChaos')
      };

      return groupNames[unlock] || unlock;
    },
    getGroupIcon(unlock) {
      const groupIcons = {
        'general': 'mdi-cog',
        'miningFeature': 'mdi-pickaxe',
        'villageFeature': 'mdi-home-group',
        'hordeFeature': 'mdi-sword-cross',
        'farmFeature': 'mdi-sprout',
        'galleryFeature': 'mdi-palette',
        'schoolFeature': 'mdi-school',
        'cardFeature': 'mdi-cards',
        'gemFeature': 'mdi-diamond-stone',
        'eventFeature': 'mdi-calendar-star',
        'treasureFeature': 'mdi-treasure-chest',
        'cryolabFeature': 'mdi-snowflake',
        'debugFeature': 'mdi-bug'
      };

      return groupIcons[unlock] || 'mdi-cog';
    },
    getGroupColor(unlock) {
      const groupColors = {
        'general': 'grey',
        'miningFeature': 'brown',
        'villageFeature': 'green',
        'hordeFeature': 'red',
        'farmFeature': 'light-green',
        'galleryFeature': 'purple',
        'schoolFeature': 'blue',
        'cardFeature': 'indigo',
        'gemFeature': 'pink',
        'eventFeature': 'orange',
        'treasureFeature': 'amber',
        'cryolabFeature': 'cyan',
        'debugFeature': 'deep-orange'
      };

      return groupColors[unlock] || 'primary';
    }
  },
  destroyed() {
    this.$store.commit('system/updateKey', {key: 'keybindCurrent', value: null});
  }
}
</script>
