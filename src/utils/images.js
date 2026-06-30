/** Локальные изображения (JPG) — без внешних CDN, работает в РФ офлайн */
const img = (path) => `/images/${path}`

export const SITE_IMAGES = {
  hero: {
    main: img('hero/main.jpg'),
    dog: img('hero/dog.jpg'),
    cat: img('hero/cat.jpg'),
    puppy: img('hero/puppy.jpg'),
  },
  categories: {
    food: img('categories/food.jpg'),
    toys: img('categories/toys.jpg'),
    beds: img('categories/beds.jpg'),
    accessories: img('categories/accessories.jpg'),
    vet: img('categories/vet.jpg'),
  },
  about: {
    store: img('about/store.jpg'),
    team: img('about/team.jpg'),
  },
  pets: {
    dogs: img('pets/dogs.jpg'),
    cats: img('pets/cats.jpg'),
    birds: img('pets/birds.jpg'),
    fish: img('pets/fish.jpg'),
  },
  promo: {
    sale: img('promo/sale.jpg'),
    gift: img('promo/gift.jpg'),
  },
}

export const PRODUCT_IMAGES = {
  1: img('products/01-food.jpg'),
  2: img('products/02-food.jpg'),
  3: img('products/03-food.jpg'),
  4: img('products/04-toys.jpg'),
  5: img('products/05-toys.jpg'),
  6: img('products/06-toys.jpg'),
  7: img('products/07-beds.jpg'),
  8: img('products/08-beds.jpg'),
  9: img('products/09-beds.jpg'),
  10: img('products/10-accessories.jpg'),
  11: img('products/11-accessories.jpg'),
  12: img('products/12-accessories.jpg'),
  13: img('products/13-vet.jpg'),
  14: img('products/14-vet.jpg'),
  15: img('products/15-vet.jpg'),
}

const CATEGORY_FALLBACK = {
  food: SITE_IMAGES.categories.food,
  toys: SITE_IMAGES.categories.toys,
  beds: SITE_IMAGES.categories.beds,
  accessories: SITE_IMAGES.categories.accessories,
  vet: SITE_IMAGES.categories.vet,
}

export const PLACEHOLDER = img('placeholder.jpg')

export function getProductImage(category, id) {
  return PRODUCT_IMAGES[id] || CATEGORY_FALLBACK[category] || PLACEHOLDER
}
