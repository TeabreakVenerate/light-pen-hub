"use client";

import { useSearchParams } from "next/navigation";
import PersonaBackdrop from "@/components/PersonaBackdrop";
import BookCover3D from "@/components/BookCover3D";
import CommentsFeed from "@/components/CommentsFeed";
import StripeGiftButton from "@/components/StripeGiftButton";
import type { BookRow, CommentRow, PersonaKey } from "@/lib/types";

export default function BookPageClient({
  book,
  initialComments
}: {
  book: BookRow;
  initialComments: CommentRow[];
}) {
  const params = useSearchParams();
  const giftStatus = params.get("gift");
  const persona = (book.persona ?? "Light Pen") as PersonaKey;

  return (
    <div className="relative min-h-screen overflow-hidden">
      <PersonaBackdrop persona={persona} />

      <main className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {giftStatus === "success" ? (
          <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-paper backdrop-blur">
            Gift received. Thanks for supporting the creator.
          </div>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-[1fr,360px] lg:items-start">
          <section className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
            <div className="grid gap-6 lg:grid-cols-[420px,1fr] lg:items-start">
              <div className="flex justify-center">
                <BookCover3D
                  coverImageUrl={book.cover_image_url}
                  title={book.title}
                  persona={book.persona ?? null}
                />
              </div>

              <div className="flex flex-col gap-4">
                <div className="rounded-2xl border border-white/10 bg-ink-black/30 p-4">
                  <div className="text-xs font-semibold tracking-widest text-gold">
                    LIVE VIEWER RANKING
                  </div>
                  <div className="mt-3 space-y-2">
                    <RankingRow rank={1} name="HeavenlyAnon" viewers={1280} />
                    <RankingRow rank={2} name="InkScribe" viewers={950} />
                    <RankingRow rank={3} name="GoldenPen" viewers={640} />
                  </div>
                  <div className="mt-3 text-xs text-paper/70">
                    Placeholder leaderboard (updated in real-time when gifts land).
                  </div>
                </div>

                <div>
                  <div className="text-sm font-semibold text-paper/80">
                    {book.author_name ? `By ${book.author_name}` : "Creator pick"}
                  </div>
                  <h1 className="mt-1 text-3xl font-semibold tracking-tight text-paper">
                    {book.title}
                  </h1>
                  {book.description ? (
                    <p className="mt-3 text-sm text-paper/75">{book.description}</p>
                  ) : null}
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <a
                    href={book.read_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex w-full items-center justify-center rounded-2xl bg-gold px-5 py-3 text-sm font-semibold text-ink-black shadow-[0_18px_50px_rgba(212,175,55,0.25)] hover:bg-gold/90"
                  >
                    Read on Webnovel
                  </a>

                  <div className="mt-3">
                    <StripeGiftButton bookId={book.id} persona={book.persona ?? null} />
                  </div>
                </div>

                <div className="text-xs text-paper/70">
                  Books are hosted externally. This page focuses on community discussion and creator support.
                </div>
              </div>
            </div>
          </section>

          <aside className="lg:sticky lg:top-6">
            <CommentsFeed bookId={book.id} initialComments={initialComments} />
          </aside>
        </div>
      </main>
    </div>
  );
}

function RankingRow({
  rank,
  name,
  viewers
}: {
  rank: number;
  name: string;
  viewers: number;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
      <div className="flex items-center gap-3">
        <div className="text-xs font-semibold text-gold">{rank}</div>
        <div className="text-sm font-semibold text-paper">{name}</div>
      </div>
      <div className="text-sm font-semibold text-paper/85">
        {viewers.toLocaleString()}
      </div>
    </div>
  );
}

