import AppModal from "@/app/components/ui/modal";
import theme from "@/app/theme/constantStyling";
import {
  DrinkLogEntry,
  getLogsForThisWeek,
  getTotalDrinks,
  getWhiteDayCount,
} from "@/lib/storage/drinkLogs";
import { collectGoals, saveGoals } from "@/lib/storage/goals";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import Feather from "@expo/vector-icons/Feather";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  logs: DrinkLogEntry[];
};

export default function Goals(props: Props) {
  const [showModal, setShowModal] = useState(false);
  const [maxDrinkUnitsGoal, setMaxDrinkUnitsGoal] = useState(5);
  const [whiteDaysGoal, setWhiteDaysGoal] = useState(5);

  useEffect(() => {
    async function loadGoals() {
      const storedGoals = await collectGoals();

      setMaxDrinkUnitsGoal(storedGoals.maxDrinksGoal);

      setWhiteDaysGoal(storedGoals.whiteDaysGoal);
    }
    loadGoals();
  }, []);

  const thisWeekLogs = getLogsForThisWeek(props.logs);

  let maxDrinkUnitsCurrent = 0;

  for (const log of thisWeekLogs) {
    maxDrinkUnitsCurrent = maxDrinkUnitsCurrent + getTotalDrinks(log);
  }

  const whiteDaysCurrent = getWhiteDayCount(thisWeekLogs);

  type progressBarProps = {
    title: string;
    current: number;
    goal: number;
  };

  async function decreaseWhiteDaysGoal() {
    if (whiteDaysGoal > 0) {
      const newWhiteDaysGoal = whiteDaysGoal - 1;
      setWhiteDaysGoal(newWhiteDaysGoal);
      await saveGoals({
        maxDrinksGoal: maxDrinkUnitsGoal,
        whiteDaysGoal: newWhiteDaysGoal,
      });
    }
  }

  async function increaseWhiteDaysGoal() {
    if (whiteDaysGoal < 7) {
      const newWhiteDaysGoal = whiteDaysGoal + 1;
      setWhiteDaysGoal(newWhiteDaysGoal);
      await saveGoals({
        maxDrinksGoal: maxDrinkUnitsGoal,
        whiteDaysGoal: newWhiteDaysGoal,
      });
    }
  }

  async function decreaseDrinkUnitsGoal() {
    if (maxDrinkUnitsGoal > 0) {
      const newMaxDrinkUnitsGoal = maxDrinkUnitsGoal - 1;
      setMaxDrinkUnitsGoal(newMaxDrinkUnitsGoal);
      await saveGoals({
        maxDrinksGoal: newMaxDrinkUnitsGoal,
        whiteDaysGoal: whiteDaysGoal,
      });
    }
  }

  async function increaseDrinkUnitsGoal() {
    const newMaxDrinkUnitsGoal = maxDrinkUnitsGoal + 1;

    setMaxDrinkUnitsGoal(newMaxDrinkUnitsGoal);

    await saveGoals({
      maxDrinksGoal: newMaxDrinkUnitsGoal,
      whiteDaysGoal: whiteDaysGoal,
    });
  }

  function ProgressBar(props: progressBarProps) {
    const current = Math.min(props.current, props.goal);
    let progress = 0;
    if (props.goal !== 0) {
      progress = current / props.goal;
    }

    return (
      <View style={styles.goalProgressBlock}>
        <View style={styles.goalTextLine}>
          <Text style={styles.goalTitle}>{props.title}</Text>
          <Text style={styles.goalValue}>
            {props.current} / {props.goal}
          </Text>
        </View>
        <View style={styles.fullBar}>
          <View
            style={[styles.progress, { width: `${progress * 100}%` }]}
          ></View>
        </View>
      </View>
    );
  }
  return (
    <View>
      <View style={styles.goalsCard}>
        <View style={styles.goalHeaderLine}>
          <Text style={styles.weeklyTitle}>Ukentlige mål</Text>
          <Feather
            name="edit"
            size={22}
            color={theme.colors.text}
            style={styles.editGoalsButton}
            onPress={() => setShowModal(true)}
          />
        </View>
        <ProgressBar
          title="Hvite dager"
          current={whiteDaysCurrent}
          goal={whiteDaysGoal}
        />

        <ProgressBar
          title="Alkoholgrense"
          current={maxDrinkUnitsCurrent}
          goal={maxDrinkUnitsGoal}
        />
      </View>
      <AppModal
        visible={showModal}
        title="Endre mål"
        onClose={() => setShowModal(false)}
      >
        <View style={styles.editOuterView}>
          <Text>Ukentlig maksgrense</Text>
          <View style={styles.editInnerView}>
            <Pressable onPress={() => decreaseDrinkUnitsGoal()}>
              <Text>
                <EvilIcons name="minus" size={24} color="black" />{" "}
              </Text>
            </Pressable>
            <Text>{maxDrinkUnitsGoal} Enheter</Text>
            <Pressable onPress={() => increaseDrinkUnitsGoal()}>
              <Text>
                <EvilIcons name="plus" size={24} color="black" />{" "}
              </Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.editOuterView}>
          <Text>Hvite dager</Text>
          <View style={styles.editInnerView}>
            <Pressable onPress={() => decreaseWhiteDaysGoal()}>
              <Text>
                <EvilIcons name="minus" size={24} color="black" />{" "}
              </Text>
            </Pressable>
            <Text>{whiteDaysGoal} dager</Text>
            <Pressable onPress={() => increaseWhiteDaysGoal()}>
              <Text>
                <EvilIcons name="plus" size={24} color="black" />{" "}
              </Text>
            </Pressable>
          </View>
        </View>
      </AppModal>
    </View>
  );
}

const styles = StyleSheet.create({
  fullBar: {
    height: 10,
    width: "100%",
    backgroundColor: theme.colors.lightGrey,
    borderRadius: theme.borderRadius.large,
    overflow: "hidden",
  },
  progress: {
    height: "100%",
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.large,
  },
  goalsCard: {
    backgroundColor: theme.colors.box,
    borderColor: theme.colors.lightGrey,
    borderWidth: 1,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.medium,
    marginHorizontal: theme.spacing.medium,
    marginBottom: theme.spacing.small,
    gap: 12,
  },
  goalProgressBlock: {
    gap: 8,
  },
  goalTextLine: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: theme.spacing.medium,
  },
  goalTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.text,
  },
  goalValue: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: "700",
  },
  weeklyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.text,
  },
  goalHeaderLine: {
    flexDirection: "row",
    alignItems: "center",
  },
  editGoalsButton: {
    marginLeft: "auto",
    padding: 4,
  },
  editInnerView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  editOuterView: {
    gap: 10,
    marginBottom: theme.spacing.small,
  },
});
