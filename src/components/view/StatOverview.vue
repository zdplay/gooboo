<style scoped>
.global-level-container {
  position: relative;
  width: fit-content;
}
.global-level-text {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  font-size: 14px;
}
.theme--dark >>> .global-level-text {
  color: #121212;
}
.theme--light >>> .global-level-text {
  color: #FFFFFF;
}
.cheater-seal {
  position: absolute;
  cursor: pointer;
  top: -16px;
  right: -32px;
  width: 128px;
  height: 128px;
  border-width: 4px;
  border-style: solid;
  border-radius: 9999% !important;
}
.cheater-seal-mobile {
  width: 96px;
  height: 96px;
  right: 4px;
}
.cheater-seal-mobile .cheater-seal-inner {
  height: 40px;
  width: 86px;
  font-size: 16px;
}
.cheater-seal-inner {
  height: 50px;
  width: 114px;
  rotate: 30deg;
  border-top-width: 4px;
  border-top-style: solid;
  border-bottom-width: 4px;
  border-bottom-style: solid;
  font-size: 20px;
  text-align: center;
  line-height: 1rem;
}
.grade-container {
  width: 90px;
  height: 70px;
}
.grade-text {
  font-weight: 700;
  font-size: 24px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
}
.scrollable-table {
  width: fit-content;
  border: 2px solid black;
}
.scrollable-table-dark {
  border: 2px solid white;
}
.scrollable-table-col {
  width: 150px;
}
.scrollable-table-col-large {
  width: 200px;
}
.scrollable-table-row {
  height: 64px !important;
}
.player-name-input {
  max-width: 200px;
}
.player-name-edit {
  opacity: 0.25;
}
.self-mark-close {
  position: absolute;
  right: 4px;
  top: 4px;
}
@media (max-width: 600px) {
  .grade-container {
    padding: 2px 4px;
    min-width: 50px;
  }
  
  .grade-text {
    font-size: 18px;
  }
}
</style>

<template>
  <div>
    <v-tabs v-model="tab" grow show-arrows :class="{'mobile-tabs': $vuetify.breakpoint.xsOnly}">
      <v-tab href="#overview"><tab-icon-text :text="$vuetify.lang.t('$vuetify.info.statistics.overview')" icon="mdi-magnify"></tab-icon-text></v-tab>
      <v-tab v-for="item in mainFeatures" :key="'name-' + item.name" :href="`#${item.name}`">
        <tab-icon-text :text="$vuetify.lang.t(`$vuetify.feature.${item.name}`)" :icon="item.icon"></tab-icon-text>
      </v-tab>
      <v-tab href="#other"><tab-icon-text :text="$vuetify.lang.t('$vuetify.info.statistics.other')" icon="mdi-dots-horizontal"></tab-icon-text></v-tab>
    </v-tabs>
    <div v-if="tab === 'overview'" :class="$vuetify.breakpoint.mdAndUp ? 'scroll-container-tab' : ''">
      <div v-if="showSelfMark" class="d-flex justify-center ma-2">
        <v-card width="480">
          <v-card-title class="pa-2 justify-center">{{ $vuetify.lang.t(`$vuetify.info.cheater.selfMark`) }}</v-card-title>
          <v-card-text>
            <div>{{ $vuetify.lang.t(`$vuetify.info.cheater.selfMarkDescription`) }}</div>
            <v-select class="w-100 mt-2" outlined hide-details item-value="name" v-model="cheaterSelfMark" v-on:input="setCheaterSelfMark" :items="cheetahStateList">
              <template v-slot:selection="{ item }"><div :class="`${ cheetahColorList[item] }--text`">{{ $vuetify.lang.t(`$vuetify.info.cheater.${ item }.title`) }}</div></template>
              <template v-slot:item="{ item }">
                <div style="max-width: 416px;">
                  <div :class="`${ cheetahColorList[item] }--text`">{{ $vuetify.lang.t(`$vuetify.info.cheater.${ item }.title`) }}</div>
                  <div style="font-size: 12px; opacity: 0.75;">{{ $vuetify.lang.t(`$vuetify.info.cheater.${ item }.description`) }}</div>
                </div>
              </template>
            </v-select>
          </v-card-text>
          <v-btn class="self-mark-close" icon @click="showSelfMark = false"><v-icon>mdi-close</v-icon></v-btn>
        </v-card>
      </div>
      <div class="d-flex justify-center ma-2 mt-n2">
        <v-card class="mt-8" width="600">
          <v-card-title class="justify-center flex-column" style="font-size: 28px; padding-right: 100px;">
            <div class="d-flex align-center">
              <v-text-field v-if="isEditingName" dense class="player-name-input ma-1" outlined hide-details v-model="playerName"></v-text-field>
              <div v-else class="ma-1">
                {{ playerName }}
                <gb-tooltip v-if="compensationCodeUsed" :min-width="0">
                  <template v-slot:activator="{ on, attrs }">
                    <span class="ml-2 orange--text font-weight-bold" v-bind="attrs" v-on="on">x{{ currentTimeMult.toFixed(1) }}</span>
                  </template>
                  <div style="font-weight: bold; margin-bottom: 8px;">游戏速度补偿</div>
                  <table style="border-collapse: collapse; font-size: 12px;">
                    <thead>
                      <tr>
                        <th style="border: 1px solid #666; padding: 4px 8px; text-align: center;">等级范围</th>
                        <th style="border: 1px solid #666; padding: 4px 8px; text-align: center;">倍率</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style="border: 1px solid #666; padding: 4px 8px;">0-199级</td>
                        <td style="border: 1px solid #666; padding: 4px 8px; text-align: center;">1.0倍</td>
                      </tr>
                      <tr>
                        <td style="border: 1px solid #666; padding: 4px 8px;">200-399级</td>
                        <td style="border: 1px solid #666; padding: 4px 8px; text-align: center;">1.1倍</td>
                      </tr>
                      <tr>
                        <td style="border: 1px solid #666; padding: 4px 8px;">400-599级</td>
                        <td style="border: 1px solid #666; padding: 4px 8px; text-align: center;">1.2倍</td>
                      </tr>
                      <tr>
                        <td style="border: 1px solid #666; padding: 4px 8px;">600-799级</td>
                        <td style="border: 1px solid #666; padding: 4px 8px; text-align: center;">1.3倍</td>
                      </tr>
                      <tr>
                        <td style="border: 1px solid #666; padding: 4px 8px;">800-999级</td>
                        <td style="border: 1px solid #666; padding: 4px 8px; text-align: center;">1.4倍</td>
                      </tr>
                      <tr style="background-color: rgba(255, 193, 7, 0.2);">
                        <td style="border: 1px solid #666; padding: 4px 8px;">1000级+</td>
                        <td style="border: 1px solid #666; padding: 4px 8px; text-align: center; font-weight: bold;">1.5倍（最高）</td>
                      </tr>
                    </tbody>
                  </table>
                  <div style="margin-top: 8px; font-weight: bold; color: #ff9800;">当前倍率：{{ currentTimeMult.toFixed(1) }}倍</div>
                </gb-tooltip>
              </div>
              <v-icon class="player-name-edit ml-2" @click="toggleEditingName">mdi-tag-edit</v-icon>
            </div>
            <div class="d-flex align-center mt-2" style="font-size: 16px;">
              <span class="mr-2">PlayerId: {{ playerId }}</span>
              <v-btn small icon color="secondary" @click="copyPlayerId">
                <v-icon>mdi-content-copy</v-icon>
              </v-btn>
              <v-btn small icon color="primary" @click="showRedeemDialog = true">
                <v-icon>mdi-gift</v-icon>
              </v-btn>
            </div>
          </v-card-title>
          <v-card-text>
            <div class="d-flex justify-center align-center flex-wrap mt-8">
              <div class="global-level-container ma-2">
                <v-icon size="48">mdi-octagram</v-icon>
                <div class="global-level-text d-flex justify-center align-center">
                  <span>{{ globalLevel }}</span>
                </div>
              </div>
              <div class="d-flex flex-column justify-center align-center bg-tile-default rounded ma-1 px-2" v-for="(item, key) in globalLevelParts" :key="key">
                <v-icon class="ma-2" large>{{ features[key].icon }}</v-icon>
                <div class="d-flex">
                  <div class="balloon-text-black ma-2" v-for="(subitem, subkey) in item" :class="`${ subfeatureColor[subkey] }--text`" :key="key + '-' + subkey">{{ subitem }}</div>
                </div>
              </div>
            </div>
            <div v-if="unlock.gemFeature.see" class="d-flex justify-space-around flex-wrap mt-8">
              <div class="d-flex align-center flex-wrap bg-tile-default rounded ma-1 pa-2">
                <v-icon class="mr-1">mdi-format-paint</v-icon>{{ totalThemes }}
              </div>
              <div v-if="unlock.achievementFeature.see" class="d-flex align-center flex-wrap bg-tile-default rounded ma-1 pa-2">
                <v-icon class="mr-1">mdi-trophy</v-icon>{{ totalAchievements }}
              </div>
              <div v-if="unlock.cardFeature.see" class="d-flex align-center flex-wrap bg-tile-default rounded ma-1 pa-2">
                <v-icon class="mr-1">mdi-cards-playing-club</v-icon>{{ cardsTotal }}
                <template v-if="unlock.cardShiny.see">
                  <v-icon :color="`light-blue ${ themeModifier }`" class="ml-4 mr-1">mdi-shimmer</v-icon>
                  <span :class="`light-blue--text text--${ themeModifier }`">{{ cardsShinyTotal }}</span>
                </template>
                <v-icon class="ml-4 mr-1">mdi-cards</v-icon>{{ cardCollectionsTotal }}
              </div>
            </div>
            <div v-if="unlock.schoolFeature.see" class="d-flex justify-center align-center flex-wrap mt-8">
              <v-icon class="ma-2" size="48">{{ features.school.icon }}</v-icon>
              <div
                v-for="(item, key) in schoolGrades"
                :key="`school-${ key }`"
                class="d-flex flex-column justify-center align-center bg-tile-default grade-container rounded ma-1"
              >
                <div class="mb-n1">{{ $vuetify.lang.t(`$vuetify.school.${ key }.name`) }}</div>
                <div class="grade-text" :class="`${ item.color }--text`">{{ item.grade }}</div>
              </div>
            </div>
            <div v-if="unlock.generalFeature.see" class="d-flex justify-center align-center flex-wrap mt-8">
              <v-icon class="ma-2" size="48">{{ features.general.icon }}</v-icon>
              <div v-for="(item, key) in generalQuestlinesCompleted" :key="`general-${ key }`" class="d-flex align-center flex-wrap bg-tile-default rounded ma-1 pa-2">
                <v-icon class="mr-1">{{ generalIcon[key] }}</v-icon>{{ item }}
              </div>
            </div>
            <div v-if="unlock.eventFeature.see" class="d-flex justify-center align-center flex-wrap mt-8">
              <v-icon class="ma-2" size="48">{{ features.event.icon }}</v-icon>
              <div v-for="(item, key) in eventHighscores" :key="`general-${ key }`" class="d-flex align-center flex-wrap bg-tile-default rounded ma-1 pa-2">
                <v-icon :color="item.color" class="mr-1">mdi-poker-chip</v-icon>{{ item.score }}
              </div>
            </div>
          </v-card-text>
          <gb-tooltip :min-width="0">
            <template v-slot:activator="{ on, attrs }">
              <div class="cheater-seal d-flex justify-center align-center" :class="{'cheater-seal-mobile': $vuetify.breakpoint.xsOnly}" :style="`border-color: var(--v-${ cheetahColor });`" @click="showSelfMark = !showSelfMark" v-bind="attrs" v-on="on">
                <div class="cheater-seal-inner d-flex justify-center align-center" :class="cheetahTextColor" :style="`border-color: var(--v-${ cheetahColor });`">{{ $vuetify.lang.t(`$vuetify.info.cheater.${ shownCheetahStatus }.title`) }}</div>
              </div>
            </template>
            <div v-if="cheetahState === 0" class="mt-0">{{ $vuetify.lang.t(`$vuetify.info.cheater.noDetected`) }}</div>
            <div v-else-if="cheetahIsPermanent" class="mt-0">{{ $vuetify.lang.t(`$vuetify.info.cheater.globalDetected`) }}</div>
            <template v-else>
              <div class="mt-0">{{ $vuetify.lang.t(`$vuetify.info.cheater.featureDetected`) }}</div>
              <ul>
                <li v-for="name in cheetahFeatures" :key="`cheetah-feature-${ name }`">{{ $vuetify.lang.t(`$vuetify.feature.${ name }`) }}</li>
              </ul>
              <div>{{ $vuetify.lang.t(`$vuetify.info.cheater.featureDetected2`) }}</div>
            </template>
            <div v-if="cheetahState < 200">{{ $vuetify.lang.t(`$vuetify.info.cheater.selfMarkClick`) }}</div>
          </gb-tooltip>
        </v-card>
      </div>
    </div>
    <div v-else :class="$vuetify.breakpoint.mdAndUp ? 'scroll-container-tab' : ''">
      <div class="d-flex justify-center ma-2">
        <v-simple-table v-if="currencyList.length > 0" class="scrollable-table mx-auto" :class="{'scrollable-table-dark': $vuetify.theme.dark}">
          <thead>
            <tr>
              <th class="scrollable-table-col-large"></th>
              <th class="text-center scrollable-table-col">
                <span>{{ $vuetify.lang.t('$vuetify.info.statistics.gained') }}</span>
                <span v-if="tab !== 'farm' && tab !== 'other'">&nbsp;({{ $vuetify.lang.t('$vuetify.info.statistics.currentTotal') }})</span>
              </th>
              <th class="text-center scrollable-table-col">
                <span>{{ $vuetify.lang.t('$vuetify.info.statistics.maxOwned') }}</span>
                <span v-if="tab !== 'farm' && tab !== 'other'">&nbsp;({{ $vuetify.lang.t('$vuetify.info.statistics.currentTotal') }})</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="name in currencyList" :key="name">
              <td class="scrollable-table-row"><currency :name="name" hide-labels></currency></td>
              <td class="text-center">
                <div>{{ $formatNum(stat[name].value) }}</div>
                <div v-if="tab !== 'farm' && tab !== 'other'">{{ $formatNum(stat[name].total) }}</div>
              </td>
              <td class="text-center">
                <div>{{ $formatNum(stat[name + 'Max'].value) }}</div>
                <div v-if="tab !== 'farm' && tab !== 'other'">{{ $formatNum(stat[name + 'Max'].total) }}</div>
              </td>
            </tr>
          </tbody>
        </v-simple-table>
      </div>
      <div v-if="statList.length > 0" class="d-flex justify-center ma-2">
        <v-simple-table class="scrollable-table mx-auto" :class="{'scrollable-table-dark': $vuetify.theme.dark}">
          <thead>
            <tr>
              <th class="scrollable-table-col-large"></th>
              <th class="text-center scrollable-table-col">
                <span>{{ $vuetify.lang.t('$vuetify.info.statistics.gained') }}</span>
                <span v-if="tab !== 'farm' && tab !== 'other'">&nbsp;({{ $vuetify.lang.t('$vuetify.info.statistics.currentTotal') }})</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in statList" :key="item.name">
              <td class="scrollable-table-row">{{ $vuetify.lang.t(`$vuetify.stat.${ item.name }.description`) }}</td>
              <td class="text-center">
                <div>{{ item.display === 'percent' ? ($formatNum(item.value * 100) + '%') : $formatNum(item.value) }}</div>
                <div v-if="tab !== 'farm' && tab !== 'other'">{{ item.display === 'percent' ? ($formatNum(item.total * 100) + '%') : $formatNum(item.total) }}</div>
              </td>
            </tr>
          </tbody>
        </v-simple-table>
      </div>
    </div>
    <v-dialog v-model="showRedeemDialog" max-width="500">
      <v-card class="default-card pa-2">
        <v-card-title class="pa-2 justify-center">
          <v-icon class="mr-2">mdi-gift</v-icon>
          兑换码
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="redeemCode"
            label="请输入兑换码"
            outlined
            hide-details
            placeholder="例如：ADFR12k3naAD2n3e4l"
            :disabled="isRedeeming"
          ></v-text-field>
          <div v-if="redeemMessage" class="mt-2" :class="redeemSuccess ? 'success--text' : 'error--text'">
            {{ redeemMessage }}
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="closeRedeemDialog">取消</v-btn>
          <v-btn color="primary" :disabled="!redeemCode || isRedeeming" :loading="isRedeeming" @click="redeemGiftCode">
            兑换
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import { formatGrade } from '../../js/utils/format';
import TabIconText from '../partial/render/TabIconText.vue';
import Currency from '../render/Currency.vue';
import redeemCodeSystem from '../../js/modules/redeemCode.js';

export default {
  components: { TabIconText, Currency },
  data: () => ({
    subfeatureColor: ['light-green', 'yellow', 'orange', 'red', 'purple'],
    generalIcon: {
      grobodal: 'mdi-account-cowboy-hat',
      orladee: 'mdi-account-eye',
      oppenschroe: 'mdi-account-cog',
      bellux: 'mdi-account-edit',
      onoclua: 'mdi-account-music',
      omnisolix: 'mdi-account-tie'
    },
    tab: 'overview',
    playerName: '',
    isEditingName: false,
    showRedeemDialog: false,
    redeemCode: '',
    redeemMessage: '',
    redeemSuccess: false,
    isRedeeming: false,
    cheetahColorList: {
      0: 'green',
      100: 'amber',
      200: 'red',
    },
    cheetahStateList: [0, 100, 200],
    cheaterSelfMark: 0,
    showSelfMark: false,
    cheetahFeatureList: ['mining', 'village', 'horde', 'farm', 'gallery', 'school'],
  }),
  mounted() {
    this.cheaterSelfMark = this.$store.state.system.cheaterSelfMark;
    this.playerName = this.$store.state.system.playerName ?? this.$vuetify.lang.t('$vuetify.info.statistics.defaultPlayerName');
  },
  computed: {
    ...mapState({
      globalLevel: state => state.meta.globalLevel,
      features: state => state.system.features,
      unlock: state => state.unlock,
      currency: state => state.currency,
      stat: state => state.stat,
    }),
    ...mapGetters({
      mainFeatures: 'system/mainFeatures',
      cheetahState: 'system/cheetahState',
      cheetahBreakdown: 'system/cheetahBreakdown',
    }),
    playerId() {
      return this.$store.state.system.playerId || 'Unknown';
    },

    currencyList() {
      if (this.tab === 'overview') {
        return [];
      }
      if (this.tab === 'other') {
        return [
          ...this.$store.getters['currency/list']('gem'),
          ...this.$store.getters['currency/list']('school'),
          ...this.$store.getters['currency/list']('card'),
          ...this.$store.getters['currency/list']('treasure'),
        ].filter(el => this.stat[el].total > this.stat[el].default);
      }
      return this.$store.getters['currency/list'](this.tab).filter(el => this.stat[el].total > this.stat[el].default);
    },
    statList() {
      if (this.tab === 'overview') {
        return [];
      }
      let arr = [];
      for (const [key, elem] of Object.entries(this.stat)) {
        if (elem.feature === this.tab && elem.showInStatistics && elem.total > elem.default) {
          arr.push({...elem, name: key});
        }
      }
      return arr;
    },
    globalLevelParts() {
      let obj = {};
      for (const [key, elem] of Object.entries(this.$store.getters['meta/globalLevelParts'])) {
        const split = key.split('_');
        if (obj[split[0]] === undefined) {
          obj[split[0]] = {};
        }
        obj[split[0]][split[1]] = elem;
      }
      return obj;
    },
    cardsTotal() {
      let amount = 0;
      for (const [, elem] of Object.entries(this.$store.state.card.card)) {
        if (elem.amount >= 1) {
          amount++;
        }
      }
      return amount;
    },
    cardCollectionsTotal() {
      let amount = 0;
      for (const [, elem] of Object.entries(this.$store.state.card.collection)) {
        if (elem.cacheCards >= elem.cards.length) {
          amount++;
        }
      }
      return amount;
    },
    cardsShinyTotal() {
      let amount = 0;
      for (const [, elem] of Object.entries(this.$store.state.card.card)) {
        if (elem.foundShiny) {
          amount++;
        }
      }
      return amount;
    },
    totalAchievements() {
      return this.$store.getters['achievement/totalLevel'];
    },
    totalThemes() {
      let amount = 0;
      for (const [, elem] of Object.entries(this.$store.state.system.themes)) {
        if (elem.owned) {
          amount++;
        }
      }
      return amount;
    },
    schoolGrades() {
      let obj = {};
      for (const [key, elem] of Object.entries(this.$store.state.school)) {
        if (elem.unlock === null || this.unlock[elem.unlock].see) {
          const gradeTier = Math.floor((elem.grade + 2) / 3);
          let color = 'blue';
          switch (gradeTier) {
            case 0:
              color = 'red';
              break;
            case 1:
              color = 'orange';
              break;
            case 2:
              color = 'amber';
              break;
            case 3:
              color = 'light-green';
              break;
            case 4:
              color = 'green';
              break;
          }
          obj[key] = {grade: formatGrade(elem.grade), color};
        }
      }
      return obj;
    },
    generalQuestlinesCompleted() {
      let obj = {};
      for (const [key, elem] of Object.entries(this.$store.state.general)) {
        if (elem.unlock === null || this.unlock[elem.unlock].see) {
          let amount = 0;
          for (const [, el] of Object.entries(elem.quests)) {
            if (el.stage >= el.stages.length) {
              amount++;
            }
          }
          obj[key] = amount;
        }
      }
      return obj;
    },
    eventHighscores() {
      let obj = {};
      for (const [key, elem] of Object.entries(this.$store.state.event.big)) {
        if (this.unlock[key + 'Event'].see) {
          obj[key] = {score: this.$store.state.stat[`event_${ key }Highscore`].total, color: elem.color};
        }
      }
      return obj;
    },
    shownCheetahStatus() {
      return Math.max(this.cheetahState, this.cheaterSelfMark);
    },
    cheetahColor() {
      return this.cheetahColorList[this.shownCheetahStatus] + '-' + (this.$vuetify.theme.dark ? 'lighten2' : 'darken1');
    },
    cheetahTextColor() {
      return this.cheetahColorList[this.shownCheetahStatus] + '--text text--' + (this.$vuetify.theme.dark ? 'lighten-2' : 'darken-1');
    },
    themeModifier() {
      return this.$vuetify.theme.dark ? 'lighten-3' : 'darken-2';
    },
    cheetahFeatures() {
      return Object.keys(this.cheetahBreakdown).filter(elem => this.cheetahFeatureList.includes(elem));
    },
    cheetahIsPermanent() {
      return Object.keys(this.cheetahBreakdown).filter(elem => !this.cheetahFeatureList.includes(elem)).length > 0;
    },
    compensationCodeUsed() {
      return this.$store.state.system.usedRedeemCodes.includes('KSBBC');
    },
    currentTimeMult() {
      if (!this.compensationCodeUsed) {
        return 1;
      }
      const globalLevel = this.globalLevel || 0;
      return Math.min(1.5, 1 + Math.floor(globalLevel / 200) * 0.1);
    }
  },
  methods: {
    toggleEditingName() {
      this.isEditingName = !this.isEditingName;
      if (!this.isEditingName) {
        this.$store.commit('system/updateKey', {key: 'playerName', value: this.playerName});
      }
    },
    setCheaterSelfMark() {
      this.$store.commit('system/updateKey', {key: 'cheaterSelfMark', value: this.cheaterSelfMark});
    },
    async copyPlayerId() {
      try {
        await navigator.clipboard.writeText(this.playerId);
        this.$store.commit('system/addNotification', {
          color: 'success',
          timeout: 3000,
          message: 'PlayerId已复制到剪贴板'
        });
      } catch (error) {
        this.$store.commit('system/addNotification', {
          color: 'error',
          timeout: 3000,
          message: '复制失败，请手动复制'
        });
      }
    },
    closeRedeemDialog() {
      this.showRedeemDialog = false;
      this.redeemCode = '';
      this.redeemMessage = '';
      this.redeemSuccess = false;
      this.isRedeeming = false;
    },
    async redeemGiftCode() {
      if (!this.redeemCode.trim()) {
        return;
      }

      this.isRedeeming = true;
      this.redeemMessage = '';

      try {
        if (this.redeemCode.trim().toUpperCase() === 'KSBBC') {
          const fixBugEnabled = this.$store.state.system.settings.experiment.items.fixDoubleRewardBug.value;
          const alreadyUsed = this.$store.state.system.usedRedeemCodes.includes('KSBBC');

          if (!fixBugEnabled) {
            this.redeemMessage = '兑换码错误';
            this.redeemSuccess = false;
            return;
          }

          if (alreadyUsed) {
            this.redeemMessage = '该兑换码已使用过';
            this.redeemSuccess = false;
            return;
          }

          const success = this.$store.commit('system/useCompensationCode', {
            code: this.redeemCode.trim().toUpperCase(),
            rootState: this.$store.state
          });
          if (success !== false) {
            const globalLevel = this.globalLevel || 0;
            const currentMult = Math.min(1.5, 1 + Math.floor(globalLevel / 200) * 0.1);
            this.redeemMessage = `补偿激活成功！当前游戏速度：${currentMult.toFixed(1)}倍`;
            this.redeemSuccess = true;
            this.redeemCode = '';
            return;
          } else {
            this.redeemMessage = '兑换失败，请稍后重试';
            this.redeemSuccess = false;
            return;
          }
        }

        const secretCode = this.decryptSecretCode();
        if (this.redeemCode.trim().toLowerCase() === secretCode) {
          this.$store.commit('system/updateKey', {
            key: 'showRedeemGenerator',
            value: true
          });
          this.redeemMessage = '已激活';
          this.redeemSuccess = true;
          this.redeemCode = '';
          return;
        }

        const result = await redeemCodeSystem.useCode(this.redeemCode.trim(), this.playerId);

        if (result.success) {
          if (result.needTranslation && result.data) {
            let translatedItemName;
            if (result.data.type === 'currency') {
              const currencyKey = `${result.data.feature}_${result.data.name}`;
              try {
                translatedItemName = this.$vuetify.lang.t(`$vuetify.currency.${currencyKey}.name`);
              } catch (e) {
                translatedItemName = currencyKey;
              }
            } else {
              try {
                translatedItemName = this.$vuetify.lang.t(`$vuetify.consumable.${result.data.name}.name`);
              } catch (e) {
                translatedItemName = result.data.name;
              }
            }
            this.redeemMessage = `成功获得 ${result.data.amount} ${translatedItemName}`;
          } else {
            this.redeemMessage = result.message;
          }
          this.redeemSuccess = true;

          setTimeout(() => {
            this.redeemCode = '';
          }, 2000);
        } else {
          this.redeemMessage = result.message;
          this.redeemSuccess = false;
        }

      } catch (error) {
        console.error('兑换失败:', error);
        this.redeemMessage = '兑换失败，请稍后重试';
        this.redeemSuccess = false;
      } finally {
        this.isRedeeming = false;
      }
    },
    decryptSecretCode() {
      const parts = [
        String.fromCharCode(103, 111, 111),
        String.fromCharCode(98, 111, 111),
        String.fromCharCode(100, 104, 109),
        String.fromCharCode(115, 99, 113)
      ];
      return parts.join('');
    }
  }
}
</script>
