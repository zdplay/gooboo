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
        // 首先检查是否存在于currency中
        if (this.$store.state.currency[item]) {
          return this.$vuetify.lang.t(`$vuetify.currency.${item}.name`);
        } 
        // 然后检查是否存在于consumable中
        else if (this.$store.state.consumable[item]) {
          return this.$vuetify.lang.t(`$vuetify.consumable.${item}.name`);
        }
        // 如果都不存在，返回原始ID
        else {
          return item;
        }
      } else {
        // 非farm_开头的物品，在consumable中查找
        if (this.$store.state.consumable[item]) {
          return this.$vuetify.lang.t(`$vuetify.consumable.${item}.name`);
        } else {
          return item;
        }
      }
    },
    getItemColor(item) {
      if (item.startsWith('farm_')) {
        const currency = this.$store.state.currency[item];
        if (currency && currency.color) {
          return currency.color;
        } else {
          // 尝试从消耗品中获取颜色
          const consumable = this.$store.state.consumable[item];
          return consumable && consumable.color ? consumable.color : 'grey';
        }
      } else {
        const consumable = this.$store.state.consumable[item];
        return consumable && consumable.color ? consumable.color : 'grey';
      }
    },
    getItemIcon(item) {
      if (item.startsWith('farm_')) {
        const currency = this.$store.state.currency[item];
        if (currency && currency.icon) {
          return currency.icon;
        } else {
          // 尝试从消耗品中获取图标
          const consumable = this.$store.state.consumable[item];
          return consumable && consumable.icon ? consumable.icon : 'mdi-help-circle';
        }
      } else {
        const consumable = this.$store.state.consumable[item];
        return consumable && consumable.icon ? consumable.icon : 'mdi-help-circle';
      }
    }
  }
}
</script> 