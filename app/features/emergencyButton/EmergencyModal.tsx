import RegularButton from "@/app/components/ui/button";
import { Modal, StyleSheet, Text, View } from "react-native";

type Props = {
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
};

export default function EmergencyModal({ isVisible, setIsVisible }: Props) {
  function closeModal() {
    setIsVisible(false);
  }

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      onRequestClose={closeModal}
    >
      <View style={styles.modalContainer}>
        <RegularButton title="close modal" onPress={closeModal} />
        <Text style={styles.header}>
          Dette er grunner du har gitt for å slutte:
        </Text>
        <Text style={styles.subHeader}>
          Grunner...Grunner...Grunner...Grunner...Grunner
        </Text>
        <Text style={styles.header}>Kriseplan</Text>
        <Text style={styles.subHeader}>plan... plan...plan...plan...</Text>
        <Text style={styles.header}>
          Du har en avtale med ... om å kunne ringes når du trenger det.
        </Text>
        <Text style={styles.button}>trykk her for å ring til 999-99-999</Text>
        <Text style={styles.header}>
          Trenger du en unnskyldning for å ikke drikke?
        </Text>
        <Text style={styles.subHeader}>1. det er lov å bare si nei</Text>
        <Text style={styles.subHeader}>2. Jeg kjører i kveld</Text>
        <Text style={styles.subHeader}>3. Jeg må tidlig opp i morgen </Text>
        <Text style={styles.subHeader}>4. jeg har planer senere i kveld</Text>
        <Text style={styles.edit}> ⚙️rediger din emergency-side</Text>
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  modalContainer: {
    marginTop: 50,
    padding: 20,
  },
  header: {
    fontSize: 25,
    fontWeight: "bold",
    margin: 10,
  },
  subHeader: {
    fontSize: 13,
    fontWeight: "light",
  },
  button: {
    fontSize: 16,
    fontWeight: "bold",
    margin: 10,
    backgroundColor: "lightgray",
    padding: 10,
    borderRadius: 5,
  },
  edit: {
    fontSize: 16,
    fontWeight: "bold",
    margin: 10,
    backgroundColor: "lightgray",
    padding: 10,
    borderRadius: 5,
  },
});
