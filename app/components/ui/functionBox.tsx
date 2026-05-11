import theme from "@/app/theme/constantStyling";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type FunctionBoxProps = {
  title: string;
  description?: string;
  onPress?: () => void;
  children?: React.ReactNode;
  helpBtn?: React.ReactNode;
};

export default function FunctionBox({
  title,
  description,
  children,
  onPress,
  helpBtn,
}: FunctionBoxProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.container}
      activeOpacity={onPress ? 0.8 : 1} // only act as button if onpress exist
    >
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{title}</Text>
          {description && (
<Text style={styles.description}>{description}</Text>
)}
        </View>
        {helpBtn && <View style={styles.help}>{helpBtn}</View>}
      </View>
      {children && <View>{children}</View>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "95%",
    backgroundColor: theme.colors.box,
    padding: 20,
    margin: 10,
    borderRadius: theme.borderRadius.large,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 5,
    marginBottom: 10,
    color: theme.colors.text,
  },

  description: {
    fontSize: 14,
    color: theme.colors.darkGrey,
    marginTop: 5,
    marginBottom: 10
  },

  help: {
    marginRight: 30,
  },

  content: {
    marginTop: 10,
    color: theme.colors.lightGrey,
  },
});
