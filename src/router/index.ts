import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'
import LoginView from '@/views/LoginView.vue'
import MainPageView from '@/views/MainPageView.vue'
import DeliveryView from '@/views/DeliveryView.vue'
import AllDeliveriesView from '@/views/AllDeliveriesView.vue'
import AddDeliveryView from '@/views/AddDeliveryView.vue'
import SuppliersView from '@/views/SuppliersView.vue'
//import AllDeliveryListsView from '@/views/AllDeliveryListsView.vue'
//import ListByDeliveryID from '@/views/ListByDeliveryID.vue'
import StartDelivery from '@/views/StartDelivery.vue'

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
    // {
    //   path: '/deliveries/lists',
    //   name: 'all-deliveries-lists',
    //   component: AllDeliveryListsView,
    //   meta: { section: 'deliveries' }
    // },
    // {
    //   path: '/deliveries/:id/lists',
    //   name: 'deliveriy-lists',
    //   component: ListByDeliveryID,
    //   meta: { section: 'deliveries' }
    // },
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