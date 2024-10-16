import { useAppContext } from "@/hooks/useAppContext";
import type { Match } from "@/providers/livesoccertv";
import clsx from "clsx";
import { TV } from "./TV";

interface Props {
	matches: Match[];
}

export const Matches = ({ matches }: Props) => {
	const { loadingData, team } = useAppContext();

	return (
		<div className={clsx("grid grid-cols-1 gap-4")}>
			{matches.map((match, index) => (
				<article
					key={
						`${match.game}-${team}-${index}` /*
					if we don't include the team in the key, 2 teams matching each other
					will make the match.game be the same and therefore not update
					 */
					}
					className={clsx(
						"dark:bg-gray-800 shadow-md rounded-lg p-4 flex flex-col gap-1",
						{
							"bg-white dark:bg-gray-800": !match.live && !match.played,
							"bg-red-50 dark:bg-red-950": !!match.live,
							"bg-indigo-50 dark:bg-indigo-950": !!match.played,
						},
					)}
				>
					<div className="flex items-center justify-between gap-2">
						<div
							className={clsx(
								"text-xs text-teal-600 dark:text-teal-400 opacity-80",
								{
									"blur-sm": loadingData === "team",
								},
							)}
						>
							{match.competition}
						</div>
						<div className="flex gap-1 text-gray-500 dark:text-gray-400 text-xs">
							<span
								className={clsx("transition-all", { "blur-sm": loadingData })}
							>
								{match.date}
							</span>
							<span
								className={`font-bold transition-all ${loadingData ? "blur-sm" : ""}`}
							>
								{match.time}
							</span>
						</div>
					</div>
					<div className="flex items-center justify-between gap-2">
						<h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
							<span
								className={clsx("transition.all", {
									"blur-sm": loadingData === "team",
								})}
							>
								{match.game}
							</span>
						</h3>
					</div>
					<div className="grid grid-cols-3 gap-2 text-xs mt-2">
						{loadingData ? (
							<>
								<div className="bg-gray-200 dark:bg-gray-700 rounded-md h-6 animate-pulse" />
								<div className="bg-gray-200 dark:bg-gray-700 rounded-md h-6 animate-pulse" />
								<div className="bg-gray-200 dark:bg-gray-700 rounded-md h-6 animate-pulse" />
								<div className="bg-gray-200 dark:bg-gray-700 rounded-md h-6 animate-pulse" />
								<div className="bg-gray-200 dark:bg-gray-700 rounded-md h-6 animate-pulse" />
							</>
						) : (
							match.tvs.map((tv) => <TV key={tv} name={tv} />)
						)}
					</div>
				</article>
			))}
		</div>
	);
};
