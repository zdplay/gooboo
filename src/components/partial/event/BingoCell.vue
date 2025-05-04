<style scoped>
.bingo-card-cell {
  width: 72px;
  height: 72px;
  font-size: 24px;
  transition: all 0.3s ease;
}
.bingo-cell-mobile {
  width: 52px;
  height: 52px;
  font-size: 20px;
}
.predicted {
  box-shadow: 0 0 10px #ff0000, 0 0 20px #ff0000;
  animation: glow 1.5s ease-in-out infinite alternate;
}
.prediction-probability {
  font-size: 12px;
  color: #ff0000;
}
@keyframes glow {
  from {
    box-shadow: 0 0 10px #ff0000, 0 0 20px #ff0000;
  }
  to {
    box-shadow: 0 0 15px #ff0000, 0 0 25px #ff0000;
  }
}
</style>

<template>
  <gb-tooltip :disabled="cell.prize === null" :title-text="$vuetify.lang.t(`$vuetify.event.casino.prize`)">
    <template v-slot:activator="{ on, attrs }">
      <div class="bg-tile-default rounded d-flex justify-center align-center bingo-card-cell mx-1 my-2" :class="{'success': drawn, 'bingo-cell-mobile': $vuetify.breakpoint.xsOnly, 'predicted': isPredicted}" v-bind="attrs" v-on="{...$listeners, ...on}">
        <v-badge :value="!drawn && cell.prize !== null" :color="cell.prize !== null && cell.isRare ? 'green' : 'grey'">
          <v-badge bottom :value="!drawn && cell.multiplier !== null" :content="`x${cell.multiplier}`">
            <div>
              <div>{{ cell.value }}</div>
              <div v-if="prediction" class="prediction-probability">{{ prediction.probability }}</div>
            </div>
          </v-badge>
        </v-badge>
      </div>
    </template>
    <prize v-if="cell.prize !== null" :pool="cell.isRare ? 'bingo1' : 'bingo0'" :prizeBase="cell.prize"></prize>
  </gb-tooltip>
</template>

<script>
import Prize from './Prize.vue';

export default {
  components: { Prize },
  props: {
    cell: {
      type: Object,
      required: true
    },
    drawn: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    isPredicted() {
      const predictions = this.$store.state.event.casino_bingo_next_draw;
      return predictions ? predictions.includes(this.cell.value) : false;
    },
    prediction() {
      const predictions = this.$store.state.event.casino_bingo_next_draw;
      if (!predictions) return null;
      return predictions.find(p => p.number === this.cell.value);
    }
  }
}
</script>
