import AsyncStorage from '@react-native-async-storage/async-storage';
import type { OnboardingData, OnboardingDraft } from '@/types/onboarding';
import { STORAGE_KEYS } from './keys';

export async function getOnboardingData(): Promise<OnboardingDraft> {
  const rawValue = await AsyncStorage.getItem(STORAGE_KEYS.onboardingData);
  if (!rawValue) {
    return {};
  }

  try {
    return JSON.parse(rawValue) as OnboardingDraft;
  } catch {
    return {};
  }
}

export async function saveOnboardingData(data: OnboardingDraft) {
  await AsyncStorage.setItem(STORAGE_KEYS.onboardingData, JSON.stringify(data));
}

export async function clearOnboardingData() {
  await AsyncStorage.removeItem(STORAGE_KEYS.onboardingData);
}

export async function mergeOnboardingData(data: OnboardingDraft) {
  const existingData = await getOnboardingData();
  const nextData = { ...existingData, ...data };
  await saveOnboardingData(nextData);
  return nextData;
}

export async function completeOnboarding(data: OnboardingData) {
  const existing = await AsyncStorage.getItem(STORAGE_KEYS.programStartDate);
  const startDate = existing ?? String(Date.now());
  await AsyncStorage.multiSet([
    [STORAGE_KEYS.onboardingData, JSON.stringify(data)],
    [STORAGE_KEYS.onboardingCompleted, 'true'],
    [STORAGE_KEYS.programStartDate, startDate],
  ]);
}

export async function getProgramStartDate(): Promise<Date | null> {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.programStartDate);
  if (!raw) return null;
  const ts = Number(raw);
  return Number.isNaN(ts) ? null : new Date(ts);
}
