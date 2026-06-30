<script setup>
import { Heart, Users, Award, Stethoscope } from 'lucide-vue-next'
import { SITE_IMAGES } from '@/utils/images'

const stats = [
  { value: '8+', label: 'лет с питомцами' },
  { value: '15 000+', label: 'счастливых хвостов' },
  { value: '500+', label: 'товаров' },
  { value: '50+', label: 'брендов' },
]

const values = [
  { icon: Heart, title: 'Любовь к животным', text: 'Мы сами владельцы питомцев — Милти (собака) и Барсик (кот) — наши главные консультанты.' },
  { icon: Award, title: 'Только лучшее', text: 'Каждый товар проходит проверку — мы не продаём то, что не дали бы своим.' },
  { icon: Users, title: 'Команда экспертов', text: 'Ветеринары и кинологи помогут подобрать корм, лекарства и аксессуары.' },
  { icon: Stethoscope, title: 'Забота о здоровье', text: 'Консультации, витамины, препараты — здоровье питомца на первом месте.' },
]

const team = [
  { name: 'Алексей', role: 'Основатель, владелец Милти', img: SITE_IMAGES.pets.dogs },
  { name: 'Ольга', role: 'Главный ветеринар', img: SITE_IMAGES.about.team },
  { name: 'Игорь', role: 'Закупки и бренды', img: SITE_IMAGES.categories.food },
  { name: 'Наталья', role: 'Забота о клиентах', img: SITE_IMAGES.pets.cats },
]
</script>

<template>
  <section class="page-hero">
    <div class="container-wrap animate-fade-up">
      <span class="tag-forest mb-4">Наша история</span>
      <h1 class="page-hero-title">Магазин, созданный <span class="text-forest">для питомцев</span></h1>
      <p class="page-hero-text">С 2017 года помогаем хозяевам дарить своим любимцам всё самое лучшее</p>
    </div>
  </section>

  <section class="container-wrap -mt-8 pb-10">
    <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <div v-for="(s, i) in stats" :key="s.label" class="panel text-center !p-5 animate-fade-up" :class="`delay-${(i + 1) * 100}`">
        <p class="mt-1 font-display text-3xl font-bold text-forest">{{ s.value }}</p>
        <p class="text-xs font-bold text-muted">{{ s.label }}</p>
      </div>
    </div>
  </section>

  <section class="container-wrap grid items-center gap-10 pb-16 lg:grid-cols-2">
    <img :src="SITE_IMAGES.about.store" alt="Зоомагазин" class="rounded-blob object-cover shadow-paw animate-slide-right" />
    <div class="animate-slide-left">
      <h2 class="section-title">Как появился ЗООРУМ</h2>
      <div class="mt-5 space-y-4 text-muted leading-relaxed">
        <p>Всё началось с золотистого ретривера Милти. Не найдя качественный корм и игрушки в одном месте, мы решили создать магазин, где каждый хозяин найдёт всё для своего питомца.</p>
        <p>Сегодня ЗООРУМ — это 500+ товаров, команда ветеринаров, быстрая доставка и тысячи довольных собак, кошек и их людей.</p>
      </div>
    </div>
  </section>

  <section class="bg-forest-light bg-paws py-14">
    <div class="container-wrap animate-fade-up">
      <h2 class="section-title text-center">Наши ценности</h2>
      <div class="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div v-for="(v, i) in values" :key="v.title" class="panel transition-all duration-300 hover:-translate-y-2 hover:shadow-paw animate-fade-up" :class="`delay-${(i + 1) * 100}`">
          <component :is="v.icon" class="h-6 w-6 text-forest" />
          <h3 class="mt-2 font-display font-bold">{{ v.title }}</h3>
          <p class="mt-2 text-sm text-muted">{{ v.text }}</p>
        </div>
      </div>
    </div>
  </section>

  <section class="container-wrap py-14">
    <h2 class="section-title text-center animate-fade-up">Команда ЗООРУМ</h2>
    <p class="section-subtitle text-center">Люди (и их питомцы), которые делают магазин особенным</p>
    <div class="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-4">
      <div v-for="(m, i) in team" :key="m.name" class="pet-card overflow-hidden text-center animate-scale-in" :class="`delay-${(i + 1) * 100}`">
        <img :src="m.img" :alt="m.name" class="aspect-square w-full object-cover" />
        <div class="p-4">
          <h3 class="mt-1 font-display font-bold">{{ m.name }}</h3>
          <p class="text-xs text-muted">{{ m.role }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
