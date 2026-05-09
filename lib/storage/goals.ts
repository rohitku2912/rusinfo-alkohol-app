import AsyncStorage from "@react-native-async-storage/async-storage";
import { DrinkLogEntry, getTotalDrinks, getWhiteDayCount } from "./drinkLogs";

//key
const GOALS_KEY = "goals";
const WEEKLY_GOAL_RESULTS_KEY = "weeklyGoalResults";

//type
export type WeeklyGoals = {
  maxDrinksGoal: number;
  whiteDaysGoal: number;
};

export type WeeklyGoalsResult = {
  week: string;
  maxDrinksGoal: number;
  maxDrinksResult: number;
  whiteDaysGoal: number;
  whiteDaysResult: number;
  maxDrinkGoalAchieved: boolean;
  whiteDaysGoalAchieved: boolean;
  allGoalsAchieved: boolean;
};

//default mål
const defaultGoals: WeeklyGoals = {
  maxDrinksGoal: 10,
  whiteDaysGoal: 5,
};

//hent mål, hvis ingen mål finnes: hent default mål
export async function collectGoals(): Promise<WeeklyGoals> {
  const storedGoals = await AsyncStorage.getItem(GOALS_KEY);
  if (!storedGoals) {
    return defaultGoals;
  }
  return JSON.parse(storedGoals);
}

//lagre mål
export async function saveGoals(goals: WeeklyGoals) {
  await AsyncStorage.setItem(GOALS_KEY, JSON.stringify(goals));
}

export function getWeeklyGoalsResult(
  week: string,
  logs: DrinkLogEntry[],
  goals: WeeklyGoals,
): WeeklyGoalsResult {
  //finner antall drikker denne uken
  let maxDrinksResult = 0;
  for (const log of logs) {
    maxDrinksResult += getTotalDrinks(log);
  }
  let maxDrinkGoalAchieved = false;
  if (maxDrinksResult <= goals.maxDrinksGoal) {
    maxDrinkGoalAchieved = true;
  }

  const whiteDaysResult = getWhiteDayCount(logs);
  let whiteDaysGoalAchieved = false;
  if (whiteDaysResult >= goals.whiteDaysGoal) {
    whiteDaysGoalAchieved = true;
  }

  let allGoalsAchieved = false;
  if (maxDrinkGoalAchieved && whiteDaysGoalAchieved) {
    allGoalsAchieved = true;
  }

  return {
    week,
    maxDrinksGoal: goals.maxDrinksGoal,
    maxDrinksResult,
    whiteDaysGoal: goals.whiteDaysGoal,
    whiteDaysResult,
    maxDrinkGoalAchieved,
    whiteDaysGoalAchieved,
    allGoalsAchieved,
  };
}

//hent resultater for alle uker
export async function collectWeeklyGoalsResults(): Promise<
  WeeklyGoalsResult[]
> {
  const storedResults = await AsyncStorage.getItem(WEEKLY_GOAL_RESULTS_KEY);
  if (!storedResults) {
    return [];
  }
  return JSON.parse(storedResults);
}

//sjekk om resultatet er lagret fra før
export async function isWeeklyGoalResultSaved(week: string) {
  const results = await collectWeeklyGoalsResults();

  for (const result of results) {
    if (result.week === week) {
      return true;
    }
  }

  return false;
}

//
export async function saveWeeklyGoalsResult(result: WeeklyGoalsResult) {
  const oldResults = await collectWeeklyGoalsResults();
  const resultsWithoutCurrentWeek = oldResults.filter(
    (oldResult) => oldResult.week !== result.week,
  );
  const newResults = [...resultsWithoutCurrentWeek, result];

  await AsyncStorage.setItem(
    WEEKLY_GOAL_RESULTS_KEY,
    JSON.stringify(newResults),
  );
}
