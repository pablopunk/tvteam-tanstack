import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/start";
import { useEffect, useState } from "react";
import { matchesAreEqual } from "@/providers/livesoccertv";
import { Matches } from "@/components/Matches";
import { SearchTeams } from "@/components/SearchTeams";
import { SearchTimezones } from "@/components/SearchTimezones";
import { useAppContext } from "@/hooks/useAppContext";
import { getCachedMatches } from "@/utils/cache";
import { QuickSearch } from "@/components/QuickSearch";
import { Nav } from "@/components/Nav";
import { getTeamImages } from "@/providers/sportsdb";
import { Helmet } from "react-helmet";
import { teamNameCapitalized } from "@/utils/team";

const getMatchesFromServer = createServerFn(
  "GET",
  async (payload: { country: string; team: string; timezone: string }) => {
    const { country, team, timezone } = payload;
    const results = await getCachedMatches({ country, team, timezone });
    return results || [];
  }
);

export const Route = createFileRoute("/")({
  component: Home,
  loader: async (ctx) => {
    // default values
    const timezone = "Europe/Madrid";
    const country = "spain";
    const team = "real-madrid";
    const matches = await getMatchesFromServer({
      country,
      team,
      timezone,
    });
    const images = await getTeamImages(team);
    return {
      country,
      team,
      timezone,
      matches,
      images,
    };
  },
});

function Home() {
  const state = Route.useLoaderData();
  const [matchesData, setMatchesData] = useState(state?.matches || []);
  const { timezone, country, team, setLoadingData } = useAppContext();

  useEffect(() => {
    getMatchesFromServer({ country, team, timezone }).then((newData) => {
      if (!matchesAreEqual(newData, matchesData)) {
        setMatchesData(newData);
      }
      setLoadingData(false);
    });
  }, [timezone, country, team, matchesData, setLoadingData]);

  const upcomingMatches = matchesData.filter((m) => !m.played && !m.live);
  const liveMatch = matchesData.filter((m) => m.live).pop();
  const lastMatch = matchesData.filter((m) => m.played).pop();

  return (
    <div className="flex flex-col gap-4 max-w-screen-sm mx-auto">
      <Helmet>
        <title>TV {teamNameCapitalized(team)}</title>
      </Helmet>
      <Nav initialTeamImages={state?.images} />
      <aside className="flex flex-col gap-3 w-full items-center">
        <div className="flex gap-2 justify-center w-full">
          <SearchTeams />
          <SearchTimezones />
        </div>
        <QuickSearch />
      </aside>
      <div className="flex flex-col gap-5 z-0">
        {liveMatch ? (
          <section className="flex flex-col gap-2">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              🔴 Live match
            </h2>
            <Matches matches={[liveMatch]} />
          </section>
        ) : lastMatch ? (
          <section className="flex flex-col gap-2">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Last match
            </h2>
            <Matches matches={[lastMatch]} />
          </section>
        ) : null}
        {upcomingMatches.length > 0 ? (
          <section className="flex flex-col gap-2">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Upcoming matches →
            </h2>
            <Matches matches={upcomingMatches} />
          </section>
        ) : (
          <h3 className="text-xl text-red-900 dark:text-red-100">
            No upcoming matches found for{" "}
            <span className="font-bold">{teamNameCapitalized(team)}</span>
          </h3>
        )}
      </div>
    </div>
  );
}
