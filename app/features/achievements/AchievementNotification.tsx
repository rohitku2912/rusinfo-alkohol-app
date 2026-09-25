import theme from "@/app/theme/constantStyling";
import { AppColors, useAppTheme } from "@/app/theme/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { accessories } from "../avatar/accessories";
import { Achievement } from "./AchievementCard";

type Props = {
  achievements: Achievement[];
  rewardAccessoryId: string | null;
  onDismiss: () => void;
};

export default function AchievementNotification({
  achievements,
  rewardAccessoryId,
  onDismiss,
}: Props) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const router = useRouter();

  if (achievements.length === 0) {
    return null;
  }

  const achievement = achievements[0];
  const hasMultipleAchievements = achievements.length > 1;
  const rewardAccessory = accessories.find(
    (accessory) => accessory.id === rewardAccessoryId,
  );

  const showAllAchievements = () => {
    onDismiss();
    router.push({
      pathname: "/features/avatar/avatarScreen",
      params: { showAchievements: "1" },
    });
  };

  return (
    <Modal
      onRequestClose={onDismiss}
      transparent
      animationType="fade"
      visible
    >
      <View style={styles.overlay}>
        <View style={styles.notification}>
          <Pressable
            accessibilityLabel="Lukk"
            hitSlop={10}
            onPress={onDismiss}
            style={styles.closeButton}
          >
            <Ionicons name="close" size={20} color={colors.darkGrey} />
          </Pressable>

          <View style={styles.header}>
            <View style={styles.iconCircle}>
              <Ionicons name="trophy" size={24} color={colors.accent} />
            </View>

            <View style={styles.textBlock}>
              <Text style={styles.title}>Gratulerer!</Text>
              <Text style={styles.message}>
                {hasMultipleAchievements
                  ? `Du har oppnådd ${achievements.length} nye prestasjoner.`
                  : `Du har oppnådd: ${achievement.title}`}
              </Text>
            </View>
          </View>

          {!hasMultipleAchievements && rewardAccessory && (
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

          {hasMultipleAchievements && (
            <Pressable
              accessibilityRole="button"
              onPress={showAllAchievements}
              style={styles.showMoreButton}
            >
              <Text style={styles.showMoreText}>Vis flere</Text>
              <Ionicons
                name="arrow-forward"
                size={17}
                color={colors.buttonText}
              />
            </Pressable>
          )}
        </View>
      </View>
    </Modal>
  );
}

const createStyles = (colors: AppColors) => StyleSheet.create({
  notification: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: colors.box,
    padding: 18,
    borderRadius: 16,
    zIndex: 1000,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 16,
    elevation: 8,
  },
  closeButton: {
    alignItems: "center",
    backgroundColor: colors.surfaceMuted,
    borderRadius: 17,
    height: 34,
    justifyContent: "center",
    position: "absolute",
    right: 12,
    top: 12,
    width: 34,
    zIndex: 1,
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
    backgroundColor: colors.warningSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  textBlock: {
    flex: 1,
  },
  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "bold",
  },
  message: {
    color: colors.darkGrey,
    fontSize: 16,
    lineHeight: 22,
    marginTop: 2,
  },
  rewardStage: {
    marginTop: 18,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rewardLabel: {
    color: colors.primary,
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
    borderColor: colors.primary,
    backgroundColor: colors.box,
    alignSelf: "center",
  },
  accessoryImage: {
    width: 72,
    height: 72,
  },
  accessoryName: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "700",
    marginTop: 8,
    textAlign: "center",
  },
  showMoreButton: {
    alignItems: "center",
    alignSelf: "stretch",
    backgroundColor: colors.primary,
    borderRadius: theme.borderRadius.medium,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    marginTop: theme.spacing.medium,
    minHeight: 48,
    paddingHorizontal: theme.spacing.medium,
  },
  showMoreText: {
    color: colors.buttonText,
    fontSize: 15,
    fontWeight: "800",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
});
