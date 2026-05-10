import { ScrollView, StyleSheet, Text, View } from "react-native";
import { PieChart } from "react-native-gifted-charts";


type TriggerEntry = {
  trigger: string;
  protectionFactors: string[];
  count: number;
};

type Props = {
  triggerEntries: TriggerEntry[];
};

export default function TriggerStats({ triggerEntries }: Props) {
  const topTriggers = [...triggerEntries]
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const allFactors = triggerEntries.flatMap((t) => t.protectionFactors);

  const factorMap: Record<string, number> = {};

  allFactors.forEach((factor) => {
    factorMap[factor] = (factorMap[factor] || 0) + 1;
  });

  const topFactors = Object.entries(factorMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const colors = [
  "#f87171", 
  "#fb923c",
  "#fbbf24", 
  "#34d399", 
  "#60a5fa", 
  "#a78bfa", 
  "#f472b6",
  "#22d3ee", 
  "#94a3b8", 
  "#fda4af",
];

  const triggerPieData = topTriggers.map((item, index) => ({
    value: item.count,
    color: colors[index % colors.length],
    text: item.trigger,
  }));

  const factorPieData = topFactors.map((item, index) => ({
    value: item.count,
    color: colors[index % colors.length],
    text: item.name,
  }));

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 8 }}>
      {/* triggere */}
      <View style={styles.card}>
        <Text style={styles.title}>Mest registrerte triggere</Text>

        {triggerPieData.length === 0 ? (
          <Text style={styles.empty}>Ingen data enda</Text>
        ) : (
          <View style={styles.center}>
            <PieChart
              data={triggerPieData}
              radius={120}
              innerRadius={60}
              showText={false}
            />

            <View style={styles.legend}>
              {triggerPieData.map((item, index) => (
                <View key={index} style={styles.legendRow}>
                  <View style={[styles.dot, { backgroundColor: item.color }]} />
                  <Text style={styles.legendText}>{item.text}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>

      {/* beskyttelsesfaktorer */}
      <View style={styles.card}>
        <Text style={styles.title}>Mest registrerte beskyttelsesfaktorer</Text>

        {factorPieData.length === 0 ? (
          <Text style={styles.empty}>Ingen data enda</Text>
        ) : (
          <View style={styles.center}>
            <PieChart
              data={factorPieData}
              radius={120}
              innerRadius={60}
              showText={false}
            />

            <View style={styles.legend}>
              {factorPieData.map((item, index) => (
                <View key={index} style={styles.legendRow}>
                  <View style={[styles.dot, { backgroundColor: item.color }]} />
                  <Text style={styles.legendText}>{item.text}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {},

  card: {
    backgroundColor: "#fff",
    padding: 22,
    borderRadius: 20,
    marginBottom: 16,
  
    elevation: 3,
    width: "100%",
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 18,
    color: "#111827",
  },

  center: {
    alignItems: "center",
  },

  legend: {
    marginTop: 18,
    width: "100%",
  },

  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },

  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },

  legendText: {
    fontSize: 14,
    color: "#374151",
  },

  empty: {
    fontStyle: "italic",
    opacity: 0.6,
  },
});
