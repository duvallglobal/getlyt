"use client"

import { useState } from "react"
import { ArrowRight, Gift } from "lucide-react"
import RetroPattern from "@/components/retro-pattern"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function NewsletterSignup() {
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Thank you for subscribing!",
        description: "You'll receive our newsletter at " + (email || phone),
      })
      setEmail("")
      setPhone("")
      setIsSubmitting(false)
    }, 1000)
  }

  return (
    <section className="py-16 md:py-24 bg-candy-blue text-white relative overflow-hidden">
      <RetroPattern className="absolute inset-0 opacity-10" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-block mb-4 transform -rotate-2">
              <div className="bg-candy-orange text-white px-4 py-1 rounded-lg font-display text-sm">Stay Connected</div>
            </div>
            <h2 className="text-3xl md:text-5xl font-display mb-4">Join Our Community</h2>
            <p className="text-white/80 max-w-2xl mx-auto mb-4">
              Subscribe to receive exclusive offers, early access to new collections, and style inspiration directly to
              your inbox.
            </p>
            <div className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 w-fit mx-auto">
              <Gift className="h-4 w-4 text-candy-orange" />
              <span className="text-sm font-medium">Get 10% off your first order when you sign up</span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 md:p-8">
            <Tabs defaultValue="email" className="w-full">
              <TabsList className="grid grid-cols-2 w-full bg-white/10 mb-6">
                <TabsTrigger
                  value="email"
                  className="font-display data-[state=active]:bg-candy-orange data-[state=active]:text-white"
                >
                  Email
                </TabsTrigger>
                <TabsTrigger
                  value="sms"
                  className="font-display data-[state=active]:bg-candy-orange data-[state=active]:text-white"
                >
                  SMS
                </TabsTrigger>
              </TabsList>

              <TabsContent value="email" className="focus-visible:outline-none focus-visible:ring-0">
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60 rounded-full flex-1"
                  />
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-candy-orange hover:bg-candy-orange/90 text-white rounded-full btn-retro"
                  >
                    Subscribe
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="sms" className="focus-visible:outline-none focus-visible:ring-0">
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                  <Input
                    type="tel"
                    placeholder="Enter your phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60 rounded-full flex-1"
                  />
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-candy-orange hover:bg-candy-orange/90 text-white rounded-full btn-retro"
                  >
                    Subscribe
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 mt-6 text-sm text-white/70">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-candy-orange flex-shrink-0"></div>
                <span>Exclusive offers</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-candy-orange flex-shrink-0"></div>
                <span>Early access</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-candy-orange flex-shrink-0"></div>
                <span>Styling tips</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-candy-orange flex-shrink-0"></div>
                <span>Community events</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-white/60 mt-4 text-center">
            By subscribing, you agree to our Privacy Policy and consent to receive updates from our company. You can
            unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  )
}

