import { getProgramStartDate } from "@/lib/storage/onboarding";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import FunctionBox from "../../components/ui/functionBox";

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
    >
      <View style={styles.ringsRow}>
        <Ring value={days} label="dager" />
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
    borderColor: "#2E7D32",
    backgroundColor: "rgba(255,255,255,0.07)",
    alignItems: "center",
    justifyContent: "center",
  },
  ringNumber: {
    fontSize: 26,
    fontWeight: "800",
    color: "#f6ede4",
  },
  ringLabel: {
    fontSize: 12,
    color: "#b8a898",
    fontWeight: "500",
  },
});
