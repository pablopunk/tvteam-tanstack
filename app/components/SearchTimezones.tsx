import { useAppContext } from "@/hooks/useAppContext";
import { getTimezoneFlag } from "@/utils/flags";
import { useMemo } from "react";
import { Dropdown } from "./Dropdown";

const getLabel = (timezone: string) => {
	return timezone.split("/").pop();
};
const getTimezoneItem = (timezone: string) => {
	return {
		label: getLabel(timezone),
		value: timezone,
		icon: getTimezoneFlag(timezone),
	};
};

export const SearchTimezones = () => {
	const { timezone, setTimezone, setLoadingData } = useAppContext();
	const allBrowserTimezones = useMemo(() => {
		return Intl.supportedValuesOf("timeZone");
	}, []);
	const timezoneItem = useMemo(() => getTimezoneItem(timezone), [timezone]);

	return (
		<Dropdown
			items={allBrowserTimezones.map(getTimezoneItem)}
			selected={timezoneItem}
			onChange={(item) => {
				if (item?.value) {
					setTimezone(item.value);
					setLoadingData("timezone");
				}
			}}
			placeholder="Select a timezone"
			showSelected="value"
		/>
	);
};
