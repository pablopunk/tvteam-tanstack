// app/routes/index.tsx
import {
  createFileRoute,
  useRouter,
  useRouterState,
} from "@tanstack/react-router";
import { createServerFn } from "@tanstack/start";
import { useEffect, useMemo, useState } from "react";
import { getMatches, matchesAreEqual } from "../../providers/livesoccertv";
import Dropdown from "../components/Dropdown";
import { Matches } from "../components/Matches";

const getMatchesFromServer = createServerFn(
  "GET",
  async (payload: { timezone: string }) => {
    const results = await getMatches("england", "arsenal", {
      timezone: payload.timezone,
    });
    return results || [];
  },
);

export const Route = createFileRoute("/")({
  component: Home,
  loader: async (ctx) => {
    const search = ctx.location.search as { timezone?: string };
    const timezone = search.timezone || "Europe/Madrid";
    return await getMatchesFromServer({ timezone });
  },
});

const guessTimezone = () => {
  let timezone = "Europe/Madrid";
  try {
    const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (typeof browserTimezone === "string" && browserTimezone.length > 0) {
      timezone = browserTimezone;
    }
  } catch (error) {
    console.error(error);
  }
  return timezone;
};

function Home() {
  const router = useRouter();
  const state = Route.useLoaderData();
  // const routerState = useRouterState();
  const browserTimezone = useMemo(() => guessTimezone(), []);
  const [timezone, setTimezone] = useState(browserTimezone);
  const [data, setData] = useState(state || []);
  const [selectedTimezone, setSelectedTimezone] = useState({
    label: timezone.split("/").pop(),
    value: timezone,
  });

  useEffect(() => {
    if (!selectedTimezone?.value) return;
    getMatchesFromServer({ timezone: selectedTimezone.value }).then(
      (newData) => {
        if (!matchesAreEqual(newData, data)) {
          setData(newData);
        }
      },
    );
  }, [selectedTimezone, data]);

  const upcomingMatches = data.filter((m) => !m.played && !m.live);
  const liveMatch = data.filter((m) => m.live).pop();
  const lastMatch = data.filter((m) => m.played).pop();

  return (
    <div className="flex flex-col gap-4 max-w-screen-sm mx-auto">
      <Dropdown
        items={[
          {
            label: "Madrid",
            value: "Europe/Madrid",
          },
          {
            label: "New York",
            value: "America/New_York",
          },
        ]}
        selected={selectedTimezone}
        onChange={setSelectedTimezone}
        placeholder="Select a timezone"
      />
      <div className="flex flex-col gap-5">
        {liveMatch ? (
          <section className="flex flex-col gap-2">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              🔴 Live match
            </h2>
            <Matches matches={[liveMatch]} />
          </section>
        ) : (
          <section className="flex flex-col gap-2">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Last match
            </h2>
            <Matches matches={[lastMatch]} />
          </section>
        )}
        <section className="flex flex-col gap-2">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Upcoming matches →
          </h2>
          <Matches matches={upcomingMatches} />
        </section>
      </div>
    </div>
  );
}
