"use client";

import { useState, useEffect } from "react";
import { SignedIn, SignedOut, SignInButton, useUser } from "@clerk/nextjs";
import { createClient } from "@/utils/supabase/client";

export function CommentsSection({ bookSlug }: { bookSlug: string }) {
  const { user, isLoaded } = useUser();
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingComments, setIsLoadingComments] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchComments = async () => {
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("book_slug", bookSlug)
        .order("created_at", { ascending: false });

      if (data) setComments(data);
      setIsLoadingComments(false);
    };
    fetchComments();
  }, [bookSlug]);

  const handlePostComment = async () => {
    if (!newComment.trim() || !user) return;
    setIsSubmitting(true);

    const userName = user.username || user.firstName || "Sect Member";

    const { data, error } = await supabase
      .from("comments")
      .insert([
        {
          book_slug: bookSlug,
          user_id: user.id,
          user_name: userName,
          content: newComment,
        },
      ])
      .select();

    // Award 20 points for commenting
    await supabase.rpc("increment_points", {
      p_user_id: user.id,
      p_user_name: userName,
      p_amount: 20
    });

    if (data && data.length > 0) {
      setComments([data[0], ...comments]); // Inject new comment at the top
      setNewComment(""); // Clear the box
    }
    setIsSubmitting(false);
  };

  return (
    <div className="mt-16 bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-xl mb-20">
      <h2 className="text-2xl font-bold mb-6 text-white">Discussion</h2>
      
      {/* Loading State */}
      {(!isLoaded || isLoadingComments) && (
        <div className="w-full min-h-[160px] bg-white/5 animate-pulse rounded-xl border border-white/10 mb-10" />
      )}

      {/* Logged In State */}
      {isLoaded && (
        <SignedIn>
          <div className="mb-10">
            <textarea 
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full bg-white/5 border border-white/20 rounded-xl p-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/50 resize-none min-h-[120px]"
              placeholder="Share your thoughts about this book..."
              disabled={isSubmitting}
            />
            <button 
              onClick={handlePostComment}
              disabled={isSubmitting || !newComment.trim()}
              className="mt-4 bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-xl border border-white/20 transition-colors shadow-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              {isSubmitting ? "Posting..." : "Post Comment"}
            </button>
          </div>
        </SignedIn>
      )}

      {/* Logged Out State */}
      {isLoaded && (
        <SignedOut>
          <div className="w-full bg-white/5 border border-white/20 rounded-xl p-8 text-center flex flex-col items-center justify-center min-h-[160px] backdrop-blur-sm mb-10 shadow-inner">
            <p className="text-white/80 font-medium mb-4 text-lg">You must join the sect to share your thoughts.</p>
            <SignInButton mode="modal">
              <button className="bg-white text-black hover:bg-white/90 font-bold py-3 px-8 rounded-xl transition-all shadow-xl hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] hover:-translate-y-1">
                Join Sect / Login
              </button>
            </SignInButton>
          </div>
        </SignedOut>
      )}

      {/* Dynamic Comments List */}
      <div className="space-y-6">
        {comments.length === 0 && !isLoadingComments ? (
          <p className="text-white/50 italic text-center py-4">Be the first to share your thoughts...</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="p-5 bg-white/5 border border-white/10 rounded-2xl shadow-lg">
              <div className="flex justify-between items-start mb-3">
                <span className="font-bold text-white">{comment.user_name}</span>
                <span className="text-xs text-white/50">
                  {new Date(comment.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-white/80 leading-relaxed whitespace-pre-wrap">{comment.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
