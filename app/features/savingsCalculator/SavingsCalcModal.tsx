import { useState } from "react";
import {
  Keyboard,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
} from "react-native";
import DrinkFormScreen from "./DrinkFormScreen";
import MenuScreen from "./menuScreen";
export type DrinkType = "ØL" | "VIN" | "BRENNEVIN";

export type Entry = {
  type: DrinkType;
  unitSize: number;
  frequency: "dag" | "uke" | "måned";
  amount: number;
  price: number;
  startDate: Date;
};

type Screen = "menu" | "form";

export default function SavingsCalcModal({
  isVisible,
  setIsVisible,
}: {
  isVisible: boolean;
  setIsVisible: (v: boolean) => void;
}) {
  const [screen, setScreen] = useState<Screen>("menu");

  const defaultEntry: Entry = {
    type: "ØL",
    unitSize: 0.33,
    frequency: "uke",
    amount: 1,
    price: 27,
    startDate: new Date(),
  };

  const [currentEntry, setCurrentEntry] = useState<Entry>(defaultEntry);

  const handleClose = () => {
    setScreen("menu");
    setCurrentEntry(defaultEntry);
    setIsVisible(false);
  };

  return (
    <Modal
      transparent
      visible={isVisible}
      animationType="slide"
      onRequestClose={handleClose}
    >
      <Pressable style={styles.backdrop} onPress={Keyboard.dismiss}>
        <Pressable style={styles.modalBox} onPress={Keyboard.dismiss}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "on-drag"}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {screen === "menu" && (
              <MenuScreen
                onSelect={(type) => {
                  setCurrentEntry((prev) => ({ ...prev, type }));
                  setScreen("form");
                }}
                onClose={handleClose}
              />
            )}

            {screen === "form" && (
              <DrinkFormScreen
                entry={currentEntry}
                setEntry={setCurrentEntry}
                onBack={() => setScreen("menu")}
                onSave={() => {
                  console.log("Saved entry:", currentEntry);
                  handleClose();
                }}
              />
            )}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "92%",
    minHeight: 420,
    maxHeight: "85%",
    backgroundColor: "#fff",
    borderRadius: 28,
    padding: 24,
  },
  content: {
    flexGrow: 1,
  },
});
