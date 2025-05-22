<template>
  <div>
    <div class="d-flex flex-wrap justify-center pa-1">
      <currency v-for="item in currencies" :key="`currency-${ item }`" class="ma-1" :name="`event_${ item }`"></currency>
    </div>
    
    <!-- 添加钓鱼记录组件 -->
    <weather-chaos-fishing-history />
  </div>
</template>

<script>
import Currency from '../../render/Currency.vue';
import WeatherChaosFishingHistory from './WeatherChaosFishingHistory.vue';

export default {
  components: { 
    Currency,
    WeatherChaosFishingHistory
  },
  data: () => ({
    currencies: ['cloud', 'weatherChaosToken', 'algae', 'driftwood', 'plastic', 'slime']
  }),
}
</script>
