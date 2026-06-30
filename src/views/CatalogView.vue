<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { SlidersHorizontal, X } from 'lucide-vue-next'
import { useProductsStore } from '@/stores/products'
import ProductCard from '@/components/catalog/ProductCard.vue'
import { CATEGORIES } from '@/utils/helpers'
import { SITE_IMAGES } from '@/utils/images'

const route = useRoute()
const router = useRouter()
const productsStore = useProductsStore()

const activeCategory = ref(route.query.category || '')
const search = ref(route.query.q || '')
const minPrice = ref(route.query.minPrice || '')
const maxPrice = ref(route.query.maxPrice || '')
const sortBy = ref('default')
const showFilters = ref(false)
const showSuggestions = ref(false)
const searchSuggestions = ref([])

const filteredProducts = computed(() => {
  let list = productsStore.getByCategory(activeCategory.value || 'all')
  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    list = list.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
  }
  if (minPrice.value) list = list.filter((p) => p.price >= Number(minPrice.value))
  if (maxPrice.value) list = list.filter((p) => p.price <= Number(maxPrice.value))
  if (sortBy.value === 'price-asc') list = [...list].sort((a, b) => a.price - b.price)
  if (sortBy.value === 'price-desc') list = [...list].sort((a, b) => b.price - a.price)
  if (sortBy.value === 'name') list = [...list].sort((a, b) => a.name.localeCompare(b.name))
  return list
})

const allProducts = computed(() => productsStore.products)

const categoryCounts = computed(() => {
  const counts = {}
  productsStore.products.forEach((p) => { counts[p.category] = (counts[p.category] || 0) + 1 })
  return counts
})

const pageTitle = computed(() => {
  const cat = CATEGORIES.find((c) => c.id === activeCategory.value)
  return cat ? cat.label : 'Каталог'
})

const heroImage = computed(() =>
  activeCategory.value ? SITE_IMAGES.categories[activeCategory.value] : SITE_IMAGES.hero.main
)

function updateSuggestions() {
  const q = search.value.toLowerCase().trim()
  if (q.length >= 1) {
    const names = [...new Set(
      allProducts.value
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
  search.value = suggestion
  showSuggestions.value = false
}

function onSearchBlur() {
  setTimeout(() => { showSuggestions.value = false }, 200)
}

watch([activeCategory, search, minPrice, maxPrice], () => {
  const query = {}
  if (activeCategory.value) query.category = activeCategory.value
  if (search.value) query.q = search.value
  if (minPrice.value) query.minPrice = minPrice.value
  if (maxPrice.value) query.maxPrice = maxPrice.value
  router.replace({ query })
})

watch(() => route.query, (q) => {
  if (q.category !== activeCategory.value)
    activeCategory.value = q.category || ''
  if (q.q !== search.value)
    search.value = q.q || ''
  if (q.minPrice !== minPrice.value)
    minPrice.value = q.minPrice || ''
  if (q.maxPrice !== maxPrice.value)
    maxPrice.value = q.maxPrice || ''
}, { deep: true })

function resetFilters() {
  activeCategory.value = ''
  search.value = ''
  minPrice.value = ''
  maxPrice.value = ''
  sortBy.value = 'default'
}
</script>

<template>
  <section class="bg-forest-light">
    <div class="container-wrap py-10 animate-fade-up">
      <nav class="crumbs"><RouterLink to="/" class="hover:text-forest">Главная</RouterLink> / <span>{{ pageTitle }}</span></nav>
      <h1 class="mt-3 font-display text-3xl font-extrabold sm:text-4xl">{{ pageTitle }}</h1>
      <p class="mt-1 text-muted">{{ filteredProducts.length }} товаров для ваших питомцев</p>
    </div>
  </section>

  <div class="container-wrap grid items-start gap-8 py-10 pb-16 lg:grid-cols-[260px_1fr]">
    <button class="btn-outline btn-sm w-fit lg:hidden" @click="showFilters = !showFilters">
      <SlidersHorizontal class="h-4 w-4" /> Фильтры
    </button>

    <aside class="panel sticky top-[88px] !p-5" :class="{ 'hidden lg:block': !showFilters, block: showFilters }">
      <h3 class="mb-4 font-display font-bold text-forest">Фильтры</h3>
      <div class="filter-group">
        <h4 class="mb-2 text-sm font-extrabold">Категория</h4>
        <div class="relative mb-4">
          <input v-model="search" type="text" placeholder="Поиск товаров..." class="input !py-2 text-sm" @input="updateSuggestions" @focus="updateSuggestions" @blur="onSearchBlur" />
          <div v-if="showSuggestions" class="absolute left-0 right-0 top-full z-10 mt-1 rounded-lg border border-line bg-white py-1 shadow-lg">
            <button v-for="s in searchSuggestions" :key="s" class="block w-full px-3 py-2 text-left text-sm hover:bg-forest-light" @mousedown.prevent="selectSuggestion(s)">{{ s }}</button>
          </div>
        </div>
        <label class="filter-label">
          <input type="radio" :checked="!activeCategory" @change="activeCategory = ''" />
          <span>Все ({{ productsStore.products.length }})</span>
        </label>
        <label v-for="cat in CATEGORIES" :key="cat.id" class="filter-label">
          <input type="radio" :checked="activeCategory === cat.id" @change="activeCategory = cat.id" />
          <span>{{ cat.label }} ({{ categoryCounts[cat.id] || 0 }})</span>
        </label>
      </div>
      <div class="filter-group">
        <h4 class="mb-2 text-sm font-extrabold">Цена, ₽</h4>
        <div class="flex gap-2">
          <input v-model="minPrice" type="number" placeholder="от" class="input !py-2 text-sm" min="0" />
          <input v-model="maxPrice" type="number" placeholder="до" class="input !py-2 text-sm" min="0" />
        </div>
      </div>
      <button class="mt-3 w-full text-sm font-bold text-muted hover:text-coral" @click="resetFilters">Сбросить</button>
    </aside>

    <div>
      <div class="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p class="font-bold text-muted">Найдено: <span class="text-forest">{{ filteredProducts.length }}</span></p>
        <select v-model="sortBy" class="rounded-paw border-2 border-line bg-white px-3 py-2 text-sm font-semibold">
          <option value="default">По умолчанию</option>
          <option value="price-asc">Цена ↑</option>
          <option value="price-desc">Цена ↓</option>
          <option value="name">По названию</option>
        </select>
      </div>

      <div v-if="activeCategory || search" class="mb-5 flex flex-wrap gap-2">
        <button v-if="activeCategory" class="tag-forest" @click="activeCategory = ''">
          {{ CATEGORIES.find(c => c.id === activeCategory)?.label }} <X class="ml-1 inline h-3 w-3" />
        </button>
        <button v-if="search" class="tag-honey" @click="search = ''">«{{ search }}» <X class="ml-1 inline h-3 w-3" /></button>
      </div>

      <div v-if="filteredProducts.length" class="grid grid-cols-2 gap-4 xl:grid-cols-3">
        <ProductCard v-for="(product, i) in filteredProducts" :key="product.id" :product="product" :style="{ animationDelay: `${(i % 6) * 80}ms` }" class="animate-fade-up" />
      </div>

      <div v-else class="rounded-blob border-2 border-dashed border-line py-20 text-center">
        <p class="mt-3 font-display text-xl font-bold">Ничего не нашли</p>
        <p class="text-muted">Попробуйте другие фильтры</p>
        <button class="btn-forest mt-6" @click="resetFilters">Сбросить фильтры</button>
      </div>
    </div>
  </div>
</template>
