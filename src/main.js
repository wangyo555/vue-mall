import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'

// 导入element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// 导入全局样式表
import './assets/css/global.css'

Vue.config.productionTip = false

// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config => {
        // console.log(config)
        config.headers.authorization = window.sessionStorage.getItem('token')
        return config
    })
    // 将axios挂载到Vue的原型对象$http上，之后就可以通过this.$http调用axios方法
Vue.prototype.$http = axios

// 让vue引用Element ui
Vue.use(ElementUI)


new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')