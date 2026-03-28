"use client";

import { useState } from "react";
import type { PersonaKey } from "@/lib/types";

export default function StripeGiftButton({
  bookId,
  persona
}: {
  bookId: string;
  persona?: PersonaKey | null;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function startGift() {
    setLoading(true);
    setError(null);
    try {
      // Default amount; in a real app you might offer multiple tiers.
      const amountCents = 500; // $5.00

      const res = await fetch("/api/stripe/checkout/gift", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId, amountCents })
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.error ?? `Gift failed (${res.status})`);
      }

      const checkoutUrl = data?.checkoutUrl as string | undefined;
      if (!checkoutUrl) {
        throw new Error("Missing checkoutUrl in response.");
      }

      window.location.href = checkoutUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gift failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-stretch gap-2">
      <button
        type="button"
        onClick={startGift}
        disabled={loading}
        className="rounded-2xl border border-gold/40 bg-gold/95 px-5 py-3 text-sm font-semibold text-ink-black shadow-[0_18px_50px_rgba(212,175,55,0.25)] hover:bg-gold disabled:opacity-60"
      >
        {loading ? "Redirecting..." : "Gift $5 via Stripe"}
      </button>
      {error ? <div className="text-sm text-red-400">{error}</div> : null}
      <div className="text-xs text-paper/70">
        Payment completion is handled by the Stripe webhook.
      </div>
    </div>
  );
}

