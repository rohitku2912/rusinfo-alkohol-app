import FunctionBox from "@/app/components/ui/functionBox";
import {
  getOnboardingData,
  mergeOnboardingData,
} from "@/lib/storage/onboarding";
import { useEffect, useState } from "react";
import {
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

function formatInspiration(items: string[]) {
  return items.join(" • ");
}

function parseInspiration(text: string) {
  return text
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function PersonalGoal() {
  const [inspiration, setInspiration] = useState<string>("");
  const [draftInspiration, setDraftInspiration] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const loadInspiration = async () => {
      const data = await getOnboardingData();

      const inspirationItems = Array.isArray(data.inspiration)
        ? data.inspiration
        : data.inspiration
          ? [data.inspiration]
          : [];
      const inspirationText = formatInspiration(inspirationItems);

      setInspiration(inspirationText);
      setDraftInspiration(inspirationItems.join("\n"));
    };

    loadInspiration();
  }, []);

  const startEditing = () => {
    setDraftInspiration(inspiration ? inspiration.split(" • ").join("\n") : "");
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setDraftInspiration(inspiration ? inspiration.split(" • ").join("\n") : "");
    setIsEditing(false);
    Keyboard.dismiss();
  };

  const saveInspiration = async () => {
    const nextInspiration = parseInspiration(draftInspiration);

    await mergeOnboardingData({ inspiration: nextInspiration });
    setInspiration(formatInspiration(nextInspiration));
    setDraftInspiration(nextInspiration.join("\n"));
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

  return (
    <FunctionBox title="Husk hvorfor du ønsker å slutte">
      <View style={styles.container}>
        {isEditing ? (
          <View style={styles.editContainer}>
            <TextInput
              value={draftInspiration}
              onChangeText={setDraftInspiration}
              placeholder="Skriv hva som motiverer deg..."
              placeholderTextColor="#8a958a"
              multiline
              maxLength={300}
              autoFocus
              textAlignVertical="top"
              style={styles.input}
            />
            <Text style={styles.characterCount}>
              {draftInspiration.trim().length}/300
            </Text>

            <View style={styles.actions}>
              <TouchableOpacity
                onPress={saveInspiration}
                activeOpacity={0.8}
                style={styles.saveButton}
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

            {inspiration && (
              <TouchableOpacity
                onPress={removeInspiration}
                activeOpacity={0.8}
                style={styles.removeButton}
              >
                <Text style={styles.removeButtonText}>Fjern</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <>
            <View style={styles.goalBox}>
              <Text style={styles.goalText}>
                {inspiration || "Du har ikke valgt motivasjon enda."}
              </Text>
            </View>

            <TouchableOpacity
              onPress={startEditing}
              activeOpacity={0.8}
              style={styles.editButton}
            >
              <Text style={styles.editButtonText}>
                {inspiration ? "Rediger motivasjon" : "Legg til motivasjon"}
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

  goalBox: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  goalText: {
    fontSize: 16,
    lineHeight: 26,
    color: "#1F2937",
    fontWeight: "500",
  },

  input: {
    minHeight: 120,
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#d9ded6",
    fontSize: 16,
    lineHeight: 24,
    color: "#1F2937",
  },

  characterCount: {
    alignSelf: "flex-end",
    fontSize: 12,
    color: "#6B7280",
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
