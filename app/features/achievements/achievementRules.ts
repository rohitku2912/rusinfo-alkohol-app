import { DrinkLogEntry, getWhiteDayCount } from "@/lib/storage/drinkLogs";
import { Achievement } from "./AchievementCard";

export type DiaryEntry = {
  id: string;
  text: string;
  date: string;
  tags: string[];
};

export function getDiaryAchievements(entries: DiaryEntry[]) {
  const entriesWithTags = entries.filter((entry) => entry.tags.length > 0);
  return [
    {
      id: "forste-refleksjon",
      title: "Første refleksjon",
      description: "Skriv ditt første dagbokinnlegg.",
      currentProgress: Math.min(entries.length, 1),
      goal: 1,
      unitOfMeasurement: "innlegg",
    },
    {
      id: "fem-refleksjoner",
      title: "Fem refleksjoner",
      description: "Skriv 5 dagbokinnlegg totalt.",
      currentProgress: Math.min(entries.length, 5),
      goal: 5,
      unitOfMeasurement: "innlegg",
    },
    {
      id: "ti-refleksjoner",
      title: "Ti refleksjoner",
      description: "Skriv 10 dagbokinnlegg totalt.",
      currentProgress: Math.min(entries.length, 10),
      goal: 10,
      unitOfMeasurement: "innlegg",
    },
    {
      id: "tjue-refleksjoner",
      title: "Tjue refleksjoner",
      description: "Skriv 20 dagbokinnlegg totalt.",
      currentProgress: Math.min(entries.length, 20),
      goal: 20,
      unitOfMeasurement: "innlegg",
    },
    {
      id: "refleksjon-med-tag",
      title: "Refleksjon med tag",
      description: "Skriv et dagbokinnlegg og legg til minst en tag.",
      currentProgress: Math.min(entriesWithTags.length, 1),
      goal: 1,
      unitOfMeasurement: "innlegg",
    },
    {
      id: "fem-refleksjoner-med-tag",
      title: "Fem refleksjoner med tag",
      description: "Skriv 5 dagbokinnlegg med minst en tag i hvert.",
      currentProgress: Math.min(entriesWithTags.length, 5),
      goal: 5,
      unitOfMeasurement: "innlegg",
    },
  ];
}

//achievements med logging som input
export function getDrinkLogAchievements(logs: DrinkLogEntry[]) {
  return [
    {
      id: "first-log",
      title: "Første logg",
      description: "Logg din første dag",
      currentProgress: Math.min(logs.length, 1),
      goal: 1,
      unitOfMeasurement: "logg",
    },
    {
      id: "aerlig-oversikt",
      title: "Ærlig oversikt",
      description: "Logg 7 dager totalt",
      currentProgress: Math.min(logs.length, 7),
      goal: 7,
      unitOfMeasurement: "logg",
    },
    {
      id: "god-rytme",
      title: "God rytme",
      description: "Logg 14 dager totalt",
      currentProgress: Math.min(logs.length, 14),
      goal: 14,
      unitOfMeasurement: "logg",
    },
    {
      id: "30-dager",
      title: "30 dager",
      description: "Logg 30 dager totalt",
      currentProgress: Math.min(logs.length, 30),
      goal: 30,
      unitOfMeasurement: "logg",
    },
    {
      id: "60-dager",
      title: "60 dager",
      description: "Logg 60 dager totalt",
      currentProgress: Math.min(logs.length, 60),
      goal: 60,
      unitOfMeasurement: "logg",
    },
    {
      id: "90-dager",
      title: "90 dager",
      description: "Logg 90 dager totalt",
      currentProgress: Math.min(logs.length, 90),
      goal: 90,
      unitOfMeasurement: "logg",
    },
    {
      id: "forste-hvite-dag",
      title: "Første hvite dag",
      description: "Registrer din første hvite dag.",
      currentProgress: Math.min(getWhiteDayCount(logs), 1),
      goal: 1,
      unitOfMeasurement: "dag",
    },
    {
      id: "tre-hvite-dager",
      title: "Tre hvite dager",
      description: "Registrer 3 hvite dager totalt.",
      currentProgress: Math.min(getWhiteDayCount(logs), 3),
      goal: 3,
      unitOfMeasurement: "dag",
    },
    {
      id: "syv-hvite-dager",
      title: "Syv hvite dager",
      description: "Registrer 7 hvite dager totalt.",
      currentProgress: Math.min(getWhiteDayCount(logs), 7),
      goal: 7,
      unitOfMeasurement: "dag",
    },
    {
      id: "14-hvite-dager",
      title: "14 hvite dager",
      description: "Registrer 14 hvite dager totalt.",
      currentProgress: Math.min(getWhiteDayCount(logs), 14),
      goal: 14,
      unitOfMeasurement: "dag",
    },
    {
      id: "21-hvite-dager",
      title: "21 hvite dager",
      description: "Registrer 21 hvite dager totalt.",
      currentProgress: Math.min(getWhiteDayCount(logs), 21),
      goal: 21,
      unitOfMeasurement: "dag",
    },
  ];
}

//samle alle achievements i en funksjon
export function getAllAchievements(
  logs: DrinkLogEntry[],
  diaryEntries: DiaryEntry[],
) {
  return [
    ...getDrinkLogAchievements(logs),
    ...getDiaryAchievements(diaryEntries),
  ];
}

//sjekk om achievement er fullført
export function isAchievementCompleted(achievement: Achievement) {
  return achievement.currentProgress >= achievement.goal;
}
