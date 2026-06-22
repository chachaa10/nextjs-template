import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth.ts";

export default async function TodoPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="p-6">
      <h1 className="mb-4 font-medium text-lg">Todo</h1>
      <p className="text-muted-foreground text-sm">
        Welcome, {session.user.name}. This page is only visible to authenticated users.
      </p>
    </div>
  );
}
