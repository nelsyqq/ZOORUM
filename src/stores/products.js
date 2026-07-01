import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { getProductImage, PRODUCT_IMAGES } from '@/utils/images'
import { loadJSON, saveJSON } from '@/utils/storage'

function buildInitialProducts() {
  const imgs = (id) => [PRODUCT_IMAGES[id]]
  return [
    { id: 1, name: 'Royal Canin Medium Adult', category: 'food', price: 3490, description: 'Сбалансированный корм для собак средних пород от 12 месяцев', stock: 45, image: PRODUCT_IMAGES[1], images: imgs(1) },
    { id: 2, name: 'Pro Plan Sterilised', category: 'food', price: 2890, description: 'Корм для стерилизованных кошек с контролем веса', stock: 32, image: PRODUCT_IMAGES[2], images: imgs(2) },
    { id: 3, name: 'Hill\'s Science Diet', category: 'food', price: 4200, description: 'Премиальный корм для здоровья пищеварительной системы', stock: 18, image: PRODUCT_IMAGES[3], images: imgs(3) },
    { id: 4, name: 'Мячик с пищалкой', category: 'toys', price: 390, description: 'Прочный резиновый мяч для активных игр', stock: 120, image: PRODUCT_IMAGES[4], images: imgs(4) },
    { id: 5, name: 'Интерактивная головоломка', category: 'toys', price: 1290, description: 'Развивает интеллект и снимает скуку', stock: 28, image: PRODUCT_IMAGES[5], images: imgs(5) },
    { id: 6, name: 'Плюшевая кость XL', category: 'toys', price: 890, description: 'Мягкая игрушка с шуршащим наполнителем', stock: 55, image: PRODUCT_IMAGES[6], images: imgs(6) },
    { id: 7, name: 'Лежанка «Облако» L', category: 'beds', price: 4590, description: 'Ортопедическая лежанка с съёмным чехлом', stock: 15, image: PRODUCT_IMAGES[7], images: imgs(7) },
    { id: 8, name: 'Домик-конура M', category: 'beds', price: 3290, description: 'Уютный домик для кошек и мелких собак', stock: 22, image: PRODUCT_IMAGES[8], images: imgs(8) },
    { id: 9, name: 'Коврик согревающий', category: 'beds', price: 1890, description: 'Самонагревающийся коврик для холодных дней', stock: 40, image: PRODUCT_IMAGES[9], images: imgs(9) },
    { id: 10, name: 'Поводок-рулетка 5м', category: 'accessories', price: 2190, description: 'Надёжная рулетка с эргономичной ручкой', stock: 38, image: PRODUCT_IMAGES[10], images: imgs(10) },
    { id: 11, name: 'Автопоилка 2л', category: 'accessories', price: 2790, description: 'Фильтрующая поилка с циркуляцией воды', stock: 25, image: PRODUCT_IMAGES[11], images: imgs(11) },
    { id: 12, name: 'Ошейник светоотражающий', category: 'accessories', price: 590, description: 'Безопасность на вечерних прогулках', stock: 80, image: PRODUCT_IMAGES[12], images: imgs(12) },
    { id: 13, name: 'Витамины Multi-Vit', category: 'vet', price: 1490, description: 'Комплекс витаминов для кошек и собак', stock: 60, image: PRODUCT_IMAGES[13], images: imgs(13) },
    { id: 14, name: 'Капли от блох Advocate', category: 'vet', price: 1890, description: 'Защита от паразитов на 4 недели', stock: 42, image: PRODUCT_IMAGES[14], images: imgs(14) },
    { id: 15, name: 'Шампунь гипоаллергенный', category: 'vet', price: 790, description: 'Мягкий уход для чувствительной кожи', stock: 35, image: PRODUCT_IMAGES[15], images: imgs(15) },
  ]
}

const saved = loadJSON('products', null)

function migrateProducts(list) {
  return list.map((p) => {
    if (!p.images) {
      p.images = [p.image || PRODUCT_IMAGES[p.id] || getProductImage(p.category, p.id)]
    }
    return {
      ...p,
      image: p.images[0],
      oldPrice: p.oldPrice ?? null,
    }
  })
}

export const useProductsStore = defineStore('products', () => {
  const products = ref(migrateProducts(saved?.products ?? buildInitialProducts()))
  let nextId = saved?.nextId ?? 16

  watch(products, () => {
    saveJSON('products', { products: products.value, nextId })
  }, { deep: true })

  const getById = (id) => products.value.find((p) => p.id === id)

  const getByCategory = (category) => {
    if (!category || category === 'all') return products.value
    return products.value.filter((p) => p.category === category)
  }

  const addProduct = (product) => {
    const images = product.images?.length ? product.images : [product.image || getProductImage(product.category, nextId)]
    const newProduct = {
      ...product,
      id: nextId++,
      image: images[0],
      images,
    }
    products.value.push(newProduct)
    return newProduct
  }

  const updateProduct = (id, data) => {
    const index = products.value.findIndex((p) => p.id === id)
    if (index !== -1) {
      if (data.images?.length) data.image = data.images[0]
      else if (data.image && !data.images) data.images = [data.image]
      products.value[index] = { ...products.value[index], ...data }
      return products.value[index]
    }
    return null
  }

  const deleteProduct = (id) => {
    const index = products.value.findIndex((p) => p.id === id)
    if (index !== -1) {
      products.value.splice(index, 1)
      return true
    }
    return false
  }

  const featuredProducts = computed(() => products.value.slice(0, 4))

  return {
    products,
    getById,
    getByCategory,
    addProduct,
    updateProduct,
    deleteProduct,
    featuredProducts,
  }
})
