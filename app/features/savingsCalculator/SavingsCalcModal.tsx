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
import {
  createDefaultEntry,
  DRINK_PRESETS,
  DrinkType,
  Entry,
  SavedEntry,
} from "./config";
import DrinkFormScreen from "./DrinkFormScreen";
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
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.backdrop}>
        <Pressable
          style={styles.backdropDismissArea}
          onPress={Keyboard.dismiss}
        />
        <View style={styles.modalBox}>
          <View style={styles.handle} />

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
    backgroundColor: "rgba(10, 23, 43, 0.48)",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingTop: 24,
  },
  backdropDismissArea: {
    ...StyleSheet.absoluteFillObject,
  },
  modalBox: {
    width: "100%",
    height: "94%",
    backgroundColor: "#f7f1e8",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(94, 63, 48, 0.12)",
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 10,
  },
  handle: {
    alignSelf: "center",
    width: 56,
    height: 6,
    borderRadius: 999,
    backgroundColor: "rgba(107, 86, 73, 0.35)",
    marginBottom: 14,
  },
  content: {
    flexGrow: 1,
    paddingBottom: 12,
  },
});
