import React from "react";
import { View } from "react-native";
import RegularButton from "../components/ui/button";

type CalcSavingsProps = {
  title: string;
  onPress: () => void;
};

export default function calcSavings({ title, onPress }: CalcSavingsProps) {
  return (
    <View>
      <RegularButton title={title} onPress={onPress} />
    </View>
  );
}
