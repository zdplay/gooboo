<template>
  <v-card color="transparent" flat>
    <v-card-title class="pa-0 justify-center align-center">
      <v-icon>mdi-star</v-icon>
      <div>{{ $vuetify.lang.t(`$vuetify.message.achievement.relicGained`) }}</div>
    </v-card-title>
    <v-card-text class="pa-0 text-center">
      <div>
        <span class="balloon-text-inverted" :class="`${relic.color}--text`">{{ $vuetify.lang.t(`$vuetify.relic.${ message.name }`) }}</span>
        <v-icon class="balloon-text-inverted ml-1" :color="relic.color">{{ relic.icon }}</v-icon>
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
  computed: {
    relic() {
      return this.$store.state.relic.item[this.message.name];
    }
  }
}
</script>
