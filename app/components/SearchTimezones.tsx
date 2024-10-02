import { useMemo, useState } from "react";
import { Dropdown } from "./Dropdown";
import { useAppContext } from "../hooks/useAppContext";

const getLabel = (timezone: string) => {
  return timezone.split("/").pop();
};
const getTimezoneItem = (timezone: string) => {
  return {
    label: getLabel(timezone),
    value: timezone,
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
