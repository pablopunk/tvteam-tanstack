import { useCallback, useState } from "react";
import { Dropdown } from "./Dropdown";
import { createServerFn } from "@tanstack/start";
import { searchTeams } from "../providers/livesoccertv";
import { useAppContext } from "../hooks/useAppContext";

const searchTeamsFromServer = createServerFn("GET", async (query: string) => {
  const results = await searchTeams(query);
  return results || [];
});

const getLabel = (team: string) => {
  return (
    (team || "")
      .replace("-", " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ") || ""
  );
};

export const SearchTeams = () => {
  const { team, setTeam, setCountry, setLoadingData } = useAppContext();
  const [teams, setTeams] = useState([]);
  const searchTeams = useCallback((query: string) => {
    searchTeamsFromServer(query)
      .then((results) =>
        results.map((result) => ({
          value: `${result[0]}/${result[1]}`,
          label: getLabel(result[1]),
        }))
      )
      .then(setTeams);
  }, []);
  return (
    <Dropdown
      items={teams || []}
      onChange={(v) => {
        if (v?.value) {
          const [country, team] = v.value.split("/");
          setCountry(country);
          setTeam(team);
          setLoadingData("team");
        }
      }}
      placeholder="Select a team"
      search={searchTeams}
      selected={{
        label: getLabel(team),
        value: team,
      }}
    />
  );
};
