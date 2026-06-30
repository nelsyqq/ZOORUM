<script setup>
const items = [
  { text: 'Бесплатная доставка от 3 000 ₽' },
  { text: 'Ветеринар онлайн — бесплатно' },
  { text: 'Подарок щенку или котёнку' },
]
</script>

<template>
  <div class="bg-honey text-ink">
    <div class="container-wrap relative overflow-hidden py-1 sm:py-2">
      <div class="flex animate-marquee items-center gap-8 text-[11px] font-bold sm:hidden">
        <span v-for="i in 2" :key="i" class="flex shrink-0 items-center gap-8">
          <span v-for="item in items" :key="item.text">{{ item.text }}</span>
        </span>
      </div>
      <div class="hidden items-center justify-center gap-8 text-sm font-bold sm:flex">
        <span v-for="item in items" :key="item.text" class="flex items-center gap-1.5">
          {{ item.text }}
        </span>
      </div>
    </div>
  </div>
</template>
