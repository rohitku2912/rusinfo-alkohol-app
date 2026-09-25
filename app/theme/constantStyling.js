import { DynamicColorIOS, Platform, PlatformColor } from "react-native";

const adaptiveColor = (light, dark, androidColor) => {
  if (Platform.OS === "ios") {
    return DynamicColorIOS({ light, dark });
  }

  if (Platform.OS === "android") {
    return PlatformColor(androidColor);
  }

  return light;
};

const theme = {
  colors: {
    /**
     * Used for:
    main buttons
    progress highlights
    active states
    important positive actions
    */
    primary: "#5E9C76",
    /** */
    secondary: "rgb(162, 109, 109)",
    box: adaptiveColor("#FFFFFF", "#1B2420", "?attr/colorBackgroundFloating"),
    background: adaptiveColor("#dce0d4", "#111713", "?attr/colorBackground"),
    backgroundSecondary: adaptiveColor(
      "#dce0d478",
      "#111713B8",
      "?attr/windowBackground",
    ),
    accent: "#FFC107",
    attention: "#E53935",
    lightText: "#FFFFFF",
    lightGrey: adaptiveColor("#e2e1e1", "#303A34", "?attr/colorControlNormal"),
    darkGrey: adaptiveColor("#424242", "#B8C3BC", "?attr/textColorSecondary"),
    text: adaptiveColor("#1F2A24", "#F2F5F3", "?attr/textColorPrimary"),
    border: adaptiveColor("#d6e0da", "#3A4640", "?attr/colorControlNormal"),
    primarySoft: adaptiveColor(
      "#EAF4EE",
      "#24372B",
      "?attr/colorBackgroundFloating",
    ),
    surfaceMuted: adaptiveColor(
      "#f6f8f6",
      "#202A25",
      "?attr/colorBackgroundFloating",
    ),
    dangerSoft: adaptiveColor(
      "#fff1f2",
      "#3A2428",
      "?attr/colorBackgroundFloating",
    ),
    warningSoft: adaptiveColor(
      "#FFF4D2",
      "#3A321D",
      "?attr/colorBackgroundFloating",
    ),
    riskLow: adaptiveColor("#5E9C76", "#8FD0A7", "?attr/colorAccent"),
    riskIncreasing: adaptiveColor(
      "#D6A53A",
      "#F2C75C",
      "?attr/colorAccent",
    ),
    riskHigh: adaptiveColor("#D97845", "#F0A06B", "?attr/colorAccent"),
    riskVeryHigh: adaptiveColor(
      "#C74747",
      "#FF8A8A",
      "?attr/colorAccent",
    ),
    emergency: "#EF4444",
    buttonText: "#fffaf3",
    button: "#529255",
    no: "#ea6648",
    yes: "#3dc15e",
  },
  fonts: {
    main: "Arial",
    heading: "Roboto",
  },
  spacing: {
    small: 8,
    medium: 16,
    large: 24,
  },
  borderRadius: {
    small: 4,
    medium: 12,
    large: 24,
  },
  children: {
    colors: "red",
  },
};

export default theme;
