import FunctionBox from "@/app/components/ui/functionBox";
import { getOnboardingData } from "@/lib/storage/onboarding";
import { useEffect, useState } from "react";

export default function PersonalGoal() {
  const [inspiration, setInspiration] = useState<string>("");

  useEffect(() => {
    const loadInspiration = async () => {
      const data = await getOnboardingData();

      const inspirationText = Array.isArray(data.inspiration)
        ? data.inspiration.join(", ")
        : data.inspiration ?? "";

      setInspiration(inspirationText);
    };

    loadInspiration();
  }, []);

  return (
    <FunctionBox
      title="Grunner til å slutte"
      description={
        inspiration || "Du har ikke valgt inspirasjon enda."
      }
    />
  );
}