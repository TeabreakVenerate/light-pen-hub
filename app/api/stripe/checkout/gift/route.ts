import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await currentUser();
  const displayName = user?.fullName ?? userId;

  const body = await req.json();
  const bookId = body?.bookId as string | undefined;
  const amountCents = Number(body?.amountCents ?? 500); // default $5.00

  if (!bookId) {
    return NextResponse.json({ error: "Missing bookId" }, { status: 400 });
  }
  if (!Number.isFinite(amountCents) || amountCents <= 0) {
    return NextResponse.json(
      { error: "Invalid amountCents" },
      { status: 400 }
    );
  }

  const priceId = process.env.STRIPE_GIFT_PRICE_ID;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!priceId) {
    return NextResponse.json({ error: "Missing STRIPE_GIFT_PRICE_ID" }, { status: 500 });
  }
  if (!appUrl) {
    return NextResponse.json({ error: "Missing NEXT_PUBLIC_APP_URL" }, { status: 500 });
  }

  // Ensure the book exists (prevents gifts for unknown IDs).
  const { data: book } = await supabaseAdmin
    .from("books")
    .select("id")
    .eq("id", bookId)
    .maybeSingle();

  if (!book) {
    return NextResponse.json({ error: "Book not found" }, { status: 404 });
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${appUrl}/books/${bookId}?gift=success`,
    cancel_url: `${appUrl}/books/${bookId}?gift=cancel`,
    metadata: {
      bookId,
      fromClerkUserId: userId,
      fromDisplayName: displayName,
      amountCents: String(amountCents)
    }
  });

  if (!checkoutSession.url) {
    return NextResponse.json(
      { error: "Stripe did not return a checkout URL" },
      { status: 502 }
    );
  }

  // Create the gift record now; the webhook will mark it paid.
  await supabaseAdmin.from("gifts").insert({
    book_id: bookId,
    from_clerk_user_id: userId,
    amount_cents: amountCents,
    currency: "usd",
    status: "pending",
    stripe_checkout_session_id: checkoutSession.id
  });

  return NextResponse.json({ checkoutUrl: checkoutSession.url });
}

