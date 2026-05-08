import { getOnboardingData } from "@/lib/storage/onboarding";
import type { OnboardingDraft } from "@/types/onboarding";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Button,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import RegularButton from "../components/ui/button";
import FunctionBox from "../components/ui/functionBox";
import CalorieCalcModal from "../features/calorieCalculator/CalorieCalcModal";
import { SavedEntry } from "../features/savingsCalculator/config";
import SavingsCalcModal from "../features/savingsCalculator/SavingsCalcModal";
import theme from "../theme/constantStyling";

import AuditModal from "../features/audit/auditModal";
import {
  calculateTotalAvoidedCalories,
  calculateTotalSavings,
  formatNumber,
} from "../features/savingsCalculator/utils";

import DrinkLogger from "../features/drinkLogger/drinkLogger";
import EmergencyModal from "../features/emergencyButton/EmergencyModal";
import PartyPlanner from "../features/partyPlanner/partyPlanner";

export default function Dashboard() {
  const router = useRouter();
  const [onboardingData, setOnboardingData] = useState<OnboardingDraft>({});

  const [isDrinkLoggerVisible, setIsDrinkLoggerVisible] = useState(false);

  const [isSavingsVisible, setIsSavingsVisible] = useState(false);
  const [isCaloriesVisible, setIsCaloriesVisible] = useState(false);
  const [savedEntries, setSavedEntries] = useState<SavedEntry[]>([]);
  const savedTotal = calculateTotalSavings(savedEntries);
  const totalCalories = calculateTotalAvoidedCalories(savedEntries);
  const [isAuditVisible, setIsAuditVisible] = useState(false);
  const [isEmergencyVisible, setIsEmergencyVisible] = useState(false);

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
        <FunctionBox
          title="DRIKKELOGG"
          description="logg her når du har drukket"
        >
          <RegularButton
            title="regn ut"
            onPress={() => setIsDrinkLoggerVisible(true)}
          />
        </FunctionBox>

        <PartyPlanner />

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

        <FunctionBox title="AUDIT" description="ta en test">
          <RegularButton
            title="open the AUDIT"
            onPress={() => setIsAuditVisible(true)}
          ></RegularButton>
          <AuditModal
            isVisible={isAuditVisible}
            setIsVisible={setIsAuditVisible}
          ></AuditModal>
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
      <View style={styles.EmergencyButton}>
        <Pressable onPress={() => setIsEmergencyVisible(true)}>
          <Text>Nødknapp</Text>
        </Pressable>
        <EmergencyModal
          isVisible={isEmergencyVisible}
          setIsVisible={setIsEmergencyVisible}
        />
      </View>
      <DrinkLogger
        isVisible={isDrinkLoggerVisible}
        setIsVisible={setIsDrinkLoggerVisible}
      />

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
  EmergencyButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    zIndex: 10,
    backgroundColor: "#a46e6e",
    padding: 10,
    borderRadius: 100,
    borderColor: "#c48c8c",
    borderWidth: 3,
  },
  outerContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
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
