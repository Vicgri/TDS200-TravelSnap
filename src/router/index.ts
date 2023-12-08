import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/TabsPage.vue'
import DetailView from "@/views/DetailView.vue";
import LogInView from "@/views/LogInView.vue";
import SignUpView from "@/views/SignUpView.vue";
import { NavigationGuard } from 'vue-router';
import { onAuthStateChanged } from 'firebase/auth';
import {auth} from "@/main";

const requireAuth: NavigationGuard = (to, from, next) => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is authenticated, allow access to specific routes
      const allowedRoutes = ['/tabs/gallery', '/tabs/search', '/tabs/upload', '/tabs/profile'];

      if (allowedRoutes.includes(to.path)) {
        // Allow access to the specified route
        next();
      } else {
        // Redirect to the default gallery route or any other default route you prefer
        next({ path: '/tabs/gallery' });
      }
    } else {
      // User is not authenticated, redirect to the login page
      next({ name: 'authentication' });
    }
  });
};


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

  { path: '/tabs',
    component: TabsPage,
    children: [
      {
        path: '',
        redirect: '/tabs/gallery'
      },
      {
        path: "/detail/:id",
        component: DetailView
      },
      {
        path: 'search',
        component: () => import ("@/views/SearchView.vue"),
        beforeEnter: requireAuth,
      },

      {
        path: 'gallery',
        component: () => import ("@/views/GalleryView.vue"),
        beforeEnter: requireAuth,
      },
      {
        path: 'upload',
        component: () => import ("@/views/UploadView.vue"),
        beforeEnter: requireAuth,
      },
      {
        path: 'profile',
        component: () => import  ("@/views/ProfileView.vue"),
        beforeEnter: requireAuth,
      }

    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
