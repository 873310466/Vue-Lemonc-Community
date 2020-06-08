import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Axios from 'axios'
// 导入Element-UI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/theme-chalk/display.css'
// 导入全局样式表
import './assets/scss/global.scss'

// 导入iconfont样式
import './assets/iconfont/iconfont.css'

// 引入mavon-editor 就是markdown编辑器
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

// 引入axios
import { request } from './api/request'
Vue.prototype.$http = request

// 解决跨域
Axios.defaults.withCredentials = true

Vue.config.productionTip = false
// 使用element-ui
Vue.use(ElementUI)

// 让Vue使用mavonEditor
Vue.use(mavonEditor)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
