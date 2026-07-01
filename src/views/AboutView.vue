<script setup>
import { Heart, Users, Award, Stethoscope, ArrowRight } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'

const values = [
  { icon: Heart, title: 'Любовь к животным', text: 'Мы сами владельцы питомцев — наши главные консультанты.', color: 'bg-red-50 text-coral' },
  { icon: Award, title: 'Только лучшее', text: 'Каждый товар проходит проверку — не продаём то, что не дали бы своим.', color: 'bg-honey-light text-honey-dark' },
  { icon: Users, title: 'Команда экспертов', text: 'Ветеринары и кинологи помогают подобрать корм, лекарства и аксессуары.', color: 'bg-sky-light text-sky' },
  { icon: Stethoscope, title: 'Забота о здоровье', text: 'Консультации, витамины, препараты — здоровье питомца на первом месте.', color: 'bg-forest-light text-forest' },
]

const team = [
  { name: 'Алёна', role: 'Основатель' },
  { name: 'Ольга', role: 'Главный ветеринар' },
  { name: 'Игорь', role: 'Закупки и бренды' },
  { name: 'Наталья', role: 'Забота о клиентах' },
]
</script>

<template>
  <!-- Hero -->
  <section class="bg-forest-light">
    <div class="container-wrap py-8 text-center animate-fade-up">
      <span class="inline-flex items-center gap-1.5 rounded-full bg-forest px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-soft">Наша история</span>
      <h1 class="mt-3 font-display text-2xl font-extrabold text-ink sm:text-3xl">
        Магазин, созданный для питомцев
      </h1>
      <p class="mt-1 max-w-md mx-auto text-sm text-muted">С 2017 года помогаем хозяевам дарить своим любимцам всё самое лучшее</p>
    </div>
  </section>

  <!-- Story -->
  <section class="container-wrap grid items-center gap-8 pb-4 pt-12 lg:grid-cols-[3fr_2fr]">
    <img src="https://avatars.mds.yandex.net/get-altay/13789674/2a0000019daff5e6c36ef81fccd01694292b/XXXL" alt="Зоомагазин" class="w-full rounded-blob object-cover shadow-paw animate-slide-right" />
    <div class="animate-slide-left">
      <span class="inline-flex items-center gap-1.5 rounded-full bg-forest-light px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-forest-dark">Как всё начиналось</span>
      <h2 class="mt-3 font-display text-2xl font-bold text-ink sm:text-3xl">Как появился ЗООРУМ</h2>
      <div class="mt-4 space-y-3 text-sm text-muted leading-relaxed sm:text-base">
        <p>Всё началось с золотистого ретривера Милти. Не найдя качественный корм и игрушки в одном месте, мы решили создать магазин, где каждый хозяин найдёт всё для своего питомца.</p>
        <p>Сегодня ЗООРУМ — это команда ветеринаров, быстрая доставка и тысячи довольных собак, кошек и их людей.</p>
      </div>
      <RouterLink to="/catalog" class="btn-forest mt-4 inline-flex text-sm">
        В каталог <ArrowRight class="h-4 w-4" />
      </RouterLink>
    </div>
  </section>

  <!-- Team -->
  <section class="container-wrap pt-0 pb-4">
    <div class="mb-4 text-center animate-fade-up">
      <span class="inline-flex items-center gap-1 rounded-full bg-forest-light px-3 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-forest-dark">Кто мы</span>
      <h2 class="mt-2 font-display text-xl font-bold text-ink sm:text-2xl">Команда ЗООРУМ</h2>
      <p class="mt-1 text-sm text-muted">Люди (и их питомцы), которые делают магазин особенным</p>
    </div>
    <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <div v-for="(m, i) in team" :key="m.name" class="rounded-blob bg-white p-5 text-center shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-paw animate-scale-in" :class="`delay-${(i + 1) * 100}`">
        <h3 class="font-display font-bold text-ink">{{ m.name }}</h3>
        <p class="mt-0.5 text-xs text-muted">{{ m.role }}</p>
      </div>
    </div>
  </section>

  <!-- Values -->
  <section class="bg-gradient-to-b from-forest-light/10 to-transparent py-6">
    <div class="container-wrap">
      <div class="mb-4 text-center animate-fade-up">
        <span class="inline-flex items-center gap-1 rounded-full bg-forest-light px-3 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-forest-dark">Наши принципы</span>
        <h2 class="mt-2 font-display text-xl font-bold text-ink sm:text-2xl">Наши ценности</h2>
        <p class="mt-1 text-sm text-muted">Четыре принципа, которым мы следуем каждый день</p>
      </div>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div v-for="(v, i) in values" :key="v.title" class="rounded-blob bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-paw animate-fade-up" :class="`delay-${(i + 1) * 100}`">
          <div class="flex h-11 w-11 items-center justify-center rounded-xl" :class="v.color">
            <component :is="v.icon" class="h-5 w-5" />
          </div>
          <h3 class="mt-3 font-display font-bold text-ink">{{ v.title }}</h3>
          <p class="mt-1.5 text-sm text-muted">{{ v.text }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
