import {
  Alert,
  Keyboard,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import InputBox from "../../components/ui/inputBox";
import RegularButton from "../../components/ui/button";
import theme from "../../theme/constantStyling";

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
  return (
    <Modal visible={visible} animationType="slide">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.modalCard}>
          <Text style={styles.title}>Nytt dagbokinnlegg</Text>

          <InputBox
            variant="entry"
            value={inputText}
            onChangeText={onSetInputText}
            placeholder="Skriv dagbok..."
            multiline
          />

          {/* forhåndslagde tags */}
          <View style={styles.tagInputContainer}>
            {allTags.map((tag) => {
              const isSelected = selectedTags.includes(tag);

              return (
                <TouchableOpacity
                  key={tag}
                  style={[styles.tag, isSelected && styles.selectedTag]}
                  onPress={() => {
                    if (isSelected) {
                      onSetSelectedTags(selectedTags.filter((t) => t !== tag));
                    } else {
                      onSetSelectedTags([...selectedTags, tag]);
                    }
                  }}
                  onLongPress={() => {
                    Alert.alert("Slett tag", `Vil du slette "${tag}"?`, [
                      { text: "Avbryt", style: "cancel" },
                      {
                        text: "Slett",
                        style: "destructive",
                        onPress: () => {
                          const updated = allTags.filter((t) => t !== tag);
                          onSetAllTags(updated);
                          onSaveTags(updated);
                          onSetSelectedTags(
                            selectedTags.filter((t) => t !== tag),
                          );
                        },
                      },
                    ]);
                  }}
                >
                  <Text style={styles.tagText}>{tag}</Text>
                </TouchableOpacity>
              );
            })}

            <InputBox
              variant="tag"
              value={newTag}
              onChangeText={onSetNewTag}
              placeholder="Ny tag..."
              onSubmitEditing={onAddTag}
              style={styles.tagInput}
            />
          </View>
          <View style={styles.modalButtons}>
            <RegularButton
              style={styles.button}
              title="Lagre"
              onPress={() => {
                onAddEntry();
                onClose();
              }}
            />

            <RegularButton
              style={styles.cancel}
              title="Avbryt"
              onPress={onClose}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalCard: {
    flex: 1,
    backgroundColor: "rgba(165, 205, 160, 0.4)",
    justifyContent: "center",
    padding: 20,
    borderRadius: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 15,
    textAlign: "center",
  },
  tag: {
    padding: 8,
    borderWidth: 1,
    borderRadius: 20,
    marginRight: 8,
  },
  selectedTag: {
    backgroundColor: "#a1aaf7",
  },
  tagText: {
    color: theme.colors.text,
  },
  tagInputContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    borderRadius: 20,
    padding: 8,
  },
  tagInput: {
    minWidth: 60,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 6,
    marginTop: 6,
  },
  modalButtons: {
    marginTop: 20,
    gap: 10,
  },
  button: {
    marginTop: 0,
    backgroundColor: "#5daf5d",
  },
  cancel: {
    backgroundColor: "#f86f6f",
  },
});
