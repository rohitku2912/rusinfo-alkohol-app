import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { flushPendingDemographics } from '@/lib/firestore/demographics';

export default function RootLayout() {
  useEffect(() => {
    void flushPendingDemographics();
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="onboarding" />
      <Stack.Screen
        name="(tabs)"
        options={{ gestureEnabled: false }}
      />
    </Stack>
  );
}
