import { clearOnboardingData } from "@/lib/storage/onboarding";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import theme from "../theme/constantStyling";

export default function Welcome() {
  const router = useRouter();

  useEffect(() => {
    void clearOnboardingData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.eyebrow}>RUSinfo</Text>
        <Text style={styles.title}>
          En selvhjelps-app for å få oversikt over alkoholbruk
        </Text>
        <Text style={styles.body}>
          Du kan bruke appen anonymt, og de fleste opplysningene lagres bare på
          telefonen din.
        </Text>
        <Text style={styles.body}>
          Det er frivillig om du vil dele anonyme data for
          statistikk.
        </Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/onboarding/goal" as any)}
      >
        <Text style={styles.buttonText}>Kom i gang</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.large,
    paddingTop: 96,
    paddingBottom: 48,
  },
  content: {
    gap: theme.spacing.medium,
  },
  eyebrow: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  title: {
    color: theme.colors.text,
    fontSize: 32,
    lineHeight: 38,
    fontWeight: "600",
    fontFamily: theme.fonts.heading,
  },
  body: {
    color: "#555",
    fontSize: 16,
    lineHeight: 24,
    fontFamily: theme.fonts.main,
  },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.large,
    paddingVertical: theme.spacing.medium,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
