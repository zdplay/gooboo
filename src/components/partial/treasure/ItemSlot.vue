<style scoped>
.treasure-item-slot {
  position: relative;
  width: 80px;
  height: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.treasure-item-slot-mobile {
  width: 64px;
  height: 64px;
}
.treasure-badge {
  position: absolute;
  left: 0;
  top: 4px;
}
.effect-name {
  font-size: 12px;
  text-align: center;
  margin-top: 2px;
  margin-bottom: 0;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.2;
}
.effect-value {
  font-size: 11px;
  text-align: center;
  margin-top: 0;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.2;
}
</style>

<template>
  <div :data-cy="slotId !== null ? `treasure-slot-${ slotId }` : undefined" @click="handleClick" v-bind="$attrs" v-on="$listeners" class="treasure-item-slot bg-tile-default elevation-2 d-flex flex-column justify-start align-center rounded-lg" :class="{'treasure-item-slot-mobile': $vuetify.breakpoint.xsOnly}">
    <div class="d-flex justify-center align-center" style="flex: 1;">
      <v-badge v-if="item" :value="itemType.icon" bordered :icon="itemType.icon" color="grey">
        <v-badge bordered overlap bottom :value="item.level > 0" :content="'+' + item.level" color="success">
          <gb-tooltip :title-text="$vuetify.lang.t(`$vuetify.treasure.tierItem`, item.tier + 1)">
            <template v-slot:activator="{ on, attrs }">
              <v-icon class="balloon-text-black" :size="$vuetify.breakpoint.xsOnly ? 24 : 32" :color="itemColor" v-bind="attrs" v-on="on">{{ effectObj[effectToFeature[item.effect[0]]][item.effect[0]].icon }}</v-icon>
            </template>
            <div class="d-flex align-center mt-0" v-for="(effect, index) in item.effect" :key="effect">
              <v-icon small class="mr-2">{{ featureIcon[effectToFeature[effect]].icon }}</v-icon>
              <display-row class="flex-grow-1" :name="effect" type="mult" :before="itemValue[index]" :after="(slotId !== null && upgrading) ? itemValueNext[index] : null"></display-row>
            </div>
          </gb-tooltip>
        </v-badge>
      </v-badge>
      <v-badge class="treasure-badge balloon-text-black" inline bordered left v-if="slotId !== null && slotType === 'inventory' && upgrading && upgradeCost !== null" :content="'-' + $formatNum(upgradeCost)" color="amber"></v-badge>
      <v-badge class="treasure-badge balloon-text-black" inline bordered left v-if="slotId !== null && slotType === 'inventory' && deleting && destroyValue !== null" :content="'+' + $formatNum(destroyValue)" color="amber"></v-badge>
    </div>
    <template v-if="item && item.effect && item.effect.length > 0">
      <div class="effect-name">{{ effectName }}</div>
      <div class="effect-value">
        <mult-stat :mult="item.effect[0]" type="mult" :value="itemValue[0]"></mult-stat>
      </div>
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import DisplayRow from '../upgrade/DisplayRow.vue';
import MultStat from '../render/MultStat.vue';

export default {
  components: { DisplayRow, MultStat },
  props: {
    slotId: {
      type: Number,
      required: false,
      default: null
    },
    itemObj: {
      type: Object,
      required: false,
      default: null
    },
    slotType: {
      type: String,
      required: false,
      default: 'inventory'
    }
  },
  computed: {
    ...mapState({
      upgrading: state => state.treasure.upgrading,
      deleting: state => state.treasure.deleting,
      effectToFeature: state => state.treasure.effectToFeature,
      effectObj: state => state.treasure.effect,
      featureIcon: state => state.system.features
    }),
    item() {
      if (this.itemObj !== null) {
        return this.itemObj;
      }

      // Check if temporary and crafting features are enabled
      const isFeatureEnabled = this.$store.state.system.settings.experiment.items.treasureTemporaryAndCrafting &&
                               this.$store.state.system.settings.experiment.items.treasureTemporaryAndCrafting.value;

      if (isFeatureEnabled) {
        if (this.slotType === 'temporary') {
          return this.slotId < this.$store.state.treasure.temporaryStorage.length ? this.$store.state.treasure.temporaryStorage[this.slotId] : null;
        } else if (this.slotType === 'crafting') {
          return this.slotId < this.$store.state.treasure.craftingSlots.length ? this.$store.state.treasure.craftingSlots[this.slotId] : null;
        }
      }

      return this.slotId === -1 ? this.$store.state.treasure.newItem : (this.slotId < this.$store.state.treasure.items.length ? this.$store.state.treasure.items[this.slotId] : null);
    },
    itemColor() {
      if (this.item === null) {
        return null;
      }
      return this.$store.state.treasure.tierColor[this.item.tier];
    },
    itemType() {
      if (this.item === null) {
        return null;
      }
      return this.$store.state.treasure.type[this.item.type];
    },
    itemValue() {
      if (this.item === null) {
        return [];
      }
      return this.item.valueCache.map(el => el + 1);
    },
    itemValueNext() {
      if (this.item === null) {
        return [];
      }
      return this.item.effect.map((el, i) => this.$store.getters['treasure/effectValue'](
        this.effectObj[this.effectToFeature[el]][el].value * this.itemType.slots[i].power,
        this.item.tier,
        this.item.level + 1,
        this.item.type
      ) + 1);
    },
    upgradeCost() {
      if (this.item === null) {
        return null;
      }
      return this.$store.getters['treasure/upgradeFragments'](this.item.tier, this.item.level, this.item.type);
    },
    fragmentIcon() {
      return this.$store.state.currency.treasure_fragment.icon;
    },
    destroyValue() {
      if (this.item === null) {
        return null;
      }
      return this.item.fragmentsSpent + this.$store.getters['treasure/destroyFragments'](this.item.tier, this.item.type);
    },
    effectName() {
      if (this.item === null || !this.item.effect || this.item.effect.length === 0) {
        return '';
      }
      const effectId = this.item.effect[0];
      
      if (this.$store.getters['mult/isUpgradeCap'](effectId)) {
        return this.$vuetify.lang.t('$vuetify.upgrade.maxLevel', this.$vuetify.lang.t(`$vuetify.upgrade.${this.$store.getters['mult/getUpgradeName'](effectId)}`));
      } else if (this.$store.getters['mult/isCurrencyCap'](effectId)) {
        return this.$vuetify.lang.t(`$vuetify.gooboo.multCapacity`, this.$vuetify.lang.t(`$vuetify.currency.${this.$store.getters['mult/getCurrencyName'](effectId)}.name`));
      } else if (this.$store.getters['mult/isCurrencyGain'](effectId)) {
        return this.$vuetify.lang.t(`$vuetify.gooboo.multGain`, this.$vuetify.lang.t(`$vuetify.currency.${this.$store.getters['mult/getCurrencyName'](effectId, 4)}.name`));
      } else if (this.$store.getters['mult/isCryolabPassive'](effectId)) {
        return this.$vuetify.lang.t(`$vuetify.cryolab.passiveTitle`);
      } else if (this.$store.getters['mult/isCryolabActive'](effectId)) {
        return this.$vuetify.lang.t(`$vuetify.cryolab.activeTitle`);
      } else {
        return this.$vuetify.lang.t(`$vuetify.mult.${effectId}`);
      }
    }
  },
  methods: {
    handleClick() {
      if (this.slotId !== null) {
        // Only allow upgrade/delete for inventory slots
        if (this.slotType === 'inventory') {
          if (this.upgrading && this.upgradeCost !== null && (this.slotId === -1 ? this.$store.state.treasure.newItem : this.$store.state.treasure.items[this.slotId])) {
            this.$store.dispatch('treasure/upgradeItem', this.slotId);
          } else if (this.deleting && (this.slotId === -1 ? this.$store.state.treasure.newItem : this.$store.state.treasure.items[this.slotId])) {
            if (this.$store.state.system.settings.confirm.items.treasureDelete.value) {
              this.$store.commit('system/updateKey', {key: 'confirm', value: {
                type: 'treasureDelete',
                id: this.slotId,
                gain: {treasure_fragment: this.destroyValue},
              }});
            } else {
              this.$store.dispatch('treasure/deleteItem', this.slotId);
            }
          } else {
            if (this.slotId !== -1 && this.$store.state.treasure.newItem && !this.$store.state.treasure.items[this.slotId]) {
              this.$store.dispatch('treasure/moveItem', {from: -1, to: this.slotId});
            }
          }
        }
        // For temporary and crafting slots, no special click behavior needed
      }
    }
  }
}
</script>