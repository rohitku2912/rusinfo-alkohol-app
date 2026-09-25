import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TextInput, TextInputProps, View } from "react-native";
import theme from "../../theme/constantStyling";
import { AppColors, useAppTheme } from "../../theme/ThemeProvider";

type SearchInputProps = Omit<TextInputProps, "style">;

export default function SearchInput(props: SearchInputProps) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  return (
    <View style={styles.container}>
      <Ionicons
        name="search-outline"
        size={19}
        color={colors.darkGrey}
        style={styles.icon}
      />
      <TextInput
        {...props}
        clearButtonMode="while-editing"
        placeholderTextColor={colors.darkGrey}
        returnKeyType="search"
        style={styles.input}
      />
    </View>
  );
}

const createStyles = (colors: AppColors) => StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: colors.box,
    borderColor: colors.border,
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
    color: colors.text,
    flex: 1,
    fontSize: 15,
    paddingVertical: 10,
  },
});
