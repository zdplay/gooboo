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
  <item-slot v-else-if="prize.type === 'treasure'" :item-obj="prize.data"></item-slot>
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
      return this.prize.amount * this.prize.amountMult();
    },
    cardPackAmount() {
      return this.prize.type === 'cardPack' ? this.$store.state.card.pack[this.resolvedItem].amount : 1;
    }
  }
}
</script>
