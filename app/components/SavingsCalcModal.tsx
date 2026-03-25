import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
export type SavingsCalcModalProps = {
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
  confirmcalculation: VoidFunction;
};

export default function SavingsCalcModal({
  isVisible,
  setIsVisible,
  confirmcalculation,
}: SavingsCalcModalProps) {
  return (
    <Modal transparent visible={isVisible} animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          <Text>SPAREKALKULATOR</Text>

          <Text>
            Her kan du fylle inn hvor mye du bruker på alkohol. Appen vil
            automatisk holde kontroll på hvor mye du har spart basert på hvor
            lenge siden du startet kalkulatoren
          </Text>

          <Pressable onPress={() => setIsVisible(false)}>
            <Text>Lukk</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalBox: {
    width: "92%",
    minHeight: 420,
    backgroundColor: "#fff",
    borderRadius: 28,
    padding: 24,
    justifyContent: "space-between",
  },
});
