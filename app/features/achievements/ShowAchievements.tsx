import { DrinkLogEntry, getDrinkLogs } from "@/lib/storage/drinkLogs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ScrollView } from "react-native";
import AchievementCard from "./AchievementCard";
import { DiaryEntry, getAllAchievements } from "./achievementRules";

export default function ShowAchievements() {
  const [logs, setLogs] = useState<DrinkLogEntry[]>([]);
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);

  useFocusEffect(
    useCallback(() => {
      async function loadLogs() {
        const storedLogs = await getDrinkLogs();
        setLogs(storedLogs);
        const storedDiaryEntries = await AsyncStorage.getItem("diary_entries");
        if (storedDiaryEntries) {
          setDiaryEntries(JSON.parse(storedDiaryEntries));
        } else {
          setDiaryEntries([]);
        }
      }

      loadLogs();
    }, []),
  );

  const achievemt = getAllAchievements(logs, diaryEntries);

  return (
    <ScrollView>
      {achievemt.map((achievement) => (
        <AchievementCard key={achievement.id} achievement={achievement} />
      ))}
    </ScrollView>
  );
}
