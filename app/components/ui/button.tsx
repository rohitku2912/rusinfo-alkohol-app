import React from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import theme from "../../theme/constantStyling";
import { AppColors, useAppTheme } from "../../theme/ThemeProvider";

type RegularButtonProps = {
  title: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

export default function RegularButton({
  title,
  onPress,
  style,
}: RegularButtonProps) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, style]}
      activeOpacity={0.7}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const createStyles = (colors: AppColors) => StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: theme.borderRadius.medium,
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    paddingHorizontal: 16,
    // plasserer knappen til høyre
  },
  text: {
    color: colors.buttonText,
    fontWeight: "bold",
    fontFamily: theme.fonts.main,
    alignItems: "center",
  },
});
