"use client";

import Link from "next/link";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Button } from "@/shared/components/ui/button";
import { signOutAction } from "../actions/auth-actions";

export function Navbar() {
  const { user, isPending, isLoggedIn, refresh } = useAuth();

  return (
    <nav className="flex items-center gap-4 border-b px-6 py-2">
      <Link href="/" className="font-medium text-sm">
        Home
      </Link>
      <Link href="/todo" className="text-muted-foreground text-sm">
        Todo
      </Link>
      <div className="ml-auto flex items-center gap-2">
        {isPending ? null : isLoggedIn ? (
          <>
            <span className="text-muted-foreground text-xs">{user?.name}</span>
            <Button
              type="button"
              variant="ghost"
              size="lg"
              onClick={async () => {
                await signOutAction();
                refresh();
              }}
            >
              Sign out
            </Button>
          </>
        ) : (
          <>
            <Button variant="ghost" size="lg">
              <Link href="/login">Log in</Link>
            </Button>
            <Button size="lg">
              <Link href="/sign-up">Sign up</Link>
            </Button>
          </>
        )}
      </div>
    </nav>
  );
}
