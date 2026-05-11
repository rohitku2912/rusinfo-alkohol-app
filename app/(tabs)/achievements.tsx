import theme from "@/app/theme/constantStyling";
import { StyleSheet, Text, View } from "react-native";
import ShowAchievements from "../features/achievements/ShowAchievements";

export default function Achievements() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Prestasjoner</Text>
        <Text style={styles.subtitle}>Følg fremgangen din steg for steg.</Text>
      </View>
      <ShowAchievements />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    marginHorizontal: theme.spacing.medium,
    marginTop: theme.spacing.small,
    marginBottom: theme.spacing.small,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.darkGrey,
    marginTop: 2,
  },
});
