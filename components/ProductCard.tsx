import Link from 'next/link'
import type { Product } from '@/types'
import { getMetafieldValue } from '@/lib/cosmic'
import { formatPrice } from '@/lib/format'
import InventoryBadge from '@/components/InventoryBadge'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const name = getMetafieldValue(product.metadata?.name) || product.title
  const price = product.metadata?.price
  const salePrice = product.metadata?.sale_price
  const hasSale =
    typeof salePrice === 'number' && salePrice > 0 && typeof price === 'number' && salePrice < price
  const image = product.metadata?.main_image
  const featured = product.metadata?.featured

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block rounded-2xl bg-white border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        {image ? (
          <img
            src={`${image.imgix_url}?w=600&h=600&fit=crop&auto=format,compress`}
            alt={name}
            width={300}
            height={300}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">No image</div>
        )}
        {featured && (
          <span className="absolute top-3 left-3 rounded-full bg-brand-600 text-white text-xs font-semibold px-2.5 py-1">
            Featured
          </span>
        )}
        {hasSale && (
          <span className="absolute top-3 right-3 rounded-full bg-red-500 text-white text-xs font-semibold px-2.5 py-1">
            Sale
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 line-clamp-1 group-hover:text-brand-600 transition-colors">
          {name}
        </h3>
        <div className="mt-2 flex items-center gap-2">
          {hasSale ? (
            <>
              <span className="font-bold text-brand-600">{formatPrice(salePrice)}</span>
              <span className="text-sm text-gray-400 line-through">{formatPrice(price)}</span>
            </>
          ) : (
            <span className="font-bold text-gray-900">{formatPrice(price)}</span>
          )}
        </div>
        <div className="mt-3">
          <InventoryBadge status={product.metadata?.inventory_status} />
        </div>
      </div>
    </Link>
  )
}