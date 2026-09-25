import theme from "@/app/theme/constantStyling";
import { useAppTheme } from "@/app/theme/ThemeProvider";
import { useState } from "react";
import {
  Keyboard,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import DrinkFormScreen from "./DrinkFormScreen";
import {
  DRINK_PRESETS,
  DrinkType,
  Entry,
  SavedEntry,
  createDefaultEntry,
} from "./config";
import MenuScreen from "./menuScreen";
import { calculateTotalSavings, createSavedEntry } from "./utils";

type Screen = "menu" | "form";

type Props = {
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
  savedEntries: SavedEntry[];
  onAddEntry: (entry: SavedEntry) => void;
  onDeleteEntry: (entryId: string) => void;
  onUpdateEntry: (entry: SavedEntry) => void;
};

export default function SavingsCalcModal({
  isVisible,
  setIsVisible,
  savedEntries,
  onAddEntry,
  onDeleteEntry,
  onUpdateEntry,
}: Props) {
  const { colors } = useAppTheme();
  const [screen, setScreen] = useState<Screen>("menu");
  const [currentEntry, setCurrentEntry] = useState<Entry>(createDefaultEntry());
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const keyboardDismissMode = Platform.OS === "ios" ? "interactive" : "on-drag";
  const savedTotal = calculateTotalSavings(savedEntries);

  function updateEntry(changes: Partial<Entry>) {
    setCurrentEntry((previousEntry) => ({
      ...previousEntry,
      ...changes,
    }));
  }

  function resetCurrentEntry() {
    setCurrentEntry(createDefaultEntry());
  }

  function stopEditing() {
    setEditingEntryId(null);
  }

  function goToMenu() {
    setScreen("menu");
  }

  function startNewEntry(type: DrinkType) {
    const firstPreset = DRINK_PRESETS[type][0];

    stopEditing();
    setCurrentEntry({
      ...createDefaultEntry(),
      type,
      label: firstPreset.label,
      price: firstPreset.price,
      calories: firstPreset.calories,
    });
    setScreen("form");
  }

  function startEditing(entry: SavedEntry) {
    setEditingEntryId(entry.id);
    setCurrentEntry({
      type: entry.type,
      label: entry.label,
      frequency: entry.frequency,
      amount: entry.amount,
      price: entry.price,
      calories: entry.calories,
      startDate: new Date(entry.startDate),
    });
    setScreen("form");
  }

  function saveEntry() {
    if (editingEntryId) {
      onUpdateEntry({
        ...currentEntry,
        id: editingEntryId,
      });
    } else {
      onAddEntry(createSavedEntry(currentEntry));
    }

    stopEditing();
    resetCurrentEntry();
    goToMenu();
  }

  function handleClose() {
    stopEditing();
    goToMenu();
    resetCurrentEntry();
    setIsVisible(false);
  }

  return (
    <Modal
      transparent
      visible={isVisible}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.backdrop}>
        <Pressable
          style={styles.backdropDismissArea}
          onPress={Keyboard.dismiss}
        />
        <View style={[styles.modalBox, { backgroundColor: colors.box }]}>
          {screen === "menu" && (
            <ScrollView
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode={keyboardDismissMode}
              contentContainerStyle={styles.content}
              showsVerticalScrollIndicator={false}
              bounces={false}
            >
              <MenuScreen
                savedTotal={savedTotal}
                savedEntries={savedEntries}
                onEdit={startEditing}
                onDelete={onDeleteEntry}
                onSelect={startNewEntry}
                onClose={handleClose}
              />
            </ScrollView>
          )}

          {screen === "form" && (
            <DrinkFormScreen
              entry={currentEntry}
              onChangeEntry={updateEntry}
              onBack={goToMenu}
              onSave={saveEntry}
            />
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  backdropDismissArea: {
    ...StyleSheet.absoluteFillObject,
  },
  modalBox: {
    width: "90%",
    height: "90%",
    borderRadius: 20,
    padding: 20,
  },
  content: {
    paddingBottom: theme.spacing.small,
  },
});
