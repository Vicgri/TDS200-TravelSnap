import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/TabsPage.vue'
<<<<<<< HEAD
import LogInView from "@/views/LogInView.vue";
import SignUpView from "@/views/SignUpView.vue";

=======
import AuthenticationPage from "@/views/AuthenticationPage.vue";
import DetailView from "@/views/DetailView.vue";
>>>>>>> 079ab07f88b3af2c50a89854bf24734759b89b18

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
