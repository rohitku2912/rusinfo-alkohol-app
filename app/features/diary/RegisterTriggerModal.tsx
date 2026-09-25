import BackButton from "@/app/components/ui/backButton";
import theme from "@/app/theme/constantStyling";
import { AppColors, useAppTheme } from "@/app/theme/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import HelpButton from "../help/HelpButton";

type Props = {
  visible: boolean;
  onClose: () => void;

  allTriggers: string[];
  onAddTrigger: (trigger: string) => void;

  triggerEntries: {
    trigger: string;
    protectionFactors: string[];
    count: number;
  }[];

  selectedTrigger: string | null;
  protectionText: string;
  onSetProtectionText: (text: string) => void;
  onSelectTrigger: (trigger: string | null) => void;
  onAddProtectionFactor: () => void;
  onAddProtectionFactorWithText: (text: string) => void;
  onBack: () => void;
};

const presetProtectionFactors = [
  "Ingenting",
  "Ringte eller sendte melding til noen",
  "Dro bort fra situasjonen",
  "Gikk en tur",
  "Spiste eller drakk noe alkoholfritt",
  "Ventet 20 minutter",
  "Pusteteknikk",
  "Minnet meg selv på målet mitt",
  "Skrev ned følelsene mine",
  "Gjorde noe fysisk",
  "Tok en dusj",
  "La meg tidlig",
  "Gikk på møte eller snakket med hjelper",
  "Unngikk personer eller steder knyttet til drikking",
];

function putNothingFirst(items: string[]) {
  return [
    ...items.filter((item) => item === "Ingenting"),
    ...items
      .filter((item) => item !== "Ingenting")
      .sort((a, b) => a.localeCompare(b, "nb-NO")),
  ];
}

export default function RegisterTriggerModal({
  visible,
  onClose,
  allTriggers,
  onAddTrigger,
  triggerEntries,
  selectedTrigger,
  protectionText,
  onSetProtectionText,
  onSelectTrigger,
  onAddProtectionFactor,
  onAddProtectionFactorWithText,
  onBack,
}: Props) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const [inputText, setInputText] = useState("");

  const addTrigger = () => {
    if (!inputText.trim()) return;
    const value = inputText.trim();

    onAddTrigger(value);
    setInputText("");
    onSelectTrigger(value);
  };

  const existingFactors =
    triggerEntries.find((t) => t.trigger === selectedTrigger)
      ?.protectionFactors || [];

  const suggestedPresetFactors = putNothingFirst(
    presetProtectionFactors.filter((f) => !existingFactors.includes(f)),
  );

  const customFactors = putNothingFirst(
    Array.from(
      new Set(triggerEntries.flatMap((t) => t.protectionFactors)),
    ).filter((f) => f && !presetProtectionFactors.includes(f)),
  );

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.overlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={styles.keyboardView}
          >
            <View style={styles.container}>
              <View style={styles.header}>
                <View style={styles.headerAction}>
                  <HelpButton helpKey="trigger" />
                </View>
                <Text style={styles.title}>
                  {selectedTrigger ? "Hva hjalp?" : "Registrer trigger"}
                </Text>
                <Pressable
                  accessibilityLabel="Lukk"
                  hitSlop={10}
                  onPress={onClose}
                  style={[styles.headerAction, styles.closeButton]}
                >
                  <Text style={styles.close}>✕</Text>
                </Pressable>
              </View>

              <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
              {/* triggere */}
              {!selectedTrigger && (
                <View style={styles.section}>
                  <Text style={styles.subtitle}>
                    Hva utløste situasjonen?
                  </Text>
                  <Text style={styles.helper}>
                    Velg fra listen, eller skriv inn din egen trigger.
                  </Text>
                  <TextInput
                    placeholder="Skriv en annen trigger..."
                    placeholderTextColor={colors.darkGrey}
                    value={inputText}
                    onChangeText={setInputText}
                    style={styles.input}
                    onSubmitEditing={addTrigger}
                    returnKeyType="next"
                  />

                  <TouchableOpacity
                    disabled={!inputText.trim()}
                    onPress={addTrigger}
                    style={[
                      styles.button,
                      !inputText.trim() && styles.disabledButton,
                    ]}
                  >
                    <Text style={styles.buttonText}>Bruk denne triggeren</Text>
                  </TouchableOpacity>

                  <Text style={styles.listLabel}>Vanlige triggere</Text>
                  <View style={styles.optionList}>
                    {allTriggers.map((item) => (
                      <TouchableOpacity
                        key={item}
                        onPress={() => onSelectTrigger(item)}
                        style={styles.item}
                      >
                        <Text style={styles.itemText}>{item}</Text>
                        <Ionicons
                          name="chevron-forward"
                          size={18}
                          color={colors.darkGrey}
                        />
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {/* beskyttelsesfaktorer */}
              {selectedTrigger && (
                <View style={styles.section}>
                  <View style={styles.backRow}>
                    <BackButton onPress={onBack} />
                    <Text style={styles.stepText}>Endre trigger</Text>
                  </View>
                  <View style={styles.selectedCard}>
                    <Ionicons
                      name="flash-outline"
                      size={18}
                      color={colors.primary}
                    />
                    <Text style={styles.selected}>{selectedTrigger}</Text>
                  </View>
                  <Text style={styles.subtitle}>
                    Hva hjalp deg i denne situasjonen?
                  </Text>
                  <Text style={styles.helper}>
                    Velg et forslag, eller skriv inn din egen
                    beskyttelsesfaktor.
                  </Text>
                  <TextInput
                    placeholder="Skriv hva som hjalp..."
                    placeholderTextColor={colors.darkGrey}
                    value={protectionText}
                    onChangeText={onSetProtectionText}
                    style={[styles.input, styles.factorInput]}
                    multiline
                  />

                  <TouchableOpacity
                    disabled={!protectionText.trim()}
                    onPress={onAddProtectionFactor}
                    style={[
                      styles.button,
                      !protectionText.trim() && styles.disabledButton,
                    ]}
                  >
                    <Text style={styles.buttonText}>Lagre registrering</Text>
                  </TouchableOpacity>

                  {/* egne faktorer*/}
                  {customFactors.length > 0 && (
                    <View style={styles.block}>
                      <Text style={styles.subTitle}>
                        Dine beskyttelsesfaktorer
                      </Text>

                      {customFactors.map((f) => (
                        <TouchableOpacity
                          key={f}
                          style={styles.chip}
                          onPress={() => onAddProtectionFactorWithText(f)}
                        >
                          <Text style={styles.chipText}>{f}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}

                  {/* preset */}
                  {suggestedPresetFactors.length > 0 && (
                    <View style={styles.block}>
                      <Text style={styles.subTitle}>Forslag</Text>

                      {suggestedPresetFactors.map((f) => (
                        <TouchableOpacity
                          key={f}
                          style={styles.chip}
                          onPress={() => onAddProtectionFactorWithText(f)}
                        >
                          <Text style={styles.chipText}>{f}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              )}
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const createStyles = (colors: AppColors) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  keyboardView: {
    maxHeight: "90%",
    width: "100%",
  },

  container: {
    alignSelf: "center",
    width: "100%",
    maxWidth: 420,
    maxHeight: "100%",
    backgroundColor: colors.background,
    borderRadius: theme.borderRadius.large,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },

  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: theme.spacing.medium,
  },

  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
    textAlign: "center",
  },
  headerAction: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 40,
    width: 40,
  },
  closeButton: {
    backgroundColor: colors.box,
    borderRadius: 20,
  },
  subtitle: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 4,
  },

  close: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
  },

  section: {
    paddingBottom: theme.spacing.small,
  },

  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: theme.borderRadius.medium,
    padding: 12,
    marginBottom: theme.spacing.small,
    backgroundColor: colors.box,
    color: colors.text,
    minHeight: 50,
  },
  factorInput: {
    minHeight: 90,
    textAlignVertical: "top",
  },

  button: {
    backgroundColor: colors.primary,
    minHeight: 50,
    padding: 12,
    borderRadius: theme.borderRadius.medium,
    marginBottom: theme.spacing.large,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    fontWeight: "700",
    color: colors.buttonText,
  },
  disabledButton: {
    opacity: 0.45,
  },
  listLabel: {
    color: colors.darkGrey,
    fontSize: 13,
    fontWeight: "700",
    marginBottom: theme.spacing.small,
  },
  optionList: {
    gap: theme.spacing.small,
  },

  item: {
    alignItems: "center",
    backgroundColor: colors.box,
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 48,
    padding: 12,
    borderRadius: theme.borderRadius.medium,
    borderWidth: 1,
    borderColor: colors.border,
  },

  itemText: {
    fontSize: 15,
    color: colors.text,
  },

  selected: {
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
  },
  backRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing.small,
    marginBottom: theme.spacing.small,
  },
  stepText: {
    color: colors.darkGrey,
    fontSize: 13,
    fontWeight: "600",
  },
  selectedCard: {
    alignItems: "center",
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary,
    borderRadius: theme.borderRadius.medium,
    borderWidth: 1,
    flexDirection: "row",
    gap: theme.spacing.small,
    marginBottom: theme.spacing.large,
    padding: 12,
  },

  block: {
    marginBottom: theme.spacing.medium,
  },

  subTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.darkGrey,
    marginBottom: theme.spacing.small,
  },

  chip: {
    backgroundColor: colors.box,
    padding: 12,
    borderRadius: theme.borderRadius.medium,
    marginBottom: theme.spacing.small,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipText: {
    color: colors.text,
    lineHeight: 20,
  },

  helper: {
    color: colors.darkGrey,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: theme.spacing.medium,
  },
});
