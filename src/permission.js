import router from '@/router'
import { getToken } from '@/utils/cookie.js'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

router.beforeEach((to, from, next) => {
  NProgress.start()
  const token = getToken()
  if (token) {
    // have token
    if (to.path === '/login') {
      next('/home')
      NProgress.done()
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
