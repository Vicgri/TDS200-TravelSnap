import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/TabsPage.vue'
import DetailView from "@/views/DetailView.vue";
import LogInView from "@/views/LogInView.vue";
import SignUpView from "@/views/SignUpView.vue";

const parseJwt = (token:string) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (error) {
    return null;
  }
};

  const authenticationRouteGuard = async () => {
  const userAccessToken = localStorage.getItem("auth_token");
  if (!userAccessToken) {
    return { path: '/authentication' }
  }

  const jwtPayload = parseJwt(userAccessToken);

  const userAccessTokenExpiresAt = jwtPayload?.exp as unknown as number;

  if (userAccessTokenExpiresAt < Date.now()/1000) {
    // token expired
    localStorage.removeItem("auth_token");
    const errorToast = await toastController.create({
      message: "Your session is over. Please log in.",
      duration: 3000,
      color: "warning"
    });

    await errorToast.present();

    await authService.logout();
    return { name: "Login" }
  }
  //}

}
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
    component: DetailView,
    beforeEnter: [authenticationRouteGuard]
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
        component: () => import ("@/views/SearchView.vue"),
        beforeEnter: [authenticationRouteGuard]
      },

      {
        path: 'gallery',
        component: () => import ("@/views/GalleryView.vue")
      },
      {
        path: 'upload',
        component: () => import ("@/views/UploadView.vue"),
        beforeEnter: [authenticationRouteGuard]
      },
      {
        path: 'profile',
        component: () => import  ("@/views/ProfileView.vue"),
        beforeEnter: [authenticationRouteGuard]
      }

    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
