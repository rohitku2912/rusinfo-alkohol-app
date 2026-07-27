import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { requireDb } from '@/lib/firebase';
import { getOrCreateInstallationId } from '@/lib/storage/installation';
import { getOnboardingData } from '@/lib/storage/onboarding';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '@/lib/storage/keys';

export type DemographicsPayload = {
  installationId: string;
  age: string;
  gender: string;
  county: string;
  goal: string;
};

export async function saveDemographics(payload: DemographicsPayload) {
  const db = requireDb();

  await setDoc(doc(db, 'demographics', payload.installationId), {
    ...payload,
    createdAt: serverTimestamp(),
  });
}

export async function queueDemographicsSync() {
  const draft = await getOnboardingData();
  if (
    !draft.shareAnonymousStats ||
    !draft.age ||
    !draft.gender ||
    !draft.county ||
    !draft.goal
  ) {
    return;
  }

  const installationId = await getOrCreateInstallationId();
  const payload: DemographicsPayload = {
    installationId,
    age: draft.age,
    gender: draft.gender,
    county: draft.county,
    goal: draft.goal,
  };

  await AsyncStorage.setItem(
    STORAGE_KEYS.pendingDemographics,
    JSON.stringify(payload)
  );
}

export async function clearPendingDemographics() {
  await AsyncStorage.removeItem(STORAGE_KEYS.pendingDemographics);
}

export async function flushPendingDemographics() {
  const rawPayload = await AsyncStorage.getItem(STORAGE_KEYS.pendingDemographics);
  if (!rawPayload) {
    return;
  }

  try {
    const payload = JSON.parse(rawPayload) as DemographicsPayload;
    await saveDemographics(payload);
    await AsyncStorage.removeItem(STORAGE_KEYS.pendingDemographics);
  } catch (error) {
    console.warn('Could not sync demographics to Firestore.', error);
  }
}
