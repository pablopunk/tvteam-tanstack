export const teamNameUppercase = (teamName: string) => {
	return teamName.replace(/-/g, " ").toUpperCase();
};

export const teamNameCapitalized = (teamName: string) => {
	return teamName
		.replace(/-/g, " ")
		.replace(/\b\w/g, (char) => char.toUpperCase());
};
