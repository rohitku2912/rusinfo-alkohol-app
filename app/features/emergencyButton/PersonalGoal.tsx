import FunctionBox from "@/app/components/ui/functionBox";
import KeyboardDoneAccessory from "@/app/components/ui/KeyboardDoneAccessory";
import theme from "@/app/theme/constantStyling";
import {
  getOnboardingData,
  mergeOnboardingData,
} from "@/lib/storage/onboarding";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const MOTIVATION_INPUT_ACCESSORY_ID = "motivation-input-accessory";

function formatInspiration(items: string[]) {
  return items.join(" • ");
}

function parseInspiration(text: string) {
  return text
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

type Props = {
  onEditingStart?: () => void;
};

export default function PersonalGoal({ onEditingStart }: Props) {
  const [inspiration, setInspiration] = useState("");
  const [draftInspiration, setDraftInspiration] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const loadInspiration = async () => {
      const data = await getOnboardingData();
      const items = Array.isArray(data.inspiration)
        ? data.inspiration
        : data.inspiration
          ? [data.inspiration]
          : [];

      setInspiration(formatInspiration(items));
      setDraftInspiration(items.join("\n"));
    };

    void loadInspiration();
  }, []);

  const startEditing = () => {
    setDraftInspiration(inspiration.split(" • ").join("\n"));
    setIsEditing(true);
    onEditingStart?.();
  };

  const cancelEditing = () => {
    setDraftInspiration(inspiration.split(" • ").join("\n"));
    setIsEditing(false);
    Keyboard.dismiss();
  };

  const saveInspiration = async () => {
    const items = parseInspiration(draftInspiration);
    await mergeOnboardingData({ inspiration: items });
    setInspiration(formatInspiration(items));
    setDraftInspiration(items.join("\n"));
    setIsEditing(false);
    Keyboard.dismiss();
  };

  const removeInspiration = async () => {
    await mergeOnboardingData({ inspiration: [] });
    setInspiration("");
    setDraftInspiration("");
    setIsEditing(false);
    Keyboard.dismiss();
  };

  const motivationItems = inspiration
    ? inspiration.split(" • ").filter(Boolean)
    : [];

  return (
    <FunctionBox
      title="Din motivasjon"
      description="En påminnelse om hvorfor dette er viktig for deg."
    >
      {isEditing ? (
        <View style={styles.editSection}>
          <Text style={styles.fieldLabel}>Ett punkt per linje</Text>
          <TextInput
            autoFocus
            inputAccessoryViewID={MOTIVATION_INPUT_ACCESSORY_ID}
            maxLength={300}
            multiline
            onChangeText={setDraftInspiration}
            placeholder="Hva ønsker du å minne deg selv på?"
            placeholderTextColor="#8a958a"
            style={styles.input}
            textAlignVertical="top"
            value={draftInspiration}
          />
          <Text style={styles.characterCount}>
            {draftInspiration.length}/300
          </Text>
          <View style={styles.actions}>
            <TouchableOpacity
              disabled={!draftInspiration.trim()}
              onPress={saveInspiration}
              style={[
                styles.primaryButton,
                !draftInspiration.trim() && styles.disabledButton,
              ]}
            >
              <Text style={styles.primaryButtonText}>Lagre</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={cancelEditing}
              style={styles.secondaryButton}
            >
              <Text style={styles.secondaryButtonText}>Avbryt</Text>
            </TouchableOpacity>
          </View>
          {inspiration && (
            <TouchableOpacity
              onPress={removeInspiration}
              style={styles.removeButton}
            >
              <Text style={styles.removeButtonText}>Fjern motivasjon</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <>
          {motivationItems.length > 0 ? (
            <View style={styles.motivationPanel}>
              {motivationItems.map((item, index) => (
                <View key={`${item}-${index}`} style={styles.motivationRow}>
                  <View style={styles.heartIcon}>
                    <Ionicons
                      name="heart"
                      size={15}
                      color={theme.colors.primary}
                    />
                  </View>
                  <Text style={styles.motivationText}>{item}</Text>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyPanel}>
              <View style={styles.emptyIcon}>
                <Ionicons
                  name="heart-outline"
                  size={20}
                  color={theme.colors.primary}
                />
              </View>
              <View style={styles.emptyContent}>
                <Text style={styles.emptyTitle}>Hva er viktig for deg?</Text>
                <Text style={styles.emptyText}>
                  Legg til noen ord du ønsker å bli minnet på.
                </Text>
              </View>
            </View>
          )}
          <TouchableOpacity
            onPress={startEditing}
            style={inspiration ? styles.outlineButton : styles.primaryButton}
          >
            <Ionicons
              name={inspiration ? "create-outline" : "add"}
              size={17}
              color={
                inspiration
                  ? theme.colors.primary
                  : theme.colors.buttonText
              }
            />
            <Text
              style={
                inspiration
                  ? styles.outlineButtonText
                  : styles.primaryButtonText
              }
            >
              {inspiration ? "Rediger motivasjon" : "Legg til motivasjon"}
            </Text>
          </TouchableOpacity>
        </>
      )}
      <KeyboardDoneAccessory nativeID={MOTIVATION_INPUT_ACCESSORY_ID} />
    </FunctionBox>
  );
}

const styles = StyleSheet.create({
  motivationPanel: {
    backgroundColor: theme.colors.background,
    borderColor: "#d6e0da",
    borderRadius: theme.borderRadius.medium,
    borderWidth: 1,
    gap: 11,
    padding: theme.spacing.medium,
  },
  motivationRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 10,
  },
  heartIcon: {
    alignItems: "center",
    backgroundColor: "#EAF4EE",
    borderRadius: 14,
    height: 28,
    justifyContent: "center",
    width: 28,
  },
  motivationText: {
    color: theme.colors.text,
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 21,
    paddingTop: 3,
  },
  emptyPanel: {
    alignItems: "center",
    backgroundColor: theme.colors.background,
    borderColor: "#d6e0da",
    borderRadius: theme.borderRadius.medium,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    padding: theme.spacing.medium,
  },
  emptyIcon: {
    alignItems: "center",
    backgroundColor: "#EAF4EE",
    borderRadius: 20,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  emptyContent: {
    flex: 1,
  },
  emptyTitle: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: "800",
  },
  emptyText: {
    color: theme.colors.darkGrey,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 2,
  },
  outlineButton: {
    alignItems: "center",
    borderColor: theme.colors.primary,
    borderRadius: theme.borderRadius.medium,
    borderWidth: 1,
    flexDirection: "row",
    gap: 7,
    justifyContent: "center",
    marginTop: theme.spacing.small,
    minHeight: 46,
  },
  outlineButtonText: {
    color: theme.colors.primary,
    fontWeight: "700",
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.medium,
    flex: 1,
    flexDirection: "row",
    gap: 7,
    justifyContent: "center",
    minHeight: 46,
  },
  primaryButtonText: {
    color: theme.colors.buttonText,
    fontWeight: "700",
  },
  editSection: {
    gap: theme.spacing.small,
  },
  fieldLabel: {
    color: theme.colors.darkGrey,
    fontSize: 12,
    fontWeight: "700",
  },
  input: {
    backgroundColor: theme.colors.background,
    borderColor: "#d6e0da",
    borderRadius: theme.borderRadius.medium,
    borderWidth: 1,
    color: theme.colors.text,
    fontSize: 15,
    lineHeight: 22,
    minHeight: 130,
    padding: theme.spacing.medium,
  },
  characterCount: {
    alignSelf: "flex-end",
    color: theme.colors.darkGrey,
    fontSize: 11,
  },
  actions: {
    flexDirection: "row",
    gap: theme.spacing.small,
  },
  secondaryButton: {
    alignItems: "center",
    backgroundColor: theme.colors.box,
    borderColor: "#d6e0da",
    borderRadius: theme.borderRadius.medium,
    borderWidth: 1,
    flex: 1,
    justifyContent: "center",
    minHeight: 46,
  },
  secondaryButtonText: {
    color: theme.colors.text,
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
    color: theme.colors.attention,
    fontSize: 13,
    fontWeight: "700",
  },
});
