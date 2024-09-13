<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" bottom app>
      <v-list dense nav>
        <v-list-item-group multiple>
          <v-list-item
            v-for="nav in navs"
            color="primary"
            :key="nav.title"
            :to="nav.to"
          >
            <v-list-item-icon>
              <v-icon color="primary">{{ nav.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ nav.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <!-- <v-divider  :key="`divider-${i}`"></v-divider> -->
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar class="rounded-t-0" color="primary" elevation="1" rounded app>
      <v-app-bar-nav-icon
        color="white"
        @click.stop="drawer = !drawer"
      ></v-app-bar-nav-icon>
      <v-app-bar-title class="white--text">绘画训练</v-app-bar-title>
    </v-app-bar>

    <!-- 根据应用组件来调整你的内容 -->
    <v-main style="height:100%;">
      <router-view></router-view>
    </v-main>

    <!-- <v-footer app> -->
      <!-- -->
    <!-- </v-footer> -->
  </v-app>
</template>

<script>
export default {
  name: "App",

  data: () => ({
    navs: [
      { title: "主页", icon: "mdi-home", to: "/home" },
      { title: "我的账户", icon: "mdi-account-circle", to: "/'/user/'+user.uid" },
      { title: "复习", icon: "mdi-circle-edit-outline", to: "/review/grammar" },
      { title: "美基训练", icon: "T", to: "/painting-training"},
    ],
    drawer: false,
    group: null,
  }),

  watch: {
    group() {
      this.drawer = false;
    },
  },
};
</script>
