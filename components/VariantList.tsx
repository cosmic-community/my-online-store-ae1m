import type { Variant } from '@/types'
import { getMetafieldValue } from '@/lib/cosmic'
import { formatPrice } from '@/lib/format'

interface VariantListProps {
  variants: Variant[]
}

export default function VariantList({ variants }: VariantListProps) {
  if (!variants || variants.length === 0) {
    return null
  }

  // Group variants by variant_name
  const groups: Record<string, Variant[]> = {}
  variants.forEach((variant) => {
    const key = getMetafieldValue(variant.metadata?.variant_name) || 'Options'
    const existing = groups[key]
    if (existing) {
      existing.push(variant)
    } else {
      groups[key] = [variant]
    }
  })

  return (
    <div className="space-y-5 border-t border-gray-200 pt-5">
      {Object.keys(groups).map((groupName) => {
        const groupVariants = groups[groupName]
        if (!groupVariants || groupVariants.length === 0) {
          return null
        }

        return (
          <div key={groupName}>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">{groupName}</h4>
            <div className="flex flex-wrap gap-2">
              {groupVariants.map((variant) => {
                const optionValue = getMetafieldValue(variant.metadata?.option_value) || variant.title
                const adjustment = variant.metadata?.price_adjustment
                const stock = variant.metadata?.stock_quantity
                const outOfStock = typeof stock === 'number' && stock <= 0

                return (
                  <div
                    key={variant.id}
                    className={`rounded-lg border px-3 py-2 text-sm ${
                      outOfStock
                        ? 'border-gray-200 text-gray-400 bg-gray-50'
                        : 'border-gray-300 text-gray-800 bg-white'
                    }`}
                  >
                    <span className="font-medium">{optionValue}</span>
                    {typeof adjustment === 'number' && adjustment !== 0 && (
                      <span className="ml-1 text-gray-500">
                        ({adjustment > 0 ? '+' : ''}
                        {formatPrice(adjustment)})
                      </span>
                    )}
                    {outOfStock && <span className="ml-1 text-xs">— Sold out</span>}
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}