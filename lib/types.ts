export type PersonaKey = "Light Pen" | "Author Eliora" | "Heavenly_Daoist";

export type BookRow = {
  id: string;
  title: string;
  author_name?: string | null;
  description?: string | null;
  cover_image_url?: string | null;
  read_url: string;
  persona?: PersonaKey | null;
  created_at?: string | null;
};

export type CommentRow = {
  id: string;
  book_id: string;
  clerk_user_id: string;
  user_id?: string | null;
  author_display_name: string;
  author_avatar_url?: string | null;
  body: string;
  created_at: string;
};

export type GiftRow = {
  id: string;
  book_id: string;
  from_clerk_user_id: string;
  amount_cents: number;
  currency: string;
  status: "pending" | "paid" | "failed" | "refunded";
  stripe_checkout_session_id: string;
  stripe_payment_intent_id?: string | null;
};

