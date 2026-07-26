import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TextInput, TextInputProps, View } from "react-native";
import theme from "../../theme/constantStyling";

type SearchInputProps = Omit<TextInputProps, "style">;

export default function SearchInput(props: SearchInputProps) {
  return (
    <View style={styles.container}>
      <Ionicons
        name="search-outline"
        size={19}
        color="#718078"
        style={styles.icon}
      />
      <TextInput
        {...props}
        clearButtonMode="while-editing"
        placeholderTextColor="#829088"
        returnKeyType="search"
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: theme.colors.box,
    borderColor: "#d6e0da",
    borderRadius: theme.borderRadius.medium,
    borderWidth: 1,
    flexDirection: "row",
    minHeight: 46,
    paddingHorizontal: 14,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    color: theme.colors.text,
    flex: 1,
    fontSize: 15,
    paddingVertical: 10,
  },
});
