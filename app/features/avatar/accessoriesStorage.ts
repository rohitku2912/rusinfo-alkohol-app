import AsyncStorage from "@react-native-async-storage/async-storage";

const UNLOCKED_ACCESSORIES_KEY = "unlockedAccessories";
const SELECTED_ACCESSORIES_KEY = "selectedAccessories";

export async function getUnlockedAccessories(): Promise<string[]> {
  const data = await AsyncStorage.getItem(UNLOCKED_ACCESSORIES_KEY);

  if (!data) {
    return [];
  }

  return JSON.parse(data);
}

export async function unlockAccessory(accessoryId: string) {
  const current = await getUnlockedAccessories();

  // hindrer duplicates
  if (current.includes(accessoryId)) {
    return;
  }

  const updated = [...current, accessoryId];

  await AsyncStorage.setItem(
    UNLOCKED_ACCESSORIES_KEY,
    JSON.stringify(updated)
  );
}

export async function getSelectedAccessories(): Promise<string[]> {
  const data = await AsyncStorage.getItem(SELECTED_ACCESSORIES_KEY);

  if (!data) {
    return [];
  }

  return JSON.parse(data);
}

export async function saveSelectedAccessories(accessoryIds: string[]) {
  await AsyncStorage.setItem(
    SELECTED_ACCESSORIES_KEY,
    JSON.stringify(accessoryIds)
  );
}

export async function selectAccessory(accessoryId: string) {
  const current = await getSelectedAccessories();

  if (current.includes(accessoryId)) {
    return;
  }

  await saveSelectedAccessories([...current, accessoryId]);
}

export async function resetAccessories() {
  await AsyncStorage.removeItem(UNLOCKED_ACCESSORIES_KEY);
  await AsyncStorage.removeItem(SELECTED_ACCESSORIES_KEY);
}
