import AsyncStorage from "@react-native-async-storage/async-storage";

const UNLOCKED_ACHIEVEMENTS_KEY = "unlockedAchievements";

export async function getUnlockedAchievementIds() {
  const storedIds = await AsyncStorage.getItem(UNLOCKED_ACHIEVEMENTS_KEY);

  if (!storedIds) {
    return [];
  }

  return JSON.parse(storedIds) as string[];
}

export async function saveUnlockedAchievementIds(ids: string[]) {
  await AsyncStorage.setItem(UNLOCKED_ACHIEVEMENTS_KEY, JSON.stringify(ids));
}
