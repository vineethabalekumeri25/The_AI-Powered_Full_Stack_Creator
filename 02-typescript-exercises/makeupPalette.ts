// --- Task 1: Basic Types (Type Aliases for Makeup Products) ---
// These type aliases define specific types for makeup product properties
type ProductCategory = "lipstick" | "foundation" | "eyeshadow" | "mascara" | "blush"
type SkinTone = "fair" | "light" | "medium" | "deep"
type ProductPrice = number
type ProductName = string

// --- Task 2: Interfaces (Defining Object Shapes) ---

// This interface defines the shape for a makeup product object.
// Each product has properties like name, category, price, and eco-friendly status.
interface Product {
  id: number
  name: ProductName
  category: ProductCategory
  price: ProductPrice
  image: string
  description: string
  isEcoFriendly: boolean
  isCrueltyFree: boolean
}

// This interface defines the shape for a makeup palette object.
// A palette is a collection of products organized by skin tone.
interface MakeupPalette {
  id: number
  name: string
  products: Product[]
  skinTone: SkinTone
  description: string
}

// This interface defines the shape for a wishlist item object.
// It tracks which products users have added to their wishlist and when.
interface WishlistItem {
  productId: number
  productName: string
  addedDate: string
}

// --- Task 3: Complex Types (Creative Exercise: Makeup Palette Interface) ---

// Example object that follows the Product interface
// This represents a luxury lipstick product with eco-friendly and cruelty-free certifications
const velvetMatteLipstick: Product = {
  id: 1,
  name: "Velvet Matte Lipstick",
  category: "lipstick",
  price: 28,
  image: "/luxury-lipstick-velvet-matte.jpg",
  description: "Long-lasting luxury color",
  isEcoFriendly: true,
  isCrueltyFree: true,
}

// Example object that follows the Product interface
// This represents a foundation product with full coverage and natural finish
const flawlessFoundation: Product = {
  id: 2,
  name: "Flawless Foundation",
  category: "foundation",
  price: 35,
  image: "/foundation-makeup-product.jpg",
  description: "Perfect coverage, natural finish",
  isEcoFriendly: true,
  isCrueltyFree: true,
}

// Example object that follows the Product interface
// This represents an eyeshadow palette with shimmer and multi-dimensional colors
const shimmerPalette: Product = {
  id: 3,
  name: "Shimmer Palette",
  category: "eyeshadow",
  price: 42,
  image: "/eyeshadow-palette-shimmer.jpg",
  description: "Radiant, multi-dimensional colors",
  isEcoFriendly: true,
  isCrueltyFree: true,
}

// Example object that follows the MakeupPalette interface
// This palette is curated specifically for fair skin tones and includes multiple products
const fairSkinPalette: MakeupPalette = {
  id: 1,
  name: "Fair Skin Collection",
  skinTone: "fair",
  description: "Curated makeup shades perfect for fair skin tones",
  products: [velvetMatteLipstick, flawlessFoundation, shimmerPalette],
}

// Example array of objects that follow the WishlistItem interface
// This demonstrates how users can save their favorite products to a wishlist
const sampleWishlist: WishlistItem[] = [
  {
    productId: 1,
    productName: "Velvet Matte Lipstick",
    addedDate: "2025-01-15",
  },
  {
    productId: 3,
    productName: "Shimmer Palette",
    addedDate: "2025-01-16",
  },
]

// --- Console Logs for Demonstration ---
console.log("--- Product Example ---")
console.log(velvetMatteLipstick)

console.log("--- Makeup Palette Object ---")
console.log(fairSkinPalette)

console.log("--- Wishlist Items ---")
console.log(sampleWishlist)

export type { Product, MakeupPalette, WishlistItem, ProductCategory, SkinTone }
export { velvetMatteLipstick, flawlessFoundation, shimmerPalette, fairSkinPalette, sampleWishlist }
