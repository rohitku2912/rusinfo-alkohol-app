import React from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import theme from "../../theme/constantStyling";

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

const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.large,
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    paddingHorizontal: 16,
    // plasserer knappen til høyre
  },
  text: {
    color: theme.colors.buttonText,
    fontWeight: "bold",
    fontFamily: theme.fonts.main,
    alignItems: "center",
  },
});
