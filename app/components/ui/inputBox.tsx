import theme from "@/app/theme/constantStyling";
import React from "react";
import { StyleSheet, TextInput, TextInputProps, View } from "react-native";

type InputBoxProps = TextInputProps & {
  variant?: "entry" | "tag";
};

export default function InputBox({
  variant = "entry",
  style,
  ...props
}: InputBoxProps) {
  return (
    <View>
      <TextInput
        {...props}
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

const styles = StyleSheet.create({
  base: {
    borderWidth: 1,
    borderColor: "#ddcbcb",
    borderRadius: 10,
    padding: 10,
    color: theme.colors.text,
    backgroundColor: "#ffffff"
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
