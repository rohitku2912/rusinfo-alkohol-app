import RegularButton from "@/app/components/ui/button";
import { useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import HelpButton from "../help/HelpButton";

type Props = {
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
};

type Gender = "Mann" | "Dame";

type Option = {
  id: number;
  text: string;
};

type Question = {
  id: number;
  text: string;
  options: Option[];
};

type Answers = {
  [questionId: number]: number;
};

type RiskLevel = "lav" | "okende" | "hoy" | "svaertHoy";

const questions: Question[] = [
  {
    id: 1,
    text: "Hvor ofte drikker du alkohol?",
    options: [
      { id: 0, text: "Aldri" },
      { id: 1, text: "1 gang i måneden eller sjeldnere" },
      { id: 2, text: "2-4 ganger i måneden" },
      { id: 3, text: "2-3 ganger i uken" },
      { id: 4, text: "4 ganger eller mer i uken" },
    ],
  },
  {
    id: 2,
    text: "Hvor mange alkoholenheter tar du på en 'typisk' drikkedag?",
    options: [
      { id: 0, text: "1-2" },
      { id: 1, text: "3-4" },
      { id: 2, text: "5-6" },
      { id: 3, text: "7-9" },
      { id: 4, text: "10 eller flere" },
    ],
  },

  {
    id: 3,
    text: "Hvor ofte drikker du seks alkoholenheter eller mer?",
    options: [
      { id: 0, text: "Aldri" },
      { id: 1, text: "sjelden" },
      { id: 2, text: "Noen ganger i måneden" },
      { id: 3, text: "Noen ganger i uken" },
      { id: 4, text: "Nesten daglig" },
    ],
  },
  {
    id: 4,
    text: "Hvor ofte i løpet av det siste året var du ikke i stand til å stoppe å drikke etter at du hadde begynt?",
    options: [
      { id: 0, text: "Aldri" },
      { id: 1, text: "sjelden" },
      { id: 2, text: "Noen ganger i måneden" },
      { id: 3, text: "Noen ganger i uken" },
      { id: 4, text: "Nesten daglig" },
    ],
  },
  {
    id: 5,
    text: "Hvor ofte i løpet av det siste året unnlot du å gjøre ting du skulle ha gjort pga. drikking?",
    options: [
      { id: 0, text: "Aldri" },
      { id: 1, text: "sjelden" },
      { id: 2, text: "Noen ganger i måneden" },
      { id: 3, text: "Noen ganger i uken" },
      { id: 4, text: "Nesten daglig" },
    ],
  },
  {
    id: 6,
    text: "Hvor ofte starter du dagen din med alkohol?",
    options: [
      { id: 0, text: "Aldri" },
      { id: 1, text: "sjelden" },
      { id: 2, text: "Noen ganger i måneden" },
      { id: 3, text: "Noen ganger i uken" },
      { id: 4, text: "Nesten daglig" },
    ],
  },
  {
    id: 7,
    text: "Hvor ofte i løpet av det siste året har du hatt skyldfølelse pga. drikking?",
    options: [
      { id: 0, text: "Aldri" },
      { id: 1, text: "sjelden" },
      { id: 2, text: "Noen ganger i måneden" },
      { id: 3, text: "Noen ganger i uken" },
      { id: 4, text: "Nesten daglig" },
    ],
  },
  {
    id: 8,
    text: "Hvor ofte i løpet av det siste året har det vært umulig å huske hva som hendte kvelden før pga. drikking?",
    options: [
      { id: 0, text: "Aldri" },
      { id: 1, text: "sjelden" },
      { id: 2, text: "Noen ganger i måneden" },
      { id: 3, text: "Noen ganger i uken" },
      { id: 4, text: "Nesten daglig" },
    ],
  },
  {
    id: 9,
    text: "Har du eller andre blitt skadet som følge av at du har drukket?",
    options: [
      { id: 0, text: "Nei" },
      { id: 2, text: "Ja, men ikke i løpet av det siste året" },
      { id: 4, text: "Ja, i løpet av det siste året" },
    ],
  },
  {
    id: 10,
    text: "Har en slektning, venn eller lege bekymret seg over drikkingen din, eller antydet at du bør redusere?",
    options: [
      { id: 0, text: "Nei" },
      { id: 2, text: "Ja, men ikke i løpet av det siste året" },
      { id: 4, text: "Ja, i løpet av det siste året" },
    ],
  },
];

export default function AuditModal({ isVisible, setIsVisible }: Props) {
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const currentQuestion = questions[currentQuestionNumber];
  const [gender, setGender] = useState<Gender | null>(null);
  const [screen, setScreen] = useState<"start" | "gender" | "quiz" | "result">(
    "start",
  );

  function closeModal() {
    setIsVisible(false);
  }

  function showOptions(option: Option) {
    const isSelected = answers[currentQuestion.id] === option.id;
    return (
      <Pressable
        key={option.id}
        onPress={() => chooseOption(currentQuestion.id, option.id)}
        style={isSelected ? Styles.selectedOption : Styles.notSelectedOption}
      >
        <Text>{option.text}</Text>
      </Pressable>
    );
  }

  // add answer to the prev. answes.
  function chooseOption(questionId: number, optionId: number) {
    setAnswers((previousAnswers) => ({
      ...previousAnswers,
      [questionId]: optionId,
    }));
  }

  const hasAnsweredCurrentQuestion = answers[currentQuestion.id] !== undefined;

  function goToNextQuestion() {
    if (!hasAnsweredCurrentQuestion) return;
    if (currentQuestionNumber < questions.length - 1) {
      setCurrentQuestionNumber(currentQuestionNumber + 1);
    } else {
      setScreen("result");
    }
  }

  function calculateScore() {
    let total = 0;
    for (const answer of Object.values(answers)) {
      total += answer;
    }
    return total;
  }

  function AuditResult() {
    return <Text> score: {calculateScore()}</Text>;
  }

  function scoreToRisk(): RiskLevel {
    const score = calculateScore();

    if (gender === "Dame") {
      if (score <= 5) {
        return "lav";
      } else if (score < 16) {
        return "okende";
      } else if (score < 19) {
        return "hoy";
      } else {
        return "svaertHoy";
      }
    }

    if (score <= 7) {
      return "lav";
    } else if (score < 16) {
      return "okende";
    } else if (score < 19) {
      return "hoy";
    } else {
      return "svaertHoy";
    }
  }

  function renderRiskResult() {
    const risk = scoreToRisk();

    if (risk === "lav") {
      return (
        <View>
          <Text>Lav risiko</Text>
          <Text>
            Dine svar viser at du aldri eller i blant drikker alkohol, og at du
            kontrollerer dette på en bra måte.
          </Text>
        </View>
      );
    }

    if (risk === "okende") {
      return (
        <View>
          <Text>Økende risiko</Text>
          <Text>
            Det kan se ut som om du drikker alkohol på en måte hvor det kan være
            risiko for å utvikle alkoholrelaterte problemer. Du bør tenke
            igjennom din bruk av alkohol og kanskje vurdere å endre
            alkoholforbruket ditt.
          </Text>
        </View>
      );
    }

    if (risk === "hoy") {
      return (
        <View>
          <Text>Høy risiko</Text>
          <Text>
            Du drikker alkohol på en måte der det er høy risiko for at du kan
            utvikle alkoholrelaterte problem. Du bør vurdere å redusere ditt
            inntak av alkohol. Det kan være lurt å snakke med noen om din bruk
            av alkohol. F.eks din fastlege, andre i hjelpeapparatet, noen i
            familien din, en venn eller kollega.
          </Text>
        </View>
      );
    }

    return (
      <View>
        <Text>Svært høy risiko</Text>
        <Text>
          Du drikker for mye alkohol og kanskje har du allerede fått et
          alkoholrelatert problem. Din skåre antyder alkoholavhengighet.
          Problemene dine er av en sånn art at denne appen alene kanskje ikke
          vil være tilstrekkelig hjelp. Ta kontakt med din fastlege eller andre
          i hjelpeapparatet. De kan sammen med deg finne ut hva som trengs for
          at du eventuelt skal kunne greie å endre din bruk av alkohol. Du bør
          også snakke med noen andre om din bruk av alkohol, f.eks noen i
          familien din, en venn, kollega eller andre. Om du ønsker å snakke med
          noen annonymt kan du ringe eller chatte med rusinfo:
        </Text>
        <View style={Styles.callBox}>
          <Text>Ring rusinfo:</Text>
          <Text>915 08 588</Text>
          <Text>(kl 11-18)</Text>
        </View>
      </View>
    );
  }

  function startScreen() {
    return (
      <View>
        <HelpButton helpKey="audit" />
        <Text>Velkommen til AUDIT-testen</Text>
        <Text>
          Dette er en test som kan hjelpe deg å forstå ditt eget alkoholforbruk
          bedre
        </Text>
        <Text>
          Du vil få 10 spørsmål om ditt alkoholforbruk, og til slutt vil du få
          en score som indikerer din risiko for alkoholrelaterte problemer
        </Text>
        <RegularButton title="Start test" onPress={() => setScreen("gender")} />
      </View>
    );
  }

  function GenderScreen() {
    return (
      <View>
        <Text>Hva er kjønnet ditt?</Text>
        <Text>
          Dette blir du spurt om fordi det påvirker resultatet til slutt
        </Text>

        <Pressable
          onPress={() => setGender("Dame")}
          style={
            gender === "Dame" ? Styles.selectedOption : Styles.notSelectedOption
          }
        >
          <Text>Dame</Text>
        </Pressable>
        <Pressable
          onPress={() => setGender("Mann")}
          style={
            gender === "Mann" ? Styles.selectedOption : Styles.notSelectedOption
          }
        >
          <Text>Mann</Text>
        </Pressable>
        <RegularButton
          title="Neste"
          onPress={() => {
            if (!gender) return;
            setScreen("quiz");
          }}
        />
      </View>
    );
  }

  function QuizScreen() {
    return (
      <>
        <Text>{currentQuestion.text}</Text>
        {currentQuestion.options.map(showOptions)}
        <RegularButton title="Next" onPress={goToNextQuestion} />
      </>
    );
  }

  function ResultScreen() {
    return (
      <View>
        <Text>Score: {calculateScore()}</Text>
      </View>
    );
  }

  function controllScreen() {
    if (screen === "start") return startScreen();
    if (screen === "gender") return GenderScreen();
    if (screen === "quiz") return QuizScreen();
    return ResultScreen();
  }

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      onRequestClose={closeModal}
    >
      <View style={Styles.modalContainer}>
        <RegularButton title="close modal" onPress={closeModal} />

        {controllScreen()}

        <Text>{JSON.stringify(answers)}</Text>
      </View>
    </Modal>
  );
}

const Styles = {
  modalContainer: {
    marginTop: 50,
    padding: 20,
  },
  selectedOption: {
    backgroundColor: "lightblue",
  },
  notSelectedOption: {
    backgroundColor: "white",
  },
  callBox: {
    backgroundColor: "lightgray",
    padding: 10,
    margin: 10,
  },
};
