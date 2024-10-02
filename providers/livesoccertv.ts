import { getMatches as getMatchesFromParser } from "livesoccertv-parser";

export type Match = Awaited<ReturnType<typeof getMatches>>[number];

export const matchIsEqual = (a: Match, b: Match) => {
	const allTvsAreTheSame = a.tvs.every((tv) => b.tvs.includes(tv));
	const startTimeIsTheSame = a.time === b.time;

	return allTvsAreTheSame && startTimeIsTheSame;
};
export const matchesAreEqual = (a: Match[], b: Match[]) => {
	return (
		a.length === b.length &&
		a.every((match, index) => matchIsEqual(match, b[index]))
	);
};

export const getMatches = getMatchesFromParser;
