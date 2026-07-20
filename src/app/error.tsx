"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-[80vh] flex-col items-center justify-center gap-6 text-center">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">Something went wrong!</h1>
        <p className="text-muted-foreground max-w-[600px] text-lg">
          We encountered an unexpected error while rendering this page.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={() => reset()} size="lg">
          Try again
        </Button>
        <Link href="/">
          <Button variant="outline" size="lg">
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
