"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Minus, Plus, ShoppingBag, Star, Truck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import RetroPattern from "@/components/retro-pattern"

// Sample product data - in a real app this would come from an API or database
const products = [
  {
    id: "1",
    name: "Classic Heritage Tee",
    price: 85,
    description:
      "Our signature Heritage Tee combines vintage aesthetics with modern comfort. Crafted from premium 100% organic cotton with a substantial 6.5oz weight, this t-shirt offers exceptional durability while maintaining a luxuriously soft feel against the skin.",
    features: [
      "100% organic cotton (6.5oz)",
      "Garment dyed for rich, unique coloration",
      "Reinforced collar and seams",
      "Relaxed fit with slightly dropped shoulder",
      "Pre-shrunk fabric",
      "Ethically manufactured in Portugal",
    ],
    care: "Machine wash cold with similar colors. Tumble dry low. Do not bleach. Warm iron if needed.",
    colors: [
      { name: "Black", value: "black", hex: "#000000" },
      { name: "White", value: "white", hex: "#FFFFFF" },
      { name: "Vintage Blue", value: "blue", hex: "#5C7B93" },
    ],
    sizes: ["S", "M", "L", "XL"],
    images: [
      "/placeholder.svg?height=800&width=800",
      "/placeholder.svg?height=800&width=800",
      "/placeholder.svg?height=800&width=800",
      "/placeholder.svg?height=800&width=800",
    ],
    reviews: {
      average: 4.8,
      count: 124,
      breakdown: [
        { rating: 5, percentage: 85 },
        { rating: 4, percentage: 10 },
        { rating: 3, percentage: 3 },
        { rating: 2, percentage: 1 },
        { rating: 1, percentage: 1 },
      ],
    },
    relatedProducts: [2, 6, 8],
  },
  {
    id: "2",
    name: "Workwear Pocket Tee",
    price: 95,
    images: ["/placeholder.svg?height=800&width=800"],
  },
  {
    id: "6",
    name: "Vintage Wash Tee",
    price: 95,
    images: ["/placeholder.svg?height=800&width=800"],
  },
  {
    id: "8",
    name: "Heavyweight Premium Tee",
    price: 105,
    images: ["/placeholder.svg?height=800&width=800"],
  },
]

export default function ProductPage({ params }) {
  const { id } = params
  const product = products.find((p) => p.id === id) || products[0]
  const relatedProducts = product.relatedProducts?.map((id) => products.find((p) => p.id === id.toString())) || []

  const [selectedColor, setSelectedColor] = useState(product.colors[0].value)
  const [selectedSize, setSelectedSize] = useState(product.sizes[1]) // Default to M
  const [quantity, setQuantity] = useState(1)
  const [currentImage, setCurrentImage] = useState(0)
  const { toast } = useToast()

  const handleAddToCart = () => {
    toast({
      title: "Added to cart",
      description: `${quantity} × ${product.name} (${selectedSize}, ${selectedColor}) added to your cart`,
    })
  }

  const incrementQuantity = () => setQuantity((prev) => prev + 1)
  const decrementQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % product.images.length)
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + product.images.length) % product.images.length)

  const selectThumbnail = (index) => setCurrentImage(index)

  return (
    <div className="bg-candy-cream min-h-screen relative">
      <RetroPattern className="absolute inset-0 opacity-5" />

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="mb-6">
          <Link
            href="/products"
            className="text-sm flex items-center text-candy-navy/70 hover:text-candy-orange transition-colors"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to all products
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="card-retro overflow-hidden bg-white">
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={product.images[currentImage] || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-between p-4">
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-white/80 backdrop-blur-sm hover:bg-white/90 rounded-full"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-white/80 backdrop-blur-sm hover:bg-white/90 rounded-full"
                    onClick={nextImage}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2 overflow-auto pb-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  className={`relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0 border-4 ${
                    currentImage === index ? "border-candy-orange" : "border-transparent"
                  }`}
                  onClick={() => selectThumbnail(index)}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="inline-block mb-2 transform -rotate-2">
                <div className="bg-candy-blue text-white px-4 py-1 rounded-lg font-display text-sm">
                  {product.category || "Heritage Collection"}
                </div>
              </div>
              <h1 className="text-3xl md:text-5xl font-display text-candy-navy">{product.name}</h1>
              <div className="flex items-center gap-4 mt-2">
                <div className="price-tag text-xl">${product.price}</div>
                <div className="flex items-center">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.reviews?.average || 5)
                            ? "fill-candy-orange text-candy-orange"
                            : "fill-candy-cream text-candy-navy/30"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-candy-navy/70">
                    {product.reviews?.average || 5} ({product.reviews?.count || 124} reviews)
                  </span>
                </div>
              </div>
            </div>

            <p className="text-candy-navy/70">{product.description}</p>

            <Separator className="bg-candy-navy/20" />

            {/* Color Selection */}
            <div>
              <h3 className="font-display text-candy-navy mb-3">
                Color: <span className="capitalize">{selectedColor}</span>
              </h3>
              <RadioGroup value={selectedColor} onValueChange={setSelectedColor} className="flex gap-3">
                {product.colors?.map((color) => (
                  <div key={color.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={color.value} id={`color-${color.value}`} className="sr-only" />
                    <Label
                      htmlFor={`color-${color.value}`}
                      className={`h-10 w-10 rounded-full cursor-pointer flex items-center justify-center border-4 ${
                        selectedColor === color.value ? "border-candy-orange" : "border-candy-cream"
                      }`}
                      style={{ backgroundColor: color.hex }}
                    >
                      {color.value === "white" && <div className="h-7 w-7 rounded-full border border-candy-navy/20" />}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Size Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display text-candy-navy">Size: {selectedSize}</h3>
                <Button variant="link" className="p-0 h-auto text-sm text-candy-blue">
                  Size Guide
                </Button>
              </div>
              <RadioGroup value={selectedSize} onValueChange={setSelectedSize} className="flex gap-2">
                {product.sizes?.map((size) => (
                  <div key={size} className="flex items-center space-x-2">
                    <RadioGroupItem value={size} id={`size-${size}`} className="sr-only" />
                    <Label
                      htmlFor={`size-${size}`}
                      className={`h-10 min-w-[40px] px-3 rounded-md cursor-pointer flex items-center justify-center ${
                        selectedSize === size
                          ? "bg-candy-orange text-white"
                          : "bg-white border-2 border-candy-navy/30 hover:border-candy-navy/50 text-candy-navy"
                      }`}
                    >
                      {size}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <div className="flex items-center border-2 border-candy-navy/30 rounded-full overflow-hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-none text-candy-navy"
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center text-candy-navy">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-none text-candy-navy"
                  onClick={incrementQuantity}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Button
                className="flex-1 gap-2 bg-candy-orange hover:bg-candy-orange/90 text-white rounded-full btn-retro"
                onClick={handleAddToCart}
              >
                <ShoppingBag className="h-5 w-5" />
                Add to Cart
              </Button>
            </div>

            {/* Shipping Info */}
            <div className="flex items-center gap-2 text-sm text-candy-navy bg-white p-4 rounded-xl border-2 border-candy-blue/20">
              <Truck className="h-4 w-4 text-candy-blue" />
              <p>Free shipping on orders over $100</p>
            </div>

            {/* Product Details Tabs */}
            <Tabs defaultValue="details" className="pt-6">
              <TabsList className="grid grid-cols-3 w-full bg-candy-cream border-2 border-candy-navy/20">
                <TabsTrigger
                  value="details"
                  className="font-display data-[state=active]:bg-candy-orange data-[state=active]:text-white"
                >
                  Details
                </TabsTrigger>
                <TabsTrigger
                  value="care"
                  className="font-display data-[state=active]:bg-candy-orange data-[state=active]:text-white"
                >
                  Care
                </TabsTrigger>
                <TabsTrigger
                  value="reviews"
                  className="font-display data-[state=active]:bg-candy-orange data-[state=active]:text-white"
                >
                  Reviews
                </TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="pt-4">
                <h4 className="font-display text-candy-navy mb-2">Features</h4>
                <ul className="list-disc pl-5 space-y-1 text-candy-navy/70">
                  {product.features?.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </TabsContent>
              <TabsContent value="care" className="pt-4">
                <p className="text-candy-navy/70">{product.care}</p>
              </TabsContent>
              <TabsContent value="reviews" className="pt-4">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="md:w-1/3">
                    <div className="text-center md:text-left">
                      <div className="text-5xl font-display text-candy-navy">{product.reviews?.average || 5}</div>
                      <div className="flex justify-center md:justify-start mt-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i < Math.floor(product.reviews?.average || 5)
                                ? "fill-candy-orange text-candy-orange"
                                : "fill-candy-cream text-candy-navy/30"
                            }`}
                          />
                        ))}
                      </div>
                      <div className="text-sm text-candy-navy/70 mt-1">
                        Based on {product.reviews?.count || 124} reviews
                      </div>
                    </div>
                  </div>
                  <div className="md:w-2/3">
                    <div className="space-y-2">
                      {product.reviews?.breakdown.map((item) => (
                        <div key={item.rating} className="flex items-center gap-2">
                          <div className="w-12 text-sm text-right text-candy-navy">{item.rating} stars</div>
                          <div className="w-full bg-candy-cream rounded-full h-2.5">
                            <div
                              className="bg-candy-orange h-2.5 rounded-full"
                              style={{ width: `${item.percentage}%` }}
                            ></div>
                          </div>
                          <div className="w-12 text-sm text-candy-navy">{item.percentage}%</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl md:text-4xl font-display mb-6 text-candy-navy">You may also like</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <Link href={`/products/${product.id}`} key={product.id} className="group">
                  <div className="card-retro overflow-hidden bg-white mb-3">
                    <div className="relative aspect-square overflow-hidden">
                      <Image
                        src={product.images[0] || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <h3 className="font-display text-candy-navy">{product.name}</h3>
                    <div className="price-tag">${product.price}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

