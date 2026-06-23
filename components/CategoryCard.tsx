import Link from 'next/link'
import type { Category } from '@/types'
import { getMetafieldValue } from '@/lib/cosmic'

interface CategoryCardProps {
  category: Category
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const name = getMetafieldValue(category.metadata?.name) || category.title
  const image = category.metadata?.category_image

  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group relative block rounded-2xl overflow-hidden aspect-[4/3] bg-gray-900 shadow-sm hover:shadow-md transition-shadow"
    >
      {image ? (
        <img
          src={`${image.imgix_url}?w=600&h=450&fit=crop&auto=format,compress`}
          alt={name}
          width={300}
          height={225}
          className="w-full h-full object-cover opacity-80 group-hover:opacity-60 group-hover:scale-105 transition-all duration-300"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-brand-500 to-brand-800" />
      )}
      <div className="absolute inset-0 flex items-end p-4">
        <h3 className="text-lg font-bold text-white drop-shadow">{name}</h3>
      </div>
    </Link>
  )
}