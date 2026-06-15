import {
  clearPendingDemographics,
  flushPendingDemographics,
  queueDemographicsSync,
} from "@/lib/firestore/demographics";
import {
  completeOnboarding,
  getOnboardingData,
} from "@/lib/storage/onboarding";
import type { OnboardingData } from "@/types/onboarding";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import theme from "../theme/constantStyling";

export default function Terms() {
  const router = useRouter();
  const [accepted, setAccepted] = useState(false);

  const handleAccept = async () => {
    const draft = await getOnboardingData();
    const onboardingData: OnboardingData = {
      shareAnonymousStats: draft.shareAnonymousStats ?? false,
      age: draft.age ?? "",
      gender: draft.gender ?? "",
      county: draft.county ?? "",
      goal: draft.goal ?? "",
      inspiration: draft.inspiration ?? [],
    };

    await completeOnboarding(onboardingData);

    if (onboardingData.shareAnonymousStats) {
      await queueDemographicsSync();
      void flushPendingDemographics();
    } else {
      await clearPendingDemographics();
    }

    router.replace("/(tabs)" as any);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        bounces={false}
        alwaysBounceVertical={false}
        overScrollMode="never"
      >
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

        <View style={styles.content}>
          
          <Text style={styles.title}>Vilkår og informasjon</Text>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Hva appen gjør</Text>
            <Text style={styles.body}>
              Appen hjelper deg med å få oversikt over alkoholbruk gjennom
              drikkelogging, dagbok, triggere, mål, prestasjoner og en
              personlig kriseplan.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Lagring og personvern</Text>
            <Text style={styles.body}>
              Informasjon du legger inn lagres hovedsakelig på telefonen din.
              Hvis du valgte å dele anonym statistikk, sendes alder, kjønn,
              fylke og mål til oss for å forbedre appen. Du kan bruke appen
              uten å dele dette.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Ikke akutt hjelp</Text>
            <Text style={styles.body}>
              Appen er et selvhjelpsverktøy og erstatter ikke helsehjelp. Ved
              akutt fare bør du kontakte nødetater eller andre lokale
              hjelpetjenester.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.acceptRow}
            onPress={() => setAccepted((current) => !current)}
          >
            <View style={[styles.checkbox, accepted && styles.checkboxActive]}>
              {accepted && (
                <Ionicons name="checkmark" size={18} color="#fff" />
              )}
            </View>
            <Text style={styles.acceptText}>
              Jeg har lest informasjonen og ønsker å starte appen.
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.button, !accepted && styles.buttonDisabled]}
          disabled={!accepted}
          onPress={handleAccept}
        >
          <Text style={styles.buttonText}>Godta og start appen</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flexGrow: 1,
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
  content: {
    flex: 1,
    gap: theme.spacing.medium,
  },
  eyebrow: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  title: {
    color: theme.colors.text,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "700",
    fontFamily: theme.fonts.heading,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.medium,
    borderWidth: 1,
    borderColor: "#d6d8d0",
  },
  cardTitle: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
  },
  body: {
    color: "#555",
    fontSize: 15,
    lineHeight: 22,
    fontFamily: theme.fonts.main,
  },
  acceptRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.small,
    backgroundColor: "#f2f2ed",
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.medium,
    borderWidth: 1,
    borderColor: "#c8c8c1",
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  checkboxActive: {
    backgroundColor: theme.colors.primary,
  },
  acceptText: {
    flex: 1,
    color: theme.colors.text,
    fontSize: 15,
    lineHeight: 20,
  },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.large,
    paddingVertical: theme.spacing.medium,
    alignItems: "center",
    marginTop: theme.spacing.large,
  },
  buttonDisabled: {
    opacity: 0.45,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
