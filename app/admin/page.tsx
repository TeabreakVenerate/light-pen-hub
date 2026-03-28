import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { deleteComment } from "./actions";
import { Trash2, Users, MessageSquare } from "lucide-react";

export default async function AdminDashboard() {
  const user = await currentUser();
  const userEmail = user?.emailAddresses[0]?.emailAddress;

  console.log("CLERK EMAIL:", userEmail, "|| ENV EMAIL:", process.env.ADMIN_EMAIL);

  // 1. Absolute Security Check
  if (!user || userEmail !== process.env.ADMIN_EMAIL) {
    redirect("/");
  }

  // 2. Fetch Data using Admin Key
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: comments } = await supabaseAdmin
    .from("comments")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: fans } = await supabaseAdmin
    .from("fan_rankings")
    .select("*")
    .order("points", { ascending: false });

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8 font-sans selection:bg-white/30">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="pb-8 border-b border-white/10">
          <h1 className="text-4xl font-bold tracking-tight">Sect Master's Pavilion</h1>
          <p className="text-white/60 mt-2">Welcome back, Author. Here is the state of your sect.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Left Column: Comment Moderation */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-6">
              <MessageSquare className="text-white/70" />
              <h2 className="text-2xl font-bold">Recent Runes (Comments)</h2>
            </div>
            
            <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
              {comments?.map((comment) => (
                <div key={comment.id} className="p-4 bg-black/40 border border-white/5 rounded-2xl flex justify-between gap-4 group hover:border-white/20 transition-all">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-sm text-white">{comment.user_name}</span>
                      <span className="text-xs text-white/40">on {comment.book_slug}</span>
                    </div>
                    <p className="text-sm text-white/80 leading-relaxed">{comment.content}</p>
                  </div>
                  
                  <form action={async () => {
                    "use server";
                    await deleteComment(comment.id);
                  }}>
                    <button 
                      type="submit"
                      className="p-2 text-white/30 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                      title="Eradicate this comment"
                    >
                      <Trash2 size={18} />
                    </button>
                  </form>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Fan Leaderboard Overview */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl h-fit">
            <div className="flex items-center gap-3 mb-6">
              <Users className="text-white/70" />
              <h2 className="text-2xl font-bold">Top Disciples (Leaderboard)</h2>
            </div>
            
            <div className="space-y-3">
              {fans?.map((fan, index) => (
                <div key={fan.user_id} className="flex items-center justify-between p-3 bg-black/40 rounded-xl border border-white/5">
                  <div className="flex items-center gap-3">
                    <span className="text-white/40 font-mono text-sm">#{index + 1}</span>
                    <span className="font-semibold text-white">{fan.user_name}</span>
                  </div>
                  <span className="text-sm font-bold text-white/80">{fan.points.toLocaleString()} pts</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
