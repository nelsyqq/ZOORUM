<script setup>
import { RouterLink } from 'vue-router'
import { CATEGORIES } from '@/utils/helpers'
import { PawPrint } from 'lucide-vue-next'
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
          <img :src="SITE_IMAGES.pets.dogs" alt="Собака" class="h-10 w-10 rounded-lg object-cover" />
          <img :src="SITE_IMAGES.pets.cats" alt="Кошка" class="h-10 w-10 rounded-lg object-cover" />
          <img :src="SITE_IMAGES.pets.birds" alt="Птица" class="h-10 w-10 rounded-lg object-cover" />
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
        <p class="mt-2 text-sm">г. Москва, ул. Пушкина, д. 10</p>
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
