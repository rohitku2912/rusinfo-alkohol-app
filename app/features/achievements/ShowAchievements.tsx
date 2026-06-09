import { DrinkLogEntry, getDrinkLogs } from "@/lib/storage/drinkLogs";
import {
  getProgramDays,
  getProgramStartDate,
} from "@/lib/storage/onboarding";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ScrollView } from "react-native";
import AchievementCard from "./AchievementCard";
import {
  DiaryEntry,
  getAllAchievements,
  keepUnlockedAchievementsCompleted,
} from "./achievementRules";
import { getUnlockedAchievementIds } from "./achievementStorage";

export default function ShowAchievements() {
  const [logs, setLogs] = useState<DrinkLogEntry[]>([]);
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
  const [daysInProgram, setDaysInProgram] = useState(0);
  const [unlockedIds, setUnlockedIds] = useState<string[]>([]);

  useFocusEffect(
    useCallback(() => {
      async function loadData() {
        const storedLogs = await getDrinkLogs();
        setLogs(storedLogs);

        const storedDiaryEntries = await AsyncStorage.getItem("diary_entries");
        setDiaryEntries(
          storedDiaryEntries ? JSON.parse(storedDiaryEntries) : [],
        );

        const startDate = await getProgramStartDate();
        const days = startDate ? getProgramDays(startDate) : 0;
        setDaysInProgram(days);

        setUnlockedIds(await getUnlockedAchievementIds());
      }

      loadData();
    }, []),
  );

  const achievements = keepUnlockedAchievementsCompleted(
    getAllAchievements(logs, diaryEntries, daysInProgram),
    unlockedIds,
  );

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
      {achievements.map((achievement) => (
        <AchievementCard key={achievement.id} achievement={achievement} />
      ))}
    </ScrollView>
  );
}
