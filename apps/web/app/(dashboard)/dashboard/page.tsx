export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Welcome back!</h2>
        <p className="text-muted-foreground">Here's what's happening with your account today.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-lg border bg-card p-6">
            <h3 className="mb-2 text-lg font-semibold">Card {i}</h3>
            <p className="text-muted-foreground">
              This is a placeholder card. Real content coming soon!
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
