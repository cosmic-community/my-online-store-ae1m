import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold text-white">
            <span className="text-xl">🛍️</span>
            <span>My Online Store</span>
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/products" className="hover:text-white transition-colors">Products</Link>
            <Link href="/categories" className="hover:text-white transition-colors">Categories</Link>
            <Link href="/reviews" className="hover:text-white transition-colors">Reviews</Link>
          </nav>
        </div>
        <p className="mt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} My Online Store. All rights reserved.
        </p>
      </div>
    </footer>
  )
}