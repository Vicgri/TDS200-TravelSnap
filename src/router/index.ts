import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/TabsPage.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/tabs/authentication'
  },
  {
    path: '/tabs/',
    component: TabsPage,
    children: [
      {
        path: '',
        redirect: '/tabs/gallery'
      },
      {
        path: 'authentication',
        component: () => import (("@/views/AuthenticationPage.vue"))
      },
      {
        path: 'gallery',
        component: () => import('@/views/Tab1Page.vue')
      },
      {
        path: 'upload',
        component: () => import('@/views/Tab2Page.vue')
      },
      {
        path: 'search',
        component: () => import('@/views/Tab3Page.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
