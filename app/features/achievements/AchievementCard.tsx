import theme from "@/app/theme/constantStyling";
import { AppColors, useAppTheme } from "@/app/theme/ThemeProvider";
import { StyleSheet, Text, View } from "react-native";

export type Achievement = {
  id: string;
  title: string;
  description: string;
  currentProgress: number;
  goal: number;
  unitOfMeasurement: string;
};

type Props = {
  achievement: Achievement;
};

export default function AchievementCard({ achievement }: Props) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const cappedProgress = Math.min(
    achievement.currentProgress,
    achievement.goal,
  );
  let progress = 0;

  if (achievement.goal !== 0) {
    progress = cappedProgress / achievement.goal;
  }

  const completed = achievement.currentProgress >= achievement.goal;

  return (
    <View
      style={[
        styles.achievementCard,
        completed && styles.completedAchievementCard,
      ]}
    >
      <View style={styles.titleLine}>
        <Text style={styles.title}>{achievement.title}</Text>
        <View style={completed ? styles.completedPill : styles.lockedPill}>
          <Text
            style={[styles.pillText, completed && styles.completedPillText]}
          >
            {completed ? "Fullført" : "Pågår"}
          </Text>
        </View>
      </View>

      <Text style={styles.description}>{achievement.description}</Text>

      <Text style={styles.progressText}>
        {cappedProgress} / {achievement.goal} {achievement.unitOfMeasurement}
      </Text>

      <View style={styles.fullBar}>
        <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
      </View>
    </View>
  );
}

const createStyles = (colors: AppColors) => StyleSheet.create({
  achievementCard: {
    backgroundColor: colors.box,
    padding: theme.spacing.medium,
    marginBottom: theme.spacing.small,
    borderRadius: theme.borderRadius.medium,
    gap: theme.spacing.small,
  },
  completedAchievementCard: {
    borderColor: colors.primary,
    borderWidth: 1,
  },
  titleLine: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.medium,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
  },
  description: {
    fontSize: 13,
    color: colors.darkGrey,
  },
  progressText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.text,
  },
  fullBar: {
    height: 12,
    backgroundColor: colors.lightGrey,
    borderRadius: 999,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 999,
  },
  completedPill: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  lockedPill: {
    backgroundColor: colors.lightGrey,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  pillText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.text,
  },
  completedPillText: {
    color: colors.primary,
  },
});
