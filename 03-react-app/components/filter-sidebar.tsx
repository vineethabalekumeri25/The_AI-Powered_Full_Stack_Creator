"use client"
import { Button } from "@/components/ui/button"

interface FilterSidebarProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
  priceRange: [number, number]
  onPriceChange: (range: [number, number]) => void
}

const categories = [
  { id: "all", label: "All Products" },
  { id: "lipstick", label: "Lipstick" },
  { id: "foundation", label: "Foundation" },
  { id: "eyeshadow", label: "Eyeshadow" },
  { id: "mascara", label: "Mascara" },
  { id: "blush", label: "Blush" },
]

export default function FilterSidebar({
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceChange,
}: FilterSidebarProps) {
  return (
    <aside className="hidden lg:block w-64 bg-card border-r border-border p-6 h-screen sticky top-16">
      <div className="space-y-8">
        {/* Category Filter */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-4">Category</h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                className={`block w-full text-left text-sm px-3 py-2 rounded transition ${
                  selectedCategory === category.id
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Price Filter */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-4">Price Range</h3>
          <div className="space-y-4">
            <input
              type="range"
              min="0"
              max="200"
              value={priceRange[1]}
              onChange={(e) => onPriceChange([priceRange[0], Number.parseInt(e.target.value)])}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>
        </div>

        {/* Reset Button */}
        <Button
          variant="outline"
          className="w-full bg-transparent"
          onClick={() => {
            onCategoryChange("all")
            onPriceChange([0, 200])
          }}
        >
          Reset Filters
        </Button>
      </div>
    </aside>
  )
}
