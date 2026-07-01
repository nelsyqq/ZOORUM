import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { loadJSON, saveJSON } from '@/utils/storage'
import { syncToCloud } from '@/utils/api'

const defaultUsers = [
  {
    id: 1,
    email: 'admin@zoorum.ru',
    password: 'NELSY2205',
    name: 'Администратор',
    phone: '+7 (999) 123-45-67',
    role: 'admin',
    address: 'г. Москва, ул. Пушкина, д. 10',
    createdAt: '2024-01-15',
  },
  {
    id: 2,
    email: 'user@zoorum.ru',
    password: 'user123',
    name: 'Анна Петрова',
    phone: '+7 (916) 555-12-34',
    role: 'user',
    address: 'г. Москва, ул. Лесная, д. 5, кв. 12',
    createdAt: '2024-06-20',
  },
]

const saved = loadJSON('auth', null)

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref(saved?.currentUser ?? null)
  const users = ref(saved?.users ?? [...defaultUsers])
  let nextUserId = saved?.nextUserId ?? 3

  const isAuthenticated = computed(() => !!currentUser.value)
  const isAdmin = computed(() => currentUser.value?.role === 'admin')
  const userName = computed(() => currentUser.value?.name ?? '')

  function persist() {
    const data = { currentUser: currentUser.value, users: users.value, nextUserId }
    saveJSON('auth', data)
    syncToCloud('auth', data)
  }

  watch([currentUser, users], persist, { deep: true })

  function sanitizeUser(user) {
    const safe = { ...user }
    delete safe.password
    return safe
  }

  function login(email, password) {
    const user = users.value.find(
      (u) => u.email === email.trim().toLowerCase() && u.password === password
    )
    if (!user) return { success: false, error: 'Неверный email или пароль' }
    currentUser.value = sanitizeUser(user)
    persist()
    return { success: true }
  }

  function register({ name, email, phone, password }) {
    const normalized = email.trim().toLowerCase()
    if (users.value.find((u) => u.email === normalized)) {
      return { success: false, error: 'Пользователь с таким email уже существует' }
    }

    const newUser = {
      id: nextUserId++,
      email: normalized,
      password,
      name: name.trim(),
      phone,
      role: 'user',
      address: '',
      createdAt: new Date().toISOString().split('T')[0],
    }
    users.value.push(newUser)
    currentUser.value = sanitizeUser(newUser)
    persist()
    return { success: true }
  }

  function logout() {
    currentUser.value = null
    persist()
  }

  function updateProfile(data) {
    if (!currentUser.value) return { success: false, error: 'Не авторизован' }

    const index = users.value.findIndex((u) => u.id === currentUser.value.id)
    if (index === -1) return { success: false, error: 'Пользователь не найден' }

    const { password: _p, ...safeData } = data
    users.value[index] = { ...users.value[index], ...safeData }
    currentUser.value = sanitizeUser(users.value[index])
    persist()
    return { success: true }
  }

  function deleteUser(id) {
    if (id === currentUser.value?.id) return false
    const index = users.value.findIndex((u) => u.id === id)
    if (index !== -1) {
      users.value.splice(index, 1)
      persist()
      return true
    }
    return false
  }

  function updateUserRole(id, role) {
    const user = users.value.find((u) => u.id === id)
    if (user) {
      user.role = role
      if (currentUser.value?.id === id) {
        currentUser.value = sanitizeUser(user)
      }
      persist()
      return true
    }
    return false
  }

  function fromCloud(data) {
    if (!data) return
    if (data.users) users.value = data.users
    if (data.nextUserId) nextUserId = data.nextUserId
  }

  return {
    currentUser,
    users,
    isAuthenticated,
    isAdmin,
    userName,
    login,
    register,
    logout,
    updateProfile,
    deleteUser,
    updateUserRole,
    fromCloud,
  }
})
