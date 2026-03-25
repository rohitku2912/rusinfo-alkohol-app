import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import theme from "../theme/constantStyling";

const options = [
  "Helsen min",
  "Familien min",
  "Økonomi",
  "Jobbe bedre",
  "Trene mer",
];

export default function Inspiration() {
  const router = useRouter();
  const [selected, setSelected] = useState("");
  const [otherText, setOtherText] = useState("");

  const complete = async () => {
    await AsyncStorage.setItem("onboardingCompleted", "true");
    router.replace("/(tabs)" as any);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Hva er din inspirasjon?</Text>
      <Text style={styles.subtitle}>dette kan endres senere</Text>

      {options.map((o) => (
        <TouchableOpacity
          key={o}
          style={[styles.option, selected === o && styles.selectedStyle]}
          onPress={() => {
            setSelected(o);
            setOtherText("");
          }}
        >
          <Text style={styles.optionText}>{o}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        style={[styles.option, selected === "other" && styles.selectedStyle]}
        onPress={() => setSelected("other")}
      >
        <Text style={styles.optionText}>Annet</Text>
      </TouchableOpacity>

      {selected === "other" && (
        <TextInput
          style={styles.textInput}
          placeholder="jeg ønsker å slutte å drikke fordi..."
          placeholderTextColor="#aaa"
          multiline
          value={otherText}
          onChangeText={setOtherText}
        />
      )}

      {selected !== "" && (selected !== "other" || otherText.length > 0) && (
        <TouchableOpacity style={styles.button} onPress={complete}>
          <Text style={styles.buttonText}>bekreft</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.large,
    paddingTop: 60,
    backgroundColor: theme.colors.background,
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: theme.spacing.small,
    color: theme.colors.text,
    fontFamily: theme.fonts.heading,
  },
  subtitle: {
    fontSize: 14,
    color: "#888",
    marginBottom: 28,
  },
  option: {
    backgroundColor: "#e8e8e3",
    borderRadius: theme.borderRadius.medium,
    padding: 18,
    marginBottom: theme.spacing.small,
  },
  selectedStyle: { backgroundColor: "#d0e8d0" },
  optionText: { fontSize: 16, color: theme.colors.text },
  textInput: {
    backgroundColor: "#fff",
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.medium,
    minHeight: 120,
    fontSize: 15,
    marginBottom: theme.spacing.small,
    textAlignVertical: "top",
    color: theme.colors.text,
  },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.medium,
    alignItems: "center",
    marginTop: theme.spacing.medium,
    alignSelf: "center",
    paddingHorizontal: 32,
  },
  buttonText: { fontSize: 16, color: "#fff" },
});
