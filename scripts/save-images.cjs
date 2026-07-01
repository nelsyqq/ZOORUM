const https = require('https')
const fs = require('fs')
const path = require('path')

const API = 'https://zoorum.pages.dev/api/data'
const OUT = path.resolve(__dirname, '..', 'public', 'images', 'products')

let body = ''
https.get(API, { rejectUnauthorized: false }, (res) => {
  res.on('data', (c) => { body += c })
  res.on('end', () => {
    try {
      const data = JSON.parse(body)
      const products = data.products || []
      let saved = 0
      products.forEach((p) => {
        const images = []
        if (p.image && p.image.startsWith('data:')) images.push(p.image)
        if (p.images) images.push(...p.images.filter(i => i.startsWith('data:')))
        images.forEach((b64, idx) => {
          const ext = b64.match(/^data:image\/(\w+)/)?.[1] || 'jpeg'
          const fname = `admin-${p.id}-${idx}.${ext === 'jpeg' ? 'jpg' : ext}`
          const fpath = path.join(OUT, fname)
          const raw = Buffer.from(b64.split(',')[1], 'base64')
          fs.writeFileSync(fpath, raw)
          console.log(`  -> ${fname} (${(raw.length / 1024).toFixed(0)} KB)`)
          saved++
        })
      })
      console.log(`\nSaved ${saved} images to public/images/products/`)
      if (!saved) console.log('No base64 images found in products data.')
    } catch (e) {
      console.error('Parse error:', e.message)
      console.error('Body preview:', body.slice(0, 500))
    }
  })
}).on('error', (e) => {
  console.error('Fetch error:', e.message)
  console.log('\nCould not reach the API. Please export data from admin panel:\n  1. Go to /admin → Export tab\n  2. Click "Скачать JSON"\n  3. Save the file as export.json in the project root\n  4. Run: node scripts/save-images.cjs export.json')
  if (process.argv[2]) {
    // Try reading from file instead
    try {
      const fileData = JSON.parse(fs.readFileSync(process.argv[2], 'utf-8'))
      const products = fileData.products || []
      let saved = 0
      products.forEach((p) => {
        const images = []
        if (p.image && p.image.startsWith('data:')) images.push(p.image)
        if (p.images) images.push(...p.images.filter(i => i.startsWith('data:')))
        images.forEach((b64, idx) => {
          const ext = b64.match(/^data:image\/(\w+)/)?.[1] || 'jpeg'
          const fname = `admin-${p.id}-${idx}.${ext === 'jpeg' ? 'jpg' : ext}`
          const fpath = path.join(OUT, fname)
          const raw = Buffer.from(b64.split(',')[1], 'base64')
          fs.writeFileSync(fpath, raw)
          console.log(`  -> ${fname} (${(raw.length / 1024).toFixed(0)} KB)`)
          saved++
        })
      })
      console.log(`\nSaved ${saved} images from ${process.argv[2]}`)
      if (!saved) console.log('No base64 images found.')
    } catch (e2) {
      console.error('File error:', e2.message)
    }
  }
})
