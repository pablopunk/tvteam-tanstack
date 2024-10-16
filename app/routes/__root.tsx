import styles from "@/globals.css?url";
import { AppProvider } from "@/hooks/useAppContext";
import favicon from "@/public/favicon.svg?url";
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
      title: "TV TEAM",
    },
  ],
  links: () => [
    {
      rel: "stylesheet",
      href: styles,
    },
    {
      rel: "icon",
      href: favicon,
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
      </Head>
      <Body>
        <AppProvider>
          <main className="p-4 max-w-screen-sm mx-auto">{children}</main>
        </AppProvider>
        <ScrollRestoration />
        <Scripts />
      </Body>
    </Html>
  );
}
