<template>
  <div class="tier-progress">
    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <div class="vertical-progress-container" v-bind="attrs" v-on="on">
          <div class="vertical-progress-bg">
            <div 
              class="vertical-progress-fill" 
              :style="{height: progressPercent + '%'}" 
              :class="progressColor"
            ></div>
          </div>
        </div>
      </template>
      <span>{{ tooltipText }}</span>
    </v-tooltip>
  </div>
</template>

<script>
export default {
  props: {
    tier: {
      type: Number,
      required: true
    }
  },
  computed: {
    previousTierLevels() {
      let count = 0;
      for (const [, elem] of Object.entries(this.$store.state.gallery.idea)) {
        if (elem.tier === (this.tier - 1) && elem.owned) {
          count += elem.level;
        }
      }
      return count;
    },
    currentTierLevels() {
      let count = 0;
      for (const [, elem] of Object.entries(this.$store.state.gallery.idea)) {
        if (elem.tier === this.tier && elem.owned) {
          count += elem.level;
        }
      }
      return count;
    },
    nextLevelRequirement() {
      return (this.currentTierLevels + 1) * 2;
    },
    canUpgrade() {
      return this.previousTierLevels >= this.nextLevelRequirement;
    },
    progressPercent() {
      if (this.nextLevelRequirement <= 0) return 0;
      return Math.min(100, (this.previousTierLevels / this.nextLevelRequirement) * 100);
    },
    progressColor() {
      if (this.canUpgrade) return 'success';
      if (this.progressPercent > 70) return 'warning';
      return 'error';
    },
    tooltipText() {
      if (this.canUpgrade) {
        return `此层级可以升级`;
      }
      return `升级进度: ${this.previousTierLevels}/${this.nextLevelRequirement}`;
    }
  }
}
</script>

<style scoped>
.tier-progress {
  margin: 0;
  height: 100%;
  display: flex;
  align-items: center;
  position: absolute;
  right: -5px;
  top: 0;
  bottom: 0;
}

.vertical-progress-container {
  height: 100%;
  width: 20px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.vertical-progress-bg {
  height: 100%;
  width: 6px;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
  position: relative;
  overflow: hidden;
}

.vertical-progress-fill {
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  border-radius: 3px;
  transition: height 0.5s ease;
}

.success {
  background-color: var(--v-success-base);
}

.warning {
  background-color: var(--v-warning-base);
}

.error {
  background-color: var(--v-error-base);
}
</style>












