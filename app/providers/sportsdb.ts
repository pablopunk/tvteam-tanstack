
const normalizeTeamName = (teamName: string) => {
  return teamName
    .replace(/-/g, " ")
    .split(" ")
    .map(t => t.trim())
    .filter(t => !t.match(/de/i)) // celta de vigo -> celta vigo
    .join(" ");
}

const getTeamData = async (_teamName: string) => {
  const teamName = normalizeTeamName(_teamName);
  const response = await fetch(`https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=${teamName}`);
  const data = await response.json();
  return data;
}

export const getTeamImages = async (teamName: string) => {
  const data = await getTeamData(teamName);
  const team = data.teams?.[0];
  if (!team) {
    return {};
  }
  return {
    strBadge: team.strBadge,
    strLogo: team.strLogo,
    strFanart1: team.strFanart1,
    strFanart2: team.strFanart2,
    strFanart3: team.strFanart3,
    strFanart4: team.strFanart4,
    strBanner: team.strBanner,
    strEquipment: team.strEquipment,
    strColour1: team.strColour1,
    strColour2: team.strColour2,
    strColour3: team.strColour3,
  }
}

