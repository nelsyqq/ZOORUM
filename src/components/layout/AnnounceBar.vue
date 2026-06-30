<script setup>
const items = [
  { text: 'Бесплатная доставка от 3 000 ₽' },
  { text: 'Ветеринар онлайн — бесплатно' },
  { text: 'Подарок щенку или котёнку' },
]
</script>

<template>
  <div class="bg-honey text-ink">
    <div class="container-wrap flex flex-wrap items-center justify-center gap-x-8 gap-y-1 py-2 text-sm font-bold">
      <span v-for="item in items" :key="item.text" class="flex items-center gap-1.5">
        {{ item.text }}
      </span>
    </div>
  </div>
</template>
