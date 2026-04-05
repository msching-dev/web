export interface CartItem {
  productId: string
  slug: string
  name: string
  price: number
  image: string
  quantity: number
  maxCount: number
  unit: string
  isActive: boolean
}

/** 給 addItem 用的輸入型別（不含 quantity，由呼叫方傳入） */
export interface CartItemInput {
  productId: string
  slug: string
  name: string
  price: number
  image: string
  maxCount: number
  unit: string
}

/** Guest cart 存入 localStorage 的格式（精簡版） */
export interface GuestCartItem {
  productId: string
  quantity: number
}
