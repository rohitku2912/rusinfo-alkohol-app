import theme from "@/app/theme/constantStyling";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  value: Date | null;
  onChange: (date: Date | null) => void;
};

export default function DateFilter({ value, onChange }: Props) {
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
            color={value ? theme.colors.primary : theme.colors.darkGrey}
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
            <Ionicons name="close" size={17} color={theme.colors.darkGrey} />
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

const styles = StyleSheet.create({
  row: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing.small,
  },
  button: {
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: theme.colors.box,
    borderColor: "#d6e0da",
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: "row",
    gap: 7,
    minHeight: 38,
    paddingHorizontal: 12,
  },
  activeButton: {
    backgroundColor: "#EAF4EE",
    borderColor: theme.colors.primary,
  },
  text: {
    color: theme.colors.darkGrey,
    fontSize: 12,
    fontWeight: "700",
  },
  activeText: {
    color: theme.colors.primary,
  },
  clearButton: {
    alignItems: "center",
    flexDirection: "row",
    gap: 3,
    minHeight: 38,
    paddingHorizontal: 6,
  },
  clearText: {
    color: theme.colors.darkGrey,
    fontSize: 12,
    fontWeight: "600",
  },
});
