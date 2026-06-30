<script setup>
const items = [
  { text: 'Бесплатная доставка от 3 000 ₽' },
  { text: 'Ветеринар онлайн — бесплатно' },
  { text: 'Подарок щенку или котёнку' },
]
</script>

<template>
  <div class="bg-honey text-ink">
    <div class="container-wrap overflow-x-auto">
      <div class="flex items-center justify-center gap-4 whitespace-nowrap py-1 text-[11px] font-bold sm:gap-8 sm:py-2 sm:text-sm">
        <span v-for="item in items" :key="item.text" class="flex items-center gap-1.5">
          {{ item.text }}
        </span>
      </div>
    </div>
  </div>
</template>
