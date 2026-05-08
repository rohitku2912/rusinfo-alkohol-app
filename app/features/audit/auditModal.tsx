import RegularButton from "@/app/components/ui/button";
import { useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";

type Props = {
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
};

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
  const [screen, setScreen] = useState<"start" | "quiz" | "result">("start");

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

  function scoreToRisk() {
    const score = calculateScore();
    if (score <= 7) {
      return "Lav risiko";
    } else if (score >= 8 && score < 16) {
      return "Økende risiko";
    } else if (score >= 16 && score < 19) {
      return "Høy risiko";
    } else {
      return "Svært høy risiko";
    }
  }

  function startScreen() {
    return (
      <View>
        <Text>Velkommen til AUDIT-testen</Text>
        <Text>
          Dette er en test som kan hjelpe deg å forstå ditt eget alkoholforbruk
          bedre
        </Text>
        <Text>
          Du vil få 10 spørsmål om ditt alkoholforbruk, og til slutt vil du få
          en score som indikerer din risiko for alkoholrelaterte problemer
        </Text>
        <RegularButton title="Start test" onPress={() => setScreen("quiz")} />
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
        <Text>Risiko: {scoreToRisk()}</Text>
      </View>
    );
  }

  function controllScreen() {
    if (screen === "start") return startScreen();
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
};
