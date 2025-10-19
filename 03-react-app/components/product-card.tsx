"use client"

import { useState } from "react"
import { Heart, ShoppingCart, Star } from "lucide-react"
import { Button } from "@/components/ui/button"

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

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState<boolean>(false)
  const [isAdded, setIsAdded] = useState<boolean>(false)

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted)
  }

  const handleAddToCart = () => {
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  return (
    <div className="product-card-hover group bg-card rounded-xl overflow-hidden border border-border/50 hover:border-primary/50 shadow-lg hover:shadow-2xl">
      {/* Image Container with Premium Hover */}
      <div className="product-image-container relative overflow-hidden bg-muted h-72">
        <img src={product.imageUrl || "/placeholder.svg"} alt={product.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        {/* Wishlist Button with Enhanced Styling */}
        <button
          onClick={handleWishlist}
          className={`absolute top-4 right-4 px-4 py-2 rounded-full shadow-xl transition-all duration-300 flex items-center gap-2 font-semibold text-sm backdrop-blur-sm ${
            isWishlisted
              ? "bg-red-500/90 text-white hover:bg-red-600 scale-105"
              : "bg-background/80 text-foreground hover:bg-primary hover:text-primary-foreground hover:scale-105"
          }`}
          aria-label="Add to wishlist"
        >
          <Heart className="w-4 h-4 transition-transform duration-300" fill={isWishlisted ? "currentColor" : "none"} />
          <span>{isWishlisted ? "Wishlisted" : "Wishlist"}</span>
        </button>
      </div>

      {/* Content Section */}
      <div className="p-5">
        <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-2 opacity-75">
          {product.brand}
        </p>
        <h3 className="text-lg font-semibold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-300">
          {product.name}
        </h3>

        {/* Rating Section */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-4 h-4 transition-transform duration-300 group-hover:scale-110"
                fill={i < Math.floor(product.rating) ? "currentColor" : "none"}
                color={i < Math.floor(product.rating) ? "#fbbf24" : "#666"}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            {product.rating} ({product.reviews})
          </span>
        </div>

        {/* Price */}
        <div className="mb-4">
          <span className="text-3xl font-bold text-foreground">${product.price}</span>
        </div>

        {/* Add to Cart Button with Premium Styling */}
        <Button
          onClick={handleAddToCart}
          className="w-full premium-button bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-primary-foreground font-semibold py-2 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-primary/50"
        >
          {isAdded ? (
            <span className="flex items-center gap-2 animate-pulse">
              <ShoppingCart className="w-4 h-4" />
              Added to Cart!
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </span>
          )}
        </Button>
      </div>
    </div>
  )
}
