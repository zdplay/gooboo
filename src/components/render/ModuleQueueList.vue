<style scoped>
.queue-item {
  touch-action: none;
}
.queue-item-content {
  display: flex;
  align-items: center;
  padding: 4px 8px;
  background: rgba(0,0,0,0.1);
  border-radius: 4px;
  margin: 2px;
}
.upgrade-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 0.9rem;
}
.queue-number {
  min-width: 24px;
  text-align: center;
  font-weight: bold;
  margin-right: 4px;
  opacity: 0.7;
}
.queue-header {
  cursor: pointer;
  user-select: none;
}
.compact-card {
  min-height: unset !important;
}
.compact-header {
  padding: 4px 0;
  line-height: 1;
}
.queue-delete-btn {
  margin-left: 4px;
  opacity: 0.7;
  transition: opacity 0.2s;
}
.queue-delete-btn:hover {
  opacity: 1;
}
</style>

<template>
  <v-card class="d-flex flex-column justify-space-between ma-2" :class="{'compact-card': !expanded}" :min-height="expanded ? 52 : 'unset'" v-if="enabled && showQueue">
    <div class="text-center queue-header d-flex align-center justify-center" :class="{'compact-header': !expanded, 'py-1': expanded}" @click="toggleExpanded">
      <span>升级队列</span>
      <v-icon small class="ml-2">{{ expanded ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
    </div>
    <div class="d-flex flex-wrap align-center pa-2" style="min-height: 48px;" v-if="expanded">
      <template v-if="queue.length > 0">
        <div
          class="queue-item"
          v-for="(item, key) in queue"
          :key="key"
          :id="`module-queue-${moduleName}-${type}-${key}`"
          :draggable="!disabled"
          @dragstart="drag($event, queueLength - key)"
          @drop="drop($event, key)"
          @dragover="allowDrop"
          @touchstart="touchdrag(queueLength - key)"
          @touchend="touchdrop($event)"
        >
          <div class="queue-item-content">
            <div class="queue-number">{{ key + 1 }}</div>
            <span v-if="item.amount > 1" class="mr-2">×{{ item.amount }}</span>
            <span class="upgrade-name">{{ getUpgradeName(item.name) }}</span>
            <v-btn
              icon
              x-small
              class="queue-delete-btn"
              @click.stop="removeQueueItem(item.name)"
              :disabled="disabled"
            >
              <v-icon small>mdi-close</v-icon>
            </v-btn>
          </div>
        </div>
        <v-spacer></v-spacer>
      </template>
      <div class="text-center flex-grow-1" v-else>队列为空</div>
    </div>
  </v-card>
</template>

<script>
import { mapState } from 'vuex';

export default {
  props: {
    moduleName: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data: () => ({
    touchId: null,
    expanded: false  // 默认折叠
  }),
  computed: {
    ...mapState({
      upgrades: state => state.upgrade.item
    }),
    queueKey() {
      return `${this.moduleName}_${this.type}`;
    },
    queue() {
      let arr = [];
      const moduleQueue = this.$store.state.upgrade.moduleQueue[this.queueKey];
      if (!moduleQueue) return arr;

      const currentSubfeature = this.$store.state.system.features[this.moduleName]?.currentSubfeature;
      const currentSubfeatureItems = moduleQueue.filter(item => {
        const upgrade = this.$store.state.upgrade.item[item];
        return upgrade && upgrade.subfeature === currentSubfeature;
      });
      currentSubfeatureItems.forEach(elem => {
        if (arr.length > 0 && elem === arr[arr.length - 1].name) {
          arr[arr.length - 1].amount++;
        } else {
          arr.push({name: elem, amount: 1});
        }
      });

      return arr;
    },
    queueLength() {
      return this.queue.length - 1;
    },
    showQueue() {
      const moduleQueue = this.$store.state.upgrade.moduleQueue[this.queueKey];
      if (!moduleQueue || moduleQueue.length === 0) {
        return false;
      }
      const currentSubfeature = this.$store.state.system.features[this.moduleName]?.currentSubfeature;
      const hasCurrentSubfeatureItems = moduleQueue.some(item => {
        const upgrade = this.$store.state.upgrade.item[item];
        return upgrade && upgrade.subfeature === currentSubfeature;
      });
      return hasCurrentSubfeatureItems;
    },
    enabled() {
      return this.$store.state.system.settings.experiment.items.enableUpgradeQueue.value;
    }
  },
  methods: {
    toggleExpanded() {
      this.expanded = !this.expanded;
    },
    drag(ev, id) {
      ev.dataTransfer.setData("text", id);
    },
    drop(ev, id) {
      ev.preventDefault();
      if (!this.disabled) {
        const draggedId = this.queueLength - parseInt(ev.dataTransfer.getData("text"));
        if (draggedId >= 0) {
          this.switchQueue(draggedId, id);
        }
      }
    },
    allowDrop(ev) {
      ev.preventDefault();
    },
    touchdrag(id) {
      this.touchId = id;
    },
    touchdrop(ev) {
      if (this.touchId !== null) {
        const draggedId = this.queueLength - this.touchId;
        this.touchId = null;
        if (!this.disabled) {
          const elemList = document.elementsFromPoint(ev.changedTouches[0].clientX, ev.changedTouches[0].clientY);
          if (draggedId >= 0 && elemList) {
            const endElem = elemList.find(el => el.id.slice(0, `module-queue-${this.moduleName}-${this.type}`.length) === `module-queue-${this.moduleName}-${this.type}`);
            if (endElem) {
              const endIdSplit = endElem.id.split('-');
              const endId = parseInt(endIdSplit[endIdSplit.length - 1]);
              this.switchQueue(draggedId, endId);
            }
          }
        }
      }
    },
    switchQueue(startId, endId) {
      let queue = [...this.queue];
      const oldValue = queue[startId];
      queue[startId] = queue[endId];
      queue[endId] = oldValue;
      let newQueue = [];
      queue.forEach(elem => {
        for (let i = 0; i < elem.amount; i++) {
          newQueue.push(elem.name);
        }
      });
      this.$store.commit('upgrade/updateModuleQueue', {module: this.queueKey, queue: newQueue});
    },
    getUpgradeName(fullName) {
      try {
        return this.$vuetify.lang.t(`$vuetify.upgrade.${fullName}`);
      } catch (e) {
        const parts = fullName.split('_');
        return parts.length >= 2 ? parts[1] : fullName;
      }
    },
    removeQueueItem(itemName) {
      this.$store.commit('upgrade/removeFromModuleQueue', {
        module: this.queueKey,
        item: itemName
      });
    }
  }
}
</script> 