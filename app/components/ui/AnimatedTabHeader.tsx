import type { ReactNode } from "react";
import { Animated, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import theme from "../../theme/constantStyling";

const HEADER_SCROLL_DISTANCE = 80;
const HEADER_TOP_GAP = 2;
const HEADER_EXPANDED_HEIGHT = 50;
const HEADER_COLLAPSED_HEIGHT = 24;
const HEADER_CONTENT_HEIGHT = 44;
const HEADER_CONTENT_OFFSET = 0;
const HEADER_BOTTOM_GAP = theme.spacing.medium;

export function getAnimatedTabHeaderTopPadding(
  topInset: number,
  bottomGap = HEADER_BOTTOM_GAP,
) {
  return (
    topInset +
    HEADER_TOP_GAP +
    HEADER_EXPANDED_HEIGHT +
    HEADER_CONTENT_OFFSET +
    bottomGap
  );
}

type AnimatedTabHeaderProps = {
  title: string;
  scrollY: Animated.Value;
  rightSlot?: ReactNode;
};

export default function AnimatedTabHeader({
  title,
  scrollY,
  rightSlot,
}: AnimatedTabHeaderProps) {
  const insets = useSafeAreaInsets();

  const titleFontSize = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [28, 18],
    extrapolate: "clamp",
  });

  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_EXPANDED_HEIGHT, HEADER_COLLAPSED_HEIGHT],
    extrapolate: "clamp",
  });

  const headerSectionHeight = Animated.add(
    headerHeight,
    insets.top + HEADER_TOP_GAP,
  );

  const headerColor = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [theme.colors.background, theme.colors.backgroundSecondary],
    extrapolate: "clamp",
  });

  const rightSlotScale = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0.9, 0.62],
    extrapolate: "clamp",
  });

  const headerContentTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, -24],
    extrapolate: "clamp",
  });

  return (
    <Animated.View
      style={[
        styles.headerSection,
        {
          backgroundColor: headerColor,
          height: headerSectionHeight,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.header,
          {
            height: HEADER_CONTENT_HEIGHT,
            marginTop: insets.top + HEADER_TOP_GAP + HEADER_CONTENT_OFFSET,
            transform: [{ translateY: headerContentTranslateY }],
          },
        ]}
      >
        <Animated.Text style={[styles.title, { fontSize: titleFontSize }]}>
          {title}
        </Animated.Text>
        {rightSlot ? (
          <Animated.View style={{ transform: [{ scale: rightSlotScale }] }}>
            {rightSlot}
          </Animated.View>
        ) : null}
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  headerSection: {
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: 20,
  },
  header: {
    alignItems: "center",
    alignSelf: "stretch",
    flexDirection: "row",
    justifyContent: "space-between",
    overflow: "visible",
    paddingHorizontal: theme.spacing.medium,
  },
  title: {
    color: theme.colors.text,
    fontWeight: "800",
    includeFontPadding: false,
  },
});
