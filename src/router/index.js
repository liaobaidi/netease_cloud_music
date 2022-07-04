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
        path: 'play',
        name: 'play',
        component: () => import('@/views/Play/index.vue')
      },
      {
        path: 'mine',
        name: 'mine',
        component: () => import('@/views/Mine/index.vue')
      },
      {
        path: 'like',
        name: 'like',
        component: () => import('@/views/Like/index.vue')
      },
      {
        path: 'community',
        name: 'community',
        component: () => import('@/views/Community/index.vue')
      }
    ]
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
    path: '/fm/:id',
    name: 'fm',
    component: () => import('@/views/FM/index.vue'),
    props: true
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
