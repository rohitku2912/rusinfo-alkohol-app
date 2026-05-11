import RegularButton from "@/app/components/ui/button";
import FunctionBox from "@/app/components/ui/functionBox";
import theme from "@/app/theme/constantStyling";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
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
};

/*helpers*/

function Ring({ value, label }: { value: number; label: string }) {
  return (
    <View style={{ alignItems: "center", gap: 8, marginBottom: 10 }}>
      <View
        style={{
          width: 76,
          height: 76,
          borderRadius: 38,
          borderWidth: 2.5,
          borderColor: theme.colors.accent,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ fontSize: 26, fontWeight: "800", color: theme.colors.text }}>
          {value}
        </Text>
      </View>
      <Text style={{ fontSize: 12, color: theme.colors.text }}>{label}</Text>
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
  const [showModal, setShowModal] = useState(false);
  const [now, setNow] = useState(new Date());

  const [party, setParty] = useState<PartyState>({
    status: "idle",
    startTime: null,
    endTime: null,
    beer: 0,
    wine: 0,
    drinks: 0,
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
  }) {
    setFeedback("");
    setParty({
      status: "scheduled",
      startTime: data.start,
      endTime: data.end,
      beer: data.beer,
      wine: data.wine,
      drinks: data.drinks,
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
    });
  }

  /* tid */

  const timeUntilStart =
    party.startTime ? Math.max(0, party.startTime.getTime() - now.getTime()) : 0;

  const timeLeft =
    party.endTime ? Math.max(0, party.endTime.getTime() - now.getTime()) : 0;

  const { hours, minutes, seconds } = format(timeLeft);

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
      <FunctionBox title="PLANLEGG FESTEN" description="Skal du på fest? Legg en plan for hvor mye du skal drikke." helpBtn={<HelpButton helpKey="partyplanner"/>}>
        <View style={{ alignItems: "center", marginTop: 16}}>
        

          {/* før partystart */}
          {party.status === "scheduled" && (
            <Text style={{ color: theme.colors.text, marginBottom: 12 }}>
              Starter om {Math.floor(timeUntilStart / 60000)} min
            </Text>
          )}

          {/* aktiv fest */}
          {party.status === "active" && (
            <View style={{ alignItems: "center" }}>
              <View style={{ flexDirection: "row", gap: 20 }}>
                <Ring value={hours} label="timer" />
                <Ring value={minutes} label="minutt" />
                <Ring value={seconds} label="sekund" />
              </View>

              <View style={styles.drinkRow}>
                <Text style={styles.drinkItem}>🍺 {party.beer}</Text>
                <Text style={styles.drinkItem}>🍷 {party.wine}</Text>
                <Text style={styles.drinkItem}>🍸 {party.drinks}</Text>
              </View>
            </View>
          )}

          {/* ferdig (timer går ut eller bruker trykker stopp)*/}
          {party.status === "finished" && (
            <View style={styles.finishedContainer}>

            <Text style={styles.finishedTitle}>Festen er over!</Text>
        
            <Text style={styles.finishedSubtitle}>
        
              Nådde du målet du satte deg?
        
            </Text>
        
            <View style={styles.goalBox}>
        
              <Text style={styles.goalLabel}>Du planla å drikke maks:</Text>
              <View style={styles.drinkRow}>
                <Text style={styles.drinkItem}>🍺 {party.beer}</Text>
                <Text style={styles.drinkItem}>🍷 {party.wine}</Text>
                <Text style={styles.drinkItem}>🍸 {party.drinks}</Text>
              </View>

              {!feedback ? (
  <View style={{ flexDirection: "row", gap: 12, marginTop: 12 }}>
    
    <RegularButton title="ja" onPress={answerYes} />
     <RegularButton title="nei" onPress={answerNo}/> 
   
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

const styles = StyleSheet.create({
  drinkRow: {
    flexDirection: "row",
    gap: 18,
    marginTop: 12,
    marginBottom: 10
  },
  drinkItem: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 10
  },
  finishedContainer: {
    width: "100%",
  },
  
  finishedTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: theme.colors.text,
    marginBottom: 8,
  },
  
  finishedSubtitle: {
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: 20,

  },
  
  goalBox: {
    width: "100%",
    marginBottom: 10,
    alignItems: "center",
  },
  
  goalLabel: {
    color: theme.colors.text,
    fontSize: 14,
  },
  
  drinkBadge: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 18,
    minWidth: 72,
  },
  
  drinkEmoji: {
    fontSize: 24,
    marginBottom: 6,
  },
  
  drinkValue: {
    fontSize: 20,
    fontWeight: "700",
    color: theme.colors.text,
  },
  feedbackText: {
    marginTop: 18,
    color: theme.colors.text,
    fontSize: 15,
    lineHeight: 24,
    textAlign: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    padding: 16,
    borderRadius: 16,
    overflow: "hidden",
  },
 
});