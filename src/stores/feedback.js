import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { loadJSON, saveJSON } from '@/utils/storage'
import { syncToCloud } from '@/utils/api'

const saved = loadJSON('feedback', null)

export const useFeedbackStore = defineStore('feedback', () => {
  const requests = ref(saved?.requests ?? [])
  let nextId = saved?.nextId ?? 1

  function persist() {
    const data = { requests: requests.value, nextId }
    saveJSON('feedback', data)
    syncToCloud('feedback', data)
  }

  watch(requests, persist, { deep: true })

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

  function fromCloud(data) {
    if (!data) return
    requests.value = data.requests ?? []
    if (data.nextId) nextId = data.nextId
  }

  return { requests, submitRequest, fromCloud }
})