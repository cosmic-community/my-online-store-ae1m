'use client'
// components/ReviewForm.tsx
import { useState } from 'react'

interface ReviewFormProps {
  productSlug: string
  onReviewSubmitted?: () => void
}

export default function ReviewForm({ productSlug, onReviewSubmitted }: ReviewFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    reviewer_name: '',
    rating: '',
    review_title: '',
    review_text: '',
  })

  const [hoveredStar, setHoveredStar] = useState(0)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  function handleStarClick(value: number) {
    setForm((prev) => ({ ...prev, rating: String(value) }))
    setError('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!form.reviewer_name.trim()) {
      setError('Please enter your name.')
      return
    }
    if (!form.rating) {
      setError('Please select a star rating.')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          product_slug: productSlug,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Submission failed. Please try again.')
        return
      }

      setSubmitted(true)
      setIsOpen(false)
      onReviewSubmitted?.()
    } catch {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="rounded-2xl bg-green-50 border border-green-200 p-6 text-center">
        <div className="text-3xl mb-2">🎉</div>
        <h3 className="text-lg font-semibold text-green-800 mb-1">Thank you for your review!</h3>
        <p className="text-sm text-green-700">Your review has been submitted and is now live.</p>
      </div>
    )
  }

  return (
    <div className="mt-8">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-600 text-white px-6 py-3 text-sm font-semibold hover:bg-brand-700 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
        >
          <span>✏️</span>
          Write a Review
        </button>
      ) : (
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold text-gray-900">Write a Review</h3>
            <button
              onClick={() => { setIsOpen(false); setError('') }}
              className="text-gray-400 hover:text-gray-600 text-xl leading-none"
              aria-label="Close review form"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Star Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Rating <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-1" role="group" aria-label="Star rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleStarClick(star)}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    aria-label={`${star} star${star !== 1 ? 's' : ''}`}
                    className="text-3xl transition-transform hover:scale-110 focus:outline-none"
                  >
                    <span
                      className={`${
                        star <= (hoveredStar || Number(form.rating))
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    >
                      ★
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Name */}
            <div>
              <label htmlFor="reviewer_name" className="block text-sm font-medium text-gray-700 mb-1">
                Your Name <span className="text-red-500">*</span>
              </label>
              <input
                id="reviewer_name"
                name="reviewer_name"
                type="text"
                value={form.reviewer_name}
                onChange={handleChange}
                placeholder="e.g. Jane D."
                maxLength={100}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              />
            </div>

            {/* Review Title */}
            <div>
              <label htmlFor="review_title" className="block text-sm font-medium text-gray-700 mb-1">
                Review Title <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                id="review_title"
                name="review_title"
                type="text"
                value={form.review_title}
                onChange={handleChange}
                placeholder="Summarize your experience"
                maxLength={150}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              />
            </div>

            {/* Review Text */}
            <div>
              <label htmlFor="review_text" className="block text-sm font-medium text-gray-700 mb-1">
                Your Review <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <textarea
                id="review_text"
                name="review_text"
                value={form.review_text}
                onChange={handleChange}
                placeholder="Tell others what you think about this product…"
                rows={4}
                maxLength={2000}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none"
              />
              <p className="text-xs text-gray-400 mt-1 text-right">{form.review_text.length}/2000</p>
            </div>

            {/* Error */}
            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            {/* Submit */}
            <div className="flex gap-3 pt-1">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 rounded-xl bg-brand-600 text-white px-6 py-2.5 text-sm font-semibold hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
              >
                {submitting ? 'Submitting…' : 'Submit Review'}
              </button>
              <button
                type="button"
                onClick={() => { setIsOpen(false); setError('') }}
                className="rounded-xl border border-gray-300 text-gray-600 px-5 py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
