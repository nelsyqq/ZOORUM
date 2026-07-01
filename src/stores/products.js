import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { getProductImage, PRODUCT_IMAGES } from '@/utils/images'
import { loadJSON, saveJSON } from '@/utils/storage'
import { syncToCloud } from '@/utils/api'

function buildInitialProducts() {
  return [
    { id: 1, name: "Royal Canin Medium Adult", category: "food", price: 3190, description: "Сбалансированный корм для собак средних пород от 12 месяцев", stock: 7, oldPrice: 3490, image: "/images/products/admin-1-0.jpg", images: ["/images/products/admin-1-1.jpg","/images/products/admin-1-2.jpg"], weights: [{"label":"3кг","price":3190,"oldPrice":3490,"stock":2},{"label":"15кг","price":11299,"oldPrice":12000,"stock":5}] },
    { id: 2, name: "Pro Plan Sterilised Rabbit", category: "food", price: 639, description: "Корм для стерилизованных кошек с контролем веса с кроликом", stock: 15, oldPrice: null, image: "/images/products/admin-2-0.jpg", images: ["/images/products/admin-2-1.jpg","/images/products/admin-2-2.jpg","/images/products/admin-2-3.jpg"], weights: [{"label":"0,4кг","price":639,"oldPrice":null,"stock":4},{"label":"1,5кг","price":2199,"oldPrice":null,"stock":2},{"label":"3кг","price":3899,"oldPrice":null,"stock":6},{"label":"10кг","price":10099,"oldPrice":null,"stock":3}] },
    { id: 3, name: "Grandorf", category: "food", price: 1099, description: "Grandorf сухой корм для стерилизованных кошек, четыре вида мяса", stock: 12, oldPrice: null, image: "/images/products/admin-3-0.jpg", images: ["/images/products/admin-3-1.jpg"], weights: [{"label":"0,4кг","price":1099,"oldPrice":null,"stock":6},{"label":"2кг","price":3499,"oldPrice":null,"stock":2},{"label":"8кг","price":3699,"oldPrice":null,"stock":4}] },
    { id: 4, name: "Рифлёный мячик с пищалкой Barbaks", category: "toys", price: 215, description: "Игрушка для собак Barbaks «Рифлёный мяч» с пищалкой для совместных игр и развития реакции.", stock: 50, oldPrice: null, image: "/images/products/admin-4-0.png", images: ["/images/products/admin-4-1.png","/images/products/admin-4-2.png","/images/products/admin-4-3.png","/images/products/admin-4-4.png"], weights: [] },
    { id: 5, name: "Игрушка для собак Triol Smart Toys Лапка", category: "toys", price: 579, description: "Развивающая игрушка «Лапка» для собак Triol Smart Toys – интерактивная игра легкого уровня сложности, которая интеллектуально развивает питомца. Игрушка развивает мышление собаки, тренирует память и помогает в дрессировке. В головоломке 7 отделений для лакомств.", stock: 28, oldPrice: 679, image: "/images/products/admin-5-0.png", images: ["/images/products/admin-5-1.png","/images/products/admin-5-2.png"], weights: [] },
    { id: 6, name: "Плюшевая кость", category: "toys", price: 890, description: "Мягкая игрушка с шуршащим наполнителем", stock: 55, oldPrice: null, image: "/images/products/admin-6-0.png", images: ["/images/products/admin-6-1.png"], weights: [] },
    { id: 7, name: "Лежанка «Облако» ", category: "beds", price: 999, description: "Удобная лежанка с съёмным чехлом", stock: 15, oldPrice: null, image: "/images/products/admin-7-0.png", images: ["/images/products/admin-7-1.png"], weights: [] },
    { id: 8, name: "Домик-конура M", category: "beds", price: 4199, description: "Домик-тумба для животных Большой 65х60х55см Дикий дуб Натуральный", stock: 22, oldPrice: null, image: "/images/products/admin-8-0.png", images: ["/images/products/admin-8-1.png","/images/products/admin-8-2.png"], weights: [] },
    { id: 9, name: "Коврик согревающий", category: "beds", price: 1890, description: "Самонагревающийся коврик для холодных дней", stock: 40, oldPrice: null, image: "/images/products/09-beds.jpg", images: ["/images/products/09-beds.jpg"], weights: [] },
    { id: 10, name: "Поводок-рулетка 5м", category: "accessories", price: 399, description: "Надёжная рулетка с эргономичной ручкой", stock: 38, oldPrice: null, image: "/images/products/admin-10-0.png", images: ["/images/products/admin-10-1.png"], weights: [] },
    { id: 11, name: "Автопоилка Dogness 2л для животных", category: "accessories", price: 3499, description: "Автоматический фонтан для кошек и собак среднего и крупного размера. Конструкция фонтана в форме чаши позволяет использовать его даже собакам с большими мордами. Благодаря емкости фонтана в 2 литра, воды хватит на нескольких животных, а вам менять воду один раз в несколько дней. Экономьте время, не экономя на здоровье питомца!", stock: 25, oldPrice: null, image: "/images/products/admin-11-0.jpg", images: ["/images/products/admin-11-1.jpg"], weights: [] },
    { id: 12, name: "Ошейник светоотражающий", category: "accessories", price: 390, description: "Безопасность на вечерних прогулках", stock: 80, oldPrice: null, image: "/images/products/admin-12-0.jpg", images: ["/images/products/admin-12-1.jpg"], weights: [] },
    { id: 13, name: "Витамины Multi-Vit", category: "vet", price: 1490, description: "Комплекс витаминов для кошек и собак", stock: 60, oldPrice: null, image: "/images/products/admin-13-0.png", images: ["/images/products/admin-13-1.png"], weights: [] },
    { id: 14, name: "Капли от блох Advocate", category: "vet", price: 1199, description: "Защита от паразитов на 4 недели", stock: 42, oldPrice: null, image: "/images/products/admin-14-0.png", images: ["/images/products/admin-14-1.png"], weights: [{"label":"1мл","price":1199,"oldPrice":"","stock":0}] },
    { id: 15, name: "Шампунь гипоаллергенный ZOORIK", category: "vet", price: 339, description: "Мягкий уход для чувствительной кожи 250мл", stock: 35, oldPrice: null, image: "/images/products/admin-15-0.jpg", images: ["/images/products/admin-15-1.jpg"], weights: [] },
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
      weights: p.weights ?? [],
    }
  })
}

export const useProductsStore = defineStore('products', () => {
  const products = ref(migrateProducts(saved?.products ?? buildInitialProducts()))
  let nextId = saved?.nextId ?? 16

  watch(products, () => {
    const data = { products: products.value, nextId }
    saveJSON('products', data)
    syncToCloud('products', data)
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

  function fromCloud(data) {
    if (!data) return
    products.value = data.products ?? []
    if (data.nextId) nextId = data.nextId
  }

  return {
    products,
    getById,
    getByCategory,
    addProduct,
    updateProduct,
    deleteProduct,
    featuredProducts,
    fromCloud,
  }
})
