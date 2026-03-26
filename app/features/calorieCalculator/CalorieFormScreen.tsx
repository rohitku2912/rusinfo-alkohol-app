import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import {
  Keyboard,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import RegularButton from "../../components/ui/button";
import {
  DRINK_PRESETS,
  DrinkPreset,
  Entry,
  FREQUENCIES,
} from "../savingsCalculator/config";
import {
  calculateAvoidedCalories,
  formatNumber,
  parsePrice,
} from "../savingsCalculator/utils";

type Props = {
  entry: Entry;
  onChangeEntry: (changes: Partial<Entry>) => void;
  onBack: () => void;
  onSave: () => void;
};

export default function CalorieFormScreen({
  entry,
  onChangeEntry,
  onBack,
  onSave,
}: Props) {
  const presets = DRINK_PRESETS[entry.type];
  const currentCalories = calculateAvoidedCalories(entry);
  const selectedPreset = presets.find((preset) => preset.label === entry.label);
  const [showPicker, setShowPicker] = useState(false);

  function updateEntry(changes: Partial<Entry>) {
    onChangeEntry(changes);
  }

  function choosePreset(preset: DrinkPreset) {
    updateEntry({
      label: preset.label,
      price: preset.price,
      calories: preset.calories,
    });
  }

  function changeAmount(nextAmount: number) {
    updateEntry({
      amount: Math.max(0, nextAmount),
    });
  }

  function changeFrequency(frequency: Entry["frequency"]) {
    updateEntry({ frequency });
  }

  function changeCalories(text: string) {
    updateEntry({
      calories: parsePrice(text),
    });
  }

  function toggleDatePicker() {
    Keyboard.dismiss();
    setShowPicker((isOpen) => !isOpen);
  }

  function handleDateChange(selectedDate?: Date) {
    if (!selectedDate) {
      return;
    }

    updateEntry({
      startDate: selectedDate,
    });
  }

  return (
    <View style={styles.container}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "on-drag"}
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={styles.scrollContent}
        stickyHeaderIndices={[1]}
      >
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>Valgt kategori</Text>
          <Text style={styles.header}>{entry.type}</Text>
          <Text style={styles.heroBody}>
            Endre drikkevalg og se hvor mange kalorier du omtrent har unngått.
          </Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Kalorier unngått</Text>
          <Text style={styles.summaryValue}>
            {formatNumber(currentCalories)} kcal
          </Text>
          <Text style={styles.summaryMeta}>
            {entry.amount} {entry.label.toLowerCase()} per {entry.frequency}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Startdato</Text>

          <RegularButton
            title={showPicker ? "Skjul dato" : entry.startDate.toDateString()}
            onPress={toggleDatePicker}
            style={styles.dateButton}
          />

          {showPicker && (
            <View style={styles.pickerContainer}>
              <DateTimePicker
                value={entry.startDate}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                themeVariant="light"
                onChange={(event, selectedDate) => {
                  if (Platform.OS === "android") {
                    setShowPicker(false);
                  }

                  handleDateChange(selectedDate);
                }}
              />
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Hva pleier du å kjøpe?</Text>
          <View style={styles.presetList}>
            {presets.map((preset) => {
              const isSelected = preset.label === entry.label;

              return (
                <Pressable
                  key={preset.label}
                  style={[
                    styles.presetCard,
                    isSelected && styles.presetCardSelected,
                  ]}
                  onPress={() => choosePreset(preset)}
                >
                  <View>
                    <Text
                      style={[
                        styles.presetTitle,
                        isSelected && styles.presetTitleSelected,
                      ]}
                    >
                      {preset.label}
                    </Text>
                    <Text
                      style={[
                        styles.presetDetails,
                        isSelected && styles.presetDetailsSelected,
                      ]}
                    >
                      {preset.details}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.presetValue,
                      isSelected && styles.presetValueSelected,
                    ]}
                  >
                    {formatNumber(preset.calories)} kcal
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Antall</Text>
          <View style={styles.amountCard}>
            <RegularButton
              title="-"
              onPress={() => changeAmount(entry.amount - 1)}
              style={styles.amountButton}
            />
            <Text style={styles.amountValue}>{entry.amount}</Text>
            <RegularButton
              title="+"
              onPress={() => changeAmount(entry.amount + 1)}
              style={styles.amountButton}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Hvor ofte?</Text>
          <View style={styles.row}>
            {FREQUENCIES.map((frequency) => (
              <RegularButton
                key={frequency}
                title={frequency}
                onPress={() => changeFrequency(frequency)}
                style={styles.optionButton}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Egne kalorier hvis du vil justere</Text>
          {selectedPreset && (
            <Text style={styles.helperText}>
              Valgt preset: {selectedPreset.label} ({formatNumber(selectedPreset.calories)} kcal)
            </Text>
          )}
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Skriv inn egne kalorier"
            placeholderTextColor="#9a877a"
            value={entry.calories ? String(entry.calories) : ""}
            returnKeyType="done"
            blurOnSubmit
            onSubmitEditing={Keyboard.dismiss}
            onChangeText={changeCalories}
          />
        </View>

        <View style={styles.actionRow}>
          <RegularButton
            title="Tilbake"
            onPress={onBack}
            style={styles.secondaryAction}
          />
          <RegularButton
            title="Lagre"
            onPress={onSave}
            style={styles.primaryAction}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 12,
  },
  hero: {
    backgroundColor: "#fffaf4",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(133, 92, 66, 0.12)",
  },
  eyebrow: {
    textTransform: "uppercase",
    letterSpacing: 1.2,
    fontSize: 12,
    fontWeight: "700",
    color: "#9c5f34",
    marginBottom: 8,
  },
  header: {
    fontSize: 28,
    fontWeight: "800",
    color: "#2f221b",
  },
  heroBody: {
    marginTop: 8,
    color: "#6b5649",
    fontSize: 15,
    lineHeight: 22,
  },
  summaryCard: {
    marginTop: 14,
    marginBottom: 14,
    backgroundColor: "#c55c2f",
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "rgba(94, 63, 48, 0.12)",
  },
  summaryLabel: {
    color: "rgba(255,255,255,0.82)",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  summaryValue: {
    color: "#fffaf4",
    fontSize: 24,
    fontWeight: "800",
    marginTop: 4,
  },
  summaryMeta: {
    color: "rgba(255,255,255,0.84)",
    fontSize: 13,
    marginTop: 6,
  },
  section: {
    backgroundColor: "#fffaf4",
    borderRadius: 22,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "rgba(133, 92, 66, 0.12)",
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#4b382e",
    marginBottom: 12,
  },
  helperText: {
    color: "#7b675a",
    fontSize: 13,
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    gap: 10,
  },
  presetList: {
    gap: 10,
  },
  presetCard: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e4d4c4",
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  presetCardSelected: {
    backgroundColor: "#c55c2f",
    borderColor: "#c55c2f",
  },
  presetTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2f221b",
  },
  presetTitleSelected: {
    color: "#fffaf4",
  },
  presetDetails: {
    marginTop: 4,
    fontSize: 13,
    color: "#7b675a",
  },
  presetDetailsSelected: {
    color: "rgba(255,250,244,0.84)",
  },
  presetValue: {
    fontSize: 18,
    fontWeight: "800",
    color: "#9c5f34",
  },
  presetValueSelected: {
    color: "#fffaf4",
  },
  amountCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f2e6d8",
    borderRadius: 18,
    padding: 10,
  },
  amountButton: {
    width: 56,
    borderRadius: 14,
  },
  amountValue: {
    fontSize: 28,
    fontWeight: "800",
    color: "#2f221b",
  },
  optionButton: {
    flex: 1,
    height: 48,
    borderRadius: 16,
  },
  input: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#d8c2af",
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    borderRadius: 16,
    color: "#2f221b",
  },
  dateButton: {
    width: "100%",
    borderRadius: 16,
  },
  pickerContainer: {
    marginTop: 10,
    borderRadius: 16,
    backgroundColor: "#fff",
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#eadbcc",
  },
  actionRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
  },
  secondaryAction: {
    flex: 1,
    borderRadius: 18,
    backgroundColor: "#6b5649",
  },
  primaryAction: {
    flex: 1,
    borderRadius: 18,
    backgroundColor: "#c55c2f",
  },
});
