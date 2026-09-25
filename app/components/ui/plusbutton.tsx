import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import theme from "../../theme/constantStyling";
import { AppColors, useAppTheme } from "@/app/theme/ThemeProvider";

type PlusButtonProps = {
  onPress: () => void;
  label?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export default function PlusButton({
  onPress,
  label,
  disabled = false,
  style,
}: PlusButtonProps) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, disabled && styles.disabled, style]}
      activeOpacity={0.7}
      disabled={disabled}
    >
      <Ionicons name="add" size={18} color={colors.buttonText} />
    </TouchableOpacity>
  );
}

const createStyles = (colors: AppColors) => StyleSheet.create({
  button: {
    backgroundColor: colors.yes,
    alignItems: "center",
    borderRadius: 999,
    justifyContent: "center",
    width: 35,
    height: 35,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    color: colors.buttonText,
    fontFamily: theme.fonts.main,
    fontWeight: "bold",
  },
});
