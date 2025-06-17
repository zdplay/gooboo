<template>
  <div class="bg-tile-default rounded elevation-2 ma-2">
    <div class="d-flex align-center flex-wrap pa-1">
      <gb-tooltip :title-text="$vuetify.lang.t('$vuetify.mult.miningSmelteryTemperature')">
        <template v-slot:activator="{ on, attrs }">
          <div class="d-flex align-center ma-1 mr-5" v-bind="attrs" v-on="on">
            <v-icon>mdi-thermometer</v-icon>
            <div>{{ $formatNum(smeltery.minTemperature, true) }}°C</div>
          </div>
        </template>
        <div>{{ $vuetify.lang.t('$vuetify.mining.smelteryTemperatureDescription2', $formatNum(temperatureSpeed * 100, true)) }}</div>
      </gb-tooltip>
      <gb-tooltip :title-text="$vuetify.lang.t('$vuetify.mult.miningSmelterySpeed')">
        <template v-slot:activator="{ on, attrs }">
          <div class="d-flex align-center ma-1" v-bind="attrs" v-on="on">
            <v-icon class="mr-1">mdi-timer</v-icon>
            <div v-if="timeNeeded >= 1">{{ $formatTime(Math.round(timeNeeded)) }}</div>
            <div v-else>{{ $formatNum(1 / timeNeeded, true) }}/s</div>
          </div>
        </template>
        <div>{{ $vuetify.lang.t('$vuetify.mining.smelterySpeedDescription', $formatTime(smeltery.timeNeeded)) }}</div>
        <stat-breakdown name="miningSmelterySpeed" :multArray="temperatureSpeedMult"></stat-breakdown>
      </gb-tooltip>
      <v-spacer></v-spacer>
      <price-tag v-for="(amount, currency) in price" :key="`price-${ currency }`" class="ma-1" :currency="currency" :amount="amount"></price-tag>
      <v-icon class="ma-1">mdi-transfer-right</v-icon>
      <price-tag class="ma-1" :currency="smeltery.output" :amount="1" add></price-tag>
      <v-spacer></v-spacer>
      <v-badge v-if="smeltery.stored > 0" inline color="secondary" :content="$formatNum(smeltery.stored)"></v-badge>
      <v-badge v-if="hasQueue" inline color="primary" :content="queueInfo.remainingTasks"></v-badge>
      <v-btn class="ma-1" small :color="hasQueue ? 'orange' : 'blue-grey'" :disabled="isFrozen" @click="hasQueue ? cancelQueue() : openQueueDialog()">
        {{ hasQueue ? '任务中' : '队列' }}
      </v-btn>
      <v-btn class="ma-1" small color="primary" :disabled="isFrozen || !canAfford" @click="openSmeltDialog">指定</v-btn>
      <v-btn class="ma-1" color="primary" :disabled="isFrozen || !canAfford" @click="buy">{{ $vuetify.lang.t('$vuetify.mining.smelt') }}</v-btn>
    </div>
    <v-progress-linear class="rounded-b" height="4" :indeterminate="isHighspeed" :value="isHighspeed ? undefined : (smeltery.progress * 100)"></v-progress-linear>
    <v-dialog v-model="showSmeltDialog" max-width="500px" persistent scrollable>
      <v-card class="default-card">
      <v-card-title>
        {{ isQueueMode ? '队列' : '指定' }}【{{ $vuetify.lang.t(`$vuetify.currency.mining_bar${formattedName}.name`) }}】冶炼数量
      </v-card-title>
      <v-card-text>
        <v-text-field
          v-model.number="smeltAmount"
          label="数量"
          type="number"
          :min="0"
          :max="isQueueMode ? undefined : maxAmount"
          :hint="isQueueMode ? '队列模式：可输入任意数量，材料不足时会等待，每次冶炼消耗单份材料' : '指定模式：最多可输入 ' + maxAmount + ' 个，一次性消耗指定数量的材料'"
          persistent-hint
        ></v-text-field>



        <!-- 预计完成时间 -->
        <div v-if="smeltAmount > 0 && estimatedCompletionText" class="completion-time mt-4">
          <div class="text-subtitle-2 mb-2">预计完成时间：</div>
          <div class="text-body-2 primary--text">{{ estimatedCompletionText }}</div>
        </div>

        <!-- 材料预览区域 -->
        <div v-if="smeltAmount > 0" class="material-preview mt-4">
          <div class="text-subtitle-2 mb-2">所需材料：</div>
          <div class="d-flex flex-wrap mx-n1">
            <price-tag
              v-for="material in materialRequirements"
              :key="material.currency"
              :currency="material.currency"
              :amount="material.needed"
              class="ma-1"
            ></price-tag>
          </div>
        </div>
      </v-card-text>
      <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn class="ma-1" color="error" @click="handleCancelSmelt">
        {{ $vuetify.lang.t('$vuetify.gooboo.cancel') }}
      </v-btn>
      <v-btn class="ma-1" color="success" :disabled="isFrozen || smeltAmount <= 0" @click="buyAmount(smeltAmount)">
        {{ $vuetify.lang.t('$vuetify.gooboo.convert') }}
      </v-btn>
    </v-card-actions>
    </v-card>
  </v-dialog>
</div>
</template>

<script>
import { mapState } from 'vuex';
import { MINING_SMELTERY_TEMPERATURE_SPEED } from '../../../js/constants';
import PriceTag from '../../render/PriceTag.vue';
import StatBreakdown from '../../render/StatBreakdown.vue';

export default {
  components: { PriceTag, StatBreakdown },
  props: {
    name: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      showSmeltDialog: false,
      smeltAmount: 0,
      isQueueMode: false,
    };
  },
  computed: {
    ...mapState({
      isFrozen: state => state.cryolab.mining.active,
    }),
    smeltery() {
      return this.$store.state.mining.smeltery[this.name];
    },
    price() {
      return this.$store.getters['mining/smelteryPrice'](this.name);
    },
    canAfford() {
      return this.$store.getters['currency/canAfford'](this.price, this.price);
    },
    timeNeeded() {
      return this.$store.getters['mining/smelteryTimeNeeded'](this.name);
    },
    temperatureSpeed() {
      return MINING_SMELTERY_TEMPERATURE_SPEED * (this.$store.getters['mult/get']('miningSmelteryTemperature') - this.smeltery.minTemperature);
    },
    temperatureSpeedMult() {
      return this.temperatureSpeed > 0 ? [{name: 'miningTemperature', value: this.temperatureSpeed + 1}] : [];
    },
    isHighspeed() {
      return this.timeNeeded < 1 && this.smeltery.stored > 0;
    },
    maxAmount() {
      let amount = 0;
      if (this.$store.getters['mining/smelteryCanAfford'](this.name)) {
        amount = 1;
        let step = 1;
        while (this.$store.getters['mining/smelteryCanAfford'](this.name, step)) {
          step *= 2;
        }
        amount = step / 2;
        while (step > 1) {
          step /= 2;
          if (this.$store.getters['mining/smelteryCanAfford'](this.name, amount + step)) {
            amount += step;
          }
        }
      }
      return amount;
    },
    formattedName() {
      return this.name.charAt(0).toUpperCase() + this.name.slice(1);
    },
    materialRequirements() {
      const amount = this.smeltAmount || 0;
      if (amount <= 0) return [];

      const price = this.$store.getters['mining/smelteryPrice'](this.name, amount);
      return Object.entries(price).map(([currency, needed]) => ({
        currency,
        needed
      }));
    },
    hasQueue() {
      return this.$store.getters['mining/hasSmelteryQueue'](this.name);
    },
    queueInfo() {
      return this.$store.getters['mining/smelteryQueueInfo'](this.name);
    },
    estimatedCompletionTime() {
      const amount = this.smeltAmount || 0;
      if (amount <= 0) return null;

      const smeltTime = this.$store.getters['mining/smelteryTimeNeeded'](this.name);
      const totalTime = amount * smeltTime;

      return totalTime;
    },
    estimatedCompletionText() {
      const time = this.estimatedCompletionTime;
      if (!time) return '';

      if (time < 60) {
        return `${Math.ceil(time)}秒`;
      } else if (time < 3600) {
        const minutes = Math.floor(time / 60);
        const seconds = Math.ceil(time % 60);
        return seconds > 0 ? `${minutes}分${seconds}秒` : `${minutes}分钟`;
      } else {
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time % 3600) / 60);
        return minutes > 0 ? `${hours}小时${minutes}分钟` : `${hours}小时`;
      }
    }
  },
  watch: {
    showSmeltDialog(newVal) {
      if (newVal) {
        if (this.isQueueMode) {
          this.smeltAmount = this.maxAmount;
        } else {
          this.smeltAmount = this.maxAmount;
        }
      }
    }
  },
  methods: {
    buy() {
      this.$store.dispatch('mining/addToSmelteryCustom', {name: this.name, amount: 1});
    },
    buyAmount(count) {
      if (this.isQueueMode) {
        this.$store.dispatch('mining/addToSmelteryQueue', {name: this.name, amount: count});
      } else {
        const finalAmount = Math.min(count, this.maxAmount);
        this.$store.dispatch('mining/addToSmelteryCustom', {name: this.name, amount: finalAmount});
      }
      this.showSmeltDialog = false;
    },
    openSmeltDialog() {
      this.isQueueMode = false;
      this.showSmeltDialog = true;
    },
    openQueueDialog() {
      this.isQueueMode = true;
      this.showSmeltDialog = true;
    },
    handleCancelSmelt() {
      this.showSmeltDialog = false;
    },
    cancelQueue() {
      this.$store.dispatch('mining/cancelSmelteryQueue', this.name);
    },
  }
}
</script>
