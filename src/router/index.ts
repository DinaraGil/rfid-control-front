import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import MainPageView from '@/views/MainPageView.vue'
import DeliveryView from '@/views/DeliveryView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: MainPageView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/deliveries',
      name: 'deliveries',
      component: DeliveryView,
    },
  ],
})

export default router
