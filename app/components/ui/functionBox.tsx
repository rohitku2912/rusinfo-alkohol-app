import theme from "@/app/theme/constantStyling";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type FunctionBoxProps = {
  title: string;
  description: string;
  onPress?: () => void;
  children?: React.ReactNode;
};

export default function FunctionBox({
  title,
  description,
  children,
  onPress,
}: FunctionBoxProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.container}
      activeOpacity={onPress ? 0.8 : 1} // only act as button if onpress exist
    >
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {children && <View>{children}</View>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "95%",
    backgroundColor: "#d5c2da",
    padding: 20,
    margin: 10,
    borderRadius: theme.borderRadius.large,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: "#666",
  },
});
