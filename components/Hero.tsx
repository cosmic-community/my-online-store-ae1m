import Link from 'next/link'

export default function Hero() {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        backgroundImage: 'url(https://imgix.cosmicjs.com/70d6cd90-6f48-11f1-b7fe-27b51f9bc579-autopilot-photo-1542291026-7eec264c27ff-1782249234603.jpeg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight">
          Find Something You Love
        </h1>
        <p className="mt-5 max-w-2xl mx-auto text-lg text-white/80">
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