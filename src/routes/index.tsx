import { createFileRoute } from "@tanstack/react-router";
import logo from "@/assets/ischool-logo.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "iSchool — Assessment Platform" },
      {
        name: "description",
        content:
          "iSchool educational assessment platform — modern, interactive learning experiences for every grade.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <img src={logo} alt="iSchool" className="mb-8 h-20 w-auto" />
      <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Migration in progress
      </h1>
      <p className="mt-3 max-w-md text-sm text-muted-foreground">
        The TanStack scaffold is ready. Send your existing files (start with{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">package.json</code>,{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">tailwind.config.js</code>, and your
        routes file) and I&apos;ll port them in one by one.
      </p>
    </div>
  );
}
