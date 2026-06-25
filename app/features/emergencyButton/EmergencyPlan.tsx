import EditButton from "@/app/components/ui/editButton";
import FunctionBox from "@/app/components/ui/functionBox";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type TriggerEntry = {
  trigger: string;
  protectionFactors: string[];
};

type Props = {
  onEditingChange?: (editing: boolean) => void;
};

export default function EmergencyPlan({ onEditingChange }: Props) {
  const defaultPlan =
    "- Gå tur\n- Drikk vann\n- Ring en venn eller et familiemedlem";

  const [plan, setPlan] = useState(defaultPlan);
  const [isEditing, setIsEditing] = useState(false);
  const [triggers, setTriggers] = useState<TriggerEntry[]>([]);
  const [selectedTrigger, setSelectedTrigger] = useState<string | null>(null);

  useEffect(() => {
    loadPlan();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadTriggers();
    }, []),
  );

  useEffect(() => {
    onEditingChange?.(isEditing);
  }, [isEditing, onEditingChange]);

  const loadPlan = async () => {
    const savedPlan = await AsyncStorage.getItem("emergencyPlan");

    if (savedPlan) {
      setPlan(savedPlan);
    }
  };

  const savePlan = async (text: string) => {
    setPlan(text);
    await AsyncStorage.setItem("emergencyPlan", text);
  };

  const resetPlan = async () => {
    await AsyncStorage.removeItem("emergencyPlan");
    setPlan(defaultPlan);
  };

  const TRIGGER_ENTRIES_STORAGE_KEY = "trigger_display_entries";

  const loadTriggers = async () => {
    const stored = await AsyncStorage.getItem(TRIGGER_ENTRIES_STORAGE_KEY);

    if (stored) {
      setTriggers(JSON.parse(stored));
    }
  };

  const selected = triggers.find((t) => t.trigger === selectedTrigger);

  return (
    <FunctionBox
      title="Din trygghetsplan"
      description="Dette kan du gjøre om du føler på en trang til å drikke."
    >
     

      <View style={styles.container}>
        {isEditing ? (
          <View style={styles.inputWrapper}>
            <TextInput
              multiline
              value={plan}
              onChangeText={savePlan}
              autoFocus
              style={styles.input}
            />
          </View>
        ) : (
          <View style={styles.box}>
            {plan.split("\n").map((line, index) => (
              <Text key={index} style={styles.line}>
                {line}
              </Text>
            ))}
          </View>
        )}

        <View style={styles.editButtonContainer}>
          <EditButton
            isEditing={isEditing}
            onPress={() => {
              if (isEditing) {
                savePlan(plan);
              }
              setIsEditing(!isEditing);
            }}
          />
        </View>
      </View>

      <Text style={{ marginTop: 20, fontWeight: "600" }}>Hva trigget deg?</Text>

      {triggers.length === 0 ? (
        <Text style={{ marginTop: 10, color: "#777", fontStyle: "italic" }}>
          Du har ikke registrert noen triggere. Legg til i Triggerdagboken.
        </Text>
      ) : (
        <View style={styles.triggerWrap}>
          {triggers.map((item) => (
            <TouchableOpacity
              key={item.trigger}
              onPress={() =>
                setSelectedTrigger((prev) =>
                  prev === item.trigger ? null : item.trigger,
                )
              }
            >
              <View
                style={[
                  styles.chip,
                  selectedTrigger === item.trigger && styles.chipSelected,
                ]}
              >
                <Text style={styles.chipText}>{item.trigger}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {selected && (
        <View style={{ marginTop: 15 }}>
          <Text style={{ fontWeight: "600", marginBottom: 8 }}>
            Disse beskyttelsesfaktorene har hjulpet deg før:
          </Text>

          {selected.protectionFactors.length > 0 ? (
            selected.protectionFactors.map((f, i) => (
              <Text key={i} style={{ marginBottom: 4 }}>
                • {f}
              </Text>
            ))
          ) : (
            <Text style={{ fontStyle: "italic", color: "#666" }}>
              Ingen beskyttelsesfaktorer lagret for denne triggeren.
            </Text>
          )}
        </View>
      )}
    </FunctionBox>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 14,
  },

  box: {
    backgroundColor: "rgba(255,255,255,0.08)",
    padding: 16,
    borderRadius: 18,
    minHeight: 120,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  inputWrapper: {
    position: "relative",
  },

  input: {
    backgroundColor: "rgba(255,255,255,0.08)",
    padding: 16,
    borderRadius: 18,
    minHeight: 120,
    fontSize: 16,
    textAlignVertical: "top",
    lineHeight: 24,
    color: "#1f2937",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },

  editButtonContainer: {
    marginTop: 12,
  },

  line: {
    fontSize: 16,
    marginBottom: 10,
    lineHeight: 24,
    color: "#1f2937",
  },

  triggerWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 14,
  },

  chip: {
    backgroundColor: "#F3F4F6",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  chipSelected: {
    backgroundColor: "#DDD6FE",
    borderColor: "#8B5CF6",
  },

  chipText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },

  emptyTriggersText: {
    marginTop: 8,
    fontSize: 14,
    color: "#6b7280",
    fontStyle: "italic",
    lineHeight: 22,
  },

  sectionTitle: {
    marginTop: 24,
    marginBottom: 8,
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
  },

  protectionBox: {
    marginTop: 16,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 18,
    padding: 16,
  },

  protectionTitle: {
    fontWeight: "700",
    marginBottom: 10,
    fontSize: 15,
    color: "#111827",
  },

  protectionText: {
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 6,
    color: "#374151",
  },
});
