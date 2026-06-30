/**
 * Генерирует локальные SVG-изображения — работает офлайн и в РФ без внешних CDN.
 * Запуск: node scripts/generate-images.mjs
 */
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const publicDir = join(fileURLToPath(new URL('.', import.meta.url)), '..', 'public', 'images')

const themes = {
  forest: { bg: '#E8F5EF', accent: '#3D8B6E', text: '#2D6A54' },
  honey: { bg: '#FFF4D6', accent: '#E9A319', text: '#8A5A00' },
  sky: { bg: '#EBF4FC', accent: '#5B9BD5', text: '#2A5080' },
  coral: { bg: '#FDECEA', accent: '#E07A5F', text: '#8B3D2E' },
  cream: { bg: '#FFFAF3', accent: '#3D8B6E', text: '#2C2416' },
}

function svg(label, emoji, theme = 'forest', subtitle = 'ЗООРУМ') {
  const t = themes[theme]
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${t.bg}"/>
      <stop offset="100%" stop-color="#ffffff"/>
    </linearGradient>
  </defs>
  <rect width="800" height="800" fill="url(#g)"/>
  <circle cx="120" cy="120" r="60" fill="${t.accent}" opacity="0.12"/>
  <circle cx="680" cy="680" r="90" fill="${t.accent}" opacity="0.1"/>
  <text x="400" y="340" text-anchor="middle" font-size="120">${emoji}</text>
  <text x="400" y="430" text-anchor="middle" font-family="Arial,sans-serif" font-size="42" font-weight="700" fill="${t.text}">${label}</text>
  <text x="400" y="480" text-anchor="middle" font-family="Arial,sans-serif" font-size="24" fill="${t.accent}">${subtitle}</text>
  <text x="400" y="700" text-anchor="middle" font-family="Arial,sans-serif" font-size="18" fill="${t.accent}" opacity="0.7">zoorum.ru</text>
</svg>`
}

const files = {
  'hero/main.svg': svg('ЗООРУМ', '🐾', 'forest', 'Всё для питомцев'),
  'hero/dog.svg': svg('Собаки', '🐕', 'honey'),
  'hero/cat.svg': svg('Кошки', '🐈', 'sky'),
  'hero/puppy.svg': svg('Друзья', '🐕‍🦺', 'coral', 'Щенки и котята'),
  'categories/food.svg': svg('Корма', '🍖', 'honey'),
  'categories/toys.svg': svg('Игрушки', '🎾', 'sky'),
  'categories/beds.svg': svg('Лежанки', '🛏️', 'forest'),
  'categories/accessories.svg': svg('Аксессуары', '🦴', 'cream'),
  'categories/vet.svg': svg('Ветеринария', '💊', 'coral'),
  'about/store.svg': svg('Наш магазин', '🏪', 'forest'),
  'about/team.svg': svg('Команда', '👥', 'sky'),
  'pets/dogs.svg': svg('Собаки', '🐕', 'honey'),
  'pets/cats.svg': svg('Кошки', '🐈', 'sky'),
  'pets/birds.svg': svg('Птицы', '🐦', 'forest'),
  'pets/fish.svg': svg('Рыбки', '🐠', 'coral'),
  'promo/sale.svg': svg('Скидки', '🏷️', 'honey', '−15% на корма'),
  'promo/gift.svg': svg('Подарок', '🎁', 'forest', 'Новым клиентам'),
  'placeholder.svg': svg('ЗООРУМ', '🐾', 'cream'),
}

for (let i = 1; i <= 15; i++) {
  const cats = ['food', 'food', 'food', 'toys', 'toys', 'toys', 'beds', 'beds', 'beds', 'accessories', 'accessories', 'accessories', 'vet', 'vet', 'vet']
  const emojis = ['🍖', '🐈', '🐕', '🎾', '🧩', '🦴', '🛏️', '🏠', '☀️', '🦮', '💧', '📿', '💊', '🩺', '🧴']
  const labels = ['Корм', 'Корм', 'Корм', 'Игрушка', 'Игрушка', 'Игрушка', 'Лежанка', 'Домик', 'Коврик', 'Поводок', 'Поилка', 'Ошейник', 'Витамины', 'Капли', 'Шампунь']
  const cat = cats[i - 1]
  const theme = { food: 'honey', toys: 'sky', beds: 'forest', accessories: 'cream', vet: 'coral' }[cat]
  const num = String(i).padStart(2, '0')
  files[`products/${num}-${cat}.svg`] = svg(labels[i - 1], emojis[i - 1], theme)
}

async function write(path, content) {
  const full = join(publicDir, path)
  await mkdir(dirname(full), { recursive: true })
  await writeFile(full, content, 'utf8')
  console.log('OK', path)
}

console.log('Generating local images...')
for (const [path, content] of Object.entries(files)) {
  await write(path, content)
}
console.log('Done.')
