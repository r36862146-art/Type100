import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex h-[80vh] flex-col items-center justify-center gap-6 text-center">
      <div className="space-y-2">
        <h1 className="text-6xl font-bold tracking-tighter">404</h1>
        <h2 className="text-2xl font-semibold tracking-tight">Page Not Found</h2>
        <p className="text-muted-foreground max-w-[500px] text-lg mx-auto">
          We couldn't find the page you were looking for. It might have been moved or doesn't exist.
        </p>
      </div>
      <Link href="/">
        <Button size="lg" className="mt-4">
          Return Home
        </Button>
      </Link>
    </div>
  );
}
