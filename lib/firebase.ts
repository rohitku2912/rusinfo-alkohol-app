import { getApp, getApps, initializeApp } from 'firebase/app';
import {
  getFirestore,
  initializeFirestore,
  type Firestore,
} from 'firebase/firestore';

const requiredConfig = {
  apiKey: {
    envKey: 'EXPO_PUBLIC_FIREBASE_API_KEY',
    value: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  },
  authDomain: {
    envKey: 'EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN',
    value: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  },
  projectId: {
    envKey: 'EXPO_PUBLIC_FIREBASE_PROJECT_ID',
    value: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  },
  storageBucket: {
    envKey: 'EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET',
    value: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  },
  messagingSenderId: {
    envKey: 'EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    value: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  },
  appId: {
    envKey: 'EXPO_PUBLIC_FIREBASE_APP_ID',
    value: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  },
} as const;

function getFirebaseConfig() {
  const missingKeys: string[] = [];
  const firebaseConfig = Object.fromEntries(
    Object.entries(requiredConfig).map(([configKey, config]) => {
      if (!config.value) {
        missingKeys.push(config.envKey);
      }

      return [configKey, config.value];
    })
  ) as Record<keyof typeof requiredConfig, string | undefined>;

  if (missingKeys.length > 0) {
    console.warn(
      `Firebase is disabled. Missing environment variables: ${missingKeys.join(
        ', '
      )}`
    );
    return null;
  }

  return firebaseConfig as Record<keyof typeof requiredConfig, string>;
}

const firebaseConfig = getFirebaseConfig();
const app = firebaseConfig
  ? getApps().length
    ? getApp()
    : initializeApp(firebaseConfig)
  : null;

function getDb(): Firestore | null {
  if (!app) {
    return null;
  }

  try {
    return initializeFirestore(app, {
      experimentalForceLongPolling: true,
    });
  } catch {
    return getFirestore(app);
  }
}

export const db = getDb();

export function requireDb() {
  if (!db) {
    throw new Error(
      'Firebase is not configured for this build. Check the EAS production environment variables.'
    );
  }

  return db;
}
