"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Instagram, TwitterIcon as TikTok, Heart, MessageCircle, Share2 } from "lucide-react"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample social media posts
const socialPosts = {
  instagram: [
    {
      id: 1,
      username: "maya_designs",
      userImage: "/placeholder.svg?height=50&width=50",
      image: "/placeholder.svg?height=600&width=600",
      caption: "Loving my new Heritage Tee from @sweetthreads! The quality is amazing! #SweetThreads #VintageTees",
      likes: 342,
      comments: 28,
      timestamp: "2 days ago",
    },
    {
      id: 2,
      username: "vintage_vibes",
      userImage: "/placeholder.svg?height=50&width=50",
      image: "/placeholder.svg?height=600&width=600",
      caption: "This Limited Edition Artist Collab tee is everything! #SweetThreads #LimitedEdition",
      likes: 517,
      comments: 42,
      timestamp: "5 days ago",
    },
    {
      id: 3,
      username: "style_collective",
      userImage: "/placeholder.svg?height=50&width=50",
      image: "/placeholder.svg?height=600&width=600",
      caption: "The perfect fit and the softest cotton. @sweetthreads knows how to make quality tees! #SweetThreads",
      likes: 289,
      comments: 19,
      timestamp: "1 week ago",
    },
    {
      id: 4,
      username: "urban_explorer",
      userImage: "/placeholder.svg?height=50&width=50",
      image: "/placeholder.svg?height=600&width=600",
      caption: "City adventures in my new Sweet Threads tee #UrbanStyle #SweetThreads",
      likes: 412,
      comments: 31,
      timestamp: "3 days ago",
    },
  ],
  tiktok: [
    {
      id: 1,
      username: "fashion_finds",
      userImage: "/placeholder.svg?height=50&width=50",
      videoThumbnail: "/placeholder.svg?height=800&width=450",
      caption: "3 ways to style the new Heritage Tee from @sweetthreads #StyleTips #SweetThreads",
      likes: "24.5K",
      comments: "1.2K",
      shares: "3.4K",
    },
    {
      id: 2,
      username: "thrift_queen",
      userImage: "/placeholder.svg?height=50&width=50",
      videoThumbnail: "/placeholder.svg?height=800&width=450",
      caption: "Unboxing my Sweet Threads order! The packaging is so cute! #Unboxing #SweetThreads",
      likes: "18.7K",
      comments: "942",
      shares: "1.8K",
    },
    {
      id: 3,
      username: "style_hacks",
      userImage: "/placeholder.svg?height=50&width=50",
      videoThumbnail: "/placeholder.svg?height=800&width=450",
      caption: "Is this the best quality t-shirt? Sweet Threads review #HonestReview #SweetThreads",
      likes: "32.1K",
      comments: "2.4K",
      shares: "5.2K",
    },
  ],
  pinterest: [
    {
      id: 1,
      image: "/placeholder.svg?height=800&width=600",
      title: "Vintage Tee Styling Ideas",
      saves: "1.2K",
    },
    {
      id: 2,
      image: "/placeholder.svg?height=800&width=600",
      title: "Summer Outfit Inspiration",
      saves: "3.4K",
    },
    {
      id: 3,
      image: "/placeholder.svg?height=800&width=600",
      title: "Retro Fashion Comeback",
      saves: "2.8K",
    },
    {
      id: 4,
      image: "/placeholder.svg?height=800&width=600",
      title: "Sustainable Fashion Picks",
      saves: "5.1K",
    },
    {
      id: 5,
      image: "/placeholder.svg?height=800&width=600",
      title: "Minimalist Wardrobe Essentials",
      saves: "4.7K",
    },
    {
      id: 6,
      image: "/placeholder.svg?height=800&width=600",
      title: "Graphic Tee Collection",
      saves: "2.3K",
    },
  ],
}

export default function SocialFeed() {
  const [activeTab, setActiveTab] = useState("instagram")

  return (
    <section className="py-16 md:py-24 bg-candy-cream relative overflow-hidden">
      <div className="absolute inset-0 bg-polka-dots" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-block mb-4 transform rotate-2">
            <div className="bg-candy-blue text-white px-4 py-1 rounded-lg font-display text-sm">Community Love</div>
          </div>
          <h2 className="text-3xl md:text-5xl font-display mb-4 text-candy-navy">#SweetThreads</h2>
          <p className="text-candy-navy/70 max-w-2xl mx-auto">
            See how our community is styling and sharing their favorite pieces
          </p>
        </div>

        <Tabs defaultValue="instagram" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="bg-white border-2 border-candy-navy/10 p-1 rounded-full">
              <TabsTrigger
                value="instagram"
                className="rounded-full px-6 py-2 data-[state=active]:bg-candy-orange data-[state=active]:text-white font-display"
              >
                <Instagram className="h-4 w-4 mr-2" />
                Instagram
              </TabsTrigger>
              <TabsTrigger
                value="tiktok"
                className="rounded-full px-6 py-2 data-[state=active]:bg-candy-orange data-[state=active]:text-white font-display"
              >
                <TikTok className="h-4 w-4 mr-2" />
                TikTok
              </TabsTrigger>
              <TabsTrigger
                value="pinterest"
                className="rounded-full px-6 py-2 data-[state=active]:bg-candy-orange data-[state=active]:text-white font-display"
              >
                <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0a12 12 0 0 0-4.373 23.178c-.035-.87-.065-2.208.021-3.158.082-.84.528-5.358.528-5.358s-.132-.275-.132-.684c0-.641.371-1.122.834-1.122.394 0 .583.295.583.651 0 .397-.251 1-.39 1.553-.112.471.235.853.7.853.837 0 1.481-.884 1.481-2.16 0-1.124-.804-1.913-1.946-1.913-1.325 0-2.105.996-2.105 2.023 0 .4.153.83.342 1.066a.25.25 0 0 1 .056.24c-.06.252-.193.8-.22.912-.035.146-.113.177-.262.107-.73-.336-1.188-1.393-1.188-2.244 0-1.813 1.315-3.475 3.783-3.475 1.987 0 3.539 1.414 3.539 3.306 0 1.968-1.238 3.555-2.96 3.555-.577 0-1.12-.3-1.304-.66l-.355 1.356c-.128.491-.473 1.107-.705 1.483A12.008 12.008 0 0 0 12 24a12 12 0 0 0 0-24z" />
                </svg>
                Pinterest
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="instagram" className="focus-visible:outline-none focus-visible:ring-0">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {socialPosts.instagram.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card-retro overflow-hidden bg-white"
                >
                  <div className="p-2 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                      <Image
                        src={post.userImage || "/placeholder.svg"}
                        alt={post.username}
                        width={32}
                        height={32}
                        className="object-cover"
                      />
                    </div>
                    <span className="text-xs font-medium text-candy-navy">{post.username}</span>
                  </div>
                  <div className="relative aspect-square">
                    <Image src={post.image || "/placeholder.svg"} alt={post.caption} fill className="object-cover" />
                  </div>
                  <div className="p-3">
                    <div className="flex items-center gap-3 mb-2">
                      <button className="text-candy-navy hover:text-candy-orange transition-colors">
                        <Heart className="h-5 w-5" />
                      </button>
                      <button className="text-candy-navy hover:text-candy-orange transition-colors">
                        <MessageCircle className="h-5 w-5" />
                      </button>
                    </div>
                    <p className="text-xs font-medium text-candy-navy">{post.likes} likes</p>
                    <p className="text-xs line-clamp-2 mt-1">
                      <span className="font-medium">{post.username}</span> {post.caption}
                    </p>
                    <p className="text-xs text-candy-navy/50 mt-1">{post.timestamp}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tiktok" className="focus-visible:outline-none focus-visible:ring-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {socialPosts.tiktok.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card-retro overflow-hidden bg-white"
                >
                  <div className="relative aspect-[9/16] bg-black">
                    <Image
                      src={post.videoThumbnail || "/placeholder.svg"}
                      alt={post.caption}
                      fill
                      className="object-cover opacity-90"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-candy-orange/80 flex items-center justify-center">
                        <TikTok className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-white">
                          <Image
                            src={post.userImage || "/placeholder.svg"}
                            alt={post.username}
                            width={32}
                            height={32}
                            className="object-cover"
                          />
                        </div>
                        <span className="text-xs font-medium text-white">{post.username}</span>
                      </div>
                      <p className="text-xs text-white line-clamp-2">{post.caption}</p>
                    </div>
                  </div>
                  <div className="p-3 flex justify-between text-xs">
                    <div className="flex items-center gap-1">
                      <Heart className="h-4 w-4 text-candy-navy" />
                      <span>{post.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4 text-candy-navy" />
                      <span>{post.comments}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Share2 className="h-4 w-4 text-candy-navy" />
                      <span>{post.shares}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="pinterest" className="focus-visible:outline-none focus-visible:ring-0">
            <div className="columns-2 md:columns-3 gap-4 space-y-4">
              {socialPosts.pinterest.map((pin, index) => (
                <motion.div
                  key={pin.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card-retro overflow-hidden bg-white break-inside-avoid"
                >
                  <div className="relative">
                    <Image
                      src={pin.image || "/placeholder.svg"}
                      alt={pin.title}
                      width={600}
                      height={Math.floor(Math.random() * 300) + 300} // Random height for Pinterest-like effect
                      className="object-cover w-full"
                    />
                    <div className="absolute bottom-3 right-3 bg-white/80 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium text-candy-navy">
                      {pin.saves} saves
                    </div>
                  </div>
                  <div className="p-3">
                    <h4 className="text-sm font-medium text-candy-navy line-clamp-2">{pin.title}</h4>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-10 text-center">
          <Link
            href="https://www.instagram.com/explore/tags/sweetthreads/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block font-display text-candy-navy underline-offset-4 hover:text-candy-orange transition-colors border-b-2 border-candy-orange"
          >
            See more on social media
          </Link>
        </div>
      </div>
    </section>
  )
}

