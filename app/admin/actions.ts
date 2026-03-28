"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { currentUser } from "@clerk/nextjs/server";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function deleteComment(commentId: string) {
  const user = await currentUser();
  const userEmail = user?.emailAddresses[0]?.emailAddress;
  
  const allowedAdmins = process.env.ADMIN_EMAILS?.toLowerCase().split(',') || [];
  
  if (!user || !userEmail || !allowedAdmins.includes(userEmail.toLowerCase())) {
    throw new Error("Unauthorized");
  }

  const { error } = await supabaseAdmin
    .from("comments")
    .delete()
    .eq("id", commentId);

  if (error) throw new Error(error.message);
  
  revalidatePath("/admin");
  revalidatePath("/books/[slug]", "page"); // Refresh the public book pages
}
