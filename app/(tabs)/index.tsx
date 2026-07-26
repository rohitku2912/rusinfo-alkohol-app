import AsyncStorage from "@react-native-async-storage/async-storage";
import { setProgramStartDate } from "@/lib/storage/onboarding";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
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

import { useSafeAreaInsets } from "react-native-safe-area-context";
import AnimatedTabHeader, {
  getAnimatedTabHeaderTopPadding,
} from "../components/ui/AnimatedTabHeader";
import AvatarButton from "../components/ui/avatarButton";
import DrinkLogger from "../features/drinkLogger/drinkLogger";
import EmergencyModal from "../features/emergencyButton/EmergencyModal";
import HelpButton from "../features/help/HelpButton";
import PartyPlanner from "../features/partyPlanner/partyPlanner";
import SettingsModal from "../features/settings/SettingsModal";

const auditRiskColors: Record<string, string> = {
  "Lav risiko": "#5E9C76",
  "Økende risiko": "#D6A53A",
  "Høy risiko": "#D97845",
  "Svært høy risiko": "#C74747",
};

const auditRiskBackgroundColors: Record<string, string> = {
  "Lav risiko": "#EAF4EE",
  "Økende risiko": "#FFF5D8",
  "Høy risiko": "#FFF0E8",
  "Svært høy risiko": "#FDECEC",
};

export default function Dashboard() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [isDrinkLoggerVisible, setIsDrinkLoggerVisible] = useState(false);

  const [isSavingsVisible, setIsSavingsVisible] = useState(false);
  const [isCaloriesVisible, setIsCaloriesVisible] = useState(false);
  const [savedEntries, setSavedEntries] = useState<SavedEntry[]>([]);
  const savedTotal = calculateTotalSavings(savedEntries);
  const totalCalories = calculateTotalAvoidedCalories(savedEntries);
  const [isAuditVisible, setIsAuditVisible] = useState(false);
  const [auditScore, setAuditScore] = useState<number | null>(null);
  const [auditRiskGroup, setAuditRiskGroup] = useState<string | null>(null);
  const [isEmergencyVisible, setIsEmergencyVisible] = useState(false);
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [programTimerVersion, setProgramTimerVersion] = useState(0);

  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loadDashboardState = async () => {
      const completed = await AsyncStorage.getItem("onboardingCompleted");
      if (!completed) {
        router.replace("/onboarding" as any);
        return;
      }

      const savedAuditScore = await AsyncStorage.getItem("auditScore");
      if (savedAuditScore !== null) {
        setAuditScore(Number(savedAuditScore));
      }

      const savedAuditRiskGroup = await AsyncStorage.getItem("auditRiskGroup");
      if (savedAuditRiskGroup !== null) {
        setAuditRiskGroup(savedAuditRiskGroup);
      }
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
  async function resetOnboarding() {
    try {
      await AsyncStorage.removeItem("onboardingCompleted");
      await AsyncStorage.removeItem("onboardingData");

      router.replace("/onboarding" as any);
    } catch (error) {
      console.error("Feil ved reset av onboarding:", error);
    }
  }

  function resetAuditResult() {
    setAuditScore(null);
    setAuditRiskGroup(null);
  }

  async function resetProgramDays() {
    await setProgramStartDate(new Date());
    setProgramTimerVersion((version) => version + 1);
  }

  async function handleResetOnboarding() {
    await resetOnboarding();
    router.replace("/onboarding" as any);
  }

  async function handleAuditScoreChange(score: number, riskGroup: string) {
    setAuditScore(score);
    setAuditRiskGroup(riskGroup);
    await AsyncStorage.setItem("auditScore", String(score));
    await AsyncStorage.setItem("auditRiskGroup", riskGroup);
  }

  const auditResultColor =
    auditRiskGroup === null
      ? theme.colors.primary
      : auditRiskColors[auditRiskGroup];
  const auditResultBackground =
    auditRiskGroup === null
      ? "#EAF4EE"
      : auditRiskBackgroundColors[auditRiskGroup];

  return (
    <View style={styles.outerContainer}>
      <AnimatedTabHeader
        title="Hjem"
        scrollY={scrollY}
        rightSlot={<AvatarButton />}
      />

      <Animated.ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: getAnimatedTabHeaderTopPadding(insets.top) },
        ]}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false },
        )}
        scrollEventThrottle={16}
      >
        <ProgramTimer key={programTimerVersion} />

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
          description="Beregn hvor mye penger du kan spare."
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
          title="KALORIKALKULATOR"
          description="Beregn hvor mange kalorier du kan unngå."
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

        <FunctionBox
          title="AUDIT"
          description="Ta AUDIT-testen for å kartlegge ditt alkoholforbruk."
          helpBtn={<HelpButton helpKey="audit" />}
        >
          <View style={styles.functionContent}>
            {auditScore !== null && auditRiskGroup !== null && (
              <View
                style={[
                  styles.auditResultCard,
                  {
                    backgroundColor: auditResultBackground,
                    borderColor: auditResultColor,
                  },
                ]}
              >
                <Text style={styles.auditScoreLabel}>Din siste score:</Text>
                <Text
                  style={[styles.auditScoreValue, { color: auditResultColor }]}
                >
                  {auditScore}
                </Text>
                <Text style={styles.auditRiskText}>
                  <Text
                    style={[
                      styles.auditRiskValue,
                      { color: auditResultColor },
                    ]}
                  >
                    {auditRiskGroup}
                  </Text>
                </Text>
              </View>
            )}
            <RegularButton
              title="Åpne AUDIT"
              onPress={() => setIsAuditVisible(true)}
            ></RegularButton>
          </View>
          <AuditModal
            isVisible={isAuditVisible}
            setIsVisible={setIsAuditVisible}
            onScoreChange={handleAuditScoreChange}
          ></AuditModal>
        </FunctionBox>

      </Animated.ScrollView>
      <Pressable
        accessibilityLabel="Åpne innstillinger"
        onPress={() => setIsSettingsVisible(true)}
        style={styles.settingsButton}
      >
        <Ionicons
          name="settings-outline"
          size={23}
          color={theme.colors.lightText}
        />
      </Pressable>
      <View style={styles.EmergencyButton}>
        <Pressable
          onPress={() => setIsEmergencyVisible(true)}
          style={styles.emergencyPressable}
        >
          <FontAwesome6 name="hand-holding-heart" size={23} color="#FFFFFF" />
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
      <SettingsModal
        visible={isSettingsVisible}
        onClose={() => setIsSettingsVisible(false)}
        onResetAudit={resetAuditResult}
        onResetCalculators={() => setSavedEntries([])}
        onResetProgramDays={resetProgramDays}
        onRestartOnboarding={handleResetOnboarding}
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
    backgroundColor: "#2F4FA3",
    borderRadius: 100,
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
  outerContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  settingsButton: {
    alignItems: "center",
    backgroundColor: theme.colors.darkGrey,
    borderRadius: 100,
    bottom: 100,
    height: 45,
    justifyContent: "center",
    left: 20,
    position: "absolute",
    width: 45,
    zIndex: 10,
  },
  scrollContent: {
    marginHorizontal: theme.spacing.medium,
    gap: theme.spacing.small,
    paddingBottom: 120,
  },
  functionContent: {
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
  auditResultCard: {
    alignItems: "center",
    borderRadius: theme.borderRadius.medium,
    borderWidth: 1,
    padding: 16,
  },
  auditScoreLabel: {
    color: theme.colors.darkGrey,
    fontSize: 14,
  },
  auditScoreValue: {
    fontFamily: theme.fonts.heading,
    fontSize: 42,
    fontWeight: "700",
  },
  auditRiskText: {
    color: theme.colors.text,
    fontSize: 18,
    marginTop: -4,
    textAlign: "center",
  },
  auditRiskValue: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: "700",
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
