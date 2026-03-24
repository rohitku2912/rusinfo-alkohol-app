import React from "react";
import { View } from "react-native";
import RegularButton from "./components/ui/button";
import FunctionBox from "./components/ui/functionBox";

export default function Drikkelogg() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <RegularButton
        title="Logg drikke"
        onPress={() => {
          console.log("Drikke logget!");
        }}
      />
      <FunctionBox
        title="Logg drikke"
        description="Logg din drikke og se hvor mye du har drikket"
        onPress={() => {
          console.log("Drikke logget!");
        }}
      />
    </View>
  );
}
