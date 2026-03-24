import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import FunctionBox from "../components/ui/functionBox";
import { theme } from "../theme/constantStyling";

export default function Diary() {
  return (
    <ScrollView style={styles.outerBox}>
      <View>
        <FunctionBox
          title="Logg drikke"
          description="Logg din drikke og se hvor mye du har drukket"
          onPress={() => {
            console.log("Drikke logget!");
          }}
        />
        <FunctionBox
          title="Logg drikke"
          description="Logg din drikke og se hvor mye du har drukket"
          onPress={() => {
            console.log("Drikke logget!");
          }}
        />{" "}
        <FunctionBox
          title="Logg drikke"
          description="Logg din drikke og se hvor mye du har drukket"
          onPress={() => {
            console.log("Drikke logget!");
          }}
        />
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  outerBox: {
    marginTop: theme.spacing.small,
  },
});
