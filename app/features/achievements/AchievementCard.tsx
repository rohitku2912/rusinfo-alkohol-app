import theme from "@/app/theme/constantStyling";
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
          <Text style={styles.pillText}>
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

const styles = StyleSheet.create({
  achievementCard: {
    backgroundColor: theme.colors.box,
    padding: theme.spacing.medium,
    marginHorizontal: theme.spacing.medium,
    marginBottom: theme.spacing.small,
    borderRadius: theme.borderRadius.medium,
    gap: theme.spacing.small,
  },
  completedAchievementCard: {
    borderColor: theme.colors.primary,
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
    color: theme.colors.text,
  },
  description: {
    fontSize: 13,
    color: theme.colors.darkGrey,
  },
  progressText: {
    fontSize: 13,
    fontWeight: "700",
    color: theme.colors.text,
  },
  fullBar: {
    height: 12,
    backgroundColor: theme.colors.lightGrey,
    borderRadius: 999,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: theme.colors.primary,
    borderRadius: 999,
  },
  completedPill: {
    backgroundColor: "#E6F4EA",
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  lockedPill: {
    backgroundColor: theme.colors.lightGrey,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  pillText: {
    fontSize: 11,
    fontWeight: "700",
    color: theme.colors.text,
  },
});
