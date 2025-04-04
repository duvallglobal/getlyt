"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, Heart, Trash2, ShoppingBag } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import RetroPattern from "@/components/retro-pattern"
import { getSupabaseBrowserClient } from "@/lib/supabase"

export default function WishlistPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [wishlistItems, setWishlistItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?redirectTo=/account/wishlist")
    }
  }, [user, loading, router])

  // Fetch wishlist items
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user) return

      try {
        const supabase = getSupabaseBrowserClient()

        const { data, error } = await supabase
          .from("wishlists")
          .select(`
            id,
            product_id,
            products (
              id,
              name,
              slug,
              price,
              status,
              inventory_quantity,
              product_images (
                url,
                alt_text
              )
            )
          `)
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })

        if (error) {
          throw error
        }

        setWishlistItems(data || [])
      } catch (error) {
        console.error("Error fetching wishlist:", error)
        toast({
          title: "Error",
          description: "Failed to load wishlist items. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      fetchWishlist()
    }
  }, [user, toast])

  const removeFromWishlist = async (wishlistId) => {
    try {
      const supabase = getSupabaseBrowserClient()

      const { error } = await supabase.from("wishlists").delete().eq("id", wishlistId)

      if (error) {
        throw error
      }

      // Update local state
      setWishlistItems(wishlistItems.filter((item) => item.id !== wishlistId))

      toast({
        title: "Item removed",
        description: "The item has been removed from your wishlist.",
      })
    } catch (error) {
      console.error("Error removing from wishlist:", error)
      toast({
        title: "Error",
        description: "Failed to remove item from wishlist. Please try again.",
        variant: "destructive",
      })
    }
  }

  const addToCart = async (productId) => {
    try {
      const supabase = getSupabaseBrowserClient()

      // Check if item already exists in cart
      const { data: existingItem, error: checkError } = await supabase
        .from("cart_items")
        .select("id, quantity")
        .eq("user_id", user.id)
        .eq("product_id", productId)
        .maybeSingle()

      if (checkError) {
        throw checkError
      }

      if (existingItem) {
        // Update quantity if already in cart
        const { error: updateError } = await supabase
          .from("cart_items")
          .update({
            quantity: existingItem.quantity + 1,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingItem.id)

        if (updateError) {
          throw updateError
        }
      } else {
        // Add new item to cart
        const { error: insertError } = await supabase.from("cart_items").insert({
          user_id: user.id,
          product_id: productId,
          quantity: 1,
        })

        if (insertError) {
          throw insertError
        }
      }

      toast({
        title: "Added to cart",
        description: "The item has been added to your cart.",
      })
    } catch (error) {
      console.error("Error adding to cart:", error)
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-candy-cream">
        <div className="animate-pulse text-candy-navy font-display text-xl">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null // Redirect will happen in useEffect
  }

  return (
    <div className="min-h-screen py-12 bg-candy-cream relative">
      <RetroPattern className="absolute inset-0 opacity-5" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link
              href="/account"
              className="text-sm flex items-center text-candy-navy/70 hover:text-candy-navy transition-colors"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Account
            </Link>
          </div>

          <div className="flex items-center gap-2 mb-8">
            <Heart className="h-5 w-5 text-candy-orange" />
            <h1 className="text-3xl font-display text-candy-navy">My Wishlist</h1>
          </div>

          {isLoading ? (
            <div className="bg-white rounded-xl p-8 text-center card-retro">
              <div className="animate-pulse text-candy-navy/50">Loading wishlist items...</div>
            </div>
          ) : wishlistItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistItems.map((item) => (
                <div key={item.id} className="bg-white rounded-xl overflow-hidden card-retro">
                  <Link href={`/products/${item.products.slug}`} className="block">
                    <div className="relative aspect-square">
                      <Image
                        src={item.products.product_images?.[0]?.url || "/placeholder.svg?height=400&width=400"}
                        alt={item.products.product_images?.[0]?.alt_text || item.products.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </Link>

                  <div className="p-4">
                    <Link href={`/products/${item.products.slug}`} className="block">
                      <h3 className="font-display text-candy-navy mb-1">{item.products.name}</h3>
                    </Link>

                    <div className="flex justify-between items-center mb-4">
                      <div className="price-tag">${item.products.price.toFixed(2)}</div>
                      <div>
                        {item.products.inventory_quantity > 0 ? (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">In Stock</span>
                        ) : (
                          <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">Out of Stock</span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        className="flex-1 bg-candy-orange hover:bg-candy-orange/90 text-white rounded-full btn-retro"
                        onClick={() => addToCart(item.products.id)}
                        disabled={item.products.inventory_quantity <= 0 || item.products.status !== "active"}
                      >
                        <ShoppingBag className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>

                      <Button
                        variant="outline"
                        className="border-red-300 text-red-500 hover:bg-red-50"
                        onClick={() => removeFromWishlist(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl p-8 text-center card-retro">
              <Heart className="h-12 w-12 text-candy-navy/30 mx-auto mb-3" />
              <h3 className="font-medium text-candy-navy mb-1">Your wishlist is empty</h3>
              <p className="text-sm text-candy-navy/70 mb-4">You haven't added any products to your wishlist yet.</p>
              <Button asChild className="bg-candy-orange hover:bg-candy-orange/90 text-white rounded-full btn-retro">
                <Link href="/products">Browse Products</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

