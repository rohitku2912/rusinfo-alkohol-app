import theme from "@/app/theme/constantStyling";
import { AppColors, useAppTheme } from "@/app/theme/ThemeProvider";
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
import HelpButton from "../help/HelpButton";
import { DRINK_PRESETS, DrinkPreset, Entry, FREQUENCIES } from "./config";
import { calculateSavings, formatNumber, parsePrice } from "./utils";

type Props = {
  entry: Entry;
  onChangeEntry: (changes: Partial<Entry>) => void;
  onBack: () => void;
  onSave: () => void;
};

export default function DrinkFormScreen({
  entry,
  onChangeEntry,
  onBack,
  onSave,
}: Props) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const presets = DRINK_PRESETS[entry.type];
  const currentSavings = calculateSavings(entry);
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

  function changePrice(text: string) {
    updateEntry({
      price: parsePrice(text),
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
          <View style={styles.firstLine}>
            <HelpButton helpKey="savingcalculator" />
            <Text style={styles.header}>{entry.type}</Text>
            <Pressable onPress={onBack}>
              <Text style={{ fontSize: 20 }}>x</Text>
            </Pressable>
          </View>
          <Text style={styles.heroBody}>
            Juster mengde, pris og startdato for å se hvor mye dette koster over
            tid.
          </Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Beregnet spart</Text>
          <Text style={styles.summaryValue}>
            {formatNumber(currentSavings)} kr
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
                      styles.presetPrice,
                      isSelected && styles.presetPriceSelected,
                    ]}
                  >
                    {formatNumber(preset.price)} kr
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
          <Text style={styles.sectionLabel}>Egen pris hvis du vil justere</Text>
          {selectedPreset && (
            <Text style={styles.helperText}>
              Valgt preset: {selectedPreset.label} (
              {formatNumber(selectedPreset.price)} kr)
            </Text>
          )}
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Skriv inn egen pris"
            placeholderTextColor={colors.darkGrey}
            value={entry.price ? String(entry.price) : ""}
            returnKeyType="done"
            blurOnSubmit
            onSubmitEditing={Keyboard.dismiss}
            onChangeText={changePrice}
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

const createStyles = (colors: AppColors) => StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 12,
  },
  firstLine: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  hero: {
    paddingTop: 2,
    paddingBottom: 12,
  },
  header: {
    fontFamily: theme.fonts.heading,
    fontSize: 30,
    fontWeight: "700",
    color: colors.text,
  },
  heroBody: {
    marginTop: 6,
    color: colors.darkGrey,
    fontSize: 15,
    lineHeight: 22,
  },
  summaryCard: {
    marginTop: 8,
    marginBottom: 14,
    backgroundColor: colors.primary,
    borderRadius: theme.borderRadius.medium,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  summaryLabel: {
    color: "rgba(255,255,255,0.82)",
    fontSize: 14,
  },
  summaryValue: {
    color: colors.buttonText,
    fontSize: 24,
    fontWeight: "700",
    marginTop: 4,
  },
  summaryMeta: {
    color: "rgba(255,255,255,0.84)",
    fontSize: 13,
    marginTop: 6,
  },
  section: {
    backgroundColor: colors.box,
    borderRadius: theme.borderRadius.medium,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 12,
  },
  helperText: {
    color: colors.darkGrey,
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
    backgroundColor: colors.box,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: theme.borderRadius.small,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  presetCardSelected: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary,
  },
  presetTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
  },
  presetTitleSelected: {
    color: colors.primary,
  },
  presetDetails: {
    marginTop: 4,
    fontSize: 13,
    color: colors.darkGrey,
  },
  presetDetailsSelected: {
    color: colors.darkGrey,
  },
  presetPrice: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.primary,
  },
  presetPriceSelected: {
    color: colors.primary,
  },
  optionButton: {
    flex: 1,
    height: 48,
    borderRadius: theme.borderRadius.medium,
  },
  amountCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.primarySoft,
    borderRadius: theme.borderRadius.medium,
    padding: 10,
  },
  amountButton: {
    width: 56,
    borderRadius: theme.borderRadius.small,
  },
  amountValue: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.text,
  },
  input: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.box,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    borderRadius: theme.borderRadius.small,
    color: colors.text,
  },
  dateButton: {
    width: "100%",
    borderRadius: theme.borderRadius.medium,
  },
  pickerContainer: {
    marginTop: 10,
    marginBottom: 4,
    borderRadius: theme.borderRadius.medium,
    backgroundColor: colors.box,
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
  },
  secondaryAction: {
    flex: 1,
    borderRadius: theme.borderRadius.medium,
    backgroundColor: colors.darkGrey,
  },
  primaryAction: {
    flex: 1,
    borderRadius: theme.borderRadius.medium,
    backgroundColor: colors.primary,
  },
});
