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

            <v-list-item
              v-for="{ title, to } of child.children"
              :key="title"
              :to="to"
            >
              <v-list-item-title>
                {{ title }}
              </v-list-item-title>
            </v-list-item>
          </v-list-group>
        </v-list-group>
      </v-list>
    </v-col>
    <v-col cols="10" style="height: 100%">
      <v-card class="mb-3 pb-3 px-3">
        <v-row align="center">
          <v-col cols="2">
            <v-btn
              block
              outlined
              color="primary"
              @click="$refs.view.$emit('next')"
              >下一个 (G)</v-btn
            >
          </v-col>
          <v-col cols="2">
            <v-btn
              block
              outlined
              color="primary"
              @click="$refs.view.$emit('reset')"
              >重来 (R)</v-btn
            >
          </v-col>
          <v-col cols="2">
            <v-btn
              block
              outlined
              color="primary"
              @click="$refs.view.$emit('show-answer')"
              >显示答案 (SPACE)</v-btn
            >
          </v-col>
          <v-col cols="2">
            <v-btn block color="primary" @click="$refs.view.$emit('undo')"
              >撤销 (CTRL+Z)</v-btn
            >
          </v-col>
          <v-col cols="2" offset=""> 本次分数为{{ score }} </v-col>
          <v-col cols="2" offset="">
            <v-switch
              v-model="immediately"
              label="完成答题后显示答案"
            ></v-switch>
          </v-col>
        </v-row>
      </v-card>
      <router-view
        :immediately="immediately"
        ref="view"
        v-resize="resize"
        @score="handleScore"
        @beforeReset="beforeReset"
        @beforeNext="beforeNext"
      ></router-view>
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

import * as THREE from "@/assets/libs/three";

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
                {
                  title: "线线平行",
                  icon: "mdi-account-multiple-outline",
                  to: "line-line-parallel",
                },
                {
                  title: "线面平行",
                  icon: "mdi-account-multiple-outline",
                  to: "line-plane-parallel",
                },
                {
                  title: "面面平行",
                  icon: "mdi-account-multiple-outline",
                  to: "plane-plane-parallel",
                },
              ],
            },
            {
              title: "垂直训练",
              children: [
                {
                  title: "线线垂直",
                  icon: "mdi-account-multiple-outline",
                  to: "line-line-perpendicular",
                },
                {
                  title: "线面垂直",
                  icon: "mdi-account-multiple-outline",
                  to: "line-plane-perpendicular",
                },
                {
                  title: "面面垂直",
                  icon: "mdi-account-multiple-outline",
                  to: "plane-plane-perpendicular",
                },
              ],
            },
            {
              title: "成角训练",
              children: [
                {
                  title: "线线成角",
                  icon: "mdi-account-multiple-outline",
                  to: "line-line-angulation",
                },
                {
                  title: "线面成角",
                  icon: "mdi-account-multiple-outline",
                  to: "line-plane-angulation",
                },
                {
                  title: "面面成角",
                  icon: "mdi-account-multiple-outline",
                  to: "plane-plane-angulation",
                },
              ],
            },
            {
              title: "成比训练",
              children: [
                {
                  title: "同向线段成比",
                  icon: "mdi-account-multiple-outline",
                  to: "same-direction-proportion",
                },
                {
                  title: "异向线段成比",
                  icon: "mdi-account-multiple-outline",
                  to: "different-direction-proportion",
                },
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
                {
                  title: "一般明度控制",
                  icon: "mdi-account-multiple-outline",
                  to: "lightness-controll",
                },
              ],
            },
          ],
        },
      ],
      immediately: true,
      user: {
        uid: 1,
      },
      score: 0,
    };
  },
  created() {
    this.init();
  },

  mounted() {
    this.resize();
    this.update();
  },

  methods: {
    init() {
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
      store.getters.renderer.setAnimationLoop(this.update.bind(this));
      window.store = store;
      window.addEventListener("keydown", (event) => {
        console.log(event.keyCode);
        if (event.keyCode == 71) {
          this.$refs.view.$emit("next");
        }

        if (event.keyCode == 82) {
          this.$refs.view.$emit("reset");
        }

        if (event.keyCode == 32) {
          this.$refs.view.$emit("show-answer");
        }

        if (event.ctrlKey == true && event.keyCode == 90) {
          this.$refs.view.$emit("undo");
        }

        if (event.ctrlKey == true && event.keyCode == 89) {
          this.$refs.view.$emit("redo");
        }
      });

      // 用来Debug
      window.scene = store.getters.scene;
      window.renderer = store.getters.renderer;
    },

    update(time) {
      let { scene, renderer, size } = store.getters;
      let view = this.$refs.view;
      view.update(time);
    },

    resize() {
      let view = this.$refs.view;
      let [width, height] = [view.$el.offsetWidth, view.$el.offsetHeight];
      store.getters.scene.children.forEach((v) => v?.source?.update());
      this.setSize({ width, height });
    },

    beforeReset() {
      this.score = "";
    },

    beforeNext() {
      this.score = "";
    },

    handleScore(score) {
      this.score = score;
    },

    ...mapActions(["setScene", "setCanvas", "setRenderer", "setSize"]),
  },

  directives: {
    resize: {
      bind(el, { value: callback }) {
        let [width, height] = ["", ""];
        function isReize() {
          const style = document.defaultView.getComputedStyle(el);
          if (width !== style.width || height !== style.height)
            callback({ width: style.width, height: style.height });
          ({ width, height } = style);
        }
        el.__vueSetInterval__ = setInterval(isReize, 300);
      },
      unbind(el) {
        clearInterval(el.__vueSetInterval__);
      },
    },
  },
};
</script>

<style scope>
</style>
