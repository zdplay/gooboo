<style scoped>
.icon-card-container {
  position: relative;
  width: 64px;
  height: 64px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.icon-card-tag {
  position: absolute;
  right: 2px;
  bottom: -2px;
  font-size: 14px;
}
.icon-card-tag-up {
  position: absolute;
  right: 2px;
  top: -2px;
  font-size: 14px;
}
.no-beacon {
  opacity: 0.1;
}
.hint-text :deep(.v-messages) {
  min-height: 16px;
  padding: 2px 4px;
  border-radius: 2px;
  background-color: rgba(255, 255, 255, 0.05);
}
</style>

<template>
  <div class="ma-1">
    <div class="d-flex justify-center align-center ma-1">
      <v-btn icon :disabled="depth <= 1 || isFrozen || isAutoMiningRunning" @click="depthMin"><v-icon>mdi-skip-backward</v-icon></v-btn>
      <v-btn icon :disabled="depth <= 1 || isFrozen || isAutoMiningRunning" @click="depthPrev10"><v-icon>mdi-step-backward-2</v-icon></v-btn>
      <v-btn icon :disabled="depth <= 1 || isFrozen || isAutoMiningRunning" @click="depthPrev"><v-icon>mdi-step-backward</v-icon></v-btn>
      <span class="mx-1">{{ depth }}m</span>
      <v-btn icon :disabled="isDeepest || isFrozen || isAutoMiningRunning" @click="depthNext"><v-icon>mdi-step-forward</v-icon></v-btn>
      <v-btn icon :disabled="isDeepest || isFrozen || isAutoMiningRunning" @click="depthNext10"><v-icon>mdi-step-forward-2</v-icon></v-btn>
      <v-btn icon :disabled="isDeepest || isFrozen || isAutoMiningRunning" @click="depthMax"><v-icon>mdi-skip-forward</v-icon></v-btn>
      
      <v-tooltip bottom v-if="canShowAutoMining">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            icon
            color="primary"
            class="ml-2"
            :class="{'amber lighten-1': isAutoMiningRunning}"
            :disabled="isFrozen"
            v-bind="attrs"
            v-on="on"
            @click="showAutoMiningPanel = !showAutoMiningPanel"
          >
            <v-icon>mdi-robot</v-icon>
          </v-btn>
        </template>
        <span>{{ isFrozen ? '冻结时无法使用自动挖掘' : '自动挖掘' }}</span>
      </v-tooltip>
    </div>
    <gb-tooltip :title-text="$vuetify.lang.t('$vuetify.mining.durability')">
      <template v-slot:activator="{ on, attrs }">
        <div class="ma-1">
          <v-progress-linear color="red" height="25" class="balloon-text-dynamic rounded" v-bind="attrs" v-on="on" :value="durabilityPercent">
            {{ $formatNum(durability) }} / {{ $formatNum(maxDurability) }}
          </v-progress-linear>
        </div>
      </template>
      <div>{{ $vuetify.lang.t('$vuetify.mining.durabilityDescription') }}</div>
      <div>{{ $vuetify.lang.t(`$vuetify.mining.durabilityBreaks.${ currentBreaks === 1 ? 's' : 'p' }`, $formatNum(currentBreaks)) }}</div>
    </gb-tooltip>
    <div class="d-flex flex-wrap">
      <gb-tooltip v-if="toughness > 0" :title-text="$vuetify.lang.t('$vuetify.mining.toughness')">
        <template v-slot:activator="{ on, attrs }">
          <div class="bg-tile-default elevation-2 rounded ma-1 pa-2 flex-grow-1" v-bind="attrs" v-on="on">
            <v-icon class="mr-2">mdi-shield</v-icon>
            <span :class="{'warning--text': currentDamage < toughness && currentDamage > 0, 'error--text': currentDamage <= 0}">{{ $formatNum(toughness) }}</span>
          </div>
        </template>
        <div>{{ $vuetify.lang.t('$vuetify.mining.toughnessDescription') }}</div>
        <alert-text v-if="currentDamage <= 0" type="error">{{ $vuetify.lang.t('$vuetify.mining.toughnessTooHigh') }}</alert-text>
        <alert-text v-else-if="currentDamage < toughness" type="warning">{{ $vuetify.lang.t('$vuetify.mining.toughnessHigh') }}</alert-text>
        <stat-breakdown :base="baseToughness" name="miningToughness"></stat-breakdown>
      </gb-tooltip>
      <gb-tooltip :title-text="$vuetify.lang.t('$vuetify.currency.mining_scrap.name')">
        <template v-slot:activator="{ on, attrs }">
          <div class="bg-tile-default elevation-2 rounded ma-1 pa-2 flex-grow-1" v-bind="attrs" v-on="on">
            <v-icon class="mr-2">{{ currency.mining_scrap.icon }}</v-icon>
            <span :class="{'warning--text': isDeepest}">
              <span v-if="scrapPerSecond === null">-</span>
              <span v-else>{{ $formatNum(scrapPerSecond) }}/s</span>
            </span>
          </div>
        </template>
        <div>{{ $vuetify.lang.t('$vuetify.mining.scrapDescription', $formatNum(scrapBreakMult)) }}</div>
        <alert-text v-if="isDeepest" type="warning">{{ $vuetify.lang.t('$vuetify.mining.scrapNotBroken') }}</alert-text>
        <div class="text-center">{{ $vuetify.lang.t('$vuetify.gooboo.gain') }}</div>
        <stat-breakdown :base="baseScrap" name="currencyMiningScrapGain"></stat-breakdown>
        <div>{{ $vuetify.lang.t('$vuetify.mining.gainSummary', $formatNum(scrap), $formatNum(scrapOnBreak), scrapBreakMult, $formatNum(scrapPerSecond !== null ? scrapPerSecond : 0)) }}</div>
      </gb-tooltip>
    </div>
    <div class="d-flex flex-wrap">
      <template v-if="subfeature === 0">
        <gb-tooltip v-for="(item, key, index) in ore" :key="`loot-${ index }`" :title-text="$vuetify.lang.t(`$vuetify.currency.mining_${key}.name`)">
          <template v-slot:activator="{ on, attrs }">
            <v-chip label class="balloon-text-dynamic ma-1" :class="$vuetify.theme.dark ? 'darken-2' : 'lighten-2'" :color="currency['mining_' + key].color" v-bind="attrs" v-on="on">
              <v-icon class="mr-2">{{ currency['mining_' + key].icon }}</v-icon>
              <span :class="{'warning--text': isDeepest}">
                <span v-if="oreMultPerSecond === null">-</span>
                <span v-else>{{ $formatNum(item.amount * oreMultPerSecond, true) }}/s</span>
              </span>
            </v-chip>
          </template>
          <div v-if="maxTotalDepth <= item.maxDepth">{{ $vuetify.lang.t(`$vuetify.mining.oreDescription.short`, item.minDepth) }}</div>
          <div v-else>{{ $vuetify.lang.t(`$vuetify.mining.oreDescription.long`, item.minDepth, item.maxDepth, item.modulo) }}</div>
          <alert-text v-if="isDeepest" type="warning">{{ $vuetify.lang.t('$vuetify.mining.oreNotBroken') }}</alert-text>
          <div class="text-center">{{ $vuetify.lang.t('$vuetify.gooboo.gain') }}</div>
          <stat-breakdown :base="item.baseAmount" :name="gainMultName('mining', key)"></stat-breakdown>
          <div>{{ $vuetify.lang.t('$vuetify.mining.gainSummary', $formatNum(item.amount, true), $formatNum(item.amount * oreBreakMult, true), oreBreakMult, $formatNum(item.amount * (oreMultPerSecond !== null ? oreMultPerSecond : 0), true)) }}</div>
        </gb-tooltip>
        <gb-tooltip v-for="(item, key, index) in rareDrops" :key="`loot-${ Object.keys(ore).length + index }`" :title-text="$vuetify.lang.t(`$vuetify.currency.mining_${key}.name`)">
          <template v-slot:activator="{ on, attrs }">
            <v-chip label class="balloon-text-dynamic ma-1" :class="$vuetify.theme.dark ? 'darken-2' : 'lighten-2'" :color="currency['mining_' + key].color" v-bind="attrs" v-on="on">
              <v-icon class="mr-2">{{ currency['mining_' + key].icon }}</v-icon>
              <span :class="{'warning--text': isDeepest && rareEarthType[key] !== 'hit'}">
                <span v-if="rareEarthType[key] === 'hit'">{{ $formatNum(item, true) }}</span>
                <span v-else-if="rareEarthMultPerSecond === null">-</span>
                <span v-else-if="rareEarthType[key] === 'break'">{{ $formatNum(item, true) }}</span>
                <span v-else>{{ $formatNum(item * rareEarthMultPerSecond, true) }}/s</span>
              </span>
            </v-chip>
          </template>
          <div>{{ $vuetify.lang.t(`$vuetify.mining.rareEarthDescription.${ key }`, rareEarthDepth[key]) }}</div>
          <alert-text v-if="isDeepest && rareEarthType[key] !== 'hit'" type="warning">{{ $vuetify.lang.t('$vuetify.mining.rareEarthNotBroken') }}</alert-text>
          <div class="text-center">{{ $vuetify.lang.t('$vuetify.gooboo.gain') }}</div>
          <stat-breakdown :base="rareDropBase(key)" :multArray="key === 'granite' ? graniteMult : []" :name="gainMultName('mining', key)"></stat-breakdown>
          <div v-if="rareEarthType[key] === 'hit'">{{ $vuetify.lang.t('$vuetify.mining.gainSummaryHit', $formatNum(item, true)) }}</div>
          <div v-else-if="rareEarthType[key] === 'break'">{{ $vuetify.lang.t('$vuetify.mining.gainSummaryBreak', $formatNum(item, true)) }}</div>
          <div v-else>{{ $vuetify.lang.t('$vuetify.mining.gainSummary', $formatNum(item, true), $formatNum(item * rareEarthBreakMult, true), rareEarthBreakMult, $formatNum(item * (rareEarthMultPerSecond !== null ? rareEarthMultPerSecond : 0), true)) }}</div>
          <alert-text v-if="key === 'coal' || key === 'niter'" type="info">{{ $vuetify.lang.t('$vuetify.mining.rareEarthNotAffected') }}</alert-text>
        </gb-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn 
              icon 
              color="primary" 
              class="ma-1" 
              v-bind="attrs" 
              v-on="on"
              @click="showMiningOverview = true"
            >
              <v-icon>mdi-chart-box-outline</v-icon>
            </v-btn>
          </template>
          <span>矿层总览</span>
        </v-tooltip>
        <mining-overview ref="miningOverview" v-model="showMiningOverview"></mining-overview>
      </template>
      <template v-else-if="subfeature === 1">
        <v-chip v-if="smoke > 0" label class="balloon-text-dynamic ma-1" :class="$vuetify.theme.dark ? 'darken-2' : 'lighten-2'" :color="currency.mining_smoke.color">
          <v-icon class="mr-2">{{ currency.mining_smoke.icon }}</v-icon>
          <span>{{ $formatNum(smoke, true) }}</span>
        </v-chip>
        <template v-if="isDeepest">
          <gb-tooltip v-for="(amount, gas) in gasses" :key="gas" :title-text="$vuetify.lang.t(`$vuetify.currency.mining_${ gas }.name`)">
            <template v-slot:activator="{ on, attrs }">
              <v-chip label class="ma-1" :class="$vuetify.theme.dark ? 'darken-2' : 'lighten-2'" :color="currency[`mining_${gas}`].color" v-bind="attrs" v-on="on">
                <v-icon class="mr-2">{{ currency[`mining_${gas}`].icon }}</v-icon>
                <span>{{ $formatNum(amount) }}</span>
              </v-chip>
            </template>
            <div>
              <span>{{ $vuetify.lang.t(`$vuetify.mining.gasGain.0`) }}</span>
              <span>{{ $formatNum(mult(`currencyMining${ gas.charAt(0).toUpperCase() + gas.slice(1) }Gain`) * 100, true) }}</span>
              <span>{{ $vuetify.lang.t(`$vuetify.mining.gasGain.1`) }}</span>
              <currency-icon :name="`mining_${gas}`"></currency-icon>
              <span>{{ $vuetify.lang.t(`$vuetify.mining.gasGain.2`) }}</span>
              <span>{{ $formatNum(gasLimit(gas)) }}&nbsp;</span>
              <currency-icon :name="`mining_${gas}`"></currency-icon>
              <span>{{ $vuetify.lang.t(`$vuetify.mining.gasGain.3`) }}</span>
            </div>
          </gb-tooltip>
        </template>
      </template>
    </div>
    <alert-text v-if="showScrapHint" class="ma-1" type="info">{{ $vuetify.lang.t('$vuetify.mining.scrapGainHint') }}</alert-text>
    
    <!-- 全新自动挖掘界面 -->
    <v-dialog v-model="showAutoMiningPanel" v-if="canShowAutoMining" max-width="800" @click:outside="closeAutoMiningPanel">
      <v-card class="default-card auto-mining-dialog">
        <!-- 头部 -->
        <v-card-title>
          <v-icon class="mr-3">mdi-robot</v-icon>
          <span class="text-h5">智能自动挖掘</span>
          <v-spacer></v-spacer>
          <v-btn icon @click="closeAutoMiningPanel">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>



        <v-card-text class="pa-6">
          <!-- 警告提示 -->
          <v-alert v-if="maxDepth < 10" type="warning" outlined class="mb-4">
            <v-icon slot="prepend">mdi-alert</v-icon>
            建议达到第10层后再使用自动挖掘功能
          </v-alert>

          <!-- 主要配置区域 -->
          <v-container fluid class="pa-0" v-else>
            <!-- 深度配置 (运行时隐藏) -->
            <v-row v-if="!isAutoMiningRunning">
              <v-col cols="12" md="6">
                <v-card outlined class="depth-config">
                  <v-card-subtitle class="pb-2">
                    <v-icon small class="mr-2" color="primary">mdi-map-marker-distance</v-icon>
                    深度范围
                  </v-card-subtitle>
                  <v-card-text class="pt-0">
                    <v-text-field
                      v-model.number="autoMiningStartDepth"
                      type="number"
                      min="1"
                      :max="maxDepth"
                      label="起始深度"
                      outlined
                      dense
                      :disabled="isAutoMiningRunning || autoMiningStoppingInProgress"
                      prepend-inner-icon="mdi-flag-checkered"
                    ></v-text-field>
                    <v-text-field
                      v-model.number="autoMiningTargetDepth"
                      type="number"
                      :min="autoMiningStartDepth"
                      :max="maxDepth"
                      label="目标深度"
                      outlined
                      dense
                      :disabled="isAutoMiningRunning || autoMiningStoppingInProgress"
                      prepend-inner-icon="mdi-flag"
                    ></v-text-field>
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="12" md="6">
                <v-card outlined class="breaks-config">
                  <v-card-subtitle class="pb-2">
                    <v-icon small class="mr-2" color="orange">mdi-hammer</v-icon>
                    挖破配置
                  </v-card-subtitle>
                  <v-card-text class="pt-0">
                    <v-btn-toggle
                      v-model="autoMiningBreaksPerDepth"
                      mandatory
                      :disabled="isAutoMiningRunning || autoMiningStoppingInProgress"
                      class="d-flex flex-column"
                    >
                      <v-btn :value="1" small class="mb-1">1次</v-btn>
                      <v-btn :value="10" small class="mb-1">10次</v-btn>
                      <v-btn :value="100" small class="mb-1">100次</v-btn>
                      <v-btn :value="1000" small>1000次</v-btn>
                    </v-btn-toggle>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <!-- 预算估算 (始终显示) -->
            <v-card outlined class="mt-4">
              <v-card-subtitle class="pb-2">
                <v-icon small class="mr-2" color="success">mdi-calculator</v-icon>
                预算估算
              </v-card-subtitle>
              <v-card-text class="pt-0">
                <div class="d-flex" style="gap: 8px;">
                  <div class="flex-grow-1 text-center">
                    <v-avatar size="36" color="primary" class="mb-1">
                      <v-icon color="white" size="20">mdi-clock</v-icon>
                    </v-avatar>
                    <div class="caption grey--text">预计用时</div>
                    <div class="body-2 primary--text font-weight-bold">{{ $formatTime(estimatedTime) }}</div>
                  </div>
                  <div class="flex-grow-1 text-center">
                    <div v-if="autoMiningTargetDepth >= MINING_NITER_DEPTH && estimatedNiter > 0">
                      <v-avatar size="36" color="success" class="mb-1">
                        <v-icon color="white" size="20">mdi-diamond</v-icon>
                      </v-avatar>
                      <div class="caption grey--text">预计硝石</div>
                      <div class="body-2 success--text font-weight-bold">{{ $formatNum(estimatedNiter) }}</div>
                    </div>
                    <div v-else>
                      <v-avatar size="36" color="grey" class="mb-1">
                        <v-icon color="white" size="20">mdi-diamond-outline</v-icon>
                      </v-avatar>
                      <div class="caption grey--text">预计硝石</div>
                      <div class="body-2 grey--text">无硝石收益</div>
                    </div>
                  </div>
                </div>
              </v-card-text>
            </v-card>

            <!-- 跳转配置 (运行时隐藏) -->
            <v-card v-if="!isAutoMiningRunning" outlined class="mt-4">
              <v-card-subtitle class="pb-2">
                <v-icon small class="mr-2" color="info">mdi-map-marker</v-icon>
                完成跳转
              </v-card-subtitle>
              <v-card-text class="pt-0">
                <v-text-field
                  v-model.number="autoMiningJumpToDepth"
                  type="number"
                  min="1"
                  :max="maxDepth"
                  label="跳转层数"
                  outlined
                  dense
                  :disabled="isAutoMiningRunning || autoMiningStoppingInProgress"
                  prepend-inner-icon="mdi-target"
                ></v-text-field>
              </v-card-text>
            </v-card>

            <!-- 运行状态详情 (始终显示) -->
            <v-card v-if="isAutoMiningRunning" outlined class="mt-4 status-detail">
              <v-card-subtitle class="pb-2">
                <v-icon small class="mr-2" color="success">mdi-information</v-icon>
                运行状况
              </v-card-subtitle>
              <v-card-text class="pt-0">
                <!-- 深度和跳转信息 -->
                <v-row class="mb-3">
                  <v-col cols="12" md="4">
                    <div class="d-flex align-center mb-2">
                      <v-icon small class="mr-2" color="primary">mdi-flag-checkered</v-icon>
                      <span>当前深度: <strong class="primary--text">{{ autoMiningStatus.currentDepth }}m</strong></span>
                    </div>
                  </v-col>
                  <v-col cols="12" md="4">
                    <div class="d-flex align-center mb-2">
                      <v-icon small class="mr-2" color="orange">mdi-flag</v-icon>
                      <span>目标深度: <strong class="orange--text">{{ autoMiningTargetDepth }}m</strong></span>
                    </div>
                  </v-col>
                  <v-col cols="12" md="4">
                    <div class="d-flex align-center mb-2">
                      <v-icon small class="mr-2" color="info">mdi-target</v-icon>
                      <span>完成跳转: <strong class="info--text">{{ autoMiningJumpToDepth }}m</strong></span>
                    </div>
                  </v-col>
                </v-row>

                <v-divider class="mb-3"></v-divider>

                <!-- 运行状态信息 -->
                <v-row>
                  <v-col cols="12" md="6">
                    <div class="d-flex align-center mb-2">
                      <v-icon small class="mr-2">mdi-progress-check</v-icon>
                      <span>当前进度: <strong>{{ autoMiningStatus.breaksThisSession }}/{{ autoMiningBreaksPerDepth }}</strong></span>
                    </div>
                    <div class="d-flex align-center mb-2">
                      <v-icon small class="mr-2">mdi-timer</v-icon>
                      <span>还需: <strong>{{ autoMiningStatus.breaksNeeded }} 次</strong></span>
                    </div>
                  </v-col>
                  <v-col cols="12" md="6">
                    <div class="d-flex align-center mb-2">
                      <v-icon small class="mr-2">mdi-check-all</v-icon>
                      <span>已完成: <strong>{{ autoMiningStatus.completedDepths.length }} 层</strong></span>
                    </div>
                    <div class="d-flex align-center mb-2">
                      <v-icon small class="mr-2">mdi-hammer</v-icon>
                      <span>每层目标: <strong>{{ autoMiningBreaksPerDepth }} 次</strong></span>
                    </div>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-container>
        </v-card-text>

        <!-- 操作按钮 -->
        <v-card-actions class="pa-6 pt-0">
          <v-spacer></v-spacer>
          <v-btn
            v-if="!isAutoMiningRunning"
            large
            color="primary"
            :disabled="!canStartAutoMining || autoMiningStoppingInProgress"
            @click="startAutoMining"
          >
            <v-icon left>mdi-play</v-icon>
            开始挖掘
          </v-btn>
          <!-- 运行时只显示停止按钮 -->
          <v-btn
            v-if="isAutoMiningRunning"
            large
            color="error"
            :loading="autoMiningStoppingInProgress"
            @click="stopAutoMining"
          >
            <v-icon left>mdi-stop</v-icon>
            停止挖掘
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
    <div class="d-flex justify-space-around mt-8 mt-lg-12">
      <gb-tooltip v-if="unlock.miningPickaxeCrafting.see" :min-width="0">
        <template v-slot:activator="{ on, attrs }">
          <div class="icon-card-container bg-tile-default elevation-2 rounded" v-bind="attrs" v-on="on">
            <v-icon size="36">mdi-pickaxe</v-icon>
            <span class="icon-card-tag">{{ $formatNum(pickaxePower) }}</span>
          </div>
        </template>
        <div class="mt-0">{{ $vuetify.lang.t('$vuetify.mining.pickaxePower') }}</div>
      </gb-tooltip>
      <gb-tooltip :title-text="$vuetify.lang.t('$vuetify.mining.damage')">
        <template v-slot:activator="{ on, attrs }">
          <div class="icon-card-container bg-tile-default elevation-2 rounded" v-bind="attrs" v-on="on">
            <v-icon size="36">mdi-bomb</v-icon>
            <span class="icon-card-tag">{{ $formatNum(damage) }}</span>
            <span class="icon-card-tag-up">{{ $formatNum(currentDamage) }}</span>
          </div>
        </template>
        <stat-breakdown :base="pickaxePower" name="miningDamage"></stat-breakdown>
      </gb-tooltip>
      <gb-tooltip :min-width="0">
        <template v-slot:activator="{ on, attrs }">
          <div class="icon-card-container bg-tile-default elevation-2 rounded" v-bind="attrs" v-on="on">
            <v-icon size="36">mdi-timer-sand</v-icon>
            <v-icon class="icon-card-tag" :color="$vuetify.theme.dark ? 'white' : 'black'" v-if="hitsNeeded === Infinity">mdi-infinity</v-icon>
            <span class="icon-card-tag" v-else>{{ $formatTime(hitsNeeded) }}</span>
            <v-icon class="icon-card-tag-up" :color="$vuetify.theme.dark ? 'white' : 'black'" v-if="currentHitsNeeded === Infinity">mdi-infinity</v-icon>
            <span class="icon-card-tag-up" v-else>{{ $formatTime(currentHitsNeeded) }}</span>
          </div>
        </template>
        <div class="mt-0">{{ $vuetify.lang.t('$vuetify.mining.timeToBreak') }}</div>
      </gb-tooltip>
      <gb-tooltip v-if="canSeeBeacons" :title-text="$vuetify.lang.t(`$vuetify.mining.beacon.${ currentDepthBeacon ? currentDepthBeacon : 'noBeacon' }`)" :min-width="0">
        <template v-slot:activator="{ on, attrs }">
          <div class="icon-card-container bg-tile-default elevation-2 rounded" style="cursor: pointer;" v-bind="attrs" v-on="on" @click="showBeacons = !showBeacons">
            <v-icon :class="{'no-beacon': currentDepthBeacon === null}" :color="currentDepthBeacon ? beacon[currentDepthBeacon].color : undefined" size="72">mdi-spotlight</v-icon>
          </div>
        </template>
        <div v-if="!currentDepthBeacon" class="mt-0">{{ $vuetify.lang.t('$vuetify.mining.beacon.clickToPlace') }}</div>
        <display-row class="mt-0" v-for="(effect, key) in beaconEffect" :key="`effect-beacon-${ key }`" :type="effect.type" :name="effect.name" :after="effect.value"></display-row>
      </gb-tooltip>
    </div>
    <div v-if="enhancementLevel > 0" class="d-flex justify-center mt-8 mt-lg-12">
      <v-icon class="mr-2">mdi-package-up</v-icon>
      <div>
        <gb-tooltip v-for="(enhancement, name) in enhancements" :key="`enhancement-${ name }`" :title-text="$vuetify.lang.t(`$vuetify.mining.enhancement.${ name }`)">
          <template v-slot:activator="{ on, attrs }">
            <div :class="[`${ currency['mining_' + name].color }--text`, {'text--lighten-2': $vuetify.theme.dark, 'text--darken-2': !$vuetify.theme.dark}]" v-bind="attrs" v-on="on">{{ $vuetify.lang.t(`$vuetify.mining.enhancement.${ name }`) }} {{ $formatRoman(enhancement.level) }}</div>
          </template>
          <display-row class="mt-0" v-for="(effect, key) in enhancement.effect" :key="`effect-${ name }-${ key }`" :type="effect.type" :name="effect.name" :after="effect.value"></display-row>
        </gb-tooltip>
      </div>
    </div>
    <beacon-sector v-if="showBeacons" class="ma-2"></beacon-sector>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import { MINING_COAL_DEPTH, MINING_DEEPROCK_DEPTH, MINING_GLOWSHARD_DEPTH, MINING_GRANITE_DEPTH, MINING_NITER_DEPTH, MINING_OBSIDIAN_DEPTH, MINING_ORE_BREAK, MINING_RARE_DROP_BREAK, MINING_SALT_DEPTH, MINING_SCRAP_BREAK, MINING_SULFUR_DEPTH } from '../../../js/constants';
import CurrencyIcon from '../../render/CurrencyIcon.vue';
import StatBreakdown from '../../render/StatBreakdown.vue';
import AlertText from '../render/AlertText.vue';
import DisplayRow from '../upgrade/DisplayRow.vue';
import BeaconSector from './BeaconSector.vue';
import MiningOverview from './MiningOverview.vue'; // 导入矿层总览组件

export default {
  components: { 
    StatBreakdown, 
    CurrencyIcon, 
    AlertText, 
    DisplayRow, 
    BeaconSector,
    MiningOverview // 注册组件
  },
  data: () => ({
    rareEarthType: {
      granite: 'both',
      salt: 'both',
      coal: 'break',
      sulfur: 'hit',
      niter: 'break',
      obsidian: 'both',
      deeprock: 'both',
      glowshard: 'hit',
    },
    rareEarthDepth: {
      granite: MINING_GRANITE_DEPTH,
      salt: MINING_SALT_DEPTH,
      coal: MINING_COAL_DEPTH,
      sulfur: MINING_SULFUR_DEPTH,
      niter: MINING_NITER_DEPTH,
      obsidian: MINING_OBSIDIAN_DEPTH,
      deeprock: MINING_DEEPROCK_DEPTH,
      glowshard: MINING_GLOWSHARD_DEPTH,
    },
    showBeacons: false,
    showAutoMiningPanel: false,
    autoMiningStatusTimer: null,
    autoMiningStartDepth: 1,
    autoMiningTargetDepth: 50,
    autoMiningBreaksPerDepth: 100,
    autoMiningJumpToDepth: 1,
    autoMiningStoppingInProgress: false,
    showMiningOverview: false
  }),
  computed: {
    ...mapState({
      depth: state => state.mining.depth,
      pickaxePower: state => state.mining.pickaxePower,
      durability: state => state.mining.durability,
      currency: state => state.currency,
      ingredientList: state => state.mining.ingredientList,
      unlock: state => state.unlock,
      subfeature: state => state.system.features.mining.currentSubfeature,
      beacon: state => state.mining.beacon,
      isFrozen: (state) => state.system.settings.experiment.items.doubleDoorFridge.value ? (state.cryolab.mining.active || state.cryolab.mining.freeze) : state.cryolab.mining.active,
      autoMining: state => state.mining.autoMining
    }),
    ...mapGetters({
      damage: 'mining/damage',
      maxDurability: 'mining/currentDurability',
      toughness: 'mining/currentToughness',
      baseToughness: 'mining/currentBaseToughness',
      scrap: 'mining/currentScrap',
      baseScrap: 'mining/currentBaseScrap',
      ore: 'mining/currentOre',
      smoke: 'mining/currentSmoke',
      gasses: 'mining/currentGas',
      gasLimit: 'mining/currentGasLimit',
      hitsNeeded: 'mining/hitsNeeded',
      currentHitsNeeded: 'mining/currentHitsNeeded',
      currentDamage: 'mining/currentDamage',
      mult: 'mult/get',
      gainMultName: 'currency/gainMultName',
      currentBreaks: 'mining/currentBreaks',
      rareDrops: 'mining/rareDrops',
      rareDropBase: 'mining/rareDropBase',
      enhancementLevel: 'mining/enhancementLevel',
      currentDepthBeacon: 'mining/currentDepthBeacon',
    }),
    MINING_NITER_DEPTH() {
      return MINING_NITER_DEPTH;
    },
    maxDepth() {
      return this.$store.state.stat[`mining_maxDepth${this.subfeature}`].value;
    },
    maxTotalDepth() {
      return this.$store.state.stat[`mining_maxDepth${this.subfeature}`].total;
    },
    isDeepest() {
      return this.$store.state.mining.depth >= this.maxDepth;
    },
    durabilityPercent() {
      return 100 * this.durability / this.maxDurability;
    },
    scrapBreakMult() {
      return MINING_SCRAP_BREAK + 1;
    },
    oreBreakMult() {
      return MINING_ORE_BREAK + 1;
    },
    rareEarthBreakMult() {
      return MINING_RARE_DROP_BREAK + 1;
    },
    scrapOnBreak() {
      return this.scrap * this.scrapBreakMult;
    },
    scrapPerSecond() {
      if (this.hitsNeeded === Infinity) {
        return null;
      }
      return ((this.hitsNeeded - 1) * this.scrap + this.scrapOnBreak) / this.hitsNeeded;
    },
    oreMultPerSecond() {
      if (this.hitsNeeded === Infinity) {
        return null;
      }
      return (this.hitsNeeded + MINING_ORE_BREAK) / this.hitsNeeded;
    },
    rareEarthMultPerSecond() {
      if (this.hitsNeeded === Infinity) {
        return null;
      }
      return (this.hitsNeeded + MINING_RARE_DROP_BREAK) / this.hitsNeeded;
    },
    graniteMult() {
      const mult = this.$store.getters['mining/graniteBreaksMult'];
      return mult > 1 ? [{name: 'graniteBreaksMult', value: mult}] : [];
    },
    enhancements() {
      let obj = {};
      for (const [key, elem] of Object.entries(this.$store.state.mining.enhancement)) {
        if (elem.level > 0) {
          obj[key] = {...elem, effect: elem.effect.map(eff => {
            return {...eff, value: eff.value(elem.level)};
          })};
        }
      }
      return obj;
    },
    showScrapHint() {
      const maxDepth = this.$store.state.stat.mining_maxDepth0.total;
      return maxDepth >= 5 && maxDepth <= 10;
    },
    canSeeBeacons() {
      return this.$store.getters['mult/get']('miningBeaconPiercing') >= 1;
    },
    beaconEffect() {
      if (this.currentDepthBeacon) {
        const beacon = this.beacon[this.currentDepthBeacon];
        return beacon.effect.map(effect => {
          return {...effect, value: effect.value(beacon.level)};
        });
      } else {
        return [];
      }
    },
    canShowAutoMining() {
      return true;
    },
    isAutoMiningRunning() {
      return this.autoMining && this.autoMining.isRunning;
    },
    autoMiningStatus() {
      if (!this.autoMining) {
        return {
          isRunning: false,
          currentState: 'idle',
          currentDepth: this.depth,
          breaksThisSession: this.currentBreaks,
          breaksNeeded: 0,
          completedDepths: [],
          progress: 0
        };
      }

      const breaksNeeded = Math.max(0,
        (this.autoMining.config.breaksPerDepth || 10) - this.currentBreaks);

      const progress = Math.min(100, Math.round((this.currentBreaks /
        (this.autoMining.config.breaksPerDepth || 10)) * 100));

      return {
        isRunning: this.autoMining.isRunning,
        currentState: this.autoMining.currentState || 'mining',
        config: this.autoMining.config,
        currentDepth: this.autoMining.currentDepth || this.depth,
        maxDepth: this.maxDepth,
        currentBreaks: this.currentBreaks,
        breaksThisSession: this.currentBreaks,
        breaksNeeded: this.autoMining.remainingBreaks || breaksNeeded,
        completedDepths: this.autoMining.completedDepths || [],
        progress: progress
      };
    },
    canStartAutoMining() {
      return !this.isFrozen && this.autoMiningStartDepth <= this.maxDepth && this.autoMiningTargetDepth <= this.maxDepth && this.autoMiningStartDepth <= this.autoMiningTargetDepth;
    },
    // 计算默认目标深度（深度降序击破时间为1的第一个）
    calculateDefaultTargetDepth() {
      for (let depth = this.maxDepth; depth >= this.autoMiningStartDepth; depth--) {
        const hitsNeeded = this.$store.getters['mining/depthHitsNeeded'](depth);
        if (hitsNeeded <= 1) {
          return depth;
        }
      }
      return Math.min(this.maxDepth, this.autoMiningStartDepth + 10); // 默认值
    },

    // 预计用时和硝石计算（过滤已符合条件的层数）
    estimatedTime() {
      let neededTime = 0;
      for (let i = 0; i < this.maxDepth - 1; i++) {
        const breaks = this.$store.state.mining.breaks[i] || 0;
        const time = this.$store.getters['mining/depthHitsNeeded'](i + 1);
        if (i >= this.autoMiningStartDepth - 1 && i < this.autoMiningTargetDepth) {
          // 只计算还需要挖掘的次数，如果已经达到或超过目标则跳过
          if (breaks < this.autoMiningBreaksPerDepth) {
            neededTime += (this.autoMiningBreaksPerDepth - breaks) * time;
          }
        }
      }
      return neededTime;
    },
    estimatedNiter() {
      let niter = 0;
      for (let i = 0; i < this.maxDepth - 1; i++) {
        const depth = i + 1;
        const currentBreaks = this.$store.state.mining.breaks[i] || 0;

        // 只计算130层以上且在范围内的层数
        if (depth >= MINING_NITER_DEPTH &&
            i >= this.autoMiningStartDepth - 1 &&
            i < this.autoMiningTargetDepth) {
          // 只计算还需要挖掘的层数，过滤掉已经符合条件的
          if (currentBreaks < this.autoMiningBreaksPerDepth) {
            // 计算从当前挖掘次数到目标次数之间能获得多少次硝石
            const niterCount = this.calculateNiterGains(currentBreaks, this.autoMiningBreaksPerDepth);
            if (niterCount > 0) {
              const base = 100 + (depth - MINING_NITER_DEPTH) * 5;
              const final = this.$store.getters['mult/get']('currencyMiningNiterGain', base);
              niter += niterCount * final;
            }
          }
        }
      }
      return Math.floor(niter);
    },
  },
  created() {
    this.autoMiningStatusTimer = setInterval(() => {
      this.$forceUpdate();
    }, 500);

    // 初始化自动挖掘设置
    this.initializeAutoMiningSettings();
  },
  beforeDestroy() {
    if (this.autoMiningStatusTimer) {
      clearInterval(this.autoMiningStatusTimer);
      this.autoMiningStatusTimer = null;
    }
  },
  watch: {
    autoMining: {
      handler(newVal) {
        if (newVal && newVal.config) {
          this.autoMiningStartDepth = newVal.config.startDepth;
          this.autoMiningTargetDepth = newVal.config.targetDepth;
          this.autoMiningBreaksPerDepth = newVal.config.breaksPerDepth;
        }
      },
      deep: true
    },
    maxDepth: {
      handler() {
        this.initializeAutoMiningSettings();
      }
    },
    showAutoMiningPanel: {
      handler(newVal) {
        if (newVal && !this.isAutoMiningRunning) {
          // 面板打开且没有运行任务时，重新计算设置
          this.calculateOptimalSettings();
        }
      }
    },
    isFrozen: {
      handler(newVal) {
        if (newVal && this.isAutoMiningRunning) {
          // 如果挖矿被冻结且自动挖矿正在运行，则停止自动挖矿
          this.stopAutoMining();
        }
      }
    }
  },
  methods: {
    resetDurability() {
      this.$store.commit('mining/updateKey', {key: 'durability', value: this.$store.getters['mining/currentDurability']});
      this.$store.dispatch('mining/applyBeaconEffects');
    },
    depthMin() {
      this.$store.commit('mining/updateKey', {key: 'depth', value: 1});
      this.resetDurability();
    },
    depthPrev() {
      if (this.depth > 1) {
        this.$store.commit('mining/updateKey', {key: 'depth', value: this.depth - 1});
        this.resetDurability();
      }
    },
    depthPrev10() {
      if (this.depth > 1) {
        this.$store.commit('mining/updateKey', {key: 'depth', value: Math.max(this.depth - 10, 1)});
        this.resetDurability();
      }
    },
    depthNext() {
      if (this.depth < this.maxDepth) {
        this.$store.commit('mining/updateKey', {key: 'depth', value: this.depth + 1});
        this.$store.commit('system/updateTutorialKey', {name: 'miningDepth', key: 'completed', value: true});
        this.resetDurability();
      }
    },
    depthNext10() {
      if (this.depth < this.maxDepth) {
        this.$store.commit('mining/updateKey', {key: 'depth', value: Math.min(this.depth + 10, this.maxDepth)});
        this.$store.commit('system/updateTutorialKey', {name: 'miningDepth', key: 'completed', value: true});
        this.resetDurability();
      }
    },
    depthMax() {
      this.$store.commit('mining/updateKey', {key: 'depth', value: this.maxDepth});
      this.$store.commit('system/updateTutorialKey', {name: 'miningDepth', key: 'completed', value: true});
      this.resetDurability();
    },
    initializeAutoMiningSettings() {
      if (this.autoMining && this.autoMining.config) {
        // 如果已经开启任务，显示任务开始时设定的数据
        this.autoMiningStartDepth = this.autoMining.config.startDepth;
        this.autoMiningTargetDepth = this.autoMining.config.targetDepth;
        this.autoMiningBreaksPerDepth = this.autoMining.config.breaksPerDepth;
        this.autoMiningJumpToDepth = this.autoMining.config.jumpToDepthAfterComplete || this.autoMining.config.targetDepth;
      } else {
        // 如果没有开启任务，每次点开功能则计算一次各个框的数据
        this.calculateOptimalSettings();
      }
    },
    calculateOptimalSettings() {
      // 智能起始深度逻辑
      if (this.maxDepth < 130) {
        this.autoMiningStartDepth = 1;
      } else {
        this.autoMiningStartDepth = 130; // 恢复130层逻辑
      }

      // 计算默认目标深度
      this.autoMiningTargetDepth = this.calculateDefaultTargetDepth;

      // 默认跳转到当前层
      this.autoMiningJumpToDepth = this.depth;
    },

    // 精确计算从startBreaks到endBreaks之间能获得多少次硝石
    calculateNiterGains(startBreaks, endBreaks) {
      if (startBreaks >= endBreaks) {
        return 0;
      }

      let niterCount = 0;

      // 硝石获得条件：当 log10(breaks + 1) 为整数时获得硝石
      // 即当 breaks + 1 = 10^n 时，也就是 breaks = 10^n - 1

      // 找到起始点之后的第一个硝石获得点
      let currentPower = Math.floor(Math.log10(startBreaks + 1)) + 1;

      // 设置合理上限，防止无限循环
      const maxPower = 10;

      while (currentPower <= maxPower) {
        const niterBreaks = Math.pow(10, currentPower) - 1;

        // 如果这个硝石获得点超过了目标挖掘次数，停止计算
        if (niterBreaks >= endBreaks) {
          break;
        }

        // 如果这个硝石获得点在我们的范围内，计数
        if (niterBreaks > startBreaks) {
          niterCount++;
        }

        currentPower++;
      }

      return niterCount;
    },
    startAutoMining() {
      if (!this.canStartAutoMining || this.isAutoMiningRunning || this.autoMiningStoppingInProgress) {
        return;
      }

      const startDepth = parseInt(this.autoMiningStartDepth) || 1;
      const targetDepth = parseInt(this.autoMiningTargetDepth) || 50;
      const breaksPerDepth = parseInt(this.autoMiningBreaksPerDepth) || 10;
      const jumpToDepth = parseInt(this.autoMiningJumpToDepth) || this.depth;

      this.autoMiningStartDepth = startDepth;
      this.autoMiningTargetDepth = targetDepth;
      this.autoMiningBreaksPerDepth = breaksPerDepth;
      this.autoMiningJumpToDepth = jumpToDepth;

      const config = {
        startDepth: startDepth,
        targetDepth: targetDepth,
        breaksPerDepth: breaksPerDepth,
        jumpToDepthAfterComplete: jumpToDepth
      };

      this.$store.dispatch('mining/startAutoMining', config);
    },
    stopAutoMining() {
      if (!this.isAutoMiningRunning) {
        return;
      }

      this.autoMiningStoppingInProgress = true;

      // 执行跳转逻辑（如果启用）
      if (this.autoMining && this.autoMining.config && this.autoMining.config.jumpToDepthAfterComplete) {
        const jumpToDepth = this.autoMining.config.jumpToDepthAfterComplete;
        this.$store.commit('mining/updateKey', { key: 'depth', value: jumpToDepth });
        this.$store.commit('mining/updateKey', { key: 'durability', value: this.$store.getters['mining/currentDurability'] });
      }

      this.$store.commit('mining/updateKey', {key: 'autoMining', value: null});

      setTimeout(() => {
        this.autoMiningStoppingInProgress = false;
      }, 500);
    },
    closeAutoMiningPanel() {
      this.showAutoMiningPanel = false;
    }
  }
}
</script>

<style scoped>
.auto-mining-dialog {
  border-radius: 16px !important;
  overflow: hidden;
}

.v-btn-toggle .v-btn {
  width: 100% !important;
  border-radius: 8px !important;
  margin: 2px 0 !important;
}
</style>
