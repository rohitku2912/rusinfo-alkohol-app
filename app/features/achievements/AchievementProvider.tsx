import { getDrinkLogs } from "@/lib/storage/drinkLogs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";
import { Achievement } from "./AchievementCard";
import AchievementNotification from "./AchievementNotification";
import { getAllAchievements, isAchievementCompleted } from "./achievementRules";

const UNLOCKED_ACHIEVEMENTS_KEY = "unlockedAchievements";

type Props = {
  children: ReactNode;
};

type AchievementContextValue = {
  checkAchievements: () => Promise<void>;
};

// bruk context for å dele achievement state
const AchievementContext = createContext<AchievementContextValue | null>(null);

export function useAchievements() {
  const context = useContext(AchievementContext);

  if (!context) {
    throw new Error(
      "useAchievements must be used within an AchievementProvider",
    );
  }

  return context;
}

export default function AchievementProvider({ children }: Props) {
  const [visibleAchievement, setVisibleAchievement] =
    useState<Achievement | null>(null);

  useEffect(() => {
    checkAchievements();
  }, []);

  async function getUnlockedAchievementIds() {
    const storedIds = await AsyncStorage.getItem(UNLOCKED_ACHIEVEMENTS_KEY);

    if (!storedIds) {
      return [];
    }

    return JSON.parse(storedIds) as string[];
  }

  async function saveUnlockedAchievementIds(ids: string[]) {
    await AsyncStorage.setItem(UNLOCKED_ACHIEVEMENTS_KEY, JSON.stringify(ids));
  }

  function findNewAchievement(
    achievements: Achievement[],
    unlockedIds: string[],
  ) {
    return achievements.find(
      (achievement) =>
        isAchievementCompleted(achievement) &&
        !unlockedIds.includes(achievement.id),
    );
  }

  function showAchievement(achievement: Achievement) {
    setVisibleAchievement(achievement);

    setTimeout(() => {
      setVisibleAchievement(null);
    }, 3000);
  }

  async function checkAchievements() {
    const logs = await getDrinkLogs();
    const storedDiaryEntries = await AsyncStorage.getItem("diary_entries");

    const diaryEntries = storedDiaryEntries
      ? JSON.parse(storedDiaryEntries)
      : [];

    const achievements = getAllAchievements(logs, diaryEntries);
    const unlockedIds = await getUnlockedAchievementIds();
    const newAchievement = findNewAchievement(achievements, unlockedIds);

    if (!newAchievement) {
      return;
    }

    showAchievement(newAchievement);
    await saveUnlockedAchievementIds([...unlockedIds, newAchievement.id]);
  }

  return (
    <AchievementContext value={{ checkAchievements }}>
      {children}
      <AchievementNotification achievement={visibleAchievement} />
    </AchievementContext>
  );
}
