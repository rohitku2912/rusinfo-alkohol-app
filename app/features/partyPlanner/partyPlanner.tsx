import RegularButton from "@/app/components/ui/button";
import FunctionBox from "@/app/components/ui/functionBox";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
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
    <View style={{ alignItems: "center", gap: 8 }}>
      <View
        style={{
          width: 76,
          height: 76,
          borderRadius: 38,
          borderWidth: 2.5,
          borderColor: "#E0A458",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ fontSize: 26, fontWeight: "800", color: "#fff" }}>
          {value}
        </Text>
      </View>
      <Text style={{ fontSize: 12, color: "#f0f0f0" }}>{label}</Text>
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

  /* UI*/

  return (
    <>
      <FunctionBox title="PLANLEGG FESTEN" description="">
        <View style={{ alignItems: "center", marginTop: 16}}>

          {/* før partystart */}
          {party.status === "scheduled" && (
            <Text style={{ color: "#c9b6a3", marginBottom: 12 }}>
              startar om {Math.floor(timeUntilStart / 60000)} min
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
            <View style={{ marginTop: 12, alignItems: "center" }}>
              <Text>Festen er over</Text>
              <Text>klarte du målet?</Text>

              <View style={{ flexDirection: "row", gap: 12, marginTop: 12 }}>
                <RegularButton title="ja" onPress={resetParty} />
                <RegularButton title="nei" onPress={resetParty} />
              </View>
            </View>
          )}

          {/* knapp */}
          <View style={{ marginTop: 16 }}>
            <RegularButton
              title={party.status === "active" ? "stopp festen" : "start ny fest"}
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
  },
  drinkItem: {
    fontSize: 16,
    fontWeight: "600",
    color: "#f6ede4",
  },
});