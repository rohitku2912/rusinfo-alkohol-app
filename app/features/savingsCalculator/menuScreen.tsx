import { Pressable, StyleSheet, Text, View } from "react-native";
import RegularButton from "../../components/ui/button";
import { DrinkType, SavedEntry } from "./config";
import { calculateSavings, formatNumber, getSavedEntryText } from "./utils";

type Props = {
  savedTotal: number;
  savedEntries: SavedEntry[];
  onEdit: (entry: SavedEntry) => void;
  onDelete: (entryId: string) => void;
  onSelect: (type: DrinkType) => void;
  onClose: () => void;
};

export default function MenuScreen({
  savedTotal,
  savedEntries,
  onEdit,
  onDelete,
  onSelect,
  onClose,
}: Props) {
  return (
    <>
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>Sparekalkulator</Text>
        <Text style={styles.header}>Hvor mye kunne du spart?</Text>
        <Text style={styles.body}>
          Velg en type drikke og bygg opp kalkulatoren steg for steg.
        </Text>
      </View>

      <View style={styles.savedCard}>
        <Text style={styles.savedLabel}>Spart hittil</Text>
        <Text style={styles.savedAmount}>{formatNumber(savedTotal)} kr</Text>
      </View>

      <View style={styles.savedList}>
        <Text style={styles.savedListTitle}>Dette består summen av</Text>
        {savedEntries.length === 0 && (
          <Text style={styles.emptyText}>Ingen valg lagret ennå.</Text>
        )}

        {savedEntries.map((entry) => (
          <View key={entry.id} style={styles.savedItem}>
            <View style={styles.savedItemText}>
              <Text style={styles.savedItemTitle}>{getSavedEntryText(entry)}</Text>
              <Text style={styles.savedItemMeta}>
                {formatNumber(calculateSavings(entry))} kr spart siden{" "}
                {entry.startDate.toDateString()}
              </Text>
            </View>
            <View style={styles.savedItemActions}>
              <Pressable
                style={styles.editButton}
                onPress={() => onEdit(entry)}
              >
                <Text style={styles.editButtonText}>Endre</Text>
              </Pressable>
              <Pressable
                style={styles.deleteButton}
                onPress={() => onDelete(entry.id)}
              >
                <Text style={styles.deleteButtonText}>Slett</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.buttons}>
        <RegularButton
          title="Øl"
          onPress={() => onSelect("ØL")}
          style={styles.primaryButton}
        />
        <RegularButton
          title="Vin"
          onPress={() => onSelect("VIN")}
          style={styles.primaryButton}
        />
        <RegularButton
          title="Brennevin"
          onPress={() => onSelect("BRENNEVIN")}
          style={styles.primaryButton}
        />
      </View>

      <RegularButton title="Lukk" onPress={onClose} style={styles.closeButton} />
    </>
  );
}

const styles = StyleSheet.create({
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
    lineHeight: 34,
    fontWeight: "800",
    textAlign: "left",
    color: "#2f221b",
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
    color: "#6b5649",
    textAlign: "left",
    marginTop: 10,
  },
  savedCard: {
    marginTop: 16,
    marginBottom: 12,
    backgroundColor: "#c55c2f",
    borderRadius: 24,
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  savedLabel: {
    color: "rgba(255,255,255,0.82)",
    fontSize: 13,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
  },
  savedAmount: {
    color: "#fffaf4",
    textAlign: "left",
    fontSize: 30,
    fontWeight: "800",
  },
  savedList: {
    marginTop: 4,
    marginBottom: 12,
    backgroundColor: "#fffaf4",
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(133, 92, 66, 0.12)",
    gap: 12,
  },
  savedListTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#4b382e",
  },
  emptyText: {
    fontSize: 14,
    color: "#7b675a",
  },
  savedItem: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#eadbcc",
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  savedItemText: {
    flex: 1,
    gap: 4,
  },
  savedItemActions: {
    gap: 8,
  },
  savedItemTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#2f221b",
  },
  savedItemMeta: {
    fontSize: 13,
    color: "#7b675a",
  },
  editButton: {
    backgroundColor: "#c55c2f",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  editButtonText: {
    color: "#fffaf4",
    fontWeight: "700",
  },
  deleteButton: {
    backgroundColor: "#6b5649",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  deleteButtonText: {
    color: "#fffaf4",
    fontWeight: "700",
  },
  buttons: {
    gap: 12,
    marginVertical: 12,
  },
  primaryButton: {
    width: "100%",
    borderRadius: 18,
    height: 56,
  },
  closeButton: {
    marginTop: 8,
    backgroundColor: "#6b5649",
    borderRadius: 18,
  },
});
