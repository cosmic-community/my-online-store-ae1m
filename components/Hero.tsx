import Link from 'next/link'

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight">
          Find Something You Love
        </h1>
        <p className="mt-5 max-w-2xl mx-auto text-lg text-brand-100">
          Discover quality products, explore curated categories, and shop with confidence
          backed by real customer reviews.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            href="/products"
            className="rounded-lg bg-white px-6 py-3 font-semibold text-brand-700 hover:bg-brand-50 transition-colors"
          >
            Shop Products
          </Link>
          <Link
            href="/categories"
            className="rounded-lg border border-white/40 px-6 py-3 font-semibold text-white hover:bg-white/10 transition-colors"
          >
            Browse Categories
          </Link>
        </div>
      </div>
    </section>
  )
}