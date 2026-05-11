import EditButton from "@/app/components/ui/editButton";
import FunctionBox from "@/app/components/ui/functionBox";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  Linking,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const EMERGENCY_PHONE_KEY = "emergency_phone";

type Props = {
  onEditingChange?: (editing: boolean) => void;
};

export default function CallAFriend({ onEditingChange }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [savedPhone, setSavedPhone] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [phoneInput, setPhoneInput] = useState("");

  useEffect(() => {
    const load = async () => {
      const stored = await AsyncStorage.getItem(EMERGENCY_PHONE_KEY);
      if (stored) setSavedPhone(stored);
    };

    load();
  }, []);

  useEffect(() => {
    if (savedPhone) {
      setPhoneInput(savedPhone);
    }
  }, [savedPhone]);

  useEffect(() => {
    onEditingChange?.(isEditing);
  }, [isEditing]);

  const isValidPhone = (value: string) => {
    const cleaned = value.replace(/\s/g, "");

    return /^(\+47)?\d{8}$/.test(cleaned);
  };

  const savePhone = async (value: string) => {
    const trimmed = value.trim();

    if (trimmed.length === 0) {
      setSavedPhone(null);
      setError(null);
      await AsyncStorage.removeItem(EMERGENCY_PHONE_KEY);
      return true;
    }

    const valid = isValidPhone(trimmed);

    if (!valid) {
      setError("Skriv et gyldig telefonnummer (8 siffer eller +47)");
      return false;
    }

    setError(null);

    await AsyncStorage.setItem(EMERGENCY_PHONE_KEY, trimmed);
    setSavedPhone(trimmed);

    return true;
  };

  const callNumber = async () => {
    if (!savedPhone) return;

    const url = `tel:${savedPhone}`;

    try {
      const supported = await Linking.canOpenURL(url);

      if (!supported) {
        setError("Kunne ikke åpne telefonappen.");
        return;
      }

      setError(null);
      await Linking.openURL(url);
    } catch {
      setError("Noe gikk galt ved oppringing.");
    }
  };

  const displayValue = savedPhone ? `📞 ${savedPhone}` : "Trykk rediger for å legge til nummer...";

  const resetPhone = async () => {
    await AsyncStorage.removeItem(EMERGENCY_PHONE_KEY);
    setSavedPhone(null);
    setPhoneInput("");
    setError(null);
    setIsEditing(false);
  };

  return (
    <FunctionBox
      title="Ring en venn"
      description="Denne personen kan du ringe når du har det vanskelig. Det kan være en god venn, et familiemedlem eller noen andre du stoler på."
    >
      
      <View style={styles.row}>
        <TouchableOpacity onPress={callNumber} style={{ flex: 1 }}>
          {isEditing ? (
            <View>
              <TextInput
                value={phoneInput}
                onChangeText={(text) => {
                  setPhoneInput(text);
                }}
                autoFocus
                keyboardType="phone-pad"
                style={styles.inputInline}
              />
              {error && <Text style={styles.error}>{error}</Text>}
            </View>
          ) : (
            <View>
  {savedPhone ? (
    <Text style={[styles.numberText, styles.numberLink]} onPress={callNumber}>
      📞 {savedPhone}
    </Text>
  ) : (
    <View style={styles.emptyState}>
      <Text style={styles.emptyText}>Ingen nummer lagt til</Text>
      <Text style={styles.emptyHint}>Trykk «Rediger» for å legge til</Text>
    </View>
  )}
</View>
          )}
        </TouchableOpacity>
      </View>

      <View style={{ marginTop: 10 }}>
        <EditButton
          isEditing={isEditing}
          onPress={async () => {
            if (isEditing) {
              const ok = await savePhone(phoneInput);
              if (!ok) return;
            }

            setIsEditing((prev) => !prev);
          }}
        />
      </View>
    </FunctionBox>
  );
}

const styles = StyleSheet.create({
  row: {
    marginTop: 12,
  },

  numberText: {
    fontSize: 16,
    color: "#111827",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    marginTop: 8,
    backgroundColor: "rgba(99, 102, 241, 0.10)",
    borderWidth: 1,
    borderColor: "rgba(99, 102, 241, 0.15)",
  },

  numberLink: {
    fontWeight: "600",
    color: "#1D4ED8",
  },

  inputInline: {
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "#F9FAFB",
  },

  error: {
    color: "#B91C1C",
    marginTop: 6,
    fontSize: 13,
    lineHeight: 18,
  },

  emptyState: {
    padding: 14,
    borderRadius: 14,
    backgroundColor: "rgba(243, 244, 246, 0.8)",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  emptyText: {
    fontSize: 15,
    color: "#111827",
    fontWeight: "600",
  },

  emptyHint: {
    marginTop: 4,
    fontSize: 13,
    color: "#6B7280",
  },
});