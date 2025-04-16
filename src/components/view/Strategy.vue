<template>
    <div class="strategy-container">
      <div class="spacer-container">
        <div class="spacer"></div>
      </div>
      <div class="iframe-container">
        <iframe
          :src="iframeSrc"
          style="width: 100%; height: 100%; border: none;"
        ></iframe>
      </div>
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
}
  </style>
  