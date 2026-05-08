import FunctionBox from "@/app/components/ui/functionBox";
import { getOnboardingData } from "@/lib/storage/onboarding";
import { useEffect, useState } from "react";

export default function PersonalGoal() {
  const [goal, setGoal] = useState<string>("");

  useEffect(() => {
    const loadGoal = async () => {
      const data = await getOnboardingData();
      setGoal(data.goal ?? "");
    };

    loadGoal();
  }, []);

  return <FunctionBox title="Målet ditt" 
    description={goal || "Du har ikke satt et mål."}
   />;
}
