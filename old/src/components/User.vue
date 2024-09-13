<template>
  <div>
    <h2>你好，{{ user.nickname }}</h2>
    <input type="text" placeholder="你的新昵称" v-model="nickname" />
    <button @click="editNickname">修改</button>
    <h2>该组件中的对象myuser:{{ myuser }}</h2>
    <h2>state中的对象user:{{ user }}</h2>
    <h2>state中的数组arr:{{ arr }}</h2>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      nickname: "",
    };
  },
  methods: {
    editNickname() {
      this.$store.commit("editNickname", this.nickname);
    },
  },
  computed: {
    myuser() {
      return this.user;
    },
    ...mapState(["user", "arr"]),
  },
};
</script>

<style scoped>
</style>
