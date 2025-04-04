import Link from "next/link"
import Image from "next/image"

// Sample featured products
const featuredProducts = [
  {
    id: 1,
    name: "Classic Heritage Tee",
    price: 85,
    image: "/placeholder.svg?height=400&width=400",
    isNew: true,
  },
  {
    id: 4,
    name: "Luxury Pima Cotton Tee",
    price: 120,
    image: "/placeholder.svg?height=400&width=400",
    isNew: true,
  },
  {
    id: 7,
    name: "Limited Edition Artist Collab",
    price: 150,
    image: "/placeholder.svg?height=400&width=400",
    isNew: true,
  },
  {
    id: 5,
    name: "Artisanal Dyed Tee",
    price: 135,
    image: "/placeholder.svg?height=400&width=400",
  },
]

export default function FeaturedProducts() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-block mb-4 transform rotate-2">
            <div className="bg-candy-orange text-white px-4 py-1 rounded-lg font-display text-sm">Staff Picks</div>
          </div>
          <h2 className="text-3xl md:text-5xl font-display mb-4 text-candy-navy">Featured Products</h2>
          <p className="text-candy-navy/70 max-w-2xl mx-auto">
            Discover our most sought-after pieces, meticulously crafted for those who appreciate quality and style
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <Link href={`/products/${product.id}`} key={product.id} className="group">
              <div className="card-retro overflow-hidden bg-candy-cream mb-3">
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  {product.isNew && <div className="absolute top-3 right-3 badge-retro">New!</div>}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <h3 className="font-display text-candy-navy">{product.name}</h3>
                <div className="price-tag">${product.price}</div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/products"
            className="inline-block font-display text-candy-navy underline-offset-4 hover:text-candy-orange transition-colors border-b-2 border-candy-orange"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  )
}

