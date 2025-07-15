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
            @drop="drop($event, -1)"
            @dragover="allowDrop"
            @touchstart="touchstart($event, -1)"
            @touchmove="touchmove($event)"
            @touchend="touchdrop($event)"
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
          @touchmove="touchmove($event)"
          @touchend="touchdrop($event)"
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
        ev.dataTransfer.setData("text/plain", JSON.stringify({
          from: id === -1 ? 'newItem' : 'inventory',
          fromIndex: id
        }));
      } else {
        // Original drag system (legacy behavior)
        ev.dataTransfer.setData("text/plain", id);
      }
    },
    drop(ev, id) {
      ev.preventDefault();

      // Check if temporary and crafting features are enabled
      const isFeatureEnabled = this.$store.state.system.settings.experiment.items.treasureTemporaryAndCrafting &&
                               this.$store.state.system.settings.experiment.items.treasureTemporaryAndCrafting.value;

      if (isFeatureEnabled) {
        // New drag system with temporary storage and crafting
        const data = JSON.parse(ev.dataTransfer.getData("text/plain"));

        // Convert drag data to source/target format and use unified logic
        const source = {
          type: data.from === 'newItem' ? 'inventory' : data.from,
          index: data.from === 'newItem' ? -1 : data.fromIndex
        };
        const target = {
          type: 'inventory',
          index: parseInt(id)
        };

        this.handleTouchMove(source, target);
      } else {
        // Original drag system (legacy behavior)
        const startId = parseInt(ev.dataTransfer.getData("text/plain"));
        const endId = parseInt(id);
        if (startId !== endId) {
          // Use unified logic even for legacy mode to ensure consistent behavior
          const source = {
            type: 'inventory',
            index: startId
          };
          const target = {
            type: 'inventory',
            index: endId
          };
          this.handleTouchMove(source, target);
        }
      }
    },
    allowDrop(ev) {
      ev.preventDefault();
    },
    touchstart(ev, id) {
      const hasItem = id === -1 ? this.newItem !== null : (this.items[id] !== null && this.items[id] !== undefined);
      if (hasItem) {
        // Record touch start info for click/drag detection
        window.treasureTouchStart = {
          time: Date.now(),
          x: ev.touches[0].clientX,
          y: ev.touches[0].clientY,
          id: id,
          hasItem: true,
          slotType: 'inventory'
        };

        // Only prevent default for actual dragging, not for potential clicks
        // We'll determine this in touchend based on duration and movement
      } else {
        window.treasureTouchStart = null;
      }
    },
    touchmove(ev) {
      // If we have a touch start and it's been long enough or moved far enough, prevent scrolling
      if (window.treasureTouchStart) {
        const currentTime = Date.now();
        const currentDistance = Math.sqrt(
          Math.pow(ev.touches[0].clientX - window.treasureTouchStart.x, 2) +
          Math.pow(ev.touches[0].clientY - window.treasureTouchStart.y, 2)
        );

        const duration = currentTime - window.treasureTouchStart.time;
        const DRAG_MIN_DURATION = 100; // 100ms
        const DRAG_MIN_DISTANCE = 5; // 5px

        // If it's been long enough or moved far enough, treat as drag and prevent scrolling
        if (duration > DRAG_MIN_DURATION || currentDistance > DRAG_MIN_DISTANCE) {
          ev.preventDefault();
          ev.stopPropagation();
        }
      }
    },
    touchdrop(ev) {
      if (window.treasureTouchStart) {
        const touchEnd = {
          time: Date.now(),
          x: ev.changedTouches[0].clientX,
          y: ev.changedTouches[0].clientY
        };

        const duration = touchEnd.time - window.treasureTouchStart.time;
        const distance = Math.sqrt(
          Math.pow(touchEnd.x - window.treasureTouchStart.x, 2) +
          Math.pow(touchEnd.y - window.treasureTouchStart.y, 2)
        );

        // Define thresholds for click vs drag
        const CLICK_MAX_DURATION = 500; // 500ms
        const CLICK_MAX_DISTANCE = 10; // 10px

        if (duration < CLICK_MAX_DURATION && distance < CLICK_MAX_DISTANCE) {
          // This is a click, prevent default click event and trigger the click handler manually
          ev.preventDefault();
          ev.stopPropagation();

          let slotElement = null;
          if (window.treasureTouchStart.slotType === 'inventory') {
            slotElement = document.getElementById(`treasure_${window.treasureTouchStart.id}`);
          } else if (window.treasureTouchStart.slotType === 'temporary') {
            slotElement = document.getElementById(`temp_${window.treasureTouchStart.id}`);
          } else if (window.treasureTouchStart.slotType === 'crafting') {
            slotElement = document.getElementById(`craft_${window.treasureTouchStart.id}`);
          }

          if (slotElement) {
            // Find the ItemSlot component and call its handleClick method
            const itemSlotComponent = slotElement.__vue__;
            if (itemSlotComponent && itemSlotComponent.handleClick) {
              itemSlotComponent.handleClick();
            }
          }
        } else {
          // This is a drag, execute drag logic
          // Prevent scrolling during drag
          ev.preventDefault();
          ev.stopPropagation();

          const elemList = document.elementsFromPoint(ev.changedTouches[0].clientX, ev.changedTouches[0].clientY);
          if (elemList) {
            // Find target element
            const treasureElem = elemList.find(el => el.id && el.id.startsWith('treasure_'));
            const tempElem = elemList.find(el => el.id && el.id.startsWith('temp_'));
            const craftElem = elemList.find(el => el.id && el.id.startsWith('craft_'));

            const source = {
              type: window.treasureTouchStart.slotType || 'inventory',
              index: window.treasureTouchStart.id
            };

            if (treasureElem) {
              // Target is inventory slot
              const targetIndex = parseInt(treasureElem.id.split('_')[1]);
              this.handleTouchMove(source, { type: 'inventory', index: targetIndex });
            } else if (tempElem) {
              // Target is temporary storage
              const targetIndex = parseInt(tempElem.id.split('_')[1]);
              this.handleTouchMove(source, { type: 'temporary', index: targetIndex });
            } else if (craftElem) {
              // Target is crafting slot
              const targetIndex = parseInt(craftElem.id.split('_')[1]);
              this.handleTouchMove(source, { type: 'crafting', index: targetIndex });
            }
          }
        }

        // Clear touch start info
        window.treasureTouchStart = null;
      }
    },
    handleTouchMove(source, target) {
      // Don't do anything if source and target are the same
      if (source.type === target.type && source.index === target.index) {
        return;
      }

      // Get source item
      let sourceItem = null;
      if (source.type === 'inventory') {
        if (source.index === -1) {
          sourceItem = this.$store.state.treasure.newItem;
        } else {
          sourceItem = this.$store.state.treasure.items[source.index];
        }
      } else if (source.type === 'temporary') {
        sourceItem = this.$store.state.treasure.temporaryStorage[source.index];
      } else if (source.type === 'crafting') {
        sourceItem = this.$store.state.treasure.craftingSlots[source.index];
      }

      // Get target item
      let targetItem = null;
      if (target.type === 'inventory') {
        if (target.index === -1) {
          targetItem = this.$store.state.treasure.newItem;
        } else {
          targetItem = this.$store.state.treasure.items[target.index];
        }
      } else if (target.type === 'temporary') {
        targetItem = this.$store.state.treasure.temporaryStorage[target.index];
      } else if (target.type === 'crafting') {
        targetItem = this.$store.state.treasure.craftingSlots[target.index];
      }

      // Don't do anything if no source item
      if (!sourceItem) {
        return;
      }

      // Set source item to null/empty
      if (source.type === 'inventory') {
        if (source.index === -1) {
          this.$store.commit('treasure/updateKey', { key: 'newItem', value: null });
        } else {
          this.$store.commit('treasure/setItem', { id: source.index, item: null });
        }
      } else if (source.type === 'temporary') {
        this.$store.commit('treasure/updateTemporaryStorageItem', { index: source.index, item: null });
      } else if (source.type === 'crafting') {
        this.$store.commit('treasure/updateCraftingSlotItem', { index: source.index, item: null });
      }

      // Set target item to source item
      if (target.type === 'inventory') {
        if (target.index === -1) {
          this.$store.commit('treasure/updateKey', { key: 'newItem', value: sourceItem });
        } else {
          this.$store.commit('treasure/setItem', { id: target.index, item: sourceItem });
        }
      } else if (target.type === 'temporary') {
        this.$store.commit('treasure/updateTemporaryStorageItem', { index: target.index, item: sourceItem });
      } else if (target.type === 'crafting') {
        this.$store.commit('treasure/updateCraftingSlotItem', { index: target.index, item: sourceItem });
      }

      // If there was a target item, put it in the source position (exchange)
      if (targetItem) {
        if (source.type === 'inventory') {
          if (source.index === -1) {
            this.$store.commit('treasure/updateKey', { key: 'newItem', value: targetItem });
          } else {
            this.$store.commit('treasure/setItem', { id: source.index, item: targetItem });
          }
        } else if (source.type === 'temporary') {
          this.$store.commit('treasure/updateTemporaryStorageItem', { index: source.index, item: targetItem });
        } else if (source.type === 'crafting') {
          this.$store.commit('treasure/updateCraftingSlotItem', { index: source.index, item: targetItem });
        }
      }

      // Update effect cache if inventory is involved
      if (source.type === 'inventory' || target.type === 'inventory') {
        this.$store.dispatch('treasure/updateEffectCache');
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
