import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { theme } from './theme/constantStyling';

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    const sjekkOnboarding = async () => {
      const fullfort = await AsyncStorage.getItem('onboardingFullfort');
      if (!fullfort) {
        router.replace('/onboarding' as any);
      }
    };
    sjekkOnboarding();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.tekst}>Dashboard</Text>
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
  tekst: {
    fontSize: 24,
    color: theme.colors.text,
    fontFamily: theme.fonts.heading,
  },
});
