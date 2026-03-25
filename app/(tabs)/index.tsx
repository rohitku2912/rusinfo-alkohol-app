import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import SavingsCalcModal from "../components/SavingsCalcModal";
import RegularButton from "../components/ui/button";
import FunctionBox from "../components/ui/functionBox";
import theme from "../theme/constantStyling";

export default function Dashboard() {
  const router = useRouter();

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkOnboarding = async () => {
      const completed = await AsyncStorage.getItem("onboardingCompleted");
      if (!completed) {
        router.replace("/onboarding" as any);
      }
    };
    checkOnboarding();
  }, [router]);

  return (
    //outer view
    <View style={styles.outerContainer}>
      <FunctionBox title="SPAREKALKULATOR" description="du har spart:">
        <View>
          <RegularButton title="regn ut" onPress={() => setIsVisible(true)} />
          <Text>9000 på 30 dager</Text>
        </View>
      </FunctionBox>

      <SavingsCalcModal
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        confirmcalculation={() => {}}
      />

      {/* reset onboarding button */}
      <Button
        title="Reset onboarding"
        onPress={async () => {
          await AsyncStorage.clear();
          router.replace("/onboarding" as any);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "yellow",
  },
  functionContainer: {
    width: "95%",
    backgroundColor: "#9BB8A8",
    borderRadius: 30,
    padding: 20,
    alignSelf: "center",
  },
  text: {
    fontSize: 24,
    color: theme.colors.text,
    fontFamily: theme.fonts.heading,
  },
});
