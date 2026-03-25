import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";
import theme from "../theme/constantStyling";

const ageGroups = ["Under 18", "18-20", "21-25", "26-30", "31-40", "41+"];
const genders = ["Mann", "Kvinne", "Ikke-binær", "Vil ikke oppgi"];
const counties = [
  "Oslo",
  "Viken",
  "Innlandet",
  "Vestfold og Telemark",
  "Agder",
  "Rogaland",
  "Vestland",
  "Møre og Romsdal",
  "Trøndelag",
  "Nordland",
  "Troms og Finnmark",
];

export default function Info() {
  const router = useRouter();
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [county, setCounty] = useState("");
  const [showAge, setShowAge] = useState(false);
  const [showGender, setShowGender] = useState(false);
  const [showCounty, setShowCounty] = useState(false);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Fyll inn din informasjon</Text>

      {/* Age */}
      <TouchableOpacity style={styles.row} onPress={() => setShowAge(!showAge)}>
        <Text style={styles.label}>Alder</Text>
        <Text style={styles.select}>{age || "velg ▾"}</Text>
      </TouchableOpacity>
      {showAge &&
        ageGroups.map((a) => (
          <TouchableOpacity
            key={a}
            style={styles.option}
            onPress={() => {
              setAge(a);
              setShowAge(false);
            }}
          >
            <Text style={styles.optionText}>{a}</Text>
          </TouchableOpacity>
        ))}

      {/* Gender */}
      <TouchableOpacity
        style={styles.row}
        onPress={() => setShowGender(!showGender)}
      >
        <Text style={styles.label}>Kjønn</Text>
        <Text style={styles.select}>{gender || "velg ▾"}</Text>
      </TouchableOpacity>
      {showGender &&
        genders.map((g) => (
          <TouchableOpacity
            key={g}
            style={styles.option}
            onPress={() => {
              setGender(g);
              setShowGender(false);
            }}
          >
            <Text style={styles.optionText}>{g}</Text>
          </TouchableOpacity>
        ))}

      {/* County */}
      <TouchableOpacity
        style={styles.row}
        onPress={() => setShowCounty(!showCounty)}
      >
        <Text style={styles.label}>Fylke</Text>
        <Text style={styles.select}>{county || "velg ▾"}</Text>
      </TouchableOpacity>
      {showCounty &&
        counties.map((c) => (
          <TouchableOpacity
            key={c}
            style={styles.option}
            onPress={() => {
              setCounty(c);
              setShowCounty(false);
            }}
          >
            <Text style={styles.optionText}>{c}</Text>
          </TouchableOpacity>
        ))}

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/onboarding/goal" as any)}
      >
        <Text style={styles.buttonText}>straks klar →</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.large,
    paddingTop: 60,
    backgroundColor: theme.colors.background,
    flexGrow: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: theme.spacing.large,
    color: theme.colors.text,
    fontFamily: theme.fonts.heading,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#e8e8e3",
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.medium,
    marginBottom: theme.spacing.small,
  },
  label: { fontSize: 16, color: theme.colors.text },
  select: { fontSize: 14, color: "#666" },
  option: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: theme.borderRadius.small,
    marginBottom: 6,
    paddingLeft: theme.spacing.large,
  },
  optionText: { color: theme.colors.text },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.medium,
    alignItems: "center",
    marginTop: 32,
    alignSelf: "center",
    paddingHorizontal: 32,
  },
  buttonText: { fontSize: 16, color: "#fff" },
});
