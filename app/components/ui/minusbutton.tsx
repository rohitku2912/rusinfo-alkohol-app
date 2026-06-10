import React from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import theme from "../../theme/constantStyling";

type MinusButtonProps = {
  onPress: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export default function MinusButton({
  onPress,
  disabled = false,
  style,
}: MinusButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, disabled && styles.disabled, style]}
      activeOpacity={0.7}
      disabled={disabled}
    >
      <Text style={styles.text}>- 1</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.colors.primary,
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
