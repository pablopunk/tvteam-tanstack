import { createRootRoute } from "@tanstack/react-router";
import { Outlet, ScrollRestoration } from "@tanstack/react-router";
import { Body, Head, Html, Meta, Scripts } from "@tanstack/start";

export const Route = createRootRoute({
  meta: () => [
    {
      charSet: "utf-8",
    },
    {
      name: "viewport",
      content: "width=device-width, initial-scale=1",
    },
    {
      title: "TanStack Start Starter",
    },
  ],
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <Html>
      <Head>
        <Meta />
        <script src="https://cdn.tailwindcss.com" />
        <style type="text/tailwindcss">{`
        html {
          color-scheme: light dark;
        }
        * {
          @apply border-gray-200 dark:border-gray-800;
        }
        body {
          @apply bg-gray-50 text-gray-950 dark:bg-gray-900 dark:text-gray-200;
          }
        `}</style>
      </Head>
      <Body>
        <main className="p-4 max-w-screen-sm mx-auto">{children}</main>
        <ScrollRestoration />
        <Scripts />
      </Body>
    </Html>
  );
}
