<script setup>
import { ref, watch } from 'vue'
import { X, Minus, Plus, ShoppingBag, CheckCircle } from 'lucide-vue-next'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { useOrdersStore } from '@/stores/orders'
import { useToastStore } from '@/stores/toast'
import { formatPrice } from '@/utils/helpers'
import { useRouter, RouterLink } from 'vue-router'

const cart = useCartStore()
const auth = useAuthStore()
const orders = useOrdersStore()
const toast = useToastStore()
const router = useRouter()

const checkoutStep = ref(false)
const orderSuccess = ref(false)
const address = ref('')
const orderId = ref(null)

watch(() => cart.isOpen, (open) => {
  if (open && cart.hasPendingCheckout() && auth.isAuthenticated) {
    checkoutStep.value = true
    address.value = auth.currentUser?.address || ''
    cart.setPendingCheckout(false)
  }
})

function close() {
  cart.closeCart()
  if (!orderSuccess.value) {
    checkoutStep.value = false
  }
  if (!orderSuccess.value) {
    address.value = ''
  }
}

function startCheckout() {
  if (cart.isEmpty) return

  if (!auth.isAuthenticated) {
    cart.setPendingCheckout(true)
    cart.closeCart()
    toast.show('Войдите, чтобы оформить заказ')
    router.push({ name: 'profile', query: { checkout: '1' } })
    return
  }

  checkoutStep.value = true
  address.value = auth.currentUser?.address || ''
}

function placeOrder() {
  if (!address.value.trim() || cart.isEmpty) return

  const order = orders.createOrder({
    userId: auth.currentUser.id,
    userName: auth.currentUser.name,
    items: cart.items.map((i) => ({
      productId: i.productId,
      name: i.name,
      price: i.price,
      quantity: i.quantity,
    })),
    total: cart.totalPrice,
    address: address.value.trim(),
  })

  if (auth.currentUser.address !== address.value.trim()) {
    auth.updateProfile({ address: address.value.trim() })
  }

  orderId.value = order.id
  cart.clearCart()
  orderSuccess.value = true
  checkoutStep.value = false
  toast.show(`Заказ #${order.id} оформлен!`)

  setTimeout(() => {
    orderSuccess.value = false
    orderId.value = null
    close()
  }, 4000)
}

function lineTotal(item) {
  return item.price * item.quantity
}
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="cart.isOpen" class="drawer-overlay" @click="close" />
    </Transition>

    <aside
      class="drawer-panel transition-all duration-300 ease-out"
      :class="cart.isOpen ? 'translate-x-0 opacity-100' : 'pointer-events-none translate-x-full opacity-0'"
      :aria-hidden="!cart.isOpen"
    >
      <div class="flex items-center justify-between border-b-2 border-line bg-white px-5 py-4">
        <h3 class="font-display text-xl font-bold">
          {{ orderSuccess ? 'Готово!' : checkoutStep ? 'Оформление' : 'Корзина' }}
        </h3>
        <button class="icon-btn" aria-label="Закрыть" @click="close"><X class="h-5 w-5" /></button>
      </div>

      <div v-if="orderSuccess" class="flex flex-1 flex-col items-center justify-center p-8 text-center">
        <CheckCircle class="h-16 w-16 text-forest" />
        <p class="mt-4 font-display text-xl font-bold">Спасибо за заказ!</p>
        <p v-if="orderId" class="mt-1 text-sm text-muted">Номер заказа: #{{ orderId }}</p>
        <p class="mt-2 text-sm text-muted">Мы свяжемся с вами для подтверждения</p>
        <RouterLink to="/profile" class="btn-forest btn-sm mt-6" @click="close">Мои заказы</RouterLink>
      </div>

      <div v-else-if="checkoutStep" class="flex flex-1 flex-col overflow-y-auto p-5">
        <p class="mb-4 text-sm text-muted">Проверьте данные и укажите адрес доставки по России</p>

        <ul class="mb-4 space-y-2 rounded-paw bg-white p-3 shadow-soft">
          <li v-for="item in cart.items" :key="item.cartKey" class="flex justify-between text-sm">
            <span class="text-muted">{{ item.name }} × {{ item.quantity }}</span>
            <span class="font-bold">{{ formatPrice(lineTotal(item)) }}</span>
          </li>
        </ul>

        <label class="label">Адрес доставки</label>
        <textarea
          v-model="address"
          rows="3"
          class="input resize-none"
          placeholder="Владимирская область, Юрьев-Польский, Советская площадь, 12"
        />

        <div class="mt-4 rounded-paw bg-forest-light p-4">
          <div class="flex justify-between text-sm text-muted"><span>Товаров</span><span>{{ cart.totalItems }} шт.</span></div>
          <div class="mt-2 flex justify-between font-display text-xl font-bold text-forest">
            <span>Итого</span><span>{{ formatPrice(cart.totalPrice) }}</span>
          </div>
          <p class="mt-2 text-xs text-muted">Оплата при получении или онлайн</p>
        </div>

        <div class="mt-auto flex gap-2 pt-5">
          <button class="btn-ghost flex-1" @click="checkoutStep = false">Назад</button>
          <button class="btn-forest flex-1" :disabled="!address.trim()" @click="placeOrder">
            Подтвердить заказ
          </button>
        </div>
      </div>

      <template v-else>
        <div v-if="cart.isEmpty" class="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
          <span class="text-5xl"></span>
          <p class="font-display text-lg font-bold">Корзина пуста</p>
          <p class="text-sm text-muted">Добавьте товары из каталога</p>
          <button class="btn-forest" @click="close(); router.push('/catalog')">В каталог</button>
        </div>

        <div v-else class="flex flex-1 flex-col overflow-hidden">
          <ul class="flex-1 overflow-y-auto px-5 py-3">
            <li
              v-for="item in cart.items"
              :key="item.cartKey"
              class="grid grid-cols-[72px_1fr_auto] gap-3 border-b border-line py-4 last:border-0"
            >
              <img
                :src="item.image"
                :alt="item.name"
                class="h-[72px] w-[72px] rounded-paw object-cover"
                @error="($event.target).src = '/images/placeholder.jpg'"
              />
              <div>
                <p class="text-sm font-bold leading-snug line-clamp-2">{{ item.name }}</p>
                <p class="mt-1 text-sm" :class="item.oldPrice ? 'text-coral' : 'text-forest'">{{ formatPrice(item.price) }} / шт.</p>
                <p v-if="item.oldPrice" class="text-xs text-muted line-through">{{ formatPrice(item.oldPrice) }} / шт.</p>
                <div class="mt-2 flex items-center gap-2">
                  <button class="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-line font-bold transition-colors hover:bg-forest-light" aria-label="Уменьшить" @click="cart.updateQuantity(item.cartKey, item.quantity - 1)">
                    <Minus class="h-4 w-4" />
                  </button>
                  <span class="min-w-[24px] text-center text-sm font-extrabold">{{ item.quantity }}</span>
                  <button class="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-line font-bold transition-colors hover:bg-forest-light" aria-label="Увеличить" @click="cart.updateQuantity(item.cartKey, item.quantity + 1)">
                    <Plus class="h-3 w-3" />
                  </button>
                </div>
                <p class="mt-1 text-xs font-bold text-muted">Сумма: {{ formatPrice(lineTotal(item)) }}</p>
              </div>
              <button class="text-2xl text-muted hover:text-coral" aria-label="Удалить" @click="cart.removeItem(item.cartKey)">×</button>
            </li>
          </ul>

          <div class="border-t-2 border-line bg-white p-5">
            <div class="mb-1 flex justify-between text-sm text-muted">
              <span>{{ cart.totalItems }} товар(ов)</span>
            </div>
            <div class="mb-4 flex justify-between font-display text-xl font-bold">
              <span>Итого</span><span class="text-forest">{{ formatPrice(cart.totalPrice) }}</span>
            </div>
            <button class="btn-forest btn-block" @click="startCheckout">Оформить заказ</button>
          </div>
        </div>
      </template>
    </aside>
  </Teleport>
</template>
<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.25s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
