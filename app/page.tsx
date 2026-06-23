import { getFeaturedProducts, getProducts, getCategories } from '@/lib/cosmic'
import ProductCard from '@/components/ProductCard'
import CategoryCard from '@/components/CategoryCard'
import Hero from '@/components/Hero'
import Link from 'next/link'

export default async function HomePage() {
  const [featured, products, categories] = await Promise.all([
    getFeaturedProducts(),
    getProducts(),
    getCategories(),
  ])

  const featuredList = featured.length > 0 ? featured : products.slice(0, 4)

  return (
    <div>
      <Hero />

      {/* Categories */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Shop by Category</h2>
            <Link href="/categories" className="text-brand-600 font-medium hover:text-brand-700">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featuredList.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
            <Link href="/products" className="text-brand-600 font-medium hover:text-brand-700">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredList.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {products.length === 0 && categories.length === 0 && (
        <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-500">
          No content found yet. Add some products and categories in Cosmic.
        </div>
      )}
    </div>
  )
}