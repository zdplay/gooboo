<style scoped>
.treasure-slot {
  touch-action: none;
}
</style>

<template>
  <v-row no-gutters>
    <v-col :class="{'scroll-container': $vuetify.breakpoint.mdAndUp}" cols="12" md="8" lg="9">
      <chance-list></chance-list>
      <div class="d-flex flex-wrap justify-center align-center ma-1">
        <div class="d-flex flex-wrap justify-center align-center">
          <currency class="ma-1" name="gem_emerald"></currency>
          <currency class="ma-1" name="treasure_fragment"></currency>
          <gb-tooltip :min-width="0">
            <template v-slot:activator="{ on, attrs }">
              <div v-bind="attrs" v-on="on">
                <v-btn small class="ma-1 pa-1" data-cy="treasure-buy-fragment" color="success" min-width="32" min-height="32" :disabled="!canBuyFragments" @click="buyFragments"><v-icon>mdi-plus</v-icon></v-btn>
              </div>
            </template>
            <div class="mt-0">
              <span>{{ $vuetify.lang.t(`$vuetify.treasure.buyFragment.0`) }}</span>
              <price-tag class="ml-1" currency="treasure_fragment" :amount="fragmentGain" add></price-tag>
              <span>&nbsp;{{ $vuetify.lang.t(`$vuetify.treasure.buyFragment.1`) }}</span>
              <price-tag class="ml-1" currency="gem_emerald" :amount="fragmentPrice"></price-tag>
            </div>
          </gb-tooltip>
        </div>
        <v-spacer v-if="$vuetify.breakpoint.smAndUp"></v-spacer>
        <div class="d-flex flex-wrap justify-center align-center">
          <item-slot
            class="ma-1 treasure-slot"
            id="treasure_-1"
            :slot-id="-1"
            :draggable="newItem !== null"
            @dragstart="drag($event, -1)"
            @touchstart="touchstart($event, -1)"
            @touchend="touchdrop($event, -1)"
          ></item-slot>
          <buy-item class="ma-1" name="regular"></buy-item>
          <buy-item v-if="unlock.treasureDual.see" class="ma-1" name="dual"></buy-item>
        </div>
        <div class="d-flex flex-wrap justify-center align-center">
          <gb-tooltip :min-width="0">
            <template v-slot:activator="{ on, attrs }">
              <v-btn data-cy="treasure-upgrade-button" class="ma-1" :color="upgrading ? 'warning' : 'secondary'" @click="toggleUpgrading" v-bind="attrs" v-on="on">{{ $vuetify.lang.t('$vuetify.gooboo.upgradeVerb') }}</v-btn>
            </template>
            <div class="mt-0">{{ $vuetify.lang.t(`$vuetify.treasure.upgradeDescription`) }}</div>
          </gb-tooltip>
          <gb-tooltip :min-width="0">
            <template v-slot:activator="{ on, attrs }">
              <v-btn data-cy="treasure-delete-button" class="ma-1" :color="deleting ? 'error' : 'secondary'" @click="toggleDeleting" v-bind="attrs" v-on="on"><v-icon>mdi-delete</v-icon></v-btn>
            </template>
            <div class="mt-0">{{ $vuetify.lang.t(`$vuetify.treasure.destroyDescription`) }}</div>
          </gb-tooltip>
          <gb-tooltip :min-width="0">
            <template v-slot:activator="{ on, attrs }">
              <v-btn data-cy="treasure-sort-button" class="ma-1" color="info" @click="sortItems" v-bind="attrs" v-on="on"><v-icon>mdi-sort</v-icon></v-btn>
            </template>
            <div class="mt-0">整理宝藏排列</div>
          </gb-tooltip>
        </div>
      </div>
      <div class="d-flex flex-wrap ma-1">
        <item-slot
          class="ma-1 treasure-slot"
          v-for="i in treasureSlots"
          :key="i"
          :id="'treasure_' + (i - 1)"
          :slot-id="i - 1"
          :draggable="(i - 1) < items.length && items[i - 1] !== null"
          @dragstart="drag($event, i - 1)"
          @drop="drop($event, i - 1)"
          @dragover="allowDrop"
          @touchstart="touchstart($event, i - 1)"
          @touchend="touchdrop($event, i - 1)"
        ></item-slot>
      </div>

      <!-- Temporary Storage -->
      <temporary-storage v-if="$store.state.system.settings.experiment.items.treasureTemporaryAndCrafting && $store.state.system.settings.experiment.items.treasureTemporaryAndCrafting.value"></temporary-storage>

      <!-- Crafting Panel -->
      <crafting-panel v-if="$store.state.system.settings.experiment.items.treasureTemporaryAndCrafting && $store.state.system.settings.experiment.items.treasureTemporaryAndCrafting.value"></crafting-panel>
    </v-col>
    <v-col :class="{'scroll-container': $vuetify.breakpoint.mdAndUp}" cols="12" md="4" lg="3">
      <stat-list></stat-list>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import { TREASURE_FRAGMENT_BUY_COST } from '../../js/constants';
import BuyItem from '../partial/treasure/BuyItem.vue';
import ChanceList from '../partial/treasure/ChanceList.vue';
import ItemSlot from '../partial/treasure/ItemSlot.vue';
import StatList from '../partial/treasure/StatList.vue';
import TemporaryStorage from '../partial/treasure/TemporaryStorage.vue';
import CraftingPanel from '../partial/treasure/CraftingPanel.vue';
import Currency from '../render/Currency.vue';
import PriceTag from '../render/PriceTag.vue';

export default {
  components: { ChanceList, Currency, ItemSlot, StatList, BuyItem, PriceTag, TemporaryStorage, CraftingPanel },
  computed: {
    ...mapState({
      upgrading: state => state.treasure.upgrading,
      deleting: state => state.treasure.deleting,
      treasureType: state => state.treasure.type,
      unlock: state => state.unlock,
      newItem : state => state.treasure.newItem,
      items: state => state.treasure.items
    }),
    ...mapGetters({
      fragmentGain: 'treasure/fragmentGain'
    }),
    treasureSlots() {
      return this.$store.getters['mult/get']('treasureSlots');
    },
    canBuyFragments() {
      return this.$store.getters['currency/value']('gem_emerald') >= TREASURE_FRAGMENT_BUY_COST;
    },
    fragmentPrice() {
      return TREASURE_FRAGMENT_BUY_COST;
    }
  },
  methods: {
    drag(ev, id) {
      // Check if temporary and crafting features are enabled
      const isFeatureEnabled = this.$store.state.system.settings.experiment.items.treasureTemporaryAndCrafting &&
                               this.$store.state.system.settings.experiment.items.treasureTemporaryAndCrafting.value;

      if (isFeatureEnabled) {
        // New drag system with JSON data
        ev.dataTransfer.setData("text", JSON.stringify({
          from: id === -1 ? 'newItem' : 'inventory',
          fromIndex: id
        }));
      } else {
        // Original drag system (legacy behavior)
        ev.dataTransfer.setData("text", id);
      }
    },
    drop(ev, id) {
      ev.preventDefault();

      // Check if temporary and crafting features are enabled
      const isFeatureEnabled = this.$store.state.system.settings.experiment.items.treasureTemporaryAndCrafting &&
                               this.$store.state.system.settings.experiment.items.treasureTemporaryAndCrafting.value;

      if (isFeatureEnabled) {
        // New drag system with temporary storage and crafting
        const data = JSON.parse(ev.dataTransfer.getData("text"));

        if (data.from === 'inventory') {
          const startId = data.fromIndex;
          const endId = parseInt(id);
          if (startId !== endId) {
            this.$store.dispatch('treasure/moveItem', {from: startId, to: endId});
          }
        } else if (data.from === 'temporary') {
          // Handle exchange logic for temporary storage to inventory
          const targetIndex = parseInt(id);
          const targetItem = this.$store.state.treasure.items[targetIndex];
          const sourceItem = this.$store.state.treasure.temporaryStorage[data.fromIndex];

          if (targetItem && sourceItem) {
            // Exchange items
            this.$store.commit('treasure/updateTemporaryStorageItem', { index: data.fromIndex, item: targetItem });
            this.$store.commit('treasure/setItem', { id: targetIndex, item: sourceItem });
            this.$store.dispatch('treasure/updateEffectCache');
          } else {
            // Simple move if target is empty
            this.$store.dispatch('treasure/moveFromTemporaryStorage', {
              storageIndex: data.fromIndex,
              itemIndex: targetIndex
            });
          }
        } else if (data.from === 'crafting') {
          // Handle exchange logic for crafting slot to inventory
          const targetIndex = parseInt(id);
          const targetItem = this.$store.state.treasure.items[targetIndex];
          const sourceItem = this.$store.state.treasure.craftingSlots[data.fromIndex];

          if (targetItem && sourceItem) {
            // Exchange items
            this.$store.commit('treasure/updateCraftingSlotItem', { index: data.fromIndex, item: targetItem });
            this.$store.commit('treasure/setItem', { id: targetIndex, item: sourceItem });
            this.$store.dispatch('treasure/updateEffectCache');
          } else {
            // Simple move if target is empty
            this.$store.dispatch('treasure/moveFromCraftingSlot', {
              slotIndex: data.fromIndex,
              toType: 'inventory',
              toIndex: targetIndex
            });
          }
        } else if (data.from === 'newItem') {
          // Handle exchange logic for new item to inventory
          const targetIndex = parseInt(id);
          const targetItem = this.$store.state.treasure.items[targetIndex];
          const newItem = this.$store.state.treasure.newItem;

          if (newItem) {
            if (targetItem) {
              // Exchange items
              this.$store.commit('treasure/updateKey', { key: 'newItem', value: targetItem });
              this.$store.commit('treasure/setItem', { id: targetIndex, item: newItem });
            } else {
              // Simple move if target is empty
              this.$store.commit('treasure/updateKey', { key: 'newItem', value: null });
              this.$store.commit('treasure/setItem', { id: targetIndex, item: newItem });
            }
            this.$store.dispatch('treasure/updateEffectCache');
          }
        }
      } else {
        // Original drag system (legacy behavior)
        const startId = parseInt(ev.dataTransfer.getData("text"));
        const endId = parseInt(id);
        if (startId !== endId) {
          this.$store.dispatch('treasure/moveItem', {from: startId, to: endId});
        }
      }
    },
    allowDrop(ev) {
      ev.preventDefault();
    },
    touchstart(ev, id) {
      // Prevent default touch behavior (scrolling) when touching draggable items
      const hasItem = id === -1 ? this.newItem !== null : (this.items[id] !== null && this.items[id] !== undefined);
      if (hasItem) {
        ev.preventDefault();
        ev.stopPropagation();
      }
    },
    touchdrop(ev, draggedId) {
      const elemList = document.elementsFromPoint(ev.changedTouches[0].clientX, ev.changedTouches[0].clientY);
      if (elemList) {
        // Check if temporary and crafting features are enabled
        const isFeatureEnabled = this.$store.state.system.settings.experiment.items.treasureTemporaryAndCrafting &&
                                 this.$store.state.system.settings.experiment.items.treasureTemporaryAndCrafting.value;

        if (isFeatureEnabled) {
          // Check for temporary storage slots
          const tempElem = elemList.find(el => el.id && el.id.startsWith('temp_'));
          if (tempElem) {
            const tempIndex = parseInt(tempElem.id.split('_')[1]);
            if (!isNaN(tempIndex)) {
              // Handle move from inventory to temporary storage
              if (draggedId === -1) {
                // Move new item to temporary storage
                const newItem = this.$store.state.treasure.newItem;
                if (newItem) {
                  this.$store.commit('treasure/updateKey', { key: 'newItem', value: null });
                  this.$store.commit('treasure/updateTemporaryStorageItem', { index: tempIndex, item: newItem });
                }
              } else {
                // Move inventory item to temporary storage
                const sourceItem = this.$store.state.treasure.items[draggedId];
                const targetItem = this.$store.state.treasure.temporaryStorage[tempIndex];

                if (sourceItem) {
                  if (targetItem) {
                    // Exchange items
                    this.$store.commit('treasure/setItem', { id: draggedId, item: targetItem });
                    this.$store.commit('treasure/updateTemporaryStorageItem', { index: tempIndex, item: sourceItem });
                    this.$store.dispatch('treasure/updateEffectCache');
                  } else {
                    // Simple move if target is empty
                    this.$store.dispatch('treasure/moveToTemporaryStorage', {
                      itemIndex: draggedId,
                      storageIndex: tempIndex
                    });
                  }
                }
              }
              return;
            }
          }

          // Check for crafting slots
          const craftElem = elemList.find(el => el.id && el.id.startsWith('craft_'));
          if (craftElem) {
            const craftIndex = parseInt(craftElem.id.split('_')[1]);
            if (!isNaN(craftIndex)) {
              // Handle move from inventory to crafting slot
              if (draggedId === -1) {
                // Move new item to crafting slot
                const newItem = this.$store.state.treasure.newItem;
                const targetItem = this.$store.state.treasure.craftingSlots[craftIndex];

                if (newItem) {
                  if (targetItem) {
                    // Exchange items
                    this.$store.commit('treasure/updateKey', { key: 'newItem', value: targetItem });
                    this.$store.commit('treasure/updateCraftingSlotItem', { index: craftIndex, item: newItem });
                  } else {
                    // Simple move if target is empty
                    this.$store.dispatch('treasure/moveToCraftingSlot', {
                      fromType: 'newItem',
                      fromIndex: -1,
                      slotIndex: craftIndex
                    });
                  }
                }
              } else {
                // Move inventory item to crafting slot
                const sourceItem = this.$store.state.treasure.items[draggedId];
                const targetItem = this.$store.state.treasure.craftingSlots[craftIndex];

                if (sourceItem) {
                  if (targetItem) {
                    // Exchange items
                    this.$store.commit('treasure/setItem', { id: draggedId, item: targetItem });
                    this.$store.commit('treasure/updateCraftingSlotItem', { index: craftIndex, item: sourceItem });
                    this.$store.dispatch('treasure/updateEffectCache');
                  } else {
                    // Simple move if target is empty
                    this.$store.dispatch('treasure/moveToCraftingSlot', {
                      fromType: 'inventory',
                      fromIndex: draggedId,
                      slotIndex: craftIndex
                    });
                  }
                }
              }
              return;
            }
          }
        }

        // Check for regular treasure slots (works for both enabled and disabled features)
        const endElem = elemList.find(el => el.id && el.id.startsWith('treasure_'));
        if (endElem) {
          const startId = parseInt(draggedId);
          const endId = parseInt(endElem.id.split('_')[1]);
          if (startId !== endId && endId !== -1) {
            if (isFeatureEnabled) {
              // Use new drag system logic for exchange
              if (startId === -1) {
                // Handle new item to inventory exchange
                const newItem = this.$store.state.treasure.newItem;
                const targetItem = this.$store.state.treasure.items[endId];

                if (newItem) {
                  if (targetItem) {
                    // Exchange items
                    this.$store.commit('treasure/updateKey', { key: 'newItem', value: targetItem });
                    this.$store.commit('treasure/setItem', { id: endId, item: newItem });
                  } else {
                    // Simple move if target is empty
                    this.$store.commit('treasure/updateKey', { key: 'newItem', value: null });
                    this.$store.commit('treasure/setItem', { id: endId, item: newItem });
                  }
                  this.$store.dispatch('treasure/updateEffectCache');
                }
              } else {
                // Regular inventory to inventory move with exchange logic
                this.$store.dispatch('treasure/moveItem', {from: startId, to: endId});
              }
            } else {
              // Original behavior for disabled features
              this.$store.dispatch('treasure/moveItem', {from: startId, to: endId});
            }
          }
        }
      }
    },
    buyFragments() {
      if (this.$store.state.system.settings.confirm.items.gem.value) {
        this.$store.commit('system/updateKey', {key: 'confirm', value: {
          type: 'treasureFragment',
          price: {gem_emerald: TREASURE_FRAGMENT_BUY_COST},
          gain: {treasure_fragment: this.fragmentGain},
        }});
      } else {
        this.$store.dispatch('treasure/buyFragments');
      }
    },
    toggleUpgrading() {
      this.$store.commit('treasure/updateKey', {key: 'deleting', value: false});
      this.$store.commit('treasure/updateKey', {key: 'upgrading', value: !this.$store.state.treasure.upgrading});
    },
    toggleDeleting() {
      this.$store.commit('treasure/updateKey', {key: 'upgrading', value: false});
      this.$store.commit('treasure/updateKey', {key: 'deleting', value: !this.$store.state.treasure.deleting});
    },
    sortItems() {
      this.$store.dispatch('treasure/sortItems');
    }
  }
}
</script>
