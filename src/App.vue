<script setup>
import { onMounted, onUnmounted } from 'vue'
import { RouterView } from 'vue-router'
import AnnounceBar from '@/components/layout/AnnounceBar.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import FeedbackForm from '@/components/layout/FeedbackForm.vue'
import CartDrawer from '@/components/cart/CartDrawer.vue'
import AppToast from '@/components/ui/AppToast.vue'
import { loadAllFromCloud } from '@/utils/api'
import { useProductsStore } from '@/stores/products'
import { useCartStore } from '@/stores/cart'
import { useOrdersStore } from '@/stores/orders'
import { useAuthStore } from '@/stores/auth'
import { useReviewsStore } from '@/stores/reviews'
import { useFeedbackStore } from '@/stores/feedback'

async function syncFromCloud() {
  const data = await loadAllFromCloud()
  if (!data) return
  useProductsStore().fromCloud(data.products)
  useCartStore().fromCloud(data.cart)
  useOrdersStore().fromCloud(data.orders)
  useAuthStore().fromCloud(data.auth)
  useReviewsStore().fromCloud(data.reviews)
  useFeedbackStore().fromCloud(data.feedback)
}

onMounted(() => {
  syncFromCloud()
  const interval = setInterval(syncFromCloud, 20000)
  onUnmounted(() => clearInterval(interval))
})
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <AnnounceBar />
    <AppHeader />
    <main class="flex-1">
      <RouterView />
    </main>
    <FeedbackForm />
    <AppFooter />
    <CartDrawer />
    <AppToast />
  </div>
</template>
