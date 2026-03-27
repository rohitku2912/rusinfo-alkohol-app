import { Entry, SavedEntry } from "./config";

const numberFormatter = new Intl.NumberFormat("nb-NO");

export function calculateSavings(entry: Entry): number {
  const now = new Date();
  const daysSinceStart =
    (now.getTime() - entry.startDate.getTime()) / (1000 * 60 * 60 * 24);

  if (entry.frequency === "dag") {
    return Math.floor(daysSinceStart) * entry.amount * entry.price;
  }

  if (entry.frequency === "uke") {
    return Math.floor(daysSinceStart / 7) * entry.amount * entry.price;
  }

  return Math.floor(daysSinceStart / 30) * entry.amount * entry.price;
}

export function calculateAvoidedCalories(entry: Entry): number {
  const now = new Date();
  const daysSinceStart =
    (now.getTime() - entry.startDate.getTime()) / (1000 * 60 * 60 * 24);

  if (entry.frequency === "dag") {
    return Math.floor(daysSinceStart) * entry.amount * entry.calories;
  }

  if (entry.frequency === "uke") {
    return Math.floor(daysSinceStart / 7) * entry.amount * entry.calories;
  }

  return Math.floor(daysSinceStart / 30) * entry.amount * entry.calories;
}

export function parsePrice(text: string): number {
  const price = Number(text);

  if (Number.isNaN(price) || price < 0) {
    return 0;
  }

  return price;
}

export function createSavedEntry(entry: Entry): SavedEntry {
  return {
    ...entry,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  };
}

export function calculateTotalSavings(entries: SavedEntry[]): number {
  return entries.reduce((total, entry) => total + calculateSavings(entry), 0);
}

export function calculateTotalAvoidedCalories(entries: SavedEntry[]): number {
  return entries.reduce(
    (total, entry) => total + calculateAvoidedCalories(entry),
    0,
  );
}

export function getSavedEntryText(entry: SavedEntry): string {
  const unitText = entry.amount === 1 ? "gang" : "ganger";

  return `${entry.amount} ${unitText} ${entry.label.toLowerCase()} per ${entry.frequency}`;
}

export function formatNumber(value: number): string {
  return numberFormatter.format(value);
}
