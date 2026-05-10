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
  resetButton: {
    alignSelf: "flex-start",
    marginBottom: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "#fee2e2",
    borderRadius: 8,
  },

  resetText: {
    color: "#b91c1c",
    fontSize: 13,
    fontWeight: "600",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  numberText: {
    fontSize: 16,
    color: "#1f2937",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginTop: 6,
    backgroundColor: "#739bec",
  },

  numberLink: {
    color: "#4338ca",
    fontWeight: "600",
  },

  placeholderText: {
    color: "#9ca3af",
    fontStyle: "italic",
  },

  inputInline: {
    fontSize: 16,
    padding: 0,
    margin: 0,
    borderBottomWidth: 1,
    borderColor: "#a1aaf7",
  },

  error: {
    color: "red",
    marginTop: 4,
    fontSize: 12,
  },

  emptyState: {
    
    padding: 12,
    borderRadius: 10,
  },

  emptyText: {
    fontSize: 16,
    color: "#374151",
    fontWeight: "500",
  },

  emptyHint: {
    marginTop: 4,
    fontSize: 13,
    color: "#9ca3af",
    fontStyle: "italic",
  },
});
