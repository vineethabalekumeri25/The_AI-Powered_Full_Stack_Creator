"use client"

import { useState } from "react"
import Header from "@/components/header"
import ProductGrid from "@/components/product-grid"
import FilterSidebar from "@/components/filter-sidebar"

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200])

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <FilterSidebar
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          priceRange={priceRange}
          onPriceChange={setPriceRange}
        />
        <ProductGrid category={selectedCategory} priceRange={priceRange} />
      </div>
    </main>
  )
}
