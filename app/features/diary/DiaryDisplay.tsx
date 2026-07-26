import theme from "@/app/theme/constantStyling";
import { createDateKey } from "@/app/utils/weekHelpers";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  DrinkLogEntry,
  getDrinkLogs,
  getTotalDrinks,
} from "@/lib/storage/drinkLogs";
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
  const [drinkLogs, setDrinkLogs] = useState<DrinkLogEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<string[]>([]);
  const [searchText, setSearchText] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [inputText, setInputText] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [allTags, setAllTags] = useState(["Motivert", "Glad", "Positiv"]);
  const [newTag, setNewTag] = useState("");

  useFocusEffect(
    useCallback(() => {
      loadEntries();
      loadTags();
      loadDrinkLogs();
    }, []),
  );

  const loadEntries = async () => {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    setEntries(stored ? JSON.parse(stored) : []);
  };

  const loadTags = async () => {
    const stored = await AsyncStorage.getItem(TAGS_KEY);
    setAllTags(stored ? JSON.parse(stored) : ["Motivert", "Glad", "Positiv"]);
  };

  const loadDrinkLogs = async () => {
    setDrinkLogs(await getDrinkLogs());
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

  function getDrinkLogForEntry(entry: DiaryEntry) {
    const entryDateKey = createDateKey(new Date(entry.date));
    return drinkLogs.find((log) => log.date === entryDateKey);
  }

  function renderDrinkSummary(entry: DiaryEntry) {
    const drinkLog = getDrinkLogForEntry(entry);

    if (!drinkLog) {
      return (
        <View style={styles.drinkSummary}>
          <View style={styles.drinkSummaryHeader}>
            <Ionicons name="ellipse-outline" size={15} color="#64748b" />
            <Text style={styles.drinkSummaryMuted}>
              Ingen drikke registrert denne dagen
            </Text>
          </View>
        </View>
      );
    }

    if (drinkLog.status === "hvitDag") {
      return (
        <View style={[styles.drinkSummary, styles.whiteDrinkSummary]}>
          <View style={styles.drinkSummaryHeader}>
            <Ionicons
              name="checkmark-circle-outline"
              size={16}
              color={theme.colors.primary}
            />
            <Text style={styles.whiteDrinkSummaryText}>Hvit dag</Text>
          </View>
        </View>
      );
    }

    const totalDrinks = getTotalDrinks(drinkLog);

    return (
      <View style={styles.drinkSummary}>
        <View style={styles.drinkSummaryHeader}>
          <Ionicons name="wine-outline" size={16} color="#475569" />
          <Text style={styles.drinkSummaryMuted}>Drikkelogg:</Text>
          <Text style={styles.drinkSummaryTotal}>
            {totalDrinks} {totalDrinks === 1 ? "enhet" : "enheter"}
          </Text>
        </View>
        <View style={styles.drinkBreakdownRow}>
          <Text style={styles.drinkBreakdownChip}>Øl: {drinkLog.beerCount}</Text>
          <Text style={styles.drinkBreakdownChip}>Vin: {drinkLog.wineCount}</Text>
          <Text style={styles.drinkBreakdownChip}>
            Drinker: {drinkLog.drinksCount}
          </Text>
        </View>
      </View>
    );
  }

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

      {renderDrinkSummary(item)}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.actions}>
        <RegularButton
          title="+ Nytt innlegg"
          onPress={() => setModalVisible(true)}
          style={styles.addButton}
        />
        <InputBox
          variant="tag"
          style={styles.searchInput}
          placeholder="Søk i dagboken..."
          value={searchText}
          onChangeText={setSearchText}
          returnKeyType="search"
        />
      </View>
      {/* filter og tags*/}
      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>Filtrer etter tagg</Text>
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
              <Text
                style={[
                  styles.tagText,
                  filteredEntries.includes(tag) && styles.selectedTagText,
                ]}
              >
                {tag}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
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
        ListEmptyComponent={
          <Text style={styles.empty}>
            Du har ikke registrert noen dagbokinnlegg enda. Trykk på +Nytt
            innlegg for å legge til et nytt dagbokinnlegg.
          </Text>
        }
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
    position: "relative",
  },

  actions: {
    marginBottom: theme.spacing.medium,
    gap: theme.spacing.small,
  },

  addButton: {
    width: "100%",
  },

  searchInput: {
    borderWidth: 1,
    borderRadius: theme.borderRadius.medium,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: "#ffffff",
    borderColor: "#d6e0da",
    color: "#2f3b44",
    fontSize: 15,
  },

  filterSection: {
    marginBottom: theme.spacing.small,
  },
  filterLabel: {
    color: theme.colors.darkGrey,
    fontSize: 12,
    fontWeight: "700",
    marginBottom: theme.spacing.small,
  },
  modalTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.small,
  },

  tag: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderRadius: 999,
    backgroundColor: theme.colors.box,
    borderColor: "#d6e0da",
  },

  selectedTag: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },

  tagText: {
    color: "#2e3a33",
    fontSize: 14,
    fontWeight: "600",
  },
  selectedTagText: {
    color: theme.colors.lightText,
  },

  list: {
    paddingBottom: 100,
    paddingTop: theme.spacing.small,
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
    backgroundColor: theme.colors.box,
    borderColor: "#d6e0da",
  },
  empty: {
    color: theme.colors.darkGrey,
    lineHeight: 21,
    paddingHorizontal: theme.spacing.large,
    paddingVertical: 32,
    textAlign: "center",
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
  drinkSummary: {
    alignSelf: "flex-start",
    backgroundColor: "#eef3f8",
    borderColor: "#d6e0ea",
    borderRadius: theme.borderRadius.small,
    borderWidth: 1,
    gap: 8,
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  whiteDrinkSummary: {
    backgroundColor: "#EAF4EE",
    borderColor: theme.colors.primary,
  },
  drinkSummaryHeader: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  drinkSummaryMuted: {
    color: "#64748b",
    fontSize: 12,
    fontWeight: "600",
  },
  drinkSummaryTotal: {
    color: "#1e293b",
    fontSize: 13,
    fontWeight: "800",
  },
  whiteDrinkSummaryText: {
    color: theme.colors.primary,
    fontSize: 13,
    fontWeight: "800",
  },
  drinkBreakdownRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  drinkBreakdownChip: {
    backgroundColor: "#ffffff",
    borderColor: "#d6e0ea",
    borderRadius: 999,
    borderWidth: 1,
    color: "#475569",
    fontSize: 11,
    fontWeight: "700",
    paddingHorizontal: 8,
    paddingVertical: 4,
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
