<template>
  <div class="scroll-container-tab">
    <v-card class="default-card ma-2 pa-2">
      <v-card-title class="pa-2 justify-center">
        <v-icon class="mr-2">mdi-gift-outline</v-icon>
        兑换码生成器
      </v-card-title>
      
      <v-card-text>
        <div class="d-flex align-center ma-1">
          <v-text-field
            class="ma-1"
            label="玩家ID"
            outlined
            hide-details
            v-model="playerId"
            placeholder="输入目标玩家的PlayerId"
          ></v-text-field>
        </div>
        
        <div class="d-flex align-center ma-1">
          <v-autocomplete
            class="ma-1"
            label="物品类型"
            outlined
            hide-details
            :items="itemList"
            item-text="translatedName"
            item-value="key"
            v-model="selectedItem"
            clearable
          >
            <template v-slot:item="{ item }">
              <v-list-item-avatar>
                <v-icon :color="item.color">{{ item.icon }}</v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>{{ item.translatedName }}</v-list-item-title>
                <v-list-item-subtitle>{{ item.type === 'currency' ? item.feature : '消耗品' }}</v-list-item-subtitle>
              </v-list-item-content>
            </template>
          </v-autocomplete>
          
          <v-text-field
            class="ma-1"
            type="number"
            label="数量"
            outlined
            hide-details
            v-model="amount"
            min="1"
          ></v-text-field>
        </div>
        
        <div class="d-flex align-center ma-1">
          <v-btn
            class="ma-1"
            color="primary"
            :disabled="!canGenerate"
            @click="generateCode"
          >
            <v-icon class="mr-2">mdi-creation</v-icon>
            生成兑换码
          </v-btn>
          
          <v-btn
            class="ma-1"
            color="secondary"
            :disabled="!generatedCode"
            @click="copyCode"
          >
            <v-icon class="mr-2">mdi-content-copy</v-icon>
            复制兑换码
          </v-btn>
        </div>
        
        <div v-if="generatedCode" class="ma-1">
          <v-textarea
            label="生成的兑换码"
            outlined
            readonly
            v-model="generatedCode"
            rows="3"
            class="code-textarea"
          ></v-textarea>
        </div>
        
        <div v-if="codeInfo" class="ma-1">
          <v-card outlined>
            <v-card-subtitle>兑换码信息</v-card-subtitle>
            <v-card-text>
              <div><strong>类型:</strong> {{ codeInfo.type === 'currency' ? '货币' : '消耗品' }}</div>
              <div><strong>物品:</strong> {{ codeInfo.type === 'currency' ? `${codeInfo.feature}_${codeInfo.name}` : codeInfo.name }}</div>
              <div><strong>数量:</strong> {{ codeInfo.amount }}</div>
              <div><strong>生成时间:</strong> {{ formatTime(codeInfo.timestamp) }}</div>
            </v-card-text>
          </v-card>
        </div>
        
        <div v-if="errorMessage" class="ma-1">
          <v-alert type="error" outlined>
            {{ errorMessage }}
          </v-alert>
        </div>
      </v-card-text>
    </v-card>
    
    <!-- 测试区域 -->
    <v-card class="default-card ma-2 pa-2">
      <v-card-title class="pa-2 justify-center">
        <v-icon class="mr-2">mdi-test-tube</v-icon>
        兑换码测试
      </v-card-title>
      
      <v-card-text>
        <div class="d-flex align-center ma-1">
          <v-textarea
            class="ma-1"
            label="测试兑换码"
            outlined
            hide-details
            v-model="testCode"
            rows="2"
            placeholder="粘贴兑换码进行测试"
          ></v-textarea>
          
          <v-btn
            class="ma-1"
            color="info"
            :disabled="!testCode"
            @click="testRedeemCode"
          >
            <v-icon class="mr-2">mdi-magnify</v-icon>
            解析测试
          </v-btn>
        </div>
        
        <div v-if="testResult" class="ma-1">
          <v-card outlined :color="testResult.valid ? 'success' : 'error'">
            <v-card-subtitle>测试结果</v-card-subtitle>
            <v-card-text>
              <div v-if="testResult.valid">
                <div><strong>类型:</strong> {{ testResult.data.type === 'currency' ? '货币' : '消耗品' }}</div>
                <div><strong>物品:</strong> {{ testResult.data.type === 'currency' ? `${testResult.data.feature}_${testResult.data.name}` : testResult.data.name }}</div>
                <div><strong>数量:</strong> {{ testResult.data.amount }}</div>
                <div><strong>生成时间:</strong> {{ formatTime(testResult.data.timestamp) }}</div>
                <div class="success--text"><strong>状态:</strong> 兑换码有效</div>
              </div>
              <div v-else class="error--text">
                <strong>错误:</strong> {{ testResult.error }}
              </div>
            </v-card-text>
          </v-card>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import redeemCodeSystem from '../../js/modules/redeemCode.js';

export default {
  data() {
    return {
      playerId: '',
      selectedItem: null,
      amount: 1,
      generatedCode: '',
      codeInfo: null,
      errorMessage: '',
      testCode: '',
      testResult: null
    };
  },
  computed: {
    itemList() {
      const items = redeemCodeSystem.getAvailableItems();
      return items.map(item => ({
        ...item,
        translatedName: item.type === 'currency'
          ? (this.$vuetify.lang.t(`$vuetify.currency.${item.key}.name`) || item.displayName)
          : (this.$vuetify.lang.t(`$vuetify.consumable.${item.key}.name`) || item.displayName)
      }));
    },
    canGenerate() {
      return this.playerId && this.selectedItem && this.amount > 0;
    }
  },
  methods: {
    generateCode() {
      try {
        this.errorMessage = '';

        if (!this.selectedItem) {
          throw new Error('请选择物品类型');
        }

        const selectedItemData = this.itemList.find(item => item.key === this.selectedItem);
        if (!selectedItemData) {
          throw new Error('选择的物品无效');
        }

        let feature, name;
        if (selectedItemData.type === 'currency') {
          [feature, name] = this.selectedItem.split('_');
        } else {
          feature = 'consumable';
          name = this.selectedItem;
        }

        const code = redeemCodeSystem.generateCode(
          this.playerId,
          selectedItemData.type,
          feature,
          name,
          parseInt(this.amount)
        );

        this.generatedCode = code;

        const parsed = redeemCodeSystem.parseCode(code);
        this.codeInfo = parsed;

      } catch (error) {
        this.errorMessage = error.message;
        this.generatedCode = '';
        this.codeInfo = null;
      }
    },
    
    async copyCode() {
      try {
        await navigator.clipboard.writeText(this.generatedCode);
        this.$store.commit('system/addNotification', {
          color: 'success',
          timeout: 3000,
          message: '兑换码已复制到剪贴板'
        });
      } catch (error) {
        this.$store.commit('system/addNotification', {
          color: 'error',
          timeout: 3000,
          message: '复制失败，请手动复制'
        });
      }
    },
    
    testRedeemCode() {
      try {
        this.testResult = null;

        if (!this.testCode.trim()) {
          throw new Error('请输入兑换码');
        }

        const parsed = redeemCodeSystem.parseCode(this.testCode.trim());

        const currentPlayerId = this.$store.state.system.playerId || '';
        const validation = redeemCodeSystem.validateCode(this.testCode.trim(), currentPlayerId);

        this.testResult = {
          valid: validation.valid,
          data: parsed,
          error: validation.error
        };

      } catch (error) {
        this.testResult = {
          valid: false,
          data: null,
          error: error.message
        };
      }
    },
    
    formatTime(timestamp) {
      if (!timestamp) return '未知';
      return new Date(timestamp).toLocaleString();
    }
  },
  
  mounted() {
    this.playerId = this.$store.state.system.playerId || '';
  }
};
</script>

<style scoped>
.code-textarea >>> textarea {
  font-family: 'Courier New', monospace;
  font-size: 12px;
}
</style>
