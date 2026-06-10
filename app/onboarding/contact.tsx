import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  InputAccessoryView,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import theme from "../theme/constantStyling";

const PHONE_INPUT_ACCESSORY_ID = "phone-input-accessory";

function isValidPhone(value: string) {
  const cleaned = value.replace(/\s/g, "");
  return /^(\+47)?\d{8}$/.test(cleaned);
}

export default function Contact() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");

  const handleChangePhone = (text: string) => {
    setPhoneNumber(text);
    if (text.trim() === "") {
      setError("");
    } else if (!isValidPhone(text)) {
      setError("Skriv et gyldig norsk nummer (8 siffer, evt. med +47)");
    } else {
      setError("");
    }
  };

  const canSave = phoneNumber.trim() !== "" && isValidPhone(phoneNumber);

  const handleSave = async () => {
    await AsyncStorage.setItem("emergency_phone", phoneNumber.trim());
    router.push("/onboarding/info" as any);
  };

  const handleSkip = () => {
    router.push("/onboarding/info" as any);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={18} color={theme.colors.primary} />
          <Text style={styles.backButtonText}>Tilbake</Text>
        </TouchableOpacity>

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formGroup}>
            <Text style={styles.title}>
              Legg til nummeret til en kontaktperson
            </Text>
            <Text style={styles.subtitle}>
              Når ting er vanskelig kan det hjelpe å ha et nummer du kan ringe. Avtal med noen du stoler på om de kan være kontakten din dersom du trenger noen å snakke med. Dette lagres kun på telefonen din og dukker opp i kriseplanen din.
            </Text>

            <TextInput
              style={[styles.input, error ? styles.inputError : null]}
              placeholder="F.eks. 91234567"
              placeholderTextColor="#aaa"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={handleChangePhone}
              returnKeyType="done"
              returnKeyLabel="Ferdig"
              inputAccessoryViewID={PHONE_INPUT_ACCESSORY_ID}
              autoFocus
            />
            {error !== "" && (
              <Text style={styles.errorText}>{error}</Text>
            )}
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, !canSave && styles.buttonDisabled]}
              disabled={!canSave}
              onPress={handleSave}
            >
              <Text style={styles.buttonText}>Lagre og fortsett</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton} onPress={handleSkip}>
              <Text style={styles.secondaryButtonText}>Hopp over</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <InputAccessoryView nativeID={PHONE_INPUT_ACCESSORY_ID}>
          <View style={styles.keyboardAccessory}>
            <TouchableOpacity
              style={styles.keyboardDoneButton}
              onPress={Keyboard.dismiss}
            >
              <Text style={styles.keyboardDoneText}>Ferdig</Text>
            </TouchableOpacity>
          </View>
        </InputAccessoryView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    padding: theme.spacing.large,
    paddingTop: theme.spacing.medium,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 6,
    marginBottom: theme.spacing.medium,
  },
  backButtonText: {
    fontSize: 15,
    color: theme.colors.primary,
    fontWeight: "500",
  },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    paddingBottom: theme.spacing.medium,
  },
  formGroup: {
    gap: theme.spacing.medium,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: theme.colors.text,
    fontFamily: theme.fonts.heading,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    lineHeight: 21,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: theme.borderRadius.medium,
    borderWidth: 1,
    borderColor: "#c8c8c1",
    padding: theme.spacing.medium,
    fontSize: 18,
    color: theme.colors.text,
    marginTop: theme.spacing.small,
  },
  actions: {
    gap: theme.spacing.small,
    paddingBottom: 0,
    paddingTop: theme.spacing.large,
  },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.medium,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.45,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "#c8c8c1",
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.medium,
    alignItems: "center",
    backgroundColor: "#f2f2ed",
  },
  secondaryButtonText: {
    fontSize: 16,
    color: theme.colors.text,
  },
  inputError: {
    borderColor: theme.colors.attention,
  },
  errorText: {
    fontSize: 13,
    color: theme.colors.attention,
    marginTop: 4,
  },
  keyboardAccessory: {
    alignItems: "flex-end",
    backgroundColor: "#f2f2ed",
    borderTopWidth: 1,
    borderTopColor: "#c8c8c1",
    paddingHorizontal: theme.spacing.medium,
    paddingVertical: theme.spacing.small,
  },
  keyboardDoneButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  keyboardDoneText: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: "700",
  },
});
