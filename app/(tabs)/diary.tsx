import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import DiaryDisplay from "../features/diary/DiaryDisplay";
import TriggerDisplay from "../features/diary/TriggerDisplay";
import theme from "../theme/constantStyling";

export default function Diary() {
  const [activeTab, setActiveTab] = useState<"diary" | "trigger">("diary");

  const isDiary = activeTab === "diary";

  return (
    <View style={styles.container}>
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
    backgroundColor: "#78a6b3"
  },
  triggerTheme: {
    backgroundColor: "#eef1ec",
  },
  tabContainer: {
    flexDirection: "row",
    padding: 0,
    backgroundColor: theme.colors.background
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
    backgroundColor: "#78a6b3",
  },
  triggerTab: {
    backgroundColor: "#eef1ec",
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
