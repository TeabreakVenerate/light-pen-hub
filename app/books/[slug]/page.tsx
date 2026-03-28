import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import PersonaBackdrop from "@/components/PersonaBackdrop";
import type { PersonaKey } from "@/lib/types";
import { DaoOfferingButton } from "@/components/ui/dao-offering";
import { CommentsSection } from "@/components/ui/comments-section";
import { LiveRankings } from "@/components/ui/live-rankings";

const BOOK_DATABASE: Record<string, any> = {
  "levelling-up": {
    title: "Levelling Up", author: "Light Pen", persona: "Light Pen", coverUrl: "/images/books/book1.jpg",
    synopsis: ["The earth is suddenly invaded by aliens who call themselves the Daegi...", "Roshan, our young MC faces bullying and disgrace due to his lack of abilities, but stumbles into a ditch and finds a book which granted him access to an unimaginable power...", "[HOST : ROSHAN TALON]\n[QUEST RECEIVED]\n[QUEST: RETRIEVE THE GEM OF A KING TIER]"],
    links: [{ name: "Read on MegaNovel", url: "https://www.meganovel.com/story/LEVEL-UP_31000324809" }, { name: "Read on WebNovel", url: "https://m.webnovel.com/book/levelling-up_24032541206612605" }, { name: "Read on JoyRead", url: "https://www.joyread.com/5245-Levelling-Up?fromChapter=1" }]
  },
  "billionaire-ceo": {
    title: "Fall In Love My Billionaire CEO", author: "Author Eliora", persona: "Author Eliora", coverUrl: "/images/books/book2.jpg",
    synopsis: ["Alyssa paused, \"You don't believe in love at first sight,\" she said.", "\"I do not believe in love,\" the man shot back...", "Christmas takes a wild turn when Alyssa Rodriguez finds herself in a marriage with multi-billionaire Harrison Alexander the Fifth."],
    links: [{ name: "Read on GoodNovel", url: "https://www.goodnovel.com/book/Fall-In-Love-My-Billionaire-CEO_31001218937" }]
  },
  "sss-urban-chef": {
    title: "SSS Urban Chef: Endless Cooking in the Apocalypse", author: "Light Pen", persona: "Light Pen", coverUrl: "/images/books/book3.jpg",
    synopsis: ["Earth was invaded by strange races and brought to ruin. Humanity strived to live until some very first humans became mutated.", "Rayden goes back in time after being murdered, and with the awakening of his new system, he swears to become stronger and build the biggest stronghold on earth."],
    links: [] // Links coming soon
  },
  "magnus-dei": {
    title: "Magnus Dei: Crimson Resolve", author: "Light Pen", persona: "Light Pen", coverUrl: "/images/books/book4.jpg",
    synopsis: ["The SYN virus turned men into flesh-craving monsters. Alex Ray, just sixteen, was never meant to survive.", "[Congratulations, Mortal, you have obtained the Magnus Dei System.]", "Alex holds within his blood the cure to the virus."],
    links: [{ name: "Read on MegaNovel", url: "https://www.meganovel.com/story/MAGNUS-DEI-SYSTEM-CRIMSON-RESOLVE_31001142667" }]
  }
};

export default async function BookDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const book = BOOK_DATABASE[resolvedParams.slug];
  if (!book) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center font-bold text-2xl">Book not found</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Background layer */}
      <PersonaBackdrop persona={book.persona as PersonaKey} />
      <div className="absolute inset-0 bg-black/60 pointer-events-none -z-0" />

      {/* Main Content layer */}
      <div className="max-w-5xl mx-auto py-14 px-4 relative z-10 text-white min-h-screen">
        <Link href="/books" className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors">
          <ArrowLeft size={20} />
          Go Back
        </Link>

        {/* Top Section */}
        <div className="grid md:grid-cols-12 gap-10 mt-8">
          {/* Left Column */}
          <div className="col-span-12 md:col-span-5 lg:col-span-4 flex flex-col items-center md:items-start">
            
            {/* 3D Glass Container */}
            <div className="group perspective-[1200px] w-full max-w-[360px]">
              <div className="relative w-full aspect-[2/3] rounded-[2rem] transition-all duration-700 ease-out group-hover:rotate-y-[-8deg] group-hover:rotate-x-[8deg] group-hover:scale-[1.02] shadow-[0_30px_50px_-15px_rgba(0,0,0,0.7)] group-hover:shadow-[-20px_20px_40px_-10px_rgba(255,255,255,0.15)] border border-white/10 bg-white/5 p-3 backdrop-blur-xl">
                
                {/* Inner Image Frame */}
                <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/10 bg-black/20">
                  <Image 
                    src={book.coverUrl} 
                    alt={`${book.title} cover`} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  
                  {/* Dynamic Glass Glare (Appears on Hover) */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                </div>
                
              </div>
            </div>

            {/* Title & Author */}
            <h1 className="text-3xl font-bold mt-8 mb-2 leading-tight drop-shadow-lg text-center md:text-left">{book.title}</h1>
            <p className="text-lg text-white/70 font-medium text-center md:text-left">By {book.author}</p>
          </div>

          {/* Right Column */}
          <div className="col-span-12 md:col-span-7 lg:col-span-8 flex flex-col">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-md mb-8">
              <h2 className="text-xl font-bold mb-4 pb-2 border-b border-white/10">Synopsis</h2>
              <div className="space-y-4 text-white/85 leading-relaxed">
                {book.synopsis.map((paragraph: string, idx: number) => (
                  <p key={idx} className="whitespace-pre-wrap">{paragraph}</p>
                ))}
              </div>
            </div>

            <div className="mt-auto space-y-4">
              {book.links && book.links.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {book.links.map((link: any, idx: number) => (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-center bg-white/10 hover:bg-white/20 border border-white/40 text-white w-full py-4 rounded-xl font-bold transition-all shadow-xl hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                    >
                      {link.name}
                    </a>
                  ))}
                </div>
              ) : (
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center backdrop-blur-sm">
                  <p className="text-white/70 italic font-medium">Reading links coming soon!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Middle Section: Rankings */}
        <LiveRankings />

        {/* Gifting Section */}
        <DaoOfferingButton />

        {/* Comments Section */}
        <CommentsSection bookSlug={resolvedParams.slug} />

      </div>
    </div>
  );
}
