"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Filter, X, SlidersHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import RetroPattern from "@/components/retro-pattern"

// Sample product data
const products = [
  {
    id: 1,
    name: "Classic Heritage Tee",
    price: 85,
    colors: ["Black", "White", "Vintage Blue"],
    sizes: ["S", "M", "L", "XL"],
    category: "Heritage",
    image: "/placeholder.svg?height=400&width=400",
    isNew: true,
  },
  {
    id: 2,
    name: "Workwear Pocket Tee",
    price: 95,
    colors: ["Cream", "Olive", "Navy"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    category: "Workwear",
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    id: 3,
    name: "1950s Graphic Tee",
    price: 110,
    colors: ["Faded Black", "Washed Red", "Vintage White"],
    sizes: ["S", "M", "L", "XL"],
    category: "Graphic",
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    id: 4,
    name: "Luxury Pima Cotton Tee",
    price: 120,
    colors: ["White", "Black", "Heather Grey"],
    sizes: ["S", "M", "L", "XL"],
    category: "Essentials",
    image: "/placeholder.svg?height=400&width=400",
    isNew: true,
  },
  {
    id: 5,
    name: "Artisanal Dyed Tee",
    price: 135,
    colors: ["Indigo", "Terracotta", "Sage"],
    sizes: ["S", "M", "L", "XL"],
    category: "Artisanal",
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    id: 6,
    name: "Vintage Wash Tee",
    price: 95,
    colors: ["Washed Black", "Faded Navy", "Stone"],
    sizes: ["S", "M", "L", "XL"],
    category: "Heritage",
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    id: 7,
    name: "Limited Edition Artist Collab",
    price: 150,
    colors: ["Multi"],
    sizes: ["S", "M", "L", "XL"],
    category: "Collaborations",
    image: "/placeholder.svg?height=400&width=400",
    isNew: true,
  },
  {
    id: 8,
    name: "Heavyweight Premium Tee",
    price: 105,
    colors: ["Black", "White", "Charcoal"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    category: "Essentials",
    image: "/placeholder.svg?height=400&width=400",
  },
]

// Available filter options
const filterOptions = {
  categories: ["All", "Heritage", "Workwear", "Graphic", "Essentials", "Artisanal", "Collaborations"],
  colors: [
    "Black",
    "White",
    "Blue",
    "Navy",
    "Cream",
    "Olive",
    "Red",
    "Grey",
    "Indigo",
    "Terracotta",
    "Sage",
    "Stone",
    "Charcoal",
    "Multi",
  ],
  sizes: ["S", "M", "L", "XL", "XXL"],
}

// Sort options
const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
]

export default function ProductsPage() {
  // Filter state
  const [activeFilters, setActiveFilters] = useState({
    category: "All",
    colors: [],
    sizes: [],
    priceRange: [0, 200],
  })

  // Sort state
  const [sortBy, setSortBy] = useState("featured")

  // Mobile filter drawer state
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Handle filter changes
  const handleCategoryChange = (category) => {
    setActiveFilters({
      ...activeFilters,
      category,
    })
  }

  const handleColorToggle = (color) => {
    setActiveFilters({
      ...activeFilters,
      colors: activeFilters.colors.includes(color)
        ? activeFilters.colors.filter((c) => c !== color)
        : [...activeFilters.colors, color],
    })
  }

  const handleSizeToggle = (size) => {
    setActiveFilters({
      ...activeFilters,
      sizes: activeFilters.sizes.includes(size)
        ? activeFilters.sizes.filter((s) => s !== size)
        : [...activeFilters.sizes, size],
    })
  }

  const handlePriceChange = (value) => {
    setActiveFilters({
      ...activeFilters,
      priceRange: value,
    })
  }

  const clearFilters = () => {
    setActiveFilters({
      category: "All",
      colors: [],
      sizes: [],
      priceRange: [0, 200],
    })
  }

  // Filter products based on active filters
  const filteredProducts = products.filter((product) => {
    // Filter by category
    if (activeFilters.category !== "All" && product.category !== activeFilters.category) {
      return false
    }

    // Filter by color
    if (
      activeFilters.colors.length > 0 &&
      !product.colors.some((color) =>
        activeFilters.colors.some((activeColor) => color.toLowerCase().includes(activeColor.toLowerCase())),
      )
    ) {
      return false
    }

    // Filter by size
    if (activeFilters.sizes.length > 0 && !product.sizes.some((size) => activeFilters.sizes.includes(size))) {
      return false
    }

    // Filter by price
    if (product.price < activeFilters.priceRange[0] || product.price > activeFilters.priceRange[1]) {
      return false
    }

    return true
  })

  // Sort filtered products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return a.isNew ? -1 : b.isNew ? 1 : 0
      case "price-asc":
        return a.price - b.price
      case "price-desc":
        return b.price - a.price
      case "featured":
      default:
        return 0
    }
  })

  // Count active filters for badge
  const activeFilterCount =
    (activeFilters.category !== "All" ? 1 : 0) +
    activeFilters.colors.length +
    activeFilters.sizes.length +
    (activeFilters.priceRange[0] > 0 || activeFilters.priceRange[1] < 200 ? 1 : 0)

  return (
    <div className="bg-candy-cream min-h-screen relative">
      <RetroPattern className="absolute inset-0 opacity-5" />

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="flex flex-col space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-5xl font-display text-candy-navy">Shop Collection</h1>
              <p className="text-candy-navy/70 mt-1">
                {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"}
              </p>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              {/* Mobile filter button */}
              <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 md:hidden flex-1 border-candy-navy text-candy-navy"
                  >
                    <Filter className="h-4 w-4" />
                    Filters
                    {activeFilterCount > 0 && (
                      <Badge
                        variant="secondary"
                        className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full bg-candy-orange text-white"
                      >
                        {activeFilterCount}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-full sm:max-w-md bg-candy-cream border-r-4 border-candy-orange">
                  <SheetHeader className="mb-5">
                    <SheetTitle className="font-display text-candy-navy text-2xl">Filters</SheetTitle>
                    <SheetDescription className="text-candy-navy/70">Refine your product selection</SheetDescription>
                  </SheetHeader>
                  <ScrollArea className="h-[calc(100vh-10rem)] pr-4">
                    <div className="space-y-6">
                      {/* Mobile Category Filter */}
                      <div>
                        <h3 className="font-display text-candy-navy mb-3">Category</h3>
                        <div className="space-y-2">
                          {filterOptions.categories.map((category) => (
                            <div key={category} className="flex items-center">
                              <Checkbox
                                id={`mobile-category-${category}`}
                                checked={activeFilters.category === category}
                                onCheckedChange={() => handleCategoryChange(category)}
                                className="border-candy-navy text-candy-orange"
                              />
                              <label
                                htmlFor={`mobile-category-${category}`}
                                className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-candy-navy"
                              >
                                {category}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Separator className="bg-candy-navy/20" />

                      {/* Mobile Color Filter */}
                      <div>
                        <h3 className="font-display text-candy-navy mb-3">Color</h3>
                        <div className="grid grid-cols-2 gap-2">
                          {filterOptions.colors.map((color) => (
                            <div key={color} className="flex items-center">
                              <Checkbox
                                id={`mobile-color-${color}`}
                                checked={activeFilters.colors.includes(color)}
                                onCheckedChange={() => handleColorToggle(color)}
                                className="border-candy-navy text-candy-orange"
                              />
                              <label
                                htmlFor={`mobile-color-${color}`}
                                className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-candy-navy"
                              >
                                {color}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Separator className="bg-candy-navy/20" />

                      {/* Mobile Size Filter */}
                      <div>
                        <h3 className="font-display text-candy-navy mb-3">Size</h3>
                        <div className="flex flex-wrap gap-2">
                          {filterOptions.sizes.map((size) => (
                            <Button
                              key={size}
                              variant={activeFilters.sizes.includes(size) ? "default" : "outline"}
                              className={`w-12 h-10 rounded-lg ${
                                activeFilters.sizes.includes(size)
                                  ? "bg-candy-orange text-white"
                                  : "border-candy-navy text-candy-navy"
                              }`}
                              onClick={() => handleSizeToggle(size)}
                            >
                              {size}
                            </Button>
                          ))}
                        </div>
                      </div>

                      <Separator className="bg-candy-navy/20" />

                      {/* Mobile Price Range Filter */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-display text-candy-navy">Price</h3>
                          <div className="text-sm text-candy-navy">
                            ${activeFilters.priceRange[0]} - ${activeFilters.priceRange[1]}
                          </div>
                        </div>
                        <Slider
                          defaultValue={[0, 200]}
                          value={activeFilters.priceRange}
                          min={0}
                          max={200}
                          step={5}
                          onValueChange={handlePriceChange}
                          className="mb-6"
                        />
                      </div>
                    </div>
                  </ScrollArea>
                  <div className="flex items-center justify-between mt-6 pt-6 border-t border-candy-navy/20">
                    <Button variant="outline" onClick={clearFilters} className="border-candy-navy text-candy-navy">
                      Clear All
                    </Button>
                    <SheetClose asChild>
                      <Button className="bg-candy-orange hover:bg-candy-orange/90 text-white">Apply Filters</Button>
                    </SheetClose>
                  </div>
                </SheetContent>
              </Sheet>

              {/* Sort dropdown */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="flex-1 md:w-[180px] border-candy-navy text-candy-navy">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active filters display */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {activeFilters.category !== "All" && (
                <Badge variant="secondary" className="flex items-center gap-1 px-3 py-1.5 bg-candy-orange text-white">
                  {activeFilters.category}
                  <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => handleCategoryChange("All")} />
                </Badge>
              )}

              {activeFilters.colors.map((color) => (
                <Badge
                  key={color}
                  variant="secondary"
                  className="flex items-center gap-1 px-3 py-1.5 bg-candy-blue text-white"
                >
                  {color}
                  <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => handleColorToggle(color)} />
                </Badge>
              ))}

              {activeFilters.sizes.map((size) => (
                <Badge
                  key={size}
                  variant="secondary"
                  className="flex items-center gap-1 px-3 py-1.5 bg-candy-navy text-white"
                >
                  Size: {size}
                  <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => handleSizeToggle(size)} />
                </Badge>
              ))}

              {(activeFilters.priceRange[0] > 0 || activeFilters.priceRange[1] < 200) && (
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1 px-3 py-1.5 bg-candy-pink text-candy-navy"
                >
                  ${activeFilters.priceRange[0]} - ${activeFilters.priceRange[1]}
                  <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => handlePriceChange([0, 200])} />
                </Badge>
              )}

              {activeFilterCount > 1 && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-sm h-8 text-candy-navy">
                  Clear all
                </Button>
              )}
            </div>
          )}

          {/* Main content */}
          <div className="grid grid-cols-12 gap-6">
            {/* Desktop sidebar filters */}
            <div className="hidden md:block col-span-3 space-y-6 bg-white p-6 rounded-xl card-retro">
              {/* Category Filter */}
              <div>
                <h3 className="font-display text-candy-navy mb-3">Category</h3>
                <div className="space-y-2">
                  {filterOptions.categories.map((category) => (
                    <div key={category} className="flex items-center">
                      <Checkbox
                        id={`category-${category}`}
                        checked={activeFilters.category === category}
                        onCheckedChange={() => handleCategoryChange(category)}
                        className="border-candy-navy text-candy-orange"
                      />
                      <label
                        htmlFor={`category-${category}`}
                        className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-candy-navy"
                      >
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="bg-candy-navy/20" />

              {/* Color Filter */}
              <div>
                <h3 className="font-display text-candy-navy mb-3">Color</h3>
                <div className="grid grid-cols-2 gap-2">
                  {filterOptions.colors.map((color) => (
                    <div key={color} className="flex items-center">
                      <Checkbox
                        id={`color-${color}`}
                        checked={activeFilters.colors.includes(color)}
                        onCheckedChange={() => handleColorToggle(color)}
                        className="border-candy-navy text-candy-orange"
                      />
                      <label
                        htmlFor={`color-${color}`}
                        className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-candy-navy"
                      >
                        {color}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="bg-candy-navy/20" />

              {/* Size Filter */}
              <div>
                <h3 className="font-display text-candy-navy mb-3">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {filterOptions.sizes.map((size) => (
                    <Button
                      key={size}
                      variant={activeFilters.sizes.includes(size) ? "default" : "outline"}
                      className={`w-12 h-10 rounded-lg ${
                        activeFilters.sizes.includes(size)
                          ? "bg-candy-orange text-white"
                          : "border-candy-navy text-candy-navy"
                      }`}
                      onClick={() => handleSizeToggle(size)}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>

              <Separator className="bg-candy-navy/20" />

              {/* Price Range Filter */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-display text-candy-navy">Price</h3>
                  <div className="text-sm text-candy-navy">
                    ${activeFilters.priceRange[0]} - ${activeFilters.priceRange[1]}
                  </div>
                </div>
                <Slider
                  defaultValue={[0, 200]}
                  value={activeFilters.priceRange}
                  min={0}
                  max={200}
                  step={5}
                  onValueChange={handlePriceChange}
                  className="mb-6"
                />
              </div>

              <Button
                variant="outline"
                onClick={clearFilters}
                className="w-full border-candy-navy text-candy-navy"
                disabled={activeFilterCount === 0}
              >
                Clear All Filters
              </Button>
            </div>

            {/* Product grid */}
            <div className="col-span-12 md:col-span-9">
              {sortedProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedProducts.map((product) => (
                    <Link href={`/products/${product.id}`} key={product.id} className="group">
                      <div className="card-retro overflow-hidden bg-white">
                        <div className="relative aspect-square overflow-hidden">
                          <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                          />
                          {product.isNew && <div className="absolute top-3 right-3 badge-retro">New!</div>}
                        </div>
                        <div className="p-4">
                          <div className="flex justify-between items-center">
                            <h3 className="font-display text-candy-navy">{product.name}</h3>
                            <div className="price-tag">${product.price}</div>
                          </div>
                          <p className="text-sm text-candy-navy/70 mt-1">
                            {product.colors.length} {product.colors.length === 1 ? "color" : "colors"}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center bg-white rounded-xl p-8 card-retro">
                  <SlidersHorizontal className="h-12 w-12 text-candy-navy/50 mb-4" />
                  <h3 className="text-lg font-display text-candy-navy">No products found</h3>
                  <p className="text-candy-navy/70 mt-2 mb-6">
                    Try adjusting your filters to find what you're looking for
                  </p>
                  <Button
                    onClick={clearFilters}
                    className="bg-candy-orange hover:bg-candy-orange/90 text-white rounded-full btn-retro"
                  >
                    Clear All Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

