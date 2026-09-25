import React from "react";
import { StyleSheet, TextInput, TextInputProps, View } from "react-native";
import { AppColors, useAppTheme } from "../theme/ThemeProvider";

type InputBoxProps = TextInputProps & {
  variant?: "entry" | "tag";
};

export default function InputBox({
  variant = "entry",
  style,
  ...props
}: InputBoxProps) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  return (
    <View>
      <TextInput
        {...props}
        placeholderTextColor={
          props.placeholderTextColor ?? colors.darkGrey
        }
        style={[
          styles.base,
          variant === "entry" && styles.entry,
          variant === "tag" && styles.tag,
          style,
        ]}
      />
    </View>
  );
}

const createStyles = (colors: AppColors) => StyleSheet.create({
  base: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 10,
    color: colors.text,
    backgroundColor: colors.box,
  },

  entry: {
    minHeight: 120,
    textAlignVertical: "top",
  },

  tag: {
    minHeight: 40,
    borderRadius: 10,
    paddingHorizontal: 12,
  },
});
