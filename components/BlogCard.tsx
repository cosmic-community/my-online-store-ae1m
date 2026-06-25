import Link from 'next/link'
import type { BlogPost } from '@/types'

interface BlogCardProps {
  post: BlogPost
}

export default function BlogCard({ post }: BlogCardProps) {
  const { metadata, slug, title } = post
  const image = metadata?.featured_image
  const alt = metadata?.featured_image_alt || title
  const excerpt = metadata?.excerpt || ''
  const category = metadata?.category || ''
  const author = metadata?.author || ''
  const readingTime = metadata?.reading_time_minutes
  const tags = metadata?.tags ? metadata.tags.split(',').map((t: string) => t.trim()).slice(0, 3) : []

  return (
    <article className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col">
      <Link href={`/blog/${slug}`} className="block overflow-hidden aspect-[16/9] bg-gray-100">
        {image ? (
          <img
            src={`${image.imgix_url}?w=800&h=450&fit=crop&auto=format,compress`}
            alt={alt}
            width={800}
            height={450}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-4xl">📝</div>
        )}
      </Link>

      <div className="p-5 flex flex-col flex-1">
        {category && (
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-600 mb-2">
            {category}
          </span>
        )}

        <Link href={`/blog/${slug}`}>
          <h2 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-brand-600 transition-colors leading-snug">
            {title}
          </h2>
        </Link>

        {excerpt && (
          <p className="text-sm text-gray-600 mb-4 flex-1 line-clamp-3">{excerpt}</p>
        )}

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {tags.map((tag: string) => (
              <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-gray-400 mt-auto pt-3 border-t border-gray-100">
          <span>{author}</span>
          {readingTime && <span>{readingTime} min read</span>}
        </div>
      </div>
    </article>
  )
}
