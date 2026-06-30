<script setup>
import { RouterLink } from 'vue-router'
import { ArrowRight, Heart, Truck, Stethoscope, PawPrint, Star } from 'lucide-vue-next'
import { useProductsStore } from '@/stores/products'
import ProductCard from '@/components/catalog/ProductCard.vue'
import { CATEGORIES } from '@/utils/helpers'
import { SITE_IMAGES } from '@/utils/images'

const products = useProductsStore()

const perks = [
  { icon: Truck, title: 'Быстрая доставка', text: 'Корм и аксессуары прямо к двери', color: 'bg-sky-light text-sky' },
  { icon: Stethoscope, title: 'Ветеринар 24/7', text: 'Консультация перед покупкой', color: 'bg-forest-light text-forest' },
  { icon: Heart, title: 'Любовь к питомцам', text: 'Только проверенные бренды', color: 'bg-red-50 text-coral' },
]
</script>

<template>
  <!-- Hero -->
  <section class="relative overflow-hidden bg-gradient-to-br from-cream via-white to-forest-light/30">
    <div class="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-honey-light opacity-60 blur-3xl animate-pulse-soft" />
    <div class="absolute -bottom-10 -left-10 h-56 w-56 rounded-full bg-forest-light opacity-80 blur-3xl animate-pulse-soft" style="animation-delay: 1s" />

    <div class="container-wrap relative grid items-center gap-8 py-10 lg:grid-cols-2 lg:py-16">
      <div class="animate-fade-up">
        <span class="inline-flex items-center gap-1.5 rounded-full bg-forest px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-soft">Зоомагазин №1</span>
        <h1 class="mt-4 font-display text-[clamp(2rem,5vw,3.5rem)] font-extrabold leading-[1.1] text-ink text-balance">
          Счастливый хвост<br />
          <span class="text-forest">начинается</span> с ЗООРУМ
        </h1>
        <p class="mt-3 max-w-md text-base text-muted">
          Корма, игрушки, лежанки и ветпрепараты — всё для собак, кошек и других любимцев с доставкой на дом.
        </p>
        <div class="mt-6 flex flex-wrap gap-3">
          <RouterLink to="/catalog" class="btn-forest text-sm shadow-paw">
            В каталог <ArrowRight class="h-4 w-4" />
          </RouterLink>
          <RouterLink to="/about" class="btn-outline text-sm">Наша история</RouterLink>
        </div>
      </div>

      <div class="relative mx-auto w-full max-w-md">
        <img :src="SITE_IMAGES.hero.main" alt="Собака" class="aspect-square w-full rounded-blob object-cover shadow-paw animate-scale-in" />
        <img :src="SITE_IMAGES.hero.cat" alt="Кошка" class="absolute -bottom-3 -left-3 h-24 w-24 rounded-2xl border-4 border-cream object-cover shadow-soft animate-fade-up delay-200 sm:h-32 sm:w-32" />
        <img :src="SITE_IMAGES.hero.puppy" alt="Щенок и котёнок" class="absolute -right-2 top-6 h-20 w-20 rounded-2xl border-4 border-cream object-cover shadow-soft animate-fade-up delay-300 sm:h-28 sm:w-28" />
        <div class="absolute -bottom-1 right-6 rounded-paw bg-honey px-3 py-1.5 text-xs font-extrabold text-ink shadow-honey animate-scale-in delay-500">
          Подарок новичку!
        </div>
      </div>
    </div>
  </section>

  <!-- Categories with icons -->
  <section class="relative -mt-6 z-10">
    <div class="container-wrap">
      <div class="grid grid-cols-5 gap-2">
        <RouterLink
          v-for="cat in CATEGORIES"
          :key="cat.id"
          :to="`/catalog?category=${cat.id}`"
          class="group flex flex-col items-center gap-1.5 rounded-xl bg-white p-2.5 text-center shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-paw sm:p-4"
        >
          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-forest-light text-forest transition-colors duration-300 group-hover:bg-forest group-hover:text-white sm:h-14 sm:w-14">
            <PawPrint class="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <span class="text-[10px] font-bold text-ink sm:text-sm">{{ cat.label }}</span>
        </RouterLink>
      </div>
    </div>
  </section>

  <!-- Stats -->
  <section class="container-wrap py-10">
    <div class="mx-auto grid max-w-3xl gap-4 sm:grid-cols-3">
      <div class="rounded-blob bg-gradient-to-br from-forest-light to-white p-5 text-center shadow-soft sm:p-6">
        <p class="font-display text-3xl font-extrabold text-forest sm:text-4xl">15+</p>
        <p class="text-xs font-bold text-muted">лет заботы</p>
      </div>
      <div class="rounded-blob bg-gradient-to-br from-honey-light to-white p-5 text-center shadow-soft sm:p-6">
        <p class="font-display text-3xl font-extrabold text-honey-dark sm:text-4xl">3000+</p>
        <p class="text-xs font-bold text-muted">довольных клиентов</p>
      </div>
      <div class="rounded-blob bg-gradient-to-br from-sky-light to-white p-5 text-center shadow-soft sm:p-6">
        <p class="font-display text-3xl font-extrabold text-sky sm:text-4xl">100%</p>
        <p class="text-xs font-bold text-muted">качественные товары</p>
      </div>
    </div>
  </section>

  <!-- Popular products -->
  <section class="bg-gradient-to-b from-forest-light/10 to-transparent py-10">
    <div class="container-wrap">
      <div class="mb-6 text-center">
        <span class="inline-flex items-center gap-1 rounded-full bg-forest-light px-3 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-forest-dark">Выбор покупателей</span>
        <h2 class="mt-2 font-display text-2xl font-bold text-ink sm:text-3xl">Хиты для хвостиков</h2>
        <p class="mt-1 text-sm text-muted">Самое популярное у наших покупателей</p>
      </div>
      <div class="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <ProductCard
          v-for="(product, i) in products.featuredProducts"
          :key="product.id"
          :product="product"
          :badge="i === 0 ? 'hit' : i === 1 ? 'new' : ''"
          :style="{ animationDelay: `${(i + 1) * 100}ms` }"
          class="animate-fade-up"
        />
      </div>
      <div class="mt-6 text-center">
        <RouterLink to="/catalog" class="btn-forest inline-flex text-sm">
          Смотреть все товары <ArrowRight class="h-4 w-4" />
        </RouterLink>
      </div>
    </div>
  </section>

  <!-- Promo banners -->
  <section class="container-wrap py-10">
    <div class="grid gap-4 md:grid-cols-2">
      <RouterLink to="/catalog?category=food" class="group relative overflow-hidden rounded-blob shadow-paw">
        <img :src="SITE_IMAGES.promo.sale" alt="Акция на корма" class="aspect-[16/9] w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div class="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent flex flex-col justify-end p-6 sm:p-8">
          <span class="inline-flex w-fit items-center gap-1 rounded-full bg-honey px-2.5 py-0.5 text-[10px] font-extrabold uppercase text-ink shadow-soft">Акция</span>
          <h3 class="mt-2 font-display text-2xl font-bold text-white sm:text-3xl">−15% на корма</h3>
          <p class="mt-0.5 text-xs text-white/80">При заказе от 5 000 ₽</p>
        </div>
      </RouterLink>
      <RouterLink to="/profile" class="group relative overflow-hidden rounded-blob shadow-soft">
        <img :src="SITE_IMAGES.promo.gift" alt="Подарок" class="aspect-[16/9] w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div class="absolute inset-0 bg-gradient-to-t from-forest-dark/90 via-forest-dark/20 to-transparent flex flex-col justify-end p-6 sm:p-8">
          <span class="inline-flex w-fit items-center gap-1 rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-extrabold uppercase text-white backdrop-blur-sm">Новичкам</span>
          <h3 class="mt-2 font-display text-2xl font-bold text-white sm:text-3xl">Игрушка в подарок</h3>
          <p class="mt-0.5 text-xs text-white/80">При первой регистрации</p>
        </div>
      </RouterLink>
    </div>
  </section>

</template>
