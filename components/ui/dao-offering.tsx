"use client";

import { useState } from "react";
import { X } from "lucide-react";

const DAO_OFFERINGS = [
  { id: "ink_drop", name: "Ink Drop 💧", price: 1, desc: "Just show your support", color: "text-blue-400", bg: "bg-blue-400/10", border: "hover:border-blue-400/50" },
  { id: "coffee_shot", name: "Coffee Shot ☕", price: 2, desc: "Just show your support", color: "text-amber-600", bg: "bg-amber-600/10", border: "hover:border-amber-600/50" },
  { id: "idea_spark", name: "Idea Spark ⚡", price: 3, desc: "Just show your support", color: "text-yellow-400", bg: "bg-yellow-400/10", border: "hover:border-yellow-400/50" },
  { id: "chapter_fuel", name: "Chapter Fuel ⛽", price: 5, desc: "Just show your support", color: "text-orange-500", bg: "bg-orange-500/10", border: "hover:border-orange-500/50" },
  { id: "golden_pen", name: "Golden Pen ✒️✨", price: 10, desc: "Shout-out in author's note for the next chapter.", color: "text-amber-300", bg: "bg-amber-300/10", border: "hover:border-amber-300/50" },
  { id: "elite_reader", name: "Elite Reader 👑", price: 15, desc: "Shout-out, listed as active supporter, request 2 extra chapter uploads.", color: "text-emerald-400", bg: "bg-emerald-400/10", border: "hover:border-emerald-400/50" },
  { id: "heavenly_scroll", name: "Heavenly Scroll 📜✨", price: 25, desc: "Side character named after you, suggest a scene, request 4 extra chapters.", color: "text-cyan-400", bg: "bg-cyan-400/10", border: "hover:border-cyan-400/50" },
  { id: "dao_inheritor", name: "Dao Inheritor 🐉", price: 50, desc: "Side story or side-character POV for a chapter, answers to questions.", color: "text-fuchsia-400", bg: "bg-fuchsia-400/10", border: "hover:border-fuchsia-400/50" },
  { id: "mc_energy", name: "Main Character Energy 💀💀🔥", price: 150, desc: "Influence a small plot point, side-character POV, and the ability to cause the death of two disliked side characters.", color: "text-red-500", bg: "bg-red-500/10", border: "hover:border-red-500/50" },
  { id: "authors_chosen", name: "Author's Chosen 👁️🗨️✍️", price: 250, desc: "Live conversation with the author, request a full side story or alternate POV chapter.", color: "text-purple-400", bg: "bg-purple-400/10", border: "hover:border-purple-400/50" }
];

export function DaoOfferingButton() {
  const [isOfferingModalOpen, setIsOfferingModalOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOfferingModalOpen(true)} 
        className="w-full py-5 text-center border-2 border-white/50 bg-white/10 hover:bg-white/20 rounded-xl font-bold text-xl text-white mt-10 backdrop-blur shadow-2xl hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all"
      >
        Make a Dao Offering
      </button>

      {isOfferingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-white/5 backdrop-blur-3xl border border-white/20 rounded-3xl p-6 sm:p-8 shadow-[0_0_80px_rgba(0,0,0,0.8)] custom-scrollbar">
            
            <button 
              onClick={() => setIsOfferingModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 transition-colors text-white"
              aria-label="Close Modal"
            >
              <X size={20} />
            </button>
            
            <h2 className="text-3xl font-bold text-white mb-6 text-center">Select Your Offering</h2>
            
            <div className="space-y-4">
              {DAO_OFFERINGS.map((offering) => (
                <div 
                  key={offering.id}
                  onClick={() => console.log("Initialize Paystack for", offering.name)}
                  className={`${offering.bg} border border-white/10 ${offering.border} p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all mb-4 cursor-pointer hover:-translate-y-1 shadow-lg`}
                >
                  <div className="flex-1">
                    <h3 className={`text-lg font-bold ${offering.color}`}>{offering.name}</h3>
                    <p className="text-sm text-white/70 leading-relaxed">{offering.desc}</p>
                  </div>
                  <div className="bg-black/40 px-4 py-2 rounded-xl border border-white/5 shadow-lg shrink-0">
                    <span className={`text-xl font-extrabold ${offering.color}`}>${offering.price}</span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}
    </>
  );
}
