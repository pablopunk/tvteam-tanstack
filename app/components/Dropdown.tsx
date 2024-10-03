import { useEffect, useState } from "react";
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import clsx from "clsx";

interface Item {
  value: string;
  label: string;
  icon?: string;
}

interface Props<T extends Item> {
  items: T[];
  selected?: T | null;
  onChange: (item: T | null) => void;
  placeholder?: string;
  search?: (query: string) => void;
  showSelected?: "label" | "value";
}

export function Dropdown<T extends Item>({
  items,
  selected,
  onChange,
  placeholder = "Select an option...",
  search,
  showSelected = "label",
}: Props<T>) {
  const [query, setQuery] = useState("");
  const [selectOption, setSelectOption] = useState<T | null>(selected);

  useEffect(() => {
    setSelectOption(selected);
  }, [selected]);

  useEffect(() => {
    if (query?.length > 2) {
      search?.(query);
    }
  }, [query, search]);

  const filteredItems =
    query === ""
      ? items
      : search
        ? items
        : items.filter((item) =>
          item.label.toLowerCase().includes(query.toLowerCase())
        );

  return (
    <div className="relative max-w-fit">
      <Combobox value={selectOption} onChange={onChange}>
        <div className="relative">
          <ComboboxInput
            className={clsx(
              "relative font-bold w-full rounded-lg border-none py-1.5 pr-8 pl-3 text-sm/6",
              "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100",
              "focus:ring-blue-500 focus:border-blue-500"
            )}
            displayValue={(item: T | null) => item?.[showSelected] || ""}
            onChange={(event) => setQuery(event.target?.value)}
            placeholder={placeholder}
            onClick={() => {
              setSelectOption(null);
              setQuery("");
            }}
          />
        </div>

        <ComboboxOptions
          className={clsx(
            "absolute max-w-full w-full mt-1 h-50 max-h-60 overflow-auto rounded-md py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm",
            "bg-white dark:bg-gray-800",
            "scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-700"
          )}
        >
          {filteredItems.map((item) => (
            <ComboboxOption
              key={item?.value}
              value={item}
              className={({ active }) =>
                clsx(
                  "cursor-default select-none relative py-2 pl-3 pr-9",
                  active
                    ? "text-white bg-blue-600"
                    : "text-gray-900 dark:text-gray-200"
                )
              }
            >
              {({ selected, active }) => (
                <>
                  <span
                    className={clsx(
                      "block truncate",
                      selected && "font-semibold"
                    )}
                  >
                    {item.icon && <span className="mr-2">{item.icon}</span>}
                    {item.label}
                  </span>
                  {selected && (
                    <span
                      className={clsx(
                        "absolute inset-y-0 right-0 flex items-center pr-4",
                        active ? "text-white" : "text-blue-600"
                      )}
                    >
                      <CheckIcon className="h-5 w-5" aria-hidden="true" />
                    </span>
                  )}
                </>
              )}
            </ComboboxOption>
          ))}
        </ComboboxOptions>
      </Combobox>
    </div>
  );
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" {...props}>
      <title>Check</title>
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}
