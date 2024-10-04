import { useAppContext } from "@/hooks/useAppContext";
import { teamNameCapitalized } from "@/utils/team";

const quickLinks = [
	["spain", "real-madrid"],
	["england", "arsenal"],
	["spain", "barcelona"],
];

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
		<div className="flex gap-2 items-center">
			<h3 className="text-xs text-gray-700 dark:text-gray-500">Quick links</h3>
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
						{teamNameCapitalized(team)}
					</button>
				))}
			</div>
		</div>
	);
};
