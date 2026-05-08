import EditButton from "@/app/components/ui/editButton";
import FunctionBox from "@/app/components/ui/functionBox";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  Linking,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const EMERGENCY_PHONE_KEY = "emergency_phone";

export default function CallAFriend() {
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

  const callNumber = () => {
    if (!savedPhone) return;
    Linking.openURL(`tel:${savedPhone}`);
  };

  const displayValue = savedPhone ? `📞 ${savedPhone}` : "Legg til nummer";

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
              {error && isEditing && <Text style={styles.error}>{error}</Text>}
            </View>
          ) : (
            <Text style={styles.numberText}>{displayValue}</Text>
          )}
        </TouchableOpacity>

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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  numberText: {
    fontSize: 16,
    color: "#1f2937",
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
});
