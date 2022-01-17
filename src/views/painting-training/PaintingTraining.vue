<template>
  <v-row class="mt-0 ma-1" justify="space-around" style="height: 100%">
    <v-col cols="2" style="height: 100%; overflow: auto; box-shadow: 1px">
      <v-list dense expand>
        <v-list-group :value="true" v-for="nav of navs" :key="nav.title">
          <template v-slot:activator>
            <v-list-item-title>{{ nav.title }}</v-list-item-title>
          </template>

          <v-list-group
            :value="true"
            no-action
            sub-group
            v-for="child of nav.children"
            :key="child.title"
          >
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>{{ child.title }}</v-list-item-title>
              </v-list-item-content>
            </template>

            <v-list-item v-for="{ title } of child.children" :key="title" link>
              <v-list-item-title>
                {{ title }}
              </v-list-item-title>
            </v-list-item>
          </v-list-group>
        </v-list-group>
      </v-list>
    </v-col>
    <v-col cols="10">
      <v-card class="mb-3 pb-3 px-3">
        <v-row>
          <v-col cols="2">
            <v-btn block outlined color="primary">下一个 (G)</v-btn>
          </v-col>
          <v-col cols="2">
            <v-btn block outlined color="primary">重来 (R)</v-btn>
          </v-col>
          <v-col cols="2">
            <v-btn block outlined color="primary">显示答案 (SPACE)</v-btn>
          </v-col>
          <v-col cols="2">
            <v-btn block color="primary">撤销 (CTRL+Z)</v-btn>
          </v-col>
          <v-col cols="2">
            <v-btn block color="primary">恢复 (CTRL+Y)</v-btn>
          </v-col>
        </v-row>
      </v-card>
      <router-view></router-view>
    </v-col>
  </v-row>
</template>

<script>
import Navigation from "@/components/Navigation/Navigation";
import NavigationItem from "@/components/Navigation/NavigationItem";
import NavigationSecondItem from "@/components/Navigation/NavigationSecondItem";
import MainView from "../../components/MainView/MainView.vue";
import store from "@/store";
import { mapActions } from "vuex";
const THREE = require("three");

export default {
  components: { Navigation, NavigationItem, NavigationSecondItem, MainView },
  data() {
    return {
      navs: [
        {
          title: "透视训练",
          children: [
            {
              title: "平行训练",
              children: [
                { title: "线线平行", icon: "mdi-account-multiple-outline" },
                { title: "线面平行", icon: "mdi-account-multiple-outline" },
                { title: "面面平行", icon: "mdi-account-multiple-outline" },
              ],
            },
            {
              title: "垂直训练",
              children: [
                { title: "线线垂直", icon: "mdi-account-multiple-outline" },
                { title: "线面垂直", icon: "mdi-account-multiple-outline" },
                { title: "面面垂直", icon: "mdi-account-multiple-outline" },
              ],
            },
            {
              title: "成角训练",
              children: [
                { title: "线线成角", icon: "mdi-account-multiple-outline" },
                { title: "线面成角", icon: "mdi-account-multiple-outline" },
                { title: "面面成角", icon: "mdi-account-multiple-outline" },
              ],
            },
            {
              title: "成比训练",
              children: [
                { title: "线线成角", icon: "mdi-account-multiple-outline" },
                { title: "线面成角", icon: "mdi-account-multiple-outline" },
                { title: "面面成角", icon: "mdi-account-multiple-outline" },
              ],
            },
            {
              title: "训练",
              children: [
                { title: "线线成角", icon: "mdi-account-multiple-outline" },
                { title: "线面成角", icon: "mdi-account-multiple-outline" },
                { title: "面面成角", icon: "mdi-account-multiple-outline" },
              ],
            },
          ],
        },
        {
          title: "渲染训练",
          children: [
            {
              title: "明度训练",
              children: [
                { title: "线线平行", icon: "mdi-account-multiple-outline" },
              ],
            },
          ],
        },
      ],
      user: {
        uid: 1,
      },
    };
  },
  created() {
    // 初始化scene
    if (!store.getters.scene) {
      this.setScene(new THREE.Scene());
    }
    // 初始化canvas
    if (!store.getters.renderer) {
      this.setRenderer(
        new THREE.WebGLRenderer({ antialias: true, alpha: true })
      );
    }

    // 用来Debug
    window.scene = store.getters.scene;
  },
  methods: {
    ...mapActions(["setScene", "setCanvas", "setRenderer"]),
  },
};
</script>

<style scope>
</style>
