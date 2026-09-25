import {
  getOnboardingData,
  mergeOnboardingData,
} from "@/lib/storage/onboarding";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import theme from "./onboardingStyling";

const goals = [
  "Slutte å drikke",
  "Drikke mindre",
  "Få oversikt over min drikking",
];

export default function Goal() {
  const router = useRouter();
  const [selected, setSelected] = useState("");

  useEffect(() => {
    const loadDraft = async () => {
      const draft = await getOnboardingData();
      setSelected(draft.goal ?? "");
    };

    loadDraft();
  }, []);

  const handleContinue = async () => {
    await mergeOnboardingData({ goal: selected });
    router.push("/onboarding/inspiration" as any);
  };

  const handleSelectGoal = async (goal: string) => {
    setSelected(goal);
    await mergeOnboardingData({ goal });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons
            name="chevron-back"
            size={18}
            color={theme.colors.primary}
          />
          <Text style={styles.backButtonText}>Tilbake</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Hva er ditt mål?</Text>
        <Text style={styles.subtitle}>
          Dette lagres lokalt og kan endres senere.
        </Text>

        {goals.map((g) => (
          <TouchableOpacity
            key={g}
            style={[styles.option, selected === g && styles.selectedStyle]}
            onPress={() => {
              void handleSelectGoal(g);
            }}
          >
            <Text style={styles.optionText}>{g}</Text>
            <Text style={{ color: theme.colors.text }}>›</Text>
          </TouchableOpacity>
        ))}

        {selected !== "" && (
          <TouchableOpacity style={styles.button} onPress={handleContinue}>
            <Text style={styles.buttonText}>Videre →</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    padding: theme.spacing.large,
    paddingTop: theme.spacing.medium,
    backgroundColor: theme.colors.background,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 6,
    marginBottom: theme.spacing.medium,
  },
  backButtonText: {
    fontSize: 15,
    color: theme.colors.primary,
    fontWeight: "500",
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
    color: theme.colors.darkGrey,
    marginBottom: 28,
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: theme.borderRadius.medium,
    padding: 18,
    marginBottom: theme.spacing.small,
  },
  selectedStyle: { backgroundColor: theme.colors.primarySoft },
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
  buttonText: { fontSize: 16, color: theme.colors.buttonText },
});
