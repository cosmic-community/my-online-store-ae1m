import { getBlogPostBySlug, getBlogPosts } from '@/lib/cosmic'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

// ── Block renderer ─────────────────────────────────────────────────────────
// Replaces {{block-name /}} tokens with a styled product-spotlight card.
// The block content is stored in the CMS; here we do a simple token strip
// and let the rich prose render. For a richer experience, extend this map.
const BLOCK_DISPLAY_NAMES: Record<string, { emoji: string; label: string }> = {
  'product-spotlight-alpine-wallet': { emoji: '👜', label: 'Alpine Slim Leather Wallet — $59.99' },
  'product-spotlight-prosound-headphones': { emoji: '🎧', label: 'ProSound Elite Headphones — $149.99' },
  'product-spotlight-leather-weekender': { emoji: '🧳', label: 'Leather Weekender Bag — $249.00' },
}

function renderContent(raw: string): string {
  // Replace block tokens with inline HTML callout boxes
  return raw.replace(/\{\{([\w-]+)\s*\/\}\}/g, (_match, name) => {
    const block = BLOCK_DISPLAY_NAMES[name]
    if (!block) return ''
    return `<div class="my-8 rounded-2xl border border-brand-200 bg-brand-50 p-6 flex items-center gap-4 not-prose">
      <span class="text-4xl">${block.emoji}</span>
      <div>
        <p class="font-bold text-gray-900 text-lg">${block.label}</p>
        <a href="/products" class="text-sm text-brand-600 hover:underline font-medium mt-1 inline-block">Shop Now →</a>
      </div>
    </div>`
  })
}

// ── Static params ──────────────────────────────────────────────────────────
export async function generateStaticParams() {
  const posts = await getBlogPosts()
  return posts.map((p) => ({ slug: p.slug }))
}

// ── Metadata ───────────────────────────────────────────────────────────────
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)
  if (!post) return {}

  const metaTitle = post.metadata?.meta_title || post.title
  const metaDescription = post.metadata?.meta_description || post.metadata?.excerpt || ''
  const image = post.metadata?.featured_image

  return {
    title: `${metaTitle} | My Online Store`,
    description: metaDescription,
    keywords: post.metadata?.tags || '',
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      type: 'article',
      ...(image && { images: [{ url: `${image.imgix_url}?w=1200&h=630&fit=crop&auto=format` }] }),
    },
    ...(post.metadata?.canonical_url && {
      alternates: { canonical: post.metadata.canonical_url },
    }),
  }
}

// ── Page ───────────────────────────────────────────────────────────────────
export const revalidate = 60

export default async function BlogPostPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)

  if (!post) notFound()

  const image = post.metadata?.featured_image
  const alt = post.metadata?.featured_image_alt || post.title
  const author = post.metadata?.author || ''
  const category = post.metadata?.category || ''
  const readingTime = post.metadata?.reading_time_minutes
  const focusKeyword = post.metadata?.focus_keyword || ''
  const tags = post.metadata?.tags
    ? post.metadata.tags.split(',').map((t: string) => t.trim())
    : []
  const rawContent = post.metadata?.content || ''
  const htmlContent = renderContent(rawContent)

  const publishDate = new Date(post.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-8" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand-600">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/blog" className="hover:text-brand-600">Blog</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{post.title}</span>
      </nav>

      {/* Category badge */}
      {category && (
        <span className="inline-block text-xs font-semibold uppercase tracking-widest text-brand-600 mb-4">
          {category}
        </span>
      )}

      {/* Title */}
      <h1 className="text-4xl font-extrabold text-gray-900 leading-tight mb-4">
        {post.title}
      </h1>

      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-8">
        {author && <span>By <span className="font-medium text-gray-700">{author}</span></span>}
        <span>{publishDate}</span>
        {readingTime && <span>{readingTime} min read</span>}
        {focusKeyword && (
          <span className="bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-full px-2.5 py-0.5 text-xs font-medium">
            🎯 {focusKeyword}
          </span>
        )}
      </div>

      {/* Featured image */}
      {image && (
        <figure className="mb-10 rounded-2xl overflow-hidden shadow-md">
          <Image
            src={`${image.imgix_url}?w=1200&h=630&fit=crop&auto=format,compress`}
            alt={alt}
            width={1200}
            height={630}
            className="w-full object-cover"
            priority
          />
        </figure>
      )}

      {/* Article body */}
      <article
        className="prose prose-lg prose-gray max-w-none
          prose-headings:font-bold prose-headings:text-gray-900
          prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
          prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
          prose-p:text-gray-700 prose-p:leading-relaxed
          prose-a:text-brand-600 prose-a:no-underline hover:prose-a:underline
          prose-strong:text-gray-900
          prose-ul:my-4 prose-li:my-1
          prose-table:text-sm prose-th:bg-gray-50 prose-td:border prose-th:border"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />

      {/* Tags */}
      {tags.length > 0 && (
        <div className="mt-12 pt-6 border-t border-gray-200">
          <p className="text-sm font-semibold text-gray-700 mb-3">Tags</p>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag: string) => (
              <span
                key={tag}
                className="text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Back link */}
      <div className="mt-10">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-brand-600 font-medium hover:underline"
        >
          ← Back to Blog
        </Link>
      </div>
    </div>
  )
}
