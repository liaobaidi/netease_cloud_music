import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'
import store from '@/store'
import './permission.js'
import Vant from 'vant'
import 'vant/lib/index.css'
import 'virtual:svg-icons-register' // 引入注册脚本
import SvgIcon from '@/components/SvgIcon.vue' // 引入组件
import SwiperAction from '@/components/swiperAction.vue'

const app = createApp(App)

app.use(router)
app.use(store)
app.use(Vant)
app.component('svg-icon', SvgIcon)
app.component('swiper-action', SwiperAction)

app.directive('focus', {
  // 当被绑定的元素挂载到 DOM 中时……
  mounted(el) {
    // 聚焦元素
    el.focus()
  }
})

app.mount('#app')
