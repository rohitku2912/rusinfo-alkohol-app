import { StyleSheet, Text, View } from "react-native";
import RegularButton from "../../components/ui/button";
import { DrinkType } from "./SavingsCalcModal";

type Props = {
  onSelect: (type: DrinkType) => void;
  onClose: () => void;
};

export default function MenuScreen({ onSelect, onClose }: Props) {
  return (
    <>
      <Text style={styles.header}>SPAREKALKULATOR</Text>

      <Text style={styles.body}>
        Velg en type drikke å legge til i kalkulatoren
      </Text>

      <View style={styles.buttons}>
        <RegularButton title="Øl" onPress={() => onSelect("ØL")} />
        <RegularButton title="Vin" onPress={() => onSelect("VIN")} />
        <RegularButton
          title="Brennevin"
          onPress={() => onSelect("BRENNEVIN")}
        />
      </View>

      <RegularButton title="Lukk" onPress={onClose} />
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  body: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
  },
});
