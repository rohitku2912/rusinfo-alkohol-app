import theme from "@/app/theme/constantStyling";
import { StyleSheet, Text, View } from "react-native";
import ShowAchievements from "../features/achievements/ShowAchievements";
import HelpButton from "../features/help/HelpButton";

export default function Achievements() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Prestasjoner</Text>
        <HelpButton helpKey="achievements" />
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
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1F2A24",
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: theme.spacing.medium,
    marginTop: theme.spacing.small,
    marginBottom: theme.spacing.small,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.darkGrey,
    marginTop: 2,
  },
});
