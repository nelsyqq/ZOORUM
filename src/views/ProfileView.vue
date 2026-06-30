<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { Package, LogOut, Save, LogIn, UserPlus } from 'lucide-vue-next'
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
    <div v-else class="mt-8 grid items-start gap-6 lg:grid-cols-[260px_1fr]">
      <aside class="panel sticky top-[90px] !p-5">
        <div class="flex items-center gap-3 border-b border-line pb-4">
          <div class="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent-dark font-extrabold text-white">
            {{ auth.currentUser.name[0] }}
          </div>
          <div>
            <strong class="block text-sm">{{ auth.currentUser.name }}</strong>
            <span class="text-xs text-muted">{{ auth.currentUser.email }}</span>
          </div>
        </div>
        <nav class="mt-3 flex flex-col">
          <button class="rounded-[9px] px-3 py-2.5 text-left text-sm font-semibold" :class="profileTab === 'profile' ? 'bg-ink text-white' : 'hover:bg-forest-light'" @click="profileTab = 'profile'">Профиль</button>
          <button class="rounded-[9px] px-3 py-2.5 text-left text-sm font-semibold" :class="profileTab === 'orders' ? 'bg-ink text-white' : 'hover:bg-forest-light'" @click="profileTab = 'orders'">
            Заказы <em v-if="userOrders.length" class="ml-1 rounded-full bg-coral px-2 text-xs not-italic text-white">{{ userOrders.length }}</em>
          </button>
        </nav>
        <button class="btn-ghost btn-sm btn-block mt-4" @click="logout"><LogOut class="h-4 w-4" /> Выйти</button>
      </aside>

      <form v-if="profileTab === 'profile'" class="panel" @submit.prevent="handleProfileUpdate">
        <h2 class="font-display text-xl font-bold">Мои данные</h2>
        <div class="mt-5 max-w-md space-y-4">
          <div><label class="label">Имя</label><input v-model="profileForm.name" class="input" /></div>
          <div><label class="label">Телефон</label><input :value="profileForm.phone" type="tel" class="input" @input="onPhoneInput($event, profileForm)" /></div>
          <div><label class="label">Email</label><input v-model="profileForm.email" type="email" class="input" /></div>
          <div><label class="label">Адрес доставки</label><textarea v-model="profileForm.address" rows="2" class="input resize-none" placeholder="Для быстрого оформления заказов" /></div>
        </div>
        <button type="submit" class="btn-forest mt-6"><Save class="h-4 w-4" /> Сохранить</button>
      </form>

      <div v-else class="space-y-4">
        <div v-if="!userOrders.length" class="panel py-16 text-center">
          <Package class="mx-auto h-12 w-12 text-line" />
          <p class="mt-4 font-semibold">Заказов пока нет</p>
          <RouterLink to="/catalog" class="btn-forest mt-6 inline-flex">В каталог</RouterLink>
        </div>
        <div v-for="order in userOrders" :key="order.id" class="panel">
          <div class="flex flex-wrap justify-between gap-3">
            <div><p class="font-bold">Заказ #{{ order.id }}</p><p class="text-sm text-muted">{{ formatDate(order.createdAt) }}</p></div>
            <span class="rounded-full px-3 py-1 text-xs font-bold" :class="statusColors[order.status]">{{ ordersStore.statusLabels[order.status] }}</span>
          </div>
          <ul class="mt-4 space-y-3 border-t border-line pt-4 text-sm">
            <li v-for="item in order.items" :key="item.productId" class="flex items-center gap-3">
              <img :src="item.image" :alt="item.name" class="h-12 w-12 rounded-lg object-cover" />
              <div class="flex-1">
                <span class="font-medium">{{ item.name }}</span>
                <span class="text-muted"> × {{ item.quantity }}</span>
              </div>
              <span class="font-semibold">{{ formatPrice(item.price * item.quantity) }}</span>
            </li>
          </ul>
          <div class="mt-3 flex justify-between border-t border-line pt-3 font-bold">
            <span>Итого</span><span class="text-forest">{{ formatPrice(order.total) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>