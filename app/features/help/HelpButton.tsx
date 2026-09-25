import { MaterialIcons } from "@expo/vector-icons";
import { AppColors, useAppTheme } from "@/app/theme/ThemeProvider";
import React, { useMemo, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { helpContent } from "./helpContent";

type Props = {
  helpKey: string;
};

export default function HelpButton({ helpKey }: Props) {
  const [open, setOpen] = useState(false);
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const content = helpContent[helpKey];

  return (
    <>
      <Pressable onPress={() => setOpen(true)} >
        <MaterialIcons name="help" style={styles.icon} />
      </Pressable>

      <Modal visible={open} transparent animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          <View style={styles.modal}>
            <Text style={styles.title}>{content?.title}</Text>
            <Text style={styles.text}>{content?.description}</Text>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const createStyles = (colors: AppColors) => StyleSheet.create({
  icon: {
    fontSize: 22,
    color: "#2F4FA3",
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  modal: {
    backgroundColor: colors.box,
    borderColor: colors.border,
    borderWidth: 1,
    padding: 20,
    borderRadius: 12,
    maxWidth: 320,
  },

  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },

  text: {
    fontSize: 14,
    color: colors.darkGrey,
    lineHeight: 20,
  },
});
