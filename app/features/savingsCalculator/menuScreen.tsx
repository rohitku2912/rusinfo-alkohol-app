import { Pressable, StyleSheet, Text, View } from "react-native";
import RegularButton from "../../components/ui/button";
import theme from "../../theme/constantStyling";
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
        <Text style={styles.header}>Sparekalkulator</Text>
        <Text style={styles.body}>
          Se hvor mye du kan spare ved å redusere alkoholforbruket.
        </Text>
      </View>

      <View style={styles.savedCard}>
        <Text style={styles.savedLabel}>Du kunne spart</Text>
        <Text style={styles.savedAmount}>{formatNumber(savedTotal)} kr</Text>
      </View>

      <View style={styles.savedList}>
        <Text style={styles.savedListTitle}>Lagrede beregninger</Text>
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
        <Text style={styles.savedListTitle}>Legg til drikke</Text>
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
    paddingTop: 2,
    paddingBottom: 12,
  },
  header: {
    fontFamily: theme.fonts.heading,
    fontSize: 30,
    fontWeight: "700",
    textAlign: "left",
    color: theme.colors.text,
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
    color: theme.colors.darkGrey,
    textAlign: "left",
    marginTop: 6,
  },
  savedCard: {
    marginTop: 8,
    marginBottom: 12,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.medium,
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  savedLabel: {
    color: "rgba(255,255,255,0.82)",
    fontSize: 14,
    marginBottom: 6,
  },
  savedAmount: {
    color: theme.colors.buttonText,
    textAlign: "left",
    fontSize: 30,
    fontWeight: "700",
  },
  savedList: {
    marginTop: 4,
    marginBottom: 12,
    backgroundColor: theme.colors.box,
    borderRadius: theme.borderRadius.medium,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.lightGrey,
    gap: 12,
  },
  savedListTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.text,
  },
  emptyText: {
    fontSize: 14,
    color: theme.colors.darkGrey,
  },
  savedItem: {
    backgroundColor: theme.colors.box,
    borderWidth: 1,
    borderColor: theme.colors.lightGrey,
    borderRadius: theme.borderRadius.small,
    padding: 12,
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
    color: theme.colors.text,
  },
  savedItemMeta: {
    fontSize: 13,
    color: theme.colors.darkGrey,
  },
  editButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.small,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  editButtonText: {
    color: theme.colors.buttonText,
    fontWeight: "700",
  },
  deleteButton: {
    backgroundColor: theme.colors.lightGrey,
    borderRadius: theme.borderRadius.small,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  deleteButtonText: {
    color: theme.colors.text,
    fontWeight: "700",
  },
  buttons: {
    backgroundColor: theme.colors.box,
    borderColor: theme.colors.lightGrey,
    borderRadius: theme.borderRadius.medium,
    borderWidth: 1,
    gap: 10,
    marginVertical: 12,
    padding: 16,
  },
  primaryButton: {
    width: "100%",
    borderRadius: theme.borderRadius.medium,
    height: 50,
  },
  closeButton: {
    marginTop: 8,
    backgroundColor: theme.colors.darkGrey,
    borderRadius: theme.borderRadius.medium,
  },
});
