import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, ViewStyle } from "react-native";

type Props = {
  onPress: () => void;
  label?: string;
  style?: ViewStyle;
};

export default function BackButton({
  onPress,
  label = "Tilbake",
  style,
}: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          gap: 6,
          paddingVertical: 6,
        },
        style,
      ]}
    >
      <Ionicons name="chevron-back" size={18} color="#007AFF" />
      <Text style={{ color: "#007AFF", fontSize: 14 }}>{label}</Text>
    </TouchableOpacity>
  );
}
