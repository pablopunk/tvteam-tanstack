import { useAppContext } from "@/hooks/useAppContext";
import { useEffect, useState } from "react";
import { getTeamImages } from "@/providers/sportsdb";
import favicon from "@/public/favicon.svg?url";
import clsx from "clsx";

const getTeamImagesFromServer = async (teamName: string) => {
  const data = await getTeamImages(teamName);
  return data;
};

interface Props {
  initialTeamImages: Awaited<ReturnType<typeof getTeamImagesFromServer>>;
}

export const Nav = ({ initialTeamImages }: Props) => {
  const { team, loadingData } = useAppContext();

  const [teamData, setTeamData] =
    useState<Awaited<ReturnType<typeof getTeamImagesFromServer>>>(
      initialTeamImages
    );

  useEffect(() => {
    getTeamImagesFromServer(team.replace(/-/g, " ")).then(setTeamData);
  }, [team]);

  return (
    <nav className="flex justify-center gap-2 relative">
      {teamData?.strBanner && (
        <img
          src={teamData.strBanner}
          alt={team}
          className={clsx(
            "fixed top-0 left-0 w-full object-cover opacity-30 blur-sm pointer-events-none",
            {
              "blur-lg": loadingData === "team",
            }
          )}
          style={{ maskImage: "linear-gradient(black 10%, transparent)" }}
        />
      )}
      <img
        src={teamData?.strBadge || favicon}
        alt={team}
        className={clsx("w-8 h-8 grayscale opacity-80", {
          "invert dark:invert-0": !teamData?.strBadge,
          "animate-pulse": teamData?.strBadge === null,
        })}
      />
      <h1
        className={clsx(
          "relative font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r",
          {
            "dark:from-indigo-300 from-indigo-500 dark:to-purple-300 to-purple-500":
              !teamData?.strColour1,
          }
        )}
        style={{
          backgroundImage:
            teamData?.strColour1 && teamData?.strColour2
              ? `linear-gradient(to right, ${teamData.strColour1}, ${teamData.strColour2 || teamData.strColour1})`
              : undefined,
        }}
      >
        <span className="block dark:hidden" style={{ textShadow: "0 0 1px rgba(0, 0, 0, 0.5)" }}>TV {team.replace(/-/g, " ").toUpperCase()}</span>
        <span className="hidden dark:block" style={{ textShadow: "0 0 1px rgba(255, 255, 255, 0.5)" }}>TV {team.replace(/-/g, " ").toUpperCase()}</span>
      </h1>
    </nav>
  );
};
