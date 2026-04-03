import { Suspense } from 'react'
import HeroSection from '@/components/hero-section'
import FeaturedProducts from '@/components/featured-products'
import HomeContent from '@/components/home-content'
import BrandStorySection from '@/components/brand-story-section'
import OrderProcessSection from '@/components/order-process-section'
import TestimonialsSection from '@/components/testimonials-section'
import ProductListSkeleton from '@/components/products/product-list-skeleton'
import { getProducts } from '@/lib/supabase/queries'

export default async function HomePage() {
  const products = await getProducts()

  return (
    <div className="animate-page-enter">
      <HeroSection />
      <FeaturedProducts products={products} />
      <section id="products">
        <Suspense
          fallback={
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
              <ProductListSkeleton />
            </div>
          }
        >
          <HomeContent products={products} />
        </Suspense>
      </section>
      <BrandStorySection />
      <OrderProcessSection />
      <TestimonialsSection />
    </div>
  )
}
