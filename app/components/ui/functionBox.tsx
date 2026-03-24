import React from "react";
import {
    StyleProp,
    StyleSheet,
    Text,
    TouchableOpacity,
    ViewStyle,
} from "react-native";

type FunctionBoxProps = {
  title: string;
  description: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

export default function FunctionBox({
  title,
  description,
  onPress,
  style,
}: FunctionBoxProps) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.container, style]}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#e26565",
    padding: 16,
    margin: 8,
    borderRadius: 24,
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
