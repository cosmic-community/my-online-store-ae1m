# My Online Store

![App Preview](https://imgix.cosmicjs.com/74b82670-6f48-11f1-b7fe-27b51f9bc579-autopilot-photo-1524592094714-0f0654e20314-1782249241120.jpeg?w=1200&h=630&fit=crop&auto=format,compress)

A beautiful, modern, and fully responsive e-commerce storefront built with **Next.js 16** and **Cosmic**. Browse products, explore categories, view product variants, and read customer reviews — all powered by your existing Cosmic content.

## Features

- 🛍️ **Product Catalog** — Browse all products with images, pricing, sale prices, and inventory status
- 🏷️ **Category Pages** — Explore products organized by category
- 🎨 **Product Variants** — View available variants with option values, price adjustments, and stock
- ⭐ **Customer Reviews** — Read verified-purchase reviews with star ratings
- 🔍 **Featured Products** — Highlighted products on the homepage
- 💸 **Sale Pricing** — Automatic display of discounted prices
- 📱 **Fully Responsive** — Looks great on mobile, tablet, and desktop
- ⚡ **Server-Side Rendering** — Fast initial loads with Next.js App Router & Server Components

## Clone this Project

Want to create your own version of this project with all the content and structure? Clone this Cosmic bucket and code repository to get started instantly:

[![Clone this Project](https://img.shields.io/badge/Clone%20this%20Project-29abe2?style=for-the-badge&logo=cosmic&logoColor=white)](https://app.cosmicjs.com/projects/new?clone_bucket=6a3af6abf4a53de1c27f4244&clone_repository=6a3af7d1f4a53de1c27f4298)

## Prompts

This application was built using the following prompts to generate the content structure and code:

### Content Model Prompt

> "Create content models for an online store with products (including images, pricing, description, and inventory status), product categories, and customer reviews.
>
> User instructions: An e-commerce store with products, categories, variants, and customer reviews"

### Code Generation Prompt

> Build a Next.js application for an online business called "My Online Store". The content is managed in Cosmic CMS with the following object types: categories, products, variants, reviews. Create a beautiful, modern, responsive design with a homepage and pages for each content type.
>
> User instructions: An e-commerce store with products, categories, variants, and customer reviews

The app has been tailored to work with your existing Cosmic content structure and includes all the features requested above.

## Technologies Used

- [Next.js 16](https://nextjs.org/) — App Router with React Server Components
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/) — Strict typing throughout
- [Tailwind CSS](https://tailwindcss.com/) — Utility-first styling
- [Cosmic](https://www.cosmicjs.com/) — Headless CMS ([docs](https://www.cosmicjs.com/docs))

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) or Node.js 18+
- A Cosmic account with a bucket containing `categories`, `products`, `variants`, and `reviews` object types

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   bun install
   ```
3. Set environment variables (these are provided automatically when deploying through Cosmic):
   ```env
   COSMIC_BUCKET_SLUG=your-bucket-slug
   COSMIC_READ_KEY=your-read-key
   COSMIC_WRITE_KEY=your-write-key
   ```
4. Run the development server:
   ```bash
   bun run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000)

## Cosmic SDK Examples

```typescript
import { cosmic } from '@/lib/cosmic'

// Fetch all products with connected category data
const response = await cosmic.objects
  .find({ type: 'products' })
  .props(['id', 'title', 'slug', 'metadata'])
  .depth(1)

const products = response.objects

// Fetch reviews for a single product
const reviews = await cosmic.objects
  .find({ type: 'reviews', 'metadata.product': productId })
  .depth(1)
```

## Cosmic CMS Integration

This application reads the following object types from your Cosmic bucket:

- **categories** — `name`, `description`, `category_image`
- **products** — `name`, `description`, `price`, `sale_price`, `sku`, `main_image`, `gallery`, `inventory_status`, `quantity_in_stock`, `featured`, `category`
- **variants** — `variant_name`, `option_value`, `price_adjustment`, `sku`, `stock_quantity`, `product`
- **reviews** — `reviewer_name`, `rating`, `review_title`, `review_text`, `verified_purchase`, `product`

The app uses the `depth` parameter to resolve connected objects (e.g., a product's category, a review's product) in a single query. Learn more in the [Cosmic docs](https://www.cosmicjs.com/docs).

## Deployment Options

### Vercel
1. Push to GitHub
2. Import the repo into [Vercel](https://vercel.com/)
3. Add `COSMIC_BUCKET_SLUG`, `COSMIC_READ_KEY`, and `COSMIC_WRITE_KEY` environment variables
4. Deploy

### Netlify
1. Push to GitHub
2. Import into [Netlify](https://netlify.com/)
3. Set build command to `bun run build` and add the environment variables
4. Deploy
<!-- README_END -->