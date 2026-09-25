import RegularButton from "@/app/components/ui/button";
import FunctionBox from "@/app/components/ui/functionBox";
import theme from "@/app/theme/constantStyling";
import { AppColors, useAppTheme } from "@/app/theme/ThemeProvider";
import { FontAwesome6 } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useAchievements } from "../achievements/AchievementProvider";
import { incrementWhitePartyCount } from "../achievements/whitePartyStorage";
import HelpButton from "../help/HelpButton";
import PartyPlannerModal from "./PartyPlannerModal";

/* typer*/

type PartyState = {
  status: "idle" | "scheduled" | "active" | "finished";
  startTime: Date | null;
  endTime: Date | null;
  beer: number;
  wine: number;
  drinks: number;
  soberParty: boolean;
  whitePartyCounted: boolean;
};

/*helpers*/

function Ring({ value, label }: { value: number; label: string }) {
  const { colors } = useAppTheme();
  return (
    <View
  style={{
    flex: 1,
    alignItems: "center",
    gap: 8,
  }}
>
      <View
        style={{
          width: 76,
          height: 76,
          borderRadius: 38,
          borderWidth: 2.5,
          borderColor: colors.primary,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ fontSize: 26, fontWeight: "800", color: colors.text }}>
          {value}
        </Text>
      </View>
      <Text style={{ fontSize: 12, color: colors.text }}>{label}</Text>
    </View>
  );
}

function DrinkGoalCard({
  icon,
  value,
  label,
}: {
  icon: keyof typeof FontAwesome6.glyphMap;
  value: number;
  label: string;
}) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  return (
    <View style={styles.drinkCard}>
      <View style={styles.drinkIcon}>
        <FontAwesome6
          name={icon}
          size={18}
          color={colors.primary}
        />
      </View>
      <Text style={styles.cardValue}>{value}</Text>
      <Text style={styles.cardLabel}>{label}</Text>
    </View>
  );
}

function format(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  return {
    hours: Math.floor(totalSeconds / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

/* main*/

export default function PartyPlanner() {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const { checkAchievements } = useAchievements();
  const [showModal, setShowModal] = useState(false);
  const [now, setNow] = useState(new Date());

  const [party, setParty] = useState<PartyState>({
    status: "idle",
    startTime: null,
    endTime: null,
    beer: 0,
    wine: 0,
    drinks: 0,
    soberParty: false,
    whitePartyCounted: false,
  });

  /* klokke */
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!party.startTime || !party.endTime) return;
    if (party.status === "finished") return;

    if (now < party.startTime) {
      setParty((p) => ({ ...p, status: "scheduled" }));
    } else if (now >= party.startTime && now < party.endTime) {
      setParty((p) => ({ ...p, status: "active" }));
    } else if (now >= party.endTime) {
      setParty((p) => ({ ...p, status: "finished" }));
    }
  }, [now, party.startTime, party.endTime]);

  /* actions */

  function startParty(data: {
    start: Date;
    end: Date;
    beer: number;
    wine: number;
    drinks: number;
    soberParty: boolean;
  }) {
    const endTime = data.end < data.start ? data.start : data.end;

    setFeedback("");
    setParty({
      status: "scheduled",
      startTime: data.start,
      endTime,
      beer: data.beer,
      wine: data.wine,
      drinks: data.drinks,
      soberParty: data.soberParty,
      whitePartyCounted: false,
    });
  }

  function finishParty() {
    setParty((p) => ({ ...p, status: "finished" }));
  }

  function resetParty() {
    setParty({
      status: "idle",
      startTime: null,
      endTime: null,
      beer: 0,
      wine: 0,
      drinks: 0,
      soberParty: false,
      whitePartyCounted: false,
    });
  }

  useEffect(() => {
    if (
      party.status !== "finished" ||
      !party.soberParty ||
      party.whitePartyCounted
    ) {
      return;
    }

    async function recordWhiteParty() {
      setParty((currentParty) =>
        currentParty.status === "finished" &&
        currentParty.soberParty &&
        !currentParty.whitePartyCounted
          ? { ...currentParty, whitePartyCounted: true }
          : currentParty,
      );
      await incrementWhitePartyCount();
      await checkAchievements();
    }

    recordWhiteParty();
  }, [
    checkAchievements,
    party.soberParty,
    party.status,
    party.whitePartyCounted,
  ]);

  /* tid */

  const timeUntilStart =
    party.startTime ? Math.max(0, party.startTime.getTime() - now.getTime()) : 0;

  const timeLeft =
    party.endTime ? Math.max(0, party.endTime.getTime() - now.getTime()) : 0;

  const { hours, minutes, seconds } = format(timeLeft);
  const startCountdown = format(timeUntilStart);

  /* tilbakemelding */
  const [feedback, setFeedback] = useState("");
  function answerNo(){
setFeedback("Dette gikk ikke helt etter planen, men ikke gi opp. Var det noen omstendigheter som bidro til at du ikke nådde målet? Gjerne registrer i Triggerdagboken.")


  }

  function answerYes(){
   setFeedback("Godt jobbet! Dette var et steg i riktig retning.")

  }

  /* UI*/

  return (
    <>
      <FunctionBox
        title="PLANLEGG FESTEN"
        description="Lag en plan for en tryggere fest."
        helpBtn={<HelpButton helpKey="partyplanner" />}
      >
        <View style={{ alignItems: "center" }}>
        

          {/* før partystart */}
          {party.status === "scheduled" && (
            <View style={styles.scheduledContainer}>
              <Text style={styles.countdownLabel}>Festen starter om</Text>
              <View style={styles.timerCards}>
                <Ring value={startCountdown.hours} label="Timer" />
                <Ring value={startCountdown.minutes} label="Minutter" />
                <Ring value={startCountdown.seconds} label="Sekunder" />
              </View>
            </View>
          )}

          {/* aktiv fest */}
          {party.status === "active" && (
            <View style={{ alignItems: "center" }}>
              <View style={styles.timerCards}>
  <Ring value={hours} label="Timer" />
  <Ring value={minutes} label="Minutter" />
  <Ring value={seconds} label="Sekunder" />
</View>

              {party.soberParty ? (
                <View style={styles.soberGoalCard}>
                  <Text style={styles.soberGoalTitle}>Hvit fest</Text>
                  <Text style={styles.soberGoalText}>
                    Du har bestemt deg for å ikke drikke alkohol.
                  </Text>
                </View>
              ) : (
                <View style={styles.drinkCards}>
                  <DrinkGoalCard
                    icon="beer-mug-empty"
                    value={party.beer}
                    label="Øl"
                  />
                  <DrinkGoalCard
                    icon="wine-glass"
                    value={party.wine}
                    label="Vinglass"
                  />
                  <DrinkGoalCard
                    icon="martini-glass-citrus"
                    value={party.drinks}
                    label="Drinker"
                  />
                </View>
              )}
            </View>
          )}

          {/* ferdig (timer går ut eller bruker trykker stopp)*/}
          {party.status === "finished" && (
            <View style={styles.finishedContainer}>
            
            <Text style={styles.finishedSubtitle}>
        
              Nådde du målet du satte deg?
        
            </Text>
        
            <View style={styles.goalBox}>
        
              {party.soberParty ? (
                <View style={styles.soberGoalCard}>
                  <Text style={styles.soberGoalTitle}>Hvit fest</Text>
                  <Text style={styles.soberGoalText}>
                    Målet ditt var å ikke drikke alkohol.
                  </Text>
                </View>
              ) : (
                <View style={styles.drinkCards}>
                  <DrinkGoalCard
                    icon="beer-mug-empty"
                    value={party.beer}
                    label="Øl"
                  />
                  <DrinkGoalCard
                    icon="wine-glass"
                    value={party.wine}
                    label="Vinglass"
                  />
                  <DrinkGoalCard
                    icon="martini-glass-citrus"
                    value={party.drinks}
                    label="Drinker"
                  />
                </View>
              )}

{!feedback ? (
  <View style={styles.answerContainer}>
    <Pressable style={styles.yesButton} onPress={answerYes}>
      <Text style={styles.answerText}>Ja</Text>
    </Pressable>

    <Pressable style={styles.noButton} onPress={answerNo}>
      <Text style={styles.noAnswerText}>Nei</Text>
    </Pressable>
  </View>
) : (
  <Text style={styles.feedbackText}>
    {feedback}
  </Text>
)}
             
             </View>

</View>

)}
        
          {/* knapp */}
          <View style={{ width: "100%" }}>
            <RegularButton
              title={party.status === "active" ? "Stopp festen" : "Start ny fest"}
              onPress={() =>
                party.status === "active" ? finishParty() : setShowModal(true)
              }
            />
          </View>
        </View>
      </FunctionBox>

      <PartyPlannerModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onSave={(data) => {
          startParty(data);
          setShowModal(false);
        }}
      />
    </>
  );
}

const createStyles = (colors: AppColors) => StyleSheet.create({
  drinkRow: {
    flexDirection: "row",
    gap: 18,
    marginBottom: 10
  },
  drinkItem: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 10
  },
  
  goalBox: {
    width: "100%",
    marginBottom: 10,
    alignItems: "center",
  },
  
  goalLabel: {
    color: colors.text,
    fontSize: 14,
  },
  
  drinkBadge: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 18,
    minWidth: 72,
  },
  
  drinkValue: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
  },
  drinkCards: {
    flexDirection: "row",
    gap: 12,
    marginTop: 10,
    marginBottom: 20,
    width: "100%",
  },
  
  drinkCard: {
    flex: 1,
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
  },
  soberGoalCard: {
    alignItems: "center",
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary,
    borderRadius: theme.borderRadius.medium,
    borderWidth: 1,
    marginBottom: 20,
    marginTop: 10,
    paddingHorizontal: 16,
    paddingVertical: 18,
    width: "100%",
  },
  soberGoalTitle: {
    color: colors.primary,
    fontSize: 22,
    fontWeight: "800",
  },
  soberGoalText: {
    color: colors.darkGrey,
    fontSize: 15,
    lineHeight: 21,
    marginTop: 6,
    textAlign: "center",
  },
  
  drinkIcon: {
    alignItems: "center",
    backgroundColor: colors.primarySoft,
    borderRadius: 17,
    height: 34,
    justifyContent: "center",
    marginBottom: 7,
    width: 34,
  },
  
  cardValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.text,
  },
  
  cardLabel: {
    fontSize: 12,
    marginTop: 4,
    color: colors.darkGrey,
  },
  
  finishedContainer: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 10,
  },
  
  finishedSubtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: colors.text,
  },
  feedbackText: {
    marginTop: 10,
    padding: 16,
    borderRadius: 16,
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderWidth: 1,
    color: colors.text,
    textAlign: "center",
    lineHeight: 22,
    fontSize: 15,
    width: "100%",
  },
  answerContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 10,
    width: "100%",
  },
  
  yesButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: theme.borderRadius.medium,
    height: 50,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  
  noButton: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: theme.borderRadius.medium,
    height: 50,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  
  answerText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.lightText,
  },
  noAnswerText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
  timerCards: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
    marginBottom: 10,
  },
  scheduledContainer: {
    alignItems: "center",
    width: "100%",
  },
  countdownLabel: {
    color: colors.darkGrey,
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 12,
  },
});
