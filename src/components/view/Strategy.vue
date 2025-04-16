<template>
    <div class="strategy-container">
      <div class="spacer"></div>
  
      <iframe
        :src="iframeSrc"
        style="width: 100%; height: 100%; border: none;"
      ></iframe>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        iframeSrc: "https://docs.qq.com/sheet/DQlNPSHdVVkdxZ0l4?tab=qej3zz",
      };
    },
  };
  </script>
  
  <style scoped>
  .strategy-container {
    width: 100%;
    height: calc(100vh - 64px);
    overflow: hidden;
  }
  
  .spacer {
    display: none;
  }
  
  iframe {
    height: 100%;
  }
  
  @media (max-width: 767px) {
    .strategy-container {
      height: calc(100vh - 64px);
    }
  
    .spacer {
      display: block;
      width: 100%;
      height: 48px;
    }
  
    iframe {
      height: calc(100% - 48px);
    }
  }
  </style>
  