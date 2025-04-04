"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"

// Sample campaign stories
const campaignStories = [
  {
    id: "artists",
    title: "Artists",
    description: "Meet the creative minds who are redefining self-expression through their unique artistic vision.",
    image: "/placeholder.svg?height=600&width=800",
    stories: [
      {
        name: "Maya Chen",
        title: "Visual Artist",
        quote: "Fashion is just another canvas for me to express my perspective on the world.",
        image: "/placeholder.svg?height=400&width=400",
      },
      {
        name: "Jamal Wilson",
        title: "Street Artist",
        quote: "My art is about reclaiming spaces and making statements that can't be ignored.",
        image: "/placeholder.svg?height=400&width=400",
      },
    ],
  },
  {
    id: "musicians",
    title: "Musicians",
    description: "Discover how these sound innovators use fashion to amplify their musical identity.",
    image: "/placeholder.svg?height=600&width=800",
    stories: [
      {
        name: "Eliza Ray",
        title: "Indie Singer-Songwriter",
        quote: "My style is as important to my identity as my music—they're inseparable.",
        image: "/placeholder.svg?height=400&width=400",
      },
      {
        name: "The Midnight Collective",
        title: "Electronic Music Group",
        quote: "We dress how our music sounds: nostalgic but forward-looking.",
        image: "/placeholder.svg?height=400&width=400",
      },
    ],
  },
  {
    id: "activists",
    title: "Activists",
    description: "Follow these changemakers who are using fashion as a platform for social impact.",
    image: "/placeholder.svg?height=600&width=800",
    stories: [
      {
        name: "Zoe Martinez",
        title: "Climate Advocate",
        quote: "What we wear is a statement about what we stand for and the future we want to create.",
        image: "/placeholder.svg?height=400&width=400",
      },
      {
        name: "Kai Johnson",
        title: "Community Organizer",
        quote: "Fashion has always been political—I use it to spark conversations about change.",
        image: "/placeholder.svg?height=400&width=400",
      },
    ],
  },
]

export default function MakeYourMark() {
  const [activeStoryIndex, setActiveStoryIndex] = useState(0)

  return (
    <section className="py-16 md:py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-candy-cream to-transparent" />

      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-block mb-4 transform -rotate-2">
            <div className="bg-candy-pink text-candy-navy px-4 py-1 rounded-lg font-display text-sm">
              Featured Campaign
            </div>
          </div>
          <h2 className="text-3xl md:text-5xl font-display mb-4 text-candy-navy">Make Your Mark</h2>
          <p className="text-candy-navy/70 max-w-2xl mx-auto">
            Celebrating individuals who express their unique identity through style and creativity
          </p>
        </div>

        <Tabs defaultValue="artists" className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="bg-candy-cream border-2 border-candy-navy/10 p-1 rounded-full">
              {campaignStories.map((story) => (
                <TabsTrigger
                  key={story.id}
                  value={story.id}
                  className="rounded-full px-6 py-2 data-[state=active]:bg-candy-orange data-[state=active]:text-white font-display"
                >
                  {story.title}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {campaignStories.map((category) => (
            <TabsContent
              key={category.id}
              value={category.id}
              className="focus-visible:outline-none focus-visible:ring-0"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                {/* Main Category Image */}
                <div className="card-retro overflow-hidden">
                  <Image
                    src={category.image || "/placeholder.svg"}
                    alt={category.title}
                    width={800}
                    height={600}
                    className="object-cover w-full"
                  />
                </div>

                {/* Category Stories */}
                <div className="space-y-8">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-display mb-3 text-candy-navy">{category.title}</h3>
                    <p className="text-candy-navy/70">{category.description}</p>
                  </div>

                  {/* Individual Stories */}
                  <div className="space-y-6">
                    {category.stories.map((story, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.2 }}
                        className="flex gap-4 bg-candy-cream p-4 rounded-xl"
                      >
                        <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                          <Image
                            src={story.image || "/placeholder.svg"}
                            alt={story.name}
                            width={64}
                            height={64}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div>
                          <h4 className="font-display text-candy-navy">{story.name}</h4>
                          <p className="text-xs text-candy-navy/70 mb-1">{story.title}</p>
                          <p className="text-sm italic">"{story.quote}"</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <Button
                    asChild
                    className="group bg-candy-orange hover:bg-candy-orange/90 text-white rounded-full px-6 btn-retro"
                  >
                    <Link href={`/campaigns/make-your-mark/${category.id}`} className="flex items-center">
                      Read Full Story
                      <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <div className="mt-16 text-center">
          <Button
            asChild
            variant="outline"
            className="border-candy-navy text-candy-navy hover:bg-candy-navy/5 rounded-full"
          >
            <Link href="/campaigns/make-your-mark">Explore All Stories</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

