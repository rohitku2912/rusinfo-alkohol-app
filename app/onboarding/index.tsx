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
          Denne appen er laget for å hjelpe de som ønsker å få bedre kontroll
          over eget alkoholforbruk. Det kan være om du slutter helt, ønsker å
          trappe ned, eller bare vil kartlegge vanene dine.
        </Text>
        <Text style={styles.body}>
          Applikasjonen er utviklet av studenter fra Høyskolen Kristiania i
          samarbeid med RUSinfo. Innholdet i appen er basert på forskning om
          alkoholbruk og erfaringsbasert kunnskap fra brukere og fagpersoner.
        </Text>
        <Text style={styles.body}>
          All informasjon du legger inn i appen lagres kun på telefonen din, og
          deles ikke med noen andre.
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
    padding: 20,
    paddingTop: 60,
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
