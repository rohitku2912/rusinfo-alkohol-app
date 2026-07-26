import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
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
import theme from "../../theme/constantStyling";
import RegisterTriggerModal from "./RegisterTriggerModal";
import TriggerStats from "./TriggerStats";

const TRIGGERS_STORAGE_KEY = "trigger_display_all_triggers";
const TRIGGER_ENTRIES_STORAGE_KEY = "trigger_display_entries";

const oldDefaultTriggers = [
  "Stress",
  "Sosiale situasjoner",
  "Kjedsomhet",
  "Ensomhet",
  "Bursdager",
  "Fester",
  "Tankekjør",
];

const defaultTriggers = [
  "Ingenting",
  "Stress",
  "Sug etter alkohol",
  "Sosialt press",
  "Fest eller feiring",
  "Konflikt eller krangling",
  "Vanskelige følelser",
  "Kjedsomhet",
  "Ensomhet",
  "Sliten eller lite søvn",
  "Etter jobb",
  "Helg",
  "Lønn eller penger tilgjengelig",
  "Steder eller personer forbundet med drikking",
];

function putNothingFirst(items: string[]) {
  return [
    ...items.filter((item) => item === "Ingenting"),
    ...items
      .filter((item) => item !== "Ingenting")
      .sort((a, b) => a.localeCompare(b, "nb-NO")),
  ];
}

type TriggerEntry = {
  trigger: string;
  protectionFactors: string[];
  count: number;
};

export default function TriggerDisplay() {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [protectionText, setProtectionText] = useState("");
  const [selectedTrigger, setSelectedTrigger] = useState<string | null>(null);

  const [allTriggers, setAllTriggers] = useState<string[]>(defaultTriggers);

  const [triggerEntries, setTriggerEntries] = useState<TriggerEntry[]>([]);
  const [hasLoadedTriggerData, setHasLoadedTriggerData] = useState(false);

  const [selectedFilter, setSelectedFilter] = useState<
    "triggere" | "oversikt"
  >("triggere");

  useFocusEffect(
    useCallback(() => {
      const loadTriggerData = async () => {
      try {
        const storedTriggers = await AsyncStorage.getItem(TRIGGERS_STORAGE_KEY);
        const storedEntries = await AsyncStorage.getItem(
          TRIGGER_ENTRIES_STORAGE_KEY,
        );

        if (storedTriggers) {
          const savedTriggers = JSON.parse(storedTriggers) as string[];
          const customTriggers = savedTriggers.filter(
            (trigger) =>
              !defaultTriggers.includes(trigger) &&
              !oldDefaultTriggers.includes(trigger),
          );

          setAllTriggers(putNothingFirst([...defaultTriggers, ...customTriggers]));
        } else {
          setAllTriggers(defaultTriggers);
        }

        if (storedEntries) {
          setTriggerEntries(JSON.parse(storedEntries));
        } else {
          setTriggerEntries([]);
        }

        setHasLoadedTriggerData(true);
      } catch (error) {
        console.warn("Failed to load trigger data", error);
      }
      };

      void loadTriggerData();
    }, []),
  );

  useEffect(() => {
    if (!hasLoadedTriggerData) return;

    const persistTriggerData = async () => {
      try {
        await AsyncStorage.setItem(
          TRIGGERS_STORAGE_KEY,
          JSON.stringify(allTriggers),
        );
        await AsyncStorage.setItem(
          TRIGGER_ENTRIES_STORAGE_KEY,
          JSON.stringify(triggerEntries),
        );
      } catch (error) {
        console.warn("Failed to save trigger data", error);
      }
    };

    persistTriggerData();
  }, [allTriggers, hasLoadedTriggerData, triggerEntries]);

  const handleTriggerSelect = (trigger: string | null) => {
    setSelectedTrigger(trigger);
    setProtectionText("");
  };

  const deleteTrigger = (trigger: string) => {
    Alert.alert("Slett trigger", "Vil du slette denne triggeren?", [
      { text: "Avbryt", style: "cancel" },
      {
        text: "Slett",
        style: "destructive",
        onPress: () => {
          setTriggerEntries((prev) =>
            prev.filter((entry) => entry.trigger !== trigger),
          );

          setAllTriggers((prev) => prev.filter((t) => t !== trigger));
        },
      },
    ]);
  };

  const handleBackFromProtectionFactors = () => {
    setSelectedTrigger(null);
  };

  const ensureEntry = (trigger: string, value: string) => {
    setTriggerEntries((current) => {
      const exists = current.some((t) => t.trigger === trigger);

      if (!exists) {
        return [
          ...current,
          {
            trigger,
            protectionFactors: [value],
            count: 1,
          },
        ];
      }

      return current.map((entry) =>
        entry.trigger === trigger
          ? {
              ...entry,
              protectionFactors: entry.protectionFactors.includes(value)
                ? entry.protectionFactors
                : [...entry.protectionFactors, value],
              count: entry.count + 1,
            }
          : entry,
      );
    });
  };

  const handleAddFromInput = () => {
    if (!selectedTrigger || !protectionText.trim()) return;

    const value = protectionText.trim();

    ensureEntry(selectedTrigger, value);

    setProtectionText("");
    setSelectedTrigger(null);
    setModalVisible(false);
  };

  const handleAddFromSuggestion = (text: string) => {
    if (!selectedTrigger) return;

    const value = text.trim();

    ensureEntry(selectedTrigger, value);

    setProtectionText("");
    setSelectedTrigger(null);
    setModalVisible(false);
  };

  const filteredTriggers = triggerEntries.filter((entry) =>
    entry.trigger.toLowerCase().includes(searchText.toLowerCase()),
  );

  const renderItem = ({ item }: { item: TriggerEntry }) => (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteTrigger(item.trigger)}
      >
        <Ionicons name="trash-outline" size={18} color="red" />
      </TouchableOpacity>
      <View style={styles.cardContent}>
        <View style={styles.triggerHeader}>
          <Text style={styles.cardText}>{item.trigger}</Text>
          <Text style={styles.countText}>{item.count} registrert</Text>
        </View>

        {item.protectionFactors.length === 0 ? (
          <Text style={styles.noProtections}>
            Ingen beskyttelsesfaktorer enda
          </Text>
        ) : (
          item.protectionFactors.map((factor, index) => (
            <Text key={index} style={styles.protectionText}>
              • {factor}
            </Text>
          ))
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* filter */}
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedFilter === "triggere" && styles.selectedFilter,
          ]}
          onPress={() => setSelectedFilter("triggere")}
        >
          <Ionicons
            name="flash-outline"
            size={17}
            color={
              selectedFilter === "triggere"
                ? theme.colors.primary
                : theme.colors.text
            }
          />
          <Text
            style={[
              styles.filterText,
              selectedFilter === "triggere" && styles.selectedFilterText,
            ]}
          >
            Triggere
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedFilter === "oversikt" && styles.selectedFilter,
          ]}
          onPress={() => setSelectedFilter("oversikt")}
        >
          <Ionicons
            name="pie-chart-outline"
            size={17}
            color={
              selectedFilter === "oversikt"
                ? theme.colors.primary
                : theme.colors.text
            }
          />
          <Text
            style={[
              styles.filterText,
              selectedFilter === "oversikt" && styles.selectedFilterText,
            ]}
          >
            Oversikt
          </Text>
        </TouchableOpacity>
      </View>

      {/* søk + knapp */}
      {selectedFilter === "triggere" && (
        <View style={styles.actions}>
          <RegularButton
            title="+ Registrer trigger"
            onPress={() => setModalVisible(true)}
            style={styles.addButton}
          />
          <InputBox
            variant="tag"
            style={styles.searchInput}
            placeholder="Søk i triggere..."
            value={searchText}
            onChangeText={setSearchText}
            returnKeyType="search"
          />
        </View>
      )}

      {/* Liste */}
      {selectedFilter === "triggere" && (
        <FlatList
          data={filteredTriggers}
          keyExtractor={(item) => item.trigger}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text style={styles.empty}>
              Du har ikke registrert noen triggere enda. Trykk på +Registrer
              for å legge til en ny trigger.
            </Text>
          }
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}

      {selectedFilter === "oversikt" && (
        <TriggerStats triggerEntries={triggerEntries} />
      )}

      {/* registrer triggermodal */}
      <RegisterTriggerModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setSelectedTrigger(null);
          setProtectionText("");
        }}
        allTriggers={allTriggers}
        onAddTrigger={(trigger) => {
          setAllTriggers((current) =>
            current.includes(trigger)
              ? current
              : putNothingFirst([...current, trigger]),
          );
        }}
        triggerEntries={triggerEntries}
        selectedTrigger={selectedTrigger}
        protectionText={protectionText}
        onSetProtectionText={setProtectionText}
        onSelectTrigger={handleTriggerSelect}
        onAddProtectionFactor={handleAddFromInput}
        onAddProtectionFactorWithText={handleAddFromSuggestion}
        onBack={handleBackFromProtectionFactors}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },

  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 15,
    color: theme.colors.lightText,
  },

  filterRow: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.medium,
    flexDirection: "row",
    marginBottom: theme.spacing.medium,
    padding: 4,
  },

  selectedFilter: {
    backgroundColor: "#EAF4EE",
  },

  filterButton: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    gap: 5,
    justifyContent: "center",
    minHeight: 44,
    paddingHorizontal: 6,
    paddingVertical: 8,
    borderRadius: theme.borderRadius.small,
  },

  filterText: {
    color: "#2f3b44",
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
  },

  selectedFilterText: {
    color: theme.colors.primary,
  },
  list: {
    gap: theme.spacing.small,
    paddingBottom: 100,
    paddingTop: theme.spacing.small,
  },

  card: {
    backgroundColor: theme.colors.box,
    padding: 18,
    borderRadius: theme.borderRadius.medium,
    borderWidth: 1,
    borderColor: "#d6e0da",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 4,
  },

  cardContent: {
    flex: 1,
    paddingRight: 38,
  },

  editBtn: {
    padding: 6,
  },

  editText: {
    fontSize: 16,
    color: "#4f46e5",
  },

  cardText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2f3b44",
  },

  triggerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },

  countText: {
    fontSize: 12,
    color: "#5c6b76",
    fontWeight: "600",
  },

  protectionText: {
    fontSize: 14,
    color: "#3f4f5a",
  },

  noProtections: {
    fontSize: 14,
    color: "#6b7280",
    fontStyle: "italic",
  },

  empty: {
    color: theme.colors.darkGrey,
    lineHeight: 21,
    paddingHorizontal: theme.spacing.large,
    paddingVertical: 32,
    textAlign: "center",
  },

  actions: {
    gap: 10,
    marginBottom: theme.spacing.medium,
  },

  addButton: {
    width: "100%",
  },

  searchInput: {
    borderWidth: 1,
    borderColor: "#d6e0da",
    borderRadius: theme.borderRadius.medium,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: theme.colors.box,
    color: theme.colors.text,
    fontSize: 15,
  },

  deleteButton: {
    position: "absolute",
    top: 14,
    right: 14,
    backgroundColor: "#fff1f2",
    padding: 8,
    borderRadius: 999,
  },
});
