<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { ShoppingBag, Check, Star, ArrowLeft, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { useProductsStore } from '@/stores/products'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { useReviewsStore } from '@/stores/reviews'
import { useToastStore } from '@/stores/toast'
import { useOrdersStore } from '@/stores/orders'
import { formatPrice, getCategoryLabel, CATEGORIES } from '@/utils/helpers'
import { SITE_IMAGES } from '@/utils/images'

const route = useRoute()
const router = useRouter()
const productsStore = useProductsStore()
const cart = useCartStore()
const auth = useAuthStore()
const reviewsStore = useReviewsStore()
const toast = useToastStore()
const ordersStore = useOrdersStore()

const product = computed(() => productsStore.getById(Number(route.params.id)))
const reviews = computed(() => reviewsStore.getByProduct(Number(route.params.id)))
const avgRating = computed(() => reviewsStore.averageRating(Number(route.params.id)))
const reviewCount = computed(() => reviewsStore.ratingCount(Number(route.params.id)))

const justAdded = ref(false)
const showReviewForm = ref(false)
const reviewText = ref('')
const reviewRating = ref(5)
const submitted = ref(false)

const canReview = computed(() => {
  if (!auth.isAuthenticated) return false
  const userId = auth.currentUser.id
  const userOrders = ordersStore.getByUserId(userId)
  const boughtProduct = userOrders.some(o => o.items.some(i => i.productId === product.value?.id))
  return boughtProduct && reviewsStore.canReview(product.value?.id, userId)
})

const categoryImage = computed(() => {
  if (!product.value) return SITE_IMAGES.hero.main
  return SITE_IMAGES.categories[product.value.category] || SITE_IMAGES.hero.main
})

const productImages = computed(() => {
  if (!product.value) return []
  return product.value.images?.length ? product.value.images : [product.value.image].filter(Boolean)
})

const currentPhoto = ref(0)

function prevPhoto() {
  if (productImages.value.length <= 1) return
  currentPhoto.value = (currentPhoto.value - 1 + productImages.value.length) % productImages.value.length
}

function nextPhoto() {
  if (productImages.value.length <= 1) return
  currentPhoto.value = (currentPhoto.value + 1) % productImages.value.length
}

function addToCart() {
  if (!product.value) return
  const ok = cart.addItem(product.value)
  if (!ok) {
    toast.show('Достигнут лимит по наличию')
    return
  }
  justAdded.value = true
  toast.show(product.value.name)
  setTimeout(() => { justAdded.value = false }, 1500)
}

function submitReview() {
  if (!reviewText.value.trim()) return
  reviewsStore.addReview({
    productId: product.value.id,
    userId: auth.currentUser.id,
    userName: auth.currentUser.name,
    rating: reviewRating.value,
    text: reviewText.value.trim(),
  })
  submitted.value = true
  reviewText.value = ''
  setTimeout(() => {
    submitted.value = false
    showReviewForm.value = false
  }, 2000)
}

function onImgError(e) {
  e.target.src = '/images/placeholder.jpg'
}

if (!product.value) {
  router.replace('/catalog')
}
</script>

<template>
  <div v-if="product" class="container-wrap py-8 animate-fade-up">
    <nav class="crumbs mb-6">
      <RouterLink to="/" class="hover:text-forest">Главная</RouterLink> /
      <RouterLink to="/catalog" class="hover:text-forest">Каталог</RouterLink> /
      <span class="text-ink">{{ product.name }}</span>
    </nav>

    <div class="grid gap-8 lg:grid-cols-2">
      <!-- Image gallery -->
      <div>
        <div class="relative overflow-hidden rounded-blob bg-forest-light">
          <img
            v-if="productImages.length"
            :key="currentPhoto"
            :src="productImages[currentPhoto]"
            :alt="product.name"
            class="aspect-square w-full object-cover animate-fade-in"
            @error="onImgError"
          />
          <img v-else :src="product.image" :alt="product.name" class="aspect-square w-full object-cover" @error="onImgError" />
          <div v-if="product.stock <= 5" class="absolute left-4 top-4 rounded-full bg-coral px-3 py-1 text-xs font-bold text-white">Мало</div>
          <button v-if="productImages.length > 1" class="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-soft backdrop-blur-sm transition-colors hover:bg-white" @click="prevPhoto">
            <ChevronLeft class="h-5 w-5 text-ink" />
          </button>
          <button v-if="productImages.length > 1" class="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-soft backdrop-blur-sm transition-colors hover:bg-white" @click="nextPhoto">
            <ChevronRight class="h-5 w-5 text-ink" />
          </button>
          <div v-if="productImages.length > 1" class="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-ink/60 px-3 py-1 text-xs font-bold text-white">
            {{ currentPhoto + 1 }} / {{ productImages.length }}
          </div>
        </div>
        <div v-if="productImages.length > 1" class="mt-3 flex gap-2 overflow-x-auto">
          <button
            v-for="(img, idx) in productImages"
            :key="idx"
            class="shrink-0 overflow-hidden rounded-lg border-2 transition-all"
            :class="idx === currentPhoto ? 'border-forest' : 'border-transparent opacity-60 hover:opacity-100'"
            @click="currentPhoto = idx"
          >
            <img :src="img" alt="" class="h-16 w-16 object-cover" @error="$event.target.style.display='none'" />
          </button>
        </div>
      </div>

      <!-- Info -->
      <div>
        <span class="tag-forest mb-3">{{ getCategoryLabel(product.category) }}</span>
        <h1 class="mt-2 font-display text-3xl font-bold sm:text-4xl">{{ product.name }}</h1>

        <div class="mt-3 flex items-center gap-3">
          <div class="flex text-honey">
            <Star v-for="i in 5" :key="i" class="h-4 w-4" :class="i <= avgRating ? 'fill-current' : 'opacity-30'" />
          </div>
          <span class="text-sm text-muted">{{ avgRating }} ({{ reviewCount }} {{ reviewCount === 1 ? 'отзыв' : 'отзыва' }})</span>
        </div>

        <div class="mt-6 flex items-baseline gap-3">
          <p v-if="product.oldPrice" class="text-2xl text-muted line-through">{{ formatPrice(product.oldPrice) }}</p>
          <p class="text-3xl font-bold" :class="product.oldPrice ? 'text-coral' : 'text-forest'">{{ formatPrice(product.price) }}</p>
        </div>

        <p class="mt-4 leading-relaxed text-muted">{{ product.description || 'Описание товара скоро появится.' }}</p>

        <div class="mt-6 flex items-center gap-4">
          <span class="text-sm text-muted">В наличии: <strong class="text-ink">{{ product.stock }} шт.</strong></span>
        </div>

        <div class="mt-6 flex flex-wrap gap-3">
          <button class="btn-forest min-w-[200px] text-base" :disabled="product.stock <= 0 || justAdded" @click="addToCart">
            <Check v-if="justAdded" class="h-5 w-5" />
            <ShoppingBag v-else class="h-5 w-5" />
            {{ product.stock <= 0 ? 'Нет в наличии' : justAdded ? 'В корзине' : 'В корзину' }}
          </button>
        </div>

        <div class="mt-8 border-t border-line pt-6">
          <h3 class="font-display text-lg font-bold">Характеристики</h3>
          <dl class="mt-3 space-y-2 text-sm">
            <div class="flex justify-between border-b border-dashed border-line pb-2">
              <dt class="text-muted">Категория</dt>
              <dd class="font-semibold">{{ getCategoryLabel(product.category) }}</dd>
            </div>
            <div class="flex justify-between border-b border-dashed border-line pb-2">
              <dt class="text-muted">Цена</dt>
              <dd class="font-semibold">{{ formatPrice(product.price) }}</dd>
            </div>
            <div class="flex justify-between border-b border-dashed border-line pb-2">
              <dt class="text-muted">Наличие</dt>
              <dd class="font-semibold" :class="product.stock <= 5 ? 'text-coral' : 'text-forest'">{{ product.stock }} шт.</dd>
            </div>
            <div class="flex justify-between pb-2">
              <dt class="text-muted">Артикул</dt>
              <dd class="font-semibold">ZR-{{ String(product.id).padStart(4, '0') }}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>

    <!-- Reviews -->
    <section class="mt-14">
      <div class="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 class="font-display text-2xl font-bold">Отзывы</h2>
          <p v-if="reviewCount" class="mt-1 text-sm text-muted">{{ reviewCount }} {{ reviewCount === 1 ? 'человек' : 'человек' }} оставил{{ reviewCount === 1 ? '' : 'и' }} отзыв</p>
        </div>
        <button v-if="canReview" class="btn-forest" @click="showReviewForm = !showReviewForm">
          Написать отзыв
        </button>
        <div v-else-if="auth.isAuthenticated && !canReview && !reviewsStore.canReview(product.id, auth.currentUser?.id)" class="text-sm text-muted">
          Вы уже оставили отзыв на этот товар
        </div>
      </div>

      <!-- Review form -->
      <div v-if="showReviewForm" class="panel mb-8 animate-fade-up">
        <h3 class="font-display text-lg font-bold">Ваш отзыв</h3>
        <p class="mt-1 text-sm text-muted">Расскажите о своём опыте использования товара</p>

        <div v-if="submitted" class="mt-4 rounded-paw bg-forest-light p-4 text-center font-bold text-forest-dark">
          Спасибо! Ваш отзыв опубликован.
        </div>

        <form v-else class="mt-4 space-y-4" @submit.prevent="submitReview">
          <div>
            <label class="label">Оценка</label>
            <div class="flex gap-1">
              <button v-for="i in 5" :key="i" type="button" @click="reviewRating = i" class="transition-colors">
                <Star class="h-6 w-6" :class="i <= reviewRating ? 'fill-honey text-honey' : 'text-line'" />
              </button>
            </div>
          </div>
          <div>
            <label class="label">Отзыв</label>
            <textarea v-model="reviewText" rows="4" class="input resize-none" placeholder="Поделитесь впечатлениями..." required />
          </div>
          <button type="submit" class="btn-forest">Отправить отзыв</button>
        </form>
      </div>

      <!-- Reviews list -->
      <div v-if="reviews.length" class="space-y-4">
        <div v-for="r in reviews" :key="r.id" class="panel transition-all duration-200 hover:-translate-y-1 hover:shadow-paw">
          <div class="flex items-start justify-between">
            <div>
              <p class="font-bold">{{ r.userName }}</p>
              <div class="mt-0.5 flex text-honey">
                <Star v-for="i in 5" :key="i" class="h-3.5 w-3.5" :class="i <= r.rating ? 'fill-current' : 'opacity-20'" />
              </div>
            </div>
            <span class="text-xs text-muted">{{ r.createdAt }}</span>
          </div>
          <p class="mt-3 text-sm leading-relaxed text-muted">{{ r.text }}</p>
        </div>
      </div>

      <div v-else class="panel py-12 text-center">
        <p class="font-semibold">Пока нет отзывов</p>
        <p class="mt-1 text-sm text-muted">Будьте первым, кто оставит отзыв</p>
      </div>
    </section>
  </div>
</template>
