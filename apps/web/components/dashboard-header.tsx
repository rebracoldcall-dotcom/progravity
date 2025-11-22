"use client";

import { trpc } from "@/lib/trpc";
import { DashboardSkeleton } from "./dashboard-skeleton";
import { UserNav } from "./user-nav";

export function DashboardHeader(): JSX.Element {
  const { data: user, isLoading, error } = trpc.auth.getUser.useQuery();

  if (isLoading) {
    return (
      <header className="border-b">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="h-8 w-48 animate-pulse rounded bg-muted" />
          <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />
        </div>
      </header>
    );
  }

  if (error || !user) {
    return (
      <header className="border-b">
        <div className="flex h-16 items-center justify-between px-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <a
            href="/sign-in"
            className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90"
          >
            Sign In
          </a>
        </div>
      </header>
    );
  }

  return (
    <header className="border-b">
      <div className="flex h-16 items-center justify-between px-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <UserNav user={user} />
      </div>
    </header>
  );
}
