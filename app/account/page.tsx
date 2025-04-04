"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Package, Heart, MapPin, CreditCard, Settings, LogOut, ShoppingBag, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import RetroPattern from "@/components/retro-pattern"
import { getSupabaseBrowserClient } from "@/lib/supabase"

// Account menu items
const accountMenuItems = [
  {
    icon: <Package className="h-5 w-5" />,
    title: "Orders",
    description: "View your order history",
    href: "/account/orders",
  },
  {
    icon: <Heart className="h-5 w-5" />,
    title: "Wishlist",
    description: "Products you've saved",
    href: "/account/wishlist",
  },
  {
    icon: <MapPin className="h-5 w-5" />,
    title: "Addresses",
    description: "Manage your addresses",
    href: "/account/addresses",
  },
  {
    icon: <CreditCard className="h-5 w-5" />,
    title: "Payment Methods",
    description: "Manage your payment options",
    href: "/account/payment",
  },
  {
    icon: <Settings className="h-5 w-5" />,
    title: "Account Settings",
    description: "Update your profile details",
    href: "/account/settings",
  },
]

export default function AccountPage() {
  const { user, profile, loading, signOut } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [recentOrders, setRecentOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?redirectTo=/account")
    }
  }, [user, loading, router])

  // Fetch recent orders
  useEffect(() => {
    const fetchRecentOrders = async () => {
      if (!user) return

      try {
        const supabase = getSupabaseBrowserClient()
        const { data, error } = await supabase
          .from("orders")
          .select(`
            id,
            order_number,
            status,
            total,
            created_at,
            order_items (
              id,
              name,
              quantity
            )
          `)
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(3)

        if (error) {
          throw error
        }

        setRecentOrders(data || [])
      } catch (error) {
        console.error("Error fetching recent orders:", error)
      } finally {
        setOrdersLoading(false)
      }
    }

    if (user) {
      fetchRecentOrders()
    }
  }, [user])

  const handleSignOut = async () => {
    await signOut()
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    })
    router.push("/")
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
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-display text-candy-navy">My Account</h1>
              <p className="text-candy-navy/70">Welcome back, {profile?.first_name || user.email.split("@")[0]}</p>
            </div>

            <Button
              variant="outline"
              className="border-candy-navy text-candy-navy hover:bg-candy-navy/5"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>

          {/* Recent Orders */}
          <Card className="mb-8 card-retro">
            <div className="border-b border-candy-navy/10 p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-display text-candy-navy">Recent Orders</h2>
                <Link href="/account/orders" className="text-sm text-candy-blue hover:underline">
                  View all
                </Link>
              </div>
            </div>
            <CardContent className="p-0">
              {ordersLoading ? (
                <div className="p-8 text-center">
                  <div className="animate-pulse text-candy-navy/50">Loading orders...</div>
                </div>
              ) : recentOrders.length > 0 ? (
                <div className="divide-y divide-candy-navy/10">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="p-4">
                      <div className="flex flex-col sm:flex-row justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <ShoppingBag className="h-4 w-4 text-candy-orange" />
                            <span className="font-medium">{order.order_number}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-sm text-candy-navy/70">
                            <Clock className="h-3 w-3" />
                            <span>{new Date(order.created_at).toLocaleDateString()}</span>
                          </div>
                          <div className="text-sm text-candy-navy/70 mt-1">
                            {order.order_items.length} {order.order_items.length === 1 ? "item" : "items"}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">${order.total.toFixed(2)}</div>
                          <div className="text-sm">
                            <span
                              className={`inline-block px-2 py-0.5 rounded-full text-xs ${
                                order.status === "delivered"
                                  ? "bg-green-100 text-green-800"
                                  : order.status === "processing"
                                    ? "bg-blue-100 text-blue-800"
                                    : order.status === "shipped"
                                      ? "bg-purple-100 text-purple-800"
                                      : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-2">
                        <Button asChild variant="link" className="h-auto p-0 text-candy-blue">
                          <Link href={`/account/orders/${order.id}`}>View Order Details</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <ShoppingBag className="h-12 w-12 text-candy-navy/30 mx-auto mb-3" />
                  <h3 className="font-medium text-candy-navy mb-1">No orders yet</h3>
                  <p className="text-sm text-candy-navy/70 mb-4">You haven't placed any orders yet.</p>
                  <Button
                    asChild
                    className="bg-candy-orange hover:bg-candy-orange/90 text-white rounded-full btn-retro"
                  >
                    <Link href="/products">Start Shopping</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Account Menu */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {accountMenuItems.map((item, index) => (
              <Link key={index} href={item.href} className="block group">
                <Card className="h-full transition-all duration-300 hover:shadow-md card-retro border-0">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="bg-candy-cream rounded-full p-3 group-hover:bg-candy-orange/10 transition-colors">
                      <div className="text-candy-navy group-hover:text-candy-orange transition-colors">{item.icon}</div>
                    </div>
                    <div>
                      <h3 className="font-medium text-candy-navy">{item.title}</h3>
                      <p className="text-sm text-candy-navy/70">{item.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}

            {/* Sign Out Card */}
            <Card
              className="h-full transition-all duration-300 hover:shadow-md card-retro border-0 cursor-pointer"
              onClick={handleSignOut}
            >
              <CardContent className="p-6 flex items-center gap-4">
                <div className="bg-candy-cream rounded-full p-3 hover:bg-red-50 transition-colors">
                  <LogOut className="h-5 w-5 text-candy-navy hover:text-red-500 transition-colors" />
                </div>
                <div>
                  <h3 className="font-medium text-candy-navy">Sign Out</h3>
                  <p className="text-sm text-candy-navy/70">Log out of your account</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Admin Dashboard Link */}
          {profile?.is_admin && (
            <div className="mt-8 p-4 bg-candy-navy/5 rounded-lg border border-candy-navy/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-candy-navy rounded-full p-2">
                    <Settings className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-candy-navy">Admin Access</h3>
                    <p className="text-sm text-candy-navy/70">You have administrator privileges</p>
                  </div>
                </div>
                <Button asChild className="bg-candy-navy hover:bg-candy-navy/90 text-white">
                  <Link href="/admin">Admin Dashboard</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

