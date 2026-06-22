import { SignUpForm } from "@/features/auth/components/sign-up-form.tsx";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card.tsx";
import type { Route } from "next";
import Link from "next/link";

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const redirect = (await searchParams).redirect as Route | undefined;

  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>Fill in the form below</CardDescription>
        </CardHeader>
        <CardContent>
          <SignUpForm redirectTo={redirect} />
        </CardContent>
        <CardFooter>
          <p className="text-muted-foreground text-xs">
            Already have an account?{" "}
            <Button variant="link">
              <Link href="/login">Log in</Link>
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
