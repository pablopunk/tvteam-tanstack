import { useAppContext } from "@/hooks/useAppContext";
import { getTeamImages } from "@/providers/sportsdb";
import defaultFavicon from "@/public/favicon.svg?url";
import { teamNameUppercase } from "@/utils/team";
import clsx from "clsx";
import { useEffect, useState } from "react";
import Helmet from "react-helmet";

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
      initialTeamImages,
    );

  useEffect(() => {
    getTeamImagesFromServer(team).then(setTeamData);
  }, [team]);

  const favicon = teamData?.strBadge || defaultFavicon;

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
            },
          )}
          style={{ maskImage: "linear-gradient(black 10%, transparent)" }}
        />
      )}
      <Helmet>
        <meta name="theme-color" content={teamData?.strColour1 || "#000000"} />
        <link rel="favicon" href={favicon} />
      </Helmet>
      <img
        src={teamData?.strBadge || favicon}
        alt={team}
        className={clsx("w-8 h-8 grayscale opacity-75", {
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
          },
        )}
        style={{
          backgroundImage:
            teamData?.strColour1 && teamData?.strColour2
              ? `linear-gradient(to right, ${teamData.strColour1}, ${teamData.strColour2 || teamData.strColour1})`
              : undefined,
        }}
      >
        <span
          className="block dark:hidden"
          style={{ textShadow: "0 0 1px rgba(0, 0, 0, 0.5)" }}
        >
          TV {teamNameUppercase(team)}
        </span>
        <span
          className="hidden dark:block"
          style={{ textShadow: "0 0 1px rgba(255, 255, 255, 0.5)" }}
        >
          TV {teamNameUppercase(team)}
        </span>
      </h1>
    </nav>
  );
};
