"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Clock, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

// Sample limited drops data
const limitedDrops = [
  {
    id: 1,
    name: "Summer Nostalgia",
    description: "Inspired by vintage beach culture and summer road trips",
    image: "/placeholder.svg?height=600&width=600",
    launchDate: "2025-05-15T10:00:00",
    collaborator: "Coastal Dreams Studio",
    totalItems: 120,
    link: "/collections/summer-nostalgia",
  },
  {
    id: 2,
    name: "Neon Nights",
    description: "Bold graphics inspired by 80s arcade culture",
    image: "/placeholder.svg?height=600&width=600",
    launchDate: "2025-06-01T10:00:00",
    collaborator: "Pixel Punk",
    totalItems: 75,
    link: "/collections/neon-nights",
  },
]

export default function LimitedDrops() {
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  const [activeDropIndex, setActiveDropIndex] = useState(0)
  const activeDrop = limitedDrops[activeDropIndex]

  // Calculate time remaining for the active drop
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      const launchDate = new Date(activeDrop.launchDate)
      const diff = launchDate.getTime() - now.getTime()

      if (diff <= 0) {
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setTimeRemaining({ days, hours, minutes, seconds })
    }, 1000)

    return () => clearInterval(interval)
  }, [activeDrop])

  // Switch to next drop every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveDropIndex((prev) => (prev + 1) % limitedDrops.length)
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const formatNumber = (num) => {
    return num < 10 ? `0${num}` : num
  }

  return (
    <section className="py-16 md:py-24 bg-candy-navy text-white relative overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255, 107, 53, 0.15) 0%, transparent 50%),
                          radial-gradient(circle at 75% 75%, rgba(27, 154, 170, 0.15) 0%, transparent 50%)`,
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-block mb-4 transform rotate-2">
            <div className="bg-candy-orange text-white px-4 py-1 rounded-lg font-display text-sm">Don't Miss Out</div>
          </div>
          <h2 className="text-3xl md:text-5xl font-display mb-4">Limited Edition Drops</h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            Exclusive collections available for a limited time only. Once they're gone, they're gone forever.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Drop Image */}
          <div className="relative">
            <motion.div
              key={activeDrop.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.5 }}
              className="card-retro overflow-hidden bg-white/10 backdrop-blur-sm border-white/20"
            >
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={activeDrop.image || "/placeholder.svg"}
                  alt={activeDrop.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute top-4 left-4 bg-candy-orange text-white px-3 py-1 rounded-full text-sm font-medium">
                {activeDrop.totalItems} items only
              </div>
            </motion.div>
          </div>

          {/* Drop Info */}
          <motion.div
            key={activeDrop.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-2xl md:text-4xl font-display mb-2">{activeDrop.name}</h3>
              <p className="text-white/70 mb-4">{activeDrop.description}</p>
              <div className="flex items-center text-candy-orange mb-6">
                <span className="text-sm">In collaboration with</span>
                <span className="ml-2 font-display">{activeDrop.collaborator}</span>
              </div>
            </div>

            {/* Countdown Timer */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-candy-orange">
                <Clock className="h-4 w-4" />
                <span className="text-sm font-medium">Dropping in:</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: "Days", value: timeRemaining.days },
                  { label: "Hours", value: timeRemaining.hours },
                  { label: "Minutes", value: timeRemaining.minutes },
                  { label: "Seconds", value: timeRemaining.seconds },
                ].map((item, i) => (
                  <div key={i} className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                    <div className="text-2xl font-display text-white">{formatNumber(item.value)}</div>
                    <div className="text-xs text-white/70">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <Button asChild className="bg-candy-orange hover:bg-candy-orange/90 text-white rounded-full btn-retro">
                <Link href={activeDrop.link} className="flex items-center">
                  Get Notified
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-full">
                <Link href="/collections/limited-editions">View All Drops</Link>
              </Button>
            </div>

            {/* Drop Indicators */}
            <div className="flex justify-center gap-2 pt-4">
              {limitedDrops.map((_, i) => (
                <button
                  key={i}
                  className={`w-2 h-2 rounded-full ${i === activeDropIndex ? "bg-candy-orange" : "bg-white/30"}`}
                  onClick={() => setActiveDropIndex(i)}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

