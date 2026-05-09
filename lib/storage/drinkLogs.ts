import { createDateKey, getWeekStart } from "@/app/utils/weekHelpers";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type DrinkLogEntry = {
  date: string;
  beerCount: number;
  wineCount: number;
  drinksCount: number;
  status: "drakk" | "hvitDag";
};

const DRINK_LOG_KEY = "drinkLogs";

//hjelpere
export function getTotalDrinks(log: DrinkLogEntry) {
  return log.beerCount + log.wineCount + log.drinksCount;
}

export function isDrinkDay(log: DrinkLogEntry) {
  return log.status === "drakk";
}

export function isWhiteDay(log: DrinkLogEntry) {
  return log.status === "hvitDag";
}

function getDateFromKey(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function getNotLoggedDayCount(logs: DrinkLogEntry[], days: number) {
  return days - logs.length;
}

//hjelpere ferdig^

//få stats
export function getLogsForWeek(logs: DrinkLogEntry[], start: Date, end: Date) {
  return logs.filter((log) => {
    const logDate = getDateFromKey(log.date);

    return logDate >= start && logDate <= end;
  });
}
export function getLogsForThisWeek(logs: DrinkLogEntry[]) {
  const today = new Date();
  const startOfWeek = getWeekStart(today);
  const end = new Date(today);

  end.setHours(23, 59, 59, 999);

  return getLogsForWeek(logs, startOfWeek, end);
}

export function getWhiteDayCount(logs: DrinkLogEntry[]) {
  return logs.filter(isWhiteDay).length;
}
export function getDrinkingDayCount(logs: DrinkLogEntry[]) {
  return logs.filter(isDrinkDay).length;
}

export function getLogsForLastDays(logs: DrinkLogEntry[], days: number) {
  const today = new Date();
  const startDate = new Date(today);

  startDate.setDate(today.getDate() - days + 1);

  return logs.filter((log) => {
    const logDate = getDateFromKey(log.date);
    return logDate >= startDate && logDate <= today;
  });
}
//stats ferdig^

export async function saveDrinkLog(
  date: Date,
  beerCount: number,
  wineCount: number,
  drinksCount: number,
  status: "drakk" | "hvitDag",
) {
  const newLog: DrinkLogEntry = {
    date: createDateKey(date),
    beerCount,
    wineCount,
    drinksCount,
    status,
  };

  const oldLogs = await getDrinkLogs();

  function isSameDay(log: DrinkLogEntry) {
    return log.date === newLog.date;
  }
  const existingLog = oldLogs.find(isSameDay);

  if (existingLog) {
    const updatedLogs = oldLogs.map((log) => {
      if (log.date === newLog.date) {
        if (status === "hvitDag") {
          return newLog;
        }
        return {
          date: log.date,
          beerCount: log.beerCount + newLog.beerCount,
          wineCount: log.wineCount + newLog.wineCount,
          drinksCount: log.drinksCount + newLog.drinksCount,
          status: "drakk",
        };
      }
      return log;
    });
    await AsyncStorage.setItem(DRINK_LOG_KEY, JSON.stringify(updatedLogs));
    return;
  }
  const newLogs = [...oldLogs, newLog];

  await AsyncStorage.setItem(DRINK_LOG_KEY, JSON.stringify(newLogs));
}

export async function getDrinkLogs(): Promise<DrinkLogEntry[]> {
  const storedLogs = await AsyncStorage.getItem(DRINK_LOG_KEY);

  if (!storedLogs) {
    return [];
  }

  return JSON.parse(storedLogs);
}

export async function clearDrinkLogs() {
  await AsyncStorage.removeItem(DRINK_LOG_KEY);
}
