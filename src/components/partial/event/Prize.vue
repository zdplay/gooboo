<template>
  <price-tag v-if="prize.type === 'currency'" add :currency="resolvedItem" :amount="amount"></price-tag>
  <div v-else-if="prize.type === 'consumable'" class="d-flex align-center">
    <consumable :name="resolvedItem" show-details></consumable>
    <div class="ml-2" v-if="amount > 1"><v-icon size="10">mdi-close</v-icon>{{ amount }}</div>
  </div>
  <div v-else-if="prize.type === 'cardPack'" class="d-flex align-center">
    <v-icon>mdi-cards</v-icon>
    <div class="mx-1">{{ $vuetify.lang.t(`$vuetify.card.pack.${ resolvedItem }`) }}</div>
    <v-chip class="px-2 mx-1" label small><v-icon class="mr-1">mdi-cards</v-icon>{{ cardPackAmount * amount }}</v-chip>
  </div>
  <mini v-else-if="prize.type === 'relic'" large :name="resolvedItem"></mini>
  <theme-item v-else-if="prize.type === 'theme'" :name="resolvedItem" hide-actions small></theme-item>
  <item-slot v-else-if="prize.type === 'treasure' && treasureModuleReady" :item-obj="prize.data"></item-slot>
  <div v-else-if="prize.type === 'treasure' && !treasureModuleReady" class="d-flex align-center justify-center" style="width: 80px; height: 80px;">
    <v-progress-circular indeterminate size="24" color="primary"></v-progress-circular>
  </div>
</template>

<script>
import Consumable from '../../render/Consumable.vue';
import PriceTag from '../../render/PriceTag.vue';
import Mini from '../relic/Mini.vue';
import ThemeItem from '../settings/ThemeItem.vue';
import ItemSlot from '../treasure/ItemSlot.vue';

export default {
  components: { Consumable, Mini, PriceTag, ThemeItem, ItemSlot },
  props: {
    pool: {
      type: String,
      required: true
    },
    prizeBase: {
      type: Object,
      required: true
    }
  },
  computed: {
    prize() {
      const prize = this.$store.state.event.prize[this.prizeBase.prize];
      return {...prize, ...prize.pool[this.pool], ...this.prizeBase};
    },
    resolvedItem() {
      if (this.prizeBase.item && typeof this.prizeBase.item === 'string') {
        return this.prizeBase.item;
      }

      if (typeof this.prize.item === 'function') {
        console.warn('Prize component: Using function item without concrete value in prizeBase');
        try {
          return this.prize.item();
        } catch (error) {
          console.error('Prize item function error:', error);
          return 'unknown';
        }
      }

      return this.prize.item;
    },
    amount() {
      // 安全计算显示数量，避免 NaN 错误
      try {
        const prizeAmount = this.prize.amount;
        const multiplier = this.prize.amountMult ? this.prize.amountMult() : 1;

        // 检查 prizeAmount 是否有问题
        if (isNaN(prizeAmount) || prizeAmount === null || prizeAmount === undefined) {
          this.$store.commit('system/addNotification', {
            color: 'warning',
            timeout: 10000,
            message: {
              type: 'text',
              text: `显示错误: ${this.prize.item || '未知物品'} - prize.amount 错误: ${prizeAmount}`
            }
          });
          return 1;
        }

        // 检查 multiplier 是否有问题
        if (isNaN(multiplier) || multiplier === null || multiplier === undefined) {
          this.$store.commit('system/addNotification', {
            color: 'warning',
            timeout: 10000,
            message: {
              type: 'text',
              text: `显示错误: ${this.prize.item || '未知物品'} - amountMult() 错误: ${multiplier}`
            }
          });
          return 1;
        }

        const result = prizeAmount * multiplier;
        return result;
      } catch (error) {
        console.error('🐛 [Prize Display] 奖品显示数量计算异常:', error, {
          prizeId: this.prizeBase.prize,
          pool: this.pool,
          prizeData: this.prize
        });

        this.$store.commit('system/addNotification', {
          color: 'warning',
          timeout: 10000,
          message: {
            type: 'text',
            text: `显示异常: ${this.prize.item || '未知物品'} - ${error.message}`
          }
        });

        return 1; // 默认返回 1
      }
    },
    cardPackAmount() {
      return this.prize.type === 'cardPack' ? this.$store.state.card.pack[this.resolvedItem].amount : 1;
    },
    treasureModuleReady() {
      if (!this.prize.data) {
        return true;
      }

      const { effectToFeature, effect: effectObj } = this.$store.state.treasure;
      if (!effectToFeature || !effectObj) {
        return false;
      }
      if (Object.keys(effectToFeature).length === 0 || Object.keys(effectObj).length === 0) {
        return false;
      }
      return this.prize.data.effect.every(effectName => {
        const featureName = effectToFeature[effectName];
        return featureName && effectObj[featureName] && effectObj[featureName][effectName];
      });
    }
  }
}
</script>
