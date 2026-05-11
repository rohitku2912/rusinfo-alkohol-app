import theme from "@/app/theme/constantStyling";
import { StyleSheet, Text, View } from "react-native";
import ShowAchievements from "../features/achievements/ShowAchievements";
import HelpButton from "../features/help/HelpButton";

export default function Achievements() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={styles.title}>Prestasjoner</Text>
          <HelpButton helpKey="overview" />
        </View>
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
