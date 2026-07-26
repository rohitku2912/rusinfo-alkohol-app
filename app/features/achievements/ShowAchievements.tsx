import { DrinkLogEntry, getDrinkLogs } from "@/lib/storage/drinkLogs";
import {
  getProgramDays,
  getProgramStartDate,
} from "@/lib/storage/onboarding";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Animated, StyleProp, ViewStyle } from "react-native";
import AchievementCard from "./AchievementCard";
import {
  DiaryEntry,
  getAllAchievements,
  keepUnlockedAchievementsCompleted,
} from "./achievementRules";
import { getUnlockedAchievementIds } from "./achievementStorage";
import { getWhitePartyCount } from "./whitePartyStorage";

type ShowAchievementsProps = {
  contentContainerStyle?: StyleProp<ViewStyle>;
  scrollY?: Animated.Value;
};

export default function ShowAchievements({
  contentContainerStyle,
  scrollY,
}: ShowAchievementsProps) {
  const [logs, setLogs] = useState<DrinkLogEntry[]>([]);
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
  const [daysInProgram, setDaysInProgram] = useState(0);
  const [whitePartyCount, setWhitePartyCount] = useState(0);
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

        setWhitePartyCount(await getWhitePartyCount());
        setUnlockedIds(await getUnlockedAchievementIds());
      }

      loadData();
    }, []),
  );

  const achievements = keepUnlockedAchievementsCompleted(
    getAllAchievements(logs, diaryEntries, daysInProgram, whitePartyCount),
    unlockedIds,
  ).sort((first, second) => {
    const firstCompleted = first.currentProgress >= first.goal;
    const secondCompleted = second.currentProgress >= second.goal;

    return Number(secondCompleted) - Number(firstCompleted);
  });

  return (
    <Animated.ScrollView
      contentContainerStyle={[{ paddingBottom: 100 }, contentContainerStyle]}
      onScroll={
        scrollY
          ? Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: false },
            )
          : undefined
      }
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={false}
    >
      {achievements.map((achievement) => (
        <AchievementCard key={achievement.id} achievement={achievement} />
      ))}
    </Animated.ScrollView>
  );
}
