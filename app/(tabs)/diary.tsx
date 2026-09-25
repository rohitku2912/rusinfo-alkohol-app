import { useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AnimatedTabHeader, {
  getAnimatedTabHeaderTopPadding,
} from "../components/ui/AnimatedTabHeader";
import AvatarButton from "../components/ui/avatarButton";
import DiaryDisplay from "../features/diary/DiaryDisplay";
import HelpButton from "../features/help/HelpButton";
import theme from "../theme/constantStyling";
import { AppColors, useAppTheme } from "@/app/theme/ThemeProvider";

export default function Diary() {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const insets = useSafeAreaInsets();
  const headerScrollY = useRef(new Animated.Value(0)).current;

  return (
    <View style={styles.container}>
      <AnimatedTabHeader
        title="Dagbok"
        scrollY={headerScrollY}
        titleAccessory={<HelpButton helpKey="diary" />}
        rightSlot={<AvatarButton />}
      />
      <View
        style={[
          styles.content,
          {
            marginTop: getAnimatedTabHeaderTopPadding(insets.top),
          },
        ]}
      >
        <DiaryDisplay />
      </View>
    </View>
  );
}

const createStyles = (colors: AppColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: theme.spacing.medium,
    paddingTop: theme.spacing.medium,
  },
});
