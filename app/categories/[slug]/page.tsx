// app/categories/[slug]/page.tsx
import { getCategoryBySlug, getProductsByCategory } from '@/lib/cosmic'
import { getMetafieldValue } from '@/lib/cosmic'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ProductCard from '@/components/ProductCard'

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)

  if (!category) {
    notFound()
  }

  const products = await getProductsByCategory(category.id)
  const name = getMetafieldValue(category.metadata?.name) || category.title
  const description = getMetafieldValue(category.metadata?.description)
  const image = category.metadata?.category_image

  return (
    <div>
      {/* Banner */}
      <div className="relative bg-gray-900">
        {image && (
          <img
            src={`${image.imgix_url}?w=2000&h=500&fit=crop&auto=format,compress`}
            alt={name}
            width={1000}
            height={250}
            className="w-full h-56 md:h-72 object-cover opacity-60"
          />
        )}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white">{name}</h1>
          {description && (
            <p className="mt-3 max-w-2xl text-gray-200">{description}</p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-brand-600">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/categories" className="hover:text-brand-600">Categories</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{name}</span>
        </nav>

        {products.length === 0 ? (
          <p className="text-gray-500">No products in this category yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}