import { DrinkLogEntry, getDrinkLogs } from "@/lib/storage/drinkLogs";
import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";

export default function DrinkLog() {
  const [logs, setLogs] = useState<DrinkLogEntry[]>([]);

  async function loadLogs() {
    const storedLogs = await getDrinkLogs();
    setLogs(storedLogs);
  }

  useEffect(() => {
    loadLogs();
  }, []);

  return (
    <ScrollView>
      <Text>Drikklogg</Text>

      {logs.map((log) => (
        <View key={log.date}>
          <Text>{log.date}</Text>
          <Text>Øl: {log.beerCount}</Text>
          <Text>Vin: {log.wineCount}</Text>
          <Text>Drinker: {log.drinksCount}</Text>
        </View>
      ))}
    </ScrollView>
  );
}
