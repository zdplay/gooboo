<template>
  <v-card class="d-flex pa-2 pr-1 align-center">
    <gb-tooltip :min-width="350">
      <template v-slot:activator="{ on, attrs }">
        <v-icon large class="mr-1" v-bind="attrs" v-on="on">{{ typeObj.icon ? typeObj.icon : 'mdi-help' }}</v-icon>
      </template>
      <div class="mt-0 text-center">{{ $vuetify.lang.t(`$vuetify.treasure.buyTreasure`) }}</div>
      <div v-if="previewItems.length > 0 && showPreview" class="mt-2">
        <div class="text-center font-weight-bold">未来宝藏预览</div>
        <div v-for="(item, index) in previewItems" :key="`preview-${index}-${item.effect.join('-')}`" class="mt-2 pa-2 rounded text-center" :style="{backgroundColor: $vuetify.theme.dark ? '#424242' : '#f5f5f5'}">
          <div v-for="(effect, effectIndex) in item.effect" :key="`effect-${effectIndex}-${effect}`" class="d-flex align-center justify-center mt-0">
            <v-icon :color="$store.state.treasure.tierColor[item.tier]" class="mr-1">
              {{ getEffectIcon(effect) }}
            </v-icon>
            <display-row class="body-2" :name="effect" type="mult" :before="item.valueCache[effectIndex] + 1"></display-row>
          </div>
        </div>
      </div>
    </gb-tooltip>
    <price-tag class="mx-1" currency="gem_emerald" :amount="price"></price-tag>
    <v-btn :data-cy="`treasure-buy-${ name }`" class="mx-1" color="primary" :disabled="!canAfford || newItem !== null" @click="buyItem">{{ $vuetify.lang.t(`$vuetify.gooboo.buy`) }}</v-btn>
  </v-card>
</template>

<script>
import { mapState } from 'vuex';
import PriceTag from '../../render/PriceTag.vue';
import DisplayRow from '../upgrade/DisplayRow.vue';

export default {
  components: { 
    PriceTag,
    DisplayRow
  },
  props: {
    name: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      previewCounter: 0
    };
  },
  computed: {
    ...mapState({
      newItem: state => state.treasure.newItem
    }),
    typeObj() {
      return this.$store.state.treasure.type[this.name];
    },
    canAfford() {
      return this.$store.getters['currency/value']('gem_emerald') >= this.price;
    },
    price() {
      return this.typeObj.buyPrice;
    },

    showPreview() {
      return this.$store.state.system.settings.experiment.items.treasurePreview.value;
    },
    previewItems() {
      this.previewCounter;
      const items = [];
      for (let i = 0; i < 10; i++) {
        const preview = this.$store.getters['treasure/previewNextTreasure'](this.name, i);
        if (preview) {
          items.push(preview);
        }
      }
      return items;
    }
  },
  methods: {
    buyItem() {
      if (this.$store.state.system.settings.confirm.items.gem.value) {
        this.$store.commit('system/updateKey', {key: 'confirm', value: {
          type: 'treasure',
          treasureType: this.name,
          price: {gem_emerald: this.price},
        }});
      } else {
        this.$store.dispatch('treasure/buy', this.name);
        this.previewCounter++;
      }
    },
    getEffectIcon(effect) {
      try {
        const feature = this.$store.state.treasure.effectToFeature[effect];
        if (!feature || !this.$store.state.treasure.effect[feature] || !this.$store.state.treasure.effect[feature][effect]) {
          return 'mdi-help-circle';
        }
        const effectObj = this.$store.state.treasure.effect[feature][effect];
        return effectObj.icon || 'mdi-help-circle';
      } catch (e) {
        return 'mdi-help-circle';
      }
    },
    getFeatureColor(effect) {
      try {
        const feature = this.$store.state.treasure.effectToFeature[effect];
        if (!feature || !this.$store.state.feature[feature]) {
          return 'grey';
        }
        return this.$store.state.feature[feature].color || 'grey';
      } catch (e) {
        return 'grey';
      }
    }
  },
  watch: {
    'newItem': function(newVal, oldVal) {
      if (oldVal !== null && newVal === null) {
        this.previewCounter++;
      }
    }
  }
}
</script>
