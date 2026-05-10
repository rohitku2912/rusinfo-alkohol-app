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
import theme from "../../theme/constantStyling";
import HelpButton from "../help/HelpButton";
import ProtectionFactorList from "./ProtectionFactorDisplay";
import RegisterTriggerModal from "./RegisterTriggerModal";
import TriggerStats from "./TriggerStats";

const TRIGGERS_STORAGE_KEY = "trigger_display_all_triggers";
const TRIGGER_ENTRIES_STORAGE_KEY = "trigger_display_entries";

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

  const [allTriggers, setAllTriggers] = useState<string[]>([
    "Stress",
    "Sosiale situasjoner",
    "Kjedsomhet",
    "Ensomhet",
    "Bursdager",
    "Fester",
    "Tankekjør",
  ]);

  const [triggerEntries, setTriggerEntries] = useState<TriggerEntry[]>([]);

  const [selectedFilter, setSelectedFilter] = useState<
    "triggere" | "beskyttelsesfaktorer" | "oversikt"
  >("triggere");

  useEffect(() => {
    const loadTriggerData = async () => {
      try {
        const storedTriggers = await AsyncStorage.getItem(TRIGGERS_STORAGE_KEY);
        const storedEntries = await AsyncStorage.getItem(
          TRIGGER_ENTRIES_STORAGE_KEY,
        );

        if (storedTriggers) {
          setAllTriggers(JSON.parse(storedTriggers));
        }

        if (storedEntries) {
          setTriggerEntries(JSON.parse(storedEntries));
        }
      } catch (error) {
        console.warn("Failed to load trigger data", error);
      }
    };

    loadTriggerData();
  }, []);

  useEffect(() => {
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
  }, [allTriggers, triggerEntries]);

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

  const deleteProtectionFactor = (factor: string) => {
    Alert.alert("Slett", "Vil du slette denne?", [
      { text: "Avbryt", style: "cancel" },
      {
        text: "Slett",
        style: "destructive",
        onPress: () => {
          setTriggerEntries((prev) =>
            prev.map((entry) => ({
              ...entry,
              protectionFactors: entry.protectionFactors.filter(
                (f) => f !== factor,
              ),
            })),
          );
        },
      },
    ]);
  };

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
      <HelpButton helpKey="trigger"/>
      <TouchableOpacity
        onPress={async () => {
          await AsyncStorage.removeItem(TRIGGERS_STORAGE_KEY);
          await AsyncStorage.removeItem(TRIGGER_ENTRIES_STORAGE_KEY);

          setAllTriggers([
            "Stress",
            "Sosiale situasjoner",
            "Kjedsomhet",
            "Ensomhet",
            "Bursdager",
            "Fester",
            "Tankekjør",
          ]);

          setTriggerEntries([]);
        }}
        style={{ marginBottom: 10 }}
      ></TouchableOpacity>
      
      {/* filter */}
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedFilter === "triggere" && styles.selectedFilter,
          ]}
          onPress={() => setSelectedFilter("triggere")}
        >
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
            selectedFilter === "beskyttelsesfaktorer" && styles.selectedFilter,
          ]}
          onPress={() => setSelectedFilter("beskyttelsesfaktorer")}
        >
          <Text
            style={[
              styles.filterText,
              selectedFilter === "beskyttelsesfaktorer" &&
                styles.selectedFilterText,
            ]}
          >
            Beskyttelsesfaktorer
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedFilter === "oversikt" && styles.selectedFilter,
          ]}
          onPress={() => setSelectedFilter("oversikt")}
        >
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
        <View style={styles.searchRow}>
          <View style={styles.searchInputWrapper}>
            <InputBox
              variant="tag"
              style={styles.searchInput}
              placeholder="Søk i triggere..."
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
          

          <View style={styles.addButtonWrapper}>
            <RegularButton
              title="+ Registrer"
              onPress={() => setModalVisible(true)}
            />
          </View>
        </View>
      )}

      {/* Liste */}
      {selectedFilter === "triggere" && (
        <FlatList
          data={filteredTriggers}
          keyExtractor={(item) => item.trigger}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text style={styles.empty}>Ingen valgte triggere</Text>
          }
          contentContainerStyle={{ gap: 10, marginTop: 10 }}
          showsVerticalScrollIndicator={false}
        />
        
      )}

      {selectedFilter === "beskyttelsesfaktorer" && (
        <ProtectionFactorList
          triggerEntries={triggerEntries}
          onDelete={deleteProtectionFactor}
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
            current.includes(trigger) ? current : [...current, trigger],
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
    padding: 20,
    flex: 1,
    position: "relative"
  },

  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 15,
    color: theme.colors.text,
  },

  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 15,
  },

  filterButton: {
    padding: 8,
    borderWidth: 1,
    borderRadius: 20,
    marginRight: 8,
    borderColor: "#e2e8f0",
    backgroundColor: "#f8fafc",
  },

  selectedFilter: {
    backgroundColor: "#a1aaf7",
    borderColor: "#a1aaf7",
  },

  filterText: {
    color: theme.colors.text,
  },

  selectedFilterText: {
    color: theme.colors.text,
  },

  list: {
    marginTop: 10,
    gap: 10,
  },

  card: {
    backgroundColor: "#f5f7ff",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  cardContent: {
    flex: 1,
    marginRight: 10,
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
    color: "#1f2937",
    marginBottom: 8,
  },

  triggerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },

  countText: {
    fontSize: 12,
    color: "#6b7280",
    fontStyle: "italic",
    top: 6,
    right: 24,
  },

  protectionText: {
    fontSize: 14,
    color: "#475569",
    marginBottom: 4,
  },

  noProtections: {
    fontSize: 14,
    color: "#6b7280",
    fontStyle: "italic",
  },

  empty: {
    opacity: 0.5,
    marginTop: 10,
    fontStyle: "italic",
  },

  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    width: "100%",
  },

  searchInputWrapper: {
    flex: 1,
    marginRight: 10,
  },

  searchInput: {
    borderWidth: 1,
    borderColor: theme.colors.text,
    borderRadius: 20,
    padding: 8,
    backgroundColor: theme.colors.background,
    color: theme.colors.text,
  },

  addButtonWrapper: {
    minWidth: 110,
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
