import type { Metadata } from 'next'
import CartPageContent from '@/components/cart/cart-page-content'

export const metadata: Metadata = {
  title: '購物車',
}

export default function CartPage() {
  return (
    <div className="animate-page-enter">
      <CartPageContent />
    </div>
  )
}
