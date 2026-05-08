import { getOnboardingData } from "@/lib/storage/onboarding";
import type { OnboardingDraft } from "@/types/onboarding";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Button, ScrollView, StyleSheet, Text, View } from "react-native";
import RegularButton from "../components/ui/button";
import FunctionBox from "../components/ui/functionBox";
import ProgramTimer from "../features/programTimer/ProgramTimer";
import CalorieCalcModal from "../features/calorieCalculator/CalorieCalcModal";
import { SavedEntry } from "../features/savingsCalculator/config";
import SavingsCalcModal from "../features/savingsCalculator/SavingsCalcModal";
import theme from "../theme/constantStyling";

import {
  calculateTotalAvoidedCalories,
  calculateTotalSavings,
  formatNumber,
} from "../features/savingsCalculator/utils";

const FAKE_FUNCTIONS = [
  {
    id: "daily-status",
    title: "DAGENS STATUS",
    description: "oversikt over dagens mål og varsler",
    content: "2 oppgaver gjenstår i dag",
  },
  {
    id: "weekly-overview",
    title: "UKESOVERSIKT",
    description: "hurtigoversikt over aktivitet denne uken",
    content: "4 av 7 dager registrert",
  },
  {
    id: "tips",
    title: "ANBEFALTE TIPS",
    description: "små grep som kan hjelpe deg videre",
    content: "Les 3 nye råd denne uken",
  },
];

export default function Dashboard() {
  const router = useRouter();
  const [onboardingData, setOnboardingData] = useState<OnboardingDraft>({});

  const [isSavingsVisible, setIsSavingsVisible] = useState(false);
  const [isCaloriesVisible, setIsCaloriesVisible] = useState(false);
  const [savedEntries, setSavedEntries] = useState<SavedEntry[]>([]);
  const savedTotal = calculateTotalSavings(savedEntries);
  const totalCalories = calculateTotalAvoidedCalories(savedEntries);

  useEffect(() => {
    const loadDashboardState = async () => {
      const completed = await AsyncStorage.getItem("onboardingCompleted");
      if (!completed) {
        router.replace("/onboarding" as any);
        return;
      }

      const storedData = await getOnboardingData();
      setOnboardingData(storedData);
    };

    loadDashboardState();
  }, [router]);

  function addSavedEntry(entry: SavedEntry) {
    setSavedEntries((previousEntries) => [...previousEntries, entry]);
  }

  function deleteSavedEntry(entryId: string) {
    setSavedEntries((previousEntries) =>
      previousEntries.filter((entry) => entry.id !== entryId),
    );
  }

  function updateSavedEntry(updatedEntry: SavedEntry) {
    setSavedEntries((previousEntries) =>
      previousEntries.map((entry) =>
        entry.id === updatedEntry.id ? updatedEntry : entry,
      ),
    );
  }

  return (
    <View style={styles.outerContainer}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ProgramTimer />

        <FunctionBox
          title="SPAREKALKULATOR"
          description="du har spart så langt"
        >
          <View style={styles.functionContent}>
            <RegularButton
              title="regn ut"
              onPress={() => setIsSavingsVisible(true)}
            />
            <Text style={styles.functionText}>
              {formatNumber(savedTotal)} kr spart
            </Text>
          </View>
        </FunctionBox>

        <FunctionBox
          title="KALORIKALKULATOR"
          description="du har unngått så langt"
        >
          <View style={styles.functionContent}>
            <RegularButton
              title="se kalorier"
              onPress={() => setIsCaloriesVisible(true)}
            />
            <Text style={styles.functionText}>
              {formatNumber(totalCalories)} kcal unngått
            </Text>
          </View>
        </FunctionBox>

        {FAKE_FUNCTIONS.map((item) => (
          <FunctionBox
            key={item.id}
            title={item.title}
            description={item.description}
          >
            <Text style={styles.functionText}>{item.content}</Text>
          </FunctionBox>
        ))}

        <View style={styles.resetButton}>
          <View style={styles.debugCard}>
            <Text style={styles.debugTitle}>Lokal onboardingdata</Text>
            <Text style={styles.debugText}>
              Deler anonym statistikk:{" "}
              {onboardingData.shareAnonymousStats ? "Ja" : "Nei"}
            </Text>
            <Text style={styles.debugText}>
              Alder: {onboardingData.age || "Ikke satt"}
            </Text>
            <Text style={styles.debugText}>
              Kjønn: {onboardingData.gender || "Ikke satt"}
            </Text>
            <Text style={styles.debugText}>
              Fylke: {onboardingData.county || "Ikke satt"}
            </Text>
            <Text style={styles.debugText}>
              Mål: {onboardingData.goal || "Ikke satt"}
            </Text>
            <Text style={styles.debugText}>
              Inspirasjon:{" "}
              {onboardingData.inspiration?.length
                ? onboardingData.inspiration.join(", ")
                : "Ikke satt"}
            </Text>
          </View>
          <Button
            title="Reset onboarding"
            onPress={async () => {
              await AsyncStorage.clear();
              router.replace("/onboarding" as any);
            }}
          />
        </View>
      </ScrollView>

      <SavingsCalcModal
        isVisible={isSavingsVisible}
        setIsVisible={setIsSavingsVisible}
        savedEntries={savedEntries}
        onAddEntry={addSavedEntry}
        onDeleteEntry={deleteSavedEntry}
        onUpdateEntry={updateSavedEntry}
      />

      <CalorieCalcModal
        isVisible={isCaloriesVisible}
        setIsVisible={setIsCaloriesVisible}
        savedEntries={savedEntries}
        onAddEntry={addSavedEntry}
        onDeleteEntry={deleteSavedEntry}
        onUpdateEntry={updateSavedEntry}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: "#e9dfd2",
  },
  scrollContent: {
    paddingVertical: 24,
    paddingBottom: 40,
    alignItems: "center",
  },
  functionContent: {
    marginTop: 12,
    gap: 12,
  },
  functionText: {
    fontSize: 16,
    color: "#f6ede4",
  },
  resetButton: {
    width: "95%",
    marginTop: 8,
    marginBottom: theme.spacing.large,
  },
  debugCard: {
    width: "100%",
    backgroundColor: "#ffffff",
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.medium,
    marginBottom: theme.spacing.large,
  },
  debugTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.small,
  },
  debugText: {
    fontSize: 15,
    color: theme.colors.text,
    marginBottom: 6,
  },
});
