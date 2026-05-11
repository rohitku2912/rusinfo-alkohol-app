import RegularButton from "@/app/components/ui/button";
import EditButton from "@/app/components/ui/editButton";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useEffect, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import HelpButton from "../help/HelpButton";

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
  }) => void;
};

export default function PartyPlannerModal({ visible, onClose, onSave }: Props) {
  const [start, setStart] = useState(new Date());
  const [end, setEnd] = useState(new Date());

  const [beer, setBeer] = useState(0);
  const [wine, setWine] = useState(0);
  const [drinks, setDrinks] = useState(0);

  const [editingStart, setEditingStart] = useState(false);
  const [editingEnd, setEditingEnd] = useState(false);

  useEffect(() => {
    if (visible) {
      const now = new Date();

      setStart(now);
      setEnd(new Date(now.getTime() + 8 * 60 * 60 * 1000));

      setBeer(0);
      setWine(0);
      setDrinks(0);
      setEditingStart(false);
      setEditingEnd(false);
    }
  }, [visible]);

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

          <View style={styles.row}>
            <Text>Øl</Text>
            <Pressable onPress={() => setBeer(Math.max(0, beer - 1))}>
              <Text style={styles.btn}>-</Text>
            </Pressable>
            <Text>{beer}</Text>
            <Pressable onPress={() => setBeer(beer + 1)}>
              <Text style={styles.btn}>+</Text>
            </Pressable>
          </View>

          <View style={styles.row}>
            <Text>Vin</Text>
            <Pressable onPress={() => setWine(Math.max(0, wine - 1))}>
              <Text style={styles.btn}>-</Text>
            </Pressable>
            <Text>{wine}</Text>
            <Pressable onPress={() => setWine(wine + 1)}>
              <Text style={styles.btn}>+</Text>
            </Pressable>
          </View>

          <View style={styles.row}>
            <Text>Drinker</Text>
            <Pressable onPress={() => setDrinks(Math.max(0, drinks - 1))}>
              <Text style={styles.btn}>-</Text>
            </Pressable>
            <Text>{drinks}</Text>
            <Pressable onPress={() => setDrinks(drinks + 1)}>
              <Text style={styles.btn}>+</Text>
            </Pressable>
          </View>

          {/* start-tid */}
          <Text style={styles.subtitle}>Start</Text>

          {!editingStart ? (
            <Pressable
              onPress={() => setEditingStart(true)}
              style={styles.timeButton}
            >
              <Text>
                {start.toLocaleTimeString([], {
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
                  if (date) setStart(date);
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
                {end.toLocaleTimeString([], {
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
                onChange={(e, date) => {
                  if (date) setEnd(date);
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

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 10,
  },

  btn: {
    fontSize: 20,
    paddingHorizontal: 8,
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
