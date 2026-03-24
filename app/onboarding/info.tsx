import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { theme } from '../theme/constantStyling';

const aldersgrupper = ['Under 18', '18-20', '21-25', '26-30', '31-40', '41+'];
const kjønn = ['Mann', 'Kvinne', 'Ikke-binær', 'Vil ikke oppgi'];
const fylker = ['Oslo', 'Viken', 'Innlandet', 'Vestfold og Telemark', 'Agder',
  'Rogaland', 'Vestland', 'Møre og Romsdal', 'Trøndelag', 'Nordland', 'Troms og Finnmark'];

export default function Info() {
  const router = useRouter();
  const [alder, setAlder] = useState('');
  const [kjønnValg, setKjønnValg] = useState('');
  const [fylke, setFylke] = useState('');
  const [visAlder, setVisAlder] = useState(false);
  const [visKjønn, setVisKjønn] = useState(false);
  const [visFylke, setVisFylke] = useState(false);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.tittel}>Fyll inn din informasjon</Text>

      {/* Alder */}
      <TouchableOpacity style={styles.rad} onPress={() => setVisAlder(!visAlder)}>
        <Text style={styles.label}>Alder</Text>
        <Text style={styles.velg}>{alder || 'velg ▾'}</Text>
      </TouchableOpacity>
      {visAlder && aldersgrupper.map(a => (
        <TouchableOpacity key={a} style={styles.alternativ}
          onPress={() => { setAlder(a); setVisAlder(false); }}>
          <Text style={styles.alternativTekst}>{a}</Text>
        </TouchableOpacity>
      ))}

      {/* Kjønn */}
      <TouchableOpacity style={styles.rad} onPress={() => setVisKjønn(!visKjønn)}>
        <Text style={styles.label}>Kjønn</Text>
        <Text style={styles.velg}>{kjønnValg || 'velg ▾'}</Text>
      </TouchableOpacity>
      {visKjønn && kjønn.map(k => (
        <TouchableOpacity key={k} style={styles.alternativ}
          onPress={() => { setKjønnValg(k); setVisKjønn(false); }}>
          <Text style={styles.alternativTekst}>{k}</Text>
        </TouchableOpacity>
      ))}

      {/* Fylke */}
      <TouchableOpacity style={styles.rad} onPress={() => setVisFylke(!visFylke)}>
        <Text style={styles.label}>Fylke</Text>
        <Text style={styles.velg}>{fylke || 'velg ▾'}</Text>
      </TouchableOpacity>
      {visFylke && fylker.map(f => (
        <TouchableOpacity key={f} style={styles.alternativ}
          onPress={() => { setFylke(f); setVisFylke(false); }}>
          <Text style={styles.alternativTekst}>{f}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.knapp} onPress={() => router.push('/onboarding/maal' as any)}>
        <Text style={styles.knappTekst}>straks klar →</Text>
      </TouchableOpacity>
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
    fontSize: 20,
    fontWeight: '600',
    marginBottom: theme.spacing.large,
    color: theme.colors.text,
    fontFamily: theme.fonts.heading,
  },
  rad: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#e8e8e3',
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.medium,
    marginBottom: theme.spacing.small,
  },
  label: { fontSize: 16, color: theme.colors.text },
  velg: { fontSize: 14, color: '#666' },
  alternativ: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: theme.borderRadius.small,
    marginBottom: 6,
    paddingLeft: theme.spacing.large,
  },
  alternativTekst: { color: theme.colors.text },
  knapp: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.medium,
    alignItems: 'center',
    marginTop: 32,
    alignSelf: 'center',
    paddingHorizontal: 32,
  },
  knappTekst: { fontSize: 16, color: '#fff' },
});