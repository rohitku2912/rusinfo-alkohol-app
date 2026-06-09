import AsyncStorage from "@react-native-async-storage/async-storage";

const SELECTED_AVATAR_KEY = "selectedAvatar";

export async function saveSelectedAvatar(id: string) {
  await AsyncStorage.setItem(SELECTED_AVATAR_KEY, id);
}

export async function getSelectedAvatar() {
  return await AsyncStorage.getItem(SELECTED_AVATAR_KEY);
}