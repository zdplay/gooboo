<template>
    <div class="strategy-container">
      <div class="spacer-container">
        <div class="spacer"></div>
      </div>
      <div class="iframe-container" v-if="selectedSource">
        <iframe
          :src="currentSrc"
          style="width: 100%; height: 100%; border: none;"
        ></iframe>
      </div>
      
      <!-- 选择对话框 -->
      <v-dialog v-model="showDialog" max-width="400" persistent>
        <v-card class="default-card pa-2">
          <v-card-title class="pa-2 justify-center">选择攻略来源</v-card-title>
          <v-card-text>
            <p class="text-center">请选择您想要查看</p>
          </v-card-text>
          <v-card-actions class="justify-center">
            <v-btn color="primary" @click="selectSource('wiki')">WIKI百科</v-btn>
            <v-btn color="info" @click="selectSource('faq')">FAQ问答</v-btn>
            <v-btn color="error" @click="cancel">取消</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </template>
  
  
  <script>
  export default {
    data() {
      return {
        showDialog: true,
        selectedSource: null,
        wikiUrl: "https://docs.qq.com/sheet/DQlNPSHdVVkdxZ0l4?tab=qej3zz",
        faqUrl: "https://docs.qq.com/doc/DQlNoUk9kZWFnYVVZ"
      };
    },
    computed: {
      currentSrc() {
        return this.selectedSource === 'wiki' ? this.wikiUrl : this.faqUrl;
      }
    },
    methods: {
      selectSource(source) {
        this.selectedSource = source;
        this.showDialog = false;
      },
      cancel() {
        // 默认使用wiki
        this.selectedSource = 'wiki';
        this.showDialog = false;
      }
    }
  };
  </script>
  
  <style scoped>
.strategy-container {
  width: 100%;
  height: calc(100vh - 64px);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.spacer-container {
  width: 100%;
}
.spacer {
  display: none;
  width: 100%;
  height: 64px;
}
.iframe-container {
  flex-grow: 1;
  overflow: hidden;
}
iframe {
  width: 100%;
  height: 100%;
  border: none;
}
@media (max-width: 767px) {
  .spacer {
    display: block;
  }
  .spacer-container{
    display: block;
  }
  /* Hide spacer when menu is at bottom */
  .bottom-positioned ~ .v-main .strategy-container .spacer {
    display: none;
  }
  .bottom-positioned ~ .v-main .strategy-container .spacer-container {
    display: none;
  }
}
  </style>
  