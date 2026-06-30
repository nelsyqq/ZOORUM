<script setup>
import { ref, reactive } from 'vue'
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'
import { useFeedbackStore } from '@/stores/feedback'
import { validateName, validatePhone, validateEmail, validateMessage, formatPhoneInput } from '@/utils/helpers'
import { SITE_IMAGES } from '@/utils/images'

const feedback = useFeedbackStore()
const form = reactive({ name: '', phone: '', email: '', message: '' })
const errors = reactive({ name: '', phone: '', email: '', message: '' })
const submitted = ref(false)

const contacts = [
  { icon: Phone, label: 'Телефон', value: '+7 (495) 123-45-67', href: 'tel:+74951234567' },
  { icon: Mail, label: 'Email', value: 'info@zoorum.ru', href: 'mailto:info@zoorum.ru' },
  { icon: MapPin, label: 'Адрес', value: 'Владимирская область, Юрьев-Польский, Советская площадь, 12' },
  { icon: Clock, label: 'Режим работы', value: 'Пн–Вс: 9:00 – 21:00' },
]

function onPhoneInput(e) { form.phone = formatPhoneInput(e.target.value) }

function submit() {
  errors.name = validateName(form.name)
  errors.phone = validatePhone(form.phone)
  errors.email = validateEmail(form.email)
  errors.message = validateMessage(form.message)
  if (Object.values(errors).some(Boolean)) return
  feedback.submitRequest({ ...form })
  submitted.value = true
  Object.assign(form, { name: '', phone: '', email: '', message: '' })
  setTimeout(() => { submitted.value = false }, 4000)
}
</script>

<template>
  <section class="bg-forest-light">
    <div class="container-wrap py-8 text-center animate-fade-up">
      <nav class="crumbs"><RouterLink to="/" class="hover:text-forest">Главная</RouterLink> / Контакты</nav>
      <h1 class="mt-3 font-display text-3xl font-extrabold text-ink">Свяжитесь с нами</h1>
      <p class="mt-1 text-muted">Мы всегда рады помочь вам и вашим питомцам</p>
    </div>
  </section>

  <div class="container-wrap grid gap-8 py-12 lg:grid-cols-2">
    <div class="space-y-4">
      <div v-for="c in contacts" :key="c.label" class="panel flex items-center gap-4 !p-5">
        <div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-forest-light">
          <component :is="c.icon" class="h-6 w-6 text-forest" />
        </div>
        <div>
          <p class="text-xs font-extrabold uppercase tracking-wider text-muted">{{ c.label }}</p>
          <component :is="c.href ? 'a' : 'p'" :href="c.href" class="mt-0.5 text-lg font-bold" :class="{ 'hover:text-forest': c.href }">
            {{ c.value }}
          </component>
        </div>
      </div>
      <div class="overflow-hidden rounded-blob shadow-soft">
        <iframe src="https://yandex.ru/map-widget/v1/?ll=39.6814%2C56.4971&z=17&pt=39.6814%2C56.4971%2Cpm2rdm&text=%D0%92%D0%BB%D0%B0%D0%B4%D0%B8%D0%BC%D0%B8%D1%80%D1%81%D0%BA%D0%B0%D1%8F%20%D0%BE%D0%B1%D0%BB%D0%B0%D1%81%D1%82%D1%8C%2C%20%D0%AE%D1%80%D1%8C%D0%B5%D0%B2-%D0%9F%D0%BE%D0%BB%D1%8C%D1%81%D0%BA%D0%B8%D0%B9%2C%20%D0%A1%D0%BE%D0%B2%D0%B5%D1%82%D1%81%D0%BA%D0%B0%D1%8F%20%D0%BF%D0%BB%D0%BE%D1%89%D0%B0%D0%B4%D1%8C%2C%2012" width="100%" height="300" style="border:0;" allowfullscreen loading="lazy" class="w-full rounded-blob"></iframe>
      </div>
    </div>

    <div class="panel">
      <h2 class="font-display text-2xl font-bold">Напишите нам</h2>
      <p class="mt-1 text-sm text-muted">Ответим в течение 2 часов в рабочее время</p>

      <div v-if="submitted" class="mt-5 rounded-paw bg-forest-light p-4 text-center font-bold text-forest-dark">
        Спасибо! Мы свяжемся с вами в ближайшее время.
      </div>

      <form v-else class="mt-5 space-y-4" @submit.prevent="submit">
        <div><label class="label">Имя</label><input v-model="form.name" class="input" :class="{ 'input-error': errors.name }" placeholder="Как к вам обращаться?" /><p v-if="errors.name" class="error-text">{{ errors.name }}</p></div>
        <div><label class="label">Телефон</label><input :value="form.phone" type="tel" class="input" placeholder="+7 (___) ___-__-__" @input="onPhoneInput" /><p v-if="errors.phone" class="error-text">{{ errors.phone }}</p></div>
        <div><label class="label">Email</label><input v-model="form.email" type="email" class="input" placeholder="info@zoorum.ru" /><p v-if="errors.email" class="error-text">{{ errors.email }}</p></div>
        <div><label class="label">Сообщение</label><textarea v-model="form.message" rows="4" class="input resize-none" placeholder="Расскажите о вашем питомце и вопросе..." /><p v-if="errors.message" class="error-text">{{ errors.message }}</p></div>
        <button type="submit" class="btn-forest btn-block"><Send class="h-4 w-4" /> Отправить</button>
      </form>
    </div>
  </div>
</template>
