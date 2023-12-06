import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/TabsPage.vue'

import LogInView from "@/views/LogInView.vue";
import SignUpView from "@/views/SignUpView.vue";
import DetailView from "@/views/DetailView.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/authentication',
  },
  {
    path: '/authentication',
    component: LogInView
  },
  {
    path: '/signup',
    component: SignUpView
  },
  {
    path: "/detail/:id",
    component: DetailView
  },
  { path: '/tabs',
    component: TabsPage,
    children: [
      {
        path: '',
        redirect: '/tabs/gallery'
      },
      {
        path: 'search',
        component: () => import ("@/views/SearchView.vue")
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
        path: 'profile',
        component: () => import  ("@/views/ProfileView.vue")
      }

    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
