import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import theme from "../../theme/constantStyling";

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
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, disabled && styles.disabled, style]}
      activeOpacity={0.7}
      disabled={disabled}
    >
      <Ionicons name="add" size={18} color={theme.colors.buttonText} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.colors.yes,
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
    color: theme.colors.buttonText,
    fontFamily: theme.fonts.main,
    fontWeight: "bold",
  },
});
