import FunctionBox from "@/app/components/ui/functionBox";
import theme from "@/app/theme/constantStyling";
import { AppColors, useAppTheme } from "@/app/theme/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  Alert,
  Keyboard,
  Linking,
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

type Props = {
  onEditingStart?: () => void;
};

export default function CallAFriend({ onEditingStart }: Props) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const [phone, setPhone] = useState<string | null>(null);
  const [draftPhone, setDraftPhone] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPhone = async () => {
      const stored = await AsyncStorage.getItem(EMERGENCY_PHONE_KEY);
      if (stored) {
        setPhone(stored);
        setDraftPhone(stored);
      }
    };

    void loadPhone();
  }, []);

  const handleChangePhone = (text: string) => {
    setDraftPhone(text);
    setError(
      text.trim() === "" || isValidPhone(text)
        ? ""
        : "Skriv et gyldig norsk nummer.",
    );
  };

  const startEditing = () => {
    setDraftPhone(phone ?? "");
    setError("");
    setIsEditing(true);
    onEditingStart?.();
  };

  const cancelEditing = () => {
    setDraftPhone(phone ?? "");
    setError("");
    setIsEditing(false);
    Keyboard.dismiss();
  };

  const savePhone = async () => {
    const nextPhone = draftPhone.trim();
    if (!isValidPhone(nextPhone)) {
      setError("Skriv et gyldig norsk nummer.");
      return;
    }

    await AsyncStorage.setItem(EMERGENCY_PHONE_KEY, nextPhone);
    setPhone(nextPhone);
    setDraftPhone(nextPhone);
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

  const callFriend = async () => {
    if (!phone) return;

    try {
      await Linking.openURL(`tel:${phone.replace(/\s/g, "")}`);
    } catch {
      Alert.alert("Kunne ikke starte samtalen", `Ring ${phone} manuelt.`);
    }
  };

  const canSave = isValidPhone(draftPhone);

  return (
    <FunctionBox
      title="Ring en trygg person"
      description="Kontakt noen du stoler på når du trenger støtte."
    >
      {isEditing ? (
        <View style={styles.editSection}>
          <Text style={styles.fieldLabel}>Telefonnummer</Text>
          <TextInput
            autoFocus
            keyboardType="phone-pad"
            onChangeText={handleChangePhone}
            placeholder="For eksempel 91234567"
            placeholderTextColor={colors.darkGrey}
            style={[styles.input, error ? styles.inputError : null]}
            value={draftPhone}
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}

          <View style={styles.actions}>
            <TouchableOpacity
              disabled={!canSave}
              onPress={savePhone}
              style={[
                styles.primaryButton,
                !canSave && styles.disabledButton,
              ]}
            >
              <Text style={styles.primaryButtonText}>Lagre nummer</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={cancelEditing}
              style={styles.secondaryButton}
            >
              <Text style={styles.secondaryButtonText}>Avbryt</Text>
            </TouchableOpacity>
          </View>

          {phone && (
            <TouchableOpacity onPress={removePhone} style={styles.removeButton}>
              <Text style={styles.removeButtonText}>Fjern nummer</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : phone ? (
        <>
          <View style={styles.contactPanel}>
            <View style={styles.phoneIcon}>
              <Ionicons name="person" size={20} color={colors.primary} />
            </View>
            <View style={styles.contactText}>
              <Text style={styles.contactLabel}>Din trygge kontakt</Text>
              <Text style={styles.phoneNumber}>{phone}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={callFriend} style={styles.callButton}>
            <Ionicons name="call" size={18} color={colors.buttonText} />
            <Text style={styles.primaryButtonText}>Ring nå</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={startEditing} style={styles.textButton}>
            <Ionicons
              name="create-outline"
              size={16}
              color={colors.primary}
            />
            <Text style={styles.textButtonText}>Endre nummer</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <View style={styles.emptyPanel}>
            <View style={styles.phoneIcon}>
              <Ionicons
                name="person-add-outline"
                size={20}
                color={colors.primary}
              />
            </View>
            <Text style={styles.emptyText}>
              Legg til noen du kan ringe når du trenger støtte.
            </Text>
          </View>
          <TouchableOpacity onPress={startEditing} style={styles.callButton}>
            <Ionicons name="add" size={18} color={colors.buttonText} />
            <Text style={styles.primaryButtonText}>Legg til kontakt</Text>
          </TouchableOpacity>
        </>
      )}
    </FunctionBox>
  );
}

const createStyles = (colors: AppColors) => StyleSheet.create({
  contactPanel: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: theme.borderRadius.medium,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    padding: theme.spacing.medium,
  },
  emptyPanel: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: theme.borderRadius.medium,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    padding: theme.spacing.medium,
  },
  phoneIcon: {
    alignItems: "center",
    backgroundColor: colors.primarySoft,
    borderRadius: 22,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  contactText: {
    flex: 1,
  },
  contactLabel: {
    color: colors.darkGrey,
    fontSize: 11,
    fontWeight: "700",
  },
  phoneNumber: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "800",
    marginTop: 2,
  },
  emptyText: {
    color: colors.darkGrey,
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
  },
  callButton: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: theme.borderRadius.medium,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    marginTop: theme.spacing.small,
    minHeight: 48,
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: theme.borderRadius.medium,
    flex: 1,
    justifyContent: "center",
    minHeight: 46,
  },
  primaryButtonText: {
    color: colors.buttonText,
    fontWeight: "700",
  },
  textButton: {
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
    justifyContent: "center",
    marginTop: 4,
    minHeight: 40,
  },
  textButtonText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "700",
  },
  editSection: {
    gap: theme.spacing.small,
  },
  fieldLabel: {
    color: colors.darkGrey,
    fontSize: 12,
    fontWeight: "700",
  },
  input: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: theme.borderRadius.medium,
    borderWidth: 1,
    color: colors.text,
    fontSize: 16,
    minHeight: 50,
    paddingHorizontal: 14,
  },
  inputError: {
    borderColor: colors.attention,
  },
  error: {
    color: colors.attention,
    fontSize: 12,
  },
  actions: {
    flexDirection: "row",
    gap: theme.spacing.small,
  },
  secondaryButton: {
    alignItems: "center",
    backgroundColor: colors.box,
    borderColor: colors.border,
    borderRadius: theme.borderRadius.medium,
    borderWidth: 1,
    flex: 1,
    justifyContent: "center",
    minHeight: 46,
  },
  secondaryButtonText: {
    color: colors.text,
    fontWeight: "700",
  },
  disabledButton: {
    opacity: 0.45,
  },
  removeButton: {
    alignSelf: "center",
    padding: theme.spacing.small,
  },
  removeButtonText: {
    color: colors.attention,
    fontSize: 13,
    fontWeight: "700",
  },
});
