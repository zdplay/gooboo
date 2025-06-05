<style scoped>
.health-bar-icon {
  position: absolute;
  left: 4px;
  top: 4px;
}
.health-bar-defense {
  position: absolute;
  left: 0;
  bottom: 0;
  height: 3px;
}
.health-bar-execute {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  opacity: 0.5;
}
.loadout-button {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
}
.position-relative {
  position: relative;
}
.loadout-header-reduce-minheight {
  min-height: unset !important;
}
</style>

<template>
  <div>
    <!-- 预载容器 -->
    <div class="d-flex flex-column align-center bg-tile-default rounded-b elevation-2 mb-2 pa-1" v-if="showLoadouts && showLoadoutFeature">
      <div class="d-flex justify-space-between align-center w-100">
        <v-btn class="ma-1" color="success" @click="addEmptyLoadout">
          <v-icon class="mr-1">mdi-plus</v-icon>
          {{ $vuetify.lang.t(`$vuetify.horde.newLoadout`) }}
        </v-btn>
        <v-btn class="ma-1" color="error" :disabled="itemsBlocked" @click="unequipAll">{{ $vuetify.lang.t(`$vuetify.gooboo.unequipAll`) }}</v-btn>
        <v-btn icon @click="showLoadouts = false"><v-icon>mdi-close</v-icon></v-btn>
      </div>
      <div v-if="loadouts.length >= 1" class="ma-1 px-1 w-100">
        <v-expansion-panels accordion>
          <v-expansion-panel v-for="(loadout, key) in loadouts" :key="`loadout-${ key }`">
            <v-expansion-panel-header class="pa-2 loadout-header-reduce-minheight">
              <div class="d-flex align-center">
                <v-badge bottom overlap :content="'' + loadout.content.length"><v-icon>mdi-sack</v-icon></v-badge>
                <div class="ma-1 ml-3">{{ loadout.name }}</div>
              </div>
              <v-spacer></v-spacer>
              <div class="flex-grow-0">
                <v-btn small class="ma-1 pa-1" color="success" min-width="32" min-height="32" :disabled="itemsBlocked || loadout.content.length <= 0" @click.native.stop="equipLoadout(key)"><v-icon>mdi-plus</v-icon></v-btn>
                <v-btn small class="ma-1 pa-1" color="error" min-width="32" min-height="32" :disabled="itemsBlocked || loadout.content.length <= 0" @click.native.stop="unequipLoadout(key)"><v-icon>mdi-minus</v-icon></v-btn>
              </div>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <equip-loadout :name="key" :key="loadout.id"></equip-loadout>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </div>
    </div>

    <v-card>
      <v-card-title class="pa-2 justify-center position-relative">
        <span v-if="subfeature === 1">{{ $vuetify.lang.t(`$vuetify.horde.classes.${ selectedClass }.name`) }}{{ isPlayerNameEnabled && $store.state.system.playerName && $store.state.system.playerName.trim() ? ' ' + $store.state.system.playerName : '' }}</span>
        <span v-else>{{ isPlayerNameEnabled && $store.state.system.playerName && $store.state.system.playerName.trim() ? $store.state.system.playerName : $vuetify.lang.t('$vuetify.horde.player') }}</span>

        <!-- 预载按钮 -->
        <v-btn v-if="showLoadoutFeature" small class="loadout-button pa-1" color="beige" min-width="20" min-height="20" style="height: 24px;" @click="toggleLoadouts">
          <v-icon small>mdi-tray-full</v-icon>
        </v-btn>
      </v-card-title>
    <v-card-text class="pb-2">
      <gb-tooltip v-if="respawn > 0" :title-text="$vuetify.lang.t('$vuetify.mult.hordeRespawn')">
        <template v-slot:activator="{ on, attrs }">
          <v-progress-linear height="24" color="dark-grey" class="balloon-text-dynamic" :value="playerPercentRespawn" v-bind="attrs" v-on="on">
            <v-icon class="health-bar-icon" small>mdi-skull</v-icon>
            {{ $formatTime(respawn) }}
          </v-progress-linear>
        </template>
        <div>{{ $vuetify.lang.t('$vuetify.horde.respawnDescription') }}</div>
        <stat-breakdown name="hordeRespawn" :base="baseRespawn"></stat-breakdown>
      </gb-tooltip>
      <gb-tooltip v-else :title-text="$vuetify.lang.t('$vuetify.mult.hordeHealth')">
        <template v-slot:activator="{ on, attrs }">
          <v-progress-linear height="24" color="green" class="balloon-text-dynamic" :value="playerPercentHealth" v-bind="attrs" v-on="on">
            <v-icon class="health-bar-icon" small>mdi-heart</v-icon>
            {{ $formatNum(playerStats.health) }} / {{ $formatNum(cachePlayerStats.health) }}
            <div v-if="cachePlayerStats.defense > 0" class="health-bar-defense dark-blue" :style="`width: ${ cachePlayerStats.defense * 100 }%;`"></div>
            <div v-if="enemyExecute > 0" class="health-bar-execute red" :style="`left: calc(${ enemyExecute * 100 }% - 1px);`"></div>
          </v-progress-linear>
        </template>
        <div>{{ $vuetify.lang.t('$vuetify.horde.healthDescription') }}</div>
        <stat-breakdown name="hordeHealth" :base="playerBaseStats.health"></stat-breakdown>
      </gb-tooltip>
      <gb-tooltip v-if="cachePlayerStats.energy > 0" :title-text="$vuetify.lang.t('$vuetify.mult.hordeEnergy')">
        <template v-slot:activator="{ on, attrs }">
          <v-progress-linear height="24" color="amber" class="balloon-text-dynamic" :value="playerPercentEnergy" v-bind="attrs" v-on="on">
            <v-icon class="health-bar-icon" small>mdi-lightning-bolt</v-icon>
            {{ $formatNum(playerStats.energy) }} / {{ $formatNum(cachePlayerStats.energy) }}
          </v-progress-linear>
        </template>
        <div>{{ $vuetify.lang.t('$vuetify.horde.energyDescription') }}</div>
        <stat-breakdown name="hordeEnergy" :base="playerBaseStats.energy"></stat-breakdown>
        <h3 class="text-center">{{ $vuetify.lang.t('$vuetify.mult.hordeEnergyRegen') }}</h3>
        <stat-breakdown name="hordeEnergyRegen" :base="playerBaseStats.energyRegen"></stat-breakdown>
      </gb-tooltip>
      <gb-tooltip v-if="cachePlayerStats.mana > 0" :title-text="$vuetify.lang.t('$vuetify.mult.hordeMana')">
        <template v-slot:activator="{ on, attrs }">
          <v-progress-linear height="24" color="dark-blue" class="balloon-text-dynamic" :value="playerPercentMana" v-bind="attrs" v-on="on">
            <v-icon class="health-bar-icon" small>mdi-water</v-icon>
            {{ $formatNum(playerStats.mana) }} / {{ $formatNum(cachePlayerStats.mana) }}
          </v-progress-linear>
        </template>
        <div>{{ $vuetify.lang.t('$vuetify.horde.manaDescription') }}</div>
        <stat-breakdown name="hordeMana" :base="playerBaseStats.mana"></stat-breakdown>
        <h3 class="text-center">{{ $vuetify.lang.t('$vuetify.mult.hordeManaRegen') }}</h3>
        <stat-breakdown name="hordeManaRegen" :base="playerBaseStats.manaRegen"></stat-breakdown>
      </gb-tooltip>
      <entity-status
        :is-player="true"
        :revive="playerStats.revive"
        :max-revive="cachePlayerStats.revive"
        :attack="cachePlayerStats.attack"
        :crit-chance="cachePlayerStats.critChance"
        :crit-mult="cachePlayerStats.critMult"
        :recovery="cachePlayerStats.recovery"
        :first-strike="cachePlayerStats.firstStrike"
        :spellblade="cachePlayerStats.spellblade"
        :defense="cachePlayerStats.defense"
        :execute="cachePlayerStats.execute"
        :cutting="cachePlayerStats.cutting"
        :division-shield="playerStats.divisionShield"
        :max-division-shield="cachePlayerStats.divisionShield"
        :shieldbreak="cachePlayerStats.shieldbreak"
        :stun-resist="cachePlayerStats.stunResist"
        :toxic="cachePlayerStats.toxic"
        :silence="playerStats.silence"
        :stun="playerStats.stun"
        :poison="playerStats.poison"
        :physic-conversion="cachePlayerStats.physicConversion"
        :physic-attack="cachePlayerStats.physicAttack"
        :physic-taken="cachePlayerStats.physicTaken"
        :magic-conversion="cachePlayerStats.magicConversion"
        :magic-attack="cachePlayerStats.magicAttack"
        :magic-taken="cachePlayerStats.magicTaken"
        :bio-conversion="cachePlayerStats.bioConversion"
        :bio-attack="cachePlayerStats.bioAttack"
        :bio-taken="cachePlayerStats.bioTaken"
        :hits="playerStats.hits"
        :spells="playerStats.spells"
      >
        <gb-tooltip v-if="cachePlayerStats.strength > 0" :title-text="$vuetify.lang.t(`$vuetify.mult.hordeStrength`)">
          <template v-slot:activator="{ on, attrs }">
            <v-chip label small :color="`orange-red ${ themeModifier }`" class="balloon-text-dynamic ma-1 px-2" v-bind="attrs" v-on="on"><v-icon class="mr-2">mdi-arm-flex</v-icon>{{ $formatNum(cachePlayerStats.strength) }}</v-chip>
          </template>
          <stat-breakdown name="hordeStrength"></stat-breakdown>
        </gb-tooltip>
        <gb-tooltip v-if="cachePlayerStats.intelligence > 0" :title-text="$vuetify.lang.t(`$vuetify.mult.hordeIntelligence`)">
          <template v-slot:activator="{ on, attrs }">
            <v-chip label small :color="`indigo ${ themeModifier }`" class="balloon-text-dynamic ma-1 px-2" v-bind="attrs" v-on="on"><v-icon class="mr-2">mdi-lightbulb-on</v-icon>{{ $formatNum(cachePlayerStats.intelligence) }}</v-chip>
          </template>
          <stat-breakdown name="hordeIntelligence"></stat-breakdown>
        </gb-tooltip>
        <gb-tooltip v-if="cachePlayerStats.haste > 0" :title-text="$vuetify.lang.t(`$vuetify.mult.hordeHaste`)">
          <template v-slot:activator="{ on, attrs }">
            <v-chip label small :color="`pale-yellow ${ themeModifier }`" class="balloon-text-dynamic ma-1 px-2" v-bind="attrs" v-on="on"><v-icon class="mr-2">mdi-timer-sand</v-icon>{{ $formatNum(cachePlayerStats.haste) }}</v-chip>
          </template>
          <stat-breakdown name="hordeHaste"></stat-breakdown>
        </gb-tooltip>
        <template slot="between">
          <div v-if="cachePlayerStats.mana > 0" class="d-flex justify-end mt-1"><consumable name="horde_manaPotion" :disabled="playerStats.mana >= cachePlayerStats.mana" @click="useManaPotion"></consumable></div>
        </template>
      </entity-status>
    </v-card-text>
  </v-card>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import Consumable from '../../render/Consumable.vue';
import StatBreakdown from '../../render/StatBreakdown.vue';
import EntityStatus from './EntityStatus.vue';
import EquipLoadout from './EquipLoadout.vue';
import { screenLayoutMixin } from '../../../mixins/screenLayout';

export default {
  components: { StatBreakdown, EntityStatus, Consumable, EquipLoadout },
  mixins: [screenLayoutMixin],
  data() {
    return {
      showLoadouts: false
    }
  },
  computed: {
    ...mapState({
      playerStats: state => state.horde.player,
      respawn: state => state.horde.respawn,
      maxRespawn: state => state.horde.maxRespawn,
      subfeature: state => state.system.features.horde.currentSubfeature,
      cachePlayerStats: state => state.horde.cachePlayerStats,
      selectedClass: state => state.horde.selectedClass,
    }),
    ...mapGetters({
      baseRespawn: 'horde/baseRespawnTime',
      playerBaseStats: 'horde/playerBaseStats'
    }),
    themeModifier() {
      return this.$vuetify.theme.dark ? 'darken-2' : 'lighten-2';
    },
    playerPercentHealth() {
      return 100 * this.playerStats.health / this.cachePlayerStats.health;
    },
    playerPercentEnergy() {
      if (this.cachePlayerStats.energy === undefined) {
        return 0;
      }
      return 100 * this.playerStats.energy / this.cachePlayerStats.energy;
    },
    playerPercentMana() {
      if (this.cachePlayerStats.mana === undefined) {
        return 0;
      }
      return 100 * this.playerStats.mana / this.cachePlayerStats.mana;
    },
    playerPercentRespawn() {
      return 100 * (1 - this.respawn / this.maxRespawn);
    },
    enemyExecute() {
      return this.$store.state.horde.enemy ? this.$store.state.horde.enemy.execute : 0;
    },
    isPlayerNameEnabled() {
      return this.$store.state.system.settings.experiment.items.enablePlayerName.value;
    },
    showLoadoutFeature() {
      return this.$store.state.system.settings.experiment.items.mobileHordeLoadoutLayout.value &&
             (this.isCustomSmAndDown || this.isCustomMdOnly);
    },
    loadouts() {
      return this.$store.state.horde.loadout;
    },
    itemsBlocked() {
      return this.$store.state.cryolab.horde.active || this.$store.state.horde.currentTower !== null;
    }
  },
  methods: {
    useManaPotion() {
      const consumables = {horde_manaPotion: 1};
      const price = this.$store.getters['consumable/priceMultiple'](consumables).price;
      if (this.$store.state.system.settings.confirm.items.gem.value && this.$store.getters['currency/contains'](price, 'gem')) {
        this.$store.commit('system/updateKey', {key: 'confirm', value: {
          type: 'consumable',
          subtype: 'useManaPotion',
          consumable: consumables,
          price: this.$store.getters['currency/filterPrice'](price, 'gem'),
        }});
      } else {
        this.$store.dispatch('horde/useManaPotion');
      }
    },
    toggleLoadouts() {
      this.showLoadouts = !this.showLoadouts;
    },
    addEmptyLoadout() {
      this.$store.commit('horde/addEmptyLoadout');
    },
    equipLoadout(key) {
      this.$store.dispatch('horde/equipLoadout', key);
    },
    unequipLoadout(key) {
      this.$store.dispatch('horde/unequipLoadout', key);
    },
    unequipAll() {
      this.$store.dispatch('horde/unequipAll');
    }
  }
}
</script>
