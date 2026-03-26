import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Keyboard, Platform, StyleSheet, Text, TextInput, View } from "react-native";
import RegularButton from "../../components/ui/button";
import { DrinkType, Entry } from "./SavingsCalcModal";

function calculateSavings(entry: Entry): number {
  const now = new Date();
  const diffMs = now.getTime() - entry.startDate.getTime();

  const days = diffMs / (1000 * 60 * 60 * 24);

  let periods = 0;

  if (entry.frequency === "dag") {
    periods = days;
  } else if (entry.frequency === "uke") {
    periods = days / 7;
  } else {
    periods = days / 30;
  }

  return Math.floor(periods) * entry.amount * entry.price;
}

type Props = {
  entry: Entry;
  setEntry: React.Dispatch<React.SetStateAction<Entry>>;
  onBack: () => void;
  onSave: () => void;
};

const DRINK_CONFIG: Record<
  DrinkType,
  {
    sizes: number[];
    prices: { store: number; bar: number };
  }
> = {
  ØL: {
    sizes: [0.33, 0.4, 0.5],
    prices: { store: 27, bar: 110 },
  },
  VIN: {
    sizes: [0.15, 0.75],
    prices: { store: 150, bar: 120 },
  },
  BRENNEVIN: {
    sizes: [0.04, 0.7],
    prices: { store: 400, bar: 120 },
  },
};

export default function DrinkFormScreen({
  entry,
  setEntry,
  onBack,
  onSave,
}: Props) {
  const config = DRINK_CONFIG[entry.type];

  const [showPicker, setShowPicker] = useState(false);

  return (
    <>
      <Text style={styles.header}>Du legger nå til: {entry.type}</Text>

      {/* SIZE */}
      <Text>Velg størrelse</Text>
      <View style={styles.row}>
        {config.sizes.map((size) => (
          <RegularButton
            key={size}
            title={`${size}L`}
            onPress={() => setEntry((prev) => ({ ...prev, unitSize: size }))}
          />
        ))}
      </View>

      {/* FREQUENCY */}
      <Text>Velg tidsmål</Text>
      <View style={styles.row}>
        {(["dag", "uke", "måned"] as const).map((f) => (
          <RegularButton
            key={f}
            title={f}
            onPress={() => setEntry((prev) => ({ ...prev, frequency: f }))}
          />
        ))}
      </View>

      {/* AMOUNT */}
      <Text>Antall: {entry.amount}</Text>
      <View style={styles.row}>
        <RegularButton
          title="-"
          onPress={() =>
            setEntry((prev) => ({
              ...prev,
              amount: Math.max(0, prev.amount - 1),
            }))
          }
        />
        <RegularButton
          title="+"
          onPress={() =>
            setEntry((prev) => ({
              ...prev,
              amount: prev.amount + 1,
            }))
          }
        />
      </View>

      {/* PRICE */}
      <Text>Pris</Text>
      <View style={styles.row}>
        <RegularButton
          title="butikk"
          onPress={() =>
            setEntry((prev) => ({
              ...prev,
              price: config.prices.store,
            }))
          }
        />
        <RegularButton
          title="bar"
          onPress={() =>
            setEntry((prev) => ({
              ...prev,
              price: config.prices.bar,
            }))
          }
        />
      </View>

      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Egen pris"
        value={entry.price ? String(entry.price) : ""}
        returnKeyType="done"
        blurOnSubmit
        onSubmitEditing={Keyboard.dismiss}
        onChangeText={(text) =>
          setEntry((prev) => ({
            ...prev,
            price: Number(text) || 0,
          }))
        }
      />

      <Text>Startdato</Text>

      <RegularButton
        title={showPicker ? "Skjul dato" : entry.startDate.toDateString()}
        onPress={() => {
          Keyboard.dismiss();
          setShowPicker((prev) => !prev);
        }}
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

              if (selectedDate) {
                setEntry((prev) => ({
                  ...prev,
                  startDate: selectedDate,
                }));
              }
            }}
          />
        </View>
      )}

      <Text style={styles.summary}>
        {entry.amount} × {entry.unitSize}L per {entry.frequency}
      </Text>

      <Text style={styles.summary}>Spart: {calculateSavings(entry)} kr 💰</Text>

      <RegularButton title="Lagre" onPress={onSave} />
      <RegularButton title="Tilbake" onPress={onBack} />
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    padding: 8,
    marginVertical: 10,
    borderRadius: 8,
  },
  pickerContainer: {
    marginTop: 10,
    marginBottom: 20,
    borderRadius: 16,
    backgroundColor: "#fff",
    alignItems: "center",
    overflow: "hidden",
  },
  summary: {
    textAlign: "center",
    marginVertical: 20,
    fontWeight: "600",
  },
});
