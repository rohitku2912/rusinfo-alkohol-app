import BackButton from "@/app/components/ui/backButton";
import { useState } from "react";
import {
  FlatList,
  Keyboard,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;

  allTriggers: string[];
  onAddTrigger: (trigger: string) => void;

  triggerEntries: {
    trigger: string;
    protectionFactors: string[];
    count: number;
  }[];

  selectedTrigger: string | null;
  protectionText: string;
  onSetProtectionText: (text: string) => void;
  onSelectTrigger: (trigger: string | null) => void;
  onAddProtectionFactor: () => void;
  onAddProtectionFactorWithText: (text: string) => void;
  onBack: () => void;
};

const presetProtectionFactors = [
  "Snakket med en venn",
  "Gikk en tur",
  "Pusteteknikk",
  "Tok pause",
  "Fokuserte på pusten",
  "Skrev ned følelsene mine",
];

export default function RegisterTriggerModal({
  visible,
  onClose,
  allTriggers,
  onAddTrigger,
  triggerEntries,
  selectedTrigger,
  protectionText,
  onSetProtectionText,
  onSelectTrigger,
  onAddProtectionFactor,
  onAddProtectionFactorWithText,
  onBack,
}: Props) {
  const [inputText, setInputText] = useState("");

  const addTrigger = () => {
    if (!inputText.trim()) return;
    const value = inputText.trim();

    onAddTrigger(value);

    setInputText("");
  };

  const existingFactors =
    triggerEntries.find((t) => t.trigger === selectedTrigger)
      ?.protectionFactors || [];

  const suggestedPresetFactors = presetProtectionFactors.filter(
    (f) => !existingFactors.includes(f),
  );

  const customFactors = Array.from(
    new Set(triggerEntries.flatMap((t) => t.protectionFactors)),
  ).filter((f) => f && !presetProtectionFactors.includes(f));

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          <View style={styles.container}>
            {/* header */}
            <View style={styles.header}>
              <Text style={styles.title}>
                {selectedTrigger ? "Beskyttelsesfaktorer" : "Trigger"}
              </Text>

              <TouchableOpacity onPress={onClose}>
                <Text style={styles.close}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {/* triggere */}
              {!selectedTrigger && (
                <View style={styles.section}>
                  <Text style={styles.subtitle}>
                    Velg en trigger fra listen eller legg til en ny
                  </Text>
                  <TextInput
                    placeholder="Ny trigger..."
                    value={inputText}
                    onChangeText={setInputText}
                    style={styles.input}
                    onSubmitEditing={addTrigger}
                  />

                  <TouchableOpacity onPress={addTrigger} style={styles.button}>
                    <Text style={styles.buttonText}>+ Legg til trigger</Text>
                  </TouchableOpacity>

                  <FlatList
                    data={allTriggers}
                    keyExtractor={(item) => item}
                    scrollEnabled={false}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        onPress={() => onSelectTrigger(item)}
                        style={styles.item}
                      >
                        <Text style={styles.itemText}>{item}</Text>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              )}

              {/* beskyttelsesfaktorer */}
              {selectedTrigger && (
                <View style={styles.section}>
                  <BackButton onPress={onBack} />
                  <Text style={styles.selected}>{selectedTrigger}</Text>
                  <Text style={styles.subtitle}>
                    Hva hjalp deg i denne situasjonen?
                  </Text>
                  <TextInput
                    placeholder="Legg til ny faktor..."
                    value={protectionText}
                    onChangeText={onSetProtectionText}
                    style={styles.input}
                    multiline
                  />

                  <TouchableOpacity
                    onPress={onAddProtectionFactor}
                    style={styles.button}
                  >
                    <Text style={styles.buttonText}>+ Legg til</Text>
                  </TouchableOpacity>

                  {/* egne faktorer*/}
                  {customFactors.length > 0 && (
                    <View style={styles.block}>
                      <Text style={styles.subTitle}>
                        Dine beskyttelsesfaktorer
                      </Text>

                      {customFactors.map((f) => (
                        <TouchableOpacity
                          key={f}
                          style={styles.chip}
                          onPress={() => onAddProtectionFactorWithText(f)}
                        >
                          <Text>{f}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}

                  {/* preset */}
                  {suggestedPresetFactors.length > 0 && (
                    <View style={styles.block}>
                      <Text style={styles.subTitle}>Forslag</Text>

                      {suggestedPresetFactors.map((f) => (
                        <TouchableOpacity
                          key={f}
                          style={styles.chip}
                          onPress={() => onAddProtectionFactorWithText(f)}
                        >
                          <Text>{f}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(60, 70, 60, 0.25)",
    justifyContent: "center",
    alignItems: "center",
  },

  container: {
    width: "92%",
    maxHeight: "85%",
    backgroundColor: "#f6f7f4",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#d9ded6",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2f3a2f",
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    paddingBottom: 10,
  },

  close: {
    fontSize: 18,
    color: "#5c6b5c",
  },

  section: {
    marginTop: 10,
  },

  input: {
    borderWidth: 1,
    borderColor: "#d9ded6",
    borderRadius: 14,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#ffffff",
    color: "#2f3a2f",
  },

  button: {
    backgroundColor: "#c9d2c3",
    padding: 10,
    borderRadius: 14,
    marginBottom: 10,
    alignItems: "center",
  },

  buttonText: {
    fontWeight: "600",
    color: "#2f3a2f",
  },

  item: {
    backgroundColor: "#e7ebe3",
    padding: 10,
    borderRadius: 14,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: "#d9ded6",
  },

  itemText: {
    fontSize: 15,
  },

  selected: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },

  block: {
    marginBottom: 10,
  },

  subTitle: {
    fontSize: 13,
    color: "#666",
    marginBottom: 6,
  },

  chip: {
    backgroundColor: "#e7ebe3",
    padding: 10,
    borderRadius: 14,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: "#d9ded6",
  },

  helper: {
    marginTop: 10,
    color: "#777",
    fontStyle: "italic",
  },
});
