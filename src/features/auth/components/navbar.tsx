"use client";

import { authClient } from "@/lib/auth-client.ts";
import { Button } from "@/shared/components/ui/button.tsx";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function Navbar() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  return (
    <nav className="flex items-center gap-4 border-b px-6 py-2">
      <Link href="/" className="font-medium text-sm">
        Home
      </Link>
      <Link href="/todo" className="text-muted-foreground text-sm">
        Todo
      </Link>
      <div className="ml-auto flex items-center gap-2">
        {isPending ? null : session ? (
          <>
            <span className="text-muted-foreground text-xs">{session.user.name}</span>
            <Button
              type="button"
              variant="ghost"
              size="lg"
              onClick={async () => {
                await authClient.signOut();
                router.push("/");
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
