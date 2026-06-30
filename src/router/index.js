import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: 'Главная' },
  },
  {
    path: '/catalog',
    name: 'catalog',
    component: () => import('@/views/CatalogView.vue'),
    meta: { title: 'Каталог' },
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/AboutView.vue'),
    meta: { title: 'О нас' },
  },
  {
    path: '/contacts',
    name: 'contacts',
    component: () => import('@/views/ContactsView.vue'),
    meta: { title: 'Контакты' },
  },
  {
    path: '/product/:id(\\d+)',
    name: 'product',
    component: () => import('@/views/ProductDetailView.vue'),
    meta: { title: 'Товар' },
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/ProfileView.vue'),
    meta: { title: 'Личный кабинет' },
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('@/views/AdminView.vue'),
    meta: { title: 'Админ-панель', requiresAdmin: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  },
})

router.beforeEach((to) => {
  document.title = `${to.meta.title} — ЗООРУМ`

  if (to.meta.requiresAdmin) {
    const auth = useAuthStore()
    if (!auth.isAuthenticated) {
      return { name: 'profile', query: { redirect: to.fullPath } }
    }
    if (!auth.isAdmin) {
      return { name: 'home' }
    }
  }
})

export default router
