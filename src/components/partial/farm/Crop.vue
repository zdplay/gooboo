<style scoped>
.crop-headline-small {
  font-size: 10px;
}
.stage-text-small {
  font-size: 12px;
  line-height: 1;
}
.crop-headline-small .stage-text-small {
  font-size: 8px;
}
.crop-symbol-bar {
  position: absolute;
  right: 4px;
  top: 14px;
  opacity: 0.25;
}
.crop-symbol-bar-small {
  right: 0px;
  top: 4px;
}
.mr-05 {
  margin-right: 2px;
}
.crop-name {
  font-size: 12px;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}
.crop-name-small {
  font-size: 8px;
}
</style>

<template>
  <gb-tooltip :title-text="$vuetify.lang.t(`$vuetify.farm.crop.${ item.crop }`)" :min-width="0">
    <template v-slot:activator="{ on, attrs }">
      <div class="d-flex flex-column justify-space-between" style="height: 100%" v-bind="attrs" v-on="on">
        <div class="d-flex justify-center align-center" :class="{'crop-headline-small mt-1': $vuetify.breakpoint.smAndDown, 'ma-1': $vuetify.breakpoint.mdAndUp}" v-if="isGrown">
          <v-icon :size="$vuetify.breakpoint.smAndDown ? 10 : 16">mdi-basket</v-icon>
          <span class="stage-text-small ml-1">{{ $formatNum(grow * 100) }}%</span>
        </div>
        <div :class="{'crop-headline-small': $vuetify.breakpoint.smAndDown}" v-else>
          <span>{{ $formatTime(Math.ceil(60 * (1 - item.grow) / item.cache.grow)) }}</span>
        </div>
        <v-icon :size="iconSize" :color="crop.color">{{ crop.icon }}</v-icon>
        <div class="crop-name" :class="{'crop-name-small': $vuetify.breakpoint.smAndDown}" v-if="showCropName && item.crop">
          {{ $vuetify.lang.t(`$vuetify.farm.crop.${ item.crop }`) }}
        </div>
        <v-progress-linear :class="{'rounded-b': $vuetify.breakpoint.smAndDown, 'rounded-b-lg': $vuetify.breakpoint.mdAndUp}" :height="$vuetify.breakpoint.smAndDown ? 4 : 12" :color="isGrown ? 'green' : 'light-green'" :value="grow * 100"></v-progress-linear>
        <div class="crop-symbol-bar" :class="{'crop-symbol-bar-small': $vuetify.breakpoint.smAndDown}">
          <v-icon :size="buildingIconSize" v-if="item.cache.sprinkler" class="mr-05">mdi-sprinkler-variant</v-icon>
          <v-icon :size="buildingIconSize" v-if="item.cache.lectern" class="mr-05">mdi-book-open-page-variant</v-icon>
          <v-icon :size="buildingIconSize" v-if="item.cache.pinwheelSource" class="mr-05">mdi-pinwheel</v-icon>
          <v-icon :size="buildingIconSize" v-if="item.cache.flag" class="mr-05">mdi-flag</v-icon>
          <v-icon :size="buildingIconSize" v-if="item.cache.gnome" class="mr-05">mdi-human-child</v-icon>
          <v-icon :size="buildingIconSize" v-if="item.cache.lonely" class="mr-05">mdi-circle-expand</v-icon>
        </div>
      </div>
    </template>
    <div>
      <div>下一阶段: {{ $formatTime(nextStage) }}</div>
      <div v-if="item.fertilizer">肥料: {{ item.fertilizer ? $vuetify.lang.t(`$vuetify.consumable.farm_${ item.fertilizer }.name`) : '无' }}</div>
      <div v-if="isGrown">已成熟，可以收获</div>
    </div>
  </gb-tooltip>
</template>

<script>

export default {
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  computed: {
    crop() {
      return this.$store.state.farm.crop[this.item.crop];
    },
    grow() {
      return this.item.grow;
    },
    isGrown() {
      return this.grow >= 1;
    },
    iconSize() {
      if (this.$vuetify.breakpoint.smAndDown) {
        return this.isGrown ? 20 : 12;
      }
      return this.isGrown ? 40 : 24;
    },
    buildingIconSize() {
      if (this.$vuetify.breakpoint.smAndDown) {
        return 6;
      } else if (this.$vuetify.breakpoint.lgAndDown) {
        return 12;
      }
      return 16;
    },
    showCropName() {
      return this.$store.state.system.settings.experiment.items.showFarmCropName.value;
    },
    nextStage() {
      let grow = this.item.grow;
      let stage = Math.floor(this.item.grow);
      const left = (stage + 1) - grow;
      const stageMult = stage > 0 ? Math.pow(this.item.cache.overgrow, stage) : 1;
      const time = left * stageMult * 60 / this.item.cache.grow;
      return time;
    },
  }
}
</script>
