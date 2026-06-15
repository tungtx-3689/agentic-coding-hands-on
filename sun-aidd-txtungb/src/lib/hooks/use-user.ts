"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import type { Profile } from "@/lib/types";

export function useUser() {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      fetch("/api/me")
        .then((r) => r.json())
        .then((d: { user: Profile | null }) => setProfile(d.user ?? null));
    } else if (status !== "loading") {
      setProfile(null);
    }
  }, [session, status]);

  return { user: profile, loading: status === "loading" };
}
