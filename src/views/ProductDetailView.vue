<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { ShoppingBag, Check, Star, ArrowLeft, ChevronDown, ChevronLeft, ChevronRight, Edit3, Trash2, X } from 'lucide-vue-next'
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
const editingReview = ref(null)
const editText = ref('')
const editRating = ref(5)

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
const selectedWeight = ref(null)

const currentPrice = computed(() => {
  if (selectedWeight.value) return selectedWeight.value.price
  return product.value?.price ?? 0
})

const currentOldPrice = computed(() => {
  if (selectedWeight.value?.oldPrice) return selectedWeight.value.oldPrice
  return product.value?.oldPrice ?? null
})

const currentStock = computed(() => {
  if (selectedWeight.value) return selectedWeight.value.stock ?? 0
  return product.value?.stock ?? 0
})

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
  const weight = selectedWeight.value || undefined
  const name = product.value.name + (weight ? ` (${weight.label})` : '')
  const ok = cart.addItem(product.value, weight)
  if (!ok) {
    toast.show('Достигнут лимит по наличию')
    return
  }
  justAdded.value = true
  toast.show(name)
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

function startEdit(review) {
  editingReview.value = review.id
  editText.value = review.text
  editRating.value = review.rating
}

function cancelEdit() {
  editingReview.value = null
  editText.value = ''
  editRating.value = 5
}

function saveEdit() {
  if (!editText.value.trim() || editingReview.value === null) return
  reviewsStore.updateReview(editingReview.value, {
    text: editText.value.trim(),
    rating: editRating.value,
  })
  toast.show('Отзыв обновлён')
  editingReview.value = null
}

function deleteOwnReview(id) {
  if (!confirm('Удалить отзыв?')) return
  reviewsStore.deleteReview(id)
  toast.show('Отзыв удалён')
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
          <div v-if="currentStock <= 5" class="absolute left-4 top-4 rounded-full bg-coral px-3 py-1 text-xs font-bold text-white">Мало</div>
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
          <p v-if="currentOldPrice" class="text-2xl text-muted line-through">{{ formatPrice(currentOldPrice) }}</p>
          <p class="text-3xl font-bold" :class="currentOldPrice ? 'text-coral' : 'text-forest'">{{ formatPrice(currentPrice) }}</p>
        </div>

        <div v-if="product.weights?.length" class="mt-6">
          <p class="mb-2 text-sm font-bold text-muted">Выберите вес:</p>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="(w, idx) in product.weights"
              :key="idx"
              class="rounded-lg border-2 px-4 py-2 text-sm font-bold transition-all"
              :class="selectedWeight === w ? 'border-forest bg-forest-light text-forest-dark' : 'border-line bg-white text-ink hover:border-forest'"
              @click="selectedWeight = w"
            >
              <span>{{ w.label }}</span>
              <span v-if="w.oldPrice" class="ml-2 text-xs text-muted line-through">{{ formatPrice(w.oldPrice) }}</span>
              <span class="ml-1" :class="w.oldPrice ? 'text-coral' : 'text-forest'">{{ formatPrice(w.price) }}</span>
            </button>
          </div>
        </div>

        <p class="mt-4 leading-relaxed text-muted">{{ product.description || 'Описание товара скоро появится.' }}</p>

        <div class="mt-6 flex items-center gap-4">
          <span class="text-sm text-muted">В наличии: <strong class="text-ink" :class="currentStock <= 5 ? 'text-coral' : ''">{{ currentStock }} шт.</strong></span>
        </div>

        <div class="mt-6 flex flex-wrap gap-3">
          <button class="btn-forest min-w-[200px] text-base" :disabled="currentStock <= 0 || justAdded" @click="addToCart">
            <Check v-if="justAdded" class="h-5 w-5" />
            <ShoppingBag v-else class="h-5 w-5" />
            {{ currentStock <= 0 ? 'Нет в наличии' : justAdded ? 'В корзине' : 'В корзину' }}
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
            <div class="flex items-center gap-2">
              <span class="text-xs text-muted">{{ r.createdAt }}</span>
              <span v-if="r.editedAt" class="text-[10px] text-muted">(ред. {{ r.editedAt }})</span>
            </div>
          </div>

          <!-- Edit form -->
          <div v-if="editingReview === r.id" class="mt-3 space-y-3">
            <div class="flex gap-1">
              <button v-for="i in 5" :key="i" type="button" @click="editRating = i" class="transition-colors">
                <Star class="h-5 w-5" :class="i <= editRating ? 'fill-honey text-honey' : 'text-line'" />
              </button>
            </div>
            <textarea v-model="editText" rows="3" class="input resize-none text-sm" placeholder="Измените отзыв..." />
            <div class="flex gap-2">
              <button class="btn-forest btn-sm" @click="saveEdit">Сохранить</button>
              <button class="btn-sm rounded-paw border-2 border-line px-4 font-bold transition-colors hover:border-coral hover:text-coral" @click="cancelEdit">
                <X class="h-3.5 w-3.5" />
                Отмена
              </button>
            </div>
          </div>

          <!-- Review text -->
          <p v-else class="mt-3 text-sm leading-relaxed text-muted">{{ r.text }}</p>

          <!-- Edit / Delete buttons -->
          <div v-if="auth.isAuthenticated && auth.currentUser.id === r.userId && reviewsStore.canEditReview(r.id, auth.currentUser.id) && editingReview !== r.id" class="mt-2 flex gap-2">
            <button class="text-xs font-bold text-muted transition-colors hover:text-forest" @click="startEdit(r)">
              <Edit3 class="mr-1 inline h-3 w-3" />
              Редактировать
            </button>
            <button class="text-xs font-bold text-muted transition-colors hover:text-coral" @click="deleteOwnReview(r.id)">
              <Trash2 class="mr-1 inline h-3 w-3" />
              Удалить
            </button>
          </div>
        </div>
      </div>

      <div v-else class="panel py-12 text-center">
        <p class="font-semibold">Пока нет отзывов</p>
        <p class="mt-1 text-sm text-muted">Будьте первым, кто оставит отзыв</p>
      </div>
    </section>
  </div>
</template>
