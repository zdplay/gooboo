<template>
  <v-card color="transparent" flat>
    <v-card-title class="pa-0 justify-center align-center">{{ $vuetify.lang.t('$vuetify.message.farm.plant') }}</v-card-title>
    <v-card-text class="pa-0">
      <div v-for="(amount, item) in message.items" :key="item" class="d-flex align-center">
        <v-icon small class="mr-1" :color="getItemColor(item)">{{ getItemIcon(item) }}</v-icon>
        <span>{{ $formatNum(amount) }}x {{ getItemName(item) }}</span>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    message: {
      type: Object,
      required: true
    }
  },
  methods: {
    getItemName(item) {
      if (item.startsWith('farm_')) {
        return this.$vuetify.lang.t(`$vuetify.currency.${item}.name`);
      } else {
        return this.$vuetify.lang.t(`$vuetify.consumable.${item}.name`);
      }
    },
    getItemColor(item) {
      if (item.startsWith('farm_')) {
        return this.$store.state.currency[item].color;
      } else {
        return this.$store.state.consumable[item].color;
      }
    },
    getItemIcon(item) {
      if (item.startsWith('farm_')) {
        return this.$store.state.currency[item].icon;
      } else {
        return this.$store.state.consumable[item].icon;
      }
    }
  }
}
</script> 