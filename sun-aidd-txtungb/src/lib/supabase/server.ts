import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const isConfigured = Boolean(SUPABASE_URL && SUPABASE_KEY);

function createNullClient() {
  const noopQuery = () =>
    Object.assign(Promise.resolve({ data: null, error: null, count: null }), {
      select: noopQuery,
      insert: noopQuery,
      update: noopQuery,
      upsert: noopQuery,
      delete: noopQuery,
      eq: noopQuery,
      neq: noopQuery,
      order: noopQuery,
      limit: noopQuery,
      range: noopQuery,
      ilike: noopQuery,
      match: noopQuery,
      single: () => Promise.resolve({ data: null, error: null }),
      head: noopQuery,
    });

  return {
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      signOut: async () => ({ error: null }),
      exchangeCodeForSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
    from: () => noopQuery(),
  } as unknown as ReturnType<typeof createServerClient>;
}

export async function createClient() {
  if (!isConfigured) return createNullClient();

  const cookieStore = await cookies();
  return createServerClient(SUPABASE_URL!, SUPABASE_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Server Component — cookies set via middleware
        }
      },
    },
  });
}
