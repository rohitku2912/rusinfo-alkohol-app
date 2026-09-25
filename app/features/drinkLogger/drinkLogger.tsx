import RegularButton from "@/app/components/ui/button";
import MinusButton from "@/app/components/ui/minusbutton";
import PlusButton from "@/app/components/ui/plusbutton";
import theme from "@/app/theme/constantStyling";
import { clearDrinkLogs, saveDrinkLog } from "@/lib/storage/drinkLogs";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useMemo, useState } from "react";
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { useAchievements } from "../achievements/AchievementProvider";
import HelpButton from "../help/HelpButton";
import { AppColors, useAppTheme } from "@/app/theme/ThemeProvider";

type Props = {
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
};

export default function DrinkLogger({ isVisible, setIsVisible }: Props) {
  const { checkAchievements } = useAchievements();
  const { colors, isDark } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateChoice, setDateChoice] = useState("today");
  const [hasPickedCustomDate, setHasPickedCustomDate] = useState(false);
  const [beerCount, setBeerCount] = useState(0);
  const [wineCount, setWineCount] = useState(0);
  const [drinksCount, setDrinksCount] = useState(0);

  function customLabelPicker() {
    if (hasPickedCustomDate) {
      return date.toLocaleDateString("nb-NO");
    }

    return "Velg dato";
  }

  const dateOptions = [
    { label: "I dag", value: "today" },
    { label: "I går", value: "yesterday" },
    { label: customLabelPicker(), value: "custom" },
  ];

  function closeModal() {
    setIsVisible(false);
  }

  function handleDateChange(event: any, selectedDate?: Date) {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }

    if (selectedDate) {
      setDate(selectedDate);
      setHasPickedCustomDate(true);
      setDateChoice("custom");
    }
  }

  function showDatePickerIfNeeded() {
    if (showDatePicker) {
      return (
        <View style={styles.datePickerCard}>
          <DateTimePicker
            value={date}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            themeVariant={isDark ? "dark" : "light"}
            onChange={handleDateChange}
          />
          {Platform.OS === "ios" && (
            <Pressable
              onPress={() => setShowDatePicker(false)}
              style={styles.doneDateButton}
            >
              <Text style={styles.doneDateText}>Ferdig</Text>
            </Pressable>
          )}
        </View>
      );
    }

    return null;
  }

  async function saveLog() {
    if (beerCount === 0 && wineCount === 0 && drinksCount === 0) {
      alert("Du må legge til minst en drink før du kan lagre loggen.");
      return;
    }
    await saveDrinkLog(date, beerCount, wineCount, drinksCount, "drakk");

    setBeerCount(0);
    setWineCount(0);
    setDrinksCount(0);
    setIsVisible(false);
    checkAchievements();
  }

  async function saveWhiteDay() {
    await saveDrinkLog(date, 0, 0, 0, "hvitDag");

    setBeerCount(0);
    setWineCount(0);
    setDrinksCount(0);
    setIsVisible(false);
    await checkAchievements();
  }

  function DrinkCounter({
    title,
    count,
    onAdd,
    onSubtract,
  }: {
    title: string;
    count: number;
    onAdd: () => void;
    onSubtract: () => void;
  }) {
    return (
      <View style={styles.addDrinkContainer}>
        <View>
          <Text style={styles.drinkTitle}>{title}</Text>
          <Text style={styles.drinkMeta}>Antall registrert</Text>
        </View>
        <View style={styles.counterControls}>
          <MinusButton onPress={onSubtract} />
          <Text style={styles.counterValue}>{count}</Text>
          <PlusButton onPress={onAdd} />
        </View>
      </View>
    );
  }

  return (
    <Modal
      visible={isVisible}
      animationType="fade"
      onRequestClose={closeModal}
      transparent
    >
      <View style={styles.modalContainer}>
        <View style={[styles.card, { backgroundColor: colors.background }]}>
          <View style={styles.topLine}>
            <HelpButton helpKey="drinklog" />
            <Text style={styles.title}>Drikkelogg</Text>
            <Pressable onPress={closeModal}>
              <Text style={styles.close}>✕</Text>
            </Pressable>
          </View>

          <View style={[styles.headerCard, { backgroundColor: colors.box }]}>
            <Text style={styles.description}>
              Registrer alkohol eller marker dagen som alkoholfri.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Dato</Text>
            <Dropdown
              activeColor={isDark ? "#24372B" : "#EAF4EE"}
              style={styles.dropdown}
              containerStyle={styles.dropdownMenu}
              itemContainerStyle={styles.dropdownItem}
              selectedTextStyle={styles.dropdownText}
              placeholderStyle={styles.dropdownText}
              itemTextStyle={styles.dropdownText}
              data={dateOptions}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder="Velg dato"
              value={dateChoice}
              onChange={(item) => {
                setDateChoice(item.value);

                if (item.value === "today") {
                  setDate(new Date());
                  setShowDatePicker(false);
                  setHasPickedCustomDate(false);
                }

                if (item.value === "yesterday") {
                  const yesterday = new Date();
                  yesterday.setDate(yesterday.getDate() - 1);
                  setDate(yesterday);
                  setShowDatePicker(false);
                  setHasPickedCustomDate(false);
                }

                if (item.value === "custom") {
                  setShowDatePicker(true);
                }
              }}
            />
            {showDatePickerIfNeeded()}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Alkohol</Text>
            <DrinkCounter
              title="Øl"
              count={beerCount}
              onAdd={() => setBeerCount(beerCount + 1)}
              onSubtract={() => setBeerCount(Math.max(0, beerCount - 1))}
            />
            <DrinkCounter
              title="Glass med vin"
              count={wineCount}
              onAdd={() => setWineCount(wineCount + 1)}
              onSubtract={() => setWineCount(Math.max(0, wineCount - 1))}
            />
            <DrinkCounter
              title="Drinker"
              count={drinksCount}
              onAdd={() => setDrinksCount(drinksCount + 1)}
              onSubtract={() => setDrinksCount(Math.max(0, drinksCount - 1))}
            />
          </View>

          <View style={styles.actionSection}>
            <RegularButton title="Lagre i logg" onPress={saveLog} />
            <Pressable onPress={saveWhiteDay} style={styles.whiteDayButton}>
              <Text style={styles.whiteDayButtonText}>Logg hvit dag</Text>
            </Pressable>
            <Pressable onPress={clearDrinkLogs} style={styles.clearButton}>
              <Text style={styles.clearButtonText}>Tøm drikkelogg</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const createStyles = (colors: AppColors) => StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: "90%",
    backgroundColor: colors.box,
    borderRadius: 20,
    padding: 20,
  },
  content: {
    padding: theme.spacing.medium,
    paddingTop: 56,
    paddingBottom: theme.spacing.large,
  },
  topLine: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: theme.spacing.medium,
  },
  headerCard: {
    marginBottom: theme.spacing.small,
  },
  close: {
    color: colors.text,
    fontSize: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: theme.fonts.heading,
    fontWeight: "700",
    color: colors.text,
  },
  description: {
    marginTop: theme.spacing.small,
    fontSize: 16,
    lineHeight: 22,
    color: colors.darkGrey,
  },
  section: {
    backgroundColor: colors.box,
    borderColor: colors.border,
    borderRadius: theme.borderRadius.medium,
    borderWidth: 1,
    gap: theme.spacing.small,
    marginTop: theme.spacing.small,
    padding: theme.spacing.medium,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "700",
  },
  dropdown: {
    width: "100%",
    backgroundColor: colors.box,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: theme.borderRadius.medium,
    height: 48,
    paddingHorizontal: theme.spacing.medium,
  },
  dropdownMenu: {
    backgroundColor: colors.box,
    borderColor: colors.border,
    borderRadius: theme.borderRadius.medium,
  },
  dropdownItem: {
    backgroundColor: colors.box,
  },
  dropdownText: {
    color: colors.text,
    fontSize: 15,
  },
  addDrinkContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.primarySoft,
    borderRadius: theme.borderRadius.small,
    paddingHorizontal: theme.spacing.medium,
    paddingVertical: 12,
  },
  drinkTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "700",
  },
  drinkMeta: {
    color: colors.darkGrey,
    fontSize: 12,
    marginTop: 2,
  },
  counterControls: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing.small,
  },
  counterValue: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "700",
    minWidth: 28,
    textAlign: "center",
  },
  addButton: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: theme.borderRadius.small,
    justifyContent: "center",
    minWidth: 48,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  addButtonText: {
    color: colors.buttonText,
    fontSize: 14,
    fontWeight: "700",
  },
  actionSection: {
    gap: theme.spacing.small,
    marginTop: theme.spacing.medium,
  },
  whiteDayButton: {
    alignItems: "center",
    backgroundColor: colors.box,
    borderColor: colors.primary,
    borderRadius: theme.borderRadius.medium,
    borderWidth: 1,
    height: 50,
    justifyContent: "center",
  },
  whiteDayButtonText: {
    color: colors.primary,
    fontWeight: "700",
  },
  clearButton: {
    alignItems: "center",
    paddingVertical: theme.spacing.small,
  },
  clearButtonText: {
    color: colors.attention,
    fontSize: 13,
    fontWeight: "700",
  },
  datePickerCard: {
    backgroundColor: colors.box,
    borderColor: colors.border,
    borderRadius: theme.borderRadius.medium,
    borderWidth: 1,
    overflow: "hidden",
  },
  doneDateButton: {
    alignItems: "center",
    borderTopColor: colors.border,
    borderTopWidth: 1,
    padding: theme.spacing.small,
  },
  doneDateText: {
    color: colors.primary,
    fontWeight: "700",
  },
});
