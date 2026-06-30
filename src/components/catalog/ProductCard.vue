<script setup>
import { RouterLink } from 'vue-router'
import { ShoppingBag, Check } from 'lucide-vue-next'
import { useCartStore } from '@/stores/cart'
import { useToastStore } from '@/stores/toast'
import { formatPrice, getCategoryLabel } from '@/utils/helpers'
import { ref } from 'vue'

const props = defineProps({
  product: { type: Object, required: true },
  badge: { type: String, default: '' },
})

const cart = useCartStore()
const toast = useToastStore()
const justAdded = ref(false)

function addToCart(e) {
  e.stopPropagation()
  const ok = cart.addItem(props.product)
  if (!ok) {
    toast.show('Достигнут лимит по наличию')
    return
  }
  justAdded.value = true
  toast.show(props.product.name)
  setTimeout(() => { justAdded.value = false }, 1500)
}

function onImgError(e) {
  e.target.src = '/images/placeholder.jpg'
}
</script>

<template>
  <article class="pet-card group">
    <RouterLink :to="`/product/${product.id}`" class="block">
      <div class="relative aspect-[4/5] overflow-hidden bg-forest-light">
        <img
          :src="product.image"
          :alt="product.name"
          class="img-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
          @error="onImgError"
        />
        <div class="absolute left-3 top-3 flex flex-col gap-1.5">
          <span
            v-if="badge"
            class="rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase text-white"
            :class="badge === 'hit' ? 'bg-honey text-ink' : badge === 'new' ? 'bg-forest' : 'bg-coral'"
          >
            {{ badge === 'hit' ? 'Хит' : badge === 'new' ? 'Новинка' : 'Акция' }}
          </span>
        </div>
        <span v-if="product.stock <= 5" class="absolute bottom-3 right-3 tag-coral">Мало</span>
      </div>
    </RouterLink>

    <div class="p-4">
      <p class="mb-1 text-xs font-extrabold uppercase tracking-wider text-muted">
        {{ getCategoryLabel(product.category) }}
      </p>
      <RouterLink :to="`/product/${product.id}`" class="block">
        <h3 class="mb-3 font-bold leading-snug text-ink line-clamp-2 transition-colors hover:text-forest">{{ product.name }}</h3>
      </RouterLink>
      <div class="flex items-center justify-between gap-2">
        <span class="font-display text-xl font-bold text-forest">{{ formatPrice(product.price) }}</span>
        <button
          class="btn-forest btn-sm !rounded-full !px-3 transition-all duration-200 active:scale-90"
          :class="{ '!bg-honey !text-ink !scale-110': justAdded }"
          :disabled="product.stock <= 0"
          @click="addToCart"
        >
          <Check v-if="justAdded" class="h-3.5 w-3.5" />
          <ShoppingBag v-else class="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  </article>
</template>
