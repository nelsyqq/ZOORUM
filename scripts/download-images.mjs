/**
 * Скачивает фото в public/images — запуск: node scripts/download-images.mjs
 * После скачивания сайт работает без Unsplash (важно для РФ).
 */
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..')
const publicDir = join(root, 'public', 'images')

const u = (id, w = 800) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`

const files = {
  'hero/main.jpg': u('1587300003388-59208cc962cb', 1000),
  'hero/dog.jpg': u('1548199973-03cce0bbc87b', 600),
  'hero/cat.jpg': u('1514888286974-6c03e2ca1dba', 600),
  'hero/puppy.jpg': u('1450778872478-8dcc860a5f0e', 600),
  'categories/food.jpg': u('1601758228041-f3b2795255f1', 800),
  'categories/toys.jpg': u('1605568427561-246c7ff4482b', 800),
  'categories/beds.jpg': u('1548199973-03cce0bbc87b', 800),
  'categories/accessories.jpg': u('1544564211-6f9e799c8e72', 800),
  'categories/vet.jpg': u('1628009365695-9a5d3fb1473a', 800),
  'about/store.jpg': u('1601758228041-f3b2795255f1', 900),
  'about/team.jpg': u('1583511655857-d19b40a0a548', 800),
  'pets/dogs.jpg': u('1530281700549-e82e69cbf25e', 600),
  'pets/cats.jpg': u('1574158622682-6b6a3ec37f71', 600),
  'pets/birds.jpg': u('1552728084-57c0a00512d9', 600),
  'pets/fish.jpg': u('1522063465923-9a3e9d460424', 600),
  'promo/sale.jpg': u('1588943211346-09048a1dc872', 900),
  'promo/gift.jpg': u('1596495578065-6b8c9c46244e', 900),
  'products/01-food.jpg': u('1601758228041-f3b2795255f1'),
  'products/02-food.jpg': u('1574158622682-6b6a3ec37f71'),
  'products/03-food.jpg': u('1587300003388-59208cc962cb'),
  'products/04-toys.jpg': u('1605568427561-246c7ff4482b'),
  'products/05-toys.jpg': u('1535294435445-d7249524ef2e'),
  'products/06-toys.jpg': u('1583337130417-3346a1be6dee'),
  'products/07-beds.jpg': u('1548199973-03cce0bbc87b'),
  'products/08-beds.jpg': u('1495360012261-59a16ddaf0be'),
  'products/09-beds.jpg': u('1551717743-49959800d1c6'),
  'products/10-accessories.jpg': u('1544564211-6f9e799c8e72'),
  'products/11-accessories.jpg': u('1516734214146-2a279f2f0d1e'),
  'products/12-accessories.jpg': u('1530281700549-e82e69cbf25e'),
  'products/13-vet.jpg': u('1628009365695-9a5d3fb1473a'),
  'products/14-vet.jpg': u('1583511655857-d19b40a0a548'),
  'products/15-vet.jpg': u('1516734214146-2a279f2f0d1e'),
  'placeholder.jpg': u('1587300003388-59208cc962cb', 400),
}

async function download(path, url) {
  const full = join(publicDir, path)
  await mkdir(dirname(full), { recursive: true })
  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(res.statusText)
    const buf = Buffer.from(await res.arrayBuffer())
    await writeFile(full, buf)
    console.log('OK', path)
  } catch (e) {
    console.warn('FAIL', path, e.message)
  }
}

console.log('Downloading images to public/images...')
for (const [path, url] of Object.entries(files)) {
  await download(path, url)
}
console.log('Done.')
