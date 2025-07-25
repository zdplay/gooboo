<style scoped>
.price-tag-highlight {
  box-shadow: 0 1px 8px var(--v-amber-base);
}
.price-tag-over-abundant {
  opacity: 0.5;
}
</style>

<template>
  <gb-tooltip v-if="add || curr.alwaysVisible || stat.total > 0 || previewUnlocked" :title-text="$vuetify.lang.t(`$vuetify.currency.${ currency }.name`)">
    <template v-slot:activator="{ on, attrs }">
      <v-badge dot overlap bordered :color="curr.color" :value="multWarning">
        <div class="v-chip v-chip--label v-size--small px-2 balloon-text-dynamic" :class="[{'price-tag-highlight': highlight, 'price-tag-over-abundant': isOverAbundant}, $vuetify.theme.dark ? 'theme--dark darken-3' : 'theme--light lighten-3', curr.color, $vnode.data.staticClass]" v-bind="attrs" v-on="on" @click="handleClick">
          <v-icon size="16" class="mr-2" :aria-label="$vuetify.lang.t(`$vuetify.currency.${ currency }.name`)">{{ curr.icon }}</v-icon>
          <span :class="costClass">{{ (add && amount >= 0) ? '+' : '' }}{{ $formatNum(amount) }}<slot name="suffix"></slot></span>
        </div>
      </v-badge>
    </template>
    <currency-tooltip :name="currency" :needed="add ? null : amount" hide-details :show-mult-warning="multWarning"></currency-tooltip>
    <slot></slot>
  </gb-tooltip>
  <v-chip v-else-if="!previewUnlocked" small label>
    <v-icon>mdi-help</v-icon>
  </v-chip>
</template>

<script>
import CurrencyTooltip from '../partial/render/CurrencyTooltip.vue';

export default {
  components: { CurrencyTooltip },
  inheritAttrs: false,
  props: {
    currency: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    add: {
      type: Boolean,
      required: false,
      default: false
    },
    highlight: {
      type: Boolean,
      required: false,
      default: false
    },
    previewUnlocked: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  computed: {
    curr() {
      return this.$store.state.currency[this.currency];
    },
    stat() {
      return this.$store.state.stat[this.currency];
    },
    costClass() {
      if (this.add) {
        return null;
      } else if (this.curr.cap !== null && this.amount > this.curr.cap) {
        return 'orange--text ' + (this.$vuetify.theme.dark ? 'text--lighten-2' : 'text--darken-4');
      } else if (this.amount > this.curr.value) {
        return 'red--text ' + (this.$vuetify.theme.dark ? 'text--lighten-2' : 'text--darken-4');
      }
      return null;
    },
    multWarning() {
      if (this.add || this.curr.currencyMult === null) {
        return false;
      } else if (this.curr.cap === null || (this.curr.value - this.amount) < this.curr.cap) {
        return true;
      }
      return false;
    },
    isOverAbundant() {
      if (this.add || this.amount <= 0 || !this.$store.state.system.settings.experiment.items.lowCostMaterialFade.value) {
        return false;
      }
      const neededPercent = 100 * this.curr.value / this.amount;
      return neededPercent > 1000;
    }
  },
  methods: {
    handleClick() {
      this.$emit('click');
    }
  }
}
</script>
