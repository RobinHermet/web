import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import submitTournamentView from '../views/submitTournamentView.vue'
import newsView from '../views/newsView.vue'
import submitNewsView from '../views/submitNewsView.vue'
import indexView from '../views/indexView.vue'
import loginView from '../views/indexView.vue'
import signupView from '../views/indexView.vue'
import myAccountView from '../views/myAccountView'
import usersView from '../views/usersView'
import aboutView from '../views/aboutView'


const routes = [
  {
    path: '/',
    name: 'index',
    component :  indexView //c'est marqué component mais ça correspond en fait à une view 
  },
  {
    path: '/login',
    name: 'login',
    component: loginView 
  },
  {
    path: '/signup',
    name: 'signup',
    component: signupView 
  },
  {
    path: '/home',
    name: 'home',
    component: HomeView, 
    meta: { requireAuth: true }
  },
 
  {
    path: '/submit/tournament',
    name: 'submitTournament',
    component: submitTournamentView,
    meta: { requireAuth: true }
  },

  {
    path: '/news',
    name: 'news',
    component: newsView,
    meta: { requireAuth: true }
  },
  {
    path: '/submit/news',
    name: 'submitNews',
    component: submitNewsView,
    meta: { requireAuth: true }
  },
  {
    path: '/account',
    name: 'account',
    component: myAccountView,
    meta: { requireAuth: true }
  },
  {
    path: '/users',
    name: 'users',
    component: usersView,
    meta: { requireAdminAuth: true }
  },

  {
    path: '/about',
    name: 'about',
    component: aboutView,
    meta: { requireAuth: true }
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {
    if (!sessionStorage.getItem("Token")) {
      next("/");
    } else {
      next();
    }
  } else {
    next();
  }
});

router.beforeEach((to, from, next) => {
  if (to.meta.requireAdminAuth) {
    if (sessionStorage.getItem("isAdmin") != 1) {
      next("/home");
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router
