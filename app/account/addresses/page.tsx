"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ChevronLeft, MapPin, Plus, Edit, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import RetroPattern from "@/components/retro-pattern"
import { getSupabaseBrowserClient } from "@/lib/supabase"

export default function AddressesPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [addresses, setAddresses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingAddress, setEditingAddress] = useState(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // Address form state
  const [addressData, setAddressData] = useState({
    name: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
    phone: "",
    is_default: false,
    address_type: "shipping",
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?redirectTo=/account/addresses")
    }
  }, [user, loading, router])

  // Fetch addresses
  useEffect(() => {
    const fetchAddresses = async () => {
      if (!user) return

      try {
        const supabase = getSupabaseBrowserClient()

        const { data, error } = await supabase
          .from("addresses")
          .select("*")
          .eq("user_id", user.id)
          .order("is_default", { ascending: false })
          .order("created_at", { ascending: false })

        if (error) {
          throw error
        }

        setAddresses(data || [])
      } catch (error) {
        console.error("Error fetching addresses:", error)
        toast({
          title: "Error",
          description: "Failed to load addresses. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      fetchAddresses()
    }
  }, [user, toast])

  const resetAddressForm = () => {
    setAddressData({
      name: "",
      address_line1: "",
      address_line2: "",
      city: "",
      state: "",
      postal_code: "",
      country: "",
      phone: "",
      is_default: false,
      address_type: "shipping",
    })
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setAddressData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (checked) => {
    setAddressData((prev) => ({ ...prev, is_default: checked }))
  }

  const handleAddressTypeChange = (type) => {
    setAddressData((prev) => ({ ...prev, address_type: type }))
  }

  const handleAddAddress = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const supabase = getSupabaseBrowserClient()

      // If setting as default, update all other addresses to not be default
      if (addressData.is_default) {
        await supabase
          .from("addresses")
          .update({ is_default: false })
          .eq("user_id", user.id)
          .eq("address_type", addressData.address_type)
      }

      // Add new address
      const { data, error } = await supabase
        .from("addresses")
        .insert({
          ...addressData,
          user_id: user.id,
        })
        .select()
        .single()

      if (error) {
        throw error
      }

      // Update local state
      setAddresses([data, ...addresses])

      toast({
        title: "Address added",
        description: "Your address has been successfully added.",
      })

      // Reset form and close dialog
      resetAddressForm()
      setIsAddDialogOpen(false)
    } catch (error) {
      console.error("Error adding address:", error)
      toast({
        title: "Error",
        description: "Failed to add address. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditAddress = (address) => {
    setEditingAddress(address)
    setAddressData({
      name: address.name || "",
      address_line1: address.address_line1 || "",
      address_line2: address.address_line2 || "",
      city: address.city || "",
      state: address.state || "",
      postal_code: address.postal_code || "",
      country: address.country || "",
      phone: address.phone || "",
      is_default: address.is_default || false,
      address_type: address.address_type || "shipping",
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdateAddress = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const supabase = getSupabaseBrowserClient()

      // If setting as default, update all other addresses to not be default
      if (addressData.is_default) {
        await supabase
          .from("addresses")
          .update({ is_default: false })
          .eq("user_id", user.id)
          .eq("address_type", addressData.address_type)
      }

      // Update address
      const { data, error } = await supabase
        .from("addresses")
        .update({
          ...addressData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingAddress.id)
        .select()
        .single()

      if (error) {
        throw error
      }

      // Update local state
      setAddresses(addresses.map((addr) => (addr.id === editingAddress.id ? data : addr)))

      toast({
        title: "Address updated",
        description: "Your address has been successfully updated.",
      })

      // Reset form and close dialog
      resetAddressForm()
      setIsEditDialogOpen(false)
      setEditingAddress(null)
    } catch (error) {
      console.error("Error updating address:", error)
      toast({
        title: "Error",
        description: "Failed to update address. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteAddress = async () => {
    setIsSubmitting(true)

    try {
      const supabase = getSupabaseBrowserClient()

      const { error } = await supabase.from("addresses").delete().eq("id", editingAddress.id)

      if (error) {
        throw error
      }

      // Update local state
      setAddresses(addresses.filter((addr) => addr.id !== editingAddress.id))

      toast({
        title: "Address deleted",
        description: "Your address has been successfully deleted.",
      })

      // Reset and close dialog
      setIsDeleteDialogOpen(false)
      setEditingAddress(null)
    } catch (error) {
      console.error("Error deleting address:", error)
      toast({
        title: "Error",
        description: "Failed to delete address. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSetDefault = async (addressId, addressType) => {
    try {
      const supabase = getSupabaseBrowserClient()

      // Update all addresses of this type to not be default
      await supabase
        .from("addresses")
        .update({ is_default: false })
        .eq("user_id", user.id)
        .eq("address_type", addressType)

      // Set this address as default
      const { error } = await supabase.from("addresses").update({ is_default: true }).eq("id", addressId)

      if (error) {
        throw error
      }

      // Update local state
      setAddresses(
        addresses.map((addr) => ({
          ...addr,
          is_default: addr.id === addressId && addr.address_type === addressType,
        })),
      )

      toast({
        title: "Default address updated",
        description: "Your default address has been updated.",
      })
    } catch (error) {
      console.error("Error setting default address:", error)
      toast({
        title: "Error",
        description: "Failed to update default address. Please try again.",
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

          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-candy-orange" />
              <h1 className="text-3xl font-display text-candy-navy">My Addresses</h1>
            </div>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-candy-orange hover:bg-candy-orange/90 text-white rounded-full btn-retro">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Address
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                  <DialogTitle className="font-display text-candy-navy text-xl">Add New Address</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddAddress} className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={addressData.name}
                      onChange={handleInputChange}
                      className="input-retro"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address_line1">Address Line 1</Label>
                    <Input
                      id="address_line1"
                      name="address_line1"
                      value={addressData.address_line1}
                      onChange={handleInputChange}
                      className="input-retro"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address_line2">Address Line 2 (Optional)</Label>
                    <Input
                      id="address_line2"
                      name="address_line2"
                      value={addressData.address_line2}
                      onChange={handleInputChange}
                      className="input-retro"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="city"
                        value={addressData.city}
                        onChange={handleInputChange}
                        className="input-retro"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="state">State/Province</Label>
                      <Input
                        id="state"
                        name="state"
                        value={addressData.state}
                        onChange={handleInputChange}
                        className="input-retro"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="postal_code">ZIP/Postal Code</Label>
                      <Input
                        id="postal_code"
                        name="postal_code"
                        value={addressData.postal_code}
                        onChange={handleInputChange}
                        className="input-retro"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        name="country"
                        value={addressData.country}
                        onChange={handleInputChange}
                        className="input-retro"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={addressData.phone}
                      onChange={handleInputChange}
                      className="input-retro"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="shipping"
                          checked={addressData.address_type === "shipping"}
                          onChange={() => handleAddressTypeChange("shipping")}
                          className="text-candy-orange focus:ring-candy-orange"
                        />
                        <Label htmlFor="shipping">Shipping Address</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="billing"
                          checked={addressData.address_type === "billing"}
                          onChange={() => handleAddressTypeChange("billing")}
                          className="text-candy-orange focus:ring-candy-orange"
                        />
                        <Label htmlFor="billing">Billing Address</Label>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="is_default"
                        checked={addressData.is_default}
                        onCheckedChange={handleCheckboxChange}
                      />
                      <Label htmlFor="is_default">Set as default {addressData.address_type} address</Label>
                    </div>
                  </div>

                  <DialogFooter className="pt-4">
                    <DialogClose asChild>
                      <Button type="button" variant="outline" className="border-candy-navy/30 text-candy-navy">
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button
                      type="submit"
                      className="bg-candy-orange hover:bg-candy-orange/90 text-white"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Saving..." : "Save Address"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {isLoading ? (
            <div className="bg-white rounded-xl p-8 text-center card-retro">
              <div className="animate-pulse text-candy-navy/50">Loading addresses...</div>
            </div>
          ) : addresses.length > 0 ? (
            <div className="space-y-6">
              {/* Shipping Addresses */}
              <div>
                <h2 className="text-xl font-display text-candy-navy mb-4">Shipping Addresses</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses
                    .filter((address) => address.address_type === "shipping")
                    .map((address) => (
                      <Card key={address.id} className="card-retro border-0">
                        <CardContent className="p-6">
                          {address.is_default && (
                            <div className="bg-candy-orange text-white text-xs px-2 py-0.5 rounded-full inline-block mb-2">
                              Default
                            </div>
                          )}
                          <div className="space-y-1 mb-4">
                            <p className="font-medium">{address.name}</p>
                            <p>{address.address_line1}</p>
                            {address.address_line2 && <p>{address.address_line2}</p>}
                            <p>
                              {address.city}, {address.state} {address.postal_code}
                            </p>
                            <p>{address.country}</p>
                            {address.phone && <p>{address.phone}</p>}
                          </div>

                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-candy-navy/30 text-candy-navy"
                              onClick={() => handleEditAddress(address)}
                            >
                              <Edit className="h-3 w-3 mr-1" />
                              Edit
                            </Button>

                            {!address.is_default && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-candy-navy/30 text-candy-navy"
                                onClick={() => handleSetDefault(address.id, "shipping")}
                              >
                                Set as Default
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>

              {/* Billing Addresses */}
              <div>
                <h2 className="text-xl font-display text-candy-navy mb-4">Billing Addresses</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses
                    .filter((address) => address.address_type === "billing")
                    .map((address) => (
                      <Card key={address.id} className="card-retro border-0">
                        <CardContent className="p-6">
                          {address.is_default && (
                            <div className="bg-candy-orange text-white text-xs px-2 py-0.5 rounded-full inline-block mb-2">
                              Default
                            </div>
                          )}
                          <div className="space-y-1 mb-4">
                            <p className="font-medium">{address.name}</p>
                            <p>{address.address_line1}</p>
                            {address.address_line2 && <p>{address.address_line2}</p>}
                            <p>
                              {address.city}, {address.state} {address.postal_code}
                            </p>
                            <p>{address.country}</p>
                            {address.phone && <p>{address.phone}</p>}
                          </div>

                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-candy-navy/30 text-candy-navy"
                              onClick={() => handleEditAddress(address)}
                            >
                              <Edit className="h-3 w-3 mr-1" />
                              Edit
                            </Button>

                            {!address.is_default && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-candy-navy/30 text-candy-navy"
                                onClick={() => handleSetDefault(address.id, "billing")}
                              >
                                Set as Default
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl p-8 text-center card-retro">
              <MapPin className="h-12 w-12 text-candy-navy/30 mx-auto mb-3" />
              <h3 className="font-medium text-candy-navy mb-1">No addresses found</h3>
              <p className="text-sm text-candy-navy/70 mb-4">You haven't added any addresses yet.</p>
              <Button
                className="bg-candy-orange hover:bg-candy-orange/90 text-white rounded-full btn-retro"
                onClick={() => setIsAddDialogOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Address
              </Button>
            </div>
          )}

          {/* Edit Address Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle className="font-display text-candy-navy text-xl">Edit Address</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleUpdateAddress} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Full Name</Label>
                  <Input
                    id="edit-name"
                    name="name"
                    value={addressData.name}
                    onChange={handleInputChange}
                    className="input-retro"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-address_line1">Address Line 1</Label>
                  <Input
                    id="edit-address_line1"
                    name="address_line1"
                    value={addressData.address_line1}
                    onChange={handleInputChange}
                    className="input-retro"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-address_line2">Address Line 2 (Optional)</Label>
                  <Input
                    id="edit-address_line2"
                    name="address_line2"
                    value={addressData.address_line2}
                    onChange={handleInputChange}
                    className="input-retro"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-city">City</Label>
                    <Input
                      id="edit-city"
                      name="city"
                      value={addressData.city}
                      onChange={handleInputChange}
                      className="input-retro"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-state">State/Province</Label>
                    <Input
                      id="edit-state"
                      name="state"
                      value={addressData.state}
                      onChange={handleInputChange}
                      className="input-retro"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-postal_code">ZIP/Postal Code</Label>
                    <Input
                      id="edit-postal_code"
                      name="postal_code"
                      value={addressData.postal_code}
                      onChange={handleInputChange}
                      className="input-retro"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-country">Country</Label>
                    <Input
                      id="edit-country"
                      name="country"
                      value={addressData.country}
                      onChange={handleInputChange}
                      className="input-retro"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-phone">Phone Number</Label>
                  <Input
                    id="edit-phone"
                    name="phone"
                    value={addressData.phone}
                    onChange={handleInputChange}
                    className="input-retro"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="edit-shipping"
                        checked={addressData.address_type === "shipping"}
                        onChange={() => handleAddressTypeChange("shipping")}
                        className="text-candy-orange focus:ring-candy-orange"
                      />
                      <Label htmlFor="edit-shipping">Shipping Address</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="edit-billing"
                        checked={addressData.address_type === "billing"}
                        onChange={() => handleAddressTypeChange("billing")}
                        className="text-candy-orange focus:ring-candy-orange"
                      />
                      <Label htmlFor="edit-billing">Billing Address</Label>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="edit-is_default"
                      checked={addressData.is_default}
                      onCheckedChange={handleCheckboxChange}
                    />
                    <Label htmlFor="edit-is_default">Set as default {addressData.address_type} address</Label>
                  </div>
                </div>

                <DialogFooter className="pt-4 flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    className="border-red-300 text-red-500 hover:bg-red-50"
                    onClick={() => {
                      setIsEditDialogOpen(false)
                      setIsDeleteDialogOpen(true)
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>

                  <div className="flex gap-2">
                    <DialogClose asChild>
                      <Button type="button" variant="outline" className="border-candy-navy/30 text-candy-navy">
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button
                      type="submit"
                      className="bg-candy-orange hover:bg-candy-orange/90 text-white"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogContent className="sm:max-w-[450px]">
              <DialogHeader>
                <DialogTitle className="font-display text-candy-navy text-xl">Delete Address</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <p className="text-candy-navy/70">
                  Are you sure you want to delete this address? This action cannot be undone.
                </p>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" className="border-candy-navy/30 text-candy-navy">
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  className="bg-red-500 hover:bg-red-600 text-white"
                  onClick={handleDeleteAddress}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Deleting..." : "Delete Address"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}

