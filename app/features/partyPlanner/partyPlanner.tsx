import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function PartyPlanner() {
  const [beerCount, setBeerCount] = useState(0);
  const [wineCount, setWineCount] = useState(0);
  const [drinkCount, setDrinkCount] = useState(0);

  function addBeer() {
    setBeerCount(beerCount + 1);
  }
  function subBeer() {
    setBeerCount(beerCount - 1);
  }
  function addWine() {
    setWineCount(wineCount + 1);
  }
  function subWine() {
    setWineCount(wineCount - 1);
  }
  function addDrink() {
    setDrinkCount(drinkCount + 1);
  }
  function subDrink() {
    setDrinkCount(drinkCount - 1);
  }

  return (
    <View style={styles.container}>
      <Text>PLanlegg Festen</Text>
      <Text>legg til</Text>

      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text>øl</Text>
        <Pressable onPress={addBeer}>
          <Text>+</Text>
        </Pressable>
        <Text>{beerCount}</Text>
        <Pressable onPress={subBeer}>
          <Text>-</Text>
        </Pressable>
      </View>

      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text>vin</Text>
        <Pressable onPress={addWine}>
          <Text>+</Text>
        </Pressable>
        <Text>{wineCount}</Text>
        <Pressable onPress={subWine}>
          <Text>-</Text>
        </Pressable>
      </View>

      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text>drinker</Text>
        <Pressable onPress={addDrink}>
          <Text>+</Text>
        </Pressable>
        <Text>{drinkCount}</Text>
        <Pressable onPress={subDrink}>
          <Text>-</Text>
        </Pressable>
      </View>
      <Pressable>
        <Text>start fest </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#bfbfbf",
    borderRadius: 10,
    padding: 20,
    margin: 10,
  },
});
