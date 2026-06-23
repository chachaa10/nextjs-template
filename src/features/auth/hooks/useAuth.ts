"use client";

import { authClient } from "@/lib/auth-client";

export function useAuth() {
  const { data: session, isPending, error, refetch } = authClient.useSession();

  return {
    user: session?.user,
    session: session?.session,
    isLoggedIn: Boolean(session),
    isPending,
    error,
    // Useful for manually refreshing UI after a profile update
    refresh: refetch,
  };
}
