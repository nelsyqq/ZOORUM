<script setup>
import { ref, reactive } from 'vue'
import { MessageCircle, Send, CheckCircle, X } from 'lucide-vue-next'
import { useFeedbackStore } from '@/stores/feedback'
import {
  validateName,
  validatePhone,
  validateEmail,
  validateMessage,
  formatPhoneInput,
} from '@/utils/helpers'

const feedback = useFeedbackStore()
const isOpen = ref(false)
const isSubmitted = ref(false)

const form = reactive({
  name: '',
  phone: '',
  email: '',
  message: '',
})

const errors = reactive({
  name: '',
  phone: '',
  email: '',
  message: '',
})

function validate() {
  errors.name = validateName(form.name)
  errors.phone = validatePhone(form.phone)
  errors.email = validateEmail(form.email)
  errors.message = validateMessage(form.message)
  return !Object.values(errors).some(Boolean)
}

function onPhoneInput(e) {
  form.phone = formatPhoneInput(e.target.value)
  errors.phone = ''
}

function submit() {
  if (!validate()) return
  feedback.submitRequest({ ...form })
  isSubmitted.value = true
  setTimeout(() => {
    isSubmitted.value = false
    isOpen.value = false
    form.name = ''
    form.phone = ''
    form.email = ''
    form.message = ''
  }, 2500)
}

function toggle() {
  isOpen.value = !isOpen.value
  if (!isOpen.value) isSubmitted.value = false
}
</script>

<template>
  <!-- Floating button -->
  <button
    class="fixed bottom-6 right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-forest text-white shadow-paw transition-all hover:scale-105 hover:bg-forest-dark active:scale-95 sm:bottom-8 sm:right-8"
    aria-label="Оставить заявку"
    @click="toggle"
  >
    <MessageCircle v-if="!isOpen" class="h-6 w-6" />
    <X v-else class="h-6 w-6" />
  </button>

  <!-- Modal -->
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
        @click.self="toggle"
      >
        <div class="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" />

        <div class="relative w-full max-w-lg animate-slide-up rounded-t-3xl bg-white p-6 shadow-modal sm:rounded-3xl sm:p-8">
          <button
            class="absolute right-4 top-4 rounded-lg p-1.5 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-600"
            @click="toggle"
          >
            <X class="h-5 w-5" />
          </button>

          <div v-if="isSubmitted" class="flex flex-col items-center py-8 text-center">
            <div class="flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
              <CheckCircle class="h-8 w-8 text-green-500" />
            </div>
            <h3 class="mt-4 text-lg font-bold text-stone-900">Заявка отправлена!</h3>
            <p class="mt-2 text-sm text-stone-500">Мы свяжемся с вами в ближайшее время</p>
          </div>

          <form v-else @submit.prevent="submit">
            <h3 class="text-xl font-bold text-stone-900">Оставить заявку</h3>
            <p class="mt-1 text-sm text-stone-500">Задайте вопрос или оставьте пожелание</p>

            <div class="mt-6 space-y-4">
              <div>
                <label class="label" for="fb-name">Имя</label>
                <input
                  id="fb-name"
                  v-model="form.name"
                  type="text"
                  class="input"
                  :class="{ 'input-error': errors.name }"
                  placeholder="Ваше имя"
                  @blur="errors.name = validateName(form.name)"
                />
                <p v-if="errors.name" class="error-text">{{ errors.name }}</p>
              </div>

              <div>
                <label class="label" for="fb-phone">Телефон</label>
                <input
                  id="fb-phone"
                  :value="form.phone"
                  type="tel"
                  class="input"
                  :class="{ 'input-error': errors.phone }"
                  placeholder="+7 (___) ___-__-__"
                  @input="onPhoneInput"
                  @blur="errors.phone = validatePhone(form.phone)"
                />
                <p v-if="errors.phone" class="error-text">{{ errors.phone }}</p>
              </div>

              <div>
                <label class="label" for="fb-email">Email</label>
                <input
                  id="fb-email"
                  v-model="form.email"
                  type="email"
                  class="input"
                  :class="{ 'input-error': errors.email }"
                  placeholder="email@example.com"
                  @blur="errors.email = validateEmail(form.email)"
                />
                <p v-if="errors.email" class="error-text">{{ errors.email }}</p>
              </div>

              <div>
                <label class="label" for="fb-message">Сообщение</label>
                <textarea
                  id="fb-message"
                  v-model="form.message"
                  rows="3"
                  class="input resize-none"
                  :class="{ 'input-error': errors.message }"
                  placeholder="Ваш вопрос или пожелание..."
                  @blur="errors.message = validateMessage(form.message)"
                />
                <p v-if="errors.message" class="error-text">{{ errors.message }}</p>
              </div>
            </div>

            <button type="submit" class="btn-forest btn-block mt-6 w-full">
              <Send class="h-4 w-4" />
              Отправить заявку
            </button>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.25s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
