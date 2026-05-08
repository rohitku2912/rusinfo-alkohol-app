import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import DiaryDisplay from "../features/diary/DiaryDisplay";
import TriggerDisplay from "../features/diary/TriggerDisplay";
import theme from "../theme/constantStyling";
import PersonalGoal from "../features/emergencyButton/PersonalGoal";
import CallAFriend from "../features/emergencyButton/CallAFriend";


export default function Diary() {
  const [activeTab, setActiveTab] = useState<"diary" | "trigger">("diary");

  const isDiary = activeTab === "diary";

  return (
    <View style={styles.container}>
      <CallAFriend/>
      <View
        style={[
          styles.folder,
          isDiary ? styles.diaryTheme : styles.triggerTheme,
        ]}
      >
        {/* tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, styles.diaryTab]}
            onPress={() => setActiveTab("diary")}
          >
            <Text style={styles.tabText}>Dagbok</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, styles.triggerTab]}
            onPress={() => setActiveTab("trigger")}
          >
            <Text style={styles.tabText}>Trigger</Text>
          </TouchableOpacity>
        </View>

        {/* innhold */}
        <View style={styles.content}>
          {isDiary ? <DiaryDisplay /> : <TriggerDisplay />}
          
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  folder: {
    flex: 1,
    overflow: "hidden",
  },
  diaryTheme: {
    backgroundColor: "#f8d7da",
  },
  triggerTheme: {
    backgroundColor: "#e2e3e5",
  },
  tabContainer: {
    flexDirection: "row",
    padding: 0,
    backgroundColor: "white",
  },
  tab: {
    flex: 1,
    padding: 12,
    alignItems: "center",
    borderRadius: 14,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  diaryTab: {
    backgroundColor: "#f8d7da",
  },
  triggerTab: {
    backgroundColor: "#e2e3e5",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
  },
  content: {
    flex: 1,
    padding: 12,
  },
});
