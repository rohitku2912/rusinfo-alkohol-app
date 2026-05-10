import { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import HelpButton from "../help/HelpButton";
import CallAFriend from "./CallAFriend";
import EmergencyPlan from "./EmergencyPlan";
import PersonalGoal from "./PersonalGoal";

type Props = {
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
};

export default function EmergencyModal({ isVisible, setIsVisible }: Props) {
  function closeModal() {
    setIsVisible(false);
  }

  const [isEditingNumber, setIsEditingNumber] = useState(false);
  const [isEditingPlan, setIsEditingPlan] = useState(false);

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      onRequestClose={closeModal} transparent
    >
      <View style={styles.modalContainer}>
        <Pressable onPress={closeModal} style={styles.closeButton}>
          <Text style={styles.closeText}>✕</Text>
        </Pressable>

        
          <Text style={styles.header}>Kriseplan</Text>
          <View style={{ position: "absolute", top: 0, right: 0 }}>

  <View style={{ right: 50 }}>

    <HelpButton helpKey="emergencybutton" />

  </View>

</View>
<ScrollView contentContainerStyle={styles.scrollContent}>
          {!isEditingNumber && !isEditingPlan && <PersonalGoal />}

          {!isEditingNumber && (
            <EmergencyPlan onEditingChange={setIsEditingPlan} />
          )}

          {!isEditingPlan && (
            <CallAFriend onEditingChange={setIsEditingNumber} />
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  modalContainer: {
    marginTop: 50,
  backgroundColor: "#f8d7da",
    position: "relative",
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
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 8,
    zIndex: 10,
  },

  closeText: {
    fontSize: 22,
    fontWeight: "600",
    color: "#111827",
  },
  scrollContent: {
    paddingBottom: 40,
  },
});
