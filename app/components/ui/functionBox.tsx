import theme from "@/app/theme/constantStyling";
import { AppColors, useAppTheme } from "@/app/theme/ThemeProvider";
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
  const { colors, isDark } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.container,
        {
          elevation: isDark ? 0 : 2,
          shadowOpacity: isDark ? 0 : 0.04,
        },
      ]}
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

const createStyles = (colors: AppColors) => StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: colors.box,
    borderColor: colors.border,
    padding: theme.spacing.medium,
    borderRadius: theme.borderRadius.medium,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
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
    color: colors.text,
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 0.2,
  },

  description: {
    color: colors.darkGrey,
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
