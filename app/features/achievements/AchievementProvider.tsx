import { getDrinkLogs } from "@/lib/storage/drinkLogs";
import {
  getProgramDays,
  getProgramStartDate,
} from "@/lib/storage/onboarding";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  getUnlockedAccessories,
  unlockAccessory,
} from "../avatar/accessoriesStorage";
import { Achievement } from "./AchievementCard";
import AchievementNotification from "./AchievementNotification";
import { achievementRewards } from "./achievementRewards";
import {
  getUnlockedAchievementIds,
  saveUnlockedAchievementIds,
} from "./achievementStorage";
import { getAllAchievements, isAchievementCompleted } from "./achievementRules";

type Props = {
  children: ReactNode;
};

type AchievementContextValue = {
  checkAchievements: () => Promise<void>;
  accessoryVersion: number;
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
  const [visibleRewardId, setVisibleRewardId] = useState<string | null>(null);
  const [accessoryVersion, setAccessoryVersion] = useState(0);

  useEffect(() => {
    checkAchievements();
  }, []);

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

  function showAchievement(
    achievement: Achievement,
    rewardId: string | null,
  ) {
    setVisibleAchievement(achievement);
    setVisibleRewardId(rewardId);

    setTimeout(() => {
      setVisibleAchievement(null);
      setVisibleRewardId(null);
    }, 3000);
  }

  async function checkAchievements() {
    const logs = await getDrinkLogs();
    const storedDiaryEntries = await AsyncStorage.getItem("diary_entries");

    const programStartDate = await getProgramStartDate();
    const daysInProgram = programStartDate
      ? getProgramDays(programStartDate)
      : 0;

    const diaryEntries = storedDiaryEntries
      ? JSON.parse(storedDiaryEntries)
      : [];
    const achievements = getAllAchievements(logs, diaryEntries, daysInProgram);
    const unlockedIds = await getUnlockedAchievementIds();
    const newAchievement = findNewAchievement(achievements, unlockedIds);

    if (!newAchievement) {
      return;
    }

    //lås opp accessories
    const rewardId = achievementRewards[newAchievement.id];

    if (rewardId) {
      const unlockedAccessories = await getUnlockedAccessories();

      if (!unlockedAccessories.includes(rewardId)) {
        await unlockAccessory(rewardId);
        setAccessoryVersion((version) => version + 1);
      }
    }

    showAchievement(newAchievement, rewardId ?? null);
    await saveUnlockedAchievementIds([...unlockedIds, newAchievement.id]);
  }

  return (
    <AchievementContext value={{ checkAchievements, accessoryVersion }}>
      {children}
      <AchievementNotification
        achievement={visibleAchievement}
        rewardAccessoryId={visibleRewardId}
      />
    </AchievementContext>
  );
}
