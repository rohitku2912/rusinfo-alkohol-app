import { getProgramStartDate } from "@/lib/storage/onboarding";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import FunctionBox from "../../components/ui/functionBox";
import HelpButton from "../help/HelpButton";
import theme from "@/app/theme/constantStyling";

const START_KEY = "program_start_date";


function getDays(start: Date): number {
  return Math.floor((Date.now() - start.getTime()) / 86_400_000);
}

function Ring({ value, label }: { value: number; label: string }) {
  return (
    <View style={styles.ringWrap}>
      <View style={styles.ring}>
        <Text style={styles.ringNumber}>{value}</Text>
      </View>
      <Text style={styles.ringLabel}>{label}</Text>
    </View>
  );
}

export default function ProgramTimer() {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [days, setDays] = useState(0);

  const resetProgram = async () => {
    const now = new Date();
  
    await AsyncStorage.setItem(START_KEY, now.toISOString());
  
    setStartDate(now);
    setDays(0);
  };

  useEffect(() => {
    getProgramStartDate().then((date) => {
      if (!date) return;
      setStartDate(date);
      setDays(getDays(date));
    });
  }, []);

  useEffect(() => {
    if (!startDate) return;
    const id = setInterval(() => setDays(getDays(startDate)), 60_000);
    return () => clearInterval(id);
  }, [startDate]);

  if (!startDate) return null;

  return (
    <FunctionBox
      title="TID SIDEN DU STARTET"
      description="Din reise så langt"
      helpBtn={<HelpButton helpKey="daycounter"/>}
    >
      <TouchableOpacity style={styles.resetButton} onPress={resetProgram}>
  <Text style={styles.resetText}>Nullstill</Text>
</TouchableOpacity>
      <View style={styles.ringsRow}>
        <Ring value={days} label="Dager" />
      </View>
    </FunctionBox>
  );
}


const styles = StyleSheet.create({
  ringsRow: {
    alignItems: "center",
    marginTop: 16,
  },
  ringWrap: {
    alignItems: "center",
    gap: 8,
  },
  ring: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 2.5,
    borderColor: theme.colors.button,
    backgroundColor: "rgba(255,255,255,0.07)",
    alignItems: "center",
    justifyContent: "center",
  },
  ringNumber: {
    fontSize: 26,
    fontWeight: "800",
    color: theme.colors.text,
  },
  ringLabel: {
    fontSize: 12,
    color: theme.colors.text,
    fontWeight: "500",
  },
  resetButton: {
    marginTop: 10,
    alignSelf: "flex-end",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: "rgba(47, 79, 163, 0.12)",
  },
  
  resetText: {
    color: "#2F4FA3",
    fontWeight: "600",
    fontSize: 12,
  },
});
