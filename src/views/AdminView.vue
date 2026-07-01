<script setup>
import { ref, reactive, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { LayoutDashboard, ShoppingBag, Package, Users, MessageSquare, Plus, Pencil, Trash2, X, Save, TrendingUp, DollarSign, Archive, Star } from 'lucide-vue-next'
import { useProductsStore } from '@/stores/products'
import { useOrdersStore } from '@/stores/orders'
import { useAuthStore } from '@/stores/auth'
import { useFeedbackStore } from '@/stores/feedback'
import { useReviewsStore } from '@/stores/reviews'
import { CATEGORIES, formatPrice, formatDate, getCategoryLabel } from '@/utils/helpers'
import { SITE_IMAGES } from '@/utils/images'

const productsStore = useProductsStore()
const ordersStore = useOrdersStore()
const authStore = useAuthStore()
const feedbackStore = useFeedbackStore()
const reviewsStore = useReviewsStore()

const activeTab = ref('dashboard')
const showProductForm = ref(false)
const editingProduct = ref(null)
const editingCategory = ref(null)

const productForm = reactive({
  name: '',
  category: 'food',
  price: 0,
  oldPrice: null,
  description: '',
  stock: 0,
  image: '',
  images: [],
  weights: [],
})

const categoryForm = reactive({ label: '' })

const statusOptions = ['new', 'processing', 'shipped', 'delivered', 'cancelled']

const stats = computed(() => ({
  products: productsStore.products.length,
  orders: ordersStore.orders.length,
  users: authStore.users.length,
  feedback: feedbackStore.requests.length,
  revenue: ordersStore.orders.reduce((sum, o) => sum + o.total, 0),
  lowStock: productsStore.products.filter(p => p.stock <= 5).length,
}))

const recentOrders = computed(() =>
  [...ordersStore.orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5)
)

const categoryStats = computed(() => {
  const counts = {}
  productsStore.products.forEach(p => { counts[p.category] = (counts[p.category] || 0) + 1 })
  return CATEGORIES.map(c => ({ ...c, count: counts[c.id] || 0 }))
})

function resetProductForm() {
  productForm.name = ''
  productForm.category = 'food'
  productForm.price = 0
  productForm.oldPrice = null
  productForm.description = ''
  productForm.stock = 0
  productForm.image = ''
  productForm.images = []
  productForm.weights = []
  editingProduct.value = null
}

function openAddProduct() {
  resetProductForm()
  showProductForm.value = true
}

function openEditProduct(product) {
  editingProduct.value = product.id
  productForm.name = product.name
  productForm.category = product.category
  productForm.price = product.price
  productForm.oldPrice = product.oldPrice ?? null
  productForm.description = product.description
  productForm.stock = product.stock
  productForm.images = [...(product.images?.length ? product.images : [product.image || ''])]
  productForm.image = productForm.images[0] || ''
  productForm.weights = product.weights ? product.weights.map(w => ({ ...w })) : []
  showProductForm.value = true
}

function saveProduct() {
  if (!productForm.name || !productForm.price) return
  const data = {
    name: productForm.name,
    category: productForm.category,
    price: productForm.price,
    oldPrice: productForm.oldPrice || null,
    description: productForm.description,
    stock: productForm.stock,
    images: productForm.images.filter(Boolean),
    weights: productForm.weights.filter(w => w.label && w.price),
  }
  if (!data.images.length) data.images = ['']
  if (editingProduct.value) {
    productsStore.updateProduct(editingProduct.value, data)
  } else {
    productsStore.addProduct(data)
  }
  showProductForm.value = false
  resetProductForm()
}

function deleteProduct(id) {
  if (confirm('Удалить этот товар?')) {
    productsStore.deleteProduct(id)
  }
}

function deleteOrder(id) {
  if (confirm('Удалить этот заказ?')) {
    ordersStore.deleteOrder(id)
  }
}

function deleteUser(id) {
  if (confirm('Удалить этого пользователя?')) {
    authStore.deleteUser(id)
  }
}

function editCategory(cat) {
  editingCategory.value = cat.id
  categoryForm.label = cat.label
}

function saveCategory() {
  if (!categoryForm.label.trim()) return
  const cat = CATEGORIES.find(c => c.id === editingCategory.value)
  if (cat) cat.label = categoryForm.label.trim()
  editingCategory.value = null
}

function cancelEditCategory() {
  editingCategory.value = null
}

function deleteFeedback(id) {
  if (confirm('Удалить этот отзыв?')) {
    const idx = feedbackStore.requests.findIndex(r => r.id === id)
    if (idx !== -1) feedbackStore.requests.splice(idx, 1)
  }
}

function deleteProductReview(id) {
  if (confirm('Удалить этот отзыв на товар?')) {
    reviewsStore.deleteReview(id)
  }
}

const feedbackSubTab = ref('messages')

function getProductName(productId) {
  return productsStore.getById(productId)?.name || 'Товар удалён'
}

function onImageUpload(e) {
  const files = Array.from(e.target.files || [])
  const remaining = 5 - productForm.images.length
  if (remaining <= 0) return
  const toAdd = files.slice(0, remaining)
  toAdd.forEach((file) => {
    const reader = new FileReader()
    reader.onload = (ev) => {
      productForm.images.push(ev.target.result)
    }
    reader.readAsDataURL(file)
  })
  e.target.value = ''
}

function removeImage(index) {
  productForm.images.splice(index, 1)
}

function addWeight() {
  productForm.weights.push({ label: '', price: 0, oldPrice: null, stock: 0 })
}

function removeWeight(index) {
  productForm.weights.splice(index, 1)
}

const tabs = [
  { id: 'dashboard', label: 'Дашборд', icon: LayoutDashboard },
  { id: 'categories', label: 'Категории', icon: Archive },
  { id: 'products', label: 'Товары', icon: ShoppingBag },
  { id: 'orders', label: 'Заказы', icon: Package },
  { id: 'users', label: 'Пользователи', icon: Users },
  { id: 'feedback', label: 'Отзывы', icon: MessageSquare },
]
</script>

<template>
  <div class="container-wrap py-10 animate-fade-up">
    <div class="mb-8 flex items-center gap-6">
      <img :src="SITE_IMAGES.pets.dogs" alt="Админ" class="h-20 w-20 rounded-2xl object-cover shadow-soft" />
      <div>
        <h1 class="font-display text-3xl font-extrabold">Админ-панель</h1>
        <p class="mt-1 text-muted">Управление магазином ЗООРУМ</p>
      </div>
    </div>

    <div class="mt-6 flex gap-1 overflow-x-auto rounded-full bg-forest-light p-1">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-bold transition-colors"
        :class="activeTab === tab.id ? 'bg-white text-ink shadow-sm' : 'text-muted'"
        @click="activeTab = tab.id"
      >
        <component :is="tab.icon" class="h-4 w-4" />
        {{ tab.label }}
      </button>
    </div>

    <!-- Dashboard -->
    <div v-if="activeTab === 'dashboard'" class="mt-6 space-y-6">
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <div class="panel !p-5 text-center animate-fade-up delay-100">
          <ShoppingBag class="mx-auto h-6 w-6 text-forest" />
          <p class="mt-2 font-display text-2xl font-bold text-forest">{{ stats.products }}</p>
          <p class="text-xs font-bold text-muted">Товаров</p>
        </div>
        <div class="panel !p-5 text-center animate-fade-up delay-200">
          <Package class="mx-auto h-6 w-6 text-honey-dark" />
          <p class="mt-2 font-display text-2xl font-bold text-honey-dark">{{ stats.orders }}</p>
          <p class="text-xs font-bold text-muted">Заказов</p>
        </div>
        <div class="panel !p-5 text-center animate-fade-up delay-300">
          <Users class="mx-auto h-6 w-6 text-sky" />
          <p class="mt-2 font-display text-2xl font-bold text-sky">{{ stats.users }}</p>
          <p class="text-xs font-bold text-muted">Пользователей</p>
        </div>
        <div class="panel !p-5 text-center animate-fade-up delay-400">
          <MessageSquare class="mx-auto h-6 w-6 text-coral" />
          <p class="mt-2 font-display text-2xl font-bold text-coral">{{ stats.feedback }}</p>
          <p class="text-xs font-bold text-muted">Отзывов</p>
        </div>
        <div class="panel !p-5 text-center animate-fade-up delay-500">
          <DollarSign class="mx-auto h-6 w-6 text-forest" />
          <p class="mt-2 font-display text-2xl font-bold text-forest">{{ formatPrice(stats.revenue) }}</p>
          <p class="text-xs font-bold text-muted">Выручка</p>
        </div>
        <div class="panel !p-5 text-center animate-fade-up delay-600">
          <TrendingUp class="mx-auto h-6 w-6 text-coral" />
          <p class="mt-2 font-display text-2xl font-bold text-coral">{{ stats.lowStock }}</p>
          <p class="text-xs font-bold text-muted">Мало на складе</p>
        </div>
      </div>

      <div class="panel">
        <h3 class="mb-4 font-display text-lg font-bold">Последние заказы</h3>
        <div v-if="recentOrders.length" class="overflow-x-auto">
          <table class="w-full text-left text-sm min-w-[500px]">
            <thead>
              <tr class="border-b border-line text-muted">
                <th class="pb-2 font-semibold">№</th>
                <th class="pb-2 font-semibold">Клиент</th>
                <th class="pb-2 font-semibold">Сумма</th>
                <th class="pb-2 font-semibold">Статус</th>
                <th class="pb-2 font-semibold">Дата</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in recentOrders" :key="order.id" class="border-b border-stone-50">
                <td class="py-2 font-medium">#{{ order.id }}</td>
                <td class="py-2">{{ order.userName }}</td>
                <td class="py-2">{{ formatPrice(order.total) }}</td>
                <td class="py-2"><span class="rounded-full bg-forest-light px-2 py-0.5 text-xs font-bold text-forest-dark">{{ ordersStore.statusLabels[order.status] }}</span></td>
                <td class="py-2 text-muted">{{ formatDate(order.createdAt) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p v-else class="text-sm text-muted">Заказов пока нет</p>
      </div>
    </div>

    <!-- Categories -->
    <div v-if="activeTab === 'categories'" class="mt-6">
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div v-for="cat in categoryStats" :key="cat.id" class="panel text-center !p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-paw">
          <p class="font-display text-3xl font-bold text-forest">{{ cat.count }}</p>
          <div v-if="editingCategory === cat.id" class="mt-2 flex gap-1">
            <input v-model="categoryForm.label" class="input !py-1 text-center text-sm" @keyup.enter="saveCategory" />
            <button class="rounded-lg p-1 text-forest hover:bg-forest-light" @click="saveCategory"><Save class="h-4 w-4" /></button>
            <button class="rounded-lg p-1 text-muted hover:bg-stone-100" @click="cancelEditCategory"><X class="h-4 w-4" /></button>
          </div>
          <div v-else class="mt-2 flex items-center justify-center gap-2">
            <span class="font-bold">{{ cat.label }}</span>
            <button class="rounded-lg p-1 text-muted hover:bg-forest-light hover:text-forest" @click="editCategory(cat)"><Pencil class="h-3.5 w-3.5" /></button>
          </div>
        </div>
      </div>

      <div class="panel mt-6">
        <h3 class="mb-4 font-display text-lg font-bold">Товары по категориям</h3>
        <div v-for="cat in categoryStats" :key="cat.id" class="mb-3 flex items-center justify-between border-b border-dashed border-line pb-3 last:border-0">
          <span class="font-semibold">{{ cat.label }}</span>
          <div class="flex items-center gap-4">
            <span class="text-sm text-muted">{{ cat.count }} товаров</span>
            <div class="h-2 w-24 overflow-hidden rounded-full bg-forest-light">
              <div class="h-full rounded-full bg-forest transition-all" :style="{ width: `${stats.products ? (cat.count / stats.products) * 100 : 0}%` }" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Products -->
    <div v-if="activeTab === 'products'" class="mt-6">
      <div class="mb-4 flex justify-end">
        <button class="btn-forest" @click="openAddProduct">
          <Plus class="h-4 w-4" /> Добавить товар
        </button>
      </div>

      <div class="panel overflow-hidden !p-0">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm min-w-[600px]">
            <thead class="border-b border-line bg-forest-light">
              <tr>
                <th class="px-4 py-3 font-semibold text-stone-600">ID</th>
                <th class="px-4 py-3 font-semibold text-stone-600">Название</th>
                <th class="px-4 py-3 font-semibold text-stone-600">Категория</th>
                <th class="px-4 py-3 font-semibold text-stone-600">Цена</th>
                <th class="px-4 py-3 font-semibold text-stone-600">Остаток</th>
                <th class="px-4 py-3 font-semibold text-stone-600">Действия</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="product in productsStore.products"
                :key="product.id"
                class="border-b border-stone-50 transition-colors hover:bg-stone-50/50"
              >
                <td class="px-4 py-3 text-stone-400">{{ product.id }}</td>
                <td class="px-4 py-3">
                  <div class="flex items-center gap-3">
                    <img :src="product.image" :alt="product.name" class="h-10 w-10 rounded-lg object-cover" />
                    <span class="font-medium text-stone-900">{{ product.name }}</span>
                  </div>
                </td>
                <td class="px-4 py-3">
                  <span class="rounded-full bg-forest-light px-2.5 py-0.5 text-xs font-bold text-forest-dark">
                    {{ getCategoryLabel(product.category) }}
                  </span>
                </td>
                <td class="px-4 py-3 font-medium">{{ formatPrice(product.price) }}</td>
                <td class="px-4 py-3">
                  <span :class="product.stock <= 5 ? 'text-coral font-bold' : 'text-stone-500'">{{ product.stock }}</span>
                </td>
                <td class="px-4 py-3">
                  <div class="flex gap-1">
                    <button class="rounded-lg p-2 text-muted hover:bg-forest-light hover:text-forest" @click="openEditProduct(product)">
                      <Pencil class="h-4 w-4" />
                    </button>
                    <button class="rounded-lg p-2 text-stone-400 hover:bg-red-50 hover:text-red-500" @click="deleteProduct(product.id)">
                      <Trash2 class="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Orders -->
    <div v-if="activeTab === 'orders'" class="mt-6">
      <div class="panel overflow-hidden !p-0">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm min-w-[600px]">
            <thead class="border-b border-line bg-forest-light">
              <tr>
                <th class="px-4 py-3 font-semibold text-stone-600">№</th>
                <th class="px-4 py-3 font-semibold text-stone-600">Клиент</th>
                <th class="px-4 py-3 font-semibold text-stone-600">Сумма</th>
                <th class="px-4 py-3 font-semibold text-stone-600">Статус</th>
                <th class="px-4 py-3 font-semibold text-stone-600">Дата</th>
                <th class="px-4 py-3 font-semibold text-stone-600">Действия</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="order in ordersStore.orders"
                :key="order.id"
                class="border-b border-stone-50 transition-colors hover:bg-stone-50/50"
              >
                <td class="px-4 py-3 font-medium">#{{ order.id }}</td>
                <td class="px-4 py-3">{{ order.userName }}</td>
                <td class="px-4 py-3 font-medium">{{ formatPrice(order.total) }}</td>
                <td class="px-4 py-3">
                  <select
                    :value="order.status"
                    class="rounded-lg border border-stone-200 bg-white px-2 py-1 text-xs font-medium focus:border-accent focus:outline-none"
                    @change="ordersStore.updateOrderStatus(order.id, $event.target.value)"
                  >
                    <option v-for="s in statusOptions" :key="s" :value="s">
                      {{ ordersStore.statusLabels[s] }}
                    </option>
                  </select>
                </td>
                <td class="px-4 py-3 text-stone-500">{{ formatDate(order.createdAt) }}</td>
                <td class="px-4 py-3">
                  <button class="rounded-lg p-2 text-stone-400 hover:bg-red-50 hover:text-red-500" @click="deleteOrder(order.id)">
                    <Trash2 class="h-4 w-4" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Users -->
    <div v-if="activeTab === 'users'" class="mt-6">
      <div class="panel overflow-hidden !p-0">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm min-w-[700px]">
            <thead class="border-b border-line bg-forest-light">
              <tr>
                <th class="px-4 py-3 font-semibold text-stone-600">ID</th>
                <th class="px-4 py-3 font-semibold text-stone-600">Имя</th>
                <th class="px-4 py-3 font-semibold text-stone-600">Email</th>
                <th class="px-4 py-3 font-semibold text-stone-600">Телефон</th>
                <th class="px-4 py-3 font-semibold text-stone-600">Роль</th>
                <th class="px-4 py-3 font-semibold text-stone-600">Дата</th>
                <th class="px-4 py-3 font-semibold text-stone-600">Действия</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="user in authStore.users"
                :key="user.id"
                class="border-b border-stone-50 transition-colors hover:bg-stone-50/50"
              >
                <td class="px-4 py-3 text-stone-400">{{ user.id }}</td>
                <td class="px-4 py-3">
                  <div class="flex items-center gap-3">
                    <div class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-forest to-forest-dark font-extrabold text-white">
                      {{ user.name[0] }}
                    </div>
                    <span class="font-medium">{{ user.name }}</span>
                  </div>
                </td>
                <td class="px-4 py-3">{{ user.email }}</td>
                <td class="px-4 py-3 text-stone-500">{{ user.phone }}</td>
                <td class="px-4 py-3">
                  <select
                    :value="user.role"
                    class="rounded-lg border border-stone-200 bg-white px-2 py-1 text-xs font-medium focus:border-accent focus:outline-none"
                    :disabled="user.id === authStore.currentUser?.id"
                    @change="authStore.updateUserRole(user.id, $event.target.value)"
                  >
                    <option value="user">Пользователь</option>
                    <option value="admin">Администратор</option>
                  </select>
                </td>
                <td class="px-4 py-3 text-stone-500">{{ formatDate(user.createdAt) }}</td>
                <td class="px-4 py-3">
                  <button
                    class="rounded-lg p-2 text-stone-400 hover:bg-red-50 hover:text-red-500 disabled:opacity-30"
                    :disabled="user.id === authStore.currentUser?.id"
                    @click="deleteUser(user.id)"
                  >
                    <Trash2 class="h-4 w-4" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Feedback -->
    <div v-if="activeTab === 'feedback'" class="mt-6">
      <div class="mb-4 flex gap-1 overflow-x-auto rounded-full bg-forest-light p-1 w-fit">
        <button class="whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold transition-colors" :class="feedbackSubTab === 'messages' ? 'bg-white text-ink shadow-sm' : 'text-muted'" @click="feedbackSubTab = 'messages'">Запросы с сайта</button>
        <button class="whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold transition-colors" :class="feedbackSubTab === 'reviews' ? 'bg-white text-ink shadow-sm' : 'text-muted'" @click="feedbackSubTab = 'reviews'">Отзывы на товары</button>
      </div>

      <div v-if="feedbackSubTab === 'messages'">
        <div v-if="feedbackStore.requests.length" class="grid gap-4">
          <div v-for="req in [...feedbackStore.requests].reverse()" :key="req.id" class="panel transition-all duration-200 hover:-translate-y-1 hover:shadow-paw">
            <div class="flex items-start justify-between">
              <div>
                <p class="font-bold">{{ req.name }}</p>
                <p class="text-sm text-muted">{{ req.email }} | {{ req.phone }}</p>
              </div>
              <div class="flex items-center gap-2">
                <span class="rounded-full bg-honey-light px-2.5 py-0.5 text-xs font-bold text-honey-dark">{{ req.status }}</span>
                <button class="rounded-lg p-1.5 text-stone-400 hover:bg-red-50 hover:text-red-500" @click="deleteFeedback(req.id)">
                  <Trash2 class="h-4 w-4" />
                </button>
              </div>
            </div>
            <p class="mt-3 text-sm leading-relaxed text-muted">{{ req.message }}</p>
            <p class="mt-2 text-xs text-stone-400">{{ formatDate(req.createdAt) }}</p>
          </div>
        </div>
        <div v-else class="panel py-16 text-center">
          <MessageSquare class="mx-auto h-12 w-12 text-line" />
          <p class="mt-4 font-semibold">Запросов пока нет</p>
          <p class="text-sm text-muted">Здесь появятся запросы из формы обратной связи</p>
        </div>
      </div>

      <div v-if="feedbackSubTab === 'reviews'">
        <div v-if="reviewsStore.reviews.length" class="grid gap-4">
          <div v-for="r in [...reviewsStore.reviews].reverse()" :key="r.id" class="panel transition-all duration-200 hover:-translate-y-1 hover:shadow-paw">
            <div class="flex items-start justify-between">
              <div>
                <p class="font-bold">{{ r.userName }}</p>
                <p class="text-xs text-muted">Товар: <RouterLink :to="`/product/${r.productId}`" class="text-forest hover:underline">{{ getProductName(r.productId) }}</RouterLink></p>
                <div class="mt-1 flex text-honey">
                  <Star v-for="i in 5" :key="i" class="h-3.5 w-3.5" :class="i <= r.rating ? 'fill-current' : 'opacity-20'" />
                </div>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-xs text-muted">{{ r.createdAt }}</span>
                <button class="rounded-lg p-1.5 text-stone-400 hover:bg-red-50 hover:text-red-500" @click="deleteProductReview(r.id)">
                  <Trash2 class="h-4 w-4" />
                </button>
              </div>
            </div>
            <p class="mt-3 text-sm leading-relaxed text-muted">{{ r.text }}</p>
          </div>
        </div>
        <div v-else class="panel py-16 text-center">
          <MessageSquare class="mx-auto h-12 w-12 text-line" />
          <p class="mt-4 font-semibold">Отзывов на товары пока нет</p>
        </div>
      </div>
    </div>

    <!-- Product form modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="showProductForm"
          class="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/30 p-4 backdrop-blur-sm"
          @click.self="showProductForm = false"
        >
          <div class="w-full max-w-lg rounded-2xl bg-white p-6 shadow-modal sm:p-8">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-bold text-stone-900">
                {{ editingProduct ? 'Редактировать товар' : 'Новый товар' }}
              </h3>
              <button class="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100" @click="showProductForm = false">
                <X class="h-5 w-5" />
              </button>
            </div>

            <form class="mt-6 space-y-4" @submit.prevent="saveProduct">
              <div>
                <label class="label">Название</label>
                <input v-model="productForm.name" type="text" class="input" required />
              </div>
              <div class="grid gap-4 sm:grid-cols-2">
                <div>
                  <label class="label">Категория</label>
                  <select v-model="productForm.category" class="input">
                    <option v-for="cat in CATEGORIES" :key="cat.id" :value="cat.id">{{ cat.label }}</option>
                  </select>
                </div>
                <div>
                  <label class="label">Цена со скидкой (₽)</label>
                  <input v-model.number="productForm.price" type="number" min="0" class="input" required />
                </div>
              </div>
              <div>
                <label class="label">Старая цена (₽) — если нет скидки, оставьте пустым</label>
                <input v-model.number="productForm.oldPrice" type="number" min="0" class="input" placeholder="Без скидки" />
              </div>
              <div>
                <label class="label">Описание</label>
                <textarea v-model="productForm.description" rows="2" class="input resize-none" />
              </div>
              <div>
                <div class="flex items-center justify-between mb-2">
                  <label class="label !mb-0">Варианты веса</label>
                  <button type="button" class="btn-outline btn-sm" @click="addWeight">+ Добавить</button>
                </div>
                <div v-for="(w, idx) in productForm.weights" :key="idx" class="mb-2 flex flex-wrap items-center gap-2">
                  <input v-model="w.label" type="text" class="input !py-2 w-24" placeholder="400 г" />
                  <input v-model.number="w.price" type="number" min="0" class="input !py-2 w-24" placeholder="Цена" />
                  <input v-model.number="w.oldPrice" type="number" min="0" class="input !py-2 w-24" placeholder="Старая цена" />
                  <input v-model.number="w.stock" type="number" min="0" class="input !py-2 w-20" placeholder="Ост." />
                  <button type="button" class="rounded-lg p-2 text-stone-400 hover:bg-red-50 hover:text-red-500" @click="removeWeight(idx)">
                    <Trash2 class="h-4 w-4" />
                  </button>
                </div>
                <p v-if="!productForm.weights.length" class="text-xs text-muted">Нет вариантов веса. Добавьте, если товар продаётся в разных фасовках.</p>
              </div>
              <div>
                <label class="label">Фото (до 5 шт.)</label>
                <div class="flex flex-wrap gap-3">
                  <label class="btn-outline btn-sm cursor-pointer">
                    <input type="file" accept="image/jpeg,image/png,image/webp" class="hidden" multiple @change="onImageUpload" />
                    Выбрать файлы
                  </label>
                  <span class="self-center text-xs text-muted">{{ productForm.images.length }}/5</span>
                </div>
                <div v-if="productForm.images.length" class="mt-2 flex flex-wrap gap-2">
                  <div v-for="(img, idx) in productForm.images" :key="idx" class="group relative">
                    <img :src="img" alt="" class="h-20 w-20 rounded-lg border border-line object-cover" @error="$event.target.style.display='none'" />
                    <button type="button" class="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-opacity group-hover:opacity-100" @click="removeImage(idx)">
                      <X class="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
              <div>
                <label class="label">Остаток</label>
                <input v-model.number="productForm.stock" type="number" min="0" class="input" />
              </div>
              <button type="submit" class="btn-forest btn-block w-full">
                <Save class="h-4 w-4" />
                {{ editingProduct ? 'Сохранить' : 'Добавить' }}
              </button>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.25s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
