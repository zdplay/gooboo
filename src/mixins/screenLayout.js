export const screenLayoutMixin = {
  computed: {
    screenLayoutMode() {
      return this.$store.state.system.settings.experiment.items.screenLayoutMode.value;
    },
    
    // 判断是否是手机屏幕 (无论用户设置什么，手机屏幕都保持原样)
    isMobileScreen() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    
    // 这些计算属性用于覆盖Vuetify的breakpoint，实现自定义布局
    isCustomMdAndUp() {
      // 如果是手机屏幕或设置为auto，使用默认行为
      if (this.isMobileScreen || this.screenLayoutMode === 'auto') {
        return this.$vuetify.breakpoint.mdAndUp;
      }
      
      // 根据用户选择强制返回特定值
      return ['medium', 'large', 'xlarge'].includes(this.screenLayoutMode);
    },
    
    isCustomLgAndUp() {
      // 如果是手机屏幕或设置为auto，使用默认行为
      if (this.isMobileScreen || this.screenLayoutMode === 'auto') {
        return this.$vuetify.breakpoint.lgAndUp;
      }
      
      // 根据用户选择强制返回特定值
      return ['large', 'xlarge'].includes(this.screenLayoutMode);
    },
    
    isCustomXlOnly() {
      // 如果是手机屏幕或设置为auto，使用默认行为
      if (this.isMobileScreen || this.screenLayoutMode === 'auto') {
        return this.$vuetify.breakpoint.xlOnly;
      }
      
      // 根据用户选择强制返回特定值
      return this.screenLayoutMode === 'xlarge';
    },
    
    isCustomSmAndDown() {
      // 如果是手机屏幕，无条件返回true
      if (this.isMobileScreen) {
        return true;
      }
      
      // 如果设置为auto，使用默认行为
      if (this.screenLayoutMode === 'auto') {
        return this.$vuetify.breakpoint.smAndDown;
      }
      
      // 强制为false，因为我们不在手机上
      return false;
    },
    
    isCustomMdOnly() {
      // 如果是手机屏幕或设置为auto，使用默认行为
      if (this.isMobileScreen || this.screenLayoutMode === 'auto') {
        return this.$vuetify.breakpoint.mdOnly;
      }
      
      // 根据用户选择判断
      return this.screenLayoutMode === 'medium';
    },
    
    isCustomLgOnly() {
      // 如果是手机屏幕或设置为auto，使用默认行为
      if (this.isMobileScreen || this.screenLayoutMode === 'auto') {
        return this.$vuetify.breakpoint.lgOnly;
      }
      
      // 根据用户选择判断
      return this.screenLayoutMode === 'large';
    }
  }
}; 