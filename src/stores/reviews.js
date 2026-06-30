import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { loadJSON, saveJSON } from '@/utils/storage'

const saved = loadJSON('reviews', null)

export const useReviewsStore = defineStore('reviews', () => {
  const reviews = ref(saved?.reviews ?? [
    { id: 1, productId: 1, userId: 2, userName: 'Анна Петрова', rating: 5, text: 'Отличный корм! Собака ест с удовольствием, шерсть стала блестящей.', createdAt: '2025-04-15' },
    { id: 2, productId: 1, userId: 2, userName: 'Анна Петрова', rating: 4, text: 'Хороший состав, но цена кусается.', createdAt: '2025-05-20' },
    { id: 3, productId: 7, userId: 2, userName: 'Анна Петрова', rating: 5, text: 'Лежанка очень удобная, собака спит только на ней.', createdAt: '2025-06-25' },
    { id: 4, productId: 4, userId: 2, userName: 'Анна Петрова', rating: 5, text: 'Мячик отличного качества! Собака грызёт его каждый день, не сдувается и не рвётся. Очень довольны покупкой!', createdAt: '2025-07-01' },
    { id: 5, productId: 4, userId: 2, userName: 'Анна Петрова', rating: 4, text: 'Хороший мячик за свою цену. Пищалка звонкая, собаке нравится.', createdAt: '2025-07-10' },
    { id: 6, productId: 5, userId: 2, userName: 'Анна Петрова', rating: 5, text: 'Отличная головоломка! Кошка быстро поняла, как доставать лакомства, теперь играет каждый день.', createdAt: '2025-06-30' },
  ])
  let nextId = saved?.nextId ?? 7

  function persist() {
    saveJSON('reviews', { reviews: reviews.value, nextId })
  }

  function getByProduct(productId) {
    return reviews.value.filter(r => r.productId === productId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }

  function getByUser(userId) {
    return reviews.value.filter(r => r.userId === userId)
  }

  function canReview(productId, userId) {
    return !reviews.value.some(r => r.productId === productId && r.userId === userId)
  }

  function addReview({ productId, userId, userName, rating, text }) {
    const review = {
      id: nextId++,
      productId,
      userId,
      userName,
      rating,
      text,
      createdAt: new Date().toISOString().split('T')[0],
    }
    reviews.value.unshift(review)
    persist()
    return review
  }

  function deleteReview(id) {
    const idx = reviews.value.findIndex(r => r.id === id)
    if (idx !== -1) {
      reviews.value.splice(idx, 1)
      persist()
      return true
    }
    return false
  }

  const averageRating = (productId) => {
    const productReviews = reviews.value.filter(r => r.productId === productId)
    if (!productReviews.length) return 0
    return Math.round(productReviews.reduce((s, r) => s + r.rating, 0) / productReviews.length * 10) / 10
  }

  const ratingCount = (productId) => reviews.value.filter(r => r.productId === productId).length

  return {
    reviews,
    getByProduct,
    getByUser,
    canReview,
    addReview,
    deleteReview,
    averageRating,
    ratingCount,
  }
})
