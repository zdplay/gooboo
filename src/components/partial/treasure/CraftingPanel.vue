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
      <div class="crafting-slots" @touchmove="handleTouchMove">
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
          @drop="drop($event, i - 1)"
          @touchstart="touchstart($event, i - 1)"
          @touchend="$parent.touchdrop($event)"
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
            <div class="mb-1">• 需要3个同层数的宝藏才能合成</div>
            <div class="mb-1">• 同层数的同效果：合成更高一级颜色的同效果宝藏（最高到当前最高层+1）</div>
            <div class="mb-1">• 同层数的不同效果：随机合成同颜色或更高一级颜色的宝藏</div>
            <div class="mb-1">• 合成会退回消耗宝藏的碎片</div>
            <div class="mb-1">• 临时存放和合成槽中的宝藏不会生效</div>

            <div class="font-weight-bold mt-3 mb-2">随机合成升级概率：</div>
            <v-simple-table dense class="mb-2">
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">当前层数</th>
                    <th class="text-left">升级概率</th>
                    <th class="text-left">保持概率</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in probabilityTable" :key="index">
                    <td>{{ item.tierName }}</td>
                    <td :class="item.upgradeClass">{{ item.upgradeChance }}%</td>
                    <td>{{ item.keepChance }}%</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>

            <div class="caption grey--text">
              * 最高层数基于当前全局等级动态计算<br>
              * 普通合成最高限制为当前最高层+1
            </div>
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
      canCraft: 'treasure/canCraft',
      tierChances: 'treasure/tierChances',
      tierChancesRaw: 'treasure/tierChancesRaw'
    }),
    probabilityTable() {
      const tierChancesRaw = this.tierChancesRaw;
      const maxTier = Math.max(...tierChancesRaw.map(item => item.tier)); // 实际最高层索引
      const table = [];

      const layersToShow = [maxTier - 1, maxTier, maxTier + 1];

      if (maxTier > 1) {
        table.push({
          tierName: '其他层',
          upgradeChance: 50,
          keepChance: 50,
          upgradeClass: 'success--text'
        });
      }

      layersToShow.forEach(tier => {
        if (tier >= 0) {
          let upgradeChance, upgradeClass;

          if (tier === maxTier - 1) {
            upgradeChance = 30;
            upgradeClass = 'success--text';
          } else if (tier === maxTier) {
            upgradeChance = 5;
            upgradeClass = 'warning--text';
          } else if (tier === maxTier + 1) {
            upgradeChance = 0;
            upgradeClass = 'error--text';
          }

          table.push({
            tierName: `层${tier + 1}`,
            upgradeChance,
            keepChance: 100 - upgradeChance,
            upgradeClass
          });
        }
      });

      return table;
    }
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
    touchstart(ev, index) {
      const hasItem = this.craftingSlots[index] !== null;
      if (hasItem) {
        // Record touch start info for click/drag detection
        window.treasureTouchStart = {
          time: Date.now(),
          x: ev.touches[0].clientX,
          y: ev.touches[0].clientY,
          id: index,
          hasItem: true,
          slotType: 'crafting'
        };
      } else {
        window.treasureTouchStart = null;
      }
    },
    handleTouchMove(ev) {
      // Call parent's touchmove method
      this.$parent.touchmove(ev);
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
        type: 'crafting',
        index: index
      };

      this.$parent.handleTouchMove(source, target);
    },

    craftTreasure() {
      if (this.canCraft) {
        this.$store.dispatch('treasure/craftTreasure');
      }
    }
  }
}
</script>
