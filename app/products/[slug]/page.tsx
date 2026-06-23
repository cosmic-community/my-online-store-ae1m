// app/products/[slug]/page.tsx
import { getProductBySlug, getVariantsByProduct, getReviewsByProduct } from '@/lib/cosmic'
import { getMetafieldValue } from '@/lib/cosmic'
import { formatPrice } from '@/lib/format'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import InventoryBadge from '@/components/InventoryBadge'
import VariantList from '@/components/VariantList'
import ReviewCard from '@/components/ReviewCard'
import StarRating from '@/components/StarRating'
import ReviewForm from '@/components/ReviewForm'

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  const [variants, reviews] = await Promise.all([
    getVariantsByProduct(product.id),
    getReviewsByProduct(product.id),
  ])

  const name = getMetafieldValue(product.metadata?.name) || product.title
  const description = getMetafieldValue(product.metadata?.description)
  const price = product.metadata?.price
  const salePrice = product.metadata?.sale_price
  const hasSale = typeof salePrice === 'number' && salePrice > 0 && typeof price === 'number' && salePrice < price
  const sku = getMetafieldValue(product.metadata?.sku)
  const mainImage = product.metadata?.main_image
  const gallery = product.metadata?.gallery || []
  const category = product.metadata?.category

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + (r.metadata?.rating || 0), 0) / reviews.length
      : 0

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-brand-600">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/products" className="hover:text-brand-600">Products</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Images */}
        <div>
          {mainImage ? (
            <img
              src={`${mainImage.imgix_url}?w=1200&h=900&fit=crop&auto=format,compress`}
              alt={name}
              width={600}
              height={450}
              className="w-full rounded-2xl object-cover bg-white shadow-sm"
            />
          ) : (
            <div className="w-full aspect-[4/3] rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400">
              No image
            </div>
          )}
          {gallery.length > 0 && (
            <div className="grid grid-cols-4 gap-3 mt-4">
              {gallery.slice(0, 8).map((img, i) => (
                <img
                  key={i}
                  src={`${img.imgix_url}?w=300&h=300&fit=crop&auto=format,compress`}
                  alt={`${name} ${i + 1}`}
                  width={150}
                  height={150}
                  className="w-full aspect-square rounded-lg object-cover bg-white"
                />
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          {category && (
            <Link
              href={`/categories/${category.slug}`}
              className="inline-block text-sm font-medium text-brand-600 hover:text-brand-700 mb-2"
            >
              {getMetafieldValue(category.metadata?.name) || category.title}
            </Link>
          )}
          <h1 className="text-3xl font-bold text-gray-900 mb-3">{name}</h1>

          {reviews.length > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <StarRating rating={Math.round(avgRating)} />
              <span className="text-sm text-gray-500">
                {avgRating.toFixed(1)} ({reviews.length} review{reviews.length === 1 ? '' : 's'})
              </span>
            </div>
          )}

          <div className="flex items-center gap-3 mb-4">
            {hasSale ? (
              <>
                <span className="text-3xl font-bold text-brand-600">{formatPrice(salePrice)}</span>
                <span className="text-xl text-gray-400 line-through">{formatPrice(price)}</span>
                <span className="rounded-full bg-red-100 text-red-700 text-xs font-semibold px-2.5 py-1">
                  Sale
                </span>
              </>
            ) : (
              <span className="text-3xl font-bold text-gray-900">{formatPrice(price)}</span>
            )}
          </div>

          <div className="mb-5">
            <InventoryBadge status={product.metadata?.inventory_status} />
          </div>

          {sku && <p className="text-sm text-gray-500 mb-5">SKU: {sku}</p>}

          {description && (
            <div className="prose prose-sm text-gray-700 mb-6 whitespace-pre-line">
              {description}
            </div>
          )}

          <VariantList variants={variants} />
        </div>
      </div>

      {/* Reviews */}
      <section className="mt-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Customer Reviews
            {reviews.length > 0 && (
              <span className="ml-3 text-base font-normal text-gray-500">
                ({reviews.length} review{reviews.length === 1 ? '' : 's'})
              </span>
            )}
          </h2>
        </div>

        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet — be the first to share your experience!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}

        {/* Review submission form */}
        <ReviewForm productSlug={slug} />
      </section>
    </div>
  )
}
