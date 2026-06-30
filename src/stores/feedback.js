import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useFeedbackStore = defineStore('feedback', () => {
  const requests = ref([])
  let nextId = 1

  function submitRequest({ name, phone, email, message }) {
    const request = {
      id: nextId++,
      name,
      phone,
      email,
      message,
      createdAt: new Date().toISOString(),
      status: 'new',
    }
    requests.value.push(request)
    return request
  }

  return { requests, submitRequest }
})
