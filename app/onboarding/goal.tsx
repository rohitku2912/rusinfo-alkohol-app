import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import theme from "../theme/constantStyling";

const goals = [
  "Slutte å drikke",
  "Drikke mindre",
  "Få oversikt over min drikking",
];

export default function Goal() {
  const router = useRouter();
  const [selected, setSelected] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hva er ditt mål?</Text>
      <Text style={styles.subtitle}>dette kan endres senere</Text>

      {goals.map((g) => (
        <TouchableOpacity
          key={g}
          style={[styles.option, selected === g && styles.selectedStyle]}
          onPress={() => setSelected(g)}
        >
          <Text style={styles.optionText}>{g}</Text>
          <Text style={{ color: theme.colors.text }}>›</Text>
        </TouchableOpacity>
      ))}

      {selected !== "" && (
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/onboarding/inspiration" as any)}
        >
          <Text style={styles.buttonText}>videre →</Text>
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
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: theme.spacing.small,
    color: theme.colors.text,
    fontFamily: theme.fonts.heading,
  },
  subtitle: {
    fontSize: 14,
    color: "#888",
    marginBottom: 28,
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#e8e8e3",
    borderRadius: theme.borderRadius.medium,
    padding: 18,
    marginBottom: theme.spacing.small,
  },
  selectedStyle: { backgroundColor: "#d0e8d0" },
  optionText: { fontSize: 16, color: theme.colors.text },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.medium,
    alignItems: "center",
    marginTop: theme.spacing.large,
    alignSelf: "center",
    paddingHorizontal: 32,
  },
  buttonText: { fontSize: 16, color: "#fff" },
});
