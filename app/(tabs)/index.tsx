import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { getOnboardingData } from '@/lib/storage/onboarding';
import type { OnboardingDraft } from '@/types/onboarding';
import { theme } from '../theme/constantStyling';

export default function Dashboard() {
  const router = useRouter();
  const [onboardingData, setOnboardingData] = useState<OnboardingDraft>({});

  useEffect(() => {
    const loadDashboardState = async () => {
      const completed = await AsyncStorage.getItem('onboardingCompleted');
      if (!completed) {
        router.replace('/onboarding' as any);
        return;
      }

      const storedData = await getOnboardingData();
      setOnboardingData(storedData);
    };

    loadDashboardState();
  }, [router]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Dashboard</Text>
      <View style={styles.debugCard}>
        <Text style={styles.debugTitle}>Lokal onboardingdata</Text>
        <Text style={styles.debugText}>
          Deler anonym statistikk: {onboardingData.shareAnonymousStats ? 'Ja' : 'Nei'}
        </Text>
        <Text style={styles.debugText}>Alder: {onboardingData.age || 'Ikke satt'}</Text>
        <Text style={styles.debugText}>Kjønn: {onboardingData.gender || 'Ikke satt'}</Text>
        <Text style={styles.debugText}>Fylke: {onboardingData.county || 'Ikke satt'}</Text>
        <Text style={styles.debugText}>Mål: {onboardingData.goal || 'Ikke satt'}</Text>
        <Text style={styles.debugText}>
          Inspirasjon: {onboardingData.inspiration?.length ? onboardingData.inspiration.join(', ') : 'Ikke satt'}
        </Text>
      </View>
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
    marginBottom: theme.spacing.large,
  },
  debugCard: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.medium,
    marginBottom: theme.spacing.large,
  },
  debugTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.small,
  },
  debugText: {
    fontSize: 15,
    color: theme.colors.text,
    marginBottom: 6,
  },
});
