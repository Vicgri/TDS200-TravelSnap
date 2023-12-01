import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/TabsPage.vue'
import AuthenticationPage from "@/views/AuthenticationPage.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/authentication',
  },
  {
    path: '/authentication',
    component: AuthenticationPage
  },
  { path: '/tabs',
    component: TabsPage,
    children: [
      {
        path: '',
        redirect: '/tabs/gallery'
      },
      {
        path: 'profile',
        component: () => import  ("@/views/ProfileView.vue")
      },
      {
        path: 'gallery',
        component: () => import ("@/views/GalleryView.vue")
      },
      {
        path: 'upload',
        component: () => import ("@/views/UploadView.vue")
      },
      {
        path: 'search',
        component: () => import ("@/views/SearchView.vue")
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
