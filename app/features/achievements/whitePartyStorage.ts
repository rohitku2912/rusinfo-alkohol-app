import AsyncStorage from "@react-native-async-storage/async-storage";

const WHITE_PARTY_COUNT_KEY = "whitePartyCount";

export async function getWhitePartyCount() {
  const storedCount = await AsyncStorage.getItem(WHITE_PARTY_COUNT_KEY);
  return storedCount ? Number(storedCount) : 0;
}

export async function incrementWhitePartyCount() {
  const currentCount = await getWhitePartyCount();
  const nextCount = currentCount + 1;
  await AsyncStorage.setItem(WHITE_PARTY_COUNT_KEY, String(nextCount));
  return nextCount;
}
