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

    canvasInfo: {
      width: 0,
      height: 0,
    },
    canvas: null,
    scene: null,
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
    SET_CANVAS: (state, canvas) => {
      state.canvas = canvas
    },
    SET_SCENE: (state, scene) => {
      state.scene = scene
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
    setCanvas: ({
      commit
    }, canvas) => {
      commit("SET_CANVAS", canvas)
    },
  },

  getters: {
    canvasInfo: (state) => state.canvasInfo,
    scene: (state) => state.scene,
    canvas: (state) => state.canvas,
  }
})

export default store
