export type OnboardingData = {
  shareAnonymousStats: boolean;
  age: string;
  gender: string;
  county: string;
  goal: string;
  inspiration: string[];
};

export type OnboardingDraft = Partial<OnboardingData>;
