import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { Alert, Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import theme from "../../theme/constantStyling";

type Props = {
  visible: boolean;
  onClose: () => void;
  onResetAudit: () => void;
  onResetCalculators: () => void;
  onResetProgramDays: () => Promise<void>;
  onRestartOnboarding: () => Promise<void>;
};

type ResetOptionProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  onPress: () => void;
};

const USER_DATA_KEYS = [
  "auditScore",
  "auditRiskGroup",
  "drinkLogs",
  "diary_entries",
  "diary_tags",
  "trigger_display_all_triggers",
  "trigger_display_entries",
  "goals",
  "weeklyGoalResults",
  "emergencyPlan",
  "emergency_phone",
  "whitePartyCount",
  "unlockedAchievements",
  "unlockedAccessories",
  "selectedAccessories",
] as const;

function ResetOption({
  icon,
  title,
  description,
  onPress,
}: ResetOptionProps) {
  return (
    <Pressable onPress={onPress} style={styles.option}>
      <View style={styles.optionIcon}>
        <Ionicons name={icon} size={21} color={theme.colors.primary} />
      </View>
      <View style={styles.optionText}>
        <Text style={styles.optionTitle}>{title}</Text>
        <Text style={styles.optionDescription}>{description}</Text>
      </View>
      <Ionicons
        name="chevron-forward"
        size={18}
        color={theme.colors.darkGrey}
      />
    </Pressable>
  );
}

export default function SettingsModal({
  visible,
  onClose,
  onResetAudit,
  onResetCalculators,
  onResetProgramDays,
  onRestartOnboarding,
}: Props) {
  function confirmReset(
    title: string,
    message: string,
    reset: () => Promise<void>,
  ) {
    Alert.alert(title, message, [
      { text: "Avbryt", style: "cancel" },
      {
        text: "Nullstill",
        style: "destructive",
        onPress: () => void reset(),
      },
    ]);
  }

  async function resetKeys(keys: readonly string[]) {
    await AsyncStorage.multiRemove([...keys]);
  }

  return (
    <Modal
      animationType="fade"
      onRequestClose={onClose}
      transparent
      visible={visible}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.header}>
            <View style={styles.headerSpacer} />
            <Text style={styles.title}>Innstillinger</Text>
            <Pressable
              accessibilityLabel="Lukk innstillinger"
              hitSlop={10}
              onPress={onClose}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={22} color={theme.colors.text} />
            </Pressable>
          </View>

          <Text style={styles.intro}>
            Velg hvilke lagrede opplysninger du vil nullstille.
          </Text>

          <ScrollView
            contentContainerStyle={styles.options}
            showsVerticalScrollIndicator={false}
          >
            <ResetOption
              icon="clipboard-outline"
              title="AUDIT-resultat"
              description="Fjerner lagret score og risikogruppe."
              onPress={() =>
                confirmReset(
                  "Nullstill AUDIT?",
                  "Det lagrede AUDIT-resultatet blir slettet.",
                  async () => {
                    await resetKeys(["auditScore", "auditRiskGroup"]);
                    onResetAudit();
                  },
                )
              }
            />
            <ResetOption
              icon="wine-outline"
              title="Drikkelogg"
              description="Fjerner alle registrerte drikkedager."
              onPress={() =>
                confirmReset(
                  "Nullstill drikkelogg?",
                  "Alle registreringer i drikkeloggen blir slettet.",
                  () => resetKeys(["drinkLogs"]),
                )
              }
            />
            <ResetOption
              icon="book-outline"
              title="Dagbok"
              description="Fjerner innlegg og egendefinerte tagger."
              onPress={() =>
                confirmReset(
                  "Nullstill dagbok?",
                  "Alle dagbokinnlegg og tagger blir slettet.",
                  () => resetKeys(["diary_entries", "diary_tags"]),
                )
              }
            />
            <ResetOption
              icon="flash-outline"
              title="Triggere"
              description="Fjerner triggere og registrerte beskyttelsesfaktorer."
              onPress={() =>
                confirmReset(
                  "Nullstill triggere?",
                  "Alle triggerregistreringer blir slettet.",
                  () =>
                    resetKeys([
                      "trigger_display_all_triggers",
                      "trigger_display_entries",
                    ]),
                )
              }
            />
            <ResetOption
              icon="flag-outline"
              title="Mål og prestasjoner"
              description="Fjerner mål, prestasjoner og opplåst tilbehør."
              onPress={() =>
                confirmReset(
                  "Nullstill fremgang?",
                  "Mål, prestasjoner og opplåst avatartilbehør blir slettet.",
                  () =>
                    resetKeys([
                      "goals",
                      "weeklyGoalResults",
                      "whitePartyCount",
                      "unlockedAchievements",
                      "unlockedAccessories",
                      "selectedAccessories",
                    ]),
                )
              }
            />
            <ResetOption
              icon="call-outline"
              title="Hjelpeplan"
              description="Fjerner nødplan og lagret telefonnummer."
              onPress={() =>
                confirmReset(
                  "Nullstill hjelpeplan?",
                  "Nødplanen og det lagrede telefonnummeret blir slettet.",
                  () => resetKeys(["emergencyPlan", "emergency_phone"]),
                )
              }
            />
            <ResetOption
              icon="calculator-outline"
              title="Kalkulatorer"
              description="Fjerner beregninger fra denne økten."
              onPress={() =>
                confirmReset(
                  "Nullstill kalkulatorer?",
                  "Alle beregninger i spare- og kalorikalkulatoren blir fjernet.",
                  async () => onResetCalculators(),
                )
              }
            />
            <ResetOption
              icon="time-outline"
              title="Dager siden start"
              description="Starter dagtelleren på nytt fra i dag."
              onPress={() =>
                confirmReset(
                  "Nullstill dagtelleren?",
                  "Dagtelleren starter på nytt fra i dag.",
                  onResetProgramDays,
                )
              }
            />
            <ResetOption
              icon="refresh-outline"
              title="Start onboarding på nytt"
              description="Lar deg velge oppstartsinformasjonen på nytt."
              onPress={() =>
                confirmReset(
                  "Start onboarding på nytt?",
                  "Du blir sendt tilbake til starten av onboarding.",
                  onRestartOnboarding,
                )
              }
            />
            <Pressable
              onPress={() =>
                confirmReset(
                  "Nullstill alle brukerdata?",
                  "Dagbok, triggere, logger, mål, prestasjoner, AUDIT og hjelpeplan blir slettet. Onboarding beholdes.",
                  async () => {
                    await resetKeys(USER_DATA_KEYS);
                    onResetAudit();
                    onResetCalculators();
                    await onResetProgramDays();
                    onClose();
                  },
                )
              }
              style={styles.resetAllButton}
            >
              <Ionicons
                name="trash-outline"
                size={18}
                color={theme.colors.attention}
              />
              <Text style={styles.resetAllText}>Nullstill alle brukerdata</Text>
            </Pressable>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.35)",
    flex: 1,
    justifyContent: "center",
    padding: theme.spacing.medium,
  },
  card: {
    backgroundColor: theme.colors.background,
    borderColor: "#d6e0da",
    borderRadius: theme.borderRadius.large,
    borderWidth: 1,
    maxHeight: "88%",
    maxWidth: 440,
    padding: theme.spacing.medium,
    width: "100%",
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
  },
  headerSpacer: {
    width: 40,
  },
  title: {
    color: theme.colors.text,
    flex: 1,
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
  },
  closeButton: {
    alignItems: "center",
    backgroundColor: theme.colors.box,
    borderRadius: 20,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  intro: {
    color: theme.colors.darkGrey,
    lineHeight: 20,
    marginBottom: theme.spacing.medium,
    marginTop: theme.spacing.small,
    textAlign: "center",
  },
  options: {
    gap: theme.spacing.small,
    paddingBottom: theme.spacing.small,
  },
  option: {
    alignItems: "center",
    backgroundColor: theme.colors.box,
    borderColor: "#d6e0da",
    borderRadius: theme.borderRadius.medium,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    minHeight: 72,
    padding: 12,
  },
  optionIcon: {
    alignItems: "center",
    backgroundColor: "#EAF4EE",
    borderRadius: 20,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 3,
  },
  optionDescription: {
    color: theme.colors.darkGrey,
    fontSize: 12,
    lineHeight: 17,
  },
  resetAllButton: {
    alignItems: "center",
    borderColor: theme.colors.attention,
    borderRadius: theme.borderRadius.medium,
    borderWidth: 1,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    marginTop: theme.spacing.small,
    minHeight: 50,
  },
  resetAllText: {
    color: theme.colors.attention,
    fontWeight: "700",
  },
});
