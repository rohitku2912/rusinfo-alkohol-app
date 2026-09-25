import theme from "@/app/theme/constantStyling";
import { AppColors, useAppTheme } from "@/app/theme/ThemeProvider";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  value: Date | null;
  onChange: (date: Date | null) => void;
};

export default function DateFilter({ value, onChange }: Props) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const [showPicker, setShowPicker] = useState(false);

  return (
    <>
      <View style={styles.row}>
        <TouchableOpacity
          accessibilityLabel="Filtrer på dato"
          onPress={() => setShowPicker(true)}
          style={[styles.button, value && styles.activeButton]}
        >
          <Ionicons
            name="calendar-outline"
            size={17}
            color={value ? colors.primary : colors.darkGrey}
          />
          <Text style={[styles.text, value && styles.activeText]}>
            {value ? value.toLocaleDateString("nb-NO") : "Filtrer på dato"}
          </Text>
        </TouchableOpacity>

        {value && (
          <TouchableOpacity
            accessibilityLabel="Fjern datofilter"
            onPress={() => onChange(null)}
            style={styles.clearButton}
          >
            <Ionicons name="close" size={17} color={colors.darkGrey} />
            <Text style={styles.clearText}>Fjern</Text>
          </TouchableOpacity>
        )}
      </View>

      {showPicker && (
        <DateTimePicker
          display={Platform.OS === "ios" ? "compact" : "default"}
          maximumDate={new Date()}
          mode="date"
          onChange={(event, date) => {
            setShowPicker(false);
            if (event.type !== "dismissed" && date) {
              onChange(date);
            }
          }}
          value={value ?? new Date()}
        />
      )}
    </>
  );
}

const createStyles = (colors: AppColors) => StyleSheet.create({
  row: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing.small,
  },
  button: {
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: colors.box,
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: "row",
    gap: 7,
    minHeight: 38,
    paddingHorizontal: 12,
  },
  activeButton: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary,
  },
  text: {
    color: colors.darkGrey,
    fontSize: 12,
    fontWeight: "700",
  },
  activeText: {
    color: colors.primary,
  },
  clearButton: {
    alignItems: "center",
    flexDirection: "row",
    gap: 3,
    minHeight: 38,
    paddingHorizontal: 6,
  },
  clearText: {
    color: colors.darkGrey,
    fontSize: 12,
    fontWeight: "600",
  },
});
