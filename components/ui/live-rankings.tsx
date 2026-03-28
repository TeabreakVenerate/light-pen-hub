"use client";

import { useState, useEffect } from "react";
import { Trophy, Flame } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export function LiveRankings() {
  const [rankings, setRankings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchRankings = async () => {
      const { data, error } = await supabase
        .from("fan_rankings")
        .select("*")
        .order("points", { ascending: false })
        .limit(3);

      if (data) setRankings(data);
      setIsLoading(false);
    };

    fetchRankings();
    
    // Real-time subscription so the leaderboard updates instantly
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'fan_rankings' }, fetchRankings)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [supabase]);

  return (
    <div className="mt-16 bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-white/10 rounded-lg">
          <Trophy size={24} className="text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white">Live Viewer Ranking</h2>
      </div>
      
      {isLoading ? (
        <div className="grid sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-white/5 animate-pulse rounded-2xl border border-white/5" />
          ))}
        </div>
      ) : rankings.length === 0 ? (
        <div className="p-6 bg-white/5 border border-white/10 rounded-2xl text-center">
          <p className="text-white/60 font-medium">The leaderboard is currently empty. Make the first offering or leave a comment!</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-3 gap-4">
          {rankings.map((fan, index) => (
            <div key={fan.user_id} className="flex flex-col p-5 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-colors shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20 font-bold text-white shadow shadow-white/10">
                  #{index + 1}
                </span>
                <span className="font-semibold text-white truncate">{fan.user_name}</span>
              </div>
              <div className="flex items-center gap-1.5 mt-auto text-sm font-semibold text-white/80">
                <Flame size={16} className="text-white/60" />
                {fan.points.toLocaleString()} points
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
