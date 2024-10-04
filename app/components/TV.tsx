import { useMemo } from "react";

const colors = [
	"bg-teal-200 dark:bg-teal-800",
	"bg-indigo-200 dark:bg-indigo-800",
	"bg-blue-200 dark:bg-blue-800",
	"bg-pink-200 dark:bg-pink-800",
	"bg-red-200 dark:bg-red-800",
	"bg-orange-200 dark:bg-orange-800",
	"bg-yellow-200 dark:bg-yellow-800",
	"bg-green-200 dark:bg-green-800",
	"bg-cyan-200 dark:bg-cyan-800",
	"bg-purple-200 dark:bg-purple-800",
];

// Keep track of the last used color index outside of the component
let lastColorIndex = -1;

// Map to store color assignments for first words
const colorMap = new Map<string, string>();

export const TV = ({ name }: { name: string }) => {
	const colorClass = useMemo(() => {
		const firstWord = name.split(/\s+/)[0];
		return getColorFromName(firstWord);
	}, [name]);

	return (
		<a
			href={`https://search.brave.com/search?q=${encodeURIComponent(name)}`}
			className={`text-gray-900 dark:text-gray-100 rounded-md p-1 text-center ${colorClass} hover:saturate-200 hover:brightness-110 transition flex items-center justify-center`}
			target="_blank"
			rel="noreferrer"
		>
			{name}
		</a>
	);
};

// Helper function to get a color class from a string
function getColorFromName(name: string): string {
	if (colorMap.has(name)) {
		return colorMap.get(name);
	}

	// Get the next color index, ensuring it's different from the last used one
	let colorIndex: number;
	do {
		colorIndex = (lastColorIndex + 1) % colors.length;
	} while (colorIndex === lastColorIndex && colors.length > 1);

	lastColorIndex = colorIndex;
	const color = colors[colorIndex];
	colorMap.set(name, color);
	return color;
}
