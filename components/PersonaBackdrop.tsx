"use client";

import type { PersonaKey } from "@/lib/types";

export default function PersonaBackdrop({ persona }: { persona: PersonaKey }) {
  let bgClass = "bg-[#20394d]"; // Light Pen: Swap to blue/teal
  
  if (persona === "Author Eliora") {
    bgClass = "bg-[#7D2C37]"; // Author Eliora: Dark warm rose/brown
  } else if (persona === "Heavenly_Daoist") {
    bgClass = "bg-[#5c2c16]"; // Heavenly_Daoist: Swap to dark autumn rust
  }

  return (
    <div className={`absolute inset-0 -z-10 overflow-hidden transition-colors duration-500 ${bgClass}`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08)_0%,transparent_100%)] pointer-events-none" />
      {persona === "Light Pen" && (
        <div className="absolute inset-0 bg-black/20 pointer-events-none" />
      )}
    </div>
  );
}