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
          <a href="#" class="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-white transition-colors hover:bg-[#0088cc]"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg></a>
          <a href="#" class="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-white transition-colors hover:bg-[#4A76A8]"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 48 48"><path d="M45 24c0 11.6-9.4 21-21 21S3 35.6 3 24 12.4 3 24 3s21 9.4 21 21zM24.5 14c-1.1 0-1.6.5-1.8 1.5-.5 2.1-1.3 7.2-1.9 9.6-.3.9.1 1.4 1.1 1.4.9 0 2.2-.2 3.1-.5 2.3-.7 3.7 1.6 2.7 3.3-1.4 2.4-2.7 4.7-5.1 6.2-1.4.9-3.6 1.6-5.3.8-1.4-.6-2.2-1.9-2.3-3.3-.1-1.2.2-2.5.6-3.7.3-1 .8-1.9 1.2-2.9.2-.5.2-.8-.1-1.2-.4-.6-1-1-1.2-1.8-.1-.5.1-.9.5-1.2 1.3-.9 3.3-1.3 4.7-1.3 1 0 1.8.2 2.1 1.1.3 1.1.8 3.4 1 4.4.1.3.2.6.4.8.5.5 1 .2 1.4-.2 1.1-1.1 2.1-2.4 2.8-3.8.4-.8.2-1.3-.7-1.5-.7-.1-1.2-.1-1.9-.1z"/></svg></a>
          <a href="#" class="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-white transition-colors hover:bg-[#25D366]"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg></a>
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
