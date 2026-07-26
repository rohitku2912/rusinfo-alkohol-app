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
  onScoreChange?: (score: number, riskGroup: string) => void;
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

type RiskGroup = {
  level: RiskLevel;
  title: string;
  minScore: number;
  maxScore: number;
  description: string;
};

const MAX_AUDIT_SCORE = 40;

const riskDescriptions: Record<RiskLevel, string> = {
  lav: "Dine svar viser at du aldri eller i blant drikker alkohol, og at du kontrollerer dette på en bra måte. Selv om du ligger på lav risiko, er all alkoholforbruk en risiko for helsen din.",
  okende:
    "Det kan se ut som om du drikker alkohol på en måte hvor det kan være risiko for å utvikle alkoholrelaterte problemer. Du bør tenke igjennom din bruk av alkohol og kanskje vurdere å endre alkoholforbruket ditt.",
  hoy: "Du drikker alkohol på en måte der det er høy risiko for at du kan utvikle alkoholrelaterte problem. Du bør vurdere å redusere ditt inntak av alkohol. Det kan være lurt å snakke med noen om din bruk av alkohol. F.eks din fastlege, andre i hjelpeapparatet, noen i familien din, en venn eller kollega.",
  svaertHoy:
    "Du drikker for mye alkohol og kanskje har du allerede fått et alkoholrelatert problem. Din skåre antyder alkoholavhengighet. Denne applikasjonen alene vil muligens ikke være tilstrekkelig hjelp for dine utfordringer. Ta kontakt med din fastlege eller andre i hjelpeapparatet. De kan sammen med deg finne ut hva som trengs for at du eventuelt skal kunne greie å endre din bruk av alkohol. Du bør også snakke med noen andre om din bruk av alkohol, f.eks noen i familien din, en venn, kollega eller andre. Om du ønsker å snakke med noen anonymt kan du ringe eller chatte med rusinfo.",
};

const riskTitles: Record<RiskLevel, string> = {
  lav: "Lav risiko",
  okende: "Økende risiko",
  hoy: "Høy risiko",
  svaertHoy: "Svært høy risiko",
};

const riskColors: Record<RiskLevel, string> = {
  lav: "#5E9C76",
  okende: "#D6A53A",
  hoy: "#D97845",
  svaertHoy: "#C74747",
};

const riskBackgroundColors: Record<RiskLevel, string> = {
  lav: "#EAF4EE",
  okende: "#FFF5D8",
  hoy: "#FFF0E8",
  svaertHoy: "#FDECEC",
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
      { id: 1, text: "Sjelden" },
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
      { id: 1, text: "Sjelden" },
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
      { id: 1, text: "Sjelden" },
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
      { id: 1, text: "Sjelden" },
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
      { id: 1, text: "Sjelden" },
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
      { id: 1, text: "Sjelden" },
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

function getRiskGroups(gender: Gender | null): RiskGroup[] {
  const lowMaxScore = gender === "Dame" ? 5 : 7;

  return [
    {
      level: "lav",
      title: riskTitles.lav,
      minScore: 0,
      maxScore: lowMaxScore,
      description: riskDescriptions.lav,
    },
    {
      level: "okende",
      title: riskTitles.okende,
      minScore: lowMaxScore + 1,
      maxScore: 15,
      description: riskDescriptions.okende,
    },
    {
      level: "hoy",
      title: riskTitles.hoy,
      minScore: 16,
      maxScore: 18,
      description: riskDescriptions.hoy,
    },
    {
      level: "svaertHoy",
      title: riskTitles.svaertHoy,
      minScore: 19,
      maxScore: MAX_AUDIT_SCORE,
      description: riskDescriptions.svaertHoy,
    },
  ];
}

function formatScoreRange({ minScore, maxScore }: RiskGroup) {
  return `${minScore}-${maxScore} poeng`;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export default function AuditModal({
  isVisible,
  setIsVisible,
  onScoreChange,
}: Props) {
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const currentQuestion = questions[currentQuestionNumber];
  const [gender, setGender] = useState<Gender | null>(null);
  const [screen, setScreen] = useState<"start" | "gender" | "quiz" | "result">(
    "start",
  );
  const [expandedRiskGroup, setExpandedRiskGroup] =
    useState<RiskLevel | null>(null);

  function closeModal() {
    setIsVisible(false);
  }

  function restartQuiz() {
    setAnswers({});
    setCurrentQuestionNumber(0);
    setGender(null);
    setExpandedRiskGroup(null);
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
      const score = calculateScore();
      onScoreChange?.(score, riskTitles[scoreToRisk()]);
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
    const riskGroup = getRiskGroups(gender).find(
      (group) => score >= group.minScore && score <= group.maxScore,
    );

    return riskGroup?.level ?? "svaertHoy";
  }

  function renderRiskResult() {
    const risk = scoreToRisk();
    const riskGroup = getRiskGroups(gender).find(
      (group) => group.level === risk,
    );

    if (!riskGroup) return null;

    return (
      <View style={styles.resultCard}>
        <View style={styles.resultHeader}>
          <Text style={styles.resultTitle}>{riskGroup.title}</Text>
          <Text
            style={[
              styles.resultRange,
              {
                backgroundColor: riskBackgroundColors[riskGroup.level],
                borderColor: riskColors[riskGroup.level],
                color: riskColors[riskGroup.level],
              },
            ]}
          >
            {formatScoreRange(riskGroup)}
          </Text>
        </View>
        <Text style={styles.bodyText}>{riskGroup.description}</Text>
        {risk === "svaertHoy" && (
          <View style={styles.callBox}>
            <Text style={styles.callLabel}>Ring rusinfo:</Text>
            <Text style={styles.callNumber}>915 08 588</Text>
            <Text style={styles.callTime}>(kl 11-18)</Text>
          </View>
        )}
      </View>
    );
  }

  function renderRiskSpectrum() {
    const activeRisk = scoreToRisk();
    const score = calculateScore();
    const markerPosition = clamp((score / MAX_AUDIT_SCORE) * 100, 1, 99);
    const riskGroups = getRiskGroups(gender);

    return (
      <View style={styles.riskSpectrumCard}>
        <View style={styles.spectrumHeader}>
          <Text style={styles.riskGroupsTitle}>Risikoskala</Text>
          <Text style={styles.spectrumScoreLabel}>{score} av 40 poeng</Text>
        </View>

        <View style={styles.spectrumTrackWrap}>
          <View style={styles.spectrumTrack}>
            <View style={styles.spectrumSegments}>
              {riskGroups.map((group) => (
                <View
                  key={group.level}
                  style={[
                    styles.spectrumSegment,
                    {
                      backgroundColor: riskColors[group.level],
                      flex: group.maxScore - group.minScore + 1,
                    },
                  ]}
                />
              ))}
            </View>
            <View
              style={[styles.spectrumMarker, { left: `${markerPosition}%` }]}
            >
              <View style={styles.spectrumMarkerLine} />
              <View style={styles.spectrumMarkerDot} />
            </View>
          </View>
        </View>

        <View style={styles.spectrumEndpoints}>
          <Text style={styles.spectrumEndpointText}>0</Text>
          <Text style={styles.spectrumEndpointText}>{MAX_AUDIT_SCORE}</Text>
        </View>

        <View style={styles.spectrumLegend}>
          {riskGroups.map((group) => {
            const isActive = group.level === activeRisk;
            const isExpanded = group.level === expandedRiskGroup;

            return (
              <Pressable
                key={group.level}
                onPress={() =>
                  setExpandedRiskGroup((previousRiskGroup) =>
                    previousRiskGroup === group.level ? null : group.level,
                  )
                }
                style={[
                  styles.spectrumLegendItem,
                  isActive && {
                    backgroundColor: riskBackgroundColors[group.level],
                    borderColor: riskColors[group.level],
                  },
                  isExpanded && {
                    backgroundColor: riskBackgroundColors[group.level],
                    borderColor: riskColors[group.level],
                  },
                ]}
              >
                <View style={styles.riskGroupSummary}>
                  <View
                    style={[
                      styles.spectrumLegendDot,
                      { backgroundColor: riskColors[group.level] },
                    ]}
                  />
                  <View style={styles.riskGroupTextBlock}>
                    <Text
                      style={[
                        styles.riskGroupTitle,
                        isActive && { color: riskColors[group.level] },
                      ]}
                    >
                      {group.title}
                    </Text>
                    <Text style={styles.riskGroupRange}>
                      {formatScoreRange(group)}
                    </Text>
                  </View>
                </View>

                {isExpanded && (
                  <Text style={styles.riskDescriptionText}>
                    {group.description}
                  </Text>
                )}
              </Pressable>
            );
          })}
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
    const risk = scoreToRisk();

    return (
      <ScrollView
        contentContainerStyle={styles.resultScrollContent}
        showsVerticalScrollIndicator={false}
        style={styles.resultScroll}
      >
        <View style={[styles.screen, styles.resultScreen]}>
          <Text style={styles.title}>Resultat</Text>
          <View
            style={[
              styles.scoreBox,
              {
                backgroundColor: riskBackgroundColors[risk],
                borderColor: riskColors[risk],
              },
            ]}
          >
            <Text style={styles.scoreLabel}>Din score</Text>
            <Text style={[styles.scoreValue, { color: riskColors[risk] }]}>
              {calculateScore()}
            </Text>
          </View>
          {renderRiskResult()}
          {renderRiskSpectrum()}
          <RegularButton
            title="Ta testen på nytt"
            onPress={restartQuiz}
            style={styles.primaryButton}
          />
        </View>
      </ScrollView>
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
      <View style={styles.modalContent}>
        <BackButton onPress={closeModal} style={styles.backButton} />
        {controllScreen()}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: theme.colors.background,
    flex: 1,
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
  resultScroll: {
    flex: 1,
    marginTop: 16,
  },
  resultScrollContent: {
    flexGrow: 1,
    paddingBottom: 48,
  },
  resultScreen: {
    marginTop: 0,
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
    borderWidth: 1,
    borderRadius: theme.borderRadius.medium,
    padding: 16,
  },
  scoreLabel: {
    color: theme.colors.darkGrey,
    fontFamily: theme.fonts.main,
    fontSize: 14,
  },
  scoreValue: {
    fontFamily: theme.fonts.heading,
    fontSize: 42,
    fontWeight: "700",
  },
  resultCard: {
    gap: 10,
  },
  resultHeader: {
    alignItems: "flex-start",
    gap: 8,
  },
  resultTitle: {
    color: theme.colors.text,
    fontFamily: theme.fonts.heading,
    fontSize: 24,
    fontWeight: "700",
  },
  resultRange: {
    backgroundColor: "#EAF4EE",
    borderColor: theme.colors.primary,
    borderRadius: theme.borderRadius.large,
    borderWidth: 1,
    color: theme.colors.primary,
    fontFamily: theme.fonts.main,
    fontSize: 13,
    fontWeight: "700",
    overflow: "hidden",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  riskSpectrumCard: {
    borderColor: theme.colors.lightGrey,
    borderRadius: theme.borderRadius.medium,
    borderWidth: 1,
    gap: 10,
    padding: 14,
  },
  spectrumHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
  },
  riskGroupsTitle: {
    color: theme.colors.text,
    fontFamily: theme.fonts.heading,
    fontSize: 18,
    fontWeight: "700",
  },
  spectrumScoreLabel: {
    color: theme.colors.darkGrey,
    flexShrink: 0,
    fontFamily: theme.fonts.main,
    fontSize: 13,
    fontWeight: "700",
  },
  spectrumTrackWrap: {
    paddingTop: 10,
  },
  spectrumTrack: {
    height: 18,
    overflow: "visible",
  },
  spectrumSegments: {
    borderRadius: theme.borderRadius.large,
    flexDirection: "row",
    height: 18,
    overflow: "hidden",
  },
  spectrumSegment: {
    height: "100%",
  },
  spectrumMarker: {
    alignItems: "center",
    bottom: -7,
    position: "absolute",
    top: -9,
    transform: [{ translateX: -7 }],
    width: 14,
  },
  spectrumMarkerLine: {
    backgroundColor: theme.colors.text,
    borderRadius: 2,
    flex: 1,
    width: 3,
  },
  spectrumMarkerDot: {
    backgroundColor: theme.colors.text,
    borderColor: theme.colors.box,
    borderRadius: 7,
    borderWidth: 2,
    height: 14,
    marginTop: -2,
    width: 14,
  },
  spectrumEndpoints: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: -2,
  },
  spectrumEndpointText: {
    color: theme.colors.darkGrey,
    fontFamily: theme.fonts.main,
    fontSize: 12,
    fontWeight: "700",
  },
  spectrumLegend: {
    gap: 8,
    marginTop: 4,
  },
  spectrumLegendItem: {
    alignItems: "stretch",
    borderColor: theme.colors.lightGrey,
    borderRadius: theme.borderRadius.small,
    borderWidth: 1,
    gap: 8,
    minHeight: 44,
    paddingHorizontal: 10,
    paddingVertical: 8,
    width: "100%",
  },
  riskGroupSummary: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
  spectrumLegendDot: {
    borderRadius: 5,
    height: 10,
    width: 10,
  },
  riskGroupTextBlock: {
    flex: 1,
    minWidth: 0,
  },
  riskGroupTitle: {
    color: theme.colors.text,
    flexShrink: 1,
    fontFamily: theme.fonts.main,
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 17,
  },
  riskGroupRange: {
    color: theme.colors.darkGrey,
    flexShrink: 1,
    fontFamily: theme.fonts.main,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2,
  },
  riskDescriptionText: {
    color: theme.colors.darkGrey,
    fontFamily: theme.fonts.main,
    fontSize: 13,
    lineHeight: 18,
    paddingLeft: 18,
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
