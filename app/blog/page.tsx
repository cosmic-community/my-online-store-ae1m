import { getBlogPosts } from '@/lib/cosmic'
import BlogCard from '@/components/BlogCard'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog | My Online Store',
  description: 'Buying guides, product spotlights, and style tips from My Online Store. Find expert advice on wallets, headphones, travel gear, and more.',
  openGraph: {
    title: 'Blog | My Online Store',
    description: 'Buying guides, product spotlights, and style tips from My Online Store.',
    type: 'website',
  },
}

export const revalidate = 60

export default async function BlogPage() {
  const posts = await getBlogPosts()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Page header */}
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-3">Blog</h1>
        <p className="text-lg text-gray-600 max-w-2xl">
          Buying guides, product spotlights, and tips to help you choose well and carry better.
        </p>
      </div>

      {posts.length === 0 ? (
        <p className="text-gray-500">No posts published yet — check back soon.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}
