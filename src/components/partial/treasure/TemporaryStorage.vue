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
    <div class="storage-slots" @touchmove="handleTouchMove">
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
        @drop="drop($event, i - 1)"
        @touchstart="touchstart($event, i - 1)"
        @touchend="$parent.touchdrop($event)"
      ></item-slot>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import ItemSlot from './ItemSlot.vue';

export default {
  name: 'TemporaryStorage',
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

      // Convert drag data to source/target format and use unified logic
      const source = {
        type: data.from === 'newItem' ? 'inventory' : data.from,
        index: data.from === 'newItem' ? -1 : data.fromIndex
      };
      const target = {
        type: 'temporary',
        index: index
      };

      this.$parent.handleTouchMove(source, target);
    },
    touchstart(ev, index) {
      const hasItem = this.temporaryStorage[index] !== null;
      if (hasItem) {
        // Record touch start info for click/drag detection
        window.treasureTouchStart = {
          time: Date.now(),
          x: ev.touches[0].clientX,
          y: ev.touches[0].clientY,
          id: index,
          hasItem: true,
          slotType: 'temporary'
        };
      } else {
        window.treasureTouchStart = null;
      }
    },
    handleTouchMove(ev) {
      // Call parent's touchmove method
      this.$parent.touchmove(ev);
    }

  }
}
</script>
