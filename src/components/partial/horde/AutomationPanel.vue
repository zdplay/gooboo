<template>
  <v-card class="ma-1 pa-2 position-relative">
    <div class="d-flex flex-column">
      <v-card-title class="text-h6 justify-center">
        <v-icon class="mr-2">mdi-cogs</v-icon>
        部落声望自动化
      </v-card-title>
      
      <v-card-subtitle class="text-center">
        可以切换到别的模块页面后台运行，但如果把网页切换到后台则会暂停，只能gooboo在网页前台使用。
      </v-card-subtitle>
    </div>

    <v-card-text>
      <v-alert v-if="!canPrestige" type="warning" dense>
        必须解锁声望功能才能使用此功能
      </v-alert>
      
      <div v-else>
        <v-text-field
          v-model.number="targetZone"
          type="number"
          min="1"
          max="9999"
          label="目标区域"
          outlined
          dense
          :disabled="uiRunning || stoppingInProgress"
          hint="达到此区域后将触发声望操作"
        ></v-text-field>

        <v-select
          v-model="config.equipmentLoadout"
          :items="loadoutOptions"
          :disabled="!hasLoadouts || uiRunning || stoppingInProgress"
          label="装备配置"
          outlined
          dense
          hint="将使用此装备配置进行战斗"
          :rules="[v => !!v || '必须选择装备配置']"
        ></v-select>

        <v-alert v-if="!hasLoadouts" type="info" dense>
          您需要先在装备页面创建装备配置
        </v-alert>

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
      stateTimer: null
    },
    stoppingInProgress: false,
    uiRunning: false,
  }),
  computed: {
    ...mapState({
      unlock: state => state.unlock,
      loadouts: state => state.horde.loadout || {},
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
      const status = hordeAutomation.getStatus();
      return status.isRunning;
    }
  },
  created() {
    this.syncStateFromAutomation();
    
    this.config.stateTimer = setInterval(() => {
      this.syncStateFromAutomation();
    }, 300);
    
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
  },
  
  activated() {
    this.syncStateFromAutomation();
  },
  
  beforeDestroy() {
    if (this.config.stateTimer) {
      clearInterval(this.config.stateTimer);
      this.config.stateTimer = null;
    }
    
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
  },
  methods: {
    handleVisibilityChange() {
      if (!document.hidden) {
        this.syncStateFromAutomation();
      }
    },
    syncStateFromAutomation() {
      const status = hordeAutomation.getStatus();
      
      this.uiRunning = status.isRunning;
      
      if (status.isRunning) {
        if (status.config.targetZone) {
          this.targetZone = status.config.targetZone;
        }
        
        if (status.config.equipmentLoadout !== null) {
          this.config.equipmentLoadout = status.config.equipmentLoadout;
        }
      } else {
        if (this.config.equipmentLoadout === null) {
          this.initLoadoutOptions();
        }
      }
      
      this.$forceUpdate();
    },
    
    initLoadoutOptions() {
      const loadouts = this.$store.state.horde.loadout;
      
      const status = hordeAutomation.getStatus();
      if (status.isRunning && status.config.equipmentLoadout !== null) {
        this.config.equipmentLoadout = status.config.equipmentLoadout;
        return;
      }
      
      if (loadouts && Object.keys(loadouts).length > 0) {
        const firstKey = Object.keys(loadouts)[0];
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