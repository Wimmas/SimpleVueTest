import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SignUp from '@/views/SignUp.vue'
import Login from '@/views/Login.vue'
import Dashboard from '@/views/Dashboard.vue'
import NotFound from '@/views/404.vue'
import AccountSettings from '@/views/AccountSettings.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/:any',
      name: 'notFound',
      component: NotFound
    },
    {
      path: '/:name:email',
      name: 'dashboard',
      component: Dashboard,
      props: true
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignUp
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/:email:name',
      name: 'account',
      component: AccountSettings,
      props: true
    },
  ]
})

export default router
