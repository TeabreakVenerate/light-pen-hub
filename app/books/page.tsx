"use client";

import BookCarousel from "@/components/ui/book-carousel";
import { ArrowLeft, Trophy, MessageSquareHeart, Flame } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import PersonaBackdrop from "@/components/PersonaBackdrop";
import type { PersonaKey } from "@/lib/types";

const FEATURED_BOOKS = [
  { title: "Levelling Up", author: "Light Pen", summary: "A thrilling system progression journey where limits are meant to be broken.", coverUrl: "/images/books/book1.jpg", href: "/books/levelling-up", externalLinks: ["https://www.meganovel.com/story/LEVEL-UP_31000324809", "https://m.webnovel.com/book/levelling-up_24032541206612605", "https://www.joyread.com/5245-Levelling-Up?fromChapter=1"] },
  { title: "Fall In Love My Billionaire CEO", author: "Author Eliora", summary: "An emotional, heart-wrenching romance where power and passion collide.", coverUrl: "/images/books/book2.jpg", href: "/books/billionaire-ceo", externalLinks: ["https://www.goodnovel.com/book/Fall-In-Love-My-Billionaire-CEO_31001218937"] },
  { title: "SSS Urban Chef: Endless Cooking in the Apocalypse", author: "Light Pen", summary: "Survival meets culinary mastery in a post-apocalyptic world.", coverUrl: "/images/books/book3.jpg", href: "/books/sss-urban-chef", externalLinks: [] },
  { title: "Magnus Dei: Crimson Resolve", author: "Light Pen", summary: "An epic system-based adventure forged in crimson resolve.", coverUrl: "/images/books/book4.jpg", href: "/books/magnus-dei", externalLinks: ["https://www.meganovel.com/story/MAGNUS-DEI-SYSTEM-CRIMSON-RESOLVE_31001142667"] }
];

export default function BooksPage() {
  const [activeAuthor, setActiveAuthor] = useState<string>("Light Pen");

  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      <PersonaBackdrop persona={activeAuthor as PersonaKey} />
      <div className="absolute inset-0 bg-black/40 z-[-1] pointer-events-none" />
      
      <div className="relative py-14 px-4 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors mb-8 focus:outline-none focus:ring-2 focus:ring-white/50 rounded-lg p-1 -ml-1">
            <ArrowLeft size={16} />
            Back to Hub
          </Link>
          <div className="text-center mb-12">
            <h1 className="text-3xl font-semibold sm:text-4xl text-white">My Books</h1>
            <p className="mt-3 text-white/70">Swipe or click to explore the current library.</p>
          </div>
          
          <BookCarousel books={FEATURED_BOOKS} onBookChange={(book) => setActiveAuthor(book.author)} />
          
          <div className="grid md:grid-cols-2 gap-8 mt-20">
            {/* Live Fan Rankings Widget */}
            <div className="bg-black/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-white/10 rounded-lg">
                  <Trophy size={20} className="text-white" />
                </div>
                <h2 className="text-xl font-semibold text-white">Live Fan Rankings</h2>
              </div>
              <div className="space-y-4">
                {[
                  { rank: 1, name: "Celestial_Reader", points: "15,402" },
                  { rank: 2, name: "Daoist_of_Coffee", points: "12,940" },
                  { rank: 3, name: "Bookworm190", points: "10,230" },
                ].map((fan) => (
                  <div key={fan.name} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 font-bold text-white text-sm">
                        #{fan.rank}
                      </span>
                      <span className="font-medium text-white/90">{fan.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm font-semibold text-white/80">
                      <Flame size={16} className="text-white/60" />
                      {fan.points}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Interacted Comments Widget */}
            <div className="bg-black/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-white/10 rounded-lg">
                  <MessageSquareHeart size={20} className="text-white" />
                </div>
                <h2 className="text-xl font-semibold text-white">Top Interacted Comments</h2>
              </div>
              <div className="space-y-4">
                {[
                  { 
                    user: "Mystic_Sect_Elder", 
                    text: "The pacing in the latest chapter was incredible! I couldn't put my phone down until 3 AM.", 
                    likes: "4.2k" 
                  },
                  { 
                    user: "RomanceAddict", 
                    text: "I literally cried at the ending of volume 2. Need the next update ASAP!", 
                    likes: "2.8k" 
                  },
                ].map((comment, i) => (
                  <div key={i} className="p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-white/90 text-sm">{comment.user}</span>
                      <div className="flex items-center text-xs font-semibold text-white/60 bg-white/10 px-2 py-1 rounded-full">
                        {comment.likes} Likes
                      </div>
                    </div>
                    <p className="text-sm text-white/70 leading-relaxed italic">
                      &quot;{comment.text}&quot;
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
