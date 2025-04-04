import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"
import RetroPattern from "@/components/retro-pattern"

export default function Footer() {
  return (
    <footer className="bg-candy-navy text-white relative overflow-hidden">
      <RetroPattern className="absolute inset-0 opacity-5" />

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h2 className="text-2xl font-display text-candy-orange">LTY</h2>
            <p className="text-sm text-white/80">
              Live Your Truth - Luxury, inclusive, and boldly expressive apparel for those who embrace their authentic
              selves.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="hover:text-candy-orange transition-colors">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="hover:text-candy-orange transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="hover:text-candy-orange transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-display text-candy-orange mb-4">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products" className="hover:text-candy-orange transition-colors text-white/80">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/collections/heritage" className="hover:text-candy-orange transition-colors text-white/80">
                  Heritage Collection
                </Link>
              </li>
              <li>
                <Link
                  href="/collections/essentials"
                  className="hover:text-candy-orange transition-colors text-white/80"
                >
                  Essentials
                </Link>
              </li>
              <li>
                <Link href="/collections/new" className="hover:text-candy-orange transition-colors text-white/80">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/collections/sale" className="hover:text-candy-orange transition-colors text-white/80">
                  Sale
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-display text-candy-orange mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-candy-orange transition-colors text-white/80">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/sustainability" className="hover:text-candy-orange transition-colors text-white/80">
                  Sustainability
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-candy-orange transition-colors text-white/80">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/press" className="hover:text-candy-orange transition-colors text-white/80">
                  Press
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-display text-candy-orange mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/account" className="hover:text-candy-orange transition-colors text-white/80">
                  My Account
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-candy-orange transition-colors text-white/80">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-candy-orange transition-colors text-white/80">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-candy-orange transition-colors text-white/80">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 text-sm">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <p className="text-white/60">© {new Date().getFullYear()} LTY - Live Your Truth. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-candy-orange transition-colors text-white/60">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-candy-orange transition-colors text-white/60">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

