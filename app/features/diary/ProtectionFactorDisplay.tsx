import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import InputBox from "../../components/ui/inputBox";
import theme from "../../theme/constantStyling";

type TriggerEntry = {
  trigger: string;
  protectionFactors: string[];
  count: number;
};

type Props = {
  triggerEntries: TriggerEntry[];

  onDelete: (factor: string) => void;
};

type Item = {
  factor: string;
  trigger: string;
};

export default function ProtectionFactorList({
  triggerEntries,
  onDelete,
}: Props) {
  const [searchText, setSearchText] = useState("");

  const allProtectionFactors: Item[] = Array.from(
    new Map(
      triggerEntries.flatMap((entry) =>
        entry.protectionFactors.map((factor) => [
          factor.trim().toLowerCase(),
          { factor, trigger: entry.trigger },
        ]),
      ),
    ).values(),
  );

  const filteredProtectionFactors = allProtectionFactors.filter((item) =>
    item.factor.toLowerCase().includes(searchText.toLowerCase()),
  );

  const renderItem = ({ item }: { item: Item }) => (
    <View style={styles.protectionCard}>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onDelete(item.factor)}
      >
        <Ionicons name="trash-outline" size={18} color="red" />
      </TouchableOpacity>
      <Text style={styles.protectionFactorText}>{item.factor}</Text>
    </View>
  );

  return (
    <>
      <View style={styles.searchRow}>
        <View style={styles.searchInputWrapper}>
          <InputBox
            variant="tag"
            style={styles.searchInput}
            placeholder="Søk i beskyttelsesfaktorer..."
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>
      {allProtectionFactors.length === 0 && (
        <Text style={styles.empty}>
          Ingen beskyttelsesfaktorer registrert enda.
        </Text>
      )}
      <FlatList
        data={filteredProtectionFactors}
        keyExtractor={(item) => `${item.trigger}-${item.factor}`}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </>
  );
}

const styles = StyleSheet.create({
  list: {
    marginTop: 10,
    gap: 10,
  },
  protectionCard: {
    backgroundColor: "#f5f7ff",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginBottom: 8,
  },
  protectionFactorText: {
    fontSize: 16,
    color: "#1f2937",
    marginBottom: 4,
  },
  triggerLabel: {
    fontSize: 12,
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
    top: 8,
    right: 14,
    backgroundColor: "#fff1f2",
    padding: 8,
    borderRadius: 999,
  },
});
