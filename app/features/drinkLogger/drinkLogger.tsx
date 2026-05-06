import RegularButton from "@/app/components/ui/button";
import theme from "@/app/theme/constantStyling";
import {
  clearDrinkLogs,
  getDrinkLogs,
  saveDrinkLog,
} from "@/lib/storage/drinkLogs";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";

type Props = {
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
};

export default function DrinkLogger({ isVisible, setIsVisible }: Props) {
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

  const drinkTypes = [
    { label: "Øl", value: "beer" },
    { label: "Vinglass", value: "wine" },
    { label: "Drink", value: "drinks" },
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

  function datePicked() {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    if (date.toDateString() === today.toDateString()) {
      return "i dag";
    }
    if (date.toDateString() === yesterday.toDateString()) {
      return "i går";
    }
    return date.toLocaleDateString();
  }

  function showDatePickerIfNeeded() {
    if (showDatePicker) {
      return (
        <View>
          <DateTimePicker
            value={date}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={handleDateChange}
          />
          {Platform.OS === "ios" && (
            <Pressable onPress={() => setShowDatePicker(false)}>
              <Text>ferdig</Text>
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
    await saveDrinkLog(date, beerCount, wineCount, drinksCount);

    const logs = await getDrinkLogs();
    alert(JSON.stringify(logs));

    setBeerCount(0);
    setWineCount(0);
    setDrinksCount(0);
  }

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      onRequestClose={closeModal}
    >
      <View style={styles.modalContainer}>
        <RegularButton title="lukk" onPress={closeModal} />
        <Text style={styles.title}>Drikkelogg</Text>
        <Text style={styles.description}>
          Her kan du logge når du har drukket.
        </Text>
        <Dropdown
          style={styles.dropdown}
          data={dateOptions}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder="Select"
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
        <View style={styles.addDrinkContainer}>
          <Text>Øl</Text>
          <Text>{beerCount}</Text>
          <Pressable onPress={() => setBeerCount(beerCount + 1)}>
            <Text>+1</Text>
          </Pressable>
        </View>
        <Pressable onPress={clearDrinkLogs}>
          <Text>Tøm drikkelogg</Text>
        </Pressable>
        <View style={styles.addDrinkContainer}>
          <Text>Glass med vin</Text>
          <Text>{wineCount}</Text>
          <Pressable onPress={() => setWineCount(wineCount + 1)}>
            <Text>+1</Text>
          </Pressable>
        </View>
        <View style={styles.addDrinkContainer}>
          <Text>Drinker</Text>
          <Text>{drinksCount}</Text>
          <Pressable onPress={() => setDrinksCount(drinksCount + 1)}>
            <Text>+1</Text>
          </Pressable>
        </View>
        <Pressable onPress={saveLog}>
          <Text>Lagre i din Logg</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    padding: theme.spacing.large,
    paddingTop: 56,
    backgroundColor: "#e9dfd2",
  },
  title: {
    marginTop: theme.spacing.large,
    fontSize: 28,
    fontWeight: "700",
    color: theme.colors.text,
  },
  description: {
    marginTop: theme.spacing.small,
    fontSize: 16,
    color: theme.colors.text,
  },
  dropdown: {
    width: 120,
    backgroundColor: "#fff",
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.small,
    marginTop: theme.spacing.medium,
  },
  addDrinkContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: theme.spacing.medium,
    gap: theme.spacing.medium,
  },
});
