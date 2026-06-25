// Base Cosmic object interface
export interface CosmicObject {
  id: string;
  slug: string;
  title: string;
  content?: string;
  metadata: Record<string, any>;
  type: string;
  created_at: string;
  modified_at: string;
}

export interface CosmicImage {
  url: string;
  imgix_url: string;
}

// Inventory status select values (match content model)
export type InventoryStatus = 'In Stock' | 'Out of Stock' | 'Low Stock' | 'Pre-Order';

export interface Category extends CosmicObject {
  type: 'categories';
  metadata: {
    name?: string;
    description?: string;
    category_image?: CosmicImage;
  };
}

export interface Product extends CosmicObject {
  type: 'products';
  metadata: {
    name?: string;
    description?: string;
    price?: number;
    sale_price?: number;
    sku?: string;
    main_image?: CosmicImage;
    gallery?: CosmicImage[];
    inventory_status?: InventoryStatus | { key: string; value: string } | string;
    quantity_in_stock?: number;
    featured?: boolean;
    category?: Category;
  };
}

export interface Variant extends CosmicObject {
  type: 'variants';
  metadata: {
    variant_name?: string;
    option_value?: string;
    price_adjustment?: number;
    sku?: string;
    stock_quantity?: number;
    product?: Product;
  };
}

export interface Review extends CosmicObject {
  type: 'reviews';
  metadata: {
    reviewer_name?: string;
    rating?: number;
    review_title?: string;
    review_text?: string;
    verified_purchase?: boolean;
    product?: Product;
  };
}

export interface BlogPost extends CosmicObject {
  type: 'blog-posts';
  metadata: {
    meta_title?: string;
    meta_description?: string;
    focus_keyword?: string;
    canonical_url?: string;
    featured_image?: CosmicImage;
    featured_image_alt?: string;
    excerpt?: string;
    author?: string;
    category?: string;
    tags?: string;
    reading_time_minutes?: number;
    content?: string;
  };
}

// API response shape
export interface CosmicResponse<T> {
  objects: T[];
  total: number;
  limit: number;
  skip: number;
}

// Type guards
export function isProduct(obj: CosmicObject): obj is Product {
  return obj.type === 'products';
}

export function isCategory(obj: CosmicObject): obj is Category {
  return obj.type === 'categories';
}

export function isBlogPost(obj: CosmicObject): obj is BlogPost {
  return obj.type === 'blog-posts';
}
