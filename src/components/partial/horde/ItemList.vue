<style scoped>
.horde-item-pagination {
  position: sticky;
  z-index: 2;
  top: 0;
}
.horde-item-pagination-mobile {
  top: 104px;
}
.loadout-header-reduce-minheight {
  min-height: 32px !important;
}
.config-textarea {
  font-family: 'Courier New', monospace;
  font-size: 12px;
}
.config-textarea .v-input__control .v-input__slot textarea {
  font-family: 'Courier New', monospace !important;
  font-size: 12px !important;
  line-height: 1.4 !important;
}
</style>

<template>
  <div>
    <div class="ma-2 d-flex justify-center align-center">
      <v-btn small class="mr-3 pa-1" color="beige" min-width="20" min-height="20" style="height: 24px;" @click="toggleLoadouts"><v-icon small>mdi-tray-full</v-icon></v-btn>
      <gb-tooltip :title-text="$vuetify.lang.t(`$vuetify.mult.hordeMaxItems`)">
        <template v-slot:activator="{ on, attrs }">
          <span v-bind="attrs" v-on="on">{{ itemsEquipped }} / {{ maxItems }} {{ $vuetify.lang.t(`$vuetify.horde.itemsEquipped`) }}</span>
        </template>
        <stat-breakdown name="hordeMaxItems"></stat-breakdown>
      </gb-tooltip>
      <v-btn
        small
        class="ml-3 pa-1"
        color="primary"
        min-width="20"
        min-height="20"
        style="height: 24px;"
        @click="openBatchConfigDialog"
        v-if="hasEnhancedAutocastSettings"
      >
        <v-icon small>mdi-cog</v-icon>
      </v-btn>
    </div>
    <div class="d-flex flex-column align-center bg-tile-default rounded-b elevation-2 ma-2 pa-1" v-if="showLoadouts">
      <div class="d-flex justify-space-between align-center w-100">
        <v-btn class="ma-1" color="success" @click="addEmptyLoadout">
          <v-icon class="mr-1">mdi-plus</v-icon>
          {{ $vuetify.lang.t(`$vuetify.horde.newLoadout`) }}
        </v-btn>
        <v-btn class="ma-1" color="error" :disabled="itemsBlocked" @click="unequipAll">{{ $vuetify.lang.t(`$vuetify.gooboo.unequipAll`) }}</v-btn>
        <v-btn icon @click="showLoadouts = false"><v-icon>mdi-close</v-icon></v-btn>
      </div>
      <div v-if="loadouts.length >= 1" class="ma-1 px-1 w-100">
        <v-expansion-panels accordion>
          <v-expansion-panel v-for="(loadout, key) in loadouts" :key="`loadout-${ key }`">
            <v-expansion-panel-header class="pa-2 loadout-header-reduce-minheight">
              <div class="d-flex align-center">
                <v-badge bottom overlap :content="'' + loadout.content.length"><v-icon>mdi-sack</v-icon></v-badge>
                <div class="ma-1 ml-3">{{ loadout.name }}</div>
              </div>
              <v-spacer></v-spacer>
              <div class="flex-grow-0">
                <v-btn small class="ma-1 pa-1" color="success" min-width="32" min-height="32" :disabled="itemsBlocked || loadout.content.length <= 0" @click.native.stop="equipLoadout(key)"><v-icon>mdi-plus</v-icon></v-btn>
                <v-btn small class="ma-1 pa-1" color="error" min-width="32" min-height="32" :disabled="itemsBlocked || loadout.content.length <= 0" @click.native.stop="unequipLoadout(key)"><v-icon>mdi-minus</v-icon></v-btn>
              </div>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <equip-loadout :name="key" :key="loadout.id"></equip-loadout>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </div>
      <div v-else class="ma-1">{{ $vuetify.lang.t(`$vuetify.horde.noLoadouts`) }}</div>
    </div>
    <div class="horde-item-pagination text-center bg-tile-default rounded-b elevation-2 mx-2" :class="{'horde-item-pagination-mobile': $vuetify.breakpoint.xsOnly}" v-if="pages > 1">
      <v-pagination v-model="page" :length="pages"></v-pagination>
    </div>
    <item v-for="item in finalItems" :key="'item-' + item.name" :name="item.name" :disabled="itemsBlocked" :active-disabled="isFrozen" class="ma-2"></item>

    <!-- 批量配置编辑弹窗 -->
    <v-dialog v-model="batchConfigDialog" max-width="800" @click:outside="closeBatchConfigDialog">
      <v-card class="default-card pa-2">
        <v-card-title class="pa-2 justify-center">
          增强自动释放批量配置
          <v-spacer></v-spacer>
          <v-btn icon @click="closeBatchConfigDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="px-2">
          <div class="mb-3">
            <v-alert type="info" dense outlined>
              <div class="text-body-2">
                <strong>使用说明：</strong><br>
                • 下方显示所有已配置的装备设置<br>
                • 可以直接编辑JSON文本进行批量修改<br>
                • 保存前请确保JSON格式正确<br>
                • 删除某个装备的配置可将其整个对象删除
              </div>
            </v-alert>
          </div>

          <v-textarea
            v-model="configJsonText"
            label="配置JSON"
            outlined
            rows="20"
            :error="jsonError !== null"
            :error-messages="jsonError"
            @input="validateJson"
            class="config-textarea"
          ></v-textarea>
        </v-card-text>

        <v-card-actions class="px-2 pb-2">
          <v-btn color="secondary" @click="resetToOriginal">重置</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="closeBatchConfigDialog">取消</v-btn>
          <v-btn
            color="success"
            @click="saveBatchConfig"
            :disabled="jsonError !== null || configJsonText.trim() === ''"
          >
            保存
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import StatBreakdown from '../../render/StatBreakdown.vue';
import EquipLoadout from './EquipLoadout.vue';
import Item from './Item.vue';

export default {
  components: { Item, StatBreakdown, EquipLoadout },
  data: () => ({
    page: 1,
    cacheKey: 'horde_0_equipment',
    showLoadouts: false,
    batchConfigDialog: false,
    configJsonText: '',
    originalConfigJson: '',
    jsonError: null
  }),
  mounted() {
    const cachePage = this.$store.state.system.cachePage[this.cacheKey];
    if (cachePage !== undefined) {
      this.page = Math.min(Math.max(cachePage, 1), this.pages);
    }
  },
  computed: {
    ...mapState({
      isFrozen: (state) => state.system.settings.experiment.items.doubleDoorFridge.value ? (state.cryolab.horde.active || state.cryolab.horde.freeze) : state.cryolab.horde.active,
      loadouts: state => state.horde.loadout
    }),
    ...mapGetters({
      itemsEquipped: 'horde/itemsEquipped',
      itemsList: 'horde/itemsList'
    }),
    maxItems() {
      return this.$store.getters['mult/get']('hordeMaxItems');
    },
    items() {
      let arr = [];
      for (const [key, elem] of Object.entries(this.itemsList)) {
        arr.push({...elem, name: key});
      }
      return arr;
    },
    finalItems() {
      if (this.itemLimit === null) {
        return this.items;
      }
      return this.items.slice(this.itemLimit * (this.page - 1), this.itemLimit * this.page);
    },
    itemLimit() {
      return this.$store.state.system.settings.performance.items.upgradeListItems.value;
    },
    pages() {
      return this.itemLimit === null ? null : Math.ceil(this.items.length / this.itemLimit);
    },
    itemsBlocked() {
      return this.isFrozen || this.$store.state.horde.currentTower !== null;
    },
    hasEnhancedAutocastSettings() {
      const settings = this.$store.state.horde.enhancedAutocastSettings || {};
      return Object.keys(settings).length > 0;
    }
  },
  methods: {
    toggleLoadouts() {
      this.showLoadouts = !this.showLoadouts;
    },
    unequipAll() {
      this.$store.dispatch('horde/unequipAll');
    },
    addEmptyLoadout() {
      this.$store.commit('horde/addEmptyLoadout');
    },
    equipLoadout(index) {
      this.$store.dispatch('horde/equipLoadout', index);
    },
    unequipLoadout(index) {
      this.$store.dispatch('horde/unequipLoadout', index);
    },
    openBatchConfigDialog() {
      const settings = this.$store.state.horde.enhancedAutocastSettings || {};
      this.originalConfigJson = JSON.stringify(settings, null, 2);
      this.configJsonText = this.originalConfigJson;
      this.jsonError = null;
      this.batchConfigDialog = true;
    },
    closeBatchConfigDialog() {
      this.batchConfigDialog = false;
      this.configJsonText = '';
      this.originalConfigJson = '';
      this.jsonError = null;
    },
    validateJson() {
      try {
        if (this.configJsonText.trim() === '') {
          this.jsonError = null;
          return;
        }
        JSON.parse(this.configJsonText);
        this.jsonError = null;
      } catch (error) {
        this.jsonError = `JSON格式错误: ${error.message}`;
      }
    },
    resetToOriginal() {
      this.configJsonText = this.originalConfigJson;
      this.jsonError = null;
    },
    saveBatchConfig() {
      try {
        if (this.configJsonText.trim() === '') {
          // 清空所有配置
          this.$store.commit('horde/updateKey', {
            key: 'enhancedAutocastSettings',
            value: {}
          });
        } else {
          const newConfig = JSON.parse(this.configJsonText);
          this.$store.commit('horde/updateKey', {
            key: 'enhancedAutocastSettings',
            value: newConfig
          });
        }

        console.log('批量配置保存成功');
        this.closeBatchConfigDialog();
      } catch (error) {
        console.error('批量配置保存失败:', error);
        this.jsonError = `保存失败: ${error.message}`;
      }
    }
  },
  watch: {
    page(newVal) {
      this.$store.commit('system/updateCachePageKey', {key: this.cacheKey, value: newVal});
    },
    pages(newVal) {
      if (this.page > newVal) {
        this.page = Math.max(newVal, 1);
      }
    }
  }
}
</script>
