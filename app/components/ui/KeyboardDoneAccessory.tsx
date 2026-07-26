import theme from "@/app/theme/constantStyling";
import {
  InputAccessoryView,
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  nativeID: string;
};

export default function KeyboardDoneAccessory({ nativeID }: Props) {
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

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-end",
    backgroundColor: "#f2f2ed",
    borderTopColor: "#c8c8c1",
    borderTopWidth: 1,
    paddingHorizontal: theme.spacing.medium,
    paddingVertical: theme.spacing.small,
  },
  button: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  text: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: "700",
  },
});
