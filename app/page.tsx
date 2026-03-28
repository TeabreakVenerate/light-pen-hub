"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { getPersonaTheme } from "@/lib/personas";
import type { PersonaKey } from "@/lib/types";
import PersonaBackdrop from "@/components/PersonaBackdrop";

export default function LandingPage() {
  const [activePersona, setActivePersona] = useState<PersonaKey>("Light Pen");
  const theme = useMemo(() => getPersonaTheme(activePersona), [activePersona]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <PersonaBackdrop persona={activePersona} />

      <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <header className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-gold">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-gold" />
              Author-powered community portals
            </div>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              Community & Monetization Hub
            </h1>
            <p className="mt-4 text-sm text-paper/80">
              Books live elsewhere. This hub keeps conversations and micro-support in-house.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="/books"
              className="group relative inline-flex items-center justify-center whitespace-nowrap text-center overflow-hidden rounded-full border-2 border-white/40 bg-white/10 px-12 py-6 text-2xl font-bold text-white shadow-[0_0_40px_-10px_rgba(255,255,255,0.4)] backdrop-blur transition-all hover:scale-105 hover:border-white hover:bg-white/20 hover:shadow-[0_0_60px_-15px_rgba(255,255,255,0.6)] sm:text-3xl"
            >
              <span className="relative z-10">My Books</span>
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
            </a>
          </div>
        </header>

        {/* --- MEET THE AUTHOR SECTION --- */}
        <div className="mt-16">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 sm:p-10 shadow-card backdrop-blur">
            
            {/* Subtle background glow for the card */}
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gold/5 blur-[80px] pointer-events-none" />

            <div className="relative flex flex-col items-center gap-8 md:flex-row md:items-start">
              {/* Author Image */}
              <div className="relative h-40 w-40 shrink-0 overflow-hidden rounded-full border-[3px] border-white/10 shadow-2xl ring-1 ring-gold/30 md:h-48 md:w-48">
                {/* Make sure your image is named profile.jpg and is in the public/images/author folder */}
                <Image 
                  src="/images/author/profile.jpg" 
                  alt="Author Portrait" 
                  fill 
                  className="object-cover"
                />
              </div>

             {/* Author Bio */}
              <div className="flex-1 text-center md:text-left">
                <div className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/10 px-3 py-1 text-xs font-semibold text-gold mb-4">
                  One Mind, Three Worlds
                </div>
                <h2 className="text-3xl font-semibold text-paper sm:text-4xl">Hi, I&apos;m Light Pen.</h2>
                <div className="mt-4 space-y-4 text-sm leading-relaxed text-paper/80 sm:text-base">
                  <p>
                    Yes, I have multiple personalities, but legally they&apos;re called pen names. I&apos;m the single author behind <strong className="text-paper">Light Pen</strong> (handsome, suffering leads), <strong className="text-paper">Author Eliora</strong> (heart-wrenching romance), and <strong className="text-paper">Heavenly_Daoist</strong> (unhinged creative madness).
                  </p>
                  <p>
                    Fueled by overthinking and an unhealthy amount of coffee, I split my time between writing, gaming, and surviving academic exams. Through all the chaos, my love for Jesus Christ is the one constant.
                  </p>
                  <p className="mt-6 font-semibold text-gold">
                    Welcome to my multiverse—I hope you find a world to lose yourself in.
                  </p>
                </div>
              </div>
            </div>
            
          </div>
        </div>
        {/* --- END MEET THE AUTHOR SECTION --- */}

        <div className="mt-14 flex flex-col gap-3">
          <h2 className="text-xl font-semibold">Choose a persona</h2>
          <p className="text-sm text-paper/75">Hover or tap each persona. The UI reacts instantly.</p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <PersonaCard
            persona="Light Pen"
            active={activePersona === "Light Pen"}
            onEnter={() => setActivePersona("Light Pen")}
          />
          <PersonaCard
            persona="Author Eliora"
            active={activePersona === "Author Eliora"}
            onEnter={() => setActivePersona("Author Eliora")}
          />
          <PersonaCard
            persona="Heavenly_Daoist"
            active={activePersona === "Heavenly_Daoist"}
            onEnter={() => setActivePersona("Heavenly_Daoist")}
          />
        </div>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-card backdrop-blur">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-sm font-medium text-paper/75">Active persona</div>
              <div className="text-2xl font-semibold text-paper">{theme.id}</div>
            </div>
            <div className="rounded-xl border border-white/10 bg-ink-black/30 px-4 py-3 text-sm text-paper/80">
              Tap a persona card to shift the entire vibe.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function PersonaCard({
  persona,
  active,
  onEnter
}: {
  persona: PersonaKey;
  active: boolean;
  onEnter: () => void;
}) {
  return (
    <button
      type="button"
      onPointerEnter={onEnter}
      onFocus={onEnter}
      onClick={onEnter}
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-5 text-left backdrop-blur transition-transform duration-200 hover:scale-[1.01] focus:scale-[1.01]"
    >
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 transition-opacity duration-200 ${
          active ? "opacity-100" : "opacity-0 group-hover:opacity-70"
        }`}
      >
        {/* Gold halo */}
        <div className="absolute -left-16 -top-16 h-44 w-44 rounded-full bg-gold/15 blur-2xl" />
        <div className="absolute -bottom-16 -right-16 h-44 w-44 rounded-full bg-white/10 blur-2xl" />
      </div>

      <div className="relative">
        <div className="text-sm font-semibold text-paper/90">{persona}</div>
        <div className="mt-3 text-lg font-semibold text-paper">
          {persona === "Light Pen"
            ? "Handsome suffering leads, softly lit."
            : persona === "Author Eliora"
              ? "Warm romance weaving the heart close."
              : "Sudden creative madness: ink learns to dance."}
        </div>
        <div className="mt-3 text-sm text-paper/75">
          Realtime comments + Stripe gifts, tuned to this persona.
        </div>
        <div
          className={[
            "mt-5 inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold",
            active
              ? "bg-gold/15 text-gold ring-1 ring-gold/35"
              : "bg-white/10 text-paper/90 ring-1 ring-white/10"
          ].join(" ")}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
          {active ? "Active" : "Hover to Activate"}
        </div>
      </div>
    </button>
  );
}

