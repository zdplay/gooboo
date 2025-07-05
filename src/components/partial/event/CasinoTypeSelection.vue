<template>
  <v-dialog v-model="showDialog" persistent max-width="400">
    <v-card>
      <v-card-title class="text-h5">
        {{ $vuetify.lang.t('$vuetify.event.casinoTypeSelection.title') }}
      </v-card-title>
      <v-card-text>
        <div class="text-body-1 mb-4">
          {{ $vuetify.lang.t('$vuetify.event.casinoTypeSelection.description') }}
        </div>
        <v-row>
          <v-col cols="6">
            <v-btn
              block
              large
              color="primary"
              @click="selectType('bingo')"
              class="text-h6"
            >
              <v-icon left>mdi-grid</v-icon>
              {{ $vuetify.lang.t('$vuetify.event.casinoTypeSelection.bingo') }}
            </v-btn>
          </v-col>
          <v-col cols="6">
            <v-btn
              block
              large
              color="primary"
              @click="selectType('wheelOfFortune')"
              class="text-h6"
            >
              <v-icon left>mdi-ferris-wheel</v-icon>
              {{ $vuetify.lang.t('$vuetify.event.casinoTypeSelection.wheel') }}
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState({
      showDialog: state => state.event.casino_type_selection_dialog
    })
  },
  methods: {
    selectType(type) {
      this.$store.dispatch('event/startCasinoWithSelectedType', type);
    }
  }
}
</script>
