<template>
  <div>
    <v-text-field class="ma-1" label="配置名称" outlined hide-details v-model="loadoutName"></v-text-field>
    <v-select
      class="ma-1"
      label="灵感创意"
      multiple
      outlined
      hide-details
      item-value="name"
      :items="ideaList"
      v-model="contentList"
      clearable
    >
      <template v-slot:selection="{ item, index }">{{ index > 0 ? ', ' : '' }}{{ $vuetify.lang.t(`$vuetify.gallery.idea.${ item.name }`) }}</template>
      <template v-slot:item="{ item }">
        <div class="d-flex align-center w-100">
          <v-icon class="mr-2" :color="item.color">{{ item.icon }}</v-icon>
          <span>{{ $vuetify.lang.t(`$vuetify.gallery.idea.${ item.name }`) }}</span>
          <v-spacer></v-spacer>
          <v-chip small :color="item.color" text-color="white">T{{ item.tier }}</v-chip>
        </div>
      </template>
    </v-select>
    
    <div class="d-flex flex-wrap justify-end">
      <v-btn v-if="contentList.length <= 0" color="primary" class="ma-1" @click="takeActivated">
        获取当前激活
      </v-btn>
      <v-btn v-else color="warning" class="ma-1" @click="clearAll">
        清空配置
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn color="error" class="ma-1" @click="deleteLoadout">
        <v-icon class="mr-2">mdi-delete</v-icon>
        删除
      </v-btn>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: Number,
      required: true
    }
  },
  data: () => ({
    loadoutName: null,
    contentList: []
  }),
  mounted() {
    this.loadoutName = this.$store.state.gallery.ideaLoadout[this.name].name;
    this.contentList = [...this.$store.state.gallery.ideaLoadout[this.name].content];
  },
  computed: {
    ideaList() {
      let arr = [];
      for (const [key, elem] of Object.entries(this.$store.state.gallery.idea)) {
        if (elem.owned) {
          arr.push({
            name: key,
            icon: elem.icon,
            color: elem.color,
            tier: elem.tier
          });
        }
      }
      // 按层级排序
      return arr.sort((a, b) => a.tier - b.tier);
    }
  },
  methods: {
    deleteLoadout() {
      this.$store.commit('gallery/deleteIdeaLoadout', this.name);
    },
    clearAll() {
      this.contentList = [];
    },
    takeActivated() {
      let activated = [];
      for (const [key, elem] of Object.entries(this.$store.state.gallery.idea)) {
        if (elem.level > 0) {
          activated.push(key);
        }
      }
      this.contentList = activated;
    }
  },
  watch: {
    loadoutName(newVal, oldVal) {
      if (oldVal !== null) {
        this.$store.commit('gallery/updateIdeaLoadoutKey', {id: this.name, key: 'name', value: newVal});
      }
    },
    contentList(newVal, oldVal) {
      if (oldVal !== null) {
        this.$store.commit('gallery/updateIdeaLoadoutKey', {id: this.name, key: 'content', value: newVal});
      }
    }
  }
}
</script>
