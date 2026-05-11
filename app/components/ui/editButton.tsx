import { Text, TouchableOpacity, ViewStyle } from "react-native";

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
      activeOpacity={0.8}
      style={[
        {
          backgroundColor: isEditing ? "#3B82F6" : "#1E3A8A",
          paddingVertical: 10,
          paddingHorizontal: 14,
          borderRadius: 12,
          alignItems: "center",
          justifyContent: "center",

          shadowColor: "#000",
          shadowOpacity: 0.08,
          shadowRadius: 6,
          shadowOffset: { width: 0, height: 2 },
          elevation: 2,
        },
        style,
      ]}
    >
      <Text
        style={{
          color: "#f3f7fb",
          fontWeight: "600",
          fontSize: 14,
          letterSpacing: 0.2,
        }}
      >
        {isEditing ? "Ferdig" : "Rediger"}
      </Text>
    </TouchableOpacity>
  );
}