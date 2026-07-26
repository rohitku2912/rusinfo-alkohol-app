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
        <View style={styles.headerText}>
          <Text style={styles.title}>{title}</Text>
          {description && <Text style={styles.description}>{description}</Text>}
        </View>
        {helpBtn && <View style={styles.help}>{helpBtn}</View>}
      </View>
      {children && <View style={styles.content}>{children}</View>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: theme.colors.box,
    padding: theme.spacing.medium,
    borderRadius: theme.borderRadius.medium,
    borderColor: "#d6e0da",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },

  header: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 40,
  },
  headerText: {
    flex: 1,
    justifyContent: "center",
  },

  title: {
    color: theme.colors.text,
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 0.2,
  },

  description: {
    color: theme.colors.darkGrey,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 4,
  },

  help: {
    marginLeft: theme.spacing.small,
  },

  content: {
    marginTop: theme.spacing.medium,
  },
});
