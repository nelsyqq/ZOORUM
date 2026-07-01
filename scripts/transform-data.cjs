const fs = require('fs')

const src = process.argv[2] || 'export.json'
const raw = fs.readFileSync(src, 'utf-8')
const data = JSON.parse(raw)
const products = data.products || []

let changed = 0
let fixed = 0
products.forEach((p) => {
  let idx = 0
  const toPath = (b64) => {
    const ext = b64.match(/^data:image\/(\w+)/)?.[1] || 'jpeg'
    const fname = `admin-${p.id}-${idx}.${ext === 'jpeg' ? 'jpg' : ext}`
    idx++
    return `/images/products/${fname}`
  }

  if (p.image) {
    if (p.image.startsWith('data:')) {
      p.image = toPath(p.image)
      changed++
    } else if (!p.image.startsWith('/') && !p.image.startsWith('http')) {
      p.image = '/' + p.image
      fixed++
    }
  }
  if (p.images) {
    p.images = p.images.map((img) => {
      if (img.startsWith('data:')) {
        changed++
        return toPath(img)
      }
      if (!img.startsWith('/') && !img.startsWith('http')) {
        fixed++
        return '/' + img
      }
      return img
    })
  }
})

const out = `import-ready.json`
fs.writeFileSync(out, JSON.stringify(data, null, 2))
console.log(`Replaced ${changed} base64 images with file paths`)
console.log(`Fixed ${fixed} paths missing leading slash`)
console.log(`Output: ${out}`)
console.log(`\nNext steps:`)
console.log(`  1. Go to /admin → Import tab → загрузить ${out}`)
console.log(`  2. git add public/images/products/ export.json import-ready.json scripts/`)
console.log(`  3. git commit -m "add uploaded product images as files"`)
console.log(`  4. git push origin main`)
