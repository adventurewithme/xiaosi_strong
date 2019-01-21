// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import jquery from 'jquery'
import 'lib-flexible'
import store from './vuex/store'
import animate from 'animate.css'

Vue.config.productionTip = true;
Vue.config.devtools = true;

new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
