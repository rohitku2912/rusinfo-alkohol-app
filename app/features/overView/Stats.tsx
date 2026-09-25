import theme from "@/app/theme/constantStyling";
import { AppColors, useAppTheme } from "@/app/theme/ThemeProvider";
import {
  DrinkLogEntry,
  getLogsForLastDays,
  getTotalDrinks,
  getWhiteDayCount,
} from "@/lib/storage/drinkLogs";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  logs: DrinkLogEntry[];
};

export default function Stats({ logs }: Props) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  function totalWhiteDaysPerMonth(logs: DrinkLogEntry[]) {
    const last30DaysLogs = getLogsForLastDays(logs, 30);
    return getWhiteDayCount(last30DaysLogs);
  }

  function averageWhiteDaysPerMonth(logs: DrinkLogEntry[]) {
    const totalWhiteDays = totalWhiteDaysPerMonth(logs);
    return totalWhiteDays / 30;
  }

  //avg drikke per dag siste 30 dager
  function totalDrinksThisMonth(logs: DrinkLogEntry[]) {
    const last30DaysLogs = getLogsForLastDays(logs, 30);
    let totalDrinks = 0;
    for (const log of last30DaysLogs) {
      totalDrinks += getTotalDrinks(log);
    }
    return totalDrinks;
  }

  function averageDrinksPerDayThisMonth(logs: DrinkLogEntry[]) {
    const totalDrinks = totalDrinksThisMonth(logs);
    return totalDrinks / 30;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>De siste 30 dager</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Hvite dager</Text>
        <Text style={styles.value}>{totalWhiteDaysPerMonth(logs)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Gj.snitt hvite dager</Text>
        <Text style={styles.value}>
          {averageWhiteDaysPerMonth(logs).toFixed(2)}
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Antall drikker</Text>
        <Text style={styles.value}>{totalDrinksThisMonth(logs)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Gj.snitt drikke per dag</Text>
        <Text style={styles.value}>
          {averageDrinksPerDayThisMonth(logs).toFixed(2)}
        </Text>
      </View>
    </View>
  );
}

const createStyles = (colors: AppColors) => StyleSheet.create({
  container: {
    backgroundColor: colors.box,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.medium,
    marginHorizontal: theme.spacing.medium,
    gap: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.medium,
  },
  label: {
    flex: 1,
    fontSize: 13,
    color: colors.darkGrey,
  },
  value: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.primary,
  },
});
