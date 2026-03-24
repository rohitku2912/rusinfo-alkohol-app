import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { theme } from '../theme/constantStyling';

const alternativer = ['Helsen min', 'Familien min', 'Økonomi', 'Jobbe bedre', 'Trene mer'];

export default function Inspirasjon() {
  const router = useRouter();
  const [valgt, setValgt] = useState('');
  const [annetTekst, setAnnetTekst] = useState('');

  const fullfor = async () => {
    await AsyncStorage.setItem('onboardingFullfort', 'true');
    router.replace('/');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.tittel}>Hva er din inspirasjon?</Text>
      <Text style={styles.undertittel}>dette kan endres senere</Text>

      {alternativer.map(a => (
        <TouchableOpacity
          key={a}
          style={[styles.alternativ, valgt === a && styles.valgt]}
          onPress={() => { setValgt(a); setAnnetTekst(''); }}
        >
          <Text style={styles.alternativTekst}>{a}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        style={[styles.alternativ, valgt === 'annet' && styles.valgt]}
        onPress={() => setValgt('annet')}
      >
        <Text style={styles.alternativTekst}>Annet</Text>
      </TouchableOpacity>

      {valgt === 'annet' && (
        <TextInput
          style={styles.tekstfelt}
          placeholder="jeg ønsker å slutte å drikke fordi..."
          placeholderTextColor="#aaa"
          multiline
          value={annetTekst}
          onChangeText={setAnnetTekst}
        />
      )}

      {(valgt !== '' && (valgt !== 'annet' || annetTekst.length > 0)) && (
        <TouchableOpacity style={styles.knapp} onPress={fullfor}>
          <Text style={styles.knappTekst}>bekreft</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.large,
    paddingTop: 60,
    backgroundColor: theme.colors.background,
    flexGrow: 1,
  },
  tittel: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: theme.spacing.small,
    color: theme.colors.text,
    fontFamily: theme.fonts.heading,
  },
  undertittel: {
    fontSize: 14,
    color: '#888',
    marginBottom: 28,
  },
  alternativ: {
    backgroundColor: '#e8e8e3',
    borderRadius: theme.borderRadius.medium,
    padding: 18,
    marginBottom: theme.spacing.small,
  },
  valgt: { backgroundColor: '#d0e8d0' },
  alternativTekst: { fontSize: 16, color: theme.colors.text },
  tekstfelt: {
    backgroundColor: '#fff',
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.medium,
    minHeight: 120,
    fontSize: 15,
    marginBottom: theme.spacing.small,
    textAlignVertical: 'top',
    color: theme.colors.text,
  },
  knapp: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.medium,
    alignItems: 'center',
    marginTop: theme.spacing.medium,
    alignSelf: 'center',
    paddingHorizontal: 32,
  },
  knappTekst: { fontSize: 16, color: '#fff' },
});