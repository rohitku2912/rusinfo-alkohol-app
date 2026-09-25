import theme from "@/app/theme/constantStyling";
import { AppColors, useAppTheme } from "@/app/theme/ThemeProvider";
import {
  InputAccessoryView,
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  nativeID: string;
};

export default function KeyboardDoneAccessory({ nativeID }: Props) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  if (Platform.OS !== "ios") {
    return null;
  }

  return (
    <InputAccessoryView nativeID={nativeID}>
      <View style={styles.container}>
        <TouchableOpacity onPress={Keyboard.dismiss} style={styles.button}>
          <Text style={styles.text}>Ferdig</Text>
        </TouchableOpacity>
      </View>
    </InputAccessoryView>
  );
}

const createStyles = (colors: AppColors) => StyleSheet.create({
  container: {
    alignItems: "flex-end",
    backgroundColor: colors.surfaceMuted,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    paddingHorizontal: theme.spacing.medium,
    paddingVertical: theme.spacing.small,
  },
  button: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  text: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "700",
  },
});
