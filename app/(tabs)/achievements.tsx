import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button, View } from "react-native";
import ShowAchievements from "../features/achievements/ShowAchievements";

export default function Achievements() {
  async function resetAchievements() {
    await AsyncStorage.removeItem("unlockedAchievements");
  }

  async function resetAchievementTestData() {
    await AsyncStorage.multiRemove([
      "unlockedAchievements",
      "drinkLogs",
      "diary_entries",
      "diary_tags",
    ]);
  }

  return (
    <View>
      <Button title="reset achievement" onPress={resetAchievements} />
      <Button
        title="reset achievement test data"
        onPress={resetAchievementTestData}
      />
      <ShowAchievements />
    </View>
  );
}
