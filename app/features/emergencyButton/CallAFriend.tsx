import FunctionBox from "@/app/components/ui/functionBox";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const EMERGENCY_PHONE_KEY = "emergency_phone";

function isValidPhone(value: string) {
  const cleaned = value.replace(/\s/g, "");
  return /^(\+47)?\d{8}$/.test(cleaned);
}

export default function CallAFriend() {
  const [phone, setPhone] = useState<string | null>(null);
  const [draftPhone, setDraftPhone] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      const stored = await AsyncStorage.getItem(EMERGENCY_PHONE_KEY);
      if (stored) {
        setPhone(stored);
        setDraftPhone(stored);
      }
    };

    load();
  }, []);

  const handleChangePhone = (text: string) => {
    setDraftPhone(text);
    if (text.trim() === "" || isValidPhone(text)) {
      setError("");
    } else {
      setError("Skriv et gyldig norsk nummer (8 siffer, evt. med +47)");
    }
  };

  const startEditing = () => {
    setDraftPhone(phone ?? "");
    setError("");
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setDraftPhone(phone ?? "");
    setError("");
    setIsEditing(false);
    Keyboard.dismiss();
  };

  const savePhone = async () => {
    const trimmedPhone = draftPhone.trim();

    if (!isValidPhone(trimmedPhone)) {
      setError("Skriv et gyldig norsk nummer (8 siffer, evt. med +47)");
      return;
    }

    await AsyncStorage.setItem(EMERGENCY_PHONE_KEY, trimmedPhone);
    setPhone(trimmedPhone);
    setDraftPhone(trimmedPhone);
    setError("");
    setIsEditing(false);
    Keyboard.dismiss();
  };

  const removePhone = async () => {
    await AsyncStorage.removeItem(EMERGENCY_PHONE_KEY);
    setPhone(null);
    setDraftPhone("");
    setError("");
    setIsEditing(false);
    Keyboard.dismiss();
  };

  const canSave = draftPhone.trim() !== "" && isValidPhone(draftPhone);

  return (
    <FunctionBox
      title="Ring en venn"
      description="Dette er nummeret du har lagret som en trygg kontakt."
    >
      <View style={styles.container}>
        {isEditing ? (
          <View style={styles.editContainer}>
            <TextInput
              value={draftPhone}
              onChangeText={handleChangePhone}
              placeholder="F.eks. 91234567"
              placeholderTextColor="#8a958a"
              keyboardType="phone-pad"
              returnKeyType="done"
              returnKeyLabel="Ferdig"
              onSubmitEditing={canSave ? savePhone : undefined}
              autoFocus
              style={[styles.input, error ? styles.inputError : null]}
            />

            {error !== "" && <Text style={styles.error}>{error}</Text>}

            <View style={styles.actions}>
              <TouchableOpacity
                onPress={savePhone}
                disabled={!canSave}
                activeOpacity={0.8}
                style={[styles.saveButton, !canSave && styles.disabledButton]}
              >
                <Text style={styles.saveButtonText}>Lagre</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={cancelEditing}
                activeOpacity={0.8}
                style={styles.secondaryButton}
              >
                <Text style={styles.secondaryButtonText}>Avbryt</Text>
              </TouchableOpacity>
            </View>

            {phone && (
              <TouchableOpacity
                onPress={removePhone}
                activeOpacity={0.8}
                style={styles.removeButton}
              >
                <Text style={styles.removeButtonText}>Fjern nummer</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <>
            {phone ? (
              <Text style={styles.number}>{phone}</Text>
            ) : (
              <Text style={styles.empty}>Ingen nummer lagret</Text>
            )}

            <TouchableOpacity
              onPress={startEditing}
              activeOpacity={0.8}
              style={styles.editButton}
            >
              <Text style={styles.editButtonText}>
                {phone ? "Rediger nummer" : "Legg til nummer"}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </FunctionBox>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },

  editContainer: {
    gap: 10,
  },

  number: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2f3a2f",
    padding: 12,
    borderRadius: 14,
    backgroundColor: "#e6eff7",
    borderWidth: 1,
    borderColor: "#d9ded6",
  },

  empty: {
    fontSize: 14,
    color: "#5c6b5c",
    fontStyle: "italic",
    padding: 12,
    borderRadius: 14,
    backgroundColor: "#f6f7f4",
    borderWidth: 1,
    borderColor: "#d9ded6",
  },

  input: {
    fontSize: 16,
    color: "#2f3a2f",
    padding: 12,
    borderRadius: 14,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d9ded6",
  },

  inputError: {
    borderColor: "#EF4444",
  },

  error: {
    fontSize: 13,
    color: "#EF4444",
    lineHeight: 18,
  },

  actions: {
    flexDirection: "row",
    gap: 10,
  },

  saveButton: {
    flex: 1,
    backgroundColor: "#1E3A8A",
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  disabledButton: {
    opacity: 0.45,
  },

  saveButtonText: {
    color: "#f3f7fb",
    fontSize: 14,
    fontWeight: "700",
  },

  secondaryButton: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#d9ded6",
  },

  secondaryButtonText: {
    color: "#374151",
    fontSize: 14,
    fontWeight: "700",
  },

  editButton: {
    marginTop: 10,
    backgroundColor: "#1E3A8A",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  editButtonText: {
    color: "#f3f7fb",
    fontSize: 14,
    fontWeight: "700",
  },

  removeButton: {
    alignSelf: "center",
    paddingVertical: 6,
    paddingHorizontal: 10,
  },

  removeButtonText: {
    color: "#B91C1C",
    fontSize: 14,
    fontWeight: "700",
  },
});
