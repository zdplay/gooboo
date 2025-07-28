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
.wrap-content .v-list-item__title {
  white-space: normal !important;
  overflow: visible;
  text-overflow: unset;
  word-break: break-word;
  line-height: 1.4;
}
/* 添加自定义样式减小更新项间距 */
.update-item {
  padding: 0 8px !important;
  min-height: 32px !important;
}
.update-col {
  padding: 2px 12px !important;
}
.update-card-content {
  padding: 8px 16px !important;
}
/* 添加描边效果 */
.category-icon {
  text-shadow: 0px 0px 2px rgba(0,0,0,0.7);
}
.category-text {
  font-weight: medium;
  text-shadow: 0px 0px 2px rgba(0,0,0,0.7);
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
    
    <v-card v-if="currentUpdates.length > 0" class="ma-2">
      <v-card-title class="justify-center">
        <v-icon left color="amber">mdi-star</v-icon>
        最近更新
        <v-icon right color="amber">mdi-star</v-icon>
      </v-card-title>
      <v-card-text class="update-card-content">
        <v-row dense>
          <v-col cols="12" md="6" v-for="(update, index) in currentUpdates" :key="`current-update-${index}`" 
                 class="update-col">
            <v-list-item dense class="rounded wrap-content update-item">
              <v-list-item-icon class="mr-2">
                <v-icon :color="update.color" class="category-icon">{{ getCategoryIcon(update.category) }}</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>
                  <span :class="`${update.color}--text font-weight-medium category-text`">【{{ update.category }}】</span> 
                  {{ update.content }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-card class="ma-2">
      <v-card-title class="justify-center">改动声明</v-card-title>
      <v-card-text>本版修改属于改善自己游戏的体验，如感不适可玩官服。</v-card-text>
      <v-card-text>
        <div class="text-subtitle-1 mb-3 d-flex align-center">
          <v-icon small class="mr-2">mdi-web</v-icon>
          本服地址
          <v-chip x-small color="success" class="ml-2">存档互通</v-chip>
        </div>
        <v-row>
          <v-col v-for="(site, index) in websites" :key="index" cols="12" sm="4">
            <v-card
              :href="site.url"
              target="_blank"
              class="site-card pa-3 text-center"
              outlined
              hover
            >
              <div class="d-flex justify-space-between align-start mb-2">
                <v-chip x-small color="grey" dark>{{ index + 1 }}</v-chip>
                <div class="ping-indicator">
                  <v-icon
                    x-small
                    :color="getStatusColor(site)"
                    class="mr-1"
                  >{{ getStatusIcon(site) }}</v-icon>
                  <span class="text-caption" :class="getStatusColor(site) + '--text'">
                    {{ getStatusText(site) }}
                  </span>
                </div>
              </div>
              <div class="text-body-2 font-weight-medium">{{ site.name }}</div>
              <div class="text-caption grey--text">{{ site.url.replace('https://', '') }}</div>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-text>本版改动如下：</v-card-text>
      <v-card-text>
        <v-expansion-panels>
          <v-expansion-panel 
            v-for="category in updateCategories" 
            :key="category"
          >
            <v-expansion-panel-header>
              <div class="d-flex align-center">
                <v-icon :color="getCategoryColor(category)" class="mr-2 category-icon">{{ getCategoryIcon(category) }}</v-icon>
                <span :class="`${getCategoryColor(category)}--text category-text`">{{ category }}</span>
                <span class="ml-2 grey--text text--darken-1">
                  ({{ getCategoryItems(category).length }} 项)
                </span>
              </div>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-list dense>
                <v-list-item v-for="(update, index) in getCategoryItems(category)" :key="`update-${index}`" class="wrap-content">
                  <v-list-item-icon class="mr-0">
                    <v-icon small>mdi-circle</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ update.content }}
                      <span v-if="update.isCurrentUpdate" class="amber--text font-weight-bold ml-2">(NEW)</span>
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
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
        <v-btn class="ma-1" color="#0099ff" target="_blank" href="https://qm.qq.com/cgi-bin/qm/qr?k=aHepMfL3oYYl0TIyUZJ6ikeF5DzMtweZ&jump_from=webapi&authKey=2LK48lJ5zp93sglq8hW4sDLBJr/cH2p68KOktFb/Go5uTff4KnNtAG4FupUlr/J6" ><v-icon class="mr-2">mdi-qqchat</v-icon>中文QQ群</v-btn>
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
import { APP_ENV, APP_TESTING, UPDATE_VERSION } from '../../js/constants';
import { numFormatters, numNegativeFormatters } from '../../js/utils/format';
import AlertText from '../partial/render/AlertText.vue';

export default {
  components: { AlertText },
  data: () => ({
    timeUnits: ['s', 'm', 'h', 'd'],
    websites: [
      { name: 'Gooboo 腾讯', url: 'https://gooboo.0nz.de', ping: null, iconUrl: 'https://gooboo.0nz.de/gooboo/favicon-32x32.png', accessible: null },
      { name: 'Gobo vercel', url: 'https://gobo.0nz.de', ping: null, iconUrl: 'https://gobo.0nz.de/gooboo/favicon-32x32.png', accessible: null },
      { name: 'Gobo 阿里', url: 'https://gobo.maozi.io', ping: null, iconUrl: 'https://gobo.maozi.io/favicon-32x32.png', accessible: null }
    ],
    // 当前更新版本号从constants.js导入，只需在那里修改一处
    // 发布新更新时请同步修改：
    // 1. constants.js中的UPDATE_VERSION常量
    // 2. updateItems中相应项的isCurrentUpdate标记
    updateItems: [
      { category: '挖矿', color: 'pink', content: '修改冶炼最大按钮为指定数量按钮。', isCurrentUpdate: false },
      { category: '挖矿', color: 'pink', content: '增加冶炼队列冶炼功能。', isCurrentUpdate: false },
      { category: '挖矿', color: 'pink', content: '增加自动采矿功能，在深度切换右侧机器人按钮，支持离线。', isCurrentUpdate: false },
      { category: '挖矿', color: 'pink', content: '增加矿物总览功能。', isCurrentUpdate: false },
      { category: '挖矿', color: 'pink', content: '增加制作槽可移动功能。', isCurrentUpdate: false },
      { category: '村庄', color: 'indigo', content: '在蒸汽机阶段增加机械矿场升级项目，解锁遥控矿车工作种类，大幅提高金属产量，在【设置】-【实验性】设置。', isCurrentUpdate: false },
      { category: '部落', color: 'red', content: '调整自动施法槽默认为5，普通技能也能自动施法。', isCurrentUpdate: false },
      { category: '部落', color: 'red', content: '增加显示玩家名称功能，在【设置】-【实验性】设置。', isCurrentUpdate: false },
      { category: '部落', color: 'red', content: '增加装备最大化升级按钮，只能非折叠状态显示。', isCurrentUpdate: false },
      { category: '部落', color: 'red', content: '增加部落声望自动化刷精通功能。在楼层切换右边的机器人按钮，完善自动升级、装备、技能。', isCurrentUpdate: false },
      { category: '部落', color: 'red', content: '增加手机装备布局功能，在【设置】-【实验性】设置，只有小屏幕和手机才会显示。', isCurrentUpdate: false },
      { category: '部落', color: 'red', content: '增加神秘碎片额外获得途径，在【设置】-【实验性】设置。', isCurrentUpdate: false },
      { category: '部落', color: 'red', content: '增加塔楼技能冷却重置功能，每次进入塔楼时自动重置所有已装备的装备技能冷却时间。', isCurrentUpdate: false },
      { category: '部落', color: 'red', content: '增加已装备和分类筛选，智能推荐装备功能，在【设置】-【实验性】设置。', isCurrentUpdate: false },
      { category: '部落', color: 'red', content: '增加即时复活按钮。', isCurrentUpdate: false },
      { category: '部落', color: 'red', content: '增加2件额外的装备，钢铁圣域（150）和业火轮回（170），在【设置】-【实验性】设置。', isCurrentUpdate: true },
      { category: '部落', color: 'red', content: '调整装备配置能同步保存装备自动施法和禁用主动技能状态。', isCurrentUpdate: false },
      { category: '画廊', color: 'orange', content: '增加画廊的形状游戏显示各个形状的个数。', isCurrentUpdate: false },
      { category: '画廊', color: 'orange', content: '增加画廊点击形状数量按钮可自动移动对应形状，增加自动按钮。', isCurrentUpdate: false },
      { category: '画廊', color: 'orange', content: '增加画廊形状【清管】功能，一键清空动力值。', isCurrentUpdate: false },
      { category: '画廊', color: 'orange', content: '增加画廊显示全局美丽等级。', isCurrentUpdate: false },
      { category: '画廊', color: 'orange', content: '增加画廊画布快速按钮功能，在【设置】-【实验性】中开关。', isCurrentUpdate: false },
      { category: '画廊', color: 'orange', content: '增加画廊画布预计显示和创意进度条，在【设置】-【实验性】中开关。', isCurrentUpdate: false },
      { category: '画廊', color: 'orange', content: '增加画廊灵感重置功能，可重置所有创意等级和灵感点数，在【设置】-【实验性】中开关。', isCurrentUpdate: false },
      { category: '画廊', color: 'orange', content: '增加画廊创意模版功能，在【设置】-【实验性】中开关。', isCurrentUpdate: false },
      { category: '学校', color: 'green', content: '修改学校参考考试为直接满分通过，在【设置】-【实验性】中开关。', isCurrentUpdate: false },
      { category: '农场', color: 'brown', content: '在农场单元格中显示植物名称，在【设置】-【实验性】中开关。', isCurrentUpdate: false },
      { category: '农场', color: 'brown', content: '在农场货币中显示掉落来源。', isCurrentUpdate: false },
      { category: '农场', color: 'brown', content: '增加农场植物生长阶段鼠标显示。', isCurrentUpdate: false },
      { category: '农场', color: 'brown', content: '增加农场基因阻断跳过功能，在【设置】-【实验性】中开关。', isCurrentUpdate: false },
      { category: '农场', color: 'brown', content: '增加农场物品收获和使用通知功能。', isCurrentUpdate: false },
      { category: '农场', color: 'brown', content: '增加农场离线汇总功能，在【设置】-【实验性】中开关。', isCurrentUpdate: false },
      { category: '农场', color: 'brown', content: '增加旧农场UI的等级显示，在【设置】-【实验性】中开关。', isCurrentUpdate: false },
      { category: '农场', color: 'brown', content: '增加农场统计按钮。', isCurrentUpdate: false },
      { category: '农场', color: 'brown', content: '增加浇水功能，可以12小时内提速15%生长速度，在【设置】-【实验性】中开关。', isCurrentUpdate: false },
      { category: '卡片', color: 'deep-purple', content: '增加卡片页面在目录和卡片选择下拉框增加对应卡包显示。在【设置】-【实验性】设置使用', isCurrentUpdate: false },
      { category: '卡片', color: 'deep-purple', content: '增加卡片页面卡包购买预测功能。', isCurrentUpdate: false },
      { category: '宝藏', color: 'yellow', content: '增加宝藏属性显示和翡翠显示。', isCurrentUpdate: false },
      { category: '宝藏', color: 'yellow', content: '增加宝藏整理排序功能。', isCurrentUpdate: false },
      { category: '宝藏', color: 'yellow', content: '增加宝藏购买预测功能，可以预览未来10次随机效果。', isCurrentUpdate: false },
      { category: '宝藏', color: 'yellow', content: '增加宝藏临时保存槽和合成功能。', isCurrentUpdate: true },
      { category: '事件', color: 'dark-blue', content: '调整每日签到奖励，在【设置】-【实验性】中开关。（别服存档过来要过一天才能签到）', isCurrentUpdate: false },
      { category: '事件', color: 'dark-blue', content: '增加天气混乱事件萌新钓竿和海贼王宝藏，钓鱼日志，互动钓鱼小游戏。', isCurrentUpdate: false },
      { category: '事件', color: 'dark-blue', content: '调整天气混乱事件鱼哨的钓鱼力量加成为2倍，调整2图垃圾增益为塑料，藻类增益改到4图。', isCurrentUpdate: false },
      { category: '事件', color: 'dark-blue', content: '增加紫水晶时间沙漏功能，可用紫水晶加速大事件进程，1个紫水晶=1.5分钟。', isCurrentUpdate: false },
      { category: '事件', color: 'dark-blue', content: '增加宾果预测和撤销功能，在【设置】-【实验性】中开关。', isCurrentUpdate: false },
      { category: '事件', color: 'dark-blue', content: '增加【指定赌场事件】功能，开启后可手动选择进入宾果或转盘，在【设置】-【实验性】中开关。', isCurrentUpdate: false },
      { category: '事件', color: 'dark-blue', content: '增加累签圣遗物系统，在【设置】-【实验性】中开关。', isCurrentUpdate: true },
      { category: '事件', color: 'dark-blue', content: '降低夏日祭典黄宝石需求，调整部分内容。', isCurrentUpdate: true },
      { category: '事件', color: 'dark-blue', content: '降低夏日祭典挖掘机，调整改造地形功能。', isCurrentUpdate: true },
      { category: '冰冻实验室', color: 'blue', content: '增加双开门冰箱功能，扩展为冷藏和冷冻双系统，同时使用时1.3倍效果。', isCurrentUpdate: false },
      { category: '其他', color: 'cyan', content: '增加攻略按钮。', isCurrentUpdate: false },
      { category: '其他', color: 'cyan', content: '增加沙漏快捷时间选择和自动使用考试券功能，在【设置】-【实验性】中开关。', isCurrentUpdate: false },
      { category: '其他', color: 'cyan', content: '增加部分地方计时显示。', isCurrentUpdate: false },
      { category: '其他', color: 'cyan', content: '在升级菜单中添加材料筛选功能。', isCurrentUpdate: false },
      { category: '其他', color: 'cyan', content: '增加购买按钮进度条功能，在【设置】-【实验性】中开启。', isCurrentUpdate: false },
      { category: '其他', color: 'cyan', content: '增加菜单栏快捷按钮功能，在【设置】-【实验性】中开启。', isCurrentUpdate: false },
      { category: '其他', color: 'cyan', content: '增加屏幕布局模式选项，可以手动选择界面布局大小。在【设置】-【实验性】设置。', isCurrentUpdate: false },
      { category: '其他', color: 'cyan', content: '增加云存档功能，在【设置】-【通用】设置。', isCurrentUpdate: false },
      { category: '其他', color: 'cyan', content: '增加自定义壁纸功能，在【设置】-【实验性】设置。', isCurrentUpdate: false },
      { category: '其他', color: 'cyan', content: '完善【设置】-【键盘绑定】里面的快捷键功能。', isCurrentUpdate: false },
      { category: '其他', color: 'cyan', content: '增加1套主题【梦幻】。', isCurrentUpdate: false },
      { category: '其他', color: 'cyan', content: '增加手机菜单栏移动到底部，在【设置】-【实验性】设置。', isCurrentUpdate: false },
      { category: '其他', color: 'cyan', content: '增加新UI的布局，在【设置】-【实验性】设置，需要跟货币标签一起开启。', isCurrentUpdate: false },
      { category: '其他', color: 'cyan', content: '增加【显示科学记数法】选项，在【设置】-【实验性】设置。', isCurrentUpdate: false },
      { category: '其他', color: 'cyan', content: '增加升级队列功能。在【设置】-【实验性】中开关，点击【已升级】按钮添加。', isCurrentUpdate: false },
      { category: '其他', color: 'cyan', content: '增加低耗材料半隐藏功能，当材料充足百分比超过1000%时价格标签显示半透明效果。', isCurrentUpdate: false },
      { category: '其他', color: 'cyan', content: '增加兑换码功能，用来补偿部分玩家的损失。', isCurrentUpdate: false },
      { category: '其他', color: 'cyan', content: '增加预览未解锁升级项功能，可查看尚未解锁的升级项目并显示具体材料需求。', isCurrentUpdate: false }
    ],
    categoryIcons: {
      '设置': 'mdi-cog',
      '挖矿': 'mdi-pickaxe',
      '村庄': 'mdi-home-group',
      '部落': 'mdi-account-group',
      '画廊': 'mdi-image-frame',
      '学校': 'mdi-school',
      '农场': 'mdi-barn',
      '卡片': 'mdi-cards',
      '宝藏': 'mdi-treasure-chest',
      '事件': 'mdi-calendar',
      '冰冻实验室': 'mdi-snowflake',
      '其他': 'mdi-dots-horizontal-circle'
    },
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
    currentUpdates() {
      return this.updateItems.filter(item => item.isCurrentUpdate === true);
    },
    allUpdates() {
      return this.updateItems;
    },
    updateCategories() {
      return [...new Set(this.updateItems.map(item => item.category))];
    },
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
    },
    getPingColor(ping) {
      if (ping === null) return 'grey';
      if (ping < 100) return 'success';
      if (ping < 300) return 'warning';
      return 'error';
    },

    getStatusColor(site) {
      if (site.ping === null || site.accessible === null) {
        return 'grey';
      }

      if (site.accessible === false) {
        return 'error';
      }

      return this.getPingColor(site.ping);
    },

    getStatusIcon(site) {
      if (site.ping === null || site.accessible === null) {
        return 'mdi-loading mdi-spin';
      }

      if (site.accessible === false) {
        return 'mdi-close-circle';
      }

      if (site.ping < 100) return 'mdi-check-circle';
      if (site.ping < 300) return 'mdi-minus-circle';
      return 'mdi-alert-circle';
    },

    getStatusText(site) {
      if (site.ping === null || site.accessible === null) {
        return '测试中...';
      }

      if (site.accessible === false) {
        return '无法访问';
      }

      return site.ping + 'ms';
    },

    async testPing(index) {
      const site = this.websites[index];
      const testCount = 3;
      const results = [];

      for (let i = 0; i < testCount; i++) {
        try {
          const img = new Image();
          const startTime = performance.now();

          const loadPromise = new Promise((resolve, reject) => {
            img.onload = () => {
              const loadTime = Math.round(performance.now() - startTime);
              resolve(loadTime);
            };
            img.onerror = () => {
              reject(new Error('Icon load failed'));
            };
          });

          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Timeout')), 5000);
          });

          img.src = site.iconUrl + '?' + Math.random(); // 避免缓存

          const loadTime = await Promise.race([loadPromise, timeoutPromise]);
          results.push(loadTime);

        } catch (error) {
          results.push(999);
        }

        if (i < testCount - 1) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      const validResults = results.filter(time => time < 999);

      if (validResults.length > 0) {
        const averageTime = Math.round(validResults.reduce((sum, time) => sum + time, 0) / validResults.length);
        this.$set(this.websites[index], 'ping', averageTime);
        this.$set(this.websites[index], 'accessible', true);
      } else {
        this.$set(this.websites[index], 'ping', 999);
        this.$set(this.websites[index], 'accessible', false);
      }
    },
    markUpdateAsRead() {
      this.$store.commit('system/updateKey', {key: 'updateNoticeVersion', value: UPDATE_VERSION});
    },
    getCategoryColor(category) {
      const item = this.updateItems.find(item => item.category === category);
      return item ? item.color : 'grey';
    },
    getCategoryIcon(category) {
      return this.categoryIcons[category] || 'mdi-circle';
    },
    getCategoryItems(category) {
      return this.updateItems.filter(item => item.category === category);
    }
  },
  mounted() {
    this.markUpdateAsRead();
    this.websites.forEach((_, index) => {
      this.testPing(index);
    });
  }
}
</script>

<style scoped>
.site-card {
  transition: all 0.2s ease;
  cursor: pointer;
}

.site-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
}

.ping-indicator {
  display: flex;
  align-items: center;
}

.mdi-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
