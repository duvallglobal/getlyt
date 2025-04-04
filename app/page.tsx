import Link from "next/link"
import Image from "next/image"
import { ChevronRight, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import FeaturedProducts from "@/components/featured-products"
import NewsletterSignup from "@/components/newsletter-signup"
import RetroPattern from "@/components/retro-pattern"
import SocialFeed from "@/components/social-feed"
import LimitedDrops from "@/components/limited-drops"
import MakeYourMark from "@/components/make-your-mark"
import JoinCommunity from "@/components/join-community"
import EmailCapturePopup from "@/components/email-capture-popup"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full h-[90vh] flex items-center justify-center overflow-hidden bg-candy-cream">
        <RetroPattern className="absolute inset-0 opacity-10" />
        <div className="absolute inset-0 z-0">
          <Image
            src="/placeholder.svg?height=1080&width=1920"
            alt="Hero background"
            fill
            className="object-cover brightness-90"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-candy-navy/40 to-transparent" />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="inline-block mb-6 transform -rotate-2">
            <div className="bg-candy-orange text-white px-6 py-2 rounded-lg font-display text-lg">Since 1968</div>
          </div>

          <h1 className="text-5xl md:text-7xl font-display text-white mb-6 drop-shadow-lg">Sweet Threads</h1>

          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto drop-shadow-md">
            Premium quality t-shirts that blend nostalgic designs with modern craftsmanship
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="text-base bg-candy-orange hover:bg-candy-orange/90 text-white rounded-full px-8 btn-retro"
            >
              <Link href="/products">Shop Collection</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="text-base bg-white/10 backdrop-blur-sm text-white border-white/20 hover:bg-white/20 rounded-full px-8"
            >
              <Link href="/about">Our Story</Link>
            </Button>
          </div>
        </div>

        {/* Wavy divider */}
        <div className="absolute bottom-0 left-0 right-0 wavy-divider" />
      </section>

      {/* Limited Edition Drops - NEW SECTION */}
      <LimitedDrops />

      {/* Brand Values */}
      <section className="py-16 md:py-24 bg-candy-cream relative overflow-hidden">
        <div className="absolute inset-0 bg-polka-dots" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block mb-4 transform rotate-2">
              <div className="bg-candy-blue text-white px-4 py-1 rounded-lg font-display text-sm">Our Promise</div>
            </div>
            <h2 className="text-3xl md:text-5xl font-display mb-4 text-candy-navy">Crafted with Purpose</h2>
            <p className="text-candy-navy/70 max-w-2xl mx-auto">
              Every stitch tells a story of quality, sustainability, and timeless style
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Premium Materials",
                description:
                  "Ethically sourced organic cotton and sustainable fabrics for unmatched comfort and durability",
              },
              {
                title: "Artisanal Craftsmanship",
                description: "Handcrafted by skilled artisans with decades of experience in textile excellence",
              },
              {
                title: "Timeless Design",
                description:
                  "Vintage-inspired aesthetics reimagined for the modern wardrobe with meticulous attention to detail",
              },
            ].map((value, i) => (
              <div key={i} className="card-retro bg-white p-8 flex flex-col items-center text-center">
                <div
                  className="w-16 h-16 rounded-full bg-candy-orange flex items-center justify-center mb-6 animate-float"
                  style={{ animationDelay: `${i * 0.2}s` }}
                >
                  <span className="text-2xl font-display text-white">{i + 1}</span>
                </div>
                <h3 className="text-xl font-display mb-3 text-candy-navy">{value.title}</h3>
                <p className="text-candy-navy/70">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Make Your Mark Campaign - NEW SECTION */}
      <MakeYourMark />

      {/* Featured Products */}
      <FeaturedProducts />

      {/* Social Media Feed - NEW SECTION */}
      <SocialFeed />

      {/* Collection Preview */}
      <section className="py-16 md:py-24 bg-candy-cream relative overflow-hidden">
        <div className="absolute inset-0 bg-polka-dots" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="order-2 lg:order-1">
              <div className="inline-block mb-4 transform -rotate-2">
                <div className="bg-candy-blue text-white px-4 py-1 rounded-lg font-display text-sm">New Collection</div>
              </div>
              <h2 className="text-3xl md:text-5xl font-display mb-4 text-candy-navy">The Heritage Collection</h2>
              <p className="text-candy-navy/70 mb-6">
                Inspired by the golden era of American workwear, our Heritage Collection combines rugged durability with
                sophisticated style. Each piece is garment-dyed and stone-washed for that perfectly lived-in feel from
                the first wear.
              </p>
              <Button
                asChild
                className="group bg-candy-orange hover:bg-candy-orange/90 text-white rounded-full px-6 btn-retro"
              >
                <Link href="/collections/heritage" className="flex items-center">
                  Explore Collection
                  <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
            <div className="order-1 lg:order-2 relative">
              <div className="card-retro aspect-square overflow-hidden">
                <Image
                  src="/placeholder.svg?height=800&width=800"
                  alt="Heritage Collection"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-candy-orange text-white p-4 rounded-full shadow-lg transform rotate-12 font-display">
                <Star className="h-8 w-8" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Join Community - NEW SECTION */}
      <JoinCommunity />

      {/* Newsletter */}
      <NewsletterSignup />

      {/* Email Capture Popup - NEW COMPONENT */}
      <EmailCapturePopup />
    </div>
  )
}

