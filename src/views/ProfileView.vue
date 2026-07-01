<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { Package, LogOut, Save, LogIn, UserPlus, User, Phone, Mail, MapPin, ShoppingBag, Clock, Calendar, CreditCard, ShieldCheck } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { useOrdersStore } from '@/stores/orders'
import {
  validateName,
  validatePhone,
  validateEmail,
  validatePassword,
  formatPhoneInput,
  formatPrice,
  formatDate,
} from '@/utils/helpers'
import { SITE_IMAGES } from '@/utils/images'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const ordersStore = useOrdersStore()
const cart = useCartStore()

const activeTab = ref('login')
const profileTab = ref('profile')

const loginForm = reactive({ email: '', password: '' })
const registerForm = reactive({ name: '', email: '', phone: '', password: '', confirm: '' })
const profileForm = reactive({ name: '', phone: '', email: '', address: '' })

const errors = reactive({})
const message = ref('')

const userOrders = computed(() =>
  auth.currentUser ? ordersStore.getByUserId(auth.currentUser.id) : []
)

const totalSpent = computed(() =>
  userOrders.value.reduce((sum, o) => sum + (o.total || 0), 0)
)

const completedOrders = computed(() =>
  userOrders.value.filter(o => o.status === 'delivered').length
)

const activeOrders = computed(() =>
  userOrders.value.filter(o => o.status === 'new' || o.status === 'processing' || o.status === 'shipped').length
)

onMounted(() => {
  if (auth.isAuthenticated) {
    activeTab.value = 'profile'
    syncProfileForm()
    if (route.query.checkout === '1' || cart.hasPendingCheckout()) {
      message.value = 'Войдите, чтобы оформить заказ из корзины'
      setTimeout(() => cart.openCart(), 300)
    }
  } else if (route.query.checkout === '1') {
    message.value = 'Войдите или зарегистрируйтесь для оформления заказа'
  } else if (route.query.redirect) {
    message.value = 'Войдите, чтобы продолжить'
  }
})

function syncProfileForm() {
  if (!auth.currentUser) return
  profileForm.name = auth.currentUser.name
  profileForm.phone = auth.currentUser.phone
  profileForm.email = auth.currentUser.email
  profileForm.address = auth.currentUser.address || ''
}

function afterAuth() {
  activeTab.value = 'profile'
  syncProfileForm()

  if (route.query.checkout === '1' || cart.hasPendingCheckout()) {
    router.replace({ name: 'profile' })
    setTimeout(() => cart.openCart(), 200)
    return
  }

  if (route.query.redirect && route.query.redirect !== 'checkout') {
    router.push(String(route.query.redirect))
  }
}

function clearErrors() {
  Object.keys(errors).forEach((k) => { errors[k] = '' })
}

function handleLogin() {
  clearErrors()
  errors.email = validateEmail(loginForm.email)
  errors.password = validatePassword(loginForm.password)
  if (errors.email || errors.password) return

  const result = auth.login(loginForm.email, loginForm.password)
  if (!result.success) {
    errors.password = result.error
    return
  }

  afterAuth()
}

function handleRegister() {
  clearErrors()
  errors.name = validateName(registerForm.name)
  errors.email = validateEmail(registerForm.email)
  errors.phone = validatePhone(registerForm.phone)
  errors.password = validatePassword(registerForm.password)
  if (registerForm.password !== registerForm.confirm) {
    errors.confirm = 'Пароли не совпадают'
  }
  if (Object.values(errors).some(Boolean)) return

  const result = auth.register(registerForm)
  if (!result.success) {
    errors.email = result.error
    return
  }

  afterAuth()
}

function handleProfileUpdate() {
  clearErrors()
  errors.name = validateName(profileForm.name)
  errors.phone = validatePhone(profileForm.phone)
  errors.email = validateEmail(profileForm.email)
  if (Object.values(errors).some(Boolean)) return

  auth.updateProfile({ ...profileForm })
  message.value = 'Профиль обновлён'
  setTimeout(() => { message.value = '' }, 3000)
}

function onPhoneInput(e, form) {
  form.phone = formatPhoneInput(e.target.value)
}

function logout() {
  auth.logout()
  activeTab.value = 'login'
  loginForm.email = ''
  loginForm.password = ''
}

const statusColors = {
  new: 'bg-blue-50 text-blue-700',
  processing: 'bg-yellow-50 text-yellow-700',
  shipped: 'bg-purple-50 text-purple-700',
  delivered: 'bg-green-50 text-green-700',
  cancelled: 'bg-red-50 text-red-700',
}
</script>

<template>
  <div class="container-wrap py-10">
    <div class="mb-8 flex items-center gap-6">
      <img :src="SITE_IMAGES.pets.cats" alt="Профиль" class="h-20 w-20 rounded-2xl object-cover shadow-soft" />
      <div>
        <h1 class="font-display text-3xl font-extrabold">Личный кабинет</h1>
        <p class="mt-1 text-muted">Управление вашим аккаунтом и заказами</p>
      </div>
    </div>

    <div v-if="message" class="mt-4 rounded-paw bg-forest-light px-4 py-3 text-sm font-bold text-forest-dark">{{ message }}</div>

    <!-- Auth -->
    <div v-if="!auth.isAuthenticated" class="mx-auto mt-8 max-w-md">
      <div class="mb-6 flex justify-center">
        <img :src="SITE_IMAGES.hero.puppy" alt="Вход" class="h-32 w-32 rounded-2xl object-cover shadow-soft" />
      </div>
      <div class="flex gap-1 rounded-full bg-forest-light p-1">
        <button class="flex flex-1 items-center justify-center gap-2 rounded-full py-2.5 text-sm font-bold" :class="activeTab === 'login' ? 'bg-white shadow-sm' : 'text-muted'" @click="activeTab = 'login'">
          <LogIn class="h-4 w-4" /> Вход
        </button>
        <button class="flex flex-1 items-center justify-center gap-2 rounded-full py-2.5 text-sm font-bold" :class="activeTab === 'register' ? 'bg-white shadow-sm' : 'text-muted'" @click="activeTab = 'register'">
          <UserPlus class="h-4 w-4" /> Регистрация
        </button>
      </div>

        <form v-if="activeTab === 'login'" class="panel mt-6" @submit.prevent="handleLogin">
          <h2 class="font-display text-2xl font-extrabold">Вход</h2>
        <div class="mt-5 space-y-4">
          <div><label class="label">Email</label><input v-model="loginForm.email" type="email" class="input" :class="{ 'input-error': errors.email }" /><p v-if="errors.email" class="error-text">{{ errors.email }}</p></div>
          <div><label class="label">Пароль</label><input v-model="loginForm.password" type="password" class="input" :class="{ 'input-error': errors.password }" /><p v-if="errors.password" class="error-text">{{ errors.password }}</p></div>
        </div>
        <button type="submit" class="btn-forest btn-block mt-6">Войти</button>
      </form>

      <form v-else class="panel mt-6" @submit.prevent="handleRegister">
        <h2 class="font-display text-2xl font-extrabold">Регистрация</h2>
        <div class="mt-5 space-y-4">
          <div><label class="label">Имя</label><input v-model="registerForm.name" class="input" :class="{ 'input-error': errors.name }" /><p v-if="errors.name" class="error-text">{{ errors.name }}</p></div>
          <div><label class="label">Email</label><input v-model="registerForm.email" type="email" class="input" :class="{ 'input-error': errors.email }" /><p v-if="errors.email" class="error-text">{{ errors.email }}</p></div>
          <div><label class="label">Телефон</label><input :value="registerForm.phone" type="tel" class="input" placeholder="+7 (___) ___-__-__" @input="onPhoneInput($event, registerForm)" /><p v-if="errors.phone" class="error-text">{{ errors.phone }}</p></div>
          <div class="grid gap-4 sm:grid-cols-2">
            <div><label class="label">Пароль</label><input v-model="registerForm.password" type="password" class="input" /><p v-if="errors.password" class="error-text">{{ errors.password }}</p></div>
            <div><label class="label">Подтверждение</label><input v-model="registerForm.confirm" type="password" class="input" /><p v-if="errors.confirm" class="error-text">{{ errors.confirm }}</p></div>
          </div>
        </div>
        <button type="submit" class="btn-forest btn-block mt-6">Зарегистрироваться</button>
      </form>
    </div>

    <!-- Account -->
    <div v-else class="mt-8">
      <!-- Stats cards -->
      <div class="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div class="rounded-blob bg-gradient-to-br from-forest-light to-white p-4 text-center shadow-soft">
          <ShoppingBag class="mx-auto h-5 w-5 text-forest" />
          <p class="mt-2 text-2xl font-bold text-ink">{{ userOrders.length }}</p>
          <p class="text-xs text-muted">Всего заказов</p>
        </div>
        <div class="rounded-blob bg-gradient-to-br from-honey-light to-white p-4 text-center shadow-soft">
          <Clock class="mx-auto h-5 w-5 text-honey-dark" />
          <p class="mt-2 text-2xl font-bold text-ink">{{ activeOrders }}</p>
          <p class="text-xs text-muted">В обработке</p>
        </div>
        <div class="rounded-blob bg-gradient-to-br from-green-50 to-white p-4 text-center shadow-soft">
          <ShieldCheck class="mx-auto h-5 w-5 text-green-600" />
          <p class="mt-2 text-2xl font-bold text-ink">{{ completedOrders }}</p>
          <p class="text-xs text-muted">Доставлено</p>
        </div>
        <div class="rounded-blob bg-gradient-to-br from-sky-light to-white p-4 text-center shadow-soft">
          <CreditCard class="mx-auto h-5 w-5 text-sky" />
          <p class="mt-2 text-2xl font-bold text-ink">{{ formatPrice(totalSpent) }}</p>
          <p class="text-xs text-muted">Потрачено</p>
        </div>
      </div>

      <div class="grid items-start gap-6 lg:grid-cols-[280px_1fr]">
        <aside class="rounded-blob bg-white p-6 shadow-soft">
          <div class="flex items-center gap-4 border-b border-line pb-5">
            <div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-forest to-forest-dark text-xl font-extrabold text-white shadow-soft">
              {{ auth.currentUser.name[0] }}
            </div>
            <div class="min-w-0">
              <strong class="block truncate text-base">{{ auth.currentUser.name }}</strong>
              <span class="truncate text-xs text-muted">{{ auth.currentUser.email }}</span>
              <span class="mt-0.5 block text-[10px] text-muted"><Calendar class="mr-0.5 inline h-3 w-3" /> С {{ formatDate(auth.currentUser.createdAt) }}</span>
            </div>
          </div>
          <nav class="mt-4 flex flex-col gap-1">
            <button class="flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-bold transition-all" :class="profileTab === 'profile' ? 'bg-forest-light text-forest-dark' : 'text-muted hover:bg-forest-light/50 hover:text-ink'" @click="profileTab = 'profile'">
              <User class="h-4 w-4" /> Профиль
            </button>
            <button class="flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-bold transition-all" :class="profileTab === 'orders' ? 'bg-forest-light text-forest-dark' : 'text-muted hover:bg-forest-light/50 hover:text-ink'" @click="profileTab = 'orders'">
              <Package class="h-4 w-4" /> Заказы
              <em v-if="userOrders.length" class="ml-auto rounded-full bg-coral px-2 py-0.5 text-xs not-italic text-white">{{ userOrders.length }}</em>
            </button>
          </nav>
          <button class="btn-ghost btn-block mt-6 !rounded-xl" @click="logout"><LogOut class="h-4 w-4" /> Выйти</button>
        </aside>

        <div v-if="profileTab === 'profile'">
          <form class="rounded-blob bg-white p-6 shadow-soft sm:p-8" @submit.prevent="handleProfileUpdate">
            <div class="flex items-center gap-3 border-b border-line pb-5">
              <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-forest-light">
                <User class="h-5 w-5 text-forest" />
              </div>
              <div>
                <h2 class="font-display text-lg font-bold">Мои данные</h2>
                <p class="text-xs text-muted">Личная информация и контакты</p>
              </div>
            </div>
            <div class="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <label class="label flex items-center gap-1.5"><User class="h-3.5 w-3.5 text-muted" /> Имя</label>
                <input v-model="profileForm.name" class="input" />
              </div>
              <div>
                <label class="label flex items-center gap-1.5"><Mail class="h-3.5 w-3.5 text-muted" /> Email</label>
                <input v-model="profileForm.email" type="email" class="input" />
              </div>
              <div>
                <label class="label flex items-center gap-1.5"><Phone class="h-3.5 w-3.5 text-muted" /> Телефон</label>
                <input :value="profileForm.phone" type="tel" class="input" @input="onPhoneInput($event, profileForm)" />
              </div>
              <div class="sm:col-span-2">
                <label class="label flex items-center gap-1.5"><MapPin class="h-3.5 w-3.5 text-muted" /> Адрес доставки</label>
                <textarea v-model="profileForm.address" rows="2" class="input resize-none" placeholder="Для быстрого оформления заказов" />
              </div>
            </div>
            <button type="submit" class="btn-forest mt-6"><Save class="h-4 w-4" /> Сохранить изменения</button>
          </form>
        </div>

        <div v-else class="space-y-4">
          <div v-if="!userOrders.length" class="rounded-blob bg-white py-16 text-center shadow-soft">
            <Package class="mx-auto h-14 w-14 text-line" />
            <p class="mt-4 font-display text-xl font-bold">Заказов пока нет</p>
            <p class="mt-1 text-sm text-muted">Перейдите в каталог и выберите товары</p>
            <RouterLink to="/catalog" class="btn-forest mt-6 inline-flex">В каталог</RouterLink>
          </div>
          <div v-for="order in userOrders" :key="order.id" class="rounded-blob bg-white p-6 shadow-soft transition-all duration-200 hover:-translate-y-1 hover:shadow-paw">
            <div class="flex flex-wrap items-center justify-between gap-3">
              <div class="flex items-center gap-3">
                <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-forest-light">
                  <Package class="h-5 w-5 text-forest" />
                </div>
                <div>
                  <p class="font-bold">Заказ #{{ order.id }}</p>
                  <p class="text-xs text-muted">{{ formatDate(order.createdAt) }}</p>
                </div>
              </div>
              <span class="rounded-full px-3 py-1 text-xs font-bold" :class="statusColors[order.status]">{{ ordersStore.statusLabels[order.status] }}</span>
            </div>
            <ul class="mt-4 space-y-3 border-t border-line pt-4 text-sm">
              <li v-for="item in order.items" :key="item.productId" class="flex items-center gap-3">
                <img :src="item.image || '/images/placeholder.jpg'" :alt="item.name" class="h-12 w-12 rounded-xl object-cover" />
                <div class="flex-1">
                  <span class="font-medium">{{ item.name }}</span>
                  <span class="text-muted"> × {{ item.quantity }}</span>
                </div>
                <span class="font-semibold">{{ formatPrice(item.price * item.quantity) }}</span>
              </li>
            </ul>
            <div class="mt-4 flex items-center justify-between border-t border-line pt-4">
              <span class="font-bold text-muted">{{ order.items.length }} {{ order.items.length === 1 ? 'товар' : 'товара' }}</span>
              <span class="font-display text-xl font-bold text-forest">{{ formatPrice(order.total) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>