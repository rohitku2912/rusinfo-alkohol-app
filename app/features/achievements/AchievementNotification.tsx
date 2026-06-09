import theme from "@/app/theme/constantStyling";
import { Ionicons } from "@expo/vector-icons";
import { Image, Modal, StyleSheet, Text, View } from "react-native";
import { accessories } from "../avatar/accessories";
import { Achievement } from "./AchievementCard";

type Props = {
  achievement: Achievement | null;
  rewardAccessoryId: string | null;
};

export default function AchievementNotification({
  achievement,
  rewardAccessoryId,
}: Props) {
  if (!achievement) {
    return null;
  }

  const rewardAccessory = accessories.find(
    (accessory) => accessory.id === rewardAccessoryId,
  );

  return (
    <Modal transparent animationType="fade" visible={true}>
      <View style={styles.overlay}>
        <View style={styles.notification}>
          <View style={styles.header}>
            <View style={styles.iconCircle}>
              <Ionicons name="trophy" size={24} color={theme.colors.accent} />
            </View>

            <View style={styles.textBlock}>
              <Text style={styles.title}>Gratulerer!</Text>
              <Text style={styles.message}>
                Du har oppnådd: {achievement.title}
              </Text>
            </View>
          </View>

          {rewardAccessory && (
            <View style={styles.rewardStage}>
              <Text style={styles.rewardLabel}>Ny belønning</Text>

              <View style={styles.accessoryFrame}>
                <Image
                  source={rewardAccessory.image}
                  style={styles.accessoryImage}
                  resizeMode="contain"
                />
              </View>

              <Text style={styles.accessoryName}>{rewardAccessory.name}</Text>
            </View>
          )}
        </View>
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
    backgroundColor: theme.colors.box,
    padding: 18,
    borderRadius: 16,
    zIndex: 1000,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 16,
    elevation: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFF7DA",
    alignItems: "center",
    justifyContent: "center",
  },
  textBlock: {
    flex: 1,
  },
  title: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: "bold",
  },
  message: {
    color: theme.colors.darkGrey,
    fontSize: 16,
    lineHeight: 22,
    marginTop: 2,
  },
  rewardStage: {
    marginTop: 18,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "#F5F7F1",
    borderWidth: 1,
    borderColor: "#E5EBDD",
  },
  rewardLabel: {
    color: theme.colors.primary,
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 10,
    textAlign: "center",
    textTransform: "uppercase",
  },
  accessoryFrame: {
    width: 104,
    height: 104,
    borderRadius: 52,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: theme.colors.primary,
    backgroundColor: "#F9FCF7",
    alignSelf: "center",
  },
  accessoryImage: {
    width: 72,
    height: 72,
  },
  accessoryName: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: "700",
    marginTop: 8,
    textAlign: "center",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
});
