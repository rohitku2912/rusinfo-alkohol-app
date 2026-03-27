import { getOnboardingData, mergeOnboardingData } from '@/lib/storage/onboarding';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { theme } from '../theme/constantStyling';

const ageGroups = ['Under 18', '18-20', '21-25', '26-30', '31-40', '41+'];
const genders = ['Mann', 'Kvinne', 'Ikke-binær', 'Vil ikke oppgi'];
const counties = ['Oslo', 'Viken', 'Innlandet', 'Vestfold og Telemark', 'Agder',
  'Rogaland', 'Vestland', 'Møre og Romsdal', 'Trøndelag', 'Nordland', 'Troms og Finnmark'];

export default function Info() {
  const router = useRouter();
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [county, setCounty] = useState('');
  const [shareAnonymousStats, setShareAnonymousStats] = useState<boolean | null>(null);
  const [showAge, setShowAge] = useState(false);
  const [showGender, setShowGender] = useState(false);
  const [showCounty, setShowCounty] = useState(false);

  useEffect(() => {
    const loadDraft = async () => {
      const draft = await getOnboardingData();
      setAge(draft.age ?? '');
      setGender(draft.gender ?? '');
      setCounty(draft.county ?? '');
      setShareAnonymousStats(draft.shareAnonymousStats ?? null);
    };

    loadDraft();
  }, []);

  const canContinue = age !== '' && gender !== '' && county !== '';

  const handleContinue = async () => {
    await mergeOnboardingData({
      shareAnonymousStats: true,
      age,
      gender,
      county,
    });
    router.push('/onboarding/goal' as any);
  };

  const handleSkip = async () => {
    setAge('');
    setGender('');
    setCounty('');
    setShareAnonymousStats(false);
    setShowAge(false);
    setShowGender(false);
    setShowCounty(false);

    await mergeOnboardingData({
      shareAnonymousStats: false,
      age: '',
      gender: '',
      county: '',
    });
    router.push('/onboarding/goal' as any);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        bounces={false}
        alwaysBounceVertical={false}
        overScrollMode="never"
      >
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={18} color={theme.colors.primary} />
          <Text style={styles.backButtonText}>Tilbake</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Vil du dele litt anonym informasjon?</Text>
        <Text style={styles.subtitle}>
          Dette er frivillig. Opplysningene brukes bare til anonym statistikk for å forbedre tilbudet.
          Du kan hoppe over og fortsatt bruke appen fullt ut.
        </Text>

        <View style={styles.infoCard}>
          <Text style={styles.infoCardTitle}>Hva deles?</Text>
          <Text style={styles.infoCardText}>Alder, kjønn, fylke og valgt mål.</Text>
        </View>

        <TouchableOpacity style={styles.row} onPress={() => setShowAge(!showAge)}>
          <Text style={styles.label}>Alder</Text>
          <Text style={styles.select}>{age || 'Velg ▾'}</Text>
        </TouchableOpacity>
        {showAge && ageGroups.map(a => (
          <TouchableOpacity key={a} style={styles.option}
            onPress={() => { setAge(a); setShowAge(false); }}>
            <Text style={styles.optionText}>{a}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.row} onPress={() => setShowGender(!showGender)}>
          <Text style={styles.label}>Kjønn</Text>
          <Text style={styles.select}>{gender || 'Velg ▾'}</Text>
        </TouchableOpacity>
        {showGender && genders.map(g => (
          <TouchableOpacity key={g} style={styles.option}
            onPress={() => { setGender(g); setShowGender(false); }}>
            <Text style={styles.optionText}>{g}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.row} onPress={() => setShowCounty(!showCounty)}>
          <Text style={styles.label}>Fylke</Text>
          <Text style={styles.select}>{county || 'Velg ▾'}</Text>
        </TouchableOpacity>
        {showCounty && counties.map(c => (
          <TouchableOpacity key={c} style={styles.option}
            onPress={() => { setCounty(c); setShowCounty(false); }}>
            <Text style={styles.optionText}>{c}</Text>
          </TouchableOpacity>
        ))}

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.button, !canContinue && styles.buttonDisabled]}
            disabled={!canContinue}
            onPress={handleContinue}
          >
            <Text style={styles.buttonText}>Fortsett med valgt info</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.secondaryButton,
              shareAnonymousStats === false && styles.secondaryButtonSelected,
            ]}
            onPress={handleSkip}
          >
            <Text style={styles.secondaryButtonText}>Hopp over</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    padding: theme.spacing.large,
    paddingTop: theme.spacing.medium,
    backgroundColor: theme.colors.background,
    flexGrow: 1,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    marginBottom: theme.spacing.medium,
  },
  backButtonText: {
    fontSize: 15,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: theme.spacing.small,
    color: theme.colors.text,
    fontFamily: theme.fonts.heading,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: theme.spacing.large,
    lineHeight: 20,
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.medium,
    marginBottom: theme.spacing.large,
  },
  infoCardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
  },
  infoCardText: {
    fontSize: 14,
    color: '#666',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#e8e8e3',
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.medium,
    marginBottom: theme.spacing.small,
  },
  label: { fontSize: 16, color: theme.colors.text },
  select: { fontSize: 14, color: '#666' },
  option: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: theme.borderRadius.small,
    marginBottom: 6,
    paddingLeft: theme.spacing.large,
  },
  optionText: { color: theme.colors.text },
  actions: {
    marginTop: 24,
    gap: theme.spacing.small,
  },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.medium,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.45,
  },
  buttonText: { fontSize: 16, color: '#fff' },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#c8c8c1',
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.medium,
    alignItems: 'center',
    backgroundColor: '#f2f2ed',
  },
  secondaryButtonSelected: {
    backgroundColor: '#e2e2db',
  },
  secondaryButtonText: {
    fontSize: 16,
    color: theme.colors.text,
  },
});
