import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'
import LoginView from '@/views/LoginView.vue'
import MainPageView from '@/views/MainPageView.vue'
import NewReportsView from '@/views/NewReportsView.vue'
import AllReportsView from '@/views/AllReportsView.vue'
import AllDeliveriesView from '@/views/AllDeliveriesView.vue'
import AllShipmentsView from '@/views/AllShipmentsView.vue'
import AddDeliveryView from '@/views/AddDeliveryView.vue'
import SuppliersView from '@/views/SuppliersView.vue'
import StocksView from '@/views/StocksView.vue'
//import AllDeliveryListsView from '@/views/AllDeliveryListsView.vue'
//import ListByDeliveryID from '@/views/ListByDeliveryID.vue'
import StartDelivery from '@/views/StartDelivery.vue'
import StartShipmentView from '@/views/StartShipmentView.vue'
import AddShipmentView from '@/views/AddShipmentView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: MainPageView,
      meta: { public: true }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { public: true }
    },
    {
      path: '/deliveries/all',
      name: 'all-deliveries',
      component: AllDeliveriesView,
      meta: { section: 'deliveries' }
    },
    {
      path: '/deliveries/:id/lists/start',
      name: 'start-deliveriy-lists',
      component: StartDelivery,
      meta: { section: 'deliveries' }
    },
    {
      path: '/deliveries/add',
      name: 'add-delivery',
      component: AddDeliveryView,
      meta: {
        section: 'deliveries',
        requiresAdmin: true
      }
    },
    {
      path: '/shipments/all',
      name: 'all-shipments',
      component: AllShipmentsView,
      meta: { section: 'shipments' }
    },
    {
      path: '/shipments/add',
      name: 'add-shipment',
      component: AddShipmentView,
      meta: {
        section: 'shipments',
        requiresAdmin: true
      }
    },
    {
      path: '/shipments/:id/lists/start',
      name: 'start-shipment-lists',
      component: StartShipmentView,
      meta: { section: 'shipments' }
    },
    {
      path: '/suppliers/all',
      name: 'all-suppliers',
      component: SuppliersView,
      meta: {
        section: 'suppliers',
        requiresAdmin: true
      }
    },
    {
      path: '/suppliers/add',
      name: 'add-suppliers',
      component: SuppliersView,
      meta: {
        section: 'suppliers',
        requiresAdmin: true
      }
    },
    {
      path: '/stocks',
      name: 'get-stocks',
      component: StocksView,
    },
    {
      path: '/reports/new',
      name: 'new-reports',
      component: NewReportsView,
      meta: {
        section: 'reports',
        requiresAdmin: true
      }
    },
    {
      path: '/reports/all',
      name: 'all-reports',
      component: AllReportsView,
      meta: {
        section: 'reports',
        requiresAdmin: true
      }
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()

  const isPublic = to.matched.some(record => record.meta.public)
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin)

  if (!userStore.isAuthChecked) {
    await userStore.fetchMe()
  }

  if (!isPublic && !userStore.isAuthenticated) {
    return next({
      name: 'login',
      query: { redirect: to.fullPath }
    })
  }

  if (requiresAdmin && !userStore.isAdmin) {
    return next({ name: 'home' }) //мб страница forbidden
  }

  next()
})

export default router