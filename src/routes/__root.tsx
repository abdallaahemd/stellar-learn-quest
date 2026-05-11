import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";

import appCss from "../styles.css?url";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { Splash } from "@/components/Splash";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="glass max-w-md rounded-3xl p-10 text-center shadow-elegant">
        <h1 className="text-7xl font-bold text-gradient-primary">404</h1>
        <h2 className="mt-3 text-xl font-semibold">Lost in cyberspace</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          That page is off the curriculum. Let&apos;s get you back on track.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center rounded-xl bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow-blue transition-transform hover:scale-105"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="glass max-w-md rounded-3xl p-10 text-center shadow-elegant">
        <h1 className="text-2xl font-semibold">Something glitched</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Try again — or head back to the launchpad.
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="rounded-xl bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow-blue transition-transform hover:scale-105"
          >
            Try again
          </button>
          <a
            href="/"
            className="rounded-xl border border-border bg-white/5 px-5 py-2.5 text-sm font-medium transition-colors hover:bg-white/10"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "iSchool — Premium Learning Platform" },
      {
        name: "description",
        content:
          "iSchool — a cinematic educational platform where kids learn programming, take quizzes, earn XP, and unlock achievements.",
      },
      { name: "author", content: "iSchool" },
      { property: "og:title", content: "iSchool — Premium Learning Platform" },
      {
        property: "og:description",
        content:
          "Cinematic learning. Real progress. Quizzes, XP and badges for ages 8–18.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "iSchool — Premium Learning Platform" },
      { name: "description", content: "CineLearn Academy is a premium, cinematic educational platform for interactive learning and assessments." },
      { property: "og:description", content: "CineLearn Academy is a premium, cinematic educational platform for interactive learning and assessments." },
      { name: "twitter:description", content: "CineLearn Academy is a premium, cinematic educational platform for interactive learning and assessments." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/a293aa08-dd6e-4299-b6cc-d6e381fd945e/id-preview-afc8a82b--4fece679-094a-4936-9aaa-46cfbbfb4c93.lovable.app-1778417319449.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/a293aa08-dd6e-4299-b6cc-d6e381fd945e/id-preview-afc8a82b--4fece679-094a-4936-9aaa-46cfbbfb4c93.lovable.app-1778417319449.png" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Splash />
      <AnimatedBackground />
      <Header />
      <PageTransitions>
        <Outlet />
      </PageTransitions>
      <Footer />
    </QueryClientProvider>
  );
}

function PageTransitions({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <AnimatePresence mode="wait">
      <motion.main
        key={pathname}
        initial={{ opacity: 0, y: 12, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -8, filter: "blur(6px)" }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto w-full max-w-7xl px-4 sm:px-6"
      >
        {children}
      </motion.main>
    </AnimatePresence>
  );
}
