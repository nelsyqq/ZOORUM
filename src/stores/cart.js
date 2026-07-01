import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import { loadJSON, saveJSON, loadSession, saveSession, clearSession } from '@/utils/storage'

const CHECKOUT_FLAG = 'pending_checkout'

export const useCartStore = defineStore('cart', () => {
  const items = ref(loadJSON('cart', []))
  const isOpen = ref(false)

  const totalItems = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity, 0)
  )

  const totalPrice = computed(() =>
    items.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
  )

  const isEmpty = computed(() => items.value.length === 0)

  watch(items, (val) => saveJSON('cart', val), { deep: true })

  function addItem(product) {
    const existing = items.value.find((i) => i.productId === product.id)
    if (existing) {
      if (product.stock && existing.quantity >= product.stock) return false
      existing.quantity++
    } else {
      items.value.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        oldPrice: product.oldPrice || null,
        image: product.image,
        quantity: 1,
        stock: product.stock ?? 999,
      })
    }
    isOpen.value = true
    return true
  }

  function removeItem(productId) {
    const index = items.value.findIndex((i) => i.productId === productId)
    if (index !== -1) items.value.splice(index, 1)
  }

  function updateQuantity(productId, quantity) {
    const item = items.value.find((i) => i.productId === productId)
    if (!item) return
    if (quantity <= 0) {
      removeItem(productId)
    } else if (item.stock && quantity > item.stock) {
      item.quantity = item.stock
    } else {
      item.quantity = quantity
    }
  }

  function clearCart() {
    items.value = []
  }

  function toggleCart() {
    isOpen.value = !isOpen.value
    syncBodyScroll()
  }

  function openCart() {
    isOpen.value = true
    syncBodyScroll()
  }

  function closeCart() {
    isOpen.value = false
    syncBodyScroll()
  }

  function syncBodyScroll() {
    document.body.classList.toggle('overflow-hidden', isOpen.value)
  }

  function setPendingCheckout(value) {
    if (value) saveSession(CHECKOUT_FLAG, '1')
    else clearSession(CHECKOUT_FLAG)
  }

  function hasPendingCheckout() {
    return loadSession(CHECKOUT_FLAG) === '1'
  }

  function resumeCheckoutIfNeeded() {
    if (hasPendingCheckout() && !isEmpty.value) {
      clearSession(CHECKOUT_FLAG)
      isOpen.value = true
      syncBodyScroll()
      return true
    }
    clearSession(CHECKOUT_FLAG)
    return false
  }

  return {
    items,
    isOpen,
    totalItems,
    totalPrice,
    isEmpty,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toggleCart,
    openCart,
    closeCart,
    setPendingCheckout,
    hasPendingCheckout,
    resumeCheckoutIfNeeded,
  }
})
