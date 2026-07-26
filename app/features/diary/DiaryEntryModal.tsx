import theme from "@/app/theme/constantStyling";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import InputBox from "../../components/ui/inputBox";
import HelpButton from "../help/HelpButton";

interface DiaryEntryModalProps {
  visible: boolean;
  inputText: string;
  selectedTags: string[];
  allTags: string[];
  newTag: string;
  onSetInputText: (text: string) => void;
  onSetSelectedTags: (tags: string[]) => void;
  onSetAllTags: (tags: string[]) => void;
  onSetNewTag: (tag: string) => void;
  onAddEntry: () => void;
  onAddTag: () => void;
  onSaveTags: (tags: string[]) => void;
  onClose: () => void;
}

export default function DiaryEntryModal({
  visible,
  inputText,
  selectedTags,
  allTags,
  newTag,
  onSetInputText,
  onSetSelectedTags,
  onSetAllTags,
  onSetNewTag,
  onAddEntry,
  onAddTag,
  onSaveTags,
  onClose,
}: DiaryEntryModalProps) {
  const canSave = inputText.trim().length > 0;

  const saveEntry = () => {
    if (!canSave) return;

    onAddEntry();
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.overlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={styles.keyboardView}
          >
            <View style={styles.modalCard}>
              <View style={styles.header}>
                <View style={styles.headerAction}>
                  <HelpButton helpKey="diary" />
                </View>
                <Text style={styles.title}>Nytt dagbokinnlegg</Text>
                <Pressable
                  accessibilityLabel="Lukk"
                  hitSlop={10}
                  onPress={onClose}
                  style={[styles.headerAction, styles.closeButton]}
                >
                  <Text style={styles.closeText}>✕</Text>
                </Pressable>
              </View>

              <ScrollView
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                <Text style={styles.label}>Hva vil du skrive?</Text>
                <InputBox
                  variant="entry"
                  value={inputText}
                  onChangeText={onSetInputText}
                  placeholder="Skriv ned tanker, følelser eller det som skjedde..."
                  multiline
                  style={styles.entryInput}
                />

                <Text style={styles.label}>Velg tagger (valgfritt)</Text>
                <Text style={styles.helperText}>
                  Trykk for å velge. Hold inne en tagg for å slette den.
                </Text>
                <View style={styles.tags}>
                  {allTags.map((tag) => {
                    const isSelected = selectedTags.includes(tag);

                    return (
                      <TouchableOpacity
                        key={tag}
                        style={[styles.tag, isSelected && styles.selectedTag]}
                        onPress={() => {
                          if (isSelected) {
                            onSetSelectedTags(
                              selectedTags.filter((item) => item !== tag),
                            );
                          } else {
                            onSetSelectedTags([...selectedTags, tag]);
                          }
                        }}
                        onLongPress={() => {
                          Alert.alert(
                            "Slett tagg",
                            `Vil du slette "${tag}"?`,
                            [
                              { text: "Avbryt", style: "cancel" },
                              {
                                text: "Slett",
                                style: "destructive",
                                onPress: () => {
                                  const updated = allTags.filter(
                                    (item) => item !== tag,
                                  );
                                  onSetAllTags(updated);
                                  onSaveTags(updated);
                                  onSetSelectedTags(
                                    selectedTags.filter(
                                      (item) => item !== tag,
                                    ),
                                  );
                                },
                              },
                            ],
                          );
                        }}
                      >
                        <Text
                          style={[
                            styles.tagText,
                            isSelected && styles.selectedTagText,
                          ]}
                        >
                          {tag}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <View style={styles.newTagRow}>
                  <View style={styles.newTagInputWrapper}>
                    <InputBox
                      variant="tag"
                      value={newTag}
                      onChangeText={onSetNewTag}
                      placeholder="Lag en ny tagg..."
                      onSubmitEditing={onAddTag}
                      returnKeyType="done"
                      style={styles.tagInput}
                    />
                  </View>
                  <TouchableOpacity
                    disabled={!newTag.trim()}
                    onPress={onAddTag}
                    style={[
                      styles.addTagButton,
                      !newTag.trim() && styles.disabledButton,
                    ]}
                  >
                    <Text style={styles.addTagButtonText}>Legg til</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  onPress={onClose}
                  style={[styles.actionButton, styles.cancelButton]}
                >
                  <Text style={styles.cancelButtonText}>Avbryt</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  disabled={!canSave}
                  onPress={saveEntry}
                  style={[
                    styles.actionButton,
                    styles.saveButton,
                    !canSave && styles.disabledButton,
                  ]}
                >
                  <Text style={styles.saveButtonText}>Lagre innlegg</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.medium,
  },
  keyboardView: {
    maxHeight: "90%",
    width: "100%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.spacing.large,
  },

  modalCard: {
    width: "100%",
    maxWidth: 420,
    maxHeight: "100%",
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.medium,
    borderWidth: 1,
    borderColor: "#d6e0da",
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: theme.colors.text,
    textAlign: "center",
    flex: 1,
  },
  headerAction: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 40,
    width: 40,
  },
  closeButton: {
    backgroundColor: theme.colors.box,
    borderRadius: 20,
  },
  label: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: theme.spacing.small,
  },
  entryInput: {
    backgroundColor: theme.colors.box,
    borderColor: "#d6e0da",
    marginBottom: theme.spacing.large,
    minHeight: 140,
    padding: 14,
  },
  helperText: {
    color: theme.colors.darkGrey,
    fontSize: 12,
    lineHeight: 17,
    marginBottom: theme.spacing.small,
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.small,
    marginBottom: theme.spacing.medium,
  },

  tag: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#d6e0da",
    borderRadius: 999,
    backgroundColor: theme.colors.box,
  },

  selectedTag: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },

  tagText: {
    color: theme.colors.text,
    fontWeight: "600",
  },
  selectedTagText: {
    color: theme.colors.lightText,
  },
  newTagRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing.small,
  },
  newTagInputWrapper: {
    flex: 1,
  },

  tagInput: {
    backgroundColor: theme.colors.box,
    borderColor: "#d6e0da",
  },
  addTagButton: {
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.medium,
    height: 50,
    justifyContent: "center",
    paddingHorizontal: theme.spacing.medium,
  },
  addTagButtonText: {
    color: theme.colors.buttonText,
    fontWeight: "700",
  },

  modalButtons: {
    flexDirection: "row",
    gap: theme.spacing.small,
    marginTop: theme.spacing.large,
  },
  actionButton: {
    alignItems: "center",
    borderRadius: theme.borderRadius.medium,
    flex: 1,
    height: 50,
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: theme.colors.box,
    borderColor: "#d6e0da",
    borderWidth: 1,
  },
  cancelButtonText: {
    color: theme.colors.text,
    fontWeight: "700",
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
  },
  saveButtonText: {
    color: theme.colors.buttonText,
    fontWeight: "700",
  },
  disabledButton: {
    opacity: 0.45,
  },

  closeText: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text,
  },
});
