import {
  getOnboardingData,
  mergeOnboardingData,
} from "@/lib/storage/onboarding";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import theme from "@/theme/constantStyling";

const options = [
  "Helsen min",
  "Familien min",
  "Økonomi",
  "Jobbe bedre",
  "Trene mer",
];

export default function Inspiration() {
  const router = useRouter();
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [otherSelected, setOtherSelected] = useState(false);
  const [otherText, setOtherText] = useState("");
  const scrollViewRef = useRef<ScrollView>(null);
  const canConfirm =
    selectedOptions.length > 0 ||
    (otherSelected && otherText.trim().length > 0);

  useEffect(() => {
    const loadDraft = async () => {
      const draft = await getOnboardingData();
      if (!draft.inspiration) return;

      const inspirations = Array.isArray(draft.inspiration)
        ? draft.inspiration
        : [draft.inspiration];
      const presetSelections = inspirations.filter((item) =>
        options.includes(item),
      );
      const customSelections = inspirations.filter(
        (item) => !options.includes(item),
      );

      setSelectedOptions(presetSelections);
      setOtherSelected(customSelections.length > 0);
      setOtherText(customSelections.join(", "));
    };
    loadDraft();
  }, []);

  useEffect(() => {
    if (!otherSelected) return;
    const timer = setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
    return () => clearTimeout(timer);
  }, [otherSelected]);

  useEffect(() => {
    if (!canConfirm || !otherSelected) return;
    const timer = setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 50);
    return () => clearTimeout(timer);
  }, [canConfirm, otherSelected]);

  const toggleOption = (option: string) => {
    setSelectedOptions((current) => {
      const nextOptions = current.includes(option)
        ? current.filter((item) => item !== option)
        : [...current, option];

      void mergeOnboardingData({
        inspiration: [
          ...nextOptions,
          ...(otherSelected && otherText.trim() ? [otherText.trim()] : []),
        ],
      });

      return nextOptions;
    });
  };

  const toggleOther = () => {
    setOtherSelected((current) => {
      if (current) {
        setOtherText("");
        void mergeOnboardingData({ inspiration: selectedOptions });
      } else {
        void mergeOnboardingData({ inspiration: selectedOptions });
      }

      return !current;
    });
  };

  const handleChangeOtherText = (text: string) => {
    setOtherText(text);
    void mergeOnboardingData({
      inspiration: [
        ...selectedOptions,
        ...(otherSelected && text.trim() ? [text.trim()] : []),
      ],
    });
  };

  const complete = async () => {
    const inspiration = [
      ...selectedOptions,
      ...(otherSelected && otherText.trim() ? [otherText.trim()] : []),
    ];
    await mergeOnboardingData({ inspiration });
    router.push("/onboarding/info" as any);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.container}
          bounces={false}
          alwaysBounceVertical={false}
          overScrollMode="never"
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons
              name="chevron-back"
              size={18}
              color={theme.colors.primary}
            />
            <Text style={styles.backButtonText}>Tilbake</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Hva er din inspirasjon?</Text>
          <Text style={styles.subtitle}>
            Dette lagres lokalt og kan endres senere.
          </Text>

          {options.map((o) => (
            <TouchableOpacity
              key={o}
              style={[
                styles.option,
                selectedOptions.includes(o) && styles.selectedStyle,
              ]}
              onPress={() => toggleOption(o)}
            >
              <View style={styles.optionRow}>
                <Text style={styles.optionText}>{o}</Text>
                {selectedOptions.includes(o) && (
                  <View style={styles.checkmark}>
                    <Ionicons name="checkmark" size={16} color="#fff" />
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={[styles.option, otherSelected && styles.selectedStyle]}
            onPress={toggleOther}
          >
            <View style={styles.optionRow}>
              <Text style={styles.optionText}>Annet</Text>
              {otherSelected && (
                <View style={styles.checkmark}>
                  <Ionicons name="checkmark" size={16} color="#fff" />
                </View>
              )}
            </View>
          </TouchableOpacity>

          {otherSelected && (
            <View style={styles.textInputWrapper}>
              <Text style={styles.textInputLabel}>
                Hva motiverer deg akkurat nå?
              </Text>
              <TextInput
                style={styles.textInput}
                placeholder="Beskriv med egne ord..."
                placeholderTextColor="#aaa"
                multiline
                scrollEnabled
                maxLength={300}
                value={otherText}
                onChangeText={handleChangeOtherText}
                onFocus={() => {
                  setTimeout(
                    () =>
                      scrollViewRef.current?.scrollToEnd({ animated: true }),
                    300,
                  );
                }}
              />
              <Text style={styles.characterCount}>
                {otherText.trim().length}/300
              </Text>
            </View>
          )}
        </ScrollView>

        {canConfirm && (
          <View style={styles.bottomBar}>
            <TouchableOpacity style={styles.button} onPress={complete}>
              <Text style={styles.buttonText}>Bekreft</Text>
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  flex: {
    flex: 1,
  },
  container: {
    padding: theme.spacing.large,
    paddingTop: theme.spacing.large,
    backgroundColor: theme.colors.background,
    flexGrow: 1,
    paddingBottom: 80,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 6,
    marginBottom: theme.spacing.medium,
  },
  backButtonText: {
    fontSize: 15,
    color: theme.colors.primary,
    fontWeight: "500",
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: theme.spacing.small,
    color: theme.colors.text,
    fontFamily: theme.fonts.heading,
  },
  subtitle: {
    fontSize: 14,
    color: "#888",
    marginBottom: 28,
  },
  option: {
    backgroundColor: "#e8e8e3",
    borderRadius: theme.borderRadius.medium,
    padding: 18,
    marginBottom: theme.spacing.small,
    borderWidth: 1,
    borderColor: "transparent",
  },
  selectedStyle: {
    backgroundColor: "#dcefdc",
    borderColor: "#9bc49d",
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.small,
  },
  optionText: { fontSize: 16, color: theme.colors.text },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  textInputWrapper: {
    height: 180,
    borderRadius: theme.borderRadius.medium,
    marginBottom: theme.spacing.small,
    backgroundColor: "#fff",
    padding: theme.spacing.medium,
    borderWidth: 1,
    borderColor: "#d9d9d3",
  },
  textInputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.small,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    textAlignVertical: "top",
    color: theme.colors.text,
  },
  characterCount: {
    marginTop: theme.spacing.small,
    fontSize: 12,
    color: "#888",
    alignSelf: "flex-end",
  },
  bottomBar: {
    paddingHorizontal: theme.spacing.large,
    paddingTop: theme.spacing.small,
    paddingBottom: theme.spacing.medium,
    backgroundColor: theme.colors.background,
  },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.medium,
    alignItems: "center",
  },
  buttonText: { fontSize: 16, color: "#fff" },
});
