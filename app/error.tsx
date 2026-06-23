'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
      <p className="text-gray-600 mb-6">{error.message || 'An unexpected error occurred.'}</p>
      <button
        onClick={reset}
        className="rounded-lg bg-brand-600 px-5 py-2.5 text-white font-medium hover:bg-brand-700 transition-colors"
      >
        Try again
      </button>
    </div>
  )
}