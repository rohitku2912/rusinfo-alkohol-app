import theme from "@/app/theme/constantStyling";
import { createDateKey } from "@/app/utils/weekHelpers";
import { DrinkLogEntry, getTotalDrinks } from "@/lib/storage/drinkLogs";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";

type Props = {
  logs: DrinkLogEntry[];
};

type chartTimeBack = "7days" | "6weeks" | "6months";

function getDayName(date: Date) {
  return date.toLocaleDateString("nb-NO", {
    weekday: "short",
  });
}

function getWeeknumber(index: number) {
  if (index === 5) {
    return "Denne";
  }

  return `${5 - index} u`;
}

function chooseDayWeekMonth(
  logs: DrinkLogEntry[],
  selectedRange: chartTimeBack,
) {
  if (selectedRange === "7days") {
    return createSevenDayChartData(logs);
  }

  if (selectedRange === "6weeks") {
    return createSixWeekChartData(logs);
  }

  return createSixMonthChartData(logs);
}

//lag liste med 7 dager med riktig styling basert på hva som har blitt logget de siste 7 dagene
function createSevenDayChartData(logs: DrinkLogEntry[]) {
  const today = new Date();
  const chartData = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - i));
    const dateKey = createDateKey(date);
    const logForDay = logs.find((log) => log.date === dateKey);

    //hvis det ikke er loggget
    if (!logForDay) {
      chartData.push({
        label: getDayName(date),
        value: 0.5,
        frontColor: "#d8d0c8",
      });
      //hvis det er logget hvit dag
    } else if (logForDay.status === "hvitDag") {
      chartData.push({
        label: getDayName(date),
        value: 0.5,
        frontColor: "#37de00",
      });
      //hvis det er logget drikke
    } else {
      chartData.push({
        label: getDayName(date),
        value: getTotalDrinks(logForDay),
        frontColor: theme.colors.primary,
      });
    }
  }
  return chartData;
}

function createSixWeekChartData(logs: DrinkLogEntry[]) {
  const today = new Date();
  const chartData = [];

  //la loope 6 ganger
  for (let i = 0; i < 6; i++) {
    const endOfWeek = new Date(today);
    //sett endofweek til å være i dag, så trekk fra i for å få rett uke.
    endOfWeek.setDate(today.getDate() - (5 - i) * 7);

    //lag en uke mellom startofweek og endofweek
    const startOfWeek = new Date(endOfWeek);
    startOfWeek.setDate(endOfWeek.getDate() - 6);

    let totalDrinksForWeek = 0;

    //legg til drikke for hver dag i uken
    for (const log of logs) {
      const logDate = new Date(log.date);

      if (logDate >= startOfWeek && logDate <= endOfWeek) {
        totalDrinksForWeek += getTotalDrinks(log);
      }
    }

    if (totalDrinksForWeek === 0) {
      chartData.push({
        label: getWeeknumber(i),
        value: 0.5,
        frontColor: "#d8d0c8",
      });
    } else {
      chartData.push({
        label: getWeeknumber(i),
        value: totalDrinksForWeek,
        frontColor: theme.colors.primary,
      });
    }
  }

  return chartData;
}

function createSixMonthChartData(logs: DrinkLogEntry[]) {
  const today = new Date();
  const chartData = [];

  //la loope 6 ganger
  for (let i = 0; i < 6; i++) {
    const monthsAgo = 5 - i;

    //finn start på måneden ved å sette dato til 1
    const startOfMonth = new Date(
      today.getFullYear(),
      today.getMonth() - monthsAgo,
      1,
    );
    //finn slutten av måneden ved å finne måneden pluss 1(neste måned) og sette dato til 0, som er siste dag i forige måned
    const endOfMonth = new Date(
      today.getFullYear(),
      today.getMonth() - monthsAgo + 1,
      0,
    );

    let totalDrinksForMonth = 0;

    for (const log of logs) {
      const logDate = new Date(log.date);

      if (logDate >= startOfMonth && logDate <= endOfMonth) {
        totalDrinksForMonth += getTotalDrinks(log);
      }
    }

    if (totalDrinksForMonth === 0) {
      chartData.push({
        label: startOfMonth.toLocaleDateString("nb-NO", { month: "short" }),
        value: 0.5,
        frontColor: "#d8d0c8",
      });
    } else {
      chartData.push({
        label: startOfMonth.toLocaleDateString("nb-NO", { month: "short" }),
        value: totalDrinksForMonth,
        frontColor: theme.colors.primary,
      });
    }
  }

  return chartData;
}

export default function DrinkChart({ logs }: Props) {
  const [chartRange, setChartRange] = useState<chartTimeBack>("7days");

  const chartData = chooseDayWeekMonth(logs, chartRange);

  const highestValue = Math.max(...chartData.map((item) => item.value));
  const maxValue = Math.max(highestValue, 10);
  return (
    <View style={styles.container}>
      <View style={styles.ButtonContainer}>
        <Pressable
          style={styles.TimeButton}
          onPress={() => setChartRange("7days")}
        >
          <Text>Siste 7 dager</Text>
        </Pressable>

        <Pressable
          style={styles.TimeButton}
          onPress={() => setChartRange("6weeks")}
        >
          <Text>Siste 6 uker</Text>
        </Pressable>

        <Pressable
          style={styles.TimeButton}
          onPress={() => setChartRange("6months")}
        >
          <Text>Siste 6 måneder</Text>
        </Pressable>
      </View>

      <BarChart
        data={chartData}
        barWidth={24}
        spacing={20}
        roundedTop
        xAxisThickness={0}
        yAxisThickness={0}
        noOfSections={4}
        maxValue={maxValue}
        height={140}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.small,
    marginHorizontal: theme.spacing.medium,
    marginTop: theme.spacing.small,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: theme.colors.text,
  },
  legend: {
    marginTop: theme.spacing.medium,
    gap: 4,
  },
  ButtonContainer: {
    flexDirection: "row",
    gap: theme.spacing.small,
    marginBottom: 4,
  },
  TimeButton: {
    padding: theme.spacing.small,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.small,
  },
});
