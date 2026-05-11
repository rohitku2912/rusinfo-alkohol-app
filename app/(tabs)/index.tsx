import { getOnboardingData } from "@/lib/storage/onboarding";
import type { OnboardingDraft } from "@/types/onboarding";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import RegularButton from "../components/ui/button";
import FunctionBox from "../components/ui/functionBox";
import CalorieCalcModal from "../features/calorieCalculator/CalorieCalcModal";
import ProgramTimer from "../features/programTimer/ProgramTimer";
import SavingsCalcModal from "../features/savingsCalculator/SavingsCalcModal";
import { SavedEntry } from "../features/savingsCalculator/config";
import theme from "../theme/constantStyling";

import AuditModal from "../features/audit/auditModal";
import {
  calculateTotalAvoidedCalories,
  calculateTotalSavings,
  formatNumber,
} from "../features/savingsCalculator/utils";

import { Ionicons } from "@expo/vector-icons";
import DrinkLogger from "../features/drinkLogger/drinkLogger";
import EmergencyModal from "../features/emergencyButton/EmergencyModal";
import HelpButton from "../features/help/HelpButton";
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
        <View style={styles.header}>
          <Text style={styles.title}>Hjem</Text>
          <HelpButton helpKey="home" />
        </View>

        <ProgramTimer />

        <FunctionBox
          title="DRIKKELOGG"
          description="Her kan du logge ditt alkoholforbruk."
          helpBtn={<HelpButton helpKey="drinklog" />}
        >
          <RegularButton
            title="Registrer drikke"
            onPress={() => setIsDrinkLoggerVisible(true)}
          />
        </FunctionBox>

        <PartyPlanner />

        <FunctionBox
          title="SPAREKALKULATOR"
          helpBtn={<HelpButton helpKey="savingcalculator" />}
        >
          <View style={styles.functionContent}>
            <Text style={styles.functionText}>
              <Text style={styles.smallText}>Du har spart: </Text>
              <Text style={styles.bigText}>{formatNumber(savedTotal)} kr</Text>
            </Text>

            <RegularButton
              title="Regn ut"
              onPress={() => setIsSavingsVisible(true)}
            />
          </View>
        </FunctionBox>

        <FunctionBox
          title="AUDIT"
          description="Ta AUDIT-testen for å kartlegge ditt alkoholforbruk."
          helpBtn={<HelpButton helpKey="audit" />}
        >
          <RegularButton
            title="Åpne AUDIT"
            onPress={() => setIsAuditVisible(true)}
          ></RegularButton>
          <AuditModal
            isVisible={isAuditVisible}
            setIsVisible={setIsAuditVisible}
          ></AuditModal>
        </FunctionBox>

        <FunctionBox
          title="KALORIKALKULATOR"
          helpBtn={<HelpButton helpKey="caloriecalculator" />}
        >
          <View style={styles.functionContent}>
            <Text style={styles.functionText}>
              <Text style={styles.smallText}>Du har spart: </Text>
              <Text style={styles.bigText}>
                {formatNumber(totalCalories)} kcal
              </Text>
            </Text>
            <RegularButton
              title="Regn ut"
              onPress={() => setIsCaloriesVisible(true)}
            />
          </View>
        </FunctionBox>
      </ScrollView>

      <View style={styles.EmergencyButton}>
        <Pressable
          onPress={() => setIsEmergencyVisible(true)}
          style={styles.emergencyPressable}
        >
          <Ionicons name="warning" size={24} color={theme.colors.text} />
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
    bottom: 100,
    right: 20,
    zIndex: 10,
    alignItems: "center",
    backgroundColor: theme.colors.emergency,
    borderRadius: 100,
    borderColor: "red",
    height: 45,
    justifyContent: "center",
    width: 45,
  },
  emergencyPressable: {
    alignItems: "center",
    height: "100%",
    justifyContent: "center",
    width: "100%",
  },
  emergencyText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
  },
  outerContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    paddingTop: theme.spacing.small,
    paddingBottom: 100,
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    alignSelf: "stretch",
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: theme.spacing.medium,
    marginBottom: theme.spacing.small,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: theme.colors.text,
  },
  functionContent: {
    marginTop: 5,
    marginBottom: 5,
    gap: 12,
  },
  functionText: {
    fontSize: 28,
    color: theme.colors.text,
    textAlign: "center",
    marginTop: 5,
    marginBottom: 5,
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
    color: theme.colors.lightText,
    marginBottom: theme.spacing.small,
  },
  debugText: {
    fontSize: 15,
    color: theme.colors.lightText,
    marginBottom: 6,
  },
  smallText: {
    fontSize: 14,
    color: theme.colors.darkGrey,
  },

  bigText: {
    fontSize: 26,
    fontWeight: "bold",
    color: theme.colors.text,
  },
});
