import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme/constantStyling';

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    const checkOnboarding = async () => {
      const completed = await AsyncStorage.getItem('onboardingCompleted');
      if (!completed) {
        router.replace('/onboarding' as any);
      }
    };
    checkOnboarding();
  }, [router]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Dashboard</Text>
      <Button
        title="Reset onboarding"
        onPress={async () => {
          await AsyncStorage.clear();
          router.replace('/onboarding' as any);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  text: {
    fontSize: 24,
    color: theme.colors.text,
    fontFamily: theme.fonts.heading,
  },
});
