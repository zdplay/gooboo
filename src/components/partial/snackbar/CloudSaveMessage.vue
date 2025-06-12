<template>
  <v-card color="transparent" flat class="cloud-notification">
    <v-card-text class="pa-1 d-flex align-center">
      <!-- 状态图标 -->
      <v-icon :color="message.error ? 'error' : 'success'" class="mr-1">
        {{ message.error ? 'mdi-alert-circle' : 'mdi-check-circle' }}
      </v-icon>
      
      <!-- 操作类型图标 -->
      <v-icon class="mr-1">{{ operationIcon }}</v-icon>
      
      <!-- 消息文本 -->
      <span>{{ message.error ? errorMessage : successMessage }}</span>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    message: {
      type: Object,
      required: true
    }
  },
  computed: {
    operationIcon() {
      // 根据操作类型返回对应图标
      switch (this.message.operation) {
        case 'save':
          return 'mdi-content-save';
        case 'load':
          return 'mdi-cloud-download';
        case 'update_memo':
          return 'mdi-pencil';
        case 'list':
          return 'mdi-format-list-bulleted';
        case 'download':
          return 'mdi-download';
        default:
          return 'mdi-cloud';
      }
    },
    errorMessage() {
      // 错误消息优先显示自定义文本，其次是error对象中的message
      if (this.message.customMessage) {
        return this.message.customMessage;
      }
      
      if (this.message.error && this.message.error.message) {
        return this.message.error.message;
      }
      
      // 根据操作类型返回默认错误消息 - 更简短的版本
      switch (this.message.operation) {
        case 'save':
          return '保存失败';
        case 'load':
          return '加载失败';
        case 'update_memo':
          return '备注更新失败';
        case 'list':
          return '获取列表失败';
        case 'download':
          return '下载失败';
        default:
          return '操作失败';
      }
    },
    successMessage() {
      // 根据操作类型返回成功消息 - 更简短的版本
      switch (this.message.operation) {
        case 'save':
          return '保存成功';
        case 'load':
          return '加载成功';
        case 'update_memo':
          return '备注已更新';
        case 'list':
          return '列表已加载';
        case 'download':
          return '下载成功';
        default:
          return '操作成功';
      }
    }
  }
}
</script>

<style scoped>
.cloud-notification {
  animation: notification-pulse 0.3s ease-in-out;
  max-width: 280px;
  margin: 0 auto;
}

@keyframes notification-pulse {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style> 