"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, Search, ShoppingBag, User, X, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/hooks/use-auth"

// Sample navigation items
const navItems = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/products" },
  { name: "Collections", href: "/collections" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
]

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { user, signOut } = useAuth()
  const router = useRouter()
  const cartItemCount = 3 // This would come from your cart state

  const handleSignOut = () => {
    signOut()
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-candy-orange/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden text-candy-navy">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px] bg-candy-cream border-r-4 border-candy-orange">
              <div className="font-display text-2xl text-candy-navy mb-8">LTY</div>
              <nav className="flex flex-col gap-4 mt-8">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-lg font-display px-2 py-1 rounded-md hover:bg-candy-orange/10 transition-colors text-candy-navy"
                  >
                    {item.name}
                  </Link>
                ))}
                {user && (
                  <>
                    <Link
                      href="/account"
                      className="text-lg font-display px-2 py-1 rounded-md hover:bg-candy-orange/10 transition-colors text-candy-navy"
                    >
                      My Account
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="text-lg font-display px-2 py-1 rounded-md hover:bg-candy-orange/10 transition-colors text-candy-navy text-left"
                    >
                      Sign Out
                    </button>
                  </>
                )}
                {!user && (
                  <Link
                    href="/login"
                    className="text-lg font-display px-2 py-1 rounded-md hover:bg-candy-orange/10 transition-colors text-candy-navy"
                  >
                    Sign In
                  </Link>
                )}
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="text-2xl font-display text-candy-navy">
            LTY
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium hover:text-candy-orange transition-colors text-candy-navy"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              {isSearchOpen ? (
                <div className="absolute right-0 top-0 w-screen max-w-xs">
                  <div className="flex items-center border-2 border-candy-orange rounded-full bg-white overflow-hidden">
                    <Input
                      type="search"
                      placeholder="Search products..."
                      className="border-0 focus-visible:ring-0"
                      autoFocus
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsSearchOpen(false)}
                      className="text-candy-navy"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)} className="text-candy-navy">
                  <Search className="h-5 w-5" />
                  <span className="sr-only">Search</span>
                </Button>
              )}
            </div>

            {/* Account */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-candy-navy relative">
                    <User className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 h-3 w-3 bg-candy-orange rounded-full border-2 border-white"></span>
                    <span className="sr-only">Account</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="font-normal text-xs text-muted-foreground">Signed in as</div>
                    <div className="truncate">{user.email}</div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/account">My Account</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/account/orders">Order History</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/account/wishlist">Wishlist</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/account/addresses">Addresses</Link>
                  </DropdownMenuItem>
                  {user.isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/admin">Admin Dashboard</Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-500">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" size="icon" asChild className="text-candy-navy">
                <Link href="/login">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Sign in</span>
                </Link>
              </Button>
            )}

            {/* Cart */}
            <Button variant="ghost" size="icon" className="relative text-candy-navy" asChild>
              <Link href="/cart">
                <ShoppingBag className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-candy-orange text-white">
                    {cartItemCount}
                  </Badge>
                )}
                <span className="sr-only">Cart</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

