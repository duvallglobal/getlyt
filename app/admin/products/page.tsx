"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Search, Filter, Plus, Edit, Trash2, MoreHorizontal, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import RetroPattern from "@/components/retro-pattern"

// Sample products data
const products = [
  {
    id: 1,
    name: "Classic Heritage Tee",
    price: 85,
    category: "Heritage",
    stock: 24,
    status: "Active",
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    id: 2,
    name: "Workwear Pocket Tee",
    price: 95,
    category: "Workwear",
    stock: 18,
    status: "Active",
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    id: 3,
    name: "1950s Graphic Tee",
    price: 110,
    category: "Graphic",
    stock: 12,
    status: "Active",
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    id: 4,
    name: "Luxury Pima Cotton Tee",
    price: 120,
    category: "Essentials",
    stock: 3,
    status: "Low Stock",
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    id: 5,
    name: "Artisanal Dyed Tee",
    price: 135,
    category: "Artisanal",
    stock: 8,
    status: "Active",
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    id: 6,
    name: "Vintage Wash Tee",
    price: 95,
    category: "Heritage",
    stock: 15,
    status: "Active",
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    id: 7,
    name: "Limited Edition Artist Collab",
    price: 150,
    category: "Collaborations",
    stock: 2,
    status: "Low Stock",
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    id: 8,
    name: "Heavyweight Premium Tee",
    price: 105,
    category: "Essentials",
    stock: 0,
    status: "Out of Stock",
    image: "/placeholder.svg?height=400&width=400",
  },
]

export default function AdminProductsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortField, setSortField] = useState("name")
  const [sortDirection, setSortDirection] = useState("asc")

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

  // Handle sort toggle
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Filter and sort products
  const filteredProducts = products
    .filter((product) => {
      // Search filter
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())

      // Category filter
      const matchesCategory = categoryFilter === "all" || product.category === categoryFilter

      // Status filter
      const matchesStatus = statusFilter === "all" || product.status.toLowerCase().includes(statusFilter.toLowerCase())

      return matchesSearch && matchesCategory && matchesStatus
    })
    .sort((a, b) => {
      // Sort by selected field
      if (sortField === "name") {
        return sortDirection === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
      } else if (sortField === "price") {
        return sortDirection === "asc" ? a.price - b.price : b.price - a.price
      } else if (sortField === "stock") {
        return sortDirection === "asc" ? a.stock - b.stock : b.stock - a.stock
      }
      return 0
    })

  // Handle product deletion
  const handleDeleteProduct = (productId) => {
    // In a real app, this would make an API call to delete the product
    toast({
      title: "Product deleted",
      description: "The product has been successfully deleted.",
    })
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
                  { icon: <LayoutDashboard className="h-4 w-4" />, label: "Dashboard", href: "/admin" },
                  { icon: <Package className="h-4 w-4" />, label: "Products", href: "/admin/products", active: true },
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
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <h1 className="text-3xl font-display text-candy-navy">Products</h1>

              <Button asChild className="bg-candy-orange hover:bg-candy-orange/90 text-white rounded-full btn-retro">
                <Link href="/admin/products/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Product
                </Link>
              </Button>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-candy-navy/50" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 input-retro"
                />
              </div>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="border-candy-navy/30">
                  <div className="flex items-center">
                    <Filter className="h-4 w-4 mr-2 text-candy-navy/70" />
                    <SelectValue placeholder="Filter by category" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Heritage">Heritage</SelectItem>
                  <SelectItem value="Workwear">Workwear</SelectItem>
                  <SelectItem value="Graphic">Graphic</SelectItem>
                  <SelectItem value="Essentials">Essentials</SelectItem>
                  <SelectItem value="Artisanal">Artisanal</SelectItem>
                  <SelectItem value="Collaborations">Collaborations</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="border-candy-navy/30">
                  <div className="flex items-center">
                    <Filter className="h-4 w-4 mr-2 text-candy-navy/70" />
                    <SelectValue placeholder="Filter by status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="low">Low Stock</SelectItem>
                  <SelectItem value="out">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-xl overflow-hidden shadow-sm card-retro">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-candy-cream border-b border-candy-navy/10">
                      <th className="px-4 py-3 text-left text-xs font-medium text-candy-navy uppercase tracking-wider w-12">
                        Image
                      </th>
                      <th
                        className="px-4 py-3 text-left text-xs font-medium text-candy-navy uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort("name")}
                      >
                        <div className="flex items-center">
                          Product Name
                          {sortField === "name" ? (
                            sortDirection === "asc" ? (
                              <ArrowUp className="h-3 w-3 ml-1" />
                            ) : (
                              <ArrowDown className="h-3 w-3 ml-1" />
                            )
                          ) : (
                            <ArrowUpDown className="h-3 w-3 ml-1" />
                          )}
                        </div>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-candy-navy uppercase tracking-wider">
                        Category
                      </th>
                      <th
                        className="px-4 py-3 text-left text-xs font-medium text-candy-navy uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort("price")}
                      >
                        <div className="flex items-center">
                          Price
                          {sortField === "price" ? (
                            sortDirection === "asc" ? (
                              <ArrowUp className="h-3 w-3 ml-1" />
                            ) : (
                              <ArrowDown className="h-3 w-3 ml-1" />
                            )
                          ) : (
                            <ArrowUpDown className="h-3 w-3 ml-1" />
                          )}
                        </div>
                      </th>
                      <th
                        className="px-4 py-3 text-left text-xs font-medium text-candy-navy uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort("stock")}
                      >
                        <div className="flex items-center">
                          Stock
                          {sortField === "stock" ? (
                            sortDirection === "asc" ? (
                              <ArrowUp className="h-3 w-3 ml-1" />
                            ) : (
                              <ArrowDown className="h-3 w-3 ml-1" />
                            )
                          ) : (
                            <ArrowUpDown className="h-3 w-3 ml-1" />
                          )}
                        </div>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-candy-navy uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-candy-navy uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-candy-navy/10">
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-candy-cream/50">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="w-10 h-10 rounded-md overflow-hidden bg-candy-cream">
                            <Image
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                              width={40}
                              height={40}
                              className="object-cover w-full h-full"
                            />
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="font-medium text-candy-navy">{product.name}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-candy-navy/70">{product.category}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">${product.price.toFixed(2)}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">{product.stock}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-xs ${
                              product.status === "Active"
                                ? "bg-green-100 text-green-800"
                                : product.status === "Low Stock"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }`}
                          >
                            {product.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/admin/products/${product.id}`} className="flex items-center">
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-500 focus:text-red-500"
                                onClick={() => handleDeleteProduct(product.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredProducts.length === 0 && (
                <div className="p-8 text-center">
                  <Package className="h-12 w-12 text-candy-navy/30 mx-auto mb-3" />
                  <h3 className="font-medium text-candy-navy mb-1">No products found</h3>
                  <p className="text-sm text-candy-navy/70 mb-4">Try adjusting your search or filters</p>
                  <Button
                    variant="outline"
                    className="border-candy-navy/30 text-candy-navy"
                    onClick={() => {
                      setSearchQuery("")
                      setCategoryFilter("all")
                      setStatusFilter("all")
                    }}
                  >
                    Clear Filters
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

