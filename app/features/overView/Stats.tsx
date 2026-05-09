import {
    DrinkLogEntry,
    getLogsForLastDays,
    getTotalDrinks,
    getWhiteDayCount,
} from "@/lib/storage/drinkLogs";
import { Text, View } from "react-native";

type props = {
  logs: DrinkLogEntry[];
};

export default function Stats({ logs }: props) {
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
    <View>
      <Text>De siste 30 dager</Text>
      <Text>Hvite dager: {totalWhiteDaysPerMonth(logs)}</Text>
      <Text>
        Gjennomsnittlig hvite dager {averageWhiteDaysPerMonth(logs).toFixed(2)}
      </Text>
      <Text>antall drikker: {totalDrinksThisMonth(logs)}</Text>
      <Text>
        Gjennomsnittlig drikke per dag:{" "}
        {averageDrinksPerDayThisMonth(logs).toFixed(2)}
      </Text>
    </View>
  );
}

/**

 
 
 getLogsForLastDays 
 
 getDrinkingDayCount
 
 getWhiteDayCount
 
 getLogsForThisWeek
 
 getLogsForWeek
 
 getNotLoggedDayCount
 
 getDateFromKey
 
 isWhiteDay
 
 isDrinkDay
 
 getTotalDrinks
 */

/**
 *
 * average white days per week
 *
 * drinking days
 *
 * average drinks per week
 */
