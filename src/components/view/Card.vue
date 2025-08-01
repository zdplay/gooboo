<style scoped>
.card-count-chip {
  min-width: 72px;
  cursor: pointer;
}
.card-panel-content >>> .v-expansion-panel-content__wrap {
  padding: 0 16px 16px;
}
.card-panel-no-padding >>> .v-expansion-panel-content__wrap {
  padding: 0 3px 3px;
}
.card-header-reduce-minheight {
  min-height: 32px !important;
}
</style>

<template>
  <div :class="$vuetify.breakpoint.mdAndUp ? 'scroll-container' : ''">
    <div class="d-flex align-center ma-1" :class="{'flex-wrap justify-end': $vuetify.breakpoint.xsOnly}">
      <v-select data-cy="card-pack-selector" class="ma-1" :class="{'w-100': $vuetify.breakpoint.xsOnly}" outlined hide-details :items="pack" item-value="name" v-model="selectedPack" :label="$vuetify.lang.t(`$vuetify.card.cardPack`)">
        <template v-slot:selection="{ item }"><card-pack :item="item"></card-pack></template>
        <template v-slot:item="{ item }"><card-pack :item="item"></card-pack></template>
      </v-select>
      <gb-tooltip>
        <template v-slot:activator="{ on, attrs }">
          <div v-bind="attrs" v-on="on">
            <v-btn small class="ma-1" color="primary" :disabled="!canBuyPack" @click="buyPack(true)">{{ $vuetify.lang.t('$vuetify.gooboo.max') }}</v-btn>
          </div>
        </template>
        <div v-if="showPreview" class="mt-0 text-center">{{ canBuyPack ? '最大购买预览' : '单次购买预览' }}</div>
        <div v-if="showPreview && maxPreviewCards.length > 0" class="mt-2">
          <div v-for="(item, key) in maxPreviewSummary" :key="key">
            <span>{{ item.amount }}x {{ key }}: {{ $vuetify.lang.t(`$vuetify.card.card.${key}`) }}</span>
            <span v-if="item.isNew">&nbsp;(新!)</span>
            <span v-if="item.shinyCount">&nbsp;({{ item.shinyCount }}x 闪亮)</span>
          </div>
        </div>
        <div v-if="!showPreview" class="mt-0 text-center">{{ $vuetify.lang.t('$vuetify.gooboo.max') }}</div>
      </gb-tooltip>
      <gb-tooltip>
        <template v-slot:activator="{ on, attrs }">
          <div v-bind="attrs" v-on="on">
            <v-btn class="ma-1" color="primary" :disabled="!canBuyPack" @click="buyPack(false)">{{ $vuetify.lang.t('$vuetify.gooboo.buy') }}</v-btn>
          </div>
        </template>
        <div v-if="showPreview" class="mt-0 text-center">{{ canBuyPack ? '单次购买预览' : '单次购买预览' }}</div>
        <div v-if="showPreview && singlePreviewCards.length > 0" class="mt-2">
          <div v-for="(item, key) in singlePreviewSummary" :key="key">
            <span>{{ item.amount }}x {{ key }}: {{ $vuetify.lang.t(`$vuetify.card.card.${key}`) }}</span>
            <span v-if="item.isNew">&nbsp;(新!)</span>
            <span v-if="item.shinyCount">&nbsp;({{ item.shinyCount }}x 闪亮)</span>
          </div>
        </div>
        <div v-if="!showPreview" class="mt-0 text-center">{{ $vuetify.lang.t('$vuetify.gooboo.buy') }}</div>
      </gb-tooltip>
    </div>
    <div class="d-flex flex-wrap align-center ma-1">
      <currency class="ma-1" name="card_shinyDust"></currency>
    </div>
    <div class="d-flex flex-wrap ma-1">
      <gb-tooltip v-for="(item, key) in unlockedFeature" :key="`feature-${ key }`" :title-text="$vuetify.lang.t(`$vuetify.feature.${ key }`) + $vuetify.lang.t(`$vuetify.card.cardsSuffix`)">
        <template v-slot:activator="{ on, attrs }">
          <v-chip class="ma-1" v-bind="attrs" v-on="on">
            <v-icon class="mr-2">{{ item.icon }}</v-icon>
            <span>{{ item.amount }}</span>
            <span v-if="item.shiny > 0"><v-icon>mdi-circle-small</v-icon><v-icon x-small>mdi-shimmer</v-icon>{{ item.shiny }}</span>
          </v-chip>
        </template>
        <display-row class="mt-0" v-for="subitem in item.reward" :key="`stat-${ key }-${ subitem.name }`" :name="subitem.name" :type="subitem.type" :after="subitem.value(item.amount)"></display-row>
        <template v-if="item.shiny > 0">
          <display-row
            class="mt-0 light-blue--text"
            :class="$vuetify.theme.dark ? 'text--lighten-3' : 'text--darken-2'"
            v-for="subitem in item.shinyReward"
            :key="`shiny-stat-${ key }-${ subitem.name }`"
            :name="subitem.name"
            :type="subitem.type"
            :after="subitem.value(item.shiny)"
          ></display-row>
        </template>
      </gb-tooltip>
    </div>
    <div v-if="canSeeTutorial" class="d-flex justify-center ma-2">
      <alert-text type="info" style="max-width: 600px;">
        <div>
          <div class="mb-2">{{ $vuetify.lang.t(`$vuetify.card.equipTutorial.description`) }}</div>
          <ol>
            <li v-for="i in 5" :key="`equip-tutorial-${ i }`">{{ $vuetify.lang.t(`$vuetify.card.equipTutorial.${ i }`) }}</li>
          </ol>
        </div>
      </alert-text>
    </div>
    <div class="ma-2">
      <v-expansion-panels accordion>
        <v-expansion-panel v-for="(coll, key) in collection" :key="'collection-' + key">
          <v-expansion-panel-header :class="{'pa-2 card-header-reduce-minheight': $vuetify.breakpoint.xsOnly}">
            <v-chip v-if="coll.cacheCards < coll.cards.length" class="card-count-chip justify-center flex-grow-0 mr-2 px-2" label small>{{ coll.cacheCards }} / {{ coll.cards.length }}</v-chip>
            <v-chip v-else-if="!unlock.cardShiny.see" class="card-count-chip justify-center flex-grow-0 mr-2 px-2" color="orange" label small><v-icon class="mr-2">mdi-crown</v-icon>{{ coll.cards.length }}</v-chip>
            <template v-if="unlock.cardShiny.see">
              <v-chip v-if="coll.cacheShinyCards < coll.cards.length" class="card-count-chip justify-center flex-grow-0 mr-2 px-2" color="dark-blue" label small><v-icon class="mr-2">mdi-shimmer</v-icon>{{ coll.cacheShinyCards }} / {{ coll.cards.length }}</v-chip>
              <v-chip v-else class="card-count-chip justify-center flex-grow-0 mr-2 px-2" color="pale-light-blue" label small><v-icon>mdi-shimmer</v-icon><v-icon class="mr-2">mdi-crown</v-icon>{{ coll.cards.length }}</v-chip>
            </template>
            <span class="mr-1">{{ $vuetify.lang.t(`$vuetify.card.collection.${key}`) }}</span>
            <template v-if="isCard1NewLabelEnabled">
              <template v-if="coll.cacheCards < coll.cards.length">
                <span class="ml-1 text--secondary caption font-weight-light">
                  (
                  <template v-if="getMissingCardSourcePacks(coll).length > 0">
                    <span v-for="(packName, index) in getMissingCardSourcePacks(coll)" :key="`${key}-pack-${packName}`">
                      {{ $vuetify.lang.t(`$vuetify.card.pack.${packName}`) }}<span v-if="index < getMissingCardSourcePacks(coll).length - 1">, </span>
                    </span>
                  </template>
                  <template v-else>
                    未解锁
                  </template>
                  )
                </span>
              </template>
            </template>
            <v-spacer></v-spacer>
          </v-expansion-panel-header>
          <v-expansion-panel-content class="card-panel-content" :class="{'card-panel-no-padding': $vuetify.breakpoint.xsOnly}">
            <div class="ml-1">{{ $vuetify.lang.t(`$vuetify.card.fullCollectionReward`) }}:</div>
            <div class="d-flex align-center ml-1" v-for="(reward, rkey) in coll.reward" :key="'reward-' + key + '-' + rkey">
              <v-icon>mdi-circle-small</v-icon>
              <mult-name :name="reward.name"></mult-name>:&nbsp;
              <mult-stat :mult="reward.name" :type="reward.type" :value="reward.value"></mult-stat>
            </div>
            <div class="d-flex mx-n1 mb-n1 mt-3 flex-wrap">
              <card-item v-for="item in coll.cards" :key="item" :id="item"></card-item>
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import CardItem from '../partial/card/CardItem.vue';
import CardPack from '../partial/card/CardPack.vue';
import AlertText from '../partial/render/AlertText.vue';
import MultStat from '../partial/render/MultStat.vue';
import DisplayRow from '../partial/upgrade/DisplayRow.vue';
import Currency from '../render/Currency.vue';
import MultName from '../render/MultName.vue';

export default {
  components: { CardItem, MultStat, CardPack, MultName, DisplayRow, AlertText, Currency },
  data: () => ({
    selectedPack: null
  }),
  computed: {
    ...mapState({
      feature: state => state.card.feature,
      unlock: state => state.unlock,
      packList: state => state.card.pack,
      stat: state => state.stat,
      allCards: state => state.card.card
    }),
    collection() {
      let obj = {};
      for (const [key, elem] of Object.entries(this.$store.state.card.collection)) {
        if (elem.cacheCards > 0 || (elem.cards && elem.cards.length > 0)) {
          obj[key] = elem;
        }
      }
      return obj;
    },
    pack() {
      let arr = [];
      for (const [key, elem] of Object.entries(this.packList)) {
        if (elem.price !== null && (elem.unlock === null || this.unlock[elem.unlock].see)) {
          arr.push({...elem, name: key});
        }
      }
      return arr;
    },
    canBuyPack() {
      if (this.selectedPack === null) {
        return false;
      }
      return this.$store.getters['currency/value']('gem_emerald') >= this.packList[this.selectedPack].price;
    },
    unlockedFeature() {
      let obj = {};
      for (const [key, elem] of Object.entries(this.feature)) {
        const unlock = this.$store.state.system.features[key].unlock;
        if (elem.cacheCards > 0 && (unlock === null || this.$store.state.unlock[unlock].see)) {
          obj[key] = {amount: elem.cacheCards, shiny: elem.cacheShinyCards, reward: elem.reward, shinyReward: elem.shinyReward, icon: this.$store.state.system.features[key].icon};
        }
      }
      return obj;
    },
    canSeeTutorial() {
      let hasCards = false;
      for (const [, elem] of Object.entries(this.unlockedFeature)) {
        if (elem.amount > 0) {
          hasCards = true;
        }
      }
      return hasCards && this.stat.mining_prestigeCount.total <= 0 && this.stat.village_prestigeCount.total <= 0 && this.stat.horde_prestigeCount.total <= 0;
    },
    isCard1NewLabelEnabled() {
      return this.$store.state.system.settings.experiment.items.card1newLabel.value || false;
    },
    showPreview() {
      return this.$store.state.system.settings.experiment?.items?.cardPackPreview?.value || false;
    },
    singlePreviewCards() {
      if (!this.showPreview || !this.selectedPack) return [];

      const pack = this.packList[this.selectedPack];
      if (!pack) return [];

      return this.generatePreviewCards(pack, 1);
    },
    maxPreviewCards() {
      if (!this.showPreview || !this.selectedPack) return [];
      const pack = this.packList[this.selectedPack];
      if (!pack) return [];
      const maxAfford = Math.floor(this.$store.state.currency.gem_emerald.value / pack.price);
      const previewAmount = maxAfford <= 0 ? 1 : maxAfford;
      return this.generatePreviewCards(pack, previewAmount);
    },
    singlePreviewSummary() {
      return this.summarizePreviewCards(this.singlePreviewCards);
    },
    maxPreviewSummary() {
      return this.summarizePreviewCards(this.maxPreviewCards);
    },
    allCards() {
      return this.$store.state.card.card;
    }
  },
  methods: {
    buyPack(max) {
      if (this.$store.state.system.settings.confirm.items.gem.value) {
        const maxAfford = max ? Math.floor(this.$store.state.currency.gem_emerald.value / this.packList[this.selectedPack].price) : 1;
        this.$store.commit('system/updateKey', {key: 'confirm', value: {
          type: 'cardPack',
          name: this.selectedPack,
          price: {gem_emerald: this.packList[this.selectedPack].price * maxAfford},
          amount: maxAfford,
        }});
      } else {
        this.$store.dispatch('card/buyPack', {name: this.selectedPack, notify: true, max});
      }
    },
    getMissingCardSourcePacks(collectionData) {
      if (!collectionData || !collectionData.cards) {
        return [];
      }
      const missingCardIds = collectionData.cards.filter(cardId => {
        const cardState = this.allCards[cardId];
        return !cardState || cardState.amount === 0;
      });
      if (missingCardIds.length === 0) {
        return [];
      }
      const relevantPackNames = new Set();
      const allPacks = this.packList;
      const unlocks = this.unlock;
      for (const cardId of missingCardIds) {
        for (const [packKey, packData] of Object.entries(allPacks)) {
          if (packData.content && packData.content[cardId] !== undefined) {
            if (packData.unlock === null || (unlocks[packData.unlock] && unlocks[packData.unlock].see)) {
              relevantPackNames.add(packKey);
            }
          }
        }
      }
      return Array.from(relevantPackNames);
    },
    generatePreviewCards(pack, packCount) {
      const cards = [];
      const packAmount = pack.amount || 1;
      
      const rngKey = 'cardPack_' + this.selectedPack;
      const rngShinyKey = 'cardPackShiny_' + this.selectedPack;

      try {
        for (let p = 0; p < packCount; p++) {
          const rngGen = this.$store.getters['system/getRng'](rngKey, p);
          const rngGenShiny = this.$store.getters['system/getRng'](rngShinyKey, p);
          
          for (let i = 0; i < packAmount; i++) {
            const cardChosen = pack.cacheContent[this.weightSelect(pack.cacheWeight, rngGen())];

            const shinyChance = this.$store.getters['mult/get']('cardShinyChance');
            const isShiny = this.$store.state.unlock.cardShiny.use && rngGenShiny() < shinyChance;
            
            cards.push({
              id: cardChosen,
              shiny: isShiny
            });
          }
        }
        
        return cards;
      } finally {
        // null
      }
    },
    weightSelect(weights, rng) {
      let totalWeight = weights.reduce((a, b) => a + b, 0);
      const r = rng * totalWeight;
      let currentWeight = 0;
      
      for (let i = 0; i < weights.length; i++) {
        currentWeight += weights[i];
        if (r <= currentWeight) {
          return i;
        }
      }
      
      return 0;
    },
    summarizePreviewCards(cards) {
      const summary = {};
      
      cards.forEach(card => {
        if (!summary[card.id]) {
          const cardState = this.$store.state.card.card[card.id];
          const isNew = cardState.amount <= 0;
          
          summary[card.id] = {
            amount: 0,
            shinyCount: 0,
            isNew: isNew
          };
        }
        
        summary[card.id].amount++;
        if (card.shiny) {
          summary[card.id].shinyCount++;
        }
      });
      
      return summary;
    }
  }
}
</script>
