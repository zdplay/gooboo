<style scoped>
.offering-locked {
  position: absolute;
  top: 8px;
  left: 8px;
  opacity: 0.5;
}
</style>

<template>
  <v-card class="pa-1">
    <currency always-show class="my-1 mx-auto" :name="`village_${name}`"></currency>
    <gb-tooltip v-if="!isUnlocked" :min-width="0">
      <template v-slot:activator="{ on, attrs }">
        <v-icon size="32" class="offering-locked" v-bind="attrs" v-on="on">mdi-cancel</v-icon>
      </template>
      <div class="mt-0">{{ $vuetify.lang.t('$vuetify.village.offering.notUnlocked') }}</div>
    </gb-tooltip>
    <div class="d-flex align-center">
      <v-chip class="ma-1" style="height: 28px;">
        <v-icon class="mr-1">mdi-fire</v-icon>
        {{ offering.offeringBought }}
      </v-chip>
      <v-spacer></v-spacer>
      <price-tag class="ma-1" :currency="`village_${name}`" :amount="sacrificeCost"></price-tag>
      <gb-tooltip>
        <template v-slot:activator="{ on, attrs }">
          <div v-bind="attrs" v-on="on">
            <v-btn class="ma-1" color="primary" :disabled="!canAffordSacrifice || !isUnlocked || disabled" @click="buySacrifice">{{ $vuetify.lang.t('$vuetify.village.offering.sacrifice') }}</v-btn>
          </div>
        </template>
        <div class="mt-0">
          <span>{{ $vuetify.lang.t('$vuetify.village.offering.description.0') }}</span>
          <span>{{ $formatNum(sacrificeCost) }}&nbsp;</span>
          <currency-icon :name="'village_' + name"></currency-icon>
          <span>{{ $vuetify.lang.t('$vuetify.village.offering.description.1') }}</span>
          <span>{{ $formatNum(offering.amount * (offering.offeringBought + 1)) }}&nbsp;</span>
          <currency-icon name="village_offering"></currency-icon>
          <span>{{ $vuetify.lang.t('$vuetify.village.offering.description.2') }}</span>
          <span>{{ $formatNum(offering.amount * offeringPassiveGain, true) }}</span>
          <span>{{ $vuetify.lang.t('$vuetify.village.offering.description.3') }}</span>
        </div>
      </gb-tooltip>
    </div>
    <div class="d-flex align-center">
      <v-chip class="ma-1" style="height: 28px;">
        <v-icon class="mr-1">mdi-chevron-double-up</v-icon>
        {{ offering.upgradeBought }}
      </v-chip>
      <v-spacer></v-spacer>
      <price-tag class="ma-1" currency="village_offering" :amount="upgradeCost"></price-tag>
      <v-btn small class="ma-1" color="primary" :disabled="!canAffordUpgrade || disabled" @click="openUpgradeDialog">指定</v-btn>
      <gb-tooltip>
        <template v-slot:activator="{ on, attrs }">
          <div v-bind="attrs" v-on="on">
            <v-btn class="ma-1" color="primary" :disabled="!canAffordUpgrade || disabled" @click="buyUpgrade(false)">{{ $vuetify.lang.t('$vuetify.gooboo.buy') }}</v-btn>
          </div>
        </template>
        <display-row class="mt-0" :name="capName" type="base" :before="valueBefore" :after="valueAfter"></display-row>
        <alert-text v-if="!isUnlocked" type="warning">{{ $vuetify.lang.t('$vuetify.village.offering.notUnlockedHint') }}</alert-text>
      </gb-tooltip>
    </div>
    <v-dialog v-model="showUpgradeDialog" max-width="400px" persistent scrollable>
      <v-card class="default-card">
        <v-card-title>
          指定【{{ $vuetify.lang.t(`$vuetify.currency.village_${name}.name`) }}】升级数量
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model.number="upgradeAmount"
            label="数量"
            type="number"
            :max="maxUpgradeAmount"
            :min="0"
            :rules="[v => v <= maxUpgradeAmount || '超过最大可购买量']"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="ma-1" color="error" @click="handleCancelUpgrade">
            {{ $vuetify.lang.t('$vuetify.gooboo.cancel') }}
          </v-btn>
          <v-btn class="ma-1" color="success" :disabled="!canAffordUpgrade || upgradeAmount <= 0 || upgradeAmount > maxUpgradeAmount" @click="buyUpgradeAmount(upgradeAmount)">
            {{ $vuetify.lang.t('$vuetify.gooboo.convert') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import { mapState } from 'vuex';
import { VILLAGE_OFFERING_PASSIVE_GAIN } from '../../../js/constants';
import { capitalize } from '../../../js/utils/format';
import Currency from '../../render/Currency.vue';
import CurrencyIcon from '../../render/CurrencyIcon.vue';
import PriceTag from '../../render/PriceTag.vue';
import AlertText from '../render/AlertText.vue';
import DisplayRow from '../upgrade/DisplayRow.vue';

export default {
  components: { Currency, PriceTag, DisplayRow, CurrencyIcon, AlertText },
  props: {
    name: {
      type: String,
      required: true
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      showUpgradeDialog: false,
      upgradeAmount: 0,
    };
  },
  computed: {
    ...mapState({
      currency: state => state.currency
    }),
    offering() {
      return this.$store.state.village.offering[this.name];
    },
    sacrificeCost() {
      return this.offering.cost(this.offering.offeringBought);
    },
    upgradeCost() {
      return this.offering.amount + this.offering.increment * this.offering.upgradeBought;
    },
    canAffordSacrifice() {
      return this.$store.getters['currency/value']('village_' + this.name) >= this.sacrificeCost;
    },
    canAffordUpgrade() {
      return this.$store.getters['currency/value']('village_offering') >= this.upgradeCost;
    },
    capName() {
      return 'currencyVillage' + capitalize(this.name) + 'Cap';
    },
    valuePerOffering() {
      return this.$store.getters['mult/get']('villageOfferingPower', this.offering.effect);
    },
    valueBefore() {
      return this.offering.upgradeBought * this.valuePerOffering;
    },
    valueAfter() {
      return (this.offering.upgradeBought + 1) * this.valuePerOffering;
    },
    isUnlocked() {
      return this.offering.unlock === null || this.$store.state.unlock[this.offering.unlock].use;
    },
    offeringPassiveGain() {
      return VILLAGE_OFFERING_PASSIVE_GAIN;
    },
    maxUpgradeAmount() {
      const offering = this.offering;
      const offeringOwned = this.$store.getters['currency/value']('village_offering');
      const baseCost = offering.amount + offering.increment * offering.upgradeBought;
      if (offeringOwned < baseCost) {
        return 0;
      }
      if (offering.increment <= 0) {
        return Math.floor(offeringOwned / baseCost);
      }
      let step = 1;
      while (this.deltaLinear(offering.amount, offering.increment, step, offering.upgradeBought) <= offeringOwned) {
        step *= 2;
      }
      let amount = step / 2;
      while (step > 1) {
        step /= 2;
        if (this.deltaLinear(offering.amount, offering.increment, amount + step, offering.upgradeBought) <= offeringOwned) {
          amount += step;
        }
      }
      return amount;
    },
  },
  watch: {
    showUpgradeDialog(newVal) {
      if (newVal) {
        this.upgradeAmount = this.maxUpgradeAmount;
      }
    }
  },
  methods: {
    buySacrifice() {
      this.$store.dispatch('village/buyOffering', this.name);
    },
    buyUpgrade(max) {
      this.$store.dispatch('village/upgradeOffering', {name: this.name, buyMax: max});
    },
    buyUpgradeAmount(count) {
      this.$store.dispatch('village/upgradeOffering', {name: this.name, maxSteps: count});
      this.showUpgradeDialog = false;
    },
    openUpgradeDialog() {
      this.showUpgradeDialog = true;
    },
    handleCancelUpgrade() {
      this.showUpgradeDialog = false;
    },
    deltaLinear(base, increment, amount, current) {
    return amount * base + increment * amount * (2 * current + amount - 1) / 2;
    },
  }
}
</script>
