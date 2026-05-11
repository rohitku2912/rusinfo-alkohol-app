import FunctionBox from "@/app/components/ui/functionBox";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

const EMERGENCY_PHONE_KEY = "emergency_phone";

export default function CallAFriend() {
  const [phone, setPhone] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const stored = await AsyncStorage.getItem(EMERGENCY_PHONE_KEY);
      if (stored) setPhone(stored);
    };

    load();
  }, []);

  return (
    <FunctionBox
      title="Ring en venn"
      description="Dette er nummeret du har lagret som en trygg kontakt."
    >
      <View style={styles.container}>
        {phone ? (
          <Text style={styles.number}>📞 {phone}</Text>
        ) : (
          <Text style={styles.empty}>Ingen nummer lagra</Text>
        )}
      </View>
    </FunctionBox>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },

  number: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2f3a2f",
    padding: 12,
    borderRadius: 14,
    backgroundColor: "#e6eff7",
    borderWidth: 1,
    borderColor: "#d9ded6",
  },

  empty: {
    fontSize: 14,
    color: "#5c6b5c",
    fontStyle: "italic",
    padding: 12,
    borderRadius: 14,
    backgroundColor: "#f6f7f4",
    borderWidth: 1,
    borderColor: "#d9ded6",
  },
});