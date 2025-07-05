<template>
  <div>
    <bingo v-if="type === 'bingo'"></bingo>
    <wheel-of-fortune v-else-if="type === 'wheelOfFortune'"></wheel-of-fortune>
    <casino-type-selection></casino-type-selection>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Bingo from './Bingo.vue';
import WheelOfFortune from './WheelOfFortune.vue';
import CasinoTypeSelection from './CasinoTypeSelection.vue';

export default {
  components: { Bingo, WheelOfFortune, CasinoTypeSelection },
  computed: {
    ...mapState({
      type: state => state.event.casino_type
    })
  }
}
</script>
