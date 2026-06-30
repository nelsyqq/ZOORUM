import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { loadJSON, saveJSON } from '@/utils/storage'

const defaultOrders = [
  {
    id: 1001,
    userId: 2,
    userName: 'Анна Петрова',
    items: [
      { productId: 1, name: 'Royal Canin Medium Adult', price: 3490, quantity: 2 },
      { productId: 4, name: 'Мячик с пищалкой', price: 390, quantity: 1 },
    ],
    total: 7370,
    status: 'delivered',
    createdAt: '2025-03-10',
    address: 'г. Москва, ул. Лесная, д. 5, кв. 12',
  },
  {
    id: 1002,
    userId: 2,
    userName: 'Анна Петрова',
    items: [
      { productId: 7, name: 'Лежанка «Облако» L', price: 4590, quantity: 1 },
    ],
    total: 4590,
    status: 'processing',
    createdAt: '2025-06-18',
    address: 'г. Москва, ул. Лесная, д. 5, кв. 12',
  },
]

const saved = loadJSON('orders', null)

export const useOrdersStore = defineStore('orders', () => {
  const orders = ref(saved?.orders ?? [...defaultOrders])
  let nextOrderId = saved?.nextOrderId ?? 1003

  function persist() {
    saveJSON('orders', { orders: orders.value, nextOrderId })
  }

  watch(orders, persist, { deep: true })

  function getByUserId(userId) {
    return orders.value.filter((o) => o.userId === userId)
  }

  function createOrder({ userId, userName, items, total, address }) {
    const order = {
      id: nextOrderId++,
      userId,
      userName,
      items: items.map((i) => ({ ...i })),
      total,
      status: 'new',
      createdAt: new Date().toISOString().split('T')[0],
      address,
    }
    orders.value.unshift(order)
    persist()
    return order
  }

  function updateOrderStatus(id, status) {
    const order = orders.value.find((o) => o.id === id)
    if (order) {
      order.status = status
      persist()
      return true
    }
    return false
  }

  function deleteOrder(id) {
    const index = orders.value.findIndex((o) => o.id === id)
    if (index !== -1) {
      orders.value.splice(index, 1)
      persist()
      return true
    }
    return false
  }

  const statusLabels = {
    new: 'Новый',
    processing: 'В обработке',
    shipped: 'Отправлен',
    delivered: 'Доставлен',
    cancelled: 'Отменён',
  }

  return {
    orders,
    getByUserId,
    createOrder,
    updateOrderStatus,
    deleteOrder,
    statusLabels,
  }
})
