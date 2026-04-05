import type { Metadata } from 'next'
import PageHero from '@/components/layout/page-hero'
import CartPageContent from '@/components/cart/cart-page-content'

export const metadata: Metadata = {
  title: '購物車',
}

export default function CartPage() {
  return (
    <div className="animate-page-enter">
      <PageHero
        title="購物車"
      />
      <CartPageContent />
    </div>
  )
}
