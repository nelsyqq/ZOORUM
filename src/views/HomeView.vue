<script setup>
import { RouterLink } from 'vue-router'
import { ArrowRight, Heart, Truck, Stethoscope, Sparkles } from 'lucide-vue-next'
import { useProductsStore } from '@/stores/products'
import ProductCard from '@/components/catalog/ProductCard.vue'
import { CATEGORIES } from '@/utils/helpers'
import { SITE_IMAGES } from '@/utils/images'

const products = useProductsStore()

const perks = [
  { icon: Truck, title: 'Доставка за 1–2 дня', text: 'Корм и аксессуары прямо к двери', color: 'bg-sky-light text-sky' },
  { icon: Stethoscope, title: 'Ветеринар 24/7', text: 'Консультация перед покупкой', color: 'bg-forest-light text-forest' },
  { icon: Heart, title: 'Любовь к питомцам', text: 'Только проверенные бренды', color: 'bg-red-50 text-coral' },
  { icon: Sparkles, title: 'Бонусы и подарки', text: 'Копите лапки — получайте скидки', color: 'bg-honey-light text-honey-dark' },
]

const petTypes = [
  { label: 'Собаки', img: SITE_IMAGES.pets.dogs, to: '/catalog?category=food' },
  { label: 'Кошки', img: SITE_IMAGES.pets.cats, to: '/catalog?category=food' },
  { label: 'Птицы', img: SITE_IMAGES.pets.birds, to: '/catalog?category=accessories' },
  { label: 'Рыбки', img: SITE_IMAGES.pets.fish, to: '/catalog?category=accessories' },
]

const reviews = [
  { name: 'Мария и Барсик', text: 'Заказываю корм уже полгода — кот доволен, доставка быстрая!', rating: 5 },
  { name: 'Дмитрий и Рекс', text: 'Отличный выбор игрушек. Рекс в восторге от новой кости!', rating: 5 },
  { name: 'Елена и Муся', text: 'Помогли подобрать корм для кошки с аллергией. Спасибо!', rating: 5 },
]
</script>

<template>
  <!-- Hero -->
  <section class="relative overflow-hidden bg-paws">
    <div class="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-honey-light opacity-60 blur-3xl animate-pulse-soft" />
    <div class="absolute -bottom-10 -left-10 h-56 w-56 rounded-full bg-forest-light opacity-80 blur-3xl animate-pulse-soft" style="animation-delay: 1s" />

    <div class="container-wrap relative grid items-center gap-10 py-12 lg:grid-cols-2 lg:py-20">
      <div class="animate-fade-up">
        <span class="tag-honey mb-4">Зоомагазин №1</span>
        <h1 class="font-display text-[clamp(2.2rem,6vw,3.8rem)] font-extrabold leading-[1.1] text-ink text-balance">
          Счастливый хвост<br />
          <span class="text-forest">начинается</span> с ЗООРУМ
        </h1>
        <p class="mt-5 max-w-md text-lg text-muted">
          Корма, игрушки, лежанки и ветпрепараты — всё для собак, кошек и других любимцев с доставкой на дом.
        </p>
        <div class="mt-8 flex flex-wrap gap-3">
          <RouterLink to="/catalog" class="btn-forest text-base">
            В каталог <ArrowRight class="h-5 w-5" />
          </RouterLink>
          <RouterLink to="/about" class="btn-outline">Наша история</RouterLink>
        </div>
      </div>

      <div class="relative mx-auto w-full max-w-lg">
        <img :src="SITE_IMAGES.hero.main" alt="Собака" class="aspect-square w-full rounded-blob object-cover shadow-paw animate-scale-in" />
        <img :src="SITE_IMAGES.hero.cat" alt="Кошка" class="absolute -bottom-4 -left-4 h-28 w-28 rounded-2xl border-4 border-cream object-cover shadow-soft animate-fade-up delay-200 sm:h-36 sm:w-36" />
        <img :src="SITE_IMAGES.hero.puppy" alt="Щенок и котёнок" class="absolute -right-2 top-8 h-24 w-24 rounded-2xl border-4 border-cream object-cover shadow-soft animate-fade-up delay-300 sm:h-32 sm:w-32" />
        <div class="absolute -bottom-2 right-8 rounded-paw bg-honey px-4 py-2 font-extrabold text-ink shadow-honey animate-scale-in delay-500">
          Подарок новичку!
        </div>
      </div>
    </div>
  </section>

  <!-- Pet types -->
  <section class="border-y-2 border-line bg-white py-10 animate-fade-up">
    <div class="container-wrap">
      <p class="mb-6 text-center text-sm font-extrabold uppercase tracking-widest text-muted">Для кого покупаем?</p>
      <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <RouterLink
          v-for="(pet, i) in petTypes"
          :key="pet.label"
          :to="pet.to"
          class="group relative overflow-hidden rounded-blob shadow-soft transition-all duration-300 hover:-translate-y-2 hover:shadow-paw animate-fade-up"
          :class="`delay-${(i + 1) * 100}`"
        >
          <img :src="pet.img" :alt="pet.label" class="aspect-square img-cover transition-transform duration-500 group-hover:scale-110" />
          <div class="absolute inset-0 flex flex-col items-center justify-end bg-gradient-to-t from-ink/70 to-transparent p-4 text-white">
            <span class="font-display text-lg font-bold">{{ pet.label }}</span>
          </div>
        </RouterLink>
      </div>
    </div>
  </section>

  <!-- Perks -->
  <section class="container-wrap py-14 animate-fade-up">
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div v-for="(p, i) in perks" :key="p.title" class="panel flex gap-4 !p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-paw animate-fade-up" :class="`delay-${(i + 1) * 100}`">
        <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl" :class="p.color">
          <component :is="p.icon" class="h-6 w-6" />
        </div>
        <div>
          <strong class="block font-bold">{{ p.title }}</strong>
          <p class="text-sm text-muted">{{ p.text }}</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Categories -->
  <section class="bg-forest-light bg-paws py-14">
    <div class="container-wrap animate-fade-up">
      <div class="mb-8 text-center">
        <h2 class="section-title">Что ищем сегодня?</h2>
        <p class="section-subtitle">Выберите категорию — мы подберём лучшее</p>
      </div>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <RouterLink
          v-for="(cat, i) in CATEGORIES"
          :key="cat.id"
          :to="`/catalog?category=${cat.id}`"
          class="group overflow-hidden rounded-blob bg-white shadow-soft transition-all duration-300 hover:-translate-y-2 hover:shadow-paw animate-scale-in"
          :class="`delay-${(i + 1) * 100}`"
        >
          <img :src="SITE_IMAGES.categories[cat.id]" :alt="cat.label" class="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-105" />
          <div class="p-4 text-center">
            <p class="mt-1 font-display font-bold text-ink">{{ cat.label }}</p>
          </div>
        </RouterLink>
      </div>
    </div>
  </section>

  <!-- Popular products -->
  <section class="container-wrap py-14">
    <div class="mb-8 flex items-end justify-between animate-fade-up">
      <div>
        <h2 class="section-title">Хиты для хвостиков</h2>
        <p class="section-subtitle">Самое популярное у наших покупателей</p>
      </div>
      <RouterLink to="/catalog" class="hidden font-bold text-forest hover:text-forest-dark sm:block">Все товары →</RouterLink>
    </div>
    <div class="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
      <ProductCard
        v-for="(product, i) in products.featuredProducts"
        :key="product.id"
        :product="product"
        :badge="i === 0 ? 'hit' : i === 1 ? 'new' : ''"
        :style="{ animationDelay: `${(i + 1) * 100}ms` }"
        class="animate-fade-up"
      />
    </div>
  </section>

  <!-- Promo banners -->
  <section class="container-wrap pb-14">
    <div class="grid gap-5 md:grid-cols-2">
      <RouterLink to="/catalog?category=food" class="group relative overflow-hidden rounded-blob shadow-paw animate-fade-up">
        <img :src="SITE_IMAGES.promo.sale" alt="Акция на корма" class="aspect-[16/9] w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div class="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-ink/80 to-transparent p-8 text-white">
          <span class="tag-honey w-fit">Акция</span>
          <h3 class="mt-2 font-display text-3xl font-bold">−15% на корма</h3>
          <p class="mt-1 text-sm opacity-90">При заказе от 5 000 ₽</p>
        </div>
      </RouterLink>
      <RouterLink to="/profile" class="group relative overflow-hidden rounded-blob shadow-soft animate-fade-up delay-200">
        <img :src="SITE_IMAGES.promo.gift" alt="Подарок" class="aspect-[16/9] w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div class="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-forest-dark/90 to-transparent p-8 text-white">
          <span class="tag-forest w-fit !bg-white/20 !text-white">Новичкам</span>
          <h3 class="mt-2 font-display text-3xl font-bold">Игрушка в подарок</h3>
          <p class="mt-1 text-sm opacity-90">При первой регистрации</p>
        </div>
      </RouterLink>
    </div>
  </section>

  <!-- Reviews -->
  <section class="bg-ink py-14 text-white">
    <div class="container-wrap animate-fade-up">
      <h2 class="text-center font-display text-3xl font-bold">Отзывы хозяев</h2>
      <p class="mt-2 text-center text-white/60">15 000+ довольных питомцев и их людей</p>
      <div class="mt-10 grid gap-5 sm:grid-cols-3">
        <div v-for="(r, i) in reviews" :key="r.name" class="rounded-blob bg-white/10 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:bg-white/15 animate-fade-up" :class="`delay-${(i + 1) * 100}`">
          <div class="text-honey">{{ '★'.repeat(r.rating) }}</div>
          <p class="mt-3 text-sm leading-relaxed text-white/85">«{{ r.text }}»</p>
          <p class="mt-4 text-sm font-bold text-honey">{{ r.name }}</p>
        </div>
      </div>
    </div>
  </section>

  <!-- CTA -->
  <section class="container-wrap py-14">
    <div class="relative overflow-hidden rounded-blob bg-gradient-to-r from-forest to-forest-dark p-10 text-center text-white sm:p-14 animate-scale-in">
      <h2 class="relative font-display text-3xl font-bold sm:text-4xl">Порадуйте питомца сегодня!</h2>
      <p class="relative mt-3 text-forest-100 opacity-90">Более 500 товаров с доставкой по всей России</p>
      <RouterLink to="/catalog" class="relative btn-honey mt-8 inline-flex text-base">Открыть каталог</RouterLink>
    </div>
  </section>
</template>
