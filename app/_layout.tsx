import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { flushPendingDemographics } from '@/lib/firestore/demographics';
import { ThemeProvider, useAppTheme } from './theme/ThemeProvider';

function RootNavigator() {
  const { isDark } = useAppTheme();

  useEffect(() => {
    void flushPendingDemographics();
  }, []);

  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="onboarding" />
        <Stack.Screen
          name="(tabs)"
          options={{ gestureEnabled: false }}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootNavigator />
    </ThemeProvider>
  );
}
