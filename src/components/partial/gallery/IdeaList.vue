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
      <gb-tooltip v-if="canSeeResetButton" :title-text="'重置灵感'" :min-width="300" :max-width="400">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            class="ma-1"
            :color="canResetIdeas ? 'warning' : 'grey'"
            :disabled="!canResetIdeas || isFrozen"
            @click="resetIdeas"
            v-bind="attrs"
            v-on="on"
          >
            重置灵感
          </v-btn>
        </template>
        <div class="tooltip-text-container">
          <div>重置所有创意等级和灵感点数到初始状态</div>

          <div class="text-center mt-2">
            <div class="mb-1">已拥有灵感点数: {{ inspirationTotal }}</div>
          </div>

          <div class="text-center mt-2">
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
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Currency from '../../render/Currency.vue';
import CurrencyIcon from '../../render/CurrencyIcon.vue';
import StatBreakdown from '../../render/StatBreakdown.vue';
import IdeaItem from './IdeaItem.vue';
import TierProgress from './TierProgress.vue';

export default {
  components: { Currency, IdeaItem, CurrencyIcon, StatBreakdown, TierProgress },
  computed: {
    ...mapState({
      isFrozen: state => state.cryolab.gallery.active,
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
    }
  },
  methods: {
    resetIdeas() {
      if (this.canResetIdeas) {
        this.$store.dispatch('gallery/resetIdeas');
      }
    }
  }
}
</script>
