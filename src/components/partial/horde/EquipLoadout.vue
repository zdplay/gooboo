<template>
  <div>
    <v-text-field class="ma-1" :label="$vuetify.lang.t(`$vuetify.horde.loadoutName`)" outlined hide-details v-model="loadoutName"></v-text-field>
    <v-select
      class="ma-1"
      :label="$vuetify.lang.t(`$vuetify.horde.items.name`)"
      multiple
      outlined
      hide-details
      item-value="name"
      :items="itemsList"
      v-model="contentList"
      clearable
    >
      <template v-slot:selection="{ item, index }">{{ index > 0 ? ', ' : '' }}{{ $vuetify.lang.t(`$vuetify.horde.items.${ item.name }`) }}</template>
      <template v-slot:item="{ item }"><equip-display :name="item.name"></equip-display></template>
    </v-select>
    <v-select
      class="ma-1"
      label="自动释放技能"
      multiple
      outlined
      hide-details
      item-value="name"
      :items="autocasterItems"
      v-model="autocasterList"
      clearable
      :hint="'最多' + maxAutocast + '个'"
      persistent-hint
    >
      <template v-slot:selection="{ item, index }">{{ index > 0 ? ', ' : '' }}{{ $vuetify.lang.t(`$vuetify.horde.items.${ item.name }`) }}</template>
      <template v-slot:item="{ item }"><equip-display :name="item.name"></equip-display></template>
    </v-select>
    <v-select
      class="ma-1"
      label="禁用主动物品"
      multiple
      outlined
      hide-details
      item-value="name"
      :items="passiveableItems"
      v-model="passiveItemsList"
      clearable
      hint="将所选装备设为禁用主动状态"
      persistent-hint
    >
      <template v-slot:selection="{ item, index }">{{ index > 0 ? ', ' : '' }}{{ $vuetify.lang.t(`$vuetify.horde.items.${ item.name }`) }}</template>
      <template v-slot:item="{ item }"><equip-display :name="item.name"></equip-display></template>
    </v-select>
    
    <div class="d-flex flex-wrap justify-end">
      <v-btn v-if="contentList.length <= 0" color="primary" class="ma-1" @click="takeEquipped">
        {{ $vuetify.lang.t(`$vuetify.horde.items.takeEquipped`) }}
      </v-btn>
      <v-btn v-else color="warning" class="ma-1" @click="clearAll">
        清空配置
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn color="error" class="ma-1" @click="deleteLoadout">
        <v-icon class="mr-2">mdi-delete</v-icon>
        {{ $vuetify.lang.t(`$vuetify.gooboo.delete`) }}
      </v-btn>
    </div>
  </div>
</template>

<script>
import EquipDisplay from './EquipDisplay.vue';

export default {
  components: { EquipDisplay },
  props: {
    name: {
      type: Number,
      required: true
    }
  },
  data: () => ({
    loadoutName: null,
    contentList: [],
    autocasterList: [],
    passiveItemsList: []
  }),
  mounted() {
    this.loadoutName = this.$store.state.horde.loadout[this.name].name;
    this.contentList = [...this.$store.state.horde.loadout[this.name].content];

    const loadoutId = this.$store.state.horde.loadout[this.name].id;
    const extendedInfo = this.$store.state.horde.loadoutExtended[loadoutId];
    if (extendedInfo) {
      this.autocasterList = [...(extendedInfo.autocast || [])];
      this.passiveItemsList = [...(extendedInfo.passiveItems || [])];
    }
  },
  computed: {
    itemsList() {
      let arr = [];
      for (const [key, elem] of Object.entries(this.$store.getters['horde/itemsList'])) {
        arr.push({
          name: key,
          color: elem.activeColor
        });
      }
      return arr;
    },
    autocasterItems() {
      return this.contentList.filter(name => {
        const item = this.$store.state.horde.items[name];
        return item && !item.passive && item.active;
      }).map(name => ({
        name,
        color: this.$store.state.horde.items[name].activeColor
      }));
    },
    passiveableItems() {
      return this.contentList.filter(name => {
        const item = this.$store.state.horde.items[name];
        return item && item.masteryLevel >= 2;
      }).map(name => ({
        name,
        color: this.$store.state.horde.items[name].activeColor
      }));
    },
    maxAutocast() {
      return this.$store.getters['mult/get']('hordeAutocast');
    },
    loadoutId() {
      return this.$store.state.horde.loadout[this.name].id;
    }
  },
  methods: {
    deleteLoadout() {
      this.$store.commit('horde/deleteLoadout', this.name);
    },
    clearAll() {
      this.contentList = [];
      this.autocasterList = [];
      this.passiveItemsList = [];
    },
    takeEquipped() {
      let equipped = [];
      for (const [key, elem] of Object.entries(this.$store.state.horde.items)) {
        if (elem.equipped) {
          equipped.push(key);
        }
      }
      this.contentList = equipped;

      let passiveItems = [];
      for (const [key, elem] of Object.entries(this.$store.state.horde.items)) {
        if (elem.passive && elem.equipped) {
          passiveItems.push(key);
        }
      }
      
      this.autocasterList = [...this.$store.state.horde.autocast];
      this.passiveItemsList = passiveItems;
    },
    updateExtendedInfo() {
      this.$store.commit('horde/updateLoadoutExtended', {
        id: this.loadoutId,
        value: {
          autocast: this.autocasterList.slice(0, this.maxAutocast),
          passiveItems: this.passiveItemsList
        }
      });
    }
  },
  watch: {
    loadoutName(newVal, oldVal) {
      if (oldVal !== null) {
        this.$store.commit('horde/updateLoadoutKey', {id: this.name, key: 'name', value: newVal});
      }
    },
    contentList(newVal, oldVal) {
      if (oldVal !== null) {
        this.$store.commit('horde/updateLoadoutKey', {id: this.name, key: 'content', value: newVal});

        this.autocasterList = this.autocasterList.filter(name => newVal.includes(name));
        this.passiveItemsList = this.passiveItemsList.filter(name => newVal.includes(name));
        
        this.updateExtendedInfo();
      }
    },
    autocasterList(newVal, oldVal) {
      if (oldVal !== null) {
        this.updateExtendedInfo();
      }
    },
    passiveItemsList(newVal, oldVal) {
      if (oldVal !== null) {
        this.updateExtendedInfo();
      }
    }
  }
}
</script>
