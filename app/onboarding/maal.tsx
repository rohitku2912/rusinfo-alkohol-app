import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { theme } from '../theme/constantStyling';

const maal = ['Slutte å drikke', 'Drikke mindre', 'Få oversikt over min drikking'];

export default function Maal() {
  const router = useRouter();
  const [valgt, setValgt] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.tittel}>Hva er ditt mål?</Text>
      <Text style={styles.undertittel}>dette kan endres senere</Text>

      {maal.map(m => (
        <TouchableOpacity
          key={m}
          style={[styles.alternativ, valgt === m && styles.valgt]}
          onPress={() => setValgt(m)}
        >
          <Text style={styles.alternativTekst}>{m}</Text>
          <Text style={{ color: theme.colors.text }}>›</Text>
        </TouchableOpacity>
      ))}

      {valgt !== '' && (
        <TouchableOpacity style={styles.knapp}
          onPress={() => router.push('/onboarding/inspirasjon' as any)}>
          <Text style={styles.knappTekst}>videre →</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.large,
    paddingTop: 60,
    backgroundColor: theme.colors.background,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#e8e8e3',
    borderRadius: theme.borderRadius.medium,
    padding: 18,
    marginBottom: theme.spacing.small,
  },
  valgt: { backgroundColor: '#d0e8d0' },
  alternativTekst: { fontSize: 16, color: theme.colors.text },
  knapp: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.medium,
    alignItems: 'center',
    marginTop: theme.spacing.large,
    alignSelf: 'center',
    paddingHorizontal: 32,
  },
  knappTekst: { fontSize: 16, color: '#fff' },
});