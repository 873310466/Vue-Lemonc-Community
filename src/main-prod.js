import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Axios from 'axios'
// 导入全局样式表
import './assets/scss/global.scss'
// 导入iconfont样式
import './assets/iconfont/iconfont.css'
// 引入axios
import { request } from './api/request'
Vue.prototype.$http = request

// 解决跨域
Axios.defaults.withCredentials = true

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
