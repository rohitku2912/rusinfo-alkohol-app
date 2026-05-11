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

  const [isEditingPlan, setIsEditingPlan] = useState(false);

  return (
    <Modal
  visible={isVisible}
  animationType="slide"
  onRequestClose={closeModal}
  transparent
>
  <View style={styles.modalContainer}>
    
    <Pressable onPress={closeModal} style={styles.closeButton}>
      <Text style={styles.closeText}>✕</Text>
    </Pressable>

    <View style={styles.headerRow}>
  <View style={styles.helpButton}>
    <HelpButton helpKey="emergencybutton" />
  </View>

  <Text style={styles.header}>Trenger du hjelp?</Text>
</View>

    <ScrollView contentContainerStyle={styles.scrollContent}>
    <EmergencyPlan onEditingChange={setIsEditingPlan} />
  <PersonalGoal />
<CallAFriend/>

    </ScrollView>
    
  </View>
</Modal>
  );
}
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    marginTop: 60,
    backgroundColor: "#e6eff7",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 24,
    paddingHorizontal: 20,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 10,
  },

  header: {
    fontSize: 28,
    fontWeight: "800",
    color: "#2B2B2B",
    marginBottom: 24,
    textAlign: "center",
    letterSpacing: 0.5,
  },

  subHeader: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 22,
  },

  button: {
    backgroundColor: "#E9D5FF",
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 16,
    marginTop: 12,
  },

  edit: {
    backgroundColor: "#F3F4F6",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    marginTop: 10,
  },

  closeButton: {
    position: "absolute",
    top: 18,
    right: 18,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 20,
  },

  closeText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#374151",
  },

  scrollContent: {
    paddingBottom: 60,
    gap: 18,
  },
  headerRow: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    position: "relative",
  },
  helpButton: {
    position: "absolute",
    left: 0,
    top: 0
  },
});
