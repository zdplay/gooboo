<template>
  <v-card class="automation-panel">
    <v-card-title class="justify-space-between">
      <span>
        <v-icon :color="isRunning ? 'success' : ''" class="mr-2">{{ isRunning ? 'mdi-cog-play' : 'mdi-cog' }}</v-icon>
        部落自动声望
      </span>
      <v-btn icon small @click="close">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card-title>
    
    <v-card-text>
      <div>
        <v-text-field
          v-model="targetZone"
          label="目标区域"
          type="number"
          min="1"
          :disabled="isRunning || stoppingInProgress"
          hint="达到此区域后将执行声望"
          persistent-hint
          outlined
          dense
        ></v-text-field>
        
        <v-select
          v-if="hasLoadouts"
          v-model="config.equipmentLoadout"
          :items="loadoutOptions"
          label="装备配置"
          :disabled="isRunning || stoppingInProgress"
          hint="自动使用此装备配置"
          persistent-hint
          outlined
          dense
          class="mt-3"
        ></v-select>
        
        <v-alert v-else type="warning" dense class="mt-3">
          未找到装备配置，请先创建装备配置
        </v-alert>
        
        <v-switch
          v-model="config.autoUseSkills"
          label="自动使用技能"
          :disabled="isRunning || stoppingInProgress"
          hint="自动使用所有可用的主动技能"
          persistent-hint
          class="mt-3"
        ></v-switch>

        <v-switch
          v-model="config.autoUpgradeItems"
          label="自动升级项目"
          :disabled="isRunning || stoppingInProgress"
          hint="自动购买所有可用的升级项目"
          persistent-hint
          class="mt-3"
        ></v-switch>

        <div class="d-flex justify-center mt-2">
          <v-btn
            color="primary"
            :disabled="uiRunning || !canStart || stoppingInProgress"
            @click="startAutomation"
          >
            <v-icon left>mdi-play</v-icon>
            自动化
          </v-btn>
          <v-btn
            color="error"
            class="ml-4"
            :loading="stoppingInProgress"
            :disabled="!uiRunning && !stoppingInProgress"
            @click="stopAutomation"
          >
            <v-icon left>mdi-stop</v-icon>
            停止
          </v-btn>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState } from 'vuex';
import hordeAutomation from '../../../js/modules/automation/hordeAuto';

export default {
  data: () => ({
    targetZone: 100,
    config: {
      equipmentLoadout: null,
      autoUseSkills: true,
      autoUpgradeItems: true,
      stateTimer: null
    },
    stoppingInProgress: false,
    uiRunning: false,
  }),
  computed: {
    ...mapState({
      unlock: state => state.unlock,
      loadouts: state => state.horde.loadout || {},
      hordeAutomation: state => state.horde.hordeAutomation
    }),
    canPrestige() {
      return this.unlock.hordePrestige?.use || false;
    },
    hasLoadouts() {
      const loadouts = this.$store.state.horde.loadout || {};
      return Object.keys(loadouts).length > 0;
    },
    loadoutOptions() {
      const loadouts = this.$store.state.horde.loadout || {};
      
      if (!loadouts || Object.keys(loadouts).length === 0) {
        return [];
      }
      
      const options = Object.keys(loadouts).map(key => ({
        text: `${loadouts[key].name} (${key})`,
        value: key
      }));
      
      return options;
    },
    canStart() {
      return this.canPrestige && this.targetZone > 0;
    },
    isRunning() {
      if (this.hordeAutomation) {
        return this.hordeAutomation.isRunning;
      }
      return hordeAutomation.getStatus().isRunning;
    },
    niterAutoStatus() {
      if (this.hordeAutomation) {
        return this.hordeAutomation;
      }
      return hordeAutomation.getStatus();
    }
  },
  created() {
    this.syncStateFromAutomation();

    document.addEventListener('visibilitychange', this.handleVisibilityChange);

    this.config.stateTimer = setInterval(() => {
      this.syncStateFromAutomation();
    }, 1000);
  },
  beforeDestroy() {
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    
    if (this.config.stateTimer) {
      clearInterval(this.config.stateTimer);
      this.config.stateTimer = null;
    }
  },
  methods: {
    handleVisibilityChange() {
      if (!document.hidden) {
        this.syncStateFromAutomation();
      }
    },
    syncStateFromAutomation() {
      const status = this.hordeAutomation || hordeAutomation.getStatus();
      
      this.uiRunning = status.isRunning;
      
      if (status.isRunning && status.config) {
        if (status.config.targetZone) {
          this.targetZone = status.config.targetZone;
        }
        
        if (status.config.equipmentLoadout !== null) {
          this.config.equipmentLoadout = status.config.equipmentLoadout;
        }
        
        if (status.config.autoUseSkills !== undefined) {
          this.config.autoUseSkills = status.config.autoUseSkills;
        }
      } else {
        if (this.config.equipmentLoadout === null) {
          this.initLoadoutOptions();
        }
      }
      
      this.$forceUpdate();
    },
    initLoadoutOptions() {
      if (this.hasLoadouts) {
        const firstKey = Object.keys(this.$store.state.horde.loadout)[0];
        this.config.equipmentLoadout = firstKey;
      }
    },
    startAutomation() {
      if (!this.config.equipmentLoadout && this.hasLoadouts) {
        const firstKey = Object.keys(this.$store.state.horde.loadout)[0];
        this.config.equipmentLoadout = firstKey;
      }
      
      this.uiRunning = true;
      
      hordeAutomation.updateConfig({
        targetZone: this.targetZone,
        equipmentLoadout: this.config.equipmentLoadout,
        autoUseSkills: this.config.autoUseSkills,
        autoUpgradeItems: this.config.autoUpgradeItems,
        prestigeAfterReaching: true
      });
      
      hordeAutomation.start();
    },
    stopAutomation() {
      this.uiRunning = false;
      this.stoppingInProgress = true;
      
      hordeAutomation.stop();
      
      setTimeout(() => {
        this.stoppingInProgress = false;
        this.$forceUpdate();
      }, 500);
    },
    close() {
      this.$emit('close');
    }
  }
}
</script>

<style scoped>
.hint-text :deep(.v-messages) {
  min-height: 16px;
  padding: 2px 4px;
  border-radius: 2px;
  background-color: rgba(255, 255, 255, 0.05);
}
.automation-panel {
  position: relative;
}
</style> 





