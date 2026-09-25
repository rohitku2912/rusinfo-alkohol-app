import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { Appearance } from "react-native";

const THEME_MODE_KEY = "app_theme_mode";

type ThemeMode = "light" | "dark";

export const lightColors = {
  background: "#DCE0D4",
  backgroundSecondary: "#EEF0EA",
  box: "#FFFFFF",
  border: "#D6E0DA",
  darkGrey: "#424242",
  lightGrey: "#E2E1E1",
  text: "#1F2A24",
  primary: "#5E9C76",
  primarySoft: "#EAF4EE",
  surfaceMuted: "#F6F8F6",
  dangerSoft: "#FFF1F2",
  warningSoft: "#FFF4D2",
  attention: "#E53935",
  accent: "#FFC107",
  lightText: "#FFFFFF",
  buttonText: "#FFFAF3",
  no: "#EA6648",
  yes: "#3DC15E",
  riskLow: "#5E9C76",
  riskIncreasing: "#D6A53A",
  riskHigh: "#D97845",
  riskVeryHigh: "#C74747",
} as const;

export const darkColors = {
  background: "#111713",
  backgroundSecondary: "#18201C",
  box: "#1B2420",
  border: "#3A4640",
  darkGrey: "#B8C3BC",
  lightGrey: "#303A34",
  text: "#F2F5F3",
  primary: "#79B68F",
  primarySoft: "#24372B",
  surfaceMuted: "#202A25",
  dangerSoft: "#3A2428",
  warningSoft: "#3A321D",
  attention: "#FF7B7B",
  accent: "#FFD54F",
  lightText: "#FFFFFF",
  buttonText: "#FFFFFF",
  no: "#F07A61",
  yes: "#62CE7D",
  riskLow: "#8FD0A7",
  riskIncreasing: "#F2C75C",
  riskHigh: "#F0A06B",
  riskVeryHigh: "#FF8A8A",
} as const;

export type AppColors = {
  [Key in keyof typeof lightColors]: string;
};

type ThemeContextValue = {
  colors: AppColors;
  isDark: boolean;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => Promise<void>;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: PropsWithChildren) {
  const [mode, setModeState] = useState<ThemeMode>("light");

  useEffect(() => {
    const loadTheme = async () => {
      const storedMode = await AsyncStorage.getItem(THEME_MODE_KEY);
      const nextMode: ThemeMode = storedMode === "dark" ? "dark" : "light";

      Appearance.setColorScheme(nextMode);
      setModeState(nextMode);
    };

    void loadTheme();
  }, []);

  const setMode = async (nextMode: ThemeMode) => {
    Appearance.setColorScheme(nextMode);
    setModeState(nextMode);
    await AsyncStorage.setItem(THEME_MODE_KEY, nextMode);
  };

  return (
    <ThemeContext.Provider
      value={{
        colors: mode === "dark" ? darkColors : lightColors,
        isDark: mode === "dark",
        mode,
        setMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useAppTheme must be used inside ThemeProvider");
  }

  return context;
}
