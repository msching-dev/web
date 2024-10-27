export type ProductKey =
  | keyof 'almondCookie'
  | 'originalMadeleine'
  | 'earlGaryTeaMadeleine'
  | 'chocolateMadeleine'
  | 'matchaMadeleine'
  | 'cranBerryMadeleine'

export type Tag = 'hot' | 'new' | 'top_1' | 'top_2' | 'top_3'

export interface ProductInfo {
  key: string
  name: string
  price: number
  tag: Tag
  alias: string
  categories: Category[]
  banner: ImageInfo
}

export interface ProductDetail {
  id: number
  images: string[]
  productImage: string
  descriptions: Descriptions
  specifications: Content[]
  maxCount: number
  portionSize: number
  includeSize: string
  unit: string
  everyNutrientContent: Content[]
  everyHundredNutrientContent: Content[]
}

export interface Descriptions {
  desc: string
  nonAdditive: string
  howToEat: string
  preservationMethod: string
  precautions: string
  tastePeriod: string
}

export interface Content {
  key: string
  value: number
}

export interface ImageInfo {
  src: string
  altText: string
  title: string
}
