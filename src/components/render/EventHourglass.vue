<template>
  <v-card class="default-card pa-2">
    <v-card-title class="pa-2 justify-center">{{ $vuetify.lang.t('$vuetify.eventHourglass.title') }}</v-card-title>
    <v-card-subtitle class="pa-1 text-center">{{ $vuetify.lang.t('$vuetify.eventHourglass.subtitle') }}</v-card-subtitle>
    <v-card-text class="px-0">
      <div class="d-flex justify-center ma-1">
        <currency class="ma-1" name="gem_amethyst"></currency>
      </div>
      <v-text-field class="ma-2" type="number" step="1" min="0" :label="$vuetify.lang.t('$vuetify.eventHourglass.timeInMinutes')" outlined hide-details v-model="minutes"></v-text-field>
      <div class="d-flex flex-wrap justify-center align-center ma-1">
        <div class="d-flex flex-wrap justify-center">
          <v-btn small dense class="ma-1" color="info" @click="setMinutes(3)">3分</v-btn>
          <v-btn small dense class="ma-1" color="info" @click="setMinutes(6)">6分</v-btn>
          <v-btn small dense class="ma-1" color="info" @click="setMinutes(9)">9分</v-btn>
          <v-btn small dense class="ma-1" color="info" @click="setMinutes(15)">15分</v-btn>
          <v-btn small dense class="ma-1" color="info" @click="setMinutes(30)">30分</v-btn>
        </div>
        <div class="d-flex justify-end align-center flex-grow-1">
          <v-btn class="ma-1" color="primary" @click="setToMax">{{ $vuetify.lang.t('$vuetify.gooboo.max') }}</v-btn>
          <v-chip class="justify-center ma-1" style="min-width: 100px;">
            <v-icon class="mr-1">mdi-timer</v-icon>
            {{ formattedTime }}
          </v-chip>
        </div>
      </div>
    </v-card-text>
    <v-card-actions class="flex-wrap ma-n1">
      <v-btn class="ma-1" color="success" :disabled="!canAfford" @click="performTimeSkip">{{ $vuetify.lang.t('$vuetify.gooboo.skip') }}</v-btn>
      <price-tag v-if="amethystCost !== null" class="ma-1" currency="gem_amethyst" :amount="amethystCost"></price-tag>
      <v-spacer></v-spacer>
      <v-btn class="ma-1" color="error" @click="emitCancel">{{ $vuetify.lang.t('$vuetify.gooboo.cancel') }}</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import event from '../../js/modules/event';
import Currency from './Currency.vue';
import PriceTag from './PriceTag.vue';

export default {
  components: { Currency, PriceTag },
  data: () => ({
    minutes: ''
  }),
  computed: {
    isValidTime() {
      return !isNaN(this.minutes) && this.minutes > 0;
    },
    formattedTime() {
      return this.isValidTime ? this.$formatTime(this.minutes * 60, 'm') : '-';
    },
    amethystCost() {
      // 1:1.5 ratio - 1 amethyst = 1.5 minutes of acceleration
      return this.isValidTime ? Math.ceil(this.minutes / 1.5) : null;
    },
    canAfford() {
      return this.isValidTime && this.$store.getters['currency/value']('gem_amethyst') >= this.amethystCost;
    }
  },
  methods: {
    performTimeSkip() {
      if (this.canAfford) {
        const currentEvent = this.$store.getters['event/currentEvent'];
        if (currentEvent && this.$store.getters['event/eventIsBig'](currentEvent)) {
          const currentTime = this.$store.state.system.time || Math.floor(Date.now() / 1000);
          const skipTime = Math.round(this.minutes * 60);
          event.tick(skipTime, currentTime, currentTime + skipTime);
          this.$store.dispatch('currency/spend', {feature: 'gem', name: 'amethyst', amount: this.amethystCost});
        }
      }
    },
    emitCancel() {
      this.$emit('cancel');
    },
    setToMax() {
      const amethystAmount = Math.floor(this.$store.getters['currency/value']('gem_amethyst'));
      this.minutes = amethystAmount * 1.5;
    },
    setMinutes(value) {
      this.minutes = value;
    }
  }
}
</script> 