<style scoped>
.scrollable-table {
  max-height: 307px;
  overflow-y: scroll;
  border: 2px solid black;
}
.scrollable-table-mobile {
  max-height: 211px;
}
.scrollable-table-dark {
  border: 2px solid white;
}
.text-superscript {
  margin-left: 1px;
  vertical-align: super;
  font-size: 66%;
}
</style>

<template>
  <div :class="$vuetify.breakpoint.mdAndUp ? 'scroll-container' : ''">
    <v-card class="ma-2">
      <v-card-title class="justify-center">
        <span>{{ $vuetify.lang.t('$vuetify.info.title') }} {{ version }}</span>
        <span v-if="isTestingVersion">-{{ $vuetify.lang.t('$vuetify.info.testing') }}</span>
      </v-card-title>
      <v-card-subtitle class="text-center">{{ $vuetify.lang.t('$vuetify.info.subtitle') }}</v-card-subtitle>
      <v-card-text>
        <div class="mb-2">{{ $vuetify.lang.t('$vuetify.info.text') }}</div>
        <div v-if="appEnv === 'desktop' || appEnv === 'offline'">
          <span>{{ $vuetify.lang.t(`$vuetify.info.updates.${ appEnv }.0`) }}</span>
          <a target="_blank" href="https://github.com/Tendsty/gooboo/releases">
            <span>{{ $vuetify.lang.t(`$vuetify.info.updates.${ appEnv }.1`) }}</span>
          </a>
          <span>{{ $vuetify.lang.t(`$vuetify.info.updates.${ appEnv }.2`) }}</span>
        </div>
        <div v-else>{{ $vuetify.lang.t(`$vuetify.info.updates.${ appEnv }`) }}</div>
        <alert-text v-if="isTestingVersion" class="mt-2">
          <div>
            <span>{{ $vuetify.lang.t('$vuetify.info.testingDescription.0') }}</span>
            <a target="_blank" href="https://tendsty.github.io/gooboo">
              <span>{{ $vuetify.lang.t('$vuetify.info.testingDescription.1') }}</span>
            </a>
            <span>{{ $vuetify.lang.t('$vuetify.info.testingDescription.2') }}</span>
          </div>
        </alert-text>
      </v-card-text>
      <v-card-actions class="flex-wrap justify-end">
        <v-spacer></v-spacer>
        <v-btn class="ma-1" color="primary" @click="toStatOverview"><v-icon class="mr-2">mdi-card-account-details</v-icon>{{ $vuetify.lang.t('$vuetify.info.statistics.name') }}</v-btn>
        <v-btn class="ma-1" color="primary" @click="toPatchnote"><v-icon class="mr-2">mdi-script-text</v-icon>{{ $vuetify.lang.t('$vuetify.info.viewPatchnotes') }}</v-btn>
        <v-btn class="ma-1" color="primary" target="_blank" href="https://github.com/zdplay/gooboo"><v-icon class="mr-2">mdi-open-in-new</v-icon>修改源码</v-btn>
        <v-btn class="ma-1" color="primary" target="_blank" href="https://github.com/Tendsty/gooboo"><v-icon class="mr-2">mdi-open-in-new</v-icon>{{ $vuetify.lang.t('$vuetify.info.socials.viewCode') }}</v-btn>
      </v-card-actions>
    </v-card>
    <v-card class="ma-2">
      <v-card-title class="justify-center">改动声明</v-card-title>
      <v-card-text>本版改动如下：</v-card-text>
      <v-card-text>
        <span class="d-flex ml-4" :class="{'flex-wrap': $vuetify.breakpoint.xsOnly}">
          <v-chip label small class="flex-shrink-0 mr-2 px-2" color="teal">设置</v-chip>
          <span>增加运存档功能，在【设置】-【通用】设置使用。</span>
        </span>
        <span class="d-flex mt-2 ml-4" :class="{'flex-wrap': $vuetify.breakpoint.xsOnly}">
          <v-chip label small class="flex-shrink-0 mr-2 px-2" color="teal">设置</v-chip>
          <span>调整低分辨率的画面布局。</span>
        </span>
        <span class="d-flex ml-4" :class="{'flex-wrap': $vuetify.breakpoint.xsOnly}">
          <v-chip label small class="flex-shrink-0 mr-2 px-2" color="teal">设置</v-chip>
          <span>增加2套主题，待调整。</span>
        </span>
        <span class="d-flex mt-2 ml-4" :class="{'flex-wrap': $vuetify.breakpoint.xsOnly}">
          <v-chip label small class="flex-shrink-0 mr-2 px-2" color="teal">设置</v-chip>
          <span>增加新UI的布局，在【设置】-【实验性】设置使用，需要跟货币标签一起开启。</span>
        </span>
        <span class="d-flex mt-2 ml-4" :class="{'flex-wrap': $vuetify.breakpoint.xsOnly}">
          <v-chip label small class="flex-shrink-0 mr-2 px-2" color="grey">采矿</v-chip>
          <span>修改冶炼最大按钮为指定数量按钮。</span>
        </span>
        <span class="d-flex mt-2 ml-4" :class="{'flex-wrap': $vuetify.breakpoint.xsOnly}">
          <v-chip label small class="flex-shrink-0 mr-2 px-2" color="purple">村庄</v-chip>
          <span>修改牺牲最大按钮为指定数量按钮。</span>
        </span>
        <span class="d-flex mt-2 ml-4" :class="{'flex-wrap': $vuetify.breakpoint.xsOnly}">
          <v-chip label small class="flex-shrink-0 mr-2 px-2" color="red">部落</v-chip>
          <span>增加战斗技能快捷键使用，数字按钮1到0。</span>
        </span>
        <span class="d-flex mt-2 ml-4" :class="{'flex-wrap': $vuetify.breakpoint.xsOnly}">
          <v-chip label small class="flex-shrink-0 mr-2 px-2" color="red">部落</v-chip>
          <span>调整自动施法槽默认为5，普通技能也能自动施法。</span>
        </span>
        <span class="d-flex mt-2 ml-4" :class="{'flex-wrap': $vuetify.breakpoint.xsOnly}">
          <v-chip label small class="flex-shrink-0 mr-2 px-2" color="orange">画廊</v-chip>
          <span>增加画廊的形状游戏显示各个形状的个数。</span>
        </span>
        <span class="d-flex mt-2 ml-4" :class="{'flex-wrap': $vuetify.breakpoint.xsOnly}">
          <v-chip label small class="flex-shrink-0 mr-2 px-2" color="orange">画廊</v-chip>
          <span>增加画廊点击形状数量按钮可自动移动对应形状，增加自动按钮。</span>
        </span>
        <span class="d-flex mt-2 ml-4" :class="{'flex-wrap': $vuetify.breakpoint.xsOnly}">
          <v-chip label small class="flex-shrink-0 mr-2 px-2" color="orange">画廊</v-chip>
          <span>增加画廊形状重roll快捷键【R】。</span>
        </span>
        <span class="d-flex mt-2 ml-4" :class="{'flex-wrap': $vuetify.breakpoint.xsOnly}">
          <v-chip label small class="flex-shrink-0 mr-2 px-2" color="green">学校</v-chip>
          <span>修改学校参考考试为直接满分通过。</span>
        </span>
        <span class="d-flex mt-2 ml-4" :class="{'flex-wrap': $vuetify.breakpoint.xsOnly}">
          <v-chip label small class="flex-shrink-0 mr-2 px-2" color="balck">卡片</v-chip>
          <span>增加卡片页面在目录和卡片选择下拉框增加对应卡包显示。在【设置】-【实验性】设置使用</span>
        </span>
        <span class="d-flex mt-2 ml-4" :class="{'flex-wrap': $vuetify.breakpoint.xsOnly}">
          <v-chip label small class="flex-shrink-0 mr-2 px-2" color="yellow">宝藏</v-chip>
          <span>增加宝藏属性显示显示。</span>
        </span>
        <span class="d-flex mt-2 ml-4" :class="{'flex-wrap': $vuetify.breakpoint.xsOnly}">
          <v-chip label small class="flex-shrink-0 mr-2 px-2" color="blue-grey">其他</v-chip>
          <span>增加攻略按钮。</span>
        </span>
        <span class="d-flex mt-2 ml-4" :class="{'flex-wrap': $vuetify.breakpoint.xsOnly}">
          <v-chip label small class="flex-shrink-0 mr-2 px-2" color="blue-grey">其他</v-chip>
          <span>增加部分地方计时显示。（偷懒了）</span>
        </span>
      </v-card-text>
      <v-card-text class="text-center">
        部分功能借鉴了
        <a href="https://github.com/gityxs/gooboo" target="_blank"><b class="text-lg">gityx</b></a>,
        <a href="https://github.com/baicy/gooboo" target="_blank"><b class="text-lg">baicy</b></a>,
        <a href="https://github.com/pzgme/gooboo-zhHans" target="_blank"><b class="text-lg">pzgme</b></a>
        感谢大佬们的支持。
      </v-card-text>
    </v-card>
    <v-card class="ma-2">
      <v-card-title class="justify-center">{{ $vuetify.lang.t('$vuetify.info.socials.title') }}</v-card-title>
      <v-card-text>{{ $vuetify.lang.t('$vuetify.info.socials.text') }}</v-card-text>
      <v-card-actions class="flex-wrap justify-end">
        <v-btn class="ma-1" color="#ff4500" target="_blank" href="https://www.reddit.com/r/GoobooGame"><v-icon class="mr-2">mdi-open-in-new</v-icon>{{ $vuetify.lang.t('$vuetify.info.socials.reddit') }}</v-btn>
        <v-btn class="ma-1" color="#404eed" target="_blank" href="https://discord.gg/SQ2zFfrxXT"><v-icon class="mr-2">mdi-open-in-new</v-icon>{{ $vuetify.lang.t('$vuetify.info.socials.discord') }}</v-btn>
      </v-card-actions>
    </v-card>
    <v-card v-if="canSeePatreon" class="ma-2">
      <v-card-title class="justify-center">{{ $vuetify.lang.t('$vuetify.info.supportMe.title') }}</v-card-title>
      <v-card-text>{{ $vuetify.lang.t('$vuetify.info.supportMe.text') }}</v-card-text>
      <v-card-actions class="flex-wrap justify-end">
        <v-btn class="ma-1" color="#f1465a" target="_blank" href="https://patreon.com/Tendsty"><v-icon class="mr-2">mdi-open-in-new</v-icon>{{ $vuetify.lang.t('$vuetify.info.supportMe.patreon') }}</v-btn>
      </v-card-actions>
    </v-card>
    <v-card class="ma-2">
      <v-card-title class="justify-center">{{ $vuetify.lang.t('$vuetify.info.numberFormatting') }}</v-card-title>
      <v-card-text>
        <div class="ma-1">{{ $vuetify.lang.t('$vuetify.info.numberFormattingDescription') }}</div>
        <v-row no-gutters>
          <v-col cols="6" md="4" class="pa-1">
            <v-simple-table dense class="scrollable-table" :class="{'scrollable-table-mobile': $vuetify.breakpoint.smAndDown, 'scrollable-table-dark': $vuetify.theme.dark}">
              <thead>
                <tr>
                  <th colspan="2" class="text-center">{{ $vuetify.lang.t('$vuetify.info.bigNumbers') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(num, key) in bigNumbers"
                  :key="`big-number-${ key }`"
                >
                  <td class="text-center">10<span class="text-superscript">{{ (key + 1) * 3 }}</span></td>
                  <td class="text-center">{{ num }}</td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-col>
          <v-col cols="6" md="4" class="pa-1">
            <v-simple-table dense class="scrollable-table" :class="{'scrollable-table-mobile': $vuetify.breakpoint.smAndDown, 'scrollable-table-dark': $vuetify.theme.dark}">
              <thead>
                <tr>
                  <th colspan="2" class="text-center">{{ $vuetify.lang.t('$vuetify.info.smallNumbers') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(num, key) in smallNumbers"
                  :key="`small-number-${ key }`"
                >
                  <td class="text-center">10<span class="text-superscript">-{{ (key + 1) * 3 }}</span></td>
                  <td class="text-center">{{ num }}</td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-col>
          <v-col cols="12" md="4" class="pa-1">
            <v-simple-table dense class="scrollable-table" :class="{'scrollable-table-mobile': $vuetify.breakpoint.smAndDown, 'scrollable-table-dark': $vuetify.theme.dark}">
              <thead>
                <tr>
                  <th colspan="2" class="text-center">{{ $vuetify.lang.t('$vuetify.info.timeUnits') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(num, key) in timeUnits"
                  :key="`time-unit-${ key }`"
                >
                  <td class="text-center">{{ $vuetify.lang.t(`$vuetify.info.timeUnit.${ num }`) }}</td>
                  <td class="text-center">{{ num }}</td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-card class="ma-2">
      <v-card-title class="justify-center">{{ $vuetify.lang.t('$vuetify.info.tech.title') }}</v-card-title>
      <v-card-text>
        <div v-for="(items, name, index) in tech" :key="`tech-${ name }`">
          <div :class="{'mt-4': index > 0}">{{ $vuetify.lang.t(`$vuetify.info.tech.${ name }`) }}:</div>
          <ul>
            <li v-for="(item, key) in items" :key="`techitem-${ name }-${ key }`">
              <span>{{ $vuetify.lang.t(`$vuetify.info.tech.${ key }`) }} (</span>
              <span v-for="(url, site, subindex) in item" :key="`techurl-${ name }-${ key }-${ site }`">
                <span v-if="subindex > 0">, </span>
                <a target="_blank" :href="url">
                  <span>{{ $vuetify.lang.t(`$vuetify.info.tech.${ site }`) }}</span>
                  <v-icon x-small>mdi-open-in-new</v-icon>
                </a>
              </span>
              <span>)</span>
            </li>
          </ul>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { APP_ENV, APP_TESTING } from '../../js/constants';
import { numFormatters, numNegativeFormatters } from '../../js/utils/format';
import AlertText from '../partial/render/AlertText.vue';

export default {
  components: { AlertText },
  data: () => ({
    timeUnits: ['s', 'm', 'h', 'd'],
    tech: {
      web: {
        vue: {github: 'https://github.com/vuejs/vue', website: 'https://vuejs.org'},
        vuetify: {github: 'https://github.com/vuetifyjs/vuetify', website: 'https://vuetifyjs.com/en'},
        vuex: {github: 'https://github.com/vuejs/vuex', website: 'https://vuex.vuejs.org'},
        snackbars: {github: 'https://github.com/Aymkdn/v-snackbars'},
        color: {github: 'https://github.com/Qix-/color'},
        mdi: {github: 'https://github.com/Templarian/MaterialDesign-Webfont'},
        jsfiledownload: {github: 'https://github.com/kennethjiang/js-file-download'},
        seedrandom: {github: 'https://github.com/davidbau/seedrandom'}
      },
      fonts: {
        caveat: {googlefonts: 'https://fonts.google.com/specimen/Caveat'},
        roboto: {googlefonts: 'https://fonts.google.com/specimen/Roboto'},
        robotomono: {googlefonts: 'https://fonts.google.com/specimen/Roboto+Mono'}
      },
      testing: {
        cypress: {github: 'https://github.com/cypress-io/cypress', website: 'https://www.cypress.io'},
        jest: {github: 'https://github.com/jestjs/jest', website: 'https://jestjs.io'}
      }
    }
  }),
  computed: {
    ...mapState({
      version: state => state.system.version
    }),
    bigNumbers() {
      return numFormatters.slice(1);
    },
    smallNumbers() {
      return numNegativeFormatters;
    },
    canSeePatreon() {
      return APP_ENV !== 'STEAM';
    },
    appEnv() {
      return APP_ENV.toLowerCase();
    },
    isTestingVersion() {
      return APP_TESTING;
    }
  },
  methods: {
    toPatchnote() {
      this.$store.commit('system/updateKey', {key: 'screen', value: 'patchnote'});
    },
    toStatOverview() {
      this.$store.commit('system/updateKey', {key: 'screen', value: 'statOverview'});
    }
  }
}
</script>
