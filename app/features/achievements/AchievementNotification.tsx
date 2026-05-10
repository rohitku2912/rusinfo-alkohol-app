import { Modal, StyleSheet, Text, View } from "react-native";
import { Achievement } from "./AchievementCard";

type Props = {
  achievement: Achievement | null;
};

export default function AchievementNotification({ achievement }: Props) {
  if (!achievement) {
    return null;
  }

  return (
    <Modal transparent animationType="fade" visible={true}>
      <View style={styles.notification}>
        <Text style={styles.title}>Gratulerer!</Text>
        <Text style={styles.message}>Du har oppnådd: {achievement.title}</Text>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  notification: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: "#4CAF50",
    padding: 16,
    borderRadius: 8,
    zIndex: 1000,
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  message: {
    color: "#fff",
    fontSize: 16,
  },
});
