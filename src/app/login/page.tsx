import type { Route } from "next";
import { LoginForm } from "@/features/auth/components/login-form.tsx";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card.tsx";
import Link from "next/link";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const redirect = (await searchParams).redirect as Route | undefined;

  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Log in</CardTitle>
          <CardDescription>Enter your credentials</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm redirectTo={redirect} />
        </CardContent>
        <CardFooter>
          <p className="text-muted-foreground text-xs">
            Don&apos;t have an account?{" "}
            <Button variant="link">
              <Link href="/sign-up">Sign up</Link>
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
