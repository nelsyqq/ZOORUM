<script setup>
import { RouterLink } from 'vue-router'
import { ShoppingBag, Check } from 'lucide-vue-next'
import { useCartStore } from '@/stores/cart'
import { useToastStore } from '@/stores/toast'
import { formatPrice, getCategoryLabel } from '@/utils/helpers'
import { computed, ref } from 'vue'

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

    <div class="p-3 sm:p-4">
      <p class="mb-1 text-[10px] font-extrabold uppercase tracking-wider text-muted sm:text-xs">
        {{ getCategoryLabel(product.category) }}
      </p>
      <RouterLink :to="`/product/${product.id}`" class="block">
        <h3 class="mb-2 text-sm font-bold leading-snug text-ink line-clamp-2 transition-colors hover:text-forest sm:mb-3 sm:text-base">{{ product.name }}</h3>
      </RouterLink>
      <div class="flex items-center justify-between gap-1 sm:gap-2">
        <div class="flex flex-col">
          <span v-if="product.oldPrice" class="text-[11px] text-muted line-through sm:text-sm">{{ formatPrice(product.oldPrice) }}</span>
          <span v-if="product.weights?.length" class="font-display text-base font-bold text-forest sm:text-lg">от {{ formatPrice(product.price) }}</span>
          <span v-else class="font-display text-lg font-bold sm:text-xl" :class="product.oldPrice ? 'text-coral' : 'text-forest'">{{ formatPrice(product.price) }}</span>
        </div>
        <button
          class="btn-forest btn-sm !min-h-[32px] !min-w-[32px] !rounded-full !px-2 sm:!px-3 transition-all duration-200 active:scale-90"
          :class="{ '!bg-honey !text-ink !scale-110': justAdded }"
          :disabled="product.stock <= 0"
          @click="addToCart"
        >
          <Check v-if="justAdded" class="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          <ShoppingBag v-else class="h-3 w-3 sm:h-3.5 sm:w-3.5" />
        </button>
      </div>
    </div>
  </article>
</template>
