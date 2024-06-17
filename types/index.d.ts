interface ProductsJson {
  almondCookie: ProductDetail
  originalMadeleine: ProductDetail
  earlGaryTeaMadeleine: ProductDetail
  chocolateMadeleine: ProductDetail
  matchaMadeleine: ProductDetail
  cranBerryMadeleine: ProductDetail
}

interface Product extends ProductDetail {
  key: string
}

interface ProductDetail {
  id: number
  categories: Category[]
  name: string
  banner: ImageInfo
  images: string[]
  price: number
  descriptions: Descriptions
  specifications: Content[]
  maxCount: number
  tag: Tag
  alias: string
  productImage: string
  portionSize: number
  includeSize: number
  everyNutrientContent: Content[]
  everyHundredNutrientContent: Content[]
}

type Tag = 'hot' | 'new' | 'top_1' | 'top_2' | 'top_3'

interface Descriptions {
  desc: string
  nonAdditive: string
  howToEat: string
  preservationMethod: string
  precautions: string
  tastePeriod: string
}

interface Content {
  key: string
  value: number
}

interface ImageInfo {
  src: string
  altText: string
  title: string
}
