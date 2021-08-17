<template>
  <div class="main">
    <navigation>
      <navigation-item to="/home" title="主页"></navigation-item>

      <navigation-item to="/calculator" title="一些计算器"></navigation-item>
      <navigation-item to="/vocabulary" title="记单词"></navigation-item>
      <navigation-item
        to="/'/user/'+user.uid"
        title="我的账户"
      ></navigation-item>
      <navigation-item
        to="/painting-training/perspective"
        title="透视训练"
      ></navigation-item>
      <navigation-second-item
        to="/painting-training/perspective/double-lines-parallel"
        title="两线平行"
      ></navigation-second-item>
      <navigation-second-item
        to="/painting-training/perspective/double-lines-vertical"
        title="两线垂直"
      ></navigation-second-item>
    </navigation>
    <main-view><router-view></router-view></main-view>
  </div>
</template>

<script>
import Navigation from "@/components/Navigation/Navigation";
import NavigationItem from "@/components/Navigation/NavigationItem";
import NavigationSecondItem from "@/components/Navigation/NavigationSecondItem";
import MainView from "../../components/MainView/MainView.vue";

export default {
  components: { Navigation, NavigationItem, NavigationSecondItem, MainView },
  data() {
    return {
      user: {
        uid: 1,
      },
    };
  },
};
</script>

<style scope>
</style>
