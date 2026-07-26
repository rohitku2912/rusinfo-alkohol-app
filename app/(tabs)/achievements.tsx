import theme from "@/app/theme/constantStyling";
import { useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AnimatedTabHeader, {
  getAnimatedTabHeaderTopPadding,
} from "../components/ui/AnimatedTabHeader";
import AvatarButton from "../components/ui/avatarButton";
import TriggerDisplay from "../features/diary/TriggerDisplay";
import HelpButton from "../features/help/HelpButton";

export default function Trigger() {
  const insets = useSafeAreaInsets();
  const headerScrollY = useRef(new Animated.Value(0)).current;

  return (
    <View style={styles.container}>
      <AnimatedTabHeader
        title="Trigger"
        scrollY={headerScrollY}
        titleAccessory={<HelpButton helpKey="trigger" />}
        rightSlot={<AvatarButton />}
      />
      <View
        style={[
          styles.content,
          { marginTop: getAnimatedTabHeaderTopPadding(insets.top) },
        ]}
      >
        <TriggerDisplay />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.medium,
    paddingTop: theme.spacing.medium,
  },
});
