import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function Achievements() {
  return (
    <View style={styles.container}>
      <AchievementCard
        title="Første steg!"
        description="Du har tatt det første steget mot en sunnere livsstil ved å laste ned appen!"
        icon=<Text style={{ fontSize: 40 }}>🎉</Text>
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingTop: 40,
    alignItems: "center",
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    width: "90%",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,

    elevation: 3,
  },

  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#EFEFEF",
    justifyContent: "center",
    alignItems: "center",
  },

  textContainer: {
    marginLeft: 12,
    flex: 1,
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
  },

  description: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
});

function AchievementCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <ScrollView
      style={{ width: "100%" }}
      contentContainerStyle={{ alignItems: "center" }}
    >
      <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 16 }}>
        Dine prestasjoner
      </Text>
      <View style={styles.card}>
        <View style={styles.iconContainer}>{icon}</View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
      </View>
      <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 16 }}>
        Kommende prestasjoner
      </Text>
    </ScrollView>
  );
}
