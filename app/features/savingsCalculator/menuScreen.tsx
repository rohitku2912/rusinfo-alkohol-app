import { Pressable, StyleSheet, Text, View } from "react-native";
import RegularButton from "../../components/ui/button";
import theme from "../../theme/constantStyling";
import { AppColors, useAppTheme } from "@/app/theme/ThemeProvider";
import HelpButton from "../help/HelpButton";
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
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  return (
    <>
      <View style={styles.hero}>
        <View style={styles.firstLine}>
          <HelpButton helpKey="savingcalculator" />
          <Text style={styles.header}>Sparekalkulator</Text>
          <Pressable onPress={onClose}>
            <Text style={{ fontSize: 20 }}>x</Text>
          </Pressable>
        </View>

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
              <Text style={styles.savedItemTitle}>
                {getSavedEntryText(entry)}
              </Text>
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

      <RegularButton
        title="Lukk"
        onPress={onClose}
        style={styles.closeButton}
      />
    </>
  );
}

const createStyles = (colors: AppColors) => StyleSheet.create({
  hero: {
    paddingTop: 2,
    paddingBottom: 12,
  },
  firstLine: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  header: {
    fontFamily: theme.fonts.heading,
    fontSize: 30,
    fontWeight: "700",
    textAlign: "left",
    color: colors.text,
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.darkGrey,
    textAlign: "left",
    marginTop: 6,
  },
  savedCard: {
    marginTop: 8,
    marginBottom: 12,
    backgroundColor: colors.primary,
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
    color: colors.buttonText,
    textAlign: "left",
    fontSize: 30,
    fontWeight: "700",
  },
  savedList: {
    marginTop: 4,
    marginBottom: 12,
    backgroundColor: colors.box,
    borderRadius: theme.borderRadius.medium,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },
  savedListTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
  },
  emptyText: {
    fontSize: 14,
    color: colors.darkGrey,
  },
  savedItem: {
    backgroundColor: colors.box,
    borderWidth: 1,
    borderColor: colors.border,
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
    color: colors.text,
  },
  savedItemMeta: {
    fontSize: 13,
    color: colors.darkGrey,
  },
  editButton: {
    backgroundColor: colors.primary,
    borderRadius: theme.borderRadius.small,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  editButtonText: {
    color: colors.buttonText,
    fontWeight: "700",
  },
  deleteButton: {
    backgroundColor: colors.lightGrey,
    borderRadius: theme.borderRadius.small,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  deleteButtonText: {
    color: colors.text,
    fontWeight: "700",
  },
  buttons: {
    backgroundColor: colors.box,
    borderColor: colors.border,
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
    backgroundColor: colors.darkGrey,
    borderRadius: theme.borderRadius.medium,
  },
});
