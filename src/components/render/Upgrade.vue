<style scoped>
.upgrade-collapse {
  position: absolute;
  top: 8px;
  right: 8px;
}
.upgrade-persistent {
  position: absolute;
  top: 16px;
  left: 16px;
}
.reduced-height {
  height: 28px;
}
.queue-button-default {
  background-color: #757575 !important;
  border-color: #757575 !important;
}
.queue-button-active {
  background-color: #81C784 !important;
  border-color: #81C784 !important;
  color: #000 !important;
}
.queue-button-disabled {
  background-color: #424242 !important;
  border-color: #424242 !important;
  opacity: 0.5 !important;
  cursor: not-allowed !important;
}
.progress-button-wrap {
  position: relative;
  border-radius: 4px;
  overflow: hidden;
}
.progress-overlay {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}
.primary-overlay {
  background-color: rgba(33, 150, 243, 0.5);
}
.error-overlay {
  background-color: rgba(244, 67, 54, 0.5);
}
.upgrade-unlocked-preview {
  opacity: 0.7;
  border: 2px dashed var(--v-warning-base);
}
</style>

<template>
  <v-card class="d-flex align-center pa-1" :class="{'upgrade-unlocked-preview': previewUnlocked}" v-if="upgrade.collapse">
    <v-icon v-if="upgrade.icon" class="ma-1">{{ upgrade.icon }}</v-icon>
    <div v-else class="ma-1">{{ $vuetify.lang.t(`$vuetify.upgrade.${name}`) }}</div>
    <gb-tooltip key="upgrade-bought-collapse" v-if="upgrade.bought || (upgrade.cap !== null && !upgrade.hideCap)" :min-width="0">
      <template v-slot:activator="{ on, attrs }">
        <v-chip
          label
          small
          class="ma-1 px-2"
          :class="showUpgradeQueue ? queueButtonColor : ''"
          v-bind="attrs"
          v-on="on"
          @click="showUpgradeQueue && upgrade.requirement(upgrade.level) ? toggleModuleQueue() : null"
          :style="showUpgradeQueue && upgrade.requirement(upgrade.level) ? 'cursor: pointer;' : (showUpgradeQueue ? 'cursor: not-allowed;' : '')"
        >
          <v-icon class="mr-1">mdi-chevron-double-up</v-icon>
          <span>{{ upgrade.level }}{{ upgrade.level !== upgrade.bought ? (' (+' + Math.round(upgrade.bought - upgrade.level) + ')') : '' }}</span>
          <span v-if="upgrade.cap !== null && !upgrade.hideCap">&nbsp;/ {{ upgrade.cap }}</span>
        </v-chip>
      </template>
      <div>{{ $vuetify.lang.t(`$vuetify.upgrade.keyset.${ translationSet }.bought`) }}</div>
      <div v-if="showUpgradeQueue" class="mt-1">{{ isInModuleQueue ? '点击删除自动升级队列' : '点击添加自动升级队列' }}</div>
    </gb-tooltip>
    <v-chip key="upgrade-time-collapse" label small class="ma-1 px-2" v-if="isTimed && isUpgrading">
      <v-icon class="mr-1">mdi-timer</v-icon>
      {{ $formatTime(timeLeftCurrent) }}
    </v-chip>
    <gb-tooltip key="upgrade-persistent-collapse" v-if="upgrade.persistent" :min-width="0">
      <template v-slot:activator="{ on, attrs }">
        <v-icon class="ma-1" small v-bind="attrs" v-on="on">mdi-lock</v-icon>
      </template>
      <div class="mt-0">{{ $vuetify.lang.t(`$vuetify.upgrade.keyset.${ translationSet }.persistent`) }}</div>
    </gb-tooltip>
    <v-spacer></v-spacer>
    <!-- 未解锁升级项显示解锁条件 -->
    <div v-if="!isMiningOrHordeUnlocked && unlockRequirementText" class="ma-1 px-2 text-caption text--secondary">
      <v-icon small class="mr-1">mdi-lock</v-icon>
      {{ unlockRequirementText }}
    </div>
    <!-- 已解锁升级项显示按钮 -->
    <template v-else>
      <v-btn key="upgrade-max-collapse" small v-if="!isMax" class="ma-1 px-2" color="primary" :disabled="!canAfford || disabled" @click="buyMax">{{ $vuetify.lang.t('$vuetify.gooboo.max') }}</v-btn>
      <gb-tooltip key="upgrade-buy-collapse">
        <template v-slot:activator="{ on, attrs }">
          <div class="progress-button-wrap ma-1" v-bind="attrs" v-on="on">
            <div v-if="showProgressBar && !disabled && !isMax" class="progress-overlay" :class="[ableAfford ? 'primary-overlay' : 'error-overlay']" :style="{ width: `${affordProgress}%` }"></div>
            <v-btn class="px-2" v-if="!isMax" color="primary" :disabled="!canAfford || disabled" @click="buy">{{ $vuetify.lang.t(upgradeTranslation) }}</v-btn>
          </div>
        </template>
        <div class="mx-n1"><price-tag class="ma-1" v-for="(amount, currency, index) in price" :key="currency + '-' + index" :currency="currency" :amount="amount" :preview-unlocked="previewUnlocked"></price-tag></div>
        <display-row class="mt-0" v-for="(item, key) in display" :key="`${item.name}-${item.type}-${key}`" :name="item.name" :type="item.type" :before="item.before" :after="item.after"></display-row>
      </gb-tooltip>
    </template>
    <v-btn class="ma-1" icon @click="toggleCollapse"><v-icon>mdi-arrow-expand</v-icon></v-btn>
  </v-card>
  <v-card v-else :class="{'upgrade-unlocked-preview': previewUnlocked}">
    <v-card-title class="pa-2 justify-center">
      <v-icon v-if="upgrade.icon" class="mr-2">{{ upgrade.icon }}</v-icon>
      <div>{{ $vuetify.lang.t(`$vuetify.upgrade.${ name }`) }}</div>
    </v-card-title>
    <v-card-text class="pb-0">
      <display-row v-for="(item, key) in display" :key="`${item.name}-${item.type}-${key}`" :name="item.name" :type="item.type" :before="item.before" :after="item.after"></display-row>
      <alert-text v-if="upgrade.hasDescription && upgrade.highestLevel <= 0" type="info" class="mt-1">{{ $vuetify.lang.t(`$vuetify.upgrade.description.${ name }`) }}</alert-text>
      <div class="d-flex flex-wrap align-center mx-n1 mt-2" v-if="!isMax">
        <price-tag class="ma-1" v-for="(amount, currency, index) in price" :key="currency + '-' + index" :currency="currency" :amount="amount" :preview-unlocked="previewUnlocked"></price-tag>
        <v-spacer></v-spacer>
        <div>
          <gb-tooltip key="upgrade-predict" v-if="!upgrade.hideCap && !isNearMax" :min-width="350" :title-text="$vuetify.lang.t('$vuetify.upgrade.nextLevels')">
            <template v-slot:activator="{ on, attrs }">
              <v-icon class="mx-1" v-bind="attrs" v-on="on">mdi-crystal-ball</v-icon>
            </template>
            <div v-for="(predict, key) in prediction" :key="`predict-${ key }`" class="d-flex align-center">
              <div class="d-flex flex-column align-center mr-2">
                <v-icon>mdi-chevron-double-up</v-icon>
                <div style="font-size: 20px;">{{ predict.level }}</div>
              </div>
              <div class="bg-tile-background flex-grow-1 rounded pa-1">
                <display-row v-for="(item, subkey) in predict.display" class="mx-1" :key="`predict-display-${key}-${item.name}-${item.type}-${subkey}`" :name="item.name" :type="item.type" :before="item.before" :after="item.after"></display-row>
                <div class="d-flex flex-wrap">
                  <price-tag class="ma-1" v-for="(amount, currency, index) in predict.price" :key="'predict-price-' + key + '-' + currency + '-' + index" :currency="currency" :amount="amount" :preview-unlocked="previewUnlocked"></price-tag>
                </div>
              </div>
            </div>
          </gb-tooltip>
        </div>
      </div>
      <v-progress-linear class="rounded mt-2" height="20" v-if="isTimed" :value="timePercentCurrent">
        <span v-if="isUpgrading">{{ $formatTime(timeLeftCurrent) }}</span>
      </v-progress-linear>
      <slot></slot>
    </v-card-text>
    <v-card-actions>
      <div>
        <gb-tooltip key="upgrade-subtype" v-if="subtype !== null" :min-width="0">
          <template v-slot:activator="{ on, attrs }">
            <v-icon class="ma-1" small v-bind="attrs" v-on="on">{{ subtypeIcon }}</v-icon>
          </template>
          <div>{{ $vuetify.lang.t(`$vuetify.upgrade.subtype.${ subtype }`) }}</div>
        </gb-tooltip>
      </div>
      <div>
        <gb-tooltip key="upgrade-bought" v-if="upgrade.bought || (upgrade.cap !== null && !upgrade.hideCap)" :min-width="0">
          <template v-slot:activator="{ on, attrs }">
            <v-chip
              :small="$vuetify.breakpoint.xsOnly"
              :label="$vuetify.breakpoint.xsOnly"
              class="ma-1"
              :class="[
                {'px-2': $vuetify.breakpoint.xsOnly, 'reduced-height': $vuetify.breakpoint.smAndUp},
                showUpgradeQueue ? queueButtonColor : ''
              ]"
              v-bind="attrs"
              v-on="on"
              @click="showUpgradeQueue && upgrade.requirement(upgrade.level) ? toggleModuleQueue() : null"
              :style="showUpgradeQueue && upgrade.requirement(upgrade.level) ? 'cursor: pointer;' : (showUpgradeQueue ? 'cursor: not-allowed;' : '')"
            >
              <v-icon class="mr-1">mdi-chevron-double-up</v-icon>
              <span>{{ upgrade.level }}{{ upgrade.level !== upgrade.bought ? (' (+' + Math.round(upgrade.bought - upgrade.level) + ')') : '' }}</span>
              <span v-if="upgrade.cap !== null && !upgrade.hideCap">&nbsp;/ {{ upgrade.cap }}</span>
            </v-chip>
          </template>
          <div>{{ $vuetify.lang.t(`$vuetify.upgrade.keyset.${ translationSet }.bought`) }}</div>
          <div v-if="showUpgradeQueue" class="mt-1">{{ isInModuleQueue ? '点击删除自动升级队列' : '点击添加自动升级队列' }}</div>
        </gb-tooltip>
      </div>
      <v-chip
        key="upgrade-time"
        :small="$vuetify.breakpoint.xsOnly"
        :label="$vuetify.breakpoint.xsOnly"
        class="ma-1"
        :class="{'px-2': $vuetify.breakpoint.xsOnly, 'reduced-height': $vuetify.breakpoint.smAndUp}"
        v-if="isTimed"
      >
        <v-icon class="mr-1">mdi-timer</v-icon>
        {{ $formatTime(timeNeededNext) }}
      </v-chip>
      <div>
        <gb-tooltip key="upgrade-other" v-if="upgrade.raiseOtherCap" :min-width="350" :title-text="$vuetify.lang.t(`$vuetify.upgrade.${ upgrade.raiseOtherCap }`)">
          <template v-slot:activator="{ on, attrs }">
            <v-icon class="mx-1" v-bind="attrs" v-on="on">mdi-book-arrow-up</v-icon>
          </template>
          <div class="mt-n1 mb-2 text-center">
            <v-icon small class="mr-1">mdi-chevron-double-up</v-icon>
            <span>{{ otherUpgrade.level }}{{ otherUpgrade.level !== otherUpgrade.bought ? (' (+' + Math.round(otherUpgrade.bought - otherUpgrade.level) + ')') : '' }}</span>
            <span v-if="otherUpgrade.cap !== null && !otherUpgrade.hideCap">&nbsp;/ {{ otherUpgrade.cap }}</span>
          </div>
          <display-row v-for="(item, key) in otherDisplay" class="mt-0 mx-1" :key="`other-display-${item.name}-${item.type}-${key}`" :name="item.name" :type="item.type" :before="item.before" :after="item.after"></display-row>
          <div class="d-flex flex-wrap mt-0">
            <price-tag class="ma-1" v-for="(amount, currency, index) in otherPrice" :key="'other-price-' + currency + '-' + index" :currency="currency" :amount="amount" :preview-unlocked="previewUnlocked"></price-tag>
          </div>
        </gb-tooltip>
      </div>
      <v-spacer></v-spacer>
      <!-- 未解锁升级项显示解锁条件 -->
      <div v-if="!isMiningOrHordeUnlocked && unlockRequirementText" class="ma-1 px-2 text-body-2 text--secondary">
        <v-icon small class="mr-1">mdi-lock</v-icon>
        {{ unlockRequirementText }}
      </div>
      <!-- 已解锁升级项显示按钮 -->
      <template v-else>
        <v-btn key="upgrade-buy-max" small v-if="!isMax" color="primary" :disabled="!canAfford || disabled" @click="buyMax">{{ $vuetify.lang.t('$vuetify.gooboo.max') }}</v-btn>
        <div class="progress-button-wrap ml-2">
          <div v-if="showProgressBar && !disabled && !isMax" class="progress-overlay" :class="[ableAfford ? 'primary-overlay' : 'error-overlay']" :style="{ width: `${affordProgress}%` }"></div>
          <v-btn key="upgrade-buy" v-if="!isMax" :data-cy="`upgrade-${ name }-buy`" color="primary" :disabled="!canAfford || disabled" @click="buy">{{ $vuetify.lang.t(upgradeTranslation) }}</v-btn>
        </div>
      </template>
    </v-card-actions>
    <v-btn class="upgrade-collapse" icon @click="toggleCollapse"><v-icon>mdi-arrow-collapse</v-icon></v-btn>
    <gb-tooltip key="upgrade-persistent" v-if="upgrade.persistent" :min-width="0">
      <template v-slot:activator="{ on, attrs }">
        <v-icon class="upgrade-persistent" small v-bind="attrs" v-on="on">mdi-lock</v-icon>
      </template>
      <div class="mt-0">{{ $vuetify.lang.t(`$vuetify.upgrade.keyset.${ translationSet }.persistent`) }}</div>
    </gb-tooltip>
  </v-card>
</template>

<script>
import { capitalize } from '../../js/utils/format';
import AlertText from '../partial/render/AlertText.vue';
import DisplayRow from '../partial/upgrade/DisplayRow.vue';
import PriceTag from './PriceTag.vue';

export default {
  components: { PriceTag, DisplayRow, AlertText },
  props: {
    name: {
      type: String,
      required: true
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },
    upgradeTranslation: {
      type: String,
      required: false,
      default: '$vuetify.gooboo.buy'
    },
    translationSet: {
      type: String,
      required: false,
      default: 'default'
    },
    previewUnlocked: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  computed: {
    upgrade() {
      return this.$store.state.upgrade.item[this.name];
    },
    showProgressBar() {
      return this.$store.state.system.settings.experiment.items.upgradeBuyProgress.value;
    },
    otherUpgrade() {
      if (!this.upgrade.raiseOtherCap) {
        return null;
      }
      return this.$store.state.upgrade.item[this.upgrade.raiseOtherCap];
    },
    price() {
      return this.upgrade.price(this.upgrade.bought);
    },
    otherPrice() {
      if (!this.upgrade.raiseOtherCap) {
        return null;
      }
      return this.otherUpgrade.price(this.otherUpgrade.bought);
    },
    canAfford() {
      return this.$store.getters['upgrade/canAfford'](this.upgrade.feature, this.splitName);
    },
    ableAfford() {
      const price = this.price;
      if (!price) return true;
      
      for (const currency in price) {
        const required = price[currency];
        if (required <= 0) continue;
        
        const currencyState = this.$store.state.currency[currency];
        if (!currencyState) return false;
        
        if (currencyState.cap < required) {
          return false;
        }
      }
      
      return true;
    },
    affordProgress() {
      if (this.isMax || this.disabled) return 0;
      
      const price = this.price;
      if (!price) return 0;
      
      let percents = [];
      
      for (const currency in price) {
        const required = price[currency];
        if (required <= 0) continue;
        
        const effectiveValue = this.$store.getters['currency/value'](currency) || 0;
        const ratio = Math.min(effectiveValue / required, 1);
        percents.push(ratio);
      }
      
      if (percents.length === 0) return 0;
      return percents.reduce((a, b) => a + b, 0) / percents.length * 100;
    },
    isMax() {
      return this.upgrade.cap !== null && this.upgrade.bought >= this.upgrade.cap;
    },
    isNearMax() {
      return this.upgrade.cap !== null && this.upgrade.bought >= (this.upgrade.cap - 1);
    },
    display() {
      return this.upgrade.effect.map(elem => {
        const lvl = this.upgrade.bought;
        return {
          ...elem,
          before: lvl > 0 ? elem.value(lvl) : null,
          after: this.isMax ? null : elem.value(lvl + 1)
        };
      }).filter(elem => {
        const isBool = ['unlock', 'keepUpgrade', 'villageCraft', 'farmSeed', 'findConsumable', 'galleryIdea', 'galleryShape'].includes(elem.type);
        return (isBool && !elem.before && elem.after) || (!isBool && elem.before !== elem.after);
      });
    },
    otherDisplay() {
      if (!this.upgrade.raiseOtherCap) {
        return null;
      }
      return this.otherUpgrade.effect.map(elem => {
        const lvl = this.otherUpgrade.bought;
        return {
          ...elem,
          before: lvl > 0 ? elem.value(lvl) : null,
          after: this.isMax ? null : elem.value(lvl + 1)
        };
      }).filter(elem => {
        const isBool = ['unlock', 'keepUpgrade', 'villageCraft', 'farmSeed', 'findConsumable', 'galleryIdea', 'galleryShape'].includes(elem.type);
        return (isBool && !elem.before && elem.after) || (!isBool && elem.before !== elem.after);
      });
    },
    splitName() {
      return this.name.split('_')[1];
    },
    isTimed() {
      return ['delay', 'queue'].includes(this.upgrade.mode);
    },
    isUpgrading() {
      return this.upgrade.level < this.upgrade.bought;
    },
    queueSpeed() {
      return this.isTimed ? this.$store.getters['mult/get']('queueSpeed' + capitalize(this.upgrade.feature) + capitalize(this.upgrade.type)) : 1;
    },
    timeNeededNext() {
      if (!this.isTimed) {
        return 0;
      }
      return Math.ceil((this.upgrade.timeNeeded(this.upgrade.bought)) / this.queueSpeed);
    },
    timeNeededCurrent() {
      if (!this.isTimed) {
        return 0;
      }
      return Math.ceil((this.upgrade.timeNeeded(this.upgrade.level)) / this.queueSpeed);
    },
    timeLeftCurrent() {
      if (!this.isTimed) {
        return 0;
      }
      return Math.ceil((this.upgrade.timeNeeded(this.upgrade.level) - this.upgrade.timeProgress) / this.queueSpeed);
    },
    timePercentCurrent() {
      if (!this.isTimed || this.timeNeededCurrent <= 0) {
        return 0;
      }
      return 100 * (1 - (this.timeLeftCurrent / this.timeNeededCurrent));
    },
    subtype() {
      if (this.upgrade.subtype === null) {
        return null;
      } else {
        return `${ this.upgrade.feature }_${ this.upgrade.subtype }`;
      }
    },
    subtypeIcon() {
      if (this.subtype === null) {
        return null;
      } else {
        return this.$store.state.upgrade.subtypeIcon[this.subtype];
      }
    },
    prediction() {
      let arr = [];
      let lvl = this.upgrade.bought;
      for (let i = 0; i < 5; i++) {
        lvl++;
        if (this.upgrade.cap !== null && lvl >= this.upgrade.cap) {
          break;
        }
        arr.push({
          level: lvl + 1,
          price: this.upgrade.price(lvl),
          display: this.upgrade.effect.map(elem => {
            return {
              ...elem,
              before: elem.value(lvl),
              after: elem.value(lvl + 1)
            };
          }).filter(elem => {
            const isBool = ['unlock', 'keepUpgrade', 'villageCraft', 'farmSeed', 'findConsumable', 'galleryIdea', 'galleryShape'].includes(elem.type);
            return (isBool && !elem.before && elem.after) || (!isBool && elem.before !== elem.after);
          })
        });
      }
      return arr;
    },
    isInModuleQueue() {
      const queueKey = `${this.upgrade.feature}_${this.upgrade.type}`;
      const moduleQueue = this.$store.state.upgrade.moduleQueue[queueKey];
      return moduleQueue && moduleQueue.includes(this.name);
    },
    showUpgradeQueue() {
      return this.$store.state.system.settings.experiment.items.enableUpgradeQueue.value;
    },
    queueButtonColor() {
      if (!this.showUpgradeQueue) return '';

      const isUnlocked = this.upgrade.requirement(this.upgrade.level);
      if (!isUnlocked) {
        return 'queue-button-disabled';
      }

      return this.isInModuleQueue ? 'queue-button-active' : 'queue-button-default';
    },
    isMiningOrHordeUnlocked() {
      const isMiningOrHorde = (this.upgrade.feature === 'mining' && (this.upgrade.subfeature === 0 || this.upgrade.subfeature === 1)) ||
                              (this.upgrade.feature === 'horde' && (this.upgrade.subfeature === 0 || this.upgrade.subfeature === 1));

      if (!isMiningOrHorde) {
        return true;
      }

      const isUnlocked = this.upgrade.requirement(this.upgrade.level);
      return isUnlocked;
    },
    unlockRequirementText() {
      const isMiningOrHorde = (this.upgrade.feature === 'mining' && (this.upgrade.subfeature === 0 || this.upgrade.subfeature === 1)) ||
                              (this.upgrade.feature === 'horde' && (this.upgrade.subfeature === 0 || this.upgrade.subfeature === 1));

      if (!isMiningOrHorde || this.isMiningOrHordeUnlocked) {
        return null;
      }

      if (this.upgrade.feature === 'mining') {
        if (this.upgrade.requirementValue !== undefined && this.upgrade.requirementStat) {
          const statName = this.getStatDisplayName(this.upgrade.requirementStat);
          return `需要 ${statName} 达到 ${this.upgrade.requirementValue}`;
        } else {
          return '需要相关解锁';
        }
      }

      if (this.upgrade.feature === 'horde') {
        if (this.upgrade.requirementValue !== undefined && this.upgrade.requirementStat) {
          const statName = this.getStatDisplayName(this.upgrade.requirementStat);
          return `需要 ${statName} 达到 ${this.upgrade.requirementValue}`;
        } else {
          return '需要相关解锁';
        }
      }

      return '需要满足解锁条件';
    }
  },
  methods: {
    buy() {
      this.$store.commit('system/updateTutorialKey', {name: 'miningUpgrade', key: 'completed', value: true});
      if (this.$store.state.system.settings.confirm.items.gem.value && this.$store.getters['currency/contains'](this.price, 'gem')) {
        this.$store.commit('system/updateKey', {key: 'confirm', value: {
          type: 'upgrade',
          name: this.name,
          price: this.price,
          amount: 1,
        }});
      } else {
        this.$store.dispatch('upgrade/buy', {feature: this.upgrade.feature, name: this.splitName});
      }
    },
    buyMax() {
      this.$store.commit('system/updateTutorialKey', {name: 'miningUpgrade', key: 'completed', value: true});
      const maxAfford = this.$store.getters['upgrade/maxAfford'](this.upgrade.feature, this.splitName);
      if (maxAfford > 0) {
        const maxPrice = this.$store.getters['upgrade/priceList'](this.upgrade.feature, this.splitName, maxAfford);
        if (this.$store.state.system.settings.confirm.items.gem.value && this.$store.getters['currency/contains'](maxPrice, 'gem')) {
          this.$store.commit('system/updateKey', {key: 'confirm', value: {
            type: 'upgrade',
            name: this.name,
            price: maxPrice,
            amount: maxAfford,
          }});
        } else {
          this.$store.dispatch('upgrade/buyMax', {feature: this.upgrade.feature, name: this.splitName});
        }
      }
    },
    toggleCollapse() {
      this.$store.commit('upgrade/updateKey', {name: this.name, key: 'collapse', value: !this.upgrade.collapse});
    },
    toggleModuleQueue() {
      const isUnlocked = this.upgrade.requirement(this.upgrade.level);
      if (!isUnlocked) {
        this.$store.dispatch('system/addNotification', {
          color: 'error',
          timeout: 3000,
          message: {
            text: {
              zh: '无法将未解锁的升级项添加到队列',
              en: 'Cannot add unlocked upgrade to queue',
              de: 'Kann nicht freigeschaltetes Upgrade zur Warteschlange hinzufügen'
            }
          }
        });
        return;
      }

      this.$store.dispatch('upgrade/toggleModuleQueue', {name: this.name});
    },
    getStatDisplayName(statName) {
      const statNameMap = {
        'mining_maxDepth0': '矿1最大深度',
        'mining_maxDepth1': '矿2最大深度',
        'mining_depthDwellerCap0': '深度居民容量',
        'mining_depthDwellerCap1': '气体居民容量',
        'horde_maxZone': '最大区域',
        'horde_battlePassCurrentLevel': '战斗通行证等级'
      };

      return statNameMap[statName] || '特定条件';
    }
  }
}
</script>
