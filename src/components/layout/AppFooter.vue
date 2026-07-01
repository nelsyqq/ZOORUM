<script setup>
import { RouterLink } from 'vue-router'
import { CATEGORIES } from '@/utils/helpers'
import { PawPrint, Send, MessageCircle } from 'lucide-vue-next'
import { SITE_IMAGES } from '@/utils/images'

const year = new Date().getFullYear()
</script>

<template>
  <footer class="mt-16 border-t-4 border-forest bg-ink text-[#C5D4CA]">
    <div class="container-wrap grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
      <div>
        <div class="flex items-center gap-2">
          <div class="relative flex h-10 w-10 items-center justify-center rounded-xl bg-forest text-white">
            <img :src="SITE_IMAGES.hero.dog" alt="ЗООРУМ" class="absolute inset-0 h-full w-full rounded-xl object-cover opacity-30" />
            <PawPrint class="relative h-5 w-5" />
          </div>
          <span class="font-display text-2xl font-extrabold text-white">ЗООРУМ</span>
        </div>
        <p class="mt-4 text-sm leading-relaxed">
          Зоомагазин с душой — корма, игрушки, лежанки и ветпрепараты для ваших любимцев. Доставка по всей России.
        </p>
        <div class="mt-4 flex gap-2">
          <a href="#" class="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-white transition-colors hover:bg-[#0088cc]"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-11 20-7-8-2-2"/><path d="M22 2 11 13"/></svg></a>
          <a href="#" class="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-white transition-colors hover:bg-[#4A76A8]"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16v16H4z"/><path d="M9 12h6"/><circle cx="12" cy="12" r="1"/></svg></a>
          <a href="#" class="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-white transition-colors hover:bg-[#25D366]"><MessageCircle class="h-5 w-5" /></a>
        </div>
      </div>

      <div>
        <h4 class="mb-4 font-display font-bold text-white">Каталог</h4>
        <RouterLink v-for="cat in CATEGORIES" :key="cat.id" :to="`/catalog?category=${cat.id}`" class="block py-1.5 text-sm transition-colors hover:text-honey">
          {{ cat.label }}
        </RouterLink>
      </div>

      <div>
        <h4 class="mb-4 font-display font-bold text-white">Информация</h4>
        <RouterLink to="/about" class="block py-1.5 text-sm hover:text-honey">О нас</RouterLink>
        <RouterLink to="/contacts" class="block py-1.5 text-sm hover:text-honey">Контакты</RouterLink>
        <RouterLink to="/profile" class="block py-1.5 text-sm hover:text-honey">Личный кабинет</RouterLink>
        <RouterLink to="/catalog" class="block py-1.5 text-sm hover:text-honey">Все товары</RouterLink>
      </div>

      <div>
        <h4 class="mb-4 font-display font-bold text-white">Связь</h4>
        <a href="tel:+74951234567" class="block py-1.5 text-sm hover:text-honey">+7 (495) 123-45-67</a>
        <a href="mailto:info@zoorum.ru" class="block py-1.5 text-sm hover:text-honey">info@zoorum.ru</a>
        <p class="mt-2 text-sm">Владимирская область, Юрьев-Польский, Советская площадь, 12</p>
        <p class="text-sm">Пн–Вс: 9:00 – 21:00</p>
      </div>
    </div>

    <div class="border-t border-white/10">
      <div class="container-wrap flex flex-wrap items-center justify-between gap-3 py-5 text-xs">
        <span>© {{ year }} ЗООРУМ — с любовью к питомцам</span>
        <span class="text-white/40">Сделано для счастливых хвостиков</span>
      </div>
    </div>
  </footer>
</template>
