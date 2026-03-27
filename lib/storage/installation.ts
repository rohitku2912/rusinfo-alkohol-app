import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from './keys';

function createInstallationId() {
  return `install_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export async function getOrCreateInstallationId() {
  const existingId = await AsyncStorage.getItem(STORAGE_KEYS.installationId);
  if (existingId) {
    return existingId;
  }

  const newId = createInstallationId();
  await AsyncStorage.setItem(STORAGE_KEYS.installationId, newId);
  return newId;
}
