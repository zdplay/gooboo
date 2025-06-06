<template>
  <v-card class="default-card pa-2">
    <v-card-title class="pa-2 justify-center">{{ $vuetify.lang.t('$vuetify.hourglass.title') }}</v-card-title>
    <v-card-subtitle class="pa-1 text-center">{{ $vuetify.lang.t(`$vuetify.hourglass.${ isAtSchool ? 'subtitleSchool' : 'subtitle' }`) }}</v-card-subtitle>
    <v-card-text class="px-0">
      <div class="d-flex justify-center ma-1">
        <currency class="ma-1" name="school_goldenDust"></currency>
        <currency v-if="isAtSchool" class="ma-1" name="school_examPass"></currency>
      </div>
      <div v-if="isAtSchool" class="d-flex justify-center">
        <price-tag currency="school_examPass" :amount="1"></price-tag>
        <v-icon class="mx-2">mdi-transfer-right</v-icon>
        <price-tag currency="school_goldenDust" :amount="goldenDustMin" add></price-tag>
      </div>
      <template v-else>
        <v-text-field class="ma-2" type="number" step="1" min="0" :label="$vuetify.lang.t('$vuetify.hourglass.timeInMinutes')" outlined hide-details v-model="minutes"></v-text-field>
        <div class="d-flex flex-wrap justify-center align-center ma-1">
          <div class="d-flex flex-wrap justify-center">
            <v-btn small dense class="ma-1" color="info" @click="setMinutes(1)">1分</v-btn>
            <v-btn small dense class="ma-1" color="info" @click="setMinutes(2)">2分</v-btn>
            <v-btn small dense class="ma-1" color="info" @click="setMinutes(5)">5分</v-btn>
            <v-btn small dense class="ma-1" color="info" @click="setMinutes(10)">10分</v-btn>
            <v-btn small dense class="ma-1" color="info" @click="setMinutes(20)">20分</v-btn>
          </div>
          <div class="d-flex justify-end align-center flex-grow-1">
            <v-btn class="ma-1" color="primary" @click="setToMax">{{ $vuetify.lang.t('$vuetify.gooboo.max') }}</v-btn>
            <v-chip class="justify-center ma-1" style="min-width: 100px;">
              <v-icon class="mr-1">mdi-timer</v-icon>
              {{ formattedTime }}
            </v-chip>
          </div>
        </div>
        <div v-if="autoUseExamPass && requiredExamPasses > 0" class="d-flex justify-center ma-1">
          <price-tag currency="school_examPass" :amount="requiredExamPasses"></price-tag>
          <v-icon class="mx-2" v-if="hasEnoughExamPasses">mdi-arrow-right</v-icon>
          <price-tag v-if="hasEnoughExamPasses" currency="school_goldenDust" :amount="remainingDustAfterConversion" add></price-tag>
        </div>
      </template>
    </v-card-text>
    <v-card-actions class="flex-wrap ma-n1">
      <v-btn v-if="isAtSchool" class="ma-1" color="success" :disabled="!canConvertPass" @click="convertPass">{{ $vuetify.lang.t('$vuetify.gooboo.convert') }}</v-btn>
      <template v-else>
        <v-btn class="ma-1" color="success" :disabled="!canAffordWithExamPass || !isOnMainFeature" @click="performTimeSkip">{{ $vuetify.lang.t('$vuetify.gooboo.skip') }}</v-btn>
        <price-tag v-if="dustCost !== null" class="ma-1" currency="school_goldenDust" :amount="dustCost"></price-tag>
      </template>
      <v-spacer></v-spacer>
      <v-btn class="ma-1" color="error" @click="emitCancel">{{ $vuetify.lang.t('$vuetify.gooboo.cancel') }}</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex';
import mining from '../../js/modules/mining';
import village from '../../js/modules/village';
import horde from '../../js/modules/horde';
import farm from '../../js/modules/farm';
import gallery from '../../js/modules/gallery';
import Currency from './Currency.vue';
import PriceTag from './PriceTag.vue';
import { SCHOOL_EXAM_DUST_MIN } from '../../js/constants';

export default {
  components: { Currency, PriceTag },
  data: () => ({
    minutes: ''
  }),
  computed: {
    ...mapGetters({
      mainFeatures: 'system/mainFeatures',
      isOnMainFeature: 'system/isOnMainFeature'
    }),
    isValidTime() {
      return !isNaN(this.minutes) && this.minutes > 0;
    },
    formattedTime() {
      return this.isValidTime ? this.$formatTime(this.minutes * 60, 'm') : '-';
    },
    dustCost() {
      if (!this.isValidTime) return null;
      
      const totalMinutes = parseFloat(this.minutes);
      const MAX_SEGMENT_MINUTES = 166;
      
      if (totalMinutes <= MAX_SEGMENT_MINUTES) {
        return this.calculateDustCost(totalMinutes);
      }
      
      const fullSegments = Math.floor(totalMinutes / MAX_SEGMENT_MINUTES);
      const remainingMinutes = totalMinutes % MAX_SEGMENT_MINUTES;
      
      let totalCost = 0;
      for (let i = 0; i < fullSegments; i++) {
        totalCost += this.calculateDustCost(MAX_SEGMENT_MINUTES);
      }
      
      if (remainingMinutes > 0) {
        totalCost += this.calculateDustCost(remainingMinutes);
      }
      
      return totalCost;
    },
    canAfford() {
      return this.isValidTime && this.$store.getters['currency/value']('school_goldenDust') >= this.dustCost;
    },
    isAtSchool() {
      return this.$store.state.system.screen === 'school';
    },
    goldenDustMin() {
      return Math.round(SCHOOL_EXAM_DUST_MIN * this.$store.getters['school/dustMult']);
    },
    canConvertPass() {
      return this.$store.getters['currency/value']('school_examPass') >= 1 && this.$store.state.currency.school_goldenDust.value < this.$store.state.currency.school_goldenDust.cap;
    },
    autoUseExamPass() {
      return this.$store.state.system.settings.experiment.items.autoUseExamPass.value;
    },
    examRewardPerPass() {
      let highestGrade = 0;
      for (const [, subject] of Object.entries(this.$store.state.school)) {
        if (subject.unlock === null || this.$store.state.unlock[subject.unlock].see) {
          if (subject.currentGrade > highestGrade) {
            highestGrade = subject.currentGrade;
          }
        }
      }
      
      return this.$store.getters['school/examReward'](1, highestGrade);
    },
    requiredExamPasses() {
      if (!this.autoUseExamPass || this.canAfford || !this.isValidTime) return 0;
      
      const currentDust = this.$store.getters['currency/value']('school_goldenDust');
      const dustNeeded = this.dustCost - currentDust;
      
      return Math.ceil(dustNeeded / this.examRewardPerPass);
    },
    hasEnoughExamPasses() {
      return this.requiredExamPasses > 0 && 
             this.$store.getters['currency/value']('school_examPass') >= this.requiredExamPasses;
    },
    remainingDustAfterConversion() {
      if (!this.hasEnoughExamPasses) return this.$store.getters['currency/value']('school_goldenDust');
      
      const currentDust = this.$store.getters['currency/value']('school_goldenDust');
      const gainedDust = this.requiredExamPasses * this.examRewardPerPass;
      return currentDust + gainedDust - this.dustCost;
    },
    canAffordWithExamPass() {
      return this.canAfford || (this.autoUseExamPass && this.hasEnoughExamPasses);
    }
  },
  methods: {
    performTimeSkip() {
      const totalMinutes = parseFloat(this.minutes);
      
      if (!this.isValidTime || totalMinutes <= 0) {
        return;
      }
      
      const MAX_SEGMENT_MINUTES = 166;
      
      if (totalMinutes <= MAX_SEGMENT_MINUTES) {
        this.performSingleTimeSkip(totalMinutes);
        return;
      }
      
      const fullSegments = Math.floor(totalMinutes / MAX_SEGMENT_MINUTES);
      const remainingMinutes = totalMinutes % MAX_SEGMENT_MINUTES;
      
      for (let i = 0; i < fullSegments; i++) {
        if (!this.canAffordMinutes(MAX_SEGMENT_MINUTES) && 
            !(this.autoUseExamPass && this.hasEnoughExamPassesForMinutes(MAX_SEGMENT_MINUTES))) {
          this.$store.dispatch('system/showMessage', {
            type: 'error',
            text: `金尘不足，只能跳过 ${i * MAX_SEGMENT_MINUTES} 分钟`
          });
          return;
        }
        
        this.performSingleTimeSkip(MAX_SEGMENT_MINUTES);
      }
      
      if (remainingMinutes > 0) {
        if (this.canAffordMinutes(remainingMinutes) || 
            (this.autoUseExamPass && this.hasEnoughExamPassesForMinutes(remainingMinutes))) {
          this.performSingleTimeSkip(remainingMinutes);
        } else {
          this.$store.dispatch('system/showMessage', {
            type: 'error',
            text: `金尘不足，只能跳过 ${fullSegments * MAX_SEGMENT_MINUTES} 分钟`
          });
        }
      }
    },
    
    calculateDustCost(minutes) {
      return Math.round(Math.pow(minutes, 0.9) * 100);
    },
    
    canAffordMinutes(minutes) {
      const cost = this.calculateDustCost(minutes);
      return this.$store.getters['currency/value']('school_goldenDust') >= cost;
    },
    
    hasEnoughExamPassesForMinutes(minutes) {
      if (!this.autoUseExamPass) return false;
      
      const cost = this.calculateDustCost(minutes);
      const currentDust = this.$store.getters['currency/value']('school_goldenDust');
      const dustNeeded = Math.max(0, cost - currentDust);
      
      const requiredPasses = Math.ceil(dustNeeded / this.examRewardPerPass);
      return this.$store.getters['currency/value']('school_examPass') >= requiredPasses;
    },
    
    performSingleTimeSkip(minutes) {
      const originalMinutes = this.minutes;
      this.minutes = minutes;
      
      const currentDustCost = this.calculateDustCost(minutes);
      
      if (this.canAfford) {
        const module = {mining, village, horde, farm, gallery}[this.$store.state.system.screen];
        module.tick(Math.round(minutes * 60 / module.tickspeed));
        this.$store.dispatch('currency/spend', {feature: 'school', name: 'goldenDust', amount: currentDustCost});
      } else if (this.autoUseExamPass && this.hasEnoughExamPasses) {
        const finalDust = this.remainingDustAfterConversion;
        
        for (let i = 0; i < this.requiredExamPasses; i++) {
          this.$store.dispatch('currency/spend', {feature: 'school', name: 'examPass', amount: 1});
          this.$store.dispatch('currency/gain', {feature: 'school', name: 'goldenDust', amount: this.examRewardPerPass});
        }
        
        const module = {mining, village, horde, farm, gallery}[this.$store.state.system.screen];
        module.tick(Math.round(minutes * 60 / module.tickspeed));
        
        this.$store.commit('currency/updateKey', {name: 'school_goldenDust', key: 'value', value: finalDust});
      }
      
      this.minutes = originalMinutes;
    },
    convertPass() {
      this.$store.dispatch('school/convertPass');
    },
    emitCancel() {
      this.$emit('cancel');
    },
    setToMax() {
      this.minutes = Math.floor(Math.pow(this.$store.getters['currency/value']('school_goldenDust') / 100, 1 / 0.9));
    },
    setMinutes(value) {
      this.minutes = value;
    }
  }
}
</script>
