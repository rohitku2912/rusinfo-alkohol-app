import { DrinkLogEntry, getDrinkLogs } from "@/lib/storage/drinkLogs";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { View } from "react-native";
import DrinkChart from "../features/overView/DrinkChart";
import Goals from "../features/overView/Goals";

export default function DrinkLog() {
  const [logs, setLogs] = useState<DrinkLogEntry[]>([]);

  async function loadLogs() {
    const storedLogs = await getDrinkLogs();
    setLogs(storedLogs);
  }

  //må bruke useFocusEffect og useCallBack for å få oppdatert oversikten når innhold endres.
  //virker ikke med useEffect med mindre man deler state mellom
  useFocusEffect(
    useCallback(() => {
      loadLogs();
    }, []),
  );

  return (
    <View>
      <DrinkChart logs={logs} />
      <Goals logs={logs} />
    </View>
  );
}
