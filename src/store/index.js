import Vuex from 'vuex';
import Vue from 'vue';

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    user: {
      uid: 1000,
      nickname: "赵浩然",
    },
    arr: ['sregsaer'],
    width: 0,
    height: 0,
    scene: null,
    renderer: null,
  },
  mutations: {
    editNickname: function (state, newNickname) {
      state.user.nickname = newNickname
      state.user.asoifea = 'sngnej'
      state.arr[1] = 'asdfawe'
      state.arr[6] = 'gsr'
    },
    SET_CANVAS_INFO: (state, info) => {
      state.canvasInfo = info
    },
    SET_SIZE: (state, {width, height}) => {
      state.renderer.setSize(width, height);
      state.width = width
      state.height = height
    },
    SET_SCENE: (state, scene) => {
      state.scene = scene
    },
    SET_RENDERER: (state, renderer) => {
      state.renderer = renderer
    },
  },

  actions: {
    setCanvasInfo: ({
      commit
    }, info) => {
      commit("SET_CANVAS_INFO", info)
    },
    setScene: ({
      commit
    }, scene) => {
      commit("SET_SCENE", scene)
    },
    setSize: ({
      commit
    }, size) => {
      commit("SET_SIZE", size)
    },
    setRenderer: ({
      commit
    }, renderer) => {
      commit("SET_RENDERER", renderer)
    },
  },

  getters: {
    canvasInfo: (state) => state.canvasInfo,
    scene: (state) => state.scene,
    canvas: (state) => state.canvas,
    renderer: (state) => state.renderer,
    width: (state) => state.width,
    height: (state) => state.height,
    size: ({width, height}) => ({width, height}),
    scale: (state) => state.height / 4,
    top: (state, getters) => state.height / 2 / getters.scale,
    bottom: (state, getters) => -state.height / 2 / getters.scale,
  }
})

export default store
