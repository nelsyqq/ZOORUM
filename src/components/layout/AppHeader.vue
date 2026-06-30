<script setup>
import { ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { ShoppingBag, Menu, X, Search, Shield } from 'lucide-vue-next'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { useProductsStore } from '@/stores/products'
import { CATEGORIES } from '@/utils/helpers'
import { SITE_IMAGES } from '@/utils/images'

const route = useRoute()
const router = useRouter()
const cart = useCartStore()
const auth = useAuthStore()
const productsStore = useProductsStore()
const mobileOpen = ref(false)
const searchQuery = ref('')
const showSuggestions = ref(false)
const searchSuggestions = ref([])

const categoryLinks = CATEGORIES.map((c) => ({
  to: `/catalog?category=${c.id}`,
  label: c.label,
  id: c.id,
}))

function isCategoryActive(id) {
  return route.path === '/catalog' && route.query.category === id
}

function closeMobile() {
  mobileOpen.value = false
  document.body.classList.remove('overflow-hidden')
}

function toggleMobile() {
  mobileOpen.value = !mobileOpen.value
  document.body.classList.toggle('overflow-hidden', mobileOpen.value)
}

function submitSearch(e) {
  e.preventDefault()
  router.push({ path: '/catalog', query: searchQuery.value ? { q: searchQuery.value } : {} })
  showSuggestions.value = false
  closeMobile()
}

function onSearchInput() {
  const q = searchQuery.value.toLowerCase().trim()
  if (q.length >= 1) {
    const names = [...new Set(
      productsStore.products
        .filter(p => p.name.toLowerCase().includes(q))
        .map(p => p.name)
    )].slice(0, 6)
    searchSuggestions.value = names
    showSuggestions.value = names.length > 0
  } else {
    showSuggestions.value = false
  }
}

function selectSuggestion(suggestion) {
  searchQuery.value = suggestion
  showSuggestions.value = false
  router.push({ path: '/catalog', query: { q: suggestion } })
  closeMobile()
}

function onSearchBlur() {
  setTimeout(() => { showSuggestions.value = false }, 200)
}
</script>

<template>
  <header class="sticky top-0 z-50 border-b-2 border-line bg-cream/95 backdrop-blur-md">
    <div class="container-wrap flex h-[72px] items-center gap-4">
      <button class="icon-btn lg:hidden" aria-label="Меню" @click="toggleMobile">
        <Menu v-if="!mobileOpen" class="h-5 w-5" />
        <X v-else class="h-5 w-5" />
      </button>

      <RouterLink to="/" class="flex shrink-0 items-center gap-1.5 sm:gap-2" @click="closeMobile">
        <img src="/images/logo.jpg" alt="ЗООРУМ" class="h-7 w-7 rounded-md object-cover shadow-soft sm:h-9 sm:w-9" />
        <div class="leading-none">
          <span class="font-display text-lg font-extrabold text-forest sm:text-2xl">ЗООРУМ</span>
          <span class="hidden text-[10px] font-bold uppercase tracking-[0.2em] text-muted sm:block">для питомцев</span>
        </div>
      </RouterLink>

      <nav class="hidden flex-1 items-center justify-center gap-1 lg:flex">
        <RouterLink
          v-for="cat in categoryLinks"
          :key="cat.id"
          :to="cat.to"
          class="flex items-center gap-1 rounded-full px-2 py-2 text-xs font-bold transition-colors lg:px-3 lg:text-sm"
          :class="isCategoryActive(cat.id) ? 'bg-forest-light text-forest-dark' : 'text-muted hover:bg-honey-light hover:text-ink'"
        >
          {{ cat.label }}
        </RouterLink>
        <span class="text-muted/30">|</span>
        <RouterLink to="/about" class="rounded-full px-2 py-2 text-xs font-bold transition-colors lg:px-3 lg:text-sm" :class="route.path === '/about' ? 'bg-forest-light text-forest-dark' : 'text-muted hover:bg-honey-light hover:text-ink'">О нас</RouterLink>
        <RouterLink to="/contacts" class="rounded-full px-2 py-2 text-xs font-bold transition-colors lg:px-3 lg:text-sm" :class="route.path === '/contacts' ? 'bg-forest-light text-forest-dark' : 'text-muted hover:bg-honey-light hover:text-ink'">Контакты</RouterLink>
      </nav>

      <div class="ml-auto flex items-center gap-2">
        <form class="relative hidden items-center rounded-full border-2 border-line bg-white py-1 pl-4 pr-1 md:flex" @submit="submitSearch">
          <div class="flex w-full items-center gap-1">
            <Search class="h-4 w-4 shrink-0 text-muted" />
            <input v-model="searchQuery" type="search" placeholder="Найти корм, игрушку…" class="w-28 border-none bg-transparent text-sm outline-none lg:w-40" @input="onSearchInput" @focus="onSearchInput" @blur="onSearchBlur" />
            <button type="submit" class="rounded-full bg-forest px-3 py-1.5 text-xs font-bold text-white">OK</button>
          </div>
          <div v-if="showSuggestions" class="absolute left-0 right-0 top-full z-10 mt-1 rounded-lg border border-line bg-white py-1 shadow-lg">
            <button v-for="s in searchSuggestions" :key="s" class="block w-full px-3 py-2 text-left text-sm hover:bg-forest-light" @mousedown.prevent="selectSuggestion(s)">{{ s }}</button>
          </div>
        </form>

        <RouterLink v-if="auth.isAdmin" to="/admin" class="hidden rounded-full bg-ink px-3 py-2 text-xs font-bold text-white sm:flex">
          <Shield class="mr-1 inline h-3.5 w-3.5" /> Админ
        </RouterLink>

        <button class="icon-btn" aria-label="Корзина" @click="cart.toggleCart()">
          <ShoppingBag class="h-5 w-5" />
          <span v-if="cart.totalItems > 0" class="badge-count">{{ cart.totalItems }}</span>
        </button>

        <RouterLink
          to="/profile"
          class="hidden rounded-paw bg-honey px-4 py-2.5 text-sm font-extrabold text-ink transition-colors hover:bg-honey-dark sm:inline-flex"
        >
          <img v-if="auth.isAuthenticated" :src="SITE_IMAGES.pets.dogs" alt="Avatar" class="mr-2 h-5 w-5 rounded-full object-cover" />
          {{ auth.isAuthenticated ? `${auth.userName.split(' ')[0]}` : 'Войти' }}
        </RouterLink>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="mobileOpen" class="drawer-overlay lg:hidden" @click="closeMobile" />
      <nav v-if="mobileOpen" class="fixed right-0 top-0 z-[70] flex h-full w-[min(320px,88vw)] flex-col gap-1 overflow-y-auto bg-cream p-5 shadow-paw lg:hidden">
        <div class="mb-4 flex items-center justify-between">
          <span class="font-display text-xl font-bold text-forest">Меню</span>
          <button class="icon-btn" @click="closeMobile"><X class="h-5 w-5" /></button>
        </div>
        <form class="relative mb-3 flex gap-2" @submit="submitSearch">
          <input v-model="searchQuery" type="search" placeholder="Поиск…" class="input flex-1 !py-2" @input="onSearchInput" @focus="onSearchInput" @blur="onSearchBlur" />
          <button type="submit" class="btn-forest btn-sm">OK</button>
          <div v-if="showSuggestions" class="absolute left-0 right-0 top-full z-10 mt-1 rounded-lg border border-line bg-white py-1 shadow-lg">
            <button v-for="s in searchSuggestions" :key="s" class="block w-full px-3 py-2 text-left text-sm hover:bg-forest-light" @mousedown.prevent="selectSuggestion(s)">{{ s }}</button>
          </div>
        </form>
        <RouterLink to="/" class="rounded-paw px-3 py-3 font-bold hover:bg-forest-light" @click="closeMobile">Главная</RouterLink>
        <RouterLink to="/catalog" class="rounded-paw px-3 py-3 font-bold hover:bg-forest-light" @click="closeMobile">Каталог</RouterLink>
        <RouterLink v-for="cat in categoryLinks" :key="cat.id" :to="cat.to" class="rounded-paw px-3 py-3 font-bold hover:bg-forest-light" @click="closeMobile">
          {{ cat.label }}
        </RouterLink>
        <RouterLink to="/about" class="rounded-paw px-3 py-3 font-bold hover:bg-forest-light" @click="closeMobile">О нас</RouterLink>
        <RouterLink to="/contacts" class="rounded-paw px-3 py-3 font-bold hover:bg-forest-light" @click="closeMobile">Контакты</RouterLink>
        <RouterLink to="/admin" class="rounded-paw px-3 py-3 font-bold hover:bg-forest-light" @click="closeMobile">Админ-панель</RouterLink>
        <RouterLink to="/profile" class="btn-honey mt-4" @click="closeMobile">Личный кабинет</RouterLink>
      </nav>
    </Teleport>
  </header>
</template>
