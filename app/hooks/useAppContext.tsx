import {
  createContext,
  useState,
  useContext,
  type ReactNode,
  useMemo,
} from "react";

type LoadingType = "team" | "timezone" | false;

interface AppContextType {
  country: string;
  team: string;
  timezone: string;
  setTimezone: (timezone: string) => void;
  setCountry: (country: string) => void;
  setTeam: (team: string) => void;
  loadingData: LoadingType;
  setLoadingData: (loadingData: LoadingType) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [country, setCountry] = useState("spain");
  const [team, setTeam] = useState("real-madrid");
  const browserTimezone = useMemo(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone,
    []
  );
  const [timezone, setTimezone] = useState(browserTimezone);
  const [loadingData, setLoadingData] = useState<LoadingType>(false);

  const value = {
    country,
    team,
    timezone,
    setCountry,
    setTeam,
    setTimezone,
    loadingData,
    setLoadingData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
