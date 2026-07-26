import {
  getProgramDays,
  getProgramStartDate,
} from "@/lib/storage/onboarding";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import FunctionBox from "../../components/ui/functionBox";
import HelpButton from "../help/HelpButton";
import theme from "@/app/theme/constantStyling";

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
      setDays(getProgramDays(date));
    });
  }, []);

  useEffect(() => {
    if (!startDate) return;
    const id = setInterval(() => setDays(getProgramDays(startDate)), 60_000);
    return () => clearInterval(id);
  }, [startDate]);

  if (!startDate) return null;

  return (
    <FunctionBox
      title="DAGER I PROGRAMMET"
      description="Antall dager siden du startet programmet."
      helpBtn={<HelpButton helpKey="daycounter" />}
    >
      <View style={styles.ringsRow}>
        <Ring value={days} label="Dager" />
      </View>
    </FunctionBox>
  );
}


const styles = StyleSheet.create({
  ringsRow: {
    alignItems: "center",
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
});
