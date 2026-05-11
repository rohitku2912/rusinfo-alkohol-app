import BackButton from "@/app/components/ui/backButton";
import RegularButton from "@/app/components/ui/button";
import theme from "@/app/theme/constantStyling";
import { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
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

  function restartQuiz() {
    setAnswers({});
    setCurrentQuestionNumber(0);
    setGender(null);
    setScreen("start");
  }

  function showOptions(option: Option) {
    const isSelected = answers[currentQuestion.id] === option.id;
    return (
      <Pressable
        key={option.id}
        onPress={() => chooseOption(currentQuestion.id, option.id)}
        style={[styles.option, isSelected && styles.selectedOption]}
      >
        <Text
          style={[styles.optionText, isSelected && styles.selectedOptionText]}
        >
          {option.text}
        </Text>
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
        <View style={styles.resultCard}>
          <Text style={styles.resultTitle}>Lav risiko</Text>
          <Text style={styles.bodyText}>
            Dine svar viser at du aldri eller i blant drikker alkohol, og at du
            kontrollerer dette på en bra måte.
          </Text>
        </View>
      );
    }

    if (risk === "okende") {
      return (
        <View style={styles.resultCard}>
          <Text style={styles.resultTitle}>Økende risiko</Text>
          <Text style={styles.bodyText}>
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
        <View style={styles.resultCard}>
          <Text style={styles.resultTitle}>Høy risiko</Text>
          <Text style={styles.bodyText}>
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
      <View style={styles.resultCard}>
        <Text style={styles.resultTitle}>Svært høy risiko</Text>
        <Text style={styles.bodyText}>
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
        <View style={styles.callBox}>
          <Text style={styles.callLabel}>Ring rusinfo:</Text>
          <Text style={styles.callNumber}>915 08 588</Text>
          <Text style={styles.callTime}>(kl 11-18)</Text>
        </View>
      </View>
    );
  }

  function startScreen() {
    return (
      <View style={styles.screen}>
        <View style={styles.helpRow}>
          <HelpButton helpKey="audit" />
        </View>
        <Text style={styles.title}>AUDIT-testen</Text>
        <Text style={styles.lead}>
          Dette er en test som kan hjelpe deg å forstå ditt eget alkoholforbruk
          bedre.
        </Text>
        <Text style={styles.bodyText}>
          Du vil få 10 spørsmål om ditt alkoholforbruk, og til slutt vil du få
          en score som indikerer din risiko for alkoholrelaterte problemer.
        </Text>
        <RegularButton
          title="Start test"
          onPress={() => setScreen("gender")}
          style={styles.primaryButton}
        />
      </View>
    );
  }

  function GenderScreen() {
    return (
      <View style={styles.screen}>
        <Text style={styles.title}>Hva er kjønnet ditt?</Text>
        <Text style={styles.bodyText}>
          Dette blir du spurt om fordi det påvirker resultatet til slutt.
        </Text>

        <Pressable
          onPress={() => setGender("Dame")}
          style={[styles.option, gender === "Dame" && styles.selectedOption]}
        >
          <Text
            style={[
              styles.optionText,
              gender === "Dame" && styles.selectedOptionText,
            ]}
          >
            Dame
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setGender("Mann")}
          style={[styles.option, gender === "Mann" && styles.selectedOption]}
        >
          <Text
            style={[
              styles.optionText,
              gender === "Mann" && styles.selectedOptionText,
            ]}
          >
            Mann
          </Text>
        </Pressable>
        <RegularButton
          title="Neste"
          onPress={() => {
            if (!gender) return;
            setScreen("quiz");
          }}
          style={styles.primaryButton}
        />
      </View>
    );
  }

  function QuizScreen() {
    const progress = (currentQuestionNumber + 1) / questions.length;

    return (
      <View style={styles.screen}>
        <Text style={styles.progressText}>
          Spørsmål {currentQuestionNumber + 1} av {questions.length}
        </Text>
        <View style={styles.progressTrack}>
          <View
            style={[styles.progressFill, { width: `${progress * 100}%` }]}
          />
        </View>
        <Text style={styles.questionText}>{currentQuestion.text}</Text>
        {currentQuestion.options.map(showOptions)}
        <RegularButton
          title={
            currentQuestionNumber === questions.length - 1
              ? "Se resultat"
              : "Neste"
          }
          onPress={goToNextQuestion}
          style={[
            styles.primaryButton,
            !hasAnsweredCurrentQuestion && styles.disabledButton,
          ]}
        />
      </View>
    );
  }

  function ResultScreen() {
    return (
      <View style={styles.screen}>
        <Text style={styles.title}>Resultat</Text>
        <View style={styles.scoreBox}>
          <Text style={styles.scoreLabel}>Din score</Text>
          <Text style={styles.scoreValue}>{calculateScore()}</Text>
        </View>
        {renderRiskResult()}
        <RegularButton
          title="Ta testen på nytt"
          onPress={restartQuiz}
          style={styles.primaryButton}
        />
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
      <ScrollView
        style={styles.modalContainer}
        contentContainerStyle={styles.modalContent}
      >
        <BackButton onPress={closeModal} style={styles.backButton} />
        {controllScreen()}
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  modalContent: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 56,
    paddingBottom: 32,
  },
  backButton: {
    alignSelf: "flex-start",
  },
  screen: {
    backgroundColor: theme.colors.box,
    borderRadius: theme.borderRadius.medium,
    gap: 14,
    marginTop: 16,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  helpRow: {
    alignItems: "flex-end",
  },
  title: {
    color: theme.colors.text,
    fontFamily: theme.fonts.heading,
    fontSize: 28,
    fontWeight: "700",
  },
  lead: {
    color: theme.colors.text,
    fontFamily: theme.fonts.main,
    fontSize: 17,
    fontWeight: "700",
    lineHeight: 23,
  },
  bodyText: {
    color: theme.colors.darkGrey,
    fontFamily: theme.fonts.main,
    fontSize: 15,
    lineHeight: 22,
  },
  option: {
    backgroundColor: theme.colors.box,
    borderColor: theme.colors.lightGrey,
    borderRadius: theme.borderRadius.medium,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  selectedOption: {
    backgroundColor: "#EAF4EE",
    borderColor: theme.colors.primary,
  },
  optionText: {
    color: theme.colors.text,
    fontFamily: theme.fonts.main,
    fontSize: 15,
    lineHeight: 20,
  },
  selectedOptionText: {
    color: theme.colors.primary,
    fontWeight: "700",
  },
  primaryButton: {
    marginTop: 8,
  },
  disabledButton: {
    opacity: 0.45,
  },
  progressText: {
    color: theme.colors.darkGrey,
    fontFamily: theme.fonts.main,
    fontSize: 13,
    fontWeight: "700",
  },
  progressTrack: {
    backgroundColor: theme.colors.lightGrey,
    borderRadius: theme.borderRadius.large,
    height: 8,
    overflow: "hidden",
  },
  progressFill: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.large,
    height: "100%",
  },
  questionText: {
    color: theme.colors.text,
    fontFamily: theme.fonts.heading,
    fontSize: 22,
    fontWeight: "700",
    lineHeight: 28,
  },
  scoreBox: {
    alignItems: "center",
    backgroundColor: "#EAF4EE",
    borderRadius: theme.borderRadius.medium,
    padding: 16,
  },
  scoreLabel: {
    color: theme.colors.darkGrey,
    fontFamily: theme.fonts.main,
    fontSize: 14,
  },
  scoreValue: {
    color: theme.colors.primary,
    fontFamily: theme.fonts.heading,
    fontSize: 42,
    fontWeight: "700",
  },
  resultCard: {
    gap: 10,
  },
  resultTitle: {
    color: theme.colors.text,
    fontFamily: theme.fonts.heading,
    fontSize: 24,
    fontWeight: "700",
  },
  callBox: {
    backgroundColor: "#FFF4D2",
    borderColor: theme.colors.accent,
    borderRadius: theme.borderRadius.medium,
    borderWidth: 1,
    gap: 4,
    marginTop: 6,
    padding: 14,
  },
  callLabel: {
    color: theme.colors.text,
    fontFamily: theme.fonts.main,
    fontWeight: "700",
  },
  callNumber: {
    color: theme.colors.text,
    fontFamily: theme.fonts.heading,
    fontSize: 26,
    fontWeight: "700",
  },
  callTime: {
    color: theme.colors.darkGrey,
    fontFamily: theme.fonts.main,
  },
});
