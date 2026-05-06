import AsyncStorage from "@react-native-async-storage/async-storage";

export type DrinkLogEntry = {
  date: string;
  beerCount: number;
  wineCount: number;
  drinksCount: number;
};

const DRINK_LOG_KEY = "drinkLogs";

function createDateKey(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}-${month}-${day}`;
}

export async function saveDrinkLog(
  date: Date,
  beerCount: number,
  wineCount: number,
  drinksCount: number,
) {
  const newLog: DrinkLogEntry = {
    date: createDateKey(date),
    beerCount,
    wineCount,
    drinksCount,
  };

  const oldLogs = await getDrinkLogs();

  function isSameDay(log: DrinkLogEntry) {
    return log.date === newLog.date;
  }
  const existingLog = oldLogs.find(isSameDay);

  if (existingLog) {
    const updatedLogs = oldLogs.map((log) => {
      if (log.date === newLog.date) {
        return {
          date: log.date,
          beerCount: log.beerCount + newLog.beerCount,
          wineCount: log.wineCount + newLog.wineCount,
          drinksCount: log.drinksCount + newLog.drinksCount,
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
