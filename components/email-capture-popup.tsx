"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { motion, AnimatePresence } from "framer-motion"

export default function EmailCapturePopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  // Show popup after 5 seconds
  useEffect(() => {
    // Check if user has already seen the popup
    const hasSeenPopup = localStorage.getItem("hasSeenPopup")

    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    // Set flag in localStorage
    localStorage.setItem("hasSeenPopup", "true")
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Welcome to the club!",
        description: "Check your email for a special discount code.",
      })
      setIsSubmitting(false)
      handleClose()

      // Set a more permanent flag
      localStorage.setItem("hasSubscribed", "true")
    }, 1000)
  }

  // Exit intent detection
  useEffect(() => {
    const handleMouseLeave = (e) => {
      // Only trigger if moving to the top of the page
      if (e.clientY <= 0 && !localStorage.getItem("hasSeenPopup") && !isOpen) {
        setIsOpen(true)
      }
    }

    document.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white rounded-2xl max-w-md w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 z-10 text-white bg-black/20 hover:bg-black/30 rounded-full"
                onClick={handleClose}
              >
                <X className="h-4 w-4" />
              </Button>

              <div className="h-40 bg-gradient-to-r from-candy-orange to-candy-blue relative">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.2) 0%, transparent 15%),
                                    radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.2) 0%, transparent 15%)`,
                  }}
                />
                <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2">
                  <div className="bg-white rounded-full p-2">
                    <div className="bg-candy-orange text-white h-16 w-16 rounded-full flex items-center justify-center font-display text-xl">
                      10% OFF
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-12 text-center">
                <h3 className="text-2xl font-display text-candy-navy mb-2">Join the Sweet Threads Club</h3>
                <p className="text-candy-navy/70 mb-6">Sign up for our newsletter and get 10% off your first order!</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    type="email"
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border-candy-navy/30 focus:border-candy-orange focus:ring-candy-orange"
                  />
                  <Button
                    type="submit"
                    className="w-full bg-candy-orange hover:bg-candy-orange/90 text-white rounded-full btn-retro"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Signing up..." : "Get My Discount"}
                  </Button>
                </form>

                <p className="text-xs text-candy-navy/50 mt-4">
                  By signing up, you agree to receive marketing emails from us. You can unsubscribe at any time.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

