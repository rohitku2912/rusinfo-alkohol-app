import theme from "@/app/theme/constantStyling";
import { useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AnimatedTabHeader, {
  getAnimatedTabHeaderTopPadding,
} from "../components/ui/AnimatedTabHeader";
import AvatarButton from "../components/ui/avatarButton";
import ShowAchievements from "../features/achievements/ShowAchievements";
import HelpButton from "../features/help/HelpButton";

export default function Achievements() {
  const insets = useSafeAreaInsets();
  const scrollY = useRef(new Animated.Value(0)).current;

  return (
    <View style={styles.container}>
      <AnimatedTabHeader
        title="Prestasjoner"
        scrollY={scrollY}
        rightSlot={
          <View style={styles.headerActions}>
            <HelpButton helpKey="achievements" />
            <AvatarButton />
          </View>
        }
      />
      <ShowAchievements
        scrollY={scrollY}
        contentContainerStyle={{
          paddingTop: getAnimatedTabHeaderTopPadding(insets.top),
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  headerActions: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
});
