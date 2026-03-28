"use client";

import { useState } from "react";
import type { PersonaKey } from "@/lib/types";

export default function BookCover3D({
  coverImageUrl,
  title,
  persona
}: {
  coverImageUrl?: string | null;
  title: string;
  persona?: PersonaKey | null;
}) {
  const placeholderTag =
    persona === "Heavenly_Daoist" ? "XIANXIA INKDROP" : "COMMUNITY PORTAL";

  const [rx, setRx] = useState(0);
  const [ry, setRy] = useState(0);

  return (
    <div className="relative w-full">
      <div
        className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-gold/20 via-white/10 to-transparent opacity-20 blur-xl"
      />

      <div
        className="relative mx-auto w-[320px] sm:w-[360px]"
        onPointerLeave={() => {
          setRx(0);
          setRy(0);
        }}
      >
        {/* Depth layer */}
        <div
          className={[
            "absolute inset-0 translate-x-2 translate-y-4 rounded-3xl",
            "bg-black/40",
            "blur-[1px]"
          ].join(" ")}
        />

        <div
          className="relative overflow-hidden rounded-3xl border border-white/10 shadow-card"
          style={{
            transform: `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`,
            transition: "transform 120ms ease"
          }}
          onPointerMove={(e) => {
            const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
            const px = (e.clientX - rect.left) / rect.width - 0.5;
            const py = (e.clientY - rect.top) / rect.height - 0.5;
            setRy(px * 16);
            setRx(-py * 12);
          }}
        >
          {coverImageUrl ? (
            <img
              src={coverImageUrl}
              alt={title}
              className="h-[420px] w-full object-cover sm:h-[470px]"
              loading="eager"
            />
          ) : (
            <div className="relative flex h-[420px] w-full flex-col items-center justify-center bg-gradient-to-b from-white/10 via-white/5 to-black/40">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(212,175,55,0.35),transparent_55%),radial-gradient(circle_at_80%_60%,rgba(255,255,255,0.12),transparent_45%)]" />
              <div className="relative rounded-2xl border border-gold/30 bg-ink-black/30 px-6 py-5 text-center shadow-[0_30px_120px_rgba(212,175,55,0.14)]">
                <div className="text-xs font-semibold tracking-widest text-gold/90">
                  {placeholderTag}
                </div>
                <div className="mt-2 text-lg font-semibold text-paper">{title}</div>
                <div className="mt-2 text-xs text-paper/70">Click/hover to reveal depth</div>
              </div>
            </div>
          )}

          {/* Specular highlight */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-tr from-gold/25 via-white/10 to-gold/10 opacity-15"
          />

          {/* Inner gloss */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/20 opacity-80"
          />
        </div>
      </div>
    </div>
  );
}

