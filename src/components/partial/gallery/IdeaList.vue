<style scoped>
.canvas-tile {
  width: 48px;
  height: 48px;
}
.position-relative {
  position: relative;
  overflow: visible;
}
</style>

<template>
  <div v-if="canSee">
    <div class="d-flex justify-center ma-2">
      <currency name="gallery_inspiration" :customPercent="inspirationPercent" :customTimeNeeded="nextInspirationTime">
        <span>{{ $vuetify.lang.t(`$vuetify.gallery.nextInspiration.0`) }}</span>
        <currency-icon name="gallery_inspiration"></currency-icon>
        <span>{{ $vuetify.lang.t(`$vuetify.gallery.nextInspiration.1`) }}</span>
        <span>{{ $formatTime(nextInspirationTime) }}</span>
        <h3 class="text-center">{{ $vuetify.lang.t('$vuetify.mult.galleryInspirationBase') }}</h3>
        <stat-breakdown name="galleryInspirationBase"></stat-breakdown>
        <h3 class="text-center">{{ $vuetify.lang.t('$vuetify.mult.galleryInspirationIncrement') }}</h3>
        <stat-breakdown name="galleryInspirationIncrement"></stat-breakdown>
      </currency>
      <v-btn v-if="canSeeIdeaConfigs" class="ma-1" icon color="beige" @click="toggleLoadouts"><v-icon>mdi-cog</v-icon></v-btn>
      <gb-tooltip v-if="canSeeResetButton" :title-text="'重置灵感'" :min-width="300" :max-width="400">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            class="ma-1"
            icon
            :color="canResetIdeas ? 'warning' : 'grey'"
            :disabled="!canResetIdeas || isFrozen"
            @click="showResetConfirmDialog"
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
        </template>
        <div class="tooltip-text-container">
          <div>重置所有创意等级和灵感点数到初始状态</div>
          <div class="mt-2">重置后将获得 {{ startingInspiration }} 点起始灵感</div>

          <div class="text-center mt-2">
            <div class="mb-1">已拥有灵感点数: {{ inspirationTotal }}</div>
          </div>

          <div class="text-center mt-2">
            <div class="text-caption">
              <v-icon small class="mr-1">mdi-diamond-stone</v-icon>
              消耗: 200 蓝宝石
            </div>
            <div class="text-caption">
              本轮声望剩余重置次数: {{ Math.max(0, 3 - resetData.resetCount) }}/3
            </div>
            <div class="text-caption mt-1">
              <v-icon small class="mr-1">mdi-clock-outline</v-icon>
              重置后冷却时间: 1天
            </div>
          </div>
        </div>
      </gb-tooltip>
    </div>
    <div class="d-flex flex-column align-center bg-tile-default rounded-b elevation-2 ma-2 pa-1" v-if="showLoadouts && canSeeIdeaConfigs">
      <div class="d-flex justify-space-between align-center w-100">
        <v-btn class="ma-1" color="success" @click="addEmptyLoadout">
          <v-icon class="mr-1">mdi-plus</v-icon>
          新建配置
        </v-btn>
        <v-btn v-if="selectedLoadoutIndex !== null" class="ma-1" color="warning" @click="clearSelection">
          <v-icon class="mr-1">mdi-eye-off</v-icon>
          取消选择
        </v-btn>
        <v-btn icon @click="showLoadouts = false"><v-icon>mdi-close</v-icon></v-btn>
      </div>
      <div v-if="loadouts.length >= 1" class="ma-1 px-1 w-100">
        <v-expansion-panels accordion>
          <v-expansion-panel v-for="(loadout, key) in loadouts" :key="`loadout-${ key }`">
            <v-expansion-panel-header class="pa-2 loadout-header-reduce-minheight" :class="{ 'selected-primary': selectedLoadoutIndex === key }">
              <div class="d-flex align-center">
                <v-badge bottom overlap :content="'' + loadout.content.length"><v-icon>mdi-lightbulb</v-icon></v-badge>
                <div class="ma-1 ml-3">{{ loadout.name }}</div>
                <v-icon v-if="selectedLoadoutIndex === key" class="ml-2" color="primary" small>mdi-eye</v-icon>
              </div>
              <v-spacer></v-spacer>
              <div class="flex-grow-0">
                <v-btn small class="ma-1 pa-1" color="primary" min-width="32" min-height="32" :disabled="loadout.content.length <= 0" @click.native.stop="selectLoadout(key)"><v-icon>mdi-eye</v-icon></v-btn>
              </div>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <idea-loadout :name="key" :key="loadout.id"></idea-loadout>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </div>
      <div v-else class="ma-1">暂无配置</div>
    </div>
    <div v-for="(content, tier) in ideas" :key="tier" class="d-flex bg-tile-default rounded ma-2 pa-1 elevation-2 position-relative">
      <div class="d-flex flex-wrap justify-center align-center flex-grow-1">
        <idea-item v-for="(item, key) in content" :key="tier + '-' + key" class="ma-1" :name="item" :disabled="isFrozen"></idea-item>
      </div>
      <tier-progress v-if="Number(tier) + 1 > 1 && showTierProgress" :tier="Number(tier) + 1"></tier-progress>
    </div>
    <div v-if="canvasSpace.length > 0" class="d-flex flex-wrap grey mx-auto my-2 pa-2 rounded" :style="`width: ${ Math.ceil(Math.sqrt(canvasSpace.length)) * 48 + 16 }px;`">
      <div
        v-for="(item, key) in canvasSpace"
        :key="`canvas-space-${ key }`"
        class="canvas-tile"
        :class="item"
      ></div>
    </div>
    <v-dialog v-model="resetConfirmDialog" max-width="500">
      <v-card class="default-card">
        <v-card-title class="headline">确认重置灵感</v-card-title>
        <v-card-text>
          <div class="mb-3">
            <v-icon color="warning" class="mr-2">mdi-alert</v-icon>
            确定要重置所有创意等级和灵感点数吗？
          </div>
          <div class="mb-2">
            <strong>消耗：</strong>
            <v-icon small class="mx-1">mdi-diamond-stone</v-icon>
            200 蓝宝石
          </div>
          <div class="mb-2">
            <strong>当前灵感：</strong> {{ inspirationTotal }} 点
          </div>
          <div class="mb-2">
            <strong>重置后获得：</strong> {{ startingInspiration }} 点起始灵感
          </div>
          <div class="text-caption text--secondary">
            重置后将有1天冷却时间，本轮声望还可重置 {{ Math.max(0, 3 - resetData.resetCount) }} 次
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" text @click="resetConfirmDialog = false">取消</v-btn>
          <v-btn color="warning" @click="confirmReset">确认重置</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Currency from '../../render/Currency.vue';
import CurrencyIcon from '../../render/CurrencyIcon.vue';
import StatBreakdown from '../../render/StatBreakdown.vue';
import IdeaItem from './IdeaItem.vue';
import TierProgress from './TierProgress.vue';
import IdeaLoadout from './IdeaLoadout.vue';

export default {
  components: { Currency, IdeaItem, CurrencyIcon, StatBreakdown, TierProgress, IdeaLoadout },
  data: () => ({
    showLoadouts: false,
    resetConfirmDialog: false
  }),
  computed: {
    ...mapState({
      isFrozen: (state) => state.system.settings.experiment.items.doubleDoorFridge.value ? (state.cryolab.gallery.active || state.cryolab.gallery.freeze) : state.cryolab.gallery.active,
      canvasSpace: state => state.gallery.canvasSpace
    }),
    inspirationPercent() {
      return 100 * this.$store.state.gallery.inspirationTime / this.$store.getters['gallery/inspirationTimeNeededCurrent'];
    },
    ideas() {
      let arr = [];
      for (const [key, elem] of Object.entries(this.$store.state.gallery.idea)) {
        if (elem.owned) {
          while (arr.length < elem.tier) {
            arr.push([]);
          }
          arr[elem.tier - 1].push(key);
        }
      }
      return arr;
    },
    canSee() {
      return this.$store.state.unlock.galleryInspiration.see;
    },
    nextInspirationTime() {
      return this.$store.getters['gallery/inspirationTimeNeeded'](this.$store.state.gallery.inspirationAmount) - this.$store.state.gallery.inspirationTime;
    },
    showTierProgress() {
      return this.$store.state.system.settings.experiment.items.tierProgress.value;
    },
    canSeeResetButton() {
      return this.$store.state.system.settings.experiment.items.enableGalleryIdeaReset.value;
    },
    canResetIdeas() {
      if (!this.canSeeResetButton) return false;

      const now = Math.floor(Date.now() / 1000);
      const resetData = this.$store.state.gallery.ideaResetData;
      const SECONDS_PER_DAY = 86400;
      const RESET_COOLDOWN = SECONDS_PER_DAY;
      const MAX_RESETS_PER_PRESTIGE = 3;

      if (!resetData.hasPrestiged) {
        return false;
      }

      if (now - resetData.lastResetTime < RESET_COOLDOWN) {
        return false;
      }

      if (resetData.resetCount >= MAX_RESETS_PER_PRESTIGE) {
        return false;
      }

      if (!this.canAffordReset) {
        return false;
      }

      const hasInspirationToReset = this.$store.getters['currency/value']('gallery_inspiration') > 0;
      const hasIdeaLevelsToReset = Object.values(this.$store.state.gallery.idea).some(idea => idea.level > 0);

      return hasInspirationToReset || hasIdeaLevelsToReset;
    },
    resetData() {
      return this.$store.state.gallery.ideaResetData;
    },
    inspirationTotal() {
      const unassignedPoints = this.$store.getters['currency/value']('gallery_inspiration');

      let ideaTotal = 0;
      for (const [, elem] of Object.entries(this.$store.state.gallery.idea)) {
        if (elem.owned && elem.level > 0) {
          ideaTotal += elem.level;
        }
      }

      return unassignedPoints + ideaTotal;
    },
    canSeeIdeaConfigs() {
      return this.$store.state.system.settings.experiment.items.ideaConfigs.value;
    },
    loadouts() {
      return this.$store.state.gallery.ideaLoadout;
    },
    selectedLoadoutIndex() {
      return this.$store.state.gallery.selectedIdeaLoadout;
    },
    startingInspiration() {
      const total = this.$store.getters['mult/get']('galleryInspirationStart');
      const thinkHarder = this.$store.state.gallery.idea.thinkHarder;
      return Math.max(0, total - thinkHarder.level * 2);
    },
    canAffordReset() {
      return this.$store.getters['currency/canAfford']({gem_sapphire: 200});
    }
  },
  methods: {
    showResetConfirmDialog() {
      if (this.canResetIdeas) {
        this.resetConfirmDialog = true;
      }
    },
    confirmReset() {
      this.resetConfirmDialog = false;
      this.$store.dispatch('gallery/resetIdeas');
    },
    resetIdeas() {
      if (this.canResetIdeas) {
        this.$store.dispatch('gallery/resetIdeas');
      }
    },
    toggleLoadouts() {
      this.showLoadouts = !this.showLoadouts;
    },
    addEmptyLoadout() {
      this.$store.commit('gallery/addEmptyIdeaLoadout');
    },
    selectLoadout(index) {
      this.$store.dispatch('gallery/applyIdeaLoadout', index);
    },
    clearSelection() {
      this.$store.commit('gallery/setSelectedIdeaLoadout', null);
    }
  }
}
</script>
