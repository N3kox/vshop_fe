import Vue from 'vue'
import App from './App.vue'
import VueResource from 'vue-resource'
import VueRouter from 'vue-router'
import element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import routers from './routers'
import base from './base'

Vue.config.productionTip = false
Vue.use(VueResource)
Vue.use(element)
Vue.use(VueRouter)
Vue.use(base)

const router = new VueRouter({
  mode : 'history',
  routes : routers
})

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
