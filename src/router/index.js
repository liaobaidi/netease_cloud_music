import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  { path: '/', redirect: '/home' },
  {
    path: '/home',
    name: 'home',
    redirect: '/home/find',
    component: () => import('@/views/Home/index.vue'),
    children: [
      {
        path: 'find',
        name: 'find',
        component: () => import('@/views/Find/index.vue')
      },
      {
        path: 'mine',
        name: 'mine',
        component: () => import('@/views/Mine/index.vue'),
      }
    ]
  },
  {
    path: '/userinfo/:id',
    name: 'userinfo',
    component: () => import('@/views/Mine/userInfo.vue'),
    props: true
  },
  {
    path: '/subscribe/:id',
    name: 'subscribe',
    component: () => import('@/views/Subscribe/index.vue'),
    props: true
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login/index.vue')
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('@/views/Search/index.vue')
  },
  {
    path: '/songsheet/:id',
    name: 'songsheet',
    component: () => import('@/views/SongSheet/index.vue'),
    props: true
  },
  {
    path: '/square',
    name: 'square',
    component: () => import('@/views/SongSheet/Square.vue')
  },
  {
    path: '/toplist',
    name: 'toplist',
    component: () => import('@/views/SongSheet/TopList.vue')
  },
  {
    path: '/fm/:id',
    name: 'fm',
    component: () => import('@/views/FM/index.vue'),
    props: true
  },
  {
    path: '/level',
    name: 'level',
    component: () => import('@/views/MyLevel/index.vue')
  },
  {
    path: '/recommend',
    name: 'recommend',
    component: () => import('@/views/Recommend/index.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
