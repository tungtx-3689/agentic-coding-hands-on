import { createBrowserClient } from "@supabase/ssr";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

function createNullBrowserClient() {
  const noopQuery = (): any => {
    const p: any = Promise.resolve({ data: null, error: null, count: null });
    ["select","insert","update","upsert","delete","eq","neq","order","limit","range","ilike","match","head","filter"].forEach(
      (m) => { p[m] = noopQuery; }
    );
    p.single = () => Promise.resolve({ data: null, error: null });
    return p;
  };
  const nullChannel: any = { on: () => nullChannel, subscribe: () => nullChannel, unsubscribe: () => {} };
  return {
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signOut: async () => ({ error: null }),
    },
    from: () => noopQuery(),
    channel: () => nullChannel,
    removeChannel: async () => ({ error: null }),
    storage: {
      from: () => ({
        upload: async () => ({ data: null, error: { message: "Not configured" } }),
        getPublicUrl: () => ({ data: { publicUrl: "" } }),
      }),
    },
  } as unknown as ReturnType<typeof createBrowserClient>;
}

export function createClient() {
  if (!SUPABASE_URL || !SUPABASE_KEY) return createNullBrowserClient();
  return createBrowserClient(SUPABASE_URL, SUPABASE_KEY);
}
