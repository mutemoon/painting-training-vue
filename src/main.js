import Vue from 'vue'
import router from './router'
import store from './store'
import App from './App.vue'
import vuetify from './plugins/vuetify'
require('./assets/css/base.css')
require('./assets/css/materialdesignicons.min.css')

String.prototype.toNumber = function () {return /^-?\d+\.?\d*$/.test(this) ? parseFloat(this) : 0}
Vue.directive('num', {
  // 当被绑定的元素插入到 DOM 中时……
  componentUpdated: function (el, binding, vnode)
  {binding.value = 123
    console.log(vnode)
  }
})
Vue.config.productionTip = false

window.vm = new Vue({
  render: h => h(App),
  router,
  vuetify,
  store
}).$mount('#app')
