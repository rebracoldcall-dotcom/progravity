export function DashboardSkeleton() {
  return (
    <div className="flex h-screen">
      {/* Sidebar skeleton */}
      <div className="w-64 border-r bg-card p-6">
        <div className="mb-8 h-8 w-32 animate-pulse rounded bg-muted" />
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 w-full animate-pulse rounded bg-muted" />
          ))}
        </div>
      </div>

      {/* Main content skeleton */}
      <div className="flex-1">
        {/* Header skeleton */}
        <div className="border-b p-6">
          <div className="flex items-center justify-between">
            <div className="h-8 w-48 animate-pulse rounded bg-muted" />
            <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />
          </div>
        </div>

        {/* Content skeleton */}
        <div className="p-6">
          <div className="mb-4 h-10 w-64 animate-pulse rounded bg-muted" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 w-full animate-pulse rounded bg-muted" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
