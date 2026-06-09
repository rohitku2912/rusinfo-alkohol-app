import EditButton from "@/app/components/ui/editButton";
import {
  Alert,
  Keyboard,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import InputBox from "../../components/ui/inputBox";
import HelpButton from "../help/HelpButton";
import theme from "@/app/theme/constantStyling";

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
    <Modal visible={visible} animationType="fade" transparent>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.overlay}>
  <View style={styles.modalCard}>
  <View style={styles.header}>
  <HelpButton helpKey="diary" />

  <Text style={styles.title}>Nytt dagbokinnlegg</Text>

  <Pressable onPress={onClose}>
    <Text style={styles.closeText}>✕</Text>
  </Pressable>
</View>

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
            <EditButton
              isEditing={true}
              onPress={() => {
                onAddEntry();
                onClose();
              }}
            />
          </View>
        </View>
        </View>
      </TouchableWithoutFeedback>
      
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },

  modalCard: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#f3f7fb",
    borderRadius: 20,
    padding: 20,
    position: "relative",
    borderWidth: 1,
    borderColor: "#c7d6e3",
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: theme.colors.text,
    textAlign: "center",
    flex: 1,
  },

  tag: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#c7d6e3",
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: "#eef3f8",
  },

  selectedTag: {
    backgroundColor: "#7f9bb3",
    borderColor: "#5f7f99",
  },

  tagText: {
    color: "#2f3b44",
    fontWeight: "500",
  },

  tagInputContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    borderRadius: 20,
    padding: 8,
    marginTop: 10,
  },

  tagInput: {
    minWidth: 80,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#c7d6e3",
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 6,
    marginTop: 6,
    backgroundColor: "#ffffff",
  },

  modalButtons: {
    marginTop: 20,
    gap: 10,
  },

  closeText: {
    fontSize: 22,
    fontWeight: "600",
    color: theme.colors.text,
  },
});
