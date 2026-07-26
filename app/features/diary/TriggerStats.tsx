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
      "#7c9a8e",
      "#d28b5f", 
      "#e3b23c",
      "#4fbf9f", 
      "#5b8cfa", 
      "#a07bd3", 
      "#e26aa2", 
      "#2fb8c6", 
      "#8a8f98", 
      "#c97f6b", 
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
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
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
  content: {
    padding: 8,
    paddingBottom: 120,
  },

  card: {
    backgroundColor: "#f6f7f4",
    padding: 22,
    borderRadius: 20,
    marginBottom: 16,
    width: "100%",
  
    borderWidth: 1,
    borderColor: "#d9ded6",
  
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 18,
    color: "#2f3a2f",
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
    opacity: 0.9,
  },

  legendText: {
    fontSize: 14,
    color: "#3f4a3f",
  },

  empty: {
    fontStyle: "italic",
    opacity: 0.6,
    color: "#5c6b5c",
  },
});
