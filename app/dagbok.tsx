import { StyleSheet, Text, View } from 'react-native';
import { theme } from './theme/constantStyling';

export default function Dagbok() {
  return (
    <View style={styles.container}>
      <Text style={styles.tekst}>Dagbok</Text>
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