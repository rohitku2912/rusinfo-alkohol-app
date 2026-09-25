import FunctionBox from "@/app/components/ui/functionBox";
import KeyboardDoneAccessory from "@/app/components/ui/KeyboardDoneAccessory";
import theme from "@/app/theme/constantStyling";
import { AppColors, useAppTheme } from "@/app/theme/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router/react-navigation";
import { useCallback, useEffect, useState } from "react";
import {
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type TriggerEntry = {
  trigger: string;
  protectionFactors: string[];
};

const PLAN_KEY = "emergencyPlan";
const TRIGGER_ENTRIES_KEY = "trigger_display_entries";
const PLAN_INPUT_ACCESSORY_ID = "emergency-plan-input-accessory";
const DEFAULT_PLAN =
  "Gå en tur\nDrikk vann\nRing en venn eller et familiemedlem";

function getPlanItems(plan: string) {
  return plan
    .split("\n")
    .map((line) => line.replace(/^[-•]\s*/, "").trim())
    .filter(Boolean);
}

type Props = {
  onEditingStart?: () => void;
};

export default function EmergencyPlan({ onEditingStart }: Props) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const [plan, setPlan] = useState(DEFAULT_PLAN);
  const [draftPlan, setDraftPlan] = useState(DEFAULT_PLAN);
  const [isEditing, setIsEditing] = useState(false);
  const [triggers, setTriggers] = useState<TriggerEntry[]>([]);
  const [selectedTrigger, setSelectedTrigger] = useState<string | null>(null);

  useEffect(() => {
    const loadPlan = async () => {
      const savedPlan = await AsyncStorage.getItem(PLAN_KEY);
      const nextPlan = savedPlan || DEFAULT_PLAN;
      setPlan(nextPlan);
      setDraftPlan(nextPlan);
    };

    void loadPlan();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const loadTriggers = async () => {
        const stored = await AsyncStorage.getItem(TRIGGER_ENTRIES_KEY);
        setTriggers(stored ? JSON.parse(stored) : []);
      };

      void loadTriggers();
    }, []),
  );

  const savePlan = async () => {
    const nextPlan = draftPlan.trim() || DEFAULT_PLAN;
    await AsyncStorage.setItem(PLAN_KEY, nextPlan);
    setPlan(nextPlan);
    setDraftPlan(nextPlan);
    setIsEditing(false);
    Keyboard.dismiss();
  };

  const cancelEditing = () => {
    setDraftPlan(plan);
    setIsEditing(false);
    Keyboard.dismiss();
  };

  const startEditing = () => {
    setDraftPlan(plan);
    setIsEditing(true);
    onEditingStart?.();
  };

  const selected = triggers.find((entry) => entry.trigger === selectedTrigger);

  return (
    <FunctionBox
      title="Din trygghetsplan"
      description="Små handlinger du kan ta når du kjenner trang til å drikke."
    >
      {isEditing ? (
        <View style={styles.editSection}>
          <Text style={styles.fieldLabel}>Ett tiltak per linje</Text>
          <TextInput
            autoFocus
            inputAccessoryViewID={
              Platform.OS === "ios" ? PLAN_INPUT_ACCESSORY_ID : undefined
            }
            multiline
            onChangeText={setDraftPlan}
            placeholder="Skriv hva du kan gjøre..."
            placeholderTextColor={colors.darkGrey}
            style={styles.input}
            textAlignVertical="top"
            value={draftPlan}
          />
          <View style={styles.actions}>
            <TouchableOpacity onPress={savePlan} style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Lagre plan</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={cancelEditing}
              style={styles.secondaryButton}
            >
              <Text style={styles.secondaryButtonText}>Avbryt</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <>
          <View style={styles.planPanel}>
            {getPlanItems(plan).map((item, index) => (
              <View key={`${item}-${index}`} style={styles.planRow}>
                <View style={styles.checkIcon}>
                  <Ionicons name="checkmark" size={14} color={colors.primary} />
                </View>
                <Text style={styles.planText}>{item}</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity onPress={startEditing} style={styles.outlineButton}>
            <Ionicons name="create-outline" size={17} color={colors.primary} />
            <Text style={styles.outlineButtonText}>Rediger planen</Text>
          </TouchableOpacity>
        </>
      )}

      <View style={styles.divider} />

      <Text style={styles.subsectionTitle}>Hva trigget deg?</Text>
      <Text style={styles.subsectionDescription}>
        Velg en trigger for å se hva som har hjulpet deg tidligere.
      </Text>

      {triggers.length === 0 ? (
        <View style={styles.emptyPanel}>
          <Ionicons name="flash-outline" size={19} color={colors.darkGrey} />
          <Text style={styles.emptyText}>
            Du har ingen triggerregistreringer enda.
          </Text>
        </View>
      ) : (
        <View style={styles.triggerWrap}>
          {triggers.map((entry) => {
            const isSelected = selectedTrigger === entry.trigger;

            return (
              <TouchableOpacity
                key={entry.trigger}
                onPress={() =>
                  setSelectedTrigger(isSelected ? null : entry.trigger)
                }
                style={[styles.chip, isSelected && styles.selectedChip]}
              >
                <Text
                  style={[
                    styles.chipText,
                    isSelected && styles.selectedChipText,
                  ]}
                >
                  {entry.trigger}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {selected && (
        <View style={styles.protectionPanel}>
          <View style={styles.protectionHeading}>
            <Ionicons
              name="shield-checkmark-outline"
              size={19}
              color={colors.primary}
            />
            <Text style={styles.protectionTitle}>Dette har hjulpet før</Text>
          </View>
          {selected.protectionFactors.length > 0 ? (
            selected.protectionFactors.map((factor, index) => (
              <Text key={`${factor}-${index}`} style={styles.protectionText}>
                • {factor}
              </Text>
            ))
          ) : (
            <Text style={styles.noProtectionText}>
              Ingen tiltak er lagret for denne triggeren.
            </Text>
          )}
        </View>
      )}
      <KeyboardDoneAccessory nativeID={PLAN_INPUT_ACCESSORY_ID} />
    </FunctionBox>
  );
}

const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    planPanel: {
      backgroundColor: colors.background,
      borderColor: colors.border,
      borderRadius: theme.borderRadius.medium,
      borderWidth: 1,
      gap: 10,
      padding: theme.spacing.medium,
    },
    planRow: {
      alignItems: "flex-start",
      flexDirection: "row",
      gap: 10,
    },
    checkIcon: {
      alignItems: "center",
      backgroundColor: colors.primarySoft,
      borderRadius: 12,
      height: 24,
      justifyContent: "center",
      width: 24,
    },
    planText: {
      color: colors.text,
      flex: 1,
      fontSize: 14,
      lineHeight: 22,
    },
    outlineButton: {
      alignItems: "center",
      borderColor: colors.primary,
      borderRadius: theme.borderRadius.medium,
      borderWidth: 1,
      flexDirection: "row",
      gap: 7,
      justifyContent: "center",
      marginTop: theme.spacing.small,
      minHeight: 46,
    },
    outlineButtonText: {
      color: colors.primary,
      fontWeight: "700",
    },
    editSection: {
      gap: theme.spacing.small,
    },
    fieldLabel: {
      color: colors.darkGrey,
      fontSize: 12,
      fontWeight: "700",
    },
    input: {
      backgroundColor: colors.background,
      borderColor: colors.border,
      borderRadius: theme.borderRadius.medium,
      borderWidth: 1,
      color: colors.text,
      fontSize: 15,
      lineHeight: 22,
      minHeight: 140,
      padding: theme.spacing.medium,
    },
    actions: {
      flexDirection: "row",
      gap: theme.spacing.small,
    },
    primaryButton: {
      alignItems: "center",
      backgroundColor: colors.primary,
      borderRadius: theme.borderRadius.medium,
      flex: 1,
      justifyContent: "center",
      minHeight: 46,
    },
    primaryButtonText: {
      color: colors.buttonText,
      fontWeight: "700",
    },
    secondaryButton: {
      alignItems: "center",
      backgroundColor: colors.box,
      borderColor: colors.border,
      borderRadius: theme.borderRadius.medium,
      borderWidth: 1,
      flex: 1,
      justifyContent: "center",
      minHeight: 46,
    },
    secondaryButtonText: {
      color: colors.text,
      fontWeight: "700",
    },
    divider: {
      backgroundColor: colors.lightGrey,
      height: 1,
      marginVertical: theme.spacing.large,
    },
    subsectionTitle: {
      color: colors.text,
      fontSize: 15,
      fontWeight: "800",
    },
    subsectionDescription: {
      color: colors.darkGrey,
      fontSize: 12,
      lineHeight: 18,
      marginTop: 3,
    },
    emptyPanel: {
      alignItems: "center",
      backgroundColor: colors.background,
      borderRadius: theme.borderRadius.medium,
      flexDirection: "row",
      gap: 9,
      marginTop: theme.spacing.small,
      padding: 12,
    },
    emptyText: {
      color: colors.darkGrey,
      flex: 1,
      fontSize: 13,
    },
    triggerWrap: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: theme.spacing.small,
      marginTop: theme.spacing.small,
    },
    chip: {
      backgroundColor: colors.background,
      borderColor: colors.border,
      borderRadius: 999,
      borderWidth: 1,
      paddingHorizontal: 13,
      paddingVertical: 8,
    },
    selectedChip: {
      backgroundColor: colors.primarySoft,
      borderColor: colors.primary,
    },
    chipText: {
      color: colors.text,
      fontSize: 13,
      fontWeight: "600",
    },
    selectedChipText: {
      color: colors.primary,
    },
    protectionPanel: {
      backgroundColor: colors.primarySoft,
      borderColor: "rgba(94, 156, 118, 0.35)",
      borderRadius: theme.borderRadius.medium,
      borderWidth: 1,
      marginTop: theme.spacing.medium,
      padding: theme.spacing.medium,
    },
    protectionHeading: {
      alignItems: "center",
      flexDirection: "row",
      gap: 8,
      marginBottom: theme.spacing.small,
    },
    protectionTitle: {
      color: colors.text,
      fontSize: 14,
      fontWeight: "800",
    },
    protectionText: {
      color: colors.text,
      fontSize: 13,
      lineHeight: 20,
      marginBottom: 3,
    },
    noProtectionText: {
      color: colors.darkGrey,
      fontSize: 13,
      fontStyle: "italic",
    },
  });
