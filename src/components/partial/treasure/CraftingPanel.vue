<style scoped>
.crafting-container {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 8px;
  margin: 8px 0;
}
.crafting-title {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 8px;
  text-align: center;
}
.crafting-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
}
.crafting-slots {
  display: flex;
  gap: 4px;
}
.crafting-controls {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: center;
}
.craft-button {
  min-width: 80px !important;
}
.help-button {
  min-width: 32px !important;
  min-height: 32px !important;
}
</style>

<template>
  <div class="crafting-container">
    <div class="crafting-title">宝藏合成</div>
    <div class="crafting-content">
      <div class="crafting-slots">
        <item-slot
          v-for="i in 3"
          :key="'craft-' + (i - 1)"
          :id="'craft_' + (i - 1)"
          :slot-id="i - 1"
          :slot-type="'crafting'"
          :item-obj="craftingSlots[i - 1]"
          class="ma-1 treasure-slot"
          :draggable="craftingSlots[i - 1] !== null"
          @dragstart="drag($event, i - 1, 'crafting')"
          @dragover="allowDrop"
          @drop="drop($event, i - 1, 'crafting')"
          @touchend="touchdrop($event, i - 1, 'crafting')"
        ></item-slot>
      </div>
      
      <div class="crafting-controls">
        <v-btn
          class="craft-button"
          color="primary"
          :disabled="!canCraft"
          @click="craftTreasure"
        >
          合成
        </v-btn>
        
        <gb-tooltip :min-width="300">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              class="help-button"
              color="info"
              icon
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>mdi-help-circle</v-icon>
            </v-btn>
          </template>
          <div class="mt-0">
            <div class="font-weight-bold mb-2">合成规则：</div>
            <div class="mb-1">• 需要3个同颜色宝藏才能合成</div>
            <div class="mb-1">• 同颜色同效果：合成更高一级颜色的同效果宝藏</div>
            <div class="mb-1">• 同颜色不同效果：随机合成同颜色或更高一级颜色的宝藏</div>
            <div class="mb-1">• 合成会退回消耗宝藏的碎片</div>
            <div class="mb-1">• 临时存放和合成槽中的宝藏不会生效</div>
          </div>
        </gb-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import ItemSlot from './ItemSlot.vue';

export default {
  components: { ItemSlot },
  computed: {
    ...mapState({
      craftingSlots: state => state.treasure.craftingSlots
    }),
    ...mapGetters({
      canCraft: 'treasure/canCraft'
    })
  },
  methods: {
    drag(event, index, type) {
      event.dataTransfer.setData('text/plain', JSON.stringify({
        from: type,
        fromIndex: index
      }));
    },
    allowDrop(event) {
      event.preventDefault();
    },
    drop(event, index) {
      event.preventDefault();
      const data = JSON.parse(event.dataTransfer.getData('text/plain'));
      
      if (data.from === 'inventory') {
        this.$store.dispatch('treasure/moveToCraftingSlot', {
          fromType: 'inventory',
          fromIndex: data.fromIndex,
          slotIndex: index
        });
      } else if (data.from === 'temporary') {
        this.$store.dispatch('treasure/moveToCraftingSlot', {
          fromType: 'temporary',
          fromIndex: data.fromIndex,
          slotIndex: index
        });
      } else if (data.from === 'newItem') {
        this.$store.dispatch('treasure/moveToCraftingSlot', {
          fromType: 'newItem',
          fromIndex: -1,
          slotIndex: index
        });
      } else if (data.from === 'crafting' && data.fromIndex !== index) {
        // Swap items in crafting slots
        const fromItem = this.craftingSlots[data.fromIndex];
        const toItem = this.craftingSlots[index];
        this.$store.commit('treasure/updateCraftingSlotItem', { index: data.fromIndex, item: toItem });
        this.$store.commit('treasure/updateCraftingSlotItem', { index, item: fromItem });
      }
    },
    touchdrop(_, index) {
      // Handle touch events for mobile
      if (this.$store.state.treasure.draggedItem) {
        const data = this.$store.state.treasure.draggedItem;
        this.drop({ preventDefault: () => {}, dataTransfer: { getData: () => JSON.stringify(data) } }, index, 'crafting');
        this.$store.commit('treasure/updateKey', { key: 'draggedItem', value: null });
      }
    },
    craftTreasure() {
      if (this.canCraft) {
        this.$store.dispatch('treasure/craftTreasure');
      }
    }
  }
}
</script>
