import theme from "@/app/theme/constantStyling";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import RegularButton from "../../components/ui/button";
import InputBox from "../../components/ui/inputBox";
import { useAchievements } from "../achievements/AchievementProvider";
import DiaryEntryModal from "./DiaryEntryModal";

type DiaryEntry = {
  id: string;
  text: string;
  date: string;
  tags: string[];
};

const STORAGE_KEY = "diary_entries";
const TAGS_KEY = "diary_tags";

export default function DiaryDisplay() {
  const { checkAchievements } = useAchievements();
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<string[]>([]);
  const [searchText, setSearchText] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [inputText, setInputText] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [allTags, setAllTags] = useState(["Motivert", "Glad", "Positiv"]);
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    loadEntries();
    loadTags();
  }, []);

  const loadEntries = async () => {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (stored) setEntries(JSON.parse(stored));
  };

  const loadTags = async () => {
    const stored = await AsyncStorage.getItem(TAGS_KEY);
    if (stored) setAllTags(JSON.parse(stored));
  };

  const saveEntries = async (data: DiaryEntry[]) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  const saveTags = async (data: string[]) => {
    await AsyncStorage.setItem(TAGS_KEY, JSON.stringify(data));
  };

  const addEntry = async () => {
    if (!inputText.trim()) return;

    const newEntry: DiaryEntry = {
      id: Date.now().toString(),
      text: inputText,
      date: new Date().toISOString(),
      tags: selectedTags,
    };

    const updated = [newEntry, ...entries];
    setEntries(updated);
    await saveEntries(updated);

    setInputText("");
    setSelectedTags([]);
    setModalVisible(false);
    await checkAchievements();
  };

  const addTag = () => {
    if (!newTag.trim()) return;

    if (!allTags.includes(newTag)) {
      const updated = [...allTags, newTag];
      setAllTags(updated);
      saveTags(updated);
    }

    setSelectedTags([...selectedTags, newTag]);
    setNewTag("");
  };

  const deleteEntry = (id: string) => {
    Alert.alert("Slett", "Vil du slette denne?", [
      { text: "Avbryt", style: "cancel" },
      {
        text: "Slett",
        style: "destructive",
        onPress: () => {
          const updated = entries.filter((e) => e.id !== id);
          setEntries(updated);
          saveEntries(updated);
        },
      },
    ]);
  };

  const renderEntry = ({ item }: { item: DiaryEntry }) => (
    <View style={styles.entry}>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteEntry(item.id)}
      >
        <Ionicons name="trash-outline" size={18} color="red" />
      </TouchableOpacity>

      <Text style={styles.date}>
        {new Date(item.date).toLocaleDateString()}
      </Text>

      <Text style={styles.text}>{item.text}</Text>

      {item.tags.length > 0 && (
        <View style={styles.entryTags}>
          {item.tags.map((tag) => (
            <View key={tag} style={styles.entryTag}>
              <Text style={{ color: "#2f3b44", fontWeight: "600" }}>{tag}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* søk + knapp */}
      <View style={styles.searchRow}>
        <View style={styles.searchInputWrapper}>
          <InputBox
            variant="tag"
            style={styles.searchInput}
            placeholder="Søk på innlegg..."
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        <View style={styles.addButtonWrapper}>
          <RegularButton
            title="+ Nytt innlegg"
            onPress={() => setModalVisible(true)}
          />
        </View>
      </View>
      {/* filter og tags*/}
      <View style={styles.modalTags}>
        {allTags.map((tag) => (
          <TouchableOpacity
            key={tag}
            style={[
              styles.tag,
              filteredEntries.includes(tag) && styles.selectedTag,
            ]}
            onPress={() => {
              if (filteredEntries.includes(tag)) {
                setFilteredEntries(filteredEntries.filter((t) => t !== tag));
              } else {
                setFilteredEntries([...filteredEntries, tag]);
              }
            }}
          >
            <Text style={styles.tagText}>{tag}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* liste */}
      <FlatList
        data={
          filteredEntries.length > 0 || searchText
            ? entries.filter((e) => {
                const matchesTags =
                  filteredEntries.length === 0 ||
                  e.tags.some((t) => filteredEntries.includes(t));

                const matchesSearch =
                  !searchText ||
                  e.text.toLowerCase().includes(searchText.toLowerCase());

                return matchesTags && matchesSearch;
              })
            : entries
        }
        keyExtractor={(item) => item.id}
        renderItem={renderEntry}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      {/* modal */}
      <DiaryEntryModal
        visible={modalVisible}
        inputText={inputText}
        selectedTags={selectedTags}
        allTags={allTags}
        newTag={newTag}
        onSetInputText={setInputText}
        onSetSelectedTags={setSelectedTags}
        onSetAllTags={setAllTags}
        onSetNewTag={setNewTag}
        onAddEntry={addEntry}
        onAddTag={addTag}
        onSaveTags={saveTags}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: "#78a6b3",
    position: "relative",
  },

  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    gap: 10,
  },

  searchInputWrapper: {
    flex: 1,
  },

  searchInput: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: "#ffffff",
    borderColor: "#c5d6e6",
    color: "#2f3b44",
    fontSize: 15,
  },

  addButtonWrapper: {
    minWidth: 120,
  },

  modalTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },

  tag: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderRadius: 999,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: "#f2e8d5",
    borderColor: "#e3d6bf",
  },

  selectedTag: {
    backgroundColor: "#d9c7a6",
    borderColor: "#c4b08a",
  },

  tagText: {
    color: "#2e3a33",
    fontSize: 14,
    fontWeight: "500",
  },

  list: {
    paddingBottom: 100,
  },

  entry: {
    padding: 18,
    borderRadius: theme.borderRadius.medium,
    marginBottom: theme.spacing.small,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 4,
    borderWidth: 1,
    backgroundColor: "#f7f9fb",
    borderColor: "#d6e0ea",
  },

  date: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 10,
  },

  text: {
    color: "#1e293b",
    fontSize: 16,
    lineHeight: 24,
  },

  deleteButton: {
    position: "absolute",
    top: 14,
    right: 14,
    backgroundColor: "#ffecee",
    padding: 8,
    borderRadius: 999,
  },

  entryTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 14,
  },

  entryTag: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: "#d7e4ef",
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#c5d6e6",
  },
});
