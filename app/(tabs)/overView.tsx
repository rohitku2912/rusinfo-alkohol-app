import { AppColors, useAppTheme } from "@/app/theme/ThemeProvider";
import {
  DrinkLogEntry,
  getDrinkLogs,
  getLogsForWeek,
} from "@/lib/storage/drinkLogs";
import {
  collectGoals,
  getWeeklyGoalsResult,
  saveWeeklyGoalsResult,
  WeeklyGoalsResult,
} from "@/lib/storage/goals";
import { useFocusEffect } from "expo-router/react-navigation";
import { useCallback, useRef, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AnimatedTabHeader, {
  getAnimatedTabHeaderTopPadding,
} from "../components/ui/AnimatedTabHeader";
import AvatarButton from "../components/ui/avatarButton";
import HelpButton from "../features/help/HelpButton";
import DrinkChart from "../features/overView/DrinkChart";
import Goals from "../features/overView/Goals";
import Stats from "../features/overView/Stats";
import theme from "../theme/constantStyling";
import { getPreviousWeek } from "../utils/weekHelpers";

export default function OverView() {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const insets = useSafeAreaInsets();
  const headerScrollY = useRef(new Animated.Value(0)).current;
  const [logs, setLogs] = useState<DrinkLogEntry[]>([]);
  const [lastWeekResult, setLastWeekResult] =
    useState<WeeklyGoalsResult | null>(null);

  //må bruke useFocusEffect og useCallBack for å få oppdatert oversikten når innhold endres.
  //virker ikke med useEffect med mindre man deler state mellom
  useFocusEffect(
    useCallback(() => {
      loadLogs();
    }, []),
  );

  async function saveLastWeekResult(storedLogs: DrinkLogEntry[]) {
    const lastWeek = getPreviousWeek();
    const lastWeekLogs = getLogsForWeek(
      storedLogs,
      lastWeek.start,
      lastWeek.end,
    );

    const goals = await collectGoals();

    const result = getWeeklyGoalsResult(lastWeek.key, lastWeekLogs, goals);
    await saveWeeklyGoalsResult(result);
    setLastWeekResult(result);
  }

  async function loadLogs() {
    const storedLogs = await getDrinkLogs();
    setLogs(storedLogs);
    await saveLastWeekResult(storedLogs);
  }

  function showLastWeekResult() {
    if (!lastWeekResult) {
      return null;
    }

    return (
      <View style={styles.lastWeekCard}>
        <Text style={styles.lastWeekTitle}>Forrige uke</Text>
        <View style={styles.resultLine}>
          <Text style={styles.resultLabel}>Hvite dager</Text>

          <View style={styles.resultValue}>
            <View
              style={
                lastWeekResult.whiteDaysGoalAchieved
                  ? styles.successPill
                  : styles.failPill
              }
            >
              <Text style={styles.pillText}>
                {lastWeekResult.whiteDaysGoalAchieved ? "Nådd" : "Ikke nådd"}
              </Text>
            </View>

            <Text style={styles.resultText}>
              {lastWeekResult.whiteDaysResult}/{lastWeekResult.whiteDaysGoal}
            </Text>
          </View>
        </View>

        <View style={styles.resultLine}>
          <Text style={styles.resultLabel}>Alkoholgrense</Text>

          <View style={styles.resultValue}>
            <View
              style={
                lastWeekResult.maxDrinkGoalAchieved
                  ? styles.successPill
                  : styles.failPill
              }
            >
              <Text style={styles.pillText}>
                {lastWeekResult.maxDrinkGoalAchieved ? "Nådd" : "Ikke nådd"}
              </Text>
            </View>

            <Text style={styles.resultText}>
              {lastWeekResult.maxDrinksResult}/{lastWeekResult.maxDrinksGoal}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <AnimatedTabHeader
        title="Oversikt"
        scrollY={headerScrollY}
        titleAccessory={<HelpButton helpKey="overview" />}
        rightSlot={<AvatarButton />}
      />
      <Animated.ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: getAnimatedTabHeaderTopPadding(insets.top) },
        ]}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: headerScrollY } } }],
          { useNativeDriver: false },
        )}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <Goals logs={logs} />
        {showLastWeekResult()}
        <Stats logs={logs} />
        <DrinkChart logs={logs} />
      </Animated.ScrollView>
    </View>
  );
}

const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      paddingBottom: 130,
    },
    lastWeekCard: {
      backgroundColor: colors.box,
      borderRadius: theme.borderRadius.medium,
      padding: theme.spacing.medium,
      marginHorizontal: theme.spacing.medium,
      marginBottom: theme.spacing.small,
      gap: 6,
    },
    lastWeekTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 2,
    },
    resultText: {
      fontSize: 14,
      fontWeight: "700",
      color: colors.primary,
    },
    successPill: {
      backgroundColor: colors.primarySoft,
      borderColor: colors.primary,
      borderWidth: 1,
      borderRadius: 999,
      paddingHorizontal: 8,
      paddingVertical: 3,
    },
    failPill: {
      backgroundColor: colors.dangerSoft,
      borderColor: colors.attention,
      borderWidth: 1,
      borderRadius: 999,
      paddingHorizontal: 8,
      paddingVertical: 3,
    },
    pillText: {
      fontSize: 12,
      fontWeight: "700",
      color: colors.text,
    },
    resultLine: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: theme.spacing.small,
    },
    resultLabel: {
      fontSize: 14,
      color: colors.text,
      flex: 1,
    },
    resultValue: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
  });
