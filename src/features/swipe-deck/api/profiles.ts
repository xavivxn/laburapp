import type { SupabaseClient } from "@supabase/supabase-js";
import type { Profile, SwipeAction } from "../types";
import { mockProfiles } from "../lib/mock";

// TODO(supabase): replace stubs with real queries once the schema is live.
// Keep the function signatures stable — UI imports these.

export async function fetchDiscoverDeck(
  client: SupabaseClient,
  filters: { categories?: string[]; limit?: number } = {},
): Promise<Profile[]> {
  if (!isSupabaseConfigured()) {
    let list = mockProfiles;
    if (filters.categories && filters.categories.length > 0) {
      const set = new Set(filters.categories);
      list = list.filter((p) => p.categories.some((c) => set.has(c)));
    }
    return list.slice(0, filters.limit ?? list.length);
  }

  // Real query (when wired):
  // let q = client.from("profiles").select("*").eq("is_employee_enabled", true);
  // if (filters.categories?.length) q = q.overlaps("categories", filters.categories);
  // if (filters.limit) q = q.limit(filters.limit);
  // const { data, error } = await q;
  // if (error) throw error;
  // return data.map(mapRowToProfile);
  return [];
}

export async function recordSwipe(
  client: SupabaseClient,
  input: {
    swiperId: string;
    targetId: string;
    swiperRole: "employee" | "employer";
    action: SwipeAction;
  },
): Promise<{ matched: boolean; matchId: string | null }> {
  void client;
  void input;
  if (!isSupabaseConfigured()) {
    return { matched: false, matchId: null };
  }

  // Real query (when wired):
  // const { error: insertErr } = await client.from("swipes").insert({
  //   swiper_id: input.swiperId,
  //   target_id: input.targetId,
  //   swiper_role: input.swiperRole,
  //   action: input.action,
  // });
  // if (insertErr) throw insertErr;
  //
  // if (input.action === "pass") return { matched: false, matchId: null };
  //
  // const { data: matchId } = await client.rpc("create_match_if_mutual", {
  //   p_swiper: input.swiperId,
  //   p_target: input.targetId,
  // });
  // return { matched: Boolean(matchId), matchId: matchId ?? null };
  return { matched: false, matchId: null };
}

function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
