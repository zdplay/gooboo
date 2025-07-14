<style scoped>
.temporary-storage-container {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 8px;
  margin: 8px 0;
}
.temporary-storage-title {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 8px;
  text-align: center;
}
.storage-slots {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 4px;
}
</style>

<template>
  <div class="temporary-storage-container">
    <div class="temporary-storage-title">临时存放</div>
    <div class="storage-slots">
      <item-slot
        v-for="i in 10"
        :key="'temp-' + (i - 1)"
        :id="'temp_' + (i - 1)"
        :slot-id="i - 1"
        :slot-type="'temporary'"
        :item-obj="temporaryStorage[i - 1]"
        class="ma-1 treasure-slot"
        :draggable="temporaryStorage[i - 1] !== null"
        @dragstart="drag($event, i - 1, 'temporary')"
        @dragover="allowDrop"
        @drop="drop($event, i - 1, 'temporary')"
        @touchend="touchdrop($event, i - 1, 'temporary')"
      ></item-slot>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import ItemSlot from './ItemSlot.vue';

export default {
  components: { ItemSlot },
  computed: {
    ...mapState({
      temporaryStorage: state => state.treasure.temporaryStorage
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
        // Handle both regular inventory items and new item (fromIndex: -1)
        if (data.fromIndex === -1) {
          // Handle exchange logic for new item to temporary storage
          const newItem = this.$store.state.treasure.newItem;
          const targetItem = this.temporaryStorage[index];

          if (newItem) {
            if (targetItem) {
              // Exchange items
              this.$store.commit('treasure/updateKey', { key: 'newItem', value: targetItem });
              this.$store.commit('treasure/updateTemporaryStorageItem', { index, item: newItem });
            } else {
              // Simple move if target is empty
              this.$store.commit('treasure/updateKey', { key: 'newItem', value: null });
              this.$store.commit('treasure/updateTemporaryStorageItem', { index, item: newItem });
            }
          }
        } else {
          // Handle exchange logic for inventory to temporary storage
          const sourceItem = this.$store.state.treasure.items[data.fromIndex];
          const targetItem = this.temporaryStorage[index];

          if (sourceItem) {
            if (targetItem) {
              // Exchange items
              this.$store.commit('treasure/setItem', { id: data.fromIndex, item: targetItem });
              this.$store.commit('treasure/updateTemporaryStorageItem', { index, item: sourceItem });
              this.$store.dispatch('treasure/updateEffectCache');
            } else {
              // Simple move if target is empty
              this.$store.dispatch('treasure/moveToTemporaryStorage', {
                itemIndex: data.fromIndex,
                storageIndex: index
              });
            }
          }
        }
      } else if (data.from === 'crafting') {
        // Handle exchange logic for crafting to temporary storage
        const sourceItem = this.$store.state.treasure.craftingSlots[data.fromIndex];
        const targetItem = this.temporaryStorage[index];

        if (sourceItem) {
          if (targetItem) {
            // Exchange items
            this.$store.commit('treasure/updateCraftingSlotItem', { index: data.fromIndex, item: targetItem });
            this.$store.commit('treasure/updateTemporaryStorageItem', { index, item: sourceItem });
          } else {
            // Simple move if target is empty
            this.$store.dispatch('treasure/moveFromCraftingSlot', {
              slotIndex: data.fromIndex,
              toType: 'temporary',
              toIndex: index
            });
          }
        }
      } else if (data.from === 'newItem') {
        // Handle exchange logic for new item to temporary storage
        const newItem = this.$store.state.treasure.newItem;
        const targetItem = this.temporaryStorage[index];

        if (newItem) {
          if (targetItem) {
            // Exchange items
            this.$store.commit('treasure/updateKey', { key: 'newItem', value: targetItem });
            this.$store.commit('treasure/updateTemporaryStorageItem', { index, item: newItem });
          } else {
            // Simple move if target is empty
            this.$store.commit('treasure/updateKey', { key: 'newItem', value: null });
            this.$store.commit('treasure/updateTemporaryStorageItem', { index, item: newItem });
          }
        }
      } else if (data.from === 'temporary' && data.fromIndex !== index) {
        // Swap items in temporary storage
        const fromItem = this.temporaryStorage[data.fromIndex];
        const toItem = this.temporaryStorage[index];
        this.$store.commit('treasure/updateTemporaryStorageItem', { index: data.fromIndex, item: toItem });
        this.$store.commit('treasure/updateTemporaryStorageItem', { index, item: fromItem });
      }
    },
    touchdrop(_, index) {
      // Handle touch events for mobile
      if (this.$store.state.treasure.draggedItem) {
        const data = this.$store.state.treasure.draggedItem;
        this.drop({ preventDefault: () => {}, dataTransfer: { getData: () => JSON.stringify(data) } }, index);
        this.$store.commit('treasure/updateKey', { key: 'draggedItem', value: null });
      }
    }
  }
}
</script>
