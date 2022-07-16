import router from '@/router'
import { getToken } from '@/utils/cookie.js'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { check } from '@/api/music.js'
import { Toast } from 'vant'

router.beforeEach((to, from, next) => {
  NProgress.start()
  const token = getToken()
  if (token) {
    // have token
    if (to.name === 'login') {
      next('/home')
      NProgress.done()
    } else if (to.name === 'listen') {
      check({ id: to.params.id }).then((res) => {
        if (res.success) {
          next()
          NProgress.done()
        } else {
          Toast.fail(res.message)
          next({ name: from.name, params: from.params })
          NProgress.done()
        }
      })
    } else {
      next()
      NProgress.done()
    }
  } else {
    // have not token
    if (to.path.indexOf('/home') !== -1) {
      next('/login')
      NProgress.done()
    } else {
      next()
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
