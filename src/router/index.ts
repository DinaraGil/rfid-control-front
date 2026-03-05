import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import MainPageView from '@/views/MainPageView.vue'
import DeliveryView from '@/views/DeliveryView.vue'
import AllDeliveriesView from '@/views/AllDeliveriesView.vue'
import AddDeliveryView from '@/views/AddDeliveryView.vue'

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
    {
      path: '/deliveries/all',
      name: 'all-deliveries',
      component: AllDeliveriesView,
      meta: {menuKey: 'all-deliveries', menuTitle: 'Просмотр поставок'}
    },
    {
      path: '/deliveries/add',
      name: 'add-delivery',
      component: AddDeliveryView,
      meta: {menuKey: 'add-delivery', menuTitle: 'Добавление поставок'}
    },
  ],
})

export default router
