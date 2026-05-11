import FunctionBox from "@/app/components/ui/functionBox";
import { getOnboardingData } from "@/lib/storage/onboarding";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function PersonalGoal() {
  const [inspiration, setInspiration] = useState<string>("");

  useEffect(() => {
    const loadInspiration = async () => {
      const data = await getOnboardingData();

      const inspirationText = Array.isArray(data.inspiration)
        ? data.inspiration.join(" • ")
        : data.inspiration ?? "";

      setInspiration(inspirationText);
    };

    loadInspiration();
  }, []);

  return (
    <FunctionBox title="Husk hvorfor du ønsker å slutte">
      <View style={styles.container}>
        <View style={styles.goalBox}>
          <Text style={styles.goalText}>
            {inspiration || "Du har ikke valgt inspirasjon enda."}
          </Text>
        </View>
      </View>
    </FunctionBox>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },

  label: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 10,
    lineHeight: 22,
  },

  goalBox: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  goalText: {
    fontSize: 16,
    lineHeight: 26,
    color: "#1F2937",
    fontWeight: "500",
  },
});