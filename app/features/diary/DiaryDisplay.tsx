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
import DateFilter from "../../components/ui/DateFilter";
import SearchInput from "../../components/ui/SearchInput";
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
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
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
        <View style={[styles.drinkSummary, styles.emptyDrinkSummary]}>
          <View style={styles.drinkSummaryHeader}>
            <View style={styles.drinkSummaryIcon}>
              <Ionicons name="remove" size={15} color="#64748b" />
            </View>
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
            <View
              style={[styles.drinkSummaryIcon, styles.whiteDrinkSummaryIcon]}
            >
              <Ionicons
                name="checkmark"
                size={15}
                color={theme.colors.primary}
              />
            </View>
            <View style={styles.drinkSummaryHeading}>
              <Text style={styles.whiteDrinkSummaryText}>Hvit dag</Text>
              <Text style={styles.drinkSummaryCaption}>
                Ingen alkohol registrert
              </Text>
            </View>
          </View>
        </View>
      );
    }

    const totalDrinks = getTotalDrinks(drinkLog);

    return (
      <View style={styles.drinkSummary}>
        <View style={styles.drinkSummaryHeader}>
          <View style={styles.drinkSummaryIcon}>
            <Ionicons name="wine-outline" size={16} color="#475569" />
          </View>
          <View style={styles.drinkSummaryHeading}>
            <Text style={styles.drinkSummaryTitle}>Drikkelogg</Text>
            <Text style={styles.drinkSummaryCaption}>Registrert denne dagen</Text>
          </View>
          <View style={styles.drinkTotalPill}>
            <Text style={styles.drinkSummaryTotal}>{totalDrinks}</Text>
            <Text style={styles.drinkTotalUnit}>
              {totalDrinks === 1 ? "enhet" : "enheter"}
            </Text>
          </View>
        </View>
        <View style={styles.drinkBreakdownRow}>
          <View style={styles.drinkBreakdownChip}>
            <Text style={styles.drinkBreakdownLabel}>Øl</Text>
            <Text style={styles.drinkBreakdownValue}>{drinkLog.beerCount}</Text>
          </View>
          <View style={styles.drinkBreakdownChip}>
            <Text style={styles.drinkBreakdownLabel}>Vin</Text>
            <Text style={styles.drinkBreakdownValue}>{drinkLog.wineCount}</Text>
          </View>
          <View style={styles.drinkBreakdownChip}>
            <Text style={styles.drinkBreakdownLabel}>Drinker</Text>
            <Text style={styles.drinkBreakdownValue}>
              {drinkLog.drinksCount}
            </Text>
          </View>
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
        <SearchInput
          placeholder="Søk i dagboken..."
          value={searchText}
          onChangeText={setSearchText}
        />
        <DateFilter value={selectedDate} onChange={setSelectedDate} />
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
          filteredEntries.length > 0 || searchText || selectedDate
            ? entries.filter((e) => {
                const matchesTags =
                  filteredEntries.length === 0 ||
                  e.tags.some((t) => filteredEntries.includes(t));

                const matchesSearch =
                  !searchText ||
                  e.text.toLowerCase().includes(searchText.toLowerCase()) ||
                  new Date(e.date)
                    .toLocaleDateString("nb-NO")
                    .includes(searchText);

                const matchesDate =
                  !selectedDate ||
                  createDateKey(new Date(e.date)) ===
                    createDateKey(selectedDate);

                return matchesTags && matchesSearch && matchesDate;
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
    alignSelf: "stretch",
    backgroundColor: "#eef3f8",
    borderColor: "#d6e0ea",
    borderRadius: theme.borderRadius.medium,
    borderWidth: 1,
    gap: 10,
    marginTop: 10,
    padding: 12,
  },
  emptyDrinkSummary: {
    backgroundColor: "#f7f9fb",
  },
  whiteDrinkSummary: {
    backgroundColor: "#EAF4EE",
    borderColor: "rgba(94, 156, 118, 0.45)",
  },
  drinkSummaryHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: 9,
  },
  drinkSummaryIcon: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 17,
    height: 34,
    justifyContent: "center",
    width: 34,
  },
  whiteDrinkSummaryIcon: {
    backgroundColor: "#ffffff",
  },
  drinkSummaryHeading: {
    flex: 1,
  },
  drinkSummaryTitle: {
    color: "#1e293b",
    fontSize: 13,
    fontWeight: "800",
  },
  drinkSummaryCaption: {
    color: "#64748b",
    fontSize: 10,
    marginTop: 1,
  },
  drinkSummaryMuted: {
    color: "#64748b",
    fontSize: 12,
    fontWeight: "600",
  },
  drinkSummaryTotal: {
    color: "#1e293b",
    fontSize: 16,
    fontWeight: "800",
  },
  drinkTotalPill: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 10,
    minWidth: 54,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  drinkTotalUnit: {
    color: "#64748b",
    fontSize: 9,
    fontWeight: "600",
  },
  whiteDrinkSummaryText: {
    color: theme.colors.primary,
    fontSize: 13,
    fontWeight: "800",
  },
  drinkBreakdownRow: {
    flexDirection: "row",
    gap: 6,
  },
  drinkBreakdownChip: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderColor: "#d6e0ea",
    borderRadius: 9,
    borderWidth: 1,
    flex: 1,
    paddingHorizontal: 6,
    paddingVertical: 7,
  },
  drinkBreakdownLabel: {
    color: "#475569",
    fontSize: 9,
    fontWeight: "600",
  },
  drinkBreakdownValue: {
    color: "#1e293b",
    fontSize: 14,
    fontWeight: "700",
    marginTop: 1,
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
