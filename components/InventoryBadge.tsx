import { getMetafieldValue } from '@/lib/cosmic'

interface InventoryBadgeProps {
  status: unknown
}

export default function InventoryBadge({ status }: InventoryBadgeProps) {
  const value = getMetafieldValue(status)

  if (!value) return null

  const normalized = value.toLowerCase()
  let classes = 'bg-gray-100 text-gray-700'

  if (normalized.includes('in stock')) {
    classes = 'bg-green-100 text-green-700'
  } else if (normalized.includes('out')) {
    classes = 'bg-red-100 text-red-700'
  } else if (normalized.includes('low')) {
    classes = 'bg-amber-100 text-amber-700'
  } else if (normalized.includes('pre')) {
    classes = 'bg-blue-100 text-blue-700'
  }

  return (
    <span className={`inline-flex items-center rounded-full text-xs font-semibold px-2.5 py-1 ${classes}`}>
      {value}
    </span>
  )
}