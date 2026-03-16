export type ProductKey =
  | 'almondCookie'
  | 'earlGreyTeaMadeleine'
  | 'chocolateMadeleine'
  | 'matchaMadeleine'
  | 'cranBerryMadeleine'
  | 'honeyLemonMadeleine'
  | 'thaiTeaMadeleine'
  | 'poloCookie'
  | 'thaiAndChocolateMadeleine'
  | 'earlGreyTeaAndHoneyLemonMadeleine'
  | 'quartetMadeleine'
  | 'pineappleCake_6'
  | 'pineappleCake_12'

export type Tag = 'hot' | 'new' | 'top_1' | 'top_2' | 'top_3' | 'christmas'

export enum Category {
  Hot = 'hot',
  Cookie = 'cookie',
  Madeleine = 'madeleine',
  Festival = 'festival',
}

export interface ProductInfo {
  key: string
  name: string
  price: number
  originalPrice?: number
  tag: Tag
  alias: string
  categories: Category[]
  banner: ImageInfo
  hidden?: boolean
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
  giftBoxNutrientContent?: GiftBoxContent[]
}

export interface Descriptions {
  desc: string
  nonAdditive: string
  howToEat: string
  preservationMethod: string
  precautions: string
  tastePeriod: string
}

export interface GiftBoxContent {
  taste: string
  content: Content[]
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

export interface MenuItem {
  name: string
  path?: string
  icon?: string
  hidden?: boolean
  children?: MenuItem[]
}

export interface ActivityItem {
  id: number
  type: 'newItem' | 'discount' | 'festival'
  title: string
  description: string
  image: string
  startTime: number
  endTime: number
}
