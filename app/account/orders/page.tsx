"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ChevronLeft, Search, ShoppingBag, Clock, Filter } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/hooks/use-auth"
import RetroPattern from "@/components/retro-pattern"
import { getSupabaseBrowserClient } from "@/lib/supabase"

export default function OrdersPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?redirectTo=/account/orders")
    }
  }, [user, loading, router])

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
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
              quantity,
              price
            )
          `)
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })

        if (error) {
          throw error
        }

        setOrders(data || [])
      } catch (error) {
        console.error("Error fetching orders:", error)
      } finally {
        setOrdersLoading(false)
      }
    }

    if (user) {
      fetchOrders()
    }
  }, [user])

  // Filter orders based on search query and status filter
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.order_items.some((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesStatus = statusFilter === "all" || order.status.toLowerCase() === statusFilter.toLowerCase()

    return matchesSearch && matchesStatus
  })

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

          <h1 className="text-3xl font-display text-candy-navy mb-8">Order History</h1>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-candy-navy/50" />
              <Input
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 input-retro"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px] border-candy-navy/30">
                <div className="flex items-center">
                  <Filter className="h-4 w-4 mr-2 text-candy-navy/70" />
                  <SelectValue placeholder="Filter by status" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Orders List */}
          {ordersLoading ? (
            <div className="p-8 text-center bg-white rounded-xl card-retro">
              <div className="animate-pulse text-candy-navy/50">Loading orders...</div>
            </div>
          ) : filteredOrders.length > 0 ? (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div key={order.id} className="bg-white rounded-xl p-4 shadow-sm card-retro">
                  <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <ShoppingBag className="h-4 w-4 text-candy-orange" />
                        <span className="font-medium">{order.order_number}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-sm text-candy-navy/70">
                        <Clock className="h-3 w-3" />
                        <span>{new Date(order.created_at).toLocaleDateString()}</span>
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
                                  : order.status === "cancelled"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-candy-navy/10 pt-4 mt-4">
                    <h3 className="text-sm font-medium text-candy-navy mb-2">Items</h3>
                    <ul className="space-y-2">
                      {order.order_items.map((item) => (
                        <li key={item.id} className="text-sm flex justify-between">
                          <span>
                            {item.quantity}x {item.name}
                          </span>
                          <span className="text-candy-navy/70">${item.price.toFixed(2)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <Button asChild variant="outline" className="border-candy-navy/30 text-candy-navy">
                      <Link href={`/account/orders/${order.id}`}>View Details</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl p-8 text-center card-retro">
              <ShoppingBag className="h-12 w-12 text-candy-navy/30 mx-auto mb-3" />
              <h3 className="font-medium text-candy-navy mb-1">No orders found</h3>
              <p className="text-sm text-candy-navy/70 mb-4">
                {searchQuery || statusFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : "You haven't placed any orders yet"}
              </p>
              {searchQuery || statusFilter !== "all" ? (
                <Button
                  variant="outline"
                  className="border-candy-navy/30 text-candy-navy"
                  onClick={() => {
                    setSearchQuery("")
                    setStatusFilter("all")
                  }}
                >
                  Clear Filters
                </Button>
              ) : (
                <Button asChild className="bg-candy-orange hover:bg-candy-orange/90 text-white rounded-full btn-retro">
                  <Link href="/products">Start Shopping</Link>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

