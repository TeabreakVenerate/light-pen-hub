import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const commentBody = String(body?.body ?? "").trim();

  if (!commentBody) {
    return NextResponse.json({ error: "Missing comment body" }, { status: 400 });
  }
  if (commentBody.length > 2000) {
    return NextResponse.json(
      { error: "Comment too long (max 2000 chars)" },
      { status: 400 }
    );
  }

  const user = await currentUser();

  const displayName = user?.fullName ?? userId;
  const avatarUrl = user?.imageUrl ?? null;

  const { data, error } = await supabaseAdmin
    .from("comments")
    .insert({
      book_id: params.id,
      clerk_user_id: userId,
      author_display_name: displayName,
      author_avatar_url: avatarUrl,
      body: commentBody
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ comment: data });
}

