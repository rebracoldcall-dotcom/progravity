import { Button } from "@progravity/ui";

export default function Home(): JSX.Element {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 gap-4">
      <h1 className="text-4xl font-bold tracking-tight">Progravity</h1>
      <p className="text-muted-foreground">State of the Art Universal App</p>
      <div className="flex gap-4">
        <Button>Get Started</Button>
        <Button variant="outline">Documentation</Button>
      </div>
    </main>
  );
}
