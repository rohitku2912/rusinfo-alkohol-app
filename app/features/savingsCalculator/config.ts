export type DrinkType = "ØL" | "VIN" | "BRENNEVIN";

export type Frequency = "dag" | "uke" | "måned";

export type Entry = {
  type: DrinkType;
  label: string;
  frequency: Frequency;
  amount: number;
  price: number;
  calories: number;
  startDate: Date;
};

export type SavedEntry = Entry & { id: string };

export type DrinkPreset = {
  label: string;
  details: string;
  price: number;
  calories: number;
};

export const FREQUENCIES: Frequency[] = ["dag", "uke", "måned"];

export const DRINK_PRESETS: Record<DrinkType, DrinkPreset[]> = {
  ØL: [
    { label: "Butikkøl", details: "0.33L boks", price: 27, calories: 140 },
    { label: "Butikkøl light", details: "0.33L lett variant", price: 27, calories: 95 },
    { label: "Pubøl", details: "0.5L på tapp", price: 110, calories: 215 },
    { label: "Sterkøl", details: "0.44L craft", price: 55, calories: 190 },
  ],
  VIN: [
    { label: "Vinglass", details: "0.15L på bar", price: 120, calories: 125 },
    { label: "Butikkvin", details: "0.75L flaske", price: 150, calories: 625 },
    { label: "Restaurant", details: "0.75L flaske", price: 450, calories: 625 },
  ],
  BRENNEVIN: [
    { label: "Shot", details: "4 cl på bar", price: 120, calories: 95 },
    { label: "Drink ute", details: "cocktail på bar", price: 145, calories: 180 },
    { label: "Flaske", details: "0.7L fra butikk", price: 400, calories: 1540 },
  ],
};

export function createDefaultEntry(): Entry {
  return {
    type: "ØL",
    label: "Butikkøl",
    frequency: "uke",
    amount: 1,
    price: 27,
    calories: 140,
    startDate: new Date(),
  };
}
