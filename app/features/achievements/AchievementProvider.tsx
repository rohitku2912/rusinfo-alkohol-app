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
import { getWhitePartyCount } from "./whitePartyStorage";

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
  const [visibleAchievements, setVisibleAchievements] = useState<
    Achievement[]
  >([]);
  const [visibleRewardId, setVisibleRewardId] = useState<string | null>(null);
  const [accessoryVersion, setAccessoryVersion] = useState(0);

  useEffect(() => {
    checkAchievements();
  }, []);

  function findNewAchievements(
    achievements: Achievement[],
    unlockedIds: string[],
  ) {
    return achievements.filter(
      (achievement) =>
        isAchievementCompleted(achievement) &&
        !unlockedIds.includes(achievement.id),
    );
  }

  function showAchievements(
    achievements: Achievement[],
    rewardId: string | null,
  ) {
    setVisibleAchievements(achievements);
    setVisibleRewardId(rewardId);

    if (achievements.length === 1) {
      setTimeout(() => {
        setVisibleAchievements([]);
        setVisibleRewardId(null);
      }, 4000);
    }
  }

  function dismissNotification() {
    setVisibleAchievements([]);
    setVisibleRewardId(null);
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
    const whitePartyCount = await getWhitePartyCount();
    const achievements = getAllAchievements(
      logs,
      diaryEntries,
      daysInProgram,
      whitePartyCount,
    );
    const unlockedIds = await getUnlockedAchievementIds();
    const newAchievements = findNewAchievements(achievements, unlockedIds);

    if (newAchievements.length === 0) {
      return;
    }

    const unlockedAccessories = await getUnlockedAccessories();
    let unlockedNewAccessory = false;

    for (const achievement of newAchievements) {
      const rewardId = achievementRewards[achievement.id];

      if (rewardId && !unlockedAccessories.includes(rewardId)) {
        await unlockAccessory(rewardId);
        unlockedAccessories.push(rewardId);
        unlockedNewAccessory = true;
      }
    }

    if (unlockedNewAccessory) {
      setAccessoryVersion((version) => version + 1);
    }

    const singleRewardId =
      newAchievements.length === 1
        ? achievementRewards[newAchievements[0].id] ?? null
        : null;

    showAchievements(newAchievements, singleRewardId);
    await saveUnlockedAchievementIds([
      ...new Set([
        ...unlockedIds,
        ...newAchievements.map((achievement) => achievement.id),
      ]),
    ]);
  }

  return (
    <AchievementContext value={{ checkAchievements, accessoryVersion }}>
      {children}
      <AchievementNotification
        achievements={visibleAchievements}
        onDismiss={dismissNotification}
        rewardAccessoryId={visibleRewardId}
      />
    </AchievementContext>
  );
}
