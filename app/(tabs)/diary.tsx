import { useRef, useState } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AnimatedTabHeader, {
  getAnimatedTabHeaderTopPadding,
} from "../components/ui/AnimatedTabHeader";
import AvatarButton from "../components/ui/avatarButton";
import DiaryDisplay from "../features/diary/DiaryDisplay";
import TriggerDisplay from "../features/diary/TriggerDisplay";
import HelpButton from "../features/help/HelpButton";
import theme from "../theme/constantStyling";

export default function Diary() {
  const insets = useSafeAreaInsets();
  const headerScrollY = useRef(new Animated.Value(0)).current;
  const [activeTab, setActiveTab] = useState<"diary" | "trigger">("diary");

  const isDiary = activeTab === "diary";

  return (
    <View style={styles.container}>
      <AnimatedTabHeader
        title={isDiary ? "Dagbok" : "Trigger"}
        scrollY={headerScrollY}
        rightSlot={
          <View style={styles.headerActions}>
            <HelpButton helpKey={isDiary ? "diary" : "trigger"} />
            <AvatarButton />
          </View>
        }
      />
      <View
        style={[
          styles.folder,
          isDiary ? styles.diaryTheme : styles.triggerTheme,
          {
            marginTop: getAnimatedTabHeaderTopPadding(insets.top),
          },
        ]}
      >
        {/* tabs */}
        <View style={styles.tabContainer}>
          <View style={styles.tabRow}>
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
    backgroundColor: "#78a6b3",
  },
  triggerTheme: {
    backgroundColor: "#eef1ec",
  },
  tabContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 0,
    backgroundColor: theme.colors.background,
  },
  tabRow: {
    flex: 1,
    flexDirection: "row",
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
  headerActions: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.medium,
    paddingTop: theme.spacing.medium,
  },
});
