"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingBag,
  Settings,
  BarChart3,
  TrendingUp,
  AlertCircle,
  DollarSign,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/hooks/use-auth"
import RetroPattern from "@/components/retro-pattern"

// Sample analytics data
const analyticsData = {
  revenue: {
    total: 12580,
    change: 12.5,
    period: "vs. last month",
  },
  orders: {
    total: 356,
    change: 8.2,
    period: "vs. last month",
  },
  customers: {
    total: 2120,
    change: 14.3,
    period: "vs. last month",
  },
  averageOrder: {
    total: 95.4,
    change: -2.5,
    period: "vs. last month",
  },
}

// Sample recent orders
const recentOrders = [
  {
    id: "ORD-12345",
    customer: "John Doe",
    date: "2025-03-28",
    status: "Delivered",
    total: 180.0,
  },
  {
    id: "ORD-12344",
    customer: "Jane Smith",
    date: "2025-03-27",
    status: "Processing",
    total: 95.0,
  },
  {
    id: "ORD-12343",
    customer: "Robert Johnson",
    date: "2025-03-26",
    status: "Shipped",
    total: 135.0,
  },
  {
    id: "ORD-12342",
    customer: "Emily Davis",
    date: "2025-03-25",
    status: "Processing",
    total: 210.0,
  },
]

// Sample low stock alerts
const lowStockAlerts = [
  {
    id: 1,
    name: "Classic Heritage Tee",
    sku: "CHT-001-BLK-M",
    stock: 3,
    threshold: 5,
  },
  {
    id: 4,
    name: "Luxury Pima Cotton Tee",
    sku: "LPC-004-WHT-L",
    stock: 2,
    threshold: 5,
  },
  {
    id: 7,
    name: "Limited Edition Artist Collab",
    sku: "LEA-007-MUL-M",
    stock: 1,
    threshold: 5,
  },
]

export default function AdminDashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && (!user || !user.isAdmin)) {
      router.push("/account")
    }
  }, [user, loading, router])

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-candy-cream">
        <div className="animate-pulse text-candy-navy font-display text-xl">Loading...</div>
      </div>
    )
  }

  if (!user.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-candy-cream">
        <div className="text-center">
          <h1 className="text-2xl font-display text-candy-navy mb-4">Access Denied</h1>
          <p className="text-candy-navy/70 mb-6">You don't have permission to access this page.</p>
          <Button asChild className="bg-candy-orange hover:bg-candy-orange/90 text-white rounded-full btn-retro">
            <Link href="/account">Return to Account</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 bg-candy-cream relative">
      <RetroPattern className="absolute inset-0 opacity-5" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="md:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl p-4 shadow-sm sticky top-24 card-retro">
              <div className="font-display text-xl text-candy-navy mb-6">Admin Panel</div>

              <nav className="space-y-1">
                {[
                  { icon: <LayoutDashboard className="h-4 w-4" />, label: "Dashboard", href: "/admin", active: true },
                  { icon: <Package className="h-4 w-4" />, label: "Products", href: "/admin/products" },
                  { icon: <ShoppingBag className="h-4 w-4" />, label: "Orders", href: "/admin/orders" },
                  { icon: <Users className="h-4 w-4" />, label: "Customers", href: "/admin/customers" },
                  { icon: <BarChart3 className="h-4 w-4" />, label: "Analytics", href: "/admin/analytics" },
                  { icon: <Settings className="h-4 w-4" />, label: "Settings", href: "/admin/settings" },
                ].map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm ${
                      item.active ? "bg-candy-orange text-white" : "text-candy-navy hover:bg-candy-navy/5"
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="mt-8 pt-4 border-t border-candy-navy/10">
                <Button asChild variant="outline" className="w-full border-candy-navy/30 text-candy-navy">
                  <Link href="/account">Back to Account</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <h1 className="text-3xl font-display text-candy-navy mb-6">Dashboard</h1>

            {/* Analytics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                {
                  title: "Total Revenue",
                  value: `$${analyticsData.revenue.total.toLocaleString()}`,
                  change: analyticsData.revenue.change,
                  icon: <DollarSign className="h-5 w-5 text-green-600" />,
                  period: analyticsData.revenue.period,
                },
                {
                  title: "Orders",
                  value: analyticsData.orders.total,
                  change: analyticsData.orders.change,
                  icon: <ShoppingBag className="h-5 w-5 text-blue-600" />,
                  period: analyticsData.orders.period,
                },
                {
                  title: "Customers",
                  value: analyticsData.customers.total,
                  change: analyticsData.customers.change,
                  icon: <Users className="h-5 w-5 text-purple-600" />,
                  period: analyticsData.customers.period,
                },
                {
                  title: "Average Order",
                  value: `$${analyticsData.averageOrder.total.toFixed(2)}`,
                  change: analyticsData.averageOrder.change,
                  icon: <BarChart3 className="h-5 w-5 text-orange-600" />,
                  period: analyticsData.averageOrder.period,
                },
              ].map((card, index) => (
                <Card key={index} className="card-retro border-0">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="font-medium text-sm text-candy-navy/70">{card.title}</div>
                      <div className="bg-candy-cream rounded-full p-2">{card.icon}</div>
                    </div>
                    <div className="text-2xl font-display text-candy-navy mb-2">{card.value}</div>
                    <div className="flex items-center text-xs">
                      <div className={`flex items-center ${card.change >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {card.change >= 0 ? (
                          <TrendingUp className="h-3 w-3 mr-1" />
                        ) : (
                          <TrendingUp className="h-3 w-3 mr-1 transform rotate-180" />
                        )}
                        <span>{Math.abs(card.change)}%</span>
                      </div>
                      <span className="text-candy-navy/50 ml-2">{card.period}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Tabs for Recent Orders and Alerts */}
            <Tabs defaultValue="orders" className="mb-8">
              <TabsList className="bg-white border-2 border-candy-navy/10 p-1 rounded-xl">
                <TabsTrigger
                  value="orders"
                  className="rounded-lg data-[state=active]:bg-candy-orange data-[state=active]:text-white"
                >
                  Recent Orders
                </TabsTrigger>
                <TabsTrigger
                  value="alerts"
                  className="rounded-lg data-[state=active]:bg-candy-orange data-[state=active]:text-white"
                >
                  Inventory Alerts
                </TabsTrigger>
              </TabsList>

              <TabsContent value="orders" className="mt-4">
                <Card className="card-retro border-0">
                  <CardHeader className="border-b border-candy-navy/10">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-candy-navy">Recent Orders</CardTitle>
                      <Button asChild variant="link" className="p-0 h-auto text-candy-blue">
                        <Link href="/admin/orders">View All</Link>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y divide-candy-navy/10">
                      {recentOrders.map((order) => (
                        <div key={order.id} className="p-4">
                          <div className="flex flex-col sm:flex-row justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-2">
                                <ShoppingBag className="h-4 w-4 text-candy-orange" />
                                <span className="font-medium">{order.id}</span>
                              </div>
                              <div className="flex items-center gap-2 mt-1 text-sm text-candy-navy/70">
                                <span>{order.customer}</span>
                                <span>•</span>
                                <span>{new Date(order.date).toLocaleDateString()}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">${order.total.toFixed(2)}</div>
                              <div className="text-sm">
                                <span
                                  className={`inline-block px-2 py-0.5 rounded-full text-xs ${
                                    order.status === "Delivered"
                                      ? "bg-green-100 text-green-800"
                                      : order.status === "Processing"
                                        ? "bg-blue-100 text-blue-800"
                                        : "bg-purple-100 text-purple-800"
                                  }`}
                                >
                                  {order.status}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="alerts" className="mt-4">
                <Card className="card-retro border-0">
                  <CardHeader className="border-b border-candy-navy/10">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-candy-navy">Low Stock Alerts</CardTitle>
                      <Button asChild variant="link" className="p-0 h-auto text-candy-blue">
                        <Link href="/admin/products">Manage Inventory</Link>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y divide-candy-navy/10">
                      {lowStockAlerts.map((item) => (
                        <div key={item.id} className="p-4">
                          <div className="flex flex-col sm:flex-row justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-2">
                                <AlertCircle className="h-4 w-4 text-red-500" />
                                <span className="font-medium">{item.name}</span>
                              </div>
                              <div className="text-sm text-candy-navy/70 mt-1">SKU: {item.sku}</div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium text-red-500">{item.stock} left in stock</div>
                              <div className="text-xs text-candy-navy/70">Threshold: {item.threshold}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Quick Actions */}
            <Card className="card-retro border-0">
              <CardHeader>
                <CardTitle className="text-candy-navy">Quick Actions</CardTitle>
                <CardDescription>Common tasks you can perform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { label: "Add New Product", href: "/admin/products/new", icon: <Package className="h-5 w-5" /> },
                    { label: "Process Orders", href: "/admin/orders", icon: <ShoppingBag className="h-5 w-5" /> },
                    { label: "View Analytics", href: "/admin/analytics", icon: <BarChart3 className="h-5 w-5" /> },
                  ].map((action, index) => (
                    <Button
                      key={index}
                      asChild
                      variant="outline"
                      className="h-auto py-4 border-candy-navy/30 hover:bg-candy-navy/5"
                    >
                      <Link href={action.href} className="flex flex-col items-center gap-2">
                        <div className="bg-candy-cream rounded-full p-2">{action.icon}</div>
                        <span>{action.label}</span>
                      </Link>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

