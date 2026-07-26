import RegularButton from "@/app/components/ui/button";
import EditButton from "@/app/components/ui/editButton";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useEffect, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import HelpButton from "../help/HelpButton";
import theme from "@/app/theme/constantStyling";

/*typer*/
type Props = {
  visible: boolean;
  onClose: () => void;
  onSave: (data: {
    start: Date;
    end: Date;
    beer: number;
    wine: number;
    drinks: number;
    soberParty: boolean;
  }) => void;
};

export default function PartyPlannerModal({ visible, onClose, onSave }: Props) {
  const [start, setStart] = useState(new Date());
  const [end, setEnd] = useState(new Date());

  const [beer, setBeer] = useState(0);
  const [wine, setWine] = useState(0);
  const [drinks, setDrinks] = useState(0);
  const [soberParty, setSoberParty] = useState(false);

  const [editingStart, setEditingStart] = useState(false);
  const [editingEnd, setEditingEnd] = useState(false);

  function renderDrinkCounter(
    label: string,
    value: number,
    setValue: (value: number) => void,
  ) {
    return (
      <View style={styles.drinkCounterGroup}>
        <Text style={styles.drinkLabel}>{label}</Text>
        <View style={styles.amountCard}>
          <RegularButton
            title="-"
            onPress={() => setValue(Math.max(0, value - 1))}
            style={styles.amountButton}
          />
          <Text style={styles.amountValue}>{value}</Text>
          <RegularButton
            title="+"
            onPress={() => setValue(value + 1)}
            style={styles.amountButton}
          />
        </View>
      </View>
    );
  }

  useEffect(() => {
    if (visible) {
      const now = new Date();

      setStart(now);
      setEnd(new Date(now.getTime() + 8 * 60 * 60 * 1000));

      setBeer(0);
      setWine(0);
      setDrinks(0);
      setSoberParty(false);
      setEditingStart(false);
      setEditingEnd(false);
    }
  }, [visible]);

  function chooseSoberParty() {
    setSoberParty((previousValue) => {
      const nextValue = !previousValue;
      if (nextValue) {
        setBeer(0);
        setWine(0);
        setDrinks(0);
      }
      return nextValue;
    });
  }

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.header}>
            <HelpButton helpKey="partyplanner" />

            <Text style={styles.title}>Planlegg festen</Text>

            <Pressable onPress={onClose}>
              <Text style={styles.close}>✕</Text>
            </Pressable>
          </View>

          {/* drikke */}
          <Text style={styles.subtitle}>Drikke</Text>

          <Pressable
            onPress={chooseSoberParty}
            style={[
              styles.soberButton,
              soberParty && styles.soberButtonSelected,
            ]}
          >
            <Text
              style={[
                styles.soberButtonTitle,
                soberParty && styles.soberButtonTitleSelected,
              ]}
            >
              Hvit fest
            </Text>
            <Text style={styles.soberButtonText}>
              Planlegg en fest eller tur uten alkohol.
            </Text>
          </Pressable>

          {!soberParty && (
            <View style={styles.drinkCounterList}>
              {renderDrinkCounter("Øl", beer, setBeer)}
              {renderDrinkCounter("Vin", wine, setWine)}
              {renderDrinkCounter("Drinker", drinks, setDrinks)}
            </View>
          )}

          {/* start-tid */}
          <Text style={styles.subtitle}>Start</Text>

          {!editingStart ? (
            <Pressable
              onPress={() => setEditingStart(true)}
              style={styles.timeButton}
            >
              <Text>
  {start.toLocaleString("nb-NO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })}
</Text>
            </Pressable>
          ) : (
            <View style={styles.pickerBox}>
              <DateTimePicker
                value={start}
                mode="datetime"
                display="spinner"
                onChange={(e, date) => {
                  if (!date) {
                    return;
                  }

                  setStart(date);

                  if (end < date) {
                    setEnd(date);
                  }
                }}
              />
              <EditButton
                isEditing={true}
                onPress={() => setEditingStart(false)}
              />
            </View>
          )}

          {/* slutt-tid*/}
          <Text style={styles.subtitle}>Slutt</Text>

          {!editingEnd ? (
            <Pressable
              onPress={() => setEditingEnd(true)}
              style={styles.timeButton}
            >
              <Text>
  {end.toLocaleString("nb-NO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })}
</Text>
            </Pressable>
          ) : (
            <View style={styles.pickerBox}>
              <DateTimePicker
                value={end}
                mode="datetime"
                display="spinner"
                minimumDate={start}
                onChange={(e, date) => {
                  if (!date) {
                    return;
                  }

                  setEnd(date < start ? start : date);
                }}
              />
              <EditButton
                isEditing={true}
                onPress={() => setEditingEnd(false)}
              />
            </View>
          )}

          {/* lagre*/}
          <View style={{ marginTop: 15 }}>
            <RegularButton
              title="Start fest"
              onPress={() =>
                onSave({
                  start,
                  end,
                  beer,
                  wine,
                  drinks,
                  soberParty,
                })
              }
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },

  close: {
    fontSize: 20,
  },

  subtitle: {
    marginTop: 15,
    fontWeight: "bold",
  },

  soberButton: {
    backgroundColor: theme.colors.box,
    borderColor: theme.colors.lightGrey,
    borderRadius: theme.borderRadius.medium,
    borderWidth: 1,
    gap: 4,
    marginTop: 10,
    padding: 14,
  },
  soberButtonSelected: {
    backgroundColor: "#EAF4EE",
    borderColor: theme.colors.primary,
  },
  soberButtonTitle: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "700",
  },
  soberButtonTitleSelected: {
    color: theme.colors.primary,
  },
  soberButtonText: {
    color: theme.colors.darkGrey,
    fontSize: 13,
  },
  drinkCounterList: {
    gap: 12,
    marginTop: 12,
  },
  drinkCounterGroup: {
    gap: 6,
  },
  drinkLabel: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "700",
  },
  amountCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#EAF4EE",
    borderRadius: theme.borderRadius.medium,
    padding: 10,
  },
  amountButton: {
    width: 56,
    borderRadius: theme.borderRadius.small,
  },
  amountValue: {
    color: theme.colors.text,
    fontSize: 28,
    fontWeight: "700",
    minWidth: 36,
    textAlign: "center",
  },

  timeButton: {
    backgroundColor: "#f2f2f2",
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
  },
  pickerBox: {
    backgroundColor: "#f2f2f2",
    borderRadius: 12,
    padding: 10,
    marginTop: 10,
    alignItems: "center",
  },
});
