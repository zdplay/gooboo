<template>
  <v-dialog v-model="dialog" max-width="500px" @click:outside="closeWithoutSave">
    <v-card class="default-card pa-2">
      <v-card-title>
        <span class="headline">{{ equipmentName }} - 自动释放设置</span>
        <v-spacer></v-spacer>
        <v-btn icon @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-alert type="info" outlined class="mb-4">
          <div><strong>技能效果：</strong></div>
          <div v-for="(effect, index) in skillEffects" :key="index">
            • {{ getEffectDescription(effect) }}
          </div>
        </v-alert>

        <!-- 条件逻辑选择 -->
        <v-select
          v-model="settings.conditionLogic"
          :items="[
            { text: '满足所有条件才释放 (AND)', value: 'and' },
            { text: '满足任一条件即释放 (OR)', value: 'or' }
          ]"
          label="条件逻辑"
          outlined
          dense
          hint="选择多个条件之间的逻辑关系"
          persistent-hint
          class="mb-4"
        ></v-select>

        <!-- 敌方护甲条件 -->
        <v-card v-if="!hasShieldBreakEffect" outlined class="mb-3">
          <v-card-text class="pb-2">
            <v-text-field
              v-model.number="settings.enemyArmor"
              label="敌方护甲值 (≤此值时释放)"
              type="number"
              outlined
              dense
              hint="设置敌方护甲小于等于此值时释放技能"
              persistent-hint
            ></v-text-field>
          </v-card-text>
        </v-card>

        <!-- Boss类型条件 -->
        <v-card outlined class="mb-3">
          <v-card-text class="pb-2">
            <v-select
              v-model="settings.bossType"
              :items="[
                { text: '任何情况', value: 'any' },
                { text: '仅普通敌人', value: 'normal' },
                { text: '仅小Boss', value: 'miniboss' },
                { text: '仅Boss', value: 'boss' },
                { text: '大小Boss', value: 'anyboss' }
              ]"
              label="敌人类型条件"
              outlined
              dense
              hint="选择在什么类型的敌人面前释放技能"
              persistent-hint
            ></v-select>
          </v-card-text>
        </v-card>

        <!-- 玩家血量条件 -->
        <v-card v-if="hasHealEffect || hasResistanceEffect" outlined class="mb-3">
          <v-card-text class="pb-2">
            <v-text-field
              v-model.number="settings.healthPercent"
              label="我方血量百分比 (≤此值时释放)"
              type="number"
              min="0"
              max="100"
              outlined
              dense
              suffix="%"
              hint="血量百分比低于此值时释放技能"
              persistent-hint
            ></v-text-field>
          </v-card-text>
        </v-card>

        <!-- 眩晕/沉默条件 -->
        <v-card v-if="hasStunEffect || hasSilenceEffect" outlined class="mb-3">
          <v-card-text class="pb-2">
            <div class="text-caption mb-2">控制条件 (满足任一条件即可)</div>
            <v-text-field
              v-model.number="settings.enemyStunTime"
              label="敌人眩晕剩余时间 (≤此值时释放)"
              type="number"
              min="0"
              outlined
              dense
              suffix="秒"
              hint="敌人眩晕剩余时间小于等于此值时释放"
              persistent-hint
              class="mb-2"
            ></v-text-field>
            <v-text-field
              v-model.number="settings.enemySilenceTime"
              label="敌人沉默剩余时间 (≤此值时释放)"
              type="number"
              min="0"
              outlined
              dense
              suffix="秒"
              hint="敌人沉默剩余时间小于等于此值时释放"
              persistent-hint
            ></v-text-field>
          </v-card-text>
        </v-card>

        <!-- 玩家护盾条件 -->
        <v-card v-if="hasDivisionShieldEffect" outlined class="mb-3">
          <v-card-text class="pb-2">
            <v-text-field
              v-model.number="settings.playerDivisionShield"
              label="玩家分裂护盾剩余值 (≤此值时释放)"
              type="number"
              min="0"
              outlined
              dense
              hint="玩家分裂护盾剩余值小于等于此值时释放"
              persistent-hint
            ></v-text-field>
          </v-card-text>
        </v-card>

        <!-- 敌方护盾条件 -->
        <v-card v-if="hasShieldBreakEffect" outlined class="mb-3">
          <v-card-text class="pb-2">
            <v-text-field
              v-model.number="settings.enemyDivisionShield"
              label="敌方分裂护盾值 (≥此值时释放)"
              type="number"
              min="0"
              outlined
              dense
              hint="敌方分裂护盾大于等于此值时释放破盾技能"
              persistent-hint
            ></v-text-field>
          </v-card-text>
        </v-card>

        <!-- 解毒条件 -->
        <v-card v-if="hasAntidoteEffect" outlined class="mb-3">
          <v-card-text class="pb-2">
            <v-text-field
              v-model.number="settings.poisonDamagePercent"
              label="中毒伤害占生命值百分比 (≥此值时释放)"
              type="number"
              min="0"
              max="100"
              outlined
              dense
              suffix="%"
              hint="中毒伤害大于生命值上限此百分比时释放解毒技能"
              persistent-hint
            ></v-text-field>
          </v-card-text>
        </v-card>

        <!-- 解晕条件 -->
        <v-card v-if="hasRemoveStunEffect" outlined class="mb-3">
          <v-card-text class="pb-2">
            <v-text-field
              v-model.number="settings.playerStunTime"
              label="玩家眩晕时间 (≥此值时释放)"
              type="number"
              min="0"
              outlined
              dense
              suffix="秒"
              hint="玩家眩晕时间大于此值时释放解晕技能"
              persistent-hint
            ></v-text-field>
          </v-card-text>
        </v-card>

        <!-- 释放时机选择 -->
        <v-card outlined class="mb-3">
          <v-card-text class="pb-2">
            <v-switch
              v-model="settings.beforeFirstStrike"
              label="在先发制人前释放"
              hint="开启：在普通攻击和先发制人之前释放；关闭：在先发制人之后释放"
              persistent-hint
              class="mb-0"
            ></v-switch>
          </v-card-text>
        </v-card>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="save">保存</v-btn>
        <v-btn color="secondary" @click="resetToDefault">重置为默认</v-btn>
        <v-btn @click="close">取消</v-btn>
      </v-card-actions>
    </v-card>


  </v-dialog>
</template>

<script>
export default {
  name: 'EquipmentAutocastSettings',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    equipmentName: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      settings: {
        conditionLogic: 'and',
        enemyArmor: null,
        bossType: null,
        healthPercent: null,
        enemyStunTime: null,
        enemySilenceTime: null,
        playerDivisionShield: null,
        enemyDivisionShield: null,
        poisonDamagePercent: null,
        playerStunTime: null,
        beforeFirstStrike: true
      },
      tempSettings: null
    };
  },
  computed: {
    dialog: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      }
    },
    equipment() {
      return this.$store.state.horde.items[this.equipmentName];
    },
    skillEffects() {
      if (!this.equipment) return [];
      return this.equipment.active(this.equipment.level);
    },
    hasHealEffect() {
      return this.skillEffects.some(effect => effect.type === 'heal');
    },
    hasStunEffect() {
      return this.skillEffects.some(effect => effect.type === 'stun');
    },
    hasSilenceEffect() {
      return this.skillEffects.some(effect => effect.type === 'silence');
    },
    hasDivisionShieldEffect() {
      return this.skillEffects.some(effect => effect.type === 'divisionShield');
    },
    hasAntidoteEffect() {
      return this.skillEffects.some(effect => effect.type === 'antidote');
    },
    hasRemoveStunEffect() {
      return this.skillEffects.some(effect => effect.type === 'removeStun');
    },
    hasResistanceEffect() {
      return this.skillEffects.some(effect => {
        if (effect.type === 'resistancePhysic' || effect.type === 'resistanceMagic' || effect.type === 'resistanceBio') {
          return true;
        }
        if (effect.type === 'buff' && effect.effect) {
          return effect.effect.some(buffEffect =>
            (buffEffect.type === 'mult' &&
             (buffEffect.name === 'hordePhysicTaken' ||
              buffEffect.name === 'hordeMagicTaken' ||
              buffEffect.name === 'hordeBioTaken') &&
             buffEffect.value < 1)
          );
        }
        return false;
      });
    },
    hasShieldBreakEffect() {
      return this.skillEffects.some(effect =>
        effect.type === 'shieldBreak' ||
        effect.type === 'removeDivisionShield'
      );
    }
  },
  methods: {
    close() {
      this.dialog = false;
    },
    closeWithoutSave() {
      this.tempSettings = { ...this.settings };
      this.dialog = false;
    },
    save() {
      try {
        const currentSettings = { ...this.$store.state.horde.enhancedAutocastSettings };
        currentSettings[this.equipmentName] = this.settings;
        this.$store.commit('horde/updateKey', {
          key: 'enhancedAutocastSettings',
          value: currentSettings
        });

        this.tempSettings = null;

        console.log('保存装备设置:', this.equipmentName, this.settings);
        console.log('当前所有设置:', currentSettings);
        this.close();
      } catch (error) {
        console.error('保存装备设置失败:', error);
      }
    },
    resetToDefault() {
      this.settings = {
        conditionLogic: 'and',
        enemyArmor: null,
        bossType: null,
        healthPercent: null,
        enemyStunTime: null,
        enemySilenceTime: null,
        playerDivisionShield: null,
        enemyDivisionShield: null,
        poisonDamagePercent: null,
        playerStunTime: null,
        beforeFirstStrike: true
      };
    },

    getEffectDescription(effect) {
      switch (effect.type) {
        case 'heal':
          return `治疗 ${(effect.value * 100)}% 生命值`;
        case 'stun':
          return `眩晕敌人 ${effect.value} 秒`;
        case 'silence':
          return `沉默敌人 ${effect.value} 秒`;
        case 'divisionShield':
          return `增加 ${effect.value} 分裂护盾`;
        case 'antidote':
          return '解除中毒状态';
        case 'removeStun':
          return '解除眩晕状态';
        case 'damagePhysic':
          return `物理伤害 ${(effect.value * 100)}%`;
        case 'damageMagic':
          return `魔法伤害 ${(effect.value * 100)}%`;
        case 'damageBio':
          return `生物伤害 ${(effect.value * 100)}%`;
        case 'poison':
          return `中毒伤害 ${(effect.value * 100).toFixed(1)}%`;
        case 'buff':
          return `增益效果 ${effect.value} 秒`;
        default:
          return `${effect.type}: ${effect.value}`;
      }
    },
    loadSettings() {
      if (this.tempSettings) {
        this.settings = { ...this.tempSettings };
        return;
      }

      try {
        const savedSettings = this.$store.state.horde.enhancedAutocastSettings || {};
        if (savedSettings[this.equipmentName]) {
          this.settings = { ...this.settings, ...savedSettings[this.equipmentName] };
        } else {
          this.settings = this.getDefaultSettings();
        }
      } catch (error) {
        console.error('加载装备设置失败:', error);
        this.settings = this.getDefaultSettings();
      }
    },
    getDefaultSettings() {
      const defaultSettings = {
        conditionLogic: 'and',
        enemyArmor: 999,
        bossType: 'any',
        healthPercent: 75,
        enemyStunTime: 0,
        enemySilenceTime: 0,
        playerDivisionShield: 0,
        enemyDivisionShield: 1,
        poisonDamagePercent: 99,
        playerStunTime: 0,
        beforeFirstStrike: true
      };

      this.skillEffects.forEach(effect => {
        if (effect.type === 'heal') {
          const intelligence = this.$store.state.horde.cachePlayerStats?.intelligence || 0;
          const healValue = effect.value + (effect.int || 0) * intelligence;
          defaultSettings.healthPercent = Math.round((1 - healValue) * 100);
        }
      });

      if (this.hasResistanceEffect && !this.hasHealEffect) {
        defaultSettings.healthPercent = 50;
      }

      return defaultSettings;
    },

  },
  watch: {
    dialog(newVal) {
      if (newVal) {
        this.loadSettings();
      }
    },
    equipmentName(newVal, oldVal) {
      if (oldVal && newVal !== oldVal) {
        this.tempSettings = null;
      }
    }
  }
};
</script>
