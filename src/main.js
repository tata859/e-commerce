import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
//基础样式表
import "assets/css/base.css"
//图标样式表
import "assets/fonts/iconfont.css"
//
import TreeTable from 'vue-table-with-tree-grid'

import axios from 'axios'
//进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

//请求的基础路径
axios.defaults.baseURL = 'http://118.89.195.61:8888/api/private/v1/'
axios.interceptors.request.use(config=>{
  config.headers.Authorization = window.sessionStorage.getItem("token")
  NProgress.start();
  return config
})
axios.interceptors.response.use(config=>{
  NProgress.done();
  return config
})

Vue.prototype.$http = axios



Vue.component("tree-table", TreeTable)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
