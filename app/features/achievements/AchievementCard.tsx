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
    <View style={styles.achievementCard}>
      <Text>{achievement.title}</Text>
      <Text>{achievement.description}</Text>

      <Text>
        {cappedProgress} / {achievement.goal} {achievement.unitOfMeasurement}
      </Text>

      <View style={styles.fullBar}>
        <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
      </View>

      {completed && <Text>Fullført</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  achievementCard: {
    backgroundColor: "#ffffff",
    padding: 16,
    margin: 16,
    borderRadius: 12,
    gap: 8,
  },
  fullBar: {
    height: 12,
    backgroundColor: "lightgray",
    borderRadius: 999,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#2E7D32",
    borderRadius: 999,
  },
});
