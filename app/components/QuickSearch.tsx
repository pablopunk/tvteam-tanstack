import { useAppContext } from "@/hooks/useAppContext";

const quickLinks = [
  ["spain", "real-madrid"],
  ["england", "arsenal"],
  ["spain", "barcelona"],
];

const prettyTeamName = (team: string) => {
  return team.replace("-", " ").toUpperCase();
};

export const QuickSearch = () => {
  const ctx = useAppContext();

  const selectTeam = (country: string, team: string) => {
    if (ctx.team !== team) {
      ctx.setTeam(team);
      ctx.setCountry(country);
      ctx.setLoadingData("team");
    }
  };

  return (
    <div className="flex gap-3 items-center">
      <h3 className="text-xs text-gray-500 dark:text-gray-400">Quick links:</h3>
      <div className="flex gap-2">
        {quickLinks.map(([country, team]) => (
          <button
            type="button"
            className="text-xs text-gray-500 dark:text-gray-400 font-bold hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            onClick={() => {
              selectTeam(country, team);
            }}
            key={`${country}-${team}`}
          >
            {prettyTeamName(team)}
          </button>
        ))}
      </div>
    </div>
  );
};
