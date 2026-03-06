import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import MainPageView from '@/views/MainPageView.vue'
import DeliveryView from '@/views/DeliveryView.vue'
import AllDeliveriesView from '@/views/AllDeliveriesView.vue'
import AddDeliveryView from '@/views/AddDeliveryView.vue'
import SuppliersView from '@/views/SuppliersView.vue'
import AllDeliveryListsView from '@/views/AllDeliveryListsView.vue'

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
      path: '/deliveries/all',
      name: 'all-deliveries',
      component: AllDeliveriesView,
      meta: {section: 'deliveries'}
    },
        {
      path: '/deliveries/lists',
      name: 'all-deliveries-lists',
      component: AllDeliveryListsView,
      meta: {section: 'deliveries'}
    },
    {
      path: '/deliveries/add',
      name: 'add-delivery',
      component: AddDeliveryView,
      meta: {section: 'deliveries'}
    },
    {
      path: '/suppliers/all',
      name: 'all-suppliers',
      component: SuppliersView,
      meta: {section: 'suppliers'}
    },
    {
      path: '/suppliers/add',
      name: 'add-suppliers',
      component: SuppliersView,
      meta: {section: 'suppliers'}
    },
  ],
})

export default router
