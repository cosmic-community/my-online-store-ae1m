import { NextRequest, NextResponse } from 'next/server'
import { createBucketClient } from '@cosmicjs/sdk'

const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG as string,
  readKey: process.env.COSMIC_READ_KEY as string,
  writeKey: process.env.COSMIC_WRITE_KEY as string,
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { reviewer_name, rating, review_title, review_text, product_slug } = body

    // Validate required fields
    if (!reviewer_name || typeof reviewer_name !== 'string' || reviewer_name.trim().length === 0) {
      return NextResponse.json({ error: 'Reviewer name is required.' }, { status: 400 })
    }
    if (!rating || !['1', '2', '3', '4', '5'].includes(String(rating))) {
      return NextResponse.json({ error: 'A valid rating (1–5) is required.' }, { status: 400 })
    }
    if (!product_slug || typeof product_slug !== 'string') {
      return NextResponse.json({ error: 'Product reference is required.' }, { status: 400 })
    }
    if (reviewer_name.trim().length > 100) {
      return NextResponse.json({ error: 'Reviewer name is too long.' }, { status: 400 })
    }
    if (review_text && review_text.length > 2000) {
      return NextResponse.json({ error: 'Review text must be 2000 characters or fewer.' }, { status: 400 })
    }

    // Look up the product by slug to get its ID
    let productObject: { id: string; title: string; slug: string } | undefined
    try {
      const res = await cosmic.objects
        .findOne({ type: 'products', slug: product_slug })
        .props(['id', 'title', 'slug'])
      productObject = res.object
    } catch {
      return NextResponse.json({ error: 'Product not found.' }, { status: 404 })
    }

    if (!productObject || !productObject.id) {
      return NextResponse.json({ error: 'Product not found.' }, { status: 404 })
    }

    // Build a URL-friendly title slug
    const titleSlug = `review-${product_slug}-${Date.now()}`

    // Create the review object in Cosmic (published so it is immediately visible)
    // IMPORTANT: The `product` metafield is an object relationship — it must be
    // set using the product's ID, NOT its slug.
    const newReview = await cosmic.objects.insertOne({
      title: `Review by ${reviewer_name.trim()} for ${productObject.title}`,
      slug: titleSlug,
      type: 'reviews',
      status: 'published',
      metadata: {
        reviewer_name: reviewer_name.trim(),
        rating: String(rating),
        review_title: review_title?.trim() || '',
        review_text: review_text?.trim() || '',
        verified_purchase: false,
        product: productObject.id,
      },
    })

    return NextResponse.json({ success: true, review: newReview.object }, { status: 201 })
  } catch (error) {
    console.error('Review submission error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}