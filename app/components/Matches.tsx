import type { Match } from "../../providers/livesoccertv";
import { TV } from "./TV";
import clsx from "clsx";

interface Props {
  matches: Match[];
}

export const Matches = ({ matches }: Props) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      {matches.map((match) => (
        <article
          key={match.game}
          className={clsx(
            "bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 flex flex-col gap-1",
            {
              "bg-red-100 dark:bg-red-950": !!match.live,
              "bg-indigo-100 dark:bg-indigo-950": !!match.played,
            },
          )}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="text-xs text-teal-400 font-bold opacity-80">
              {match.competition}
            </div>
            <div className="flex gap-1 text-gray-500 dark:text-gray-400 text-xs">
              <span>{match.date}</span>
              <span className="font-bold">{match.time}</span>
            </div>
          </div>
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {match.game}
            </h3>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs mt-2">
            {match.tvs.map((tv) => (
              <TV key={tv} name={tv} />
            ))}
          </div>
        </article>
      ))}
    </div>
  );
};
