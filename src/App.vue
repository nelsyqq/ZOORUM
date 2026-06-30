<script setup>
import { RouterView } from 'vue-router'
import AnnounceBar from '@/components/layout/AnnounceBar.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import FeedbackForm from '@/components/layout/FeedbackForm.vue'
import CartDrawer from '@/components/cart/CartDrawer.vue'
import AppToast from '@/components/ui/AppToast.vue'
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
