import type { Route } from "next";
import { Suspense } from "react";
import { SignUpForm } from "@/features/auth/components/sign-up-form";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import Link from "next/link";

export default function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>Fill in the form below</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<SignUpForm redirectTo={undefined} />}>
            <SignUpFormLoader searchParams={searchParams} />
          </Suspense>
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

async function SignUpFormLoader({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const redirect = (await searchParams).redirect as Route | undefined;
  return <SignUpForm redirectTo={redirect} />;
}
