"use client"
import ProductCard from "./product-card"

interface Product {
  id: string
  name: string
  brand: string
  price: number
  category: string
  imageUrl: string
  rating: number
  reviews: number
}

interface ProductGridProps {
  category: string
  priceRange: [number, number]
}

const products: Product[] = [
  {
    id: "1",
    name: "Velvet Matte Lipstick",
    brand: "Luxe Cosmetics",
    price: 28,
    category: "lipstick",
    imageUrl: "/luxury-lipstick-product.jpg",
    rating: 4.8,
    reviews: 234,
  },
  {
    id: "2",
    name: "Flawless Foundation",
    brand: "Glow Studio",
    price: 42,
    category: "foundation",
    imageUrl: "/foundation-makeup-product.jpg",
    rating: 4.6,
    reviews: 189,
  },
  {
    id: "3",
    name: "Shimmer Eyeshadow Palette",
    brand: "Luxe Cosmetics",
    price: 55,
    category: "eyeshadow",
    imageUrl: "/eyeshadow-palette-luxury.jpg",
    rating: 4.9,
    reviews: 312,
  },
  {
    id: "4",
    name: "Volume Boost Mascara",
    brand: "Glow Studio",
    price: 32,
    category: "mascara",
    imageUrl: "/mascara-beauty-product.jpg",
    rating: 4.7,
    reviews: 156,
  },
  {
    id: "5",
    name: "Peachy Blush",
    brand: "Beauty Essentials",
    price: 24,
    category: "blush",
    imageUrl: "/blush-makeup-product.jpg",
    rating: 4.5,
    reviews: 98,
  },
  {
    id: "6",
    name: "Ruby Red Lipstick",
    brand: "Beauty Essentials",
    price: 26,
    category: "lipstick",
    imageUrl: "/red-lipstick-luxury.jpg",
    rating: 4.8,
    reviews: 267,
  },
  {
    id: "7",
    name: "Nude Foundation",
    brand: "Luxe Cosmetics",
    price: 45,
    category: "foundation",
    imageUrl: "/nude-foundation-makeup.jpg",
    rating: 4.7,
    reviews: 201,
  },
  {
    id: "8",
    name: "Golden Eyeshadow",
    brand: "Glow Studio",
    price: 38,
    category: "eyeshadow",
    imageUrl: "/golden-eyeshadow-palette.jpg",
    rating: 4.6,
    reviews: 145,
  },
  {
    id: "9",
    name: "Coral Sunset Lipstick",
    brand: "Luxe Cosmetics",
    price: 29,
    category: "lipstick",
    imageUrl: "/coral-lipstick-product.jpg",
    rating: 4.7,
    reviews: 178,
  },
  {
    id: "10",
    name: "Porcelain Skin Foundation",
    brand: "Beauty Essentials",
    price: 38,
    category: "foundation",
    imageUrl: "/porcelain-foundation-product.jpg",
    rating: 4.8,
    reviews: 223,
  },
  {
    id: "11",
    name: "Smokey Eye Palette",
    brand: "Glow Studio",
    price: 52,
    category: "eyeshadow",
    imageUrl: "/smokey-eye-palette-product.jpg",
    rating: 4.9,
    reviews: 289,
  },
  {
    id: "12",
    name: "Waterproof Mascara",
    brand: "Luxe Cosmetics",
    price: 35,
    category: "mascara",
    imageUrl: "/waterproof-mascara-product.jpg",
    rating: 4.8,
    reviews: 201,
  },
  {
    id: "13",
    name: "Rose Gold Blush",
    brand: "Glow Studio",
    price: 26,
    category: "blush",
    imageUrl: "/rose-gold-blush-product.jpg",
    rating: 4.6,
    reviews: 134,
  },
  {
    id: "14",
    name: "Berry Wine Lipstick",
    brand: "Beauty Essentials",
    price: 27,
    category: "lipstick",
    imageUrl: "/berry-lipstick-product.jpg",
    rating: 4.7,
    reviews: 156,
  },
  {
    id: "15",
    name: "Luminous Glow Foundation",
    brand: "Luxe Cosmetics",
    price: 48,
    category: "foundation",
    imageUrl: "/luminous-foundation-product.jpg",
    rating: 4.9,
    reviews: 267,
  },
  {
    id: "16",
    name: "Sunset Vibes Eyeshadow",
    brand: "Beauty Essentials",
    price: 42,
    category: "eyeshadow",
    imageUrl: "/sunset-eyeshadow-product.jpg",
    rating: 4.5,
    reviews: 112,
  },
  {
    id: "17",
    name: "Lash Lengthening Mascara",
    brand: "Glow Studio",
    price: 34,
    category: "mascara",
    imageUrl: "/lash-mascara-product.jpg",
    rating: 4.6,
    reviews: 189,
  },
  {
    id: "18",
    name: "Mauve Blush",
    brand: "Luxe Cosmetics",
    price: 28,
    category: "blush",
    imageUrl: "/mauve-blush-product.jpg",
    rating: 4.8,
    reviews: 145,
  },
  {
    id: "19",
    name: "Nude Pink Lipstick",
    brand: "Glow Studio",
    price: 30,
    category: "lipstick",
    imageUrl: "/nude-pink-lipstick-product.jpg",
    rating: 4.7,
    reviews: 198,
  },
  {
    id: "20",
    name: "Warm Honey Foundation",
    brand: "Beauty Essentials",
    price: 40,
    category: "foundation",
    imageUrl: "/honey-foundation-product.jpg",
    rating: 4.6,
    reviews: 176,
  },
]

export default function ProductGrid({ category, priceRange }: ProductGridProps) {
  const filteredProducts = products.filter((product) => {
    const categoryMatch = category === "all" || product.category === category
    const priceMatch = product.price >= priceRange[0] && product.price <= priceRange[1]
    return categoryMatch && priceMatch
  })

  return (
    <div className="flex-1 p-6 lg:p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-serif font-bold text-foreground mb-2">
          {category === "all" ? "All Products" : category.charAt(0).toUpperCase() + category.slice(1)}
        </h2>
        <p className="text-muted-foreground">
          Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}
        </p>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No products found matching your filters.</p>
        </div>
      )}
    </div>
  )
}
