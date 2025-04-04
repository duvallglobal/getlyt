"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ChevronLeft, Save, Trash2, Plus, ImageIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import RetroPattern from "@/components/retro-pattern"
import { getSupabaseBrowserClient } from "@/lib/supabase"

export default function NewProductPage() {
  const { user, profile, loading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [categories, setCategories] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Product form state
  const [productData, setProductData] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    compare_at_price: "",
    cost_price: "",
    sku: "",
    inventory_quantity: "0",
    inventory_threshold: "5",
    category_id: "",
    status: "draft",
    is_featured: false,
    is_new: true,
    weight: "",
    dimensions: "",
  })
  
  // Images state
  const [images, setImages] = useState([
    { file: null, preview: null, alt_text: "" }
  ])
  
  useEffect(() => {
    if (!loading && (!user || !profile?.is_admin)) {
      router.push("/account")
    }
  }, [user, profile, loading, router])
  
  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const supabase = getSupabaseBrowserClient()
        const { data, error } = await supabase
          .from('categories')
          .select('id, name')
          .order('name')
        
        if (error) {
          throw error
        }
        
        setCategories(data || [])
      } catch (error) {
        console.error('Error fetching categories:', error)
        toast({
          title: "Error",
          description: "Failed to load categories. Please try again.",
          variant: "destructive",
        })
      }
    }
    
    if (user && profile?.is_admin) {
      fetchCategories()
    }
  }, [user, profile, toast])
  
  // Generate slug from name
  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }
  
  const handleNameChange = (e) => {
    const { value } = e.target
    setProductData({
      ...productData,
      name: value,
      slug: generateSlug(value)
    })
  }
  
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProductData({
      ...productData,
      [name]: value
    })
  }
  
  const handleSwitchChange = (name, checked) => {
    setProductData({
      ...productData,
      [name]: checked
    })
  }
  
  const handleImageChange = (index, e) => {
    const file = e.target.files[0]
    if (!file) return
    
    const newImages = [...images]
    newImages[index] = {
      ...newImages[index],
      file,
      preview: URL.createObjectURL(file)
    }
    setImages(newImages)
  }
  
  const handleImageAltChange = (index, value) => {
    const newImages = [...images]
    newImages[index] = {
      ...newImages[index],
      alt_text: value
    }
    setImages(newImages)
  }
  
  const addImageField = () => {
    setImages([...images, { file: null, preview: null, alt_text: "" }])
  }
  
  const removeImageField = (index) => {
    if (images.length === 1) return
    
    const newImages = [...images]
    if (newImages[index].preview) {
      URL.revokeObjectURL(newImages[index].preview)
    }
    newImages.splice(index, 1)
    setImages(newImages)
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const supabase = getSupabaseBrowserClient()
      
      // Validate required fields
      if (!productData.name || !productData.price) {
        toast({
          title: "Missing required fields",
          description: "Please fill in all required fields.",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }
      
      // Convert numeric fields
      const productPayload = {
        ...productData,
        price: Number.parseFloat(productData.price),
        compare_at_price: productData.compare_at_price ? Number.parseFloat(productData.compare_at_price) : null,
        cost_price: productData.cost_price ? Number.parseFloat(productData.cost_price) : null,
        inventory_quantity: Number.parseInt(productData.inventory_quantity, 10),
        inventory_threshold: Number.parseInt(productData.inventory_threshold, 10),
        weight: productData.weight ? Number.parseFloat(productData.weight) : null,
        category_id: productData.category_id || null,
      }
      
      // Insert product
      const { data: product, error: productError } = await supabase
        .from('products')
        .insert(productPayload)
        .select()
        .single()
      
      if (productError) {
        throw productError
      }
      
      // Upload images and create image records
      const validImages = images.filter(img => img.file)
      
      if (validImages.length > 0) {
        for (let i = 0; i < validImages.length; i++) {
          const img = validImages[i]
          const fileExt = img.file.name.split('.').pop()
          const fileName = `${product.id}-${i}.${fileExt}`
          const filePath = `product-images/${fileName}`
          
          // Upload image to storage
          const { error: uploadError } = await supabase
            .storage
            .from('products')
            .upload(filePath, img.file)
          
          if (uploadError) {
            throw uploadError
          }
          
          // Get public URL
          const { data: publicURL } = supabase
            .storage
            .from('products')
            .getPublicUrl(filePath)
          
          // Create image record
          const { error: imageError } = await supabase
            .from('product_images')
            .insert({
              product_id: product.id,
              url: publicURL.publicUrl,
              alt_text: img.alt_text || product.name,
              position: i
            })
          
          if (imageError) {
            throw imageError
          }
        }
      }
      
      toast({
        title: "Product created",
        description: "The product has been successfully created.",
      })
      
      router.push('/admin/products')
    } catch (error) {
      console.error('Error creating product:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to create product. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-candy-cream">
        <div className="animate-pulse text-candy-navy font-display text-xl">Loading...</div>
      </div>
    )
  }
  
  if (!user || !profile?.is_admin) {
    return null // Redirect will happen in useEffect
  }

  return (
    <div className="min-h-screen py-8 bg-candy-cream relative">
      <RetroPattern className="absolute inset-0 opacity-5" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link
              href="/admin/products"
              className="text-sm flex items-center text-candy-navy/70 hover:text-candy-navy transition-colors"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Products
            </Link>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <h1 className="text-3xl font-display text-candy-navy">Add New Product</h1>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="border-candy-navy/30 text-candy-navy"
                onClick={() => router.push('/admin/products')}
              >
                Cancel
              </Button>
              <Button
                className="bg-candy-orange hover:bg-candy-orange/90 text-white"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting ? "Saving..." : "Save Product"}
              </Button>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="bg-white rounded-xl p-6 shadow-sm card-retro">
              <h2 className="text-xl font-display text-candy-navy mb-4">Basic Information</h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Product Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={productData.name}
                      onChange={handleNameChange}
                      className="input-retro"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                      id="slug"
                      name="slug"
                      value={productData.slug}
                      onChange={handleInputChange}
                      className="input-retro"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={productData.description}
                    onChange={handleInputChange}
                    className="input-retro min-h-[150px]"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category_id">Category</Label>
                    <Select
                      value={productData.category_id}
                      onValueChange={(value) => setProductData({...productData, category_id: value})}
                    >
                      <SelectTrigger className="input-retro">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={productData.status}
                      onValueChange={(value) => setProductData({...productData, status: value})}
                    >
                      <SelectTrigger className="input-retro">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU</Label>
                    <Input
                      id="sku"
                      name="sku"
                      value={productData.sku}
                      onChange={handleInputChange}
                      className="input-retro"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Pricing */}
            <div className="bg-white rounded-xl p-6 shadow-sm card-retro">
              <h2 className="text-xl font-display text-candy-navy mb-4">Pricing</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">
                    Price <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-candy-navy/70">$</span>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={productData.price}
                      onChange={handleInputChange}
                      className="input-retro pl-8"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="compare_at_price">Compare-at Price</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-candy-navy/70">$</span>
                    <Input
                      id="compare_at_price"
                      name="compare_at_price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={productData.compare_at_price}
                      onChange={handleInputChange}
                      className="input-retro pl-8"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cost_price">Cost Price</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-candy-navy/70">$</span>
                    <Input
                      id="cost_price"
                      name="cost_price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={productData.cost_price}
                      onChange={handleInputChange}
                      className="input-retro pl-8"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Inventory */}
            <div className="bg-white rounded-xl p-6 shadow-sm card-retro">
              <h2 className="text-xl font-display text-candy-navy mb-4">Inventory</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="inventory_quantity">Quantity</Label>
                  <Input
                    id="inventory_quantity"
                    name="inventory_quantity"
                    type="number"
                    min="0"
                    value={productData.inventory_quantity}
                    onChange={handleInputChange}
                    className="input-retro"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="inventory_threshold">Low Stock Threshold</Label>
                  <Input
                    id="inventory_threshold"
                    name="inventory_threshold"
                    type="number"
                    min="0"
                    value={productData.inventory_threshold}
                    onChange={handleInputChange}
                    className="input-retro"
                  />
                </div>
              </div>
            </div>
            
            {/* Images */}
            <div className="bg-white rounded-xl p-6 shadow-sm card-retro">
              <h2 className="text-xl font-display text-candy-navy mb-4">Images</h2>
              
              <div className="space-y-4">
                {images.map((image, index) => (
                  <div key={index} className="border border-candy-navy/20 rounded-lg p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="w-full md:w-1/3">
                        <div className="aspect-square bg-candy-cream rounded-lg flex items-center justify-center overflow-hidden relative">
                          {image.preview ? (
                            <img 
                              src={image.preview || "/placeholder.svg"} 
                              alt="Preview" 
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <ImageIcon className="h-12 w-12 text-candy-navy/30" />
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageChange(index, e)}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                          />
                        </div>
                      </div>
                      
                      <div className="flex-1 space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor={`alt-text-${index}`}>Alt Text</Label>
                          <Input
                            id={`alt-text-${index}`}
                            value={image.alt_text}
                            onChange={(e) => handleImageAltChange(index, e.target.value)}
                            className="input-retro"
                            placeholder="Describe this image"
                          />
                        </div>
                        
                        {images.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            className="border-red-300 text-red-500 hover:bg-red-50"
                            onClick={() => removeImageField(index)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove Image
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                <Button
                  type="button"
                  variant="outline"
                  className="border-candy-navy/30 text-candy-navy"
                  onClick={addImageField}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Another Image
                </Button>
              </div>
            </div>
            
            {/* Additional Details */}
            <div className="bg-white rounded-xl p-6 shadow-sm card-retro">
              <h2 className="text-xl font-display text-candy-navy mb-4">Additional Details</h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      name="weight"
                      type="number"
                      step="0.01"
                      min="0"
                      value={productData.weight}
                      onChange={handleInputChange}
                      className="input-retro"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dimensions">Dimensions (LxWxH cm)</Label>
                    <Input
                      id="dimensions"
                      name="dimensions"
                      placeholder="e.g. 10x5x2"
                      value={productData.dimensions}
                      onChange={handleInputChange}
                      className="input-retro"
                    />
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_featured"
                      checked={productData.is_featured}
                      onCheckedChange={(checked) => handleSwitchChange('is_featured', checked)}
                    />
                    <Label htmlFor="is_featured">Featured Product</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_new"
                      checked={productData.is_new}
                      onCheckedChange={(checked) => handleSwitchChange('is_new', checked)}
                    />
                    <Label htmlFor="is_new">Mark as New</Label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                className="border-candy-navy/30 text-candy-navy"
                onClick={() => router.push('/admin/products')}
                type="button"
              >
                Cancel
              </Button>
              <Button
                className="bg-candy-orange hover:bg-candy-orange/90 text-white"
                type="submit"
                disabled={isSubmitting}
              >
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting ? "Saving..." : "Save Product"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>\

