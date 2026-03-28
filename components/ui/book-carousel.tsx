"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export interface Book {
  title: string;
  author: string;
  summary: string;
  coverUrl: string;
  href: string;
  externalLinks?: string[];
}

interface BookCarouselProps {
  books: Book[];
  onBookChange?: (book: Book) => void;
}

export default function BookCarousel({ books, onBookChange }: BookCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (onBookChange && books.length > 0) {
      onBookChange(books[activeIndex]);
    }
  }, [activeIndex, books, onBookChange]);
  const router = useRouter();

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % books.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + books.length) % books.length);
  };

  const handleBookClick = (index: number, href: string) => {
    if (index === activeIndex) {
      router.push(href);
    } else {
      setActiveIndex(index);
    }
  };

  if (!books || books.length === 0) return null;

  return (
    <div className="relative w-full max-w-5xl mx-auto h-[500px] flex items-center justify-center overflow-hidden" style={{ perspective: "1000px" }}>
      {/* Navigation Buttons */}
      <button
        onClick={handlePrev}
        className="absolute left-2 sm:left-10 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur transition-colors text-white focus:outline-none focus:ring-2 focus:ring-white/50"
        aria-label="Previous book"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-2 sm:right-10 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur transition-colors text-white focus:outline-none focus:ring-2 focus:ring-white/50"
        aria-label="Next book"
      >
        <ChevronRight size={24} />
      </button>

      {/* Carousel Container */}
      <div className="relative w-[280px] sm:w-[320px] h-[450px] flex justify-center items-center">
        <AnimatePresence mode="popLayout">
          {books.map((book, index) => {
            // Calculate relative offset from active index
            let offset = index - activeIndex;
            
            // Adjust for circular wrapping
            const halfLength = Math.floor(books.length / 2);
            if (offset < -halfLength) {
              offset += books.length;
            } else if (offset > halfLength) {
              offset -= books.length;
            }

            const isActive = offset === 0;
            const isLeft = offset < 0;
            
            // Allow up to 2 books visible on each side
            const isVisible = Math.abs(offset) <= 2;
            if (!isVisible) return null;

            // Compute layout differences using requested specifications
            const x = offset * 180; // horizontal spread
            const scale = isActive ? 1 : 0.85;
            const rotateY = isActive ? 0 : isLeft ? 15 : -15; // Side books rotate by 15 or -15
            const zIndex = isActive ? 3 : 2 - Math.abs(offset);
            const opacity = isActive ? 1 : 0.6; // Inactive -> 0.6

            return (
              <motion.div
                key={book.title}
                initial={{ opacity: 0, x, scale: 0.8, rotateY }}
                animate={{ opacity, x, scale, rotateY, zIndex }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="absolute w-full h-full cursor-pointer flex flex-col group rounded-3xl"
                style={{ transformStyle: "preserve-3d" }}
                onClick={() => handleBookClick(index, book.href)}
              >
                {/* Book Cover Wrapper */}
                <div 
                  className={`relative w-full h-full rounded-2xl overflow-hidden border transition-colors duration-500 
                    ${isActive ? 'border-white/40 shadow-[0_0_40px_rgba(255,255,255,0.15)] shadow-white/20' : 'border-white/10 shadow-xl'}`
                  }
                >
                  <div className="absolute inset-0 bg-[#2b2b2b]" /> {/* Placeholder color */}
                  <Image
                    src={book.coverUrl}
                    alt={book.title}
                    fill
                    className="object-cover"
                  />
                  
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent flex flex-col justify-end p-6">
                    <h3 className="text-2xl font-bold text-white mb-1 shadow-black drop-shadow-lg">{book.title}</h3>
                    <p className="text-sm text-white font-medium mb-3">{book.author}</p>
                    
                    {/* Summary - only fade in for active book */}
                    <div className={`transition-all duration-500 overflow-hidden ${isActive ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                      <p className="text-sm text-white/80 line-clamp-3 mb-4">
                        {book.summary}
                      </p>
                      <div className="inline-flex items-center gap-2 text-xs font-semibold text-paper bg-white/10 px-4 py-2 rounded-full border border-white/10 backdrop-blur group-hover:bg-white/20 group-hover:text-white transition-colors">
                        Read Now <ChevronRight size={14} />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
