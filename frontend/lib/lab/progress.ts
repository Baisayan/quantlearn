import "server-only";
import { createClient } from "@/lib/supabase/server";
export async function getLabProgress() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getClaims();
  if (!auth?.claims.sub) throw new Error("Please sign in again.");
  const rows: {
    id: string;
    challenge_id: string;
    engine: string;
    score: number;
    passed: boolean;
    submitted_at: string;
  }[] = [];
  const cutoff = new Date().toISOString();
  for (;;) {
    const { data, error } = await supabase
      .from("lab_attempts")
      .select("id,challenge_id,engine,score,passed,submitted_at")
      .eq("user_id", auth.claims.sub)
      .lte("submitted_at", cutoff)
      .order("submitted_at", { ascending: false })
      .order("id", { ascending: false })
      .range(rows.length, rows.length + 499);
    if (error) throw new Error("Lab progress could not be loaded.");
    rows.push(...data);
    if (!data.length) return rows;
  }
}
