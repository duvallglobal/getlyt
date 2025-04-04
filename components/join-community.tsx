import Image from "next/image"
import Link from "next/link"
import { Users, MessageSquare, Camera, Hash } from "lucide-react"
import { Button } from "@/components/ui/button"

// Sample community stats
const communityStats = [
  { icon: <Users className="h-6 w-6 text-candy-orange" />, value: "25K+", label: "Community Members" },
  { icon: <MessageSquare className="h-6 w-6 text-candy-blue" />, value: "12K+", label: "Conversations" },
  { icon: <Camera className="h-6 w-6 text-candy-pink" />, value: "50K+", label: "Shared Photos" },
  { icon: <Hash className="h-6 w-6 text-candy-navy" />, value: "100K+", label: "Hashtag Mentions" },
]

export default function JoinCommunity() {
  return (
    <section className="py-16 md:py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Community Image Collage */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="card-retro overflow-hidden transform rotate-2">
                  <Image
                    src="/placeholder.svg?height=400&width=300"
                    alt="Community member"
                    width={300}
                    height={400}
                    className="object-cover"
                  />
                </div>
                <div className="card-retro overflow-hidden transform -rotate-3">
                  <Image
                    src="/placeholder.svg?height=300&width=300"
                    alt="Community event"
                    width={300}
                    height={300}
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="card-retro overflow-hidden transform -rotate-2">
                  <Image
                    src="/placeholder.svg?height=350&width=300"
                    alt="Community showcase"
                    width={300}
                    height={350}
                    className="object-cover"
                  />
                </div>
                <div className="card-retro overflow-hidden transform rotate-3">
                  <Image
                    src="/placeholder.svg?height=350&width=300"
                    alt="Community meetup"
                    width={300}
                    height={350}
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-full shadow-lg border-4 border-candy-cream animate-pulse">
              <div className="bg-candy-orange text-white h-16 w-16 rounded-full flex items-center justify-center font-display text-xl">
                Join!
              </div>
            </div>
          </div>

          {/* Community Info */}
          <div className="space-y-6">
            <div className="inline-block mb-2 transform -rotate-2">
              <div className="bg-candy-pink text-candy-navy px-4 py-1 rounded-lg font-display text-sm">
                Join The Fun
              </div>
            </div>
            <h2 className="text-3xl md:text-5xl font-display mb-4 text-candy-navy">Be Part of Our Community</h2>
            <p className="text-candy-navy/70">
              Connect with like-minded individuals who share your passion for vintage-inspired fashion and
              self-expression. Share your style, get inspired, and participate in exclusive community events and
              challenges.
            </p>

            {/* Community Stats */}
            <div className="grid grid-cols-2 gap-4 my-8">
              {communityStats.map((stat, index) => (
                <div key={index} className="bg-candy-cream rounded-xl p-4 flex items-center gap-3">
                  <div className="bg-white rounded-full p-2">{stat.icon}</div>
                  <div>
                    <div className="text-xl font-display text-candy-navy">{stat.value}</div>
                    <div className="text-xs text-candy-navy/70">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <Button
                asChild
                className="w-full bg-candy-orange hover:bg-candy-orange/90 text-white rounded-full btn-retro"
              >
                <Link href="/community/join">Join Our Community</Link>
              </Button>
              <div className="text-center text-sm text-candy-navy/70">
                Already a member?{" "}
                <Link href="/community/login" className="text-candy-blue hover:underline">
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

