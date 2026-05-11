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
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import HelpButton from "../features/help/HelpButton";
import DrinkChart from "../features/overView/DrinkChart";
import Goals from "../features/overView/Goals";
import Stats from "../features/overView/Stats";
import theme from "../theme/constantStyling";
import { getPreviousWeek } from "../utils/weekHelpers";

export default function OverView() {
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
      <View style={styles.header}>
        <View>
          <Text style={styles.pageTitle}>Oversikt</Text>
        </View>
        <HelpButton helpKey="overview" />
      </View>
      <Goals logs={logs} />
      {showLastWeekResult()}
      <Stats logs={logs} />
      <DrinkChart logs={logs} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: theme.spacing.medium,
    marginBottom: 4,
  },
  pageTitle: {
    color: theme.colors.text,
    fontFamily: theme.fonts.heading,
    fontSize: 28,
    fontWeight: "700",
  },
  lastWeekCard: {
    backgroundColor: "#ffffff",
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.medium,
    marginHorizontal: theme.spacing.medium,
    marginBottom: theme.spacing.small,
    gap: 6,
  },
  lastWeekTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: 2,
  },
  resultText: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.primary,
  },
  successPill: {
    backgroundColor: "#E6F4EA",
    borderColor: theme.colors.primary,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  failPill: {
    backgroundColor: "#FDECEC",
    borderColor: theme.colors.attention,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  pillText: {
    fontSize: 12,
    fontWeight: "700",
    color: theme.colors.text,
  },
  resultLine: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.small,
  },
  resultLabel: {
    fontSize: 14,
    color: theme.colors.text,
    flex: 1,
  },
  resultValue: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});
