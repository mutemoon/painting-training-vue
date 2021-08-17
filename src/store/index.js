import Vuex from 'vuex';
import Vue from 'vue';

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    user: {
      uid: 1000,
      nickname: "赵浩然",
    },
    arr: ['sregsaer']
  },
  mutations: {
    editNickname: function(state, newNickname){
      state.user.nickname = newNickname
      state.user.asoifea = 'sngnej'
      state.arr[1] = 'asdfawe'
      state.arr[6] = 'gsr'
    }
  }
})

export default store
