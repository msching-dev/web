import HeroSection from '@/components/hero-section'
import HomeContent from '@/components/home-content'
import BrandStorySection from '@/components/brand-story-section'
import TestimonialsSection from '@/components/testimonials-section'
import SocialLinksBar from '@/components/social-links-bar'
import { getProducts } from '@/lib/supabase/queries'

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Bakery',
  name: '蜜絲晴烘焙手作坊',
  alternateName: 'MS. CHING',
  url: 'https://msching.com',
}

export default async function HomePage() {
  const products = await getProducts()

  return (
    <div className="animate-page-enter">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <HeroSection />
      <section id="products">
        <HomeContent products={products} />
      </section>
      <BrandStorySection />
      <TestimonialsSection />
      <SocialLinksBar />
    </div>
  )
}
