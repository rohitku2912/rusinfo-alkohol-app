import { MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity, ViewStyle } from "react-native";

type EditButtonProps = {
  isEditing: boolean;
  onPress: () => void;
  style?: ViewStyle;
};

export default function EditButton({
  isEditing,
  onPress,
  style,
}: EditButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        {
          backgroundColor: isEditing ? "#e495d1" : "#d28383",
          padding: 8,
          borderRadius: 10,
          alignItems: "center",
          justifyContent: "center",
          shadowColor: "#000",
          shadowOpacity: 0.08,
          shadowRadius: 4,
          shadowOffset: { width: 0, height: 2 },
          elevation: 2,
        },
        style,
      ]}
    >
      <MaterialIcons
        name={isEditing ? "check" : "edit"}
        size={18}
        color="#007AFF"
      />
    </TouchableOpacity>
  );
}
