import Link from 'next/link'
import type { Review } from '@/types'
import { getMetafieldValue } from '@/lib/cosmic'
import StarRating from '@/components/StarRating'

interface ReviewCardProps {
  review: Review
  showProduct?: boolean
}

export default function ReviewCard({ review, showProduct = false }: ReviewCardProps) {
  const reviewerName = getMetafieldValue(review.metadata?.reviewer_name) || 'Anonymous'
  const rating = review.metadata?.rating || 0
  const title = getMetafieldValue(review.metadata?.review_title)
  const text = getMetafieldValue(review.metadata?.review_text)
  const verified = review.metadata?.verified_purchase
  const product = review.metadata?.product

  return (
    <div className="rounded-2xl bg-white border border-gray-100 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <StarRating rating={rating} />
        {verified && (
          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-1">
            ✓ Verified
          </span>
        )}
      </div>

      {title && <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>}
      {text && <p className="text-gray-600 text-sm mb-4 whitespace-pre-line">{text}</p>}

      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-gray-700">{reviewerName}</span>
        {showProduct && product && (
          <Link
            href={`/products/${product.slug}`}
            className="text-brand-600 hover:text-brand-700 font-medium"
          >
            {getMetafieldValue(product.metadata?.name) || product.title}
          </Link>
        )}
      </div>
    </div>
  )
}