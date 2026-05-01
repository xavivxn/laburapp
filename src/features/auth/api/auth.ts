import type { SupabaseClient } from "@supabase/supabase-js";

// TODO(supabase): all functions below are stubs. They mirror the real
// Supabase API shape so that wiring the real client only requires removing
// the early-return blocks. See .skills/supabase-skill.md.

export async function signInWithPassword(
  client: SupabaseClient,
  input: { email: string; password: string },
) {
  if (!isSupabaseConfigured()) {
    return { data: { user: null, session: null }, error: null as Error | null };
  }
  return client.auth.signInWithPassword(input);
}

export async function signUpWithPassword(
  client: SupabaseClient,
  input: { email: string; password: string; displayName: string },
) {
  if (!isSupabaseConfigured()) {
    return { data: { user: null, session: null }, error: null as Error | null };
  }
  return client.auth.signUp({
    email: input.email,
    password: input.password,
    options: { data: { display_name: input.displayName } },
  });
}

export async function signInWithOAuth(
  client: SupabaseClient,
  provider: "google" | "apple",
) {
  if (!isSupabaseConfigured()) {
    return { data: { url: null, provider }, error: null as Error | null };
  }
  return client.auth.signInWithOAuth({
    provider,
    options: { redirectTo: `${window.location.origin}/discover` },
  });
}

export async function signOut(client: SupabaseClient) {
  if (!isSupabaseConfigured()) return { error: null as Error | null };
  return client.auth.signOut();
}

function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
