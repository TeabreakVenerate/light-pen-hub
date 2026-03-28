"use client";

import { useEffect, useMemo, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/browser";
import type { CommentRow } from "@/lib/types";

export default function CommentsFeed({
  bookId,
  initialComments
}: {
  bookId: string;
  initialComments: CommentRow[];
}) {
  const [comments, setComments] = useState<CommentRow[]>(initialComments);
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const sortedInitial = useMemo(() => {
    return [...initialComments].sort(
      (a, b) => +new Date(a.created_at) - +new Date(b.created_at)
    );
  }, [initialComments]);

  useEffect(() => {
    setComments(sortedInitial);
  }, [sortedInitial]);

  useEffect(() => {
    if (!supabaseBrowser) return;

    const channel = supabaseBrowser.channel(`comments:${bookId}`);

    channel.on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "comments",
        filter: `book_id=eq.${bookId}`
      },
      (payload) => {
        const newRow = payload.new as CommentRow | null;
        if (!newRow) return;

        setComments((prev) => {
          if (prev.some((c) => c.id === newRow.id)) return prev;
          return [...prev, newRow].sort(
            (a, b) => +new Date(a.created_at) - +new Date(b.created_at)
          );
        });
      }
    );

    channel.subscribe();

    return () => {
      supabaseBrowser?.removeChannel(channel);
    };
  }, [bookId]);

  async function submitComment(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const trimmed = body.trim();
    if (!trimmed) {
      setError("Write a comment first.");
      return;
    }
    if (trimmed.length > 2000) {
      setError("Comment is too long (max 2000 characters).");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/books/${bookId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: trimmed })
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.error ?? `Request failed (${res.status})`);
      }

      const inserted = data?.comment as CommentRow | undefined;
      if (inserted) {
        setComments((prev) => {
          if (prev.some((c) => c.id === inserted.id)) return prev;
          return [...prev, inserted].sort(
            (a, b) => +new Date(a.created_at) - +new Date(b.created_at)
          );
        });
      }

      setBody("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to post comment.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-paper">Comments</h2>
        <div className="text-sm text-paper/70">{comments.length} total</div>
      </div>

      <form onSubmit={submitComment} className="mt-4 flex flex-col gap-2">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Add a comment..."
          className="min-h-[92px] resize-none rounded-2xl border border-white/10 bg-ink-black/40 p-3 text-sm outline-none focus:border-gold/50"
          maxLength={2000}
        />
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-paper backdrop-blur hover:bg-white/20 disabled:opacity-60"
          >
            {submitting ? "Posting..." : "Post Comment"}
          </button>
          <div className="text-xs text-paper/60">
            Comes in instantly via Supabase realtime inserts.
          </div>
        </div>
        {error ? <div className="text-sm text-red-400">{error}</div> : null}
      </form>

      <div className="mt-4 max-h-[520px] overflow-auto rounded-2xl border border-white/10 bg-ink-black/30">
        {comments.length === 0 ? (
          <div className="p-4 text-sm text-paper/70">
            No comments yet. Be the first.
          </div>
        ) : (
          <ul className="divide-y divide-white/10">
            {comments.map((c) => (
              <li key={c.id} className="p-4">
                <div className="flex items-start gap-3">
                  {c.author_avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={c.author_avatar_url}
                      alt={c.author_display_name}
                      className="h-10 w-10 rounded-full border border-white/10 object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs font-semibold text-paper/90">
                      {(c.author_display_name ?? "?").slice(0, 1).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-sm font-semibold">
                        {c.author_display_name}
                      </div>
                      <div className="text-xs text-paper/60">
                        {new Date(c.created_at).toLocaleString()}
                      </div>
                    </div>
                    <div className="mt-2 whitespace-pre-wrap break-words text-sm text-paper/90">
                      {c.body}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

