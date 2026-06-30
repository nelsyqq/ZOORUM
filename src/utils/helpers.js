export const CATEGORIES = [
  { id: 'food', label: 'Корма' },
  { id: 'toys', label: 'Игрушки' },
  { id: 'beds', label: 'Лежанки' },
  { id: 'accessories', label: 'Аксессуары' },
  { id: 'vet', label: 'Ветеринария' },
]

export const PHONE_REGEX = /^\+7\s?\(\d{3}\)\s?\d{3}-\d{2}-\d{2}$/
export const PHONE_INPUT_REGEX = /^\+7\s?\(?\d{0,3}\)?\s?\d{0,3}-?\d{0,2}-?\d{0,2}$/
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function formatPrice(price) {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(price)
}

export function formatDate(dateStr) {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateStr))
}

export function formatPhoneInput(value) {
  const digits = value.replace(/\D/g, '')
  let normalized = digits
  if (normalized.startsWith('8')) normalized = '7' + normalized.slice(1)
  if (!normalized.startsWith('7')) normalized = '7' + normalized
  normalized = normalized.slice(0, 11)

  const rest = normalized.slice(1)
  let result = '+7'
  if (rest.length > 0) result += ` (${rest.slice(0, 3)}`
  if (rest.length >= 3) result += ')'
  if (rest.length > 3) result += ` ${rest.slice(3, 6)}`
  if (rest.length > 6) result += `-${rest.slice(6, 8)}`
  if (rest.length > 8) result += `-${rest.slice(8, 10)}`
  return result
}

export function validatePhone(phone) {
  if (!phone?.trim()) return 'Введите номер телефона'
  if (!PHONE_REGEX.test(phone.trim())) return 'Формат: +7 (XXX) XXX-XX-XX'
  return ''
}

export function validateEmail(email) {
  if (!email?.trim()) return 'Введите email'
  if (!EMAIL_REGEX.test(email.trim())) return 'Введите корректный email'
  return ''
}

export function validateName(name) {
  if (!name?.trim()) return 'Введите имя'
  if (name.trim().length < 2) return 'Имя слишком короткое'
  return ''
}

export function validateMessage(message) {
  if (!message?.trim()) return 'Введите сообщение'
  if (message.trim().length < 10) return 'Сообщение слишком короткое'
  return ''
}

export function validatePassword(password) {
  if (!password) return 'Введите пароль'
  if (password.length < 6) return 'Минимум 6 символов'
  return ''
}

export function getCategoryLabel(id) {
  return CATEGORIES.find((c) => c.id === id)?.label ?? id
}

export { getProductImage, SITE_IMAGES, PRODUCT_IMAGES } from '@/utils/images'
