import {
  getProgramDays,
  getProgramStartDate,
} from "@/lib/storage/onboarding";
import { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import FunctionBox from "../../components/ui/functionBox";
import HelpButton from "../help/HelpButton";
import { AppColors, useAppTheme } from "@/app/theme/ThemeProvider";

function Ring({
  value,
  label,
  styles,
}: {
  value: number;
  label: string;
  styles: ReturnType<typeof createStyles>;
}) {
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
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
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
        <Ring value={days} label="Dager" styles={styles} />
      </View>
    </FunctionBox>
  );
}


const createStyles = (colors: AppColors) => StyleSheet.create({
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
    borderColor: colors.primary,
    backgroundColor: "rgba(255,255,255,0.07)",
    alignItems: "center",
    justifyContent: "center",
  },
  ringNumber: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.text,
  },
  ringLabel: {
    fontSize: 12,
    color: colors.text,
    fontWeight: "500",
  },
});
