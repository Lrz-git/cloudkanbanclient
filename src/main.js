import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
// 引用elementUI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 注入elementUI
Vue.use(ElementUI)

//导入时间格式化组件库
import moment from 'moment'
Vue.prototype.$moment = moment;//赋值使用

//阻止显示生产模式的消息
Vue.config.productionTip = false


new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
