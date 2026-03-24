import { StyleSheet, Text, View } from 'react-native';
import { theme } from './theme/constantStyling';

export default function Info() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Info</Text>
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
