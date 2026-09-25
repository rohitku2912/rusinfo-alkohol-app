// Info-siden viser artikler fra Firestore gruppert i kategorier,
// kontaktlenker til RUSinfo, og et tilbakemeldingsskjema.

import {
  fetchArticles,
  getTiptapText,
  type Article,
} from "@/lib/firestore/articles";
import { submitFeedback } from "@/lib/firestore/feedback";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Keyboard,
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import AnimatedTabHeader, {
  getAnimatedTabHeaderTopPadding,
} from "../components/ui/AnimatedTabHeader";
import AvatarButton from "../components/ui/avatarButton";
import SearchInput from "../components/ui/SearchInput";
import TiptapRenderer from "../features/articles/Tiptap";
import HelpButton from "../features/help/HelpButton";
import theme from "../theme/constantStyling";
import { AppColors, useAppTheme } from "@/app/theme/ThemeProvider";

const PREVIOUS_QUESTIONS_URL = "https://rusinfo.no/2018/12/chat-apningstid/";
const RUSINFO_PHONE_URL = "tel:+4791508588";

export default function Info() {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const insets = useSafeAreaInsets();
  const headerScrollY = useRef(new Animated.Value(0)).current;

  // --- State ---
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  // Set brukes fordi flere kategorier kan være åpne samtidig
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(),
  );
  // null = ingen artikkel valgt, modal er lukket
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackSending, setFeedbackSending] = useState(false);

  // --- Send tilbakemelding til Firestore ---
  const handleSendFeedback = async () => {
    if (!feedbackText.trim()) return;
    setFeedbackSending(true);
    try {
      await submitFeedback(feedbackText);
      setFeedbackText("");
      setFeedbackVisible(false);
      Alert.alert("Takk!", "Tilbakemeldingen din er sendt.");
    } catch {
      Alert.alert("Noe gikk galt", "Prøv igjen litt senere.");
    } finally {
      setFeedbackSending(false);
    }
  };

  // --- Hent artikler fra Firestore ved oppstart ---
  useEffect(() => {
    fetchArticles()
      .then(setArticles)
      .catch((err) => {
        console.warn(err);
        setError(String(err?.message ?? err));
      })
      .finally(() => setLoading(false));
  }, []);

  // --- Filtrer artikler basert på tittel, kategori og Tiptap-innhold ---
  const normalizedQuery = searchQuery.trim().toLocaleLowerCase("nb");
  const filteredArticles = normalizedQuery
    ? articles.filter((article) =>
        [article.title, article.categoryName, getTiptapText(article.content)]
          .join(" ")
          .toLocaleLowerCase("nb")
          .includes(normalizedQuery),
      )
    : articles;

  // --- Bygg unik, alfabetisk sortert liste over kategorier ---
  const categories = [
    ...new Set(filteredArticles.map((article) => article.categoryName)),
  ].sort((a, b) => a.localeCompare(b, "nb"));

  // --- Åpne eller lukk en kategori ---
  const toggleCategory = (kategori: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(kategori)) {
        next.delete(kategori);
      } else {
        next.add(kategori);
      }
      return next;
    });
  };

  // --- Åpne ekstern lenke (telefon eller nettside) ---
  const openExternalLink = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert("Kunne ikke åpne lenken", "Prøv igjen litt senere.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={[]}>
      <AnimatedTabHeader
        title="Informasjon"
        scrollY={headerScrollY}
        titleAccessory={<HelpButton helpKey="info" />}
        rightSlot={<AvatarButton />}
      />
      <View
        style={[
          styles.container,
          { paddingTop: getAnimatedTabHeaderTopPadding(insets.top) },
        ]}
      >
        {/* Søkefelt — filtrerer på tvers av alle artikler */}
        <View style={styles.searchContainer}>
          <SearchInput
            placeholder="Søk i informasjon..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={Keyboard.dismiss}
          />
        </View>

        {/* Vis spinner mens artikler lastes, feilmelding ved feil, ellers innhold */}
        {loading ? (
          <ActivityIndicator
            style={styles.loader}
            color={colors.primary}
          />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <ScrollView
            style={styles.list}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            onScrollBeginDrag={Keyboard.dismiss}
          >
            <Text style={styles.categoriesTitle}>Kategorier</Text>

            {/* Accordion-liste — én blokk per kategori */}
            {categories.map((kategori) => {
              const isExpanded =
                normalizedQuery.length > 0 || expandedCategories.has(kategori);
              const categoryArticles = filteredArticles.filter(
                (article) => article.categoryName === kategori,
              );

              return (
                <View key={kategori} style={styles.categoryBlock}>
                  {/* Kategori-rad — trykk for å åpne/lukke */}
                  <TouchableOpacity
                    style={styles.categoryRow}
                    onPress={() => toggleCategory(kategori)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.categoryText}>{kategori}</Text>
                    <View style={styles.categoryIcon}>
                      <Ionicons
                        name={
                          isExpanded
                            ? "arrow-down-circle"
                            : "arrow-forward-circle"
                        }
                        size={26}
                        color={"#5f6b5a"}
                      />
                    </View>
                  </TouchableOpacity>

                  {/* Artikler vises kun når kategorien er åpen */}
                  {isExpanded && (
                    <View style={styles.articleList}>
                      {categoryArticles.map((article, index) => (
                        <View key={article.id}>
                          <TouchableOpacity
                            style={styles.articleRow}
                            onPress={() => setSelectedArticle(article)}
                            activeOpacity={0.6}
                          >
                            <Text style={styles.articleText}>
                              {article.title}
                            </Text>
                            <Ionicons
                              name="chevron-forward"
                              size={16}
                              color="#888"
                            />
                          </TouchableOpacity>
                          {/* Skillelinje mellom artikler, ikke etter siste */}
                          {index < categoryArticles.length - 1 && (
                            <View style={styles.divider} />
                          )}
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              );
            })}

            {/* Kontakt-seksjon */}
            <View style={styles.qaSection}>
              <Text style={styles.sectionTitle}>Spørsmål og svar</Text>
              <Text style={styles.sectionBody}>
                Snakk anonymt med RUSinfo, eller les svar på spørsmål andre har
                stilt før.
              </Text>

              <TouchableOpacity
                style={styles.qaButton}
                activeOpacity={0.7}
                onPress={() => openExternalLink(RUSINFO_PHONE_URL)}
              >
                <Ionicons
                  name="call-outline"
                  size={20}
                  color={colors.primary}
                />
                <View style={styles.qaTextBlock}>
                  <Text style={styles.qaTitle}>Ring RUSinfo</Text>
                  <Text style={styles.qaSubtitle}>+47 915 08 588</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#888" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.qaButton}
                activeOpacity={0.7}
                onPress={() => openExternalLink(PREVIOUS_QUESTIONS_URL)}
              >
                <Ionicons
                  name="chatbubble-outline"
                  size={20}
                  color={colors.primary}
                />
                <View style={styles.qaTextBlock}>
                  <Text style={styles.qaTitle}>Chat med oss</Text>
                  <Text style={styles.qaSubtitle}>rusinfo.no</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#888" />
              </TouchableOpacity>
            </View>

            {/* Tilbakemeldingsknapp — åpner skjema */}
            <TouchableOpacity
              style={styles.feedbackButton}
              activeOpacity={0.7}
              onPress={() => setFeedbackVisible(true)}
            >
              <Ionicons
                name="chatbox-outline"
                size={20}
                color={colors.primary}
              />
              <View style={styles.qaTextBlock}>
                <Text style={styles.qaTitle}>Gi tilbakemelding</Text>
                <Text style={styles.qaSubtitle}>Forslag til forbedringer</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#888" />
            </TouchableOpacity>
          </ScrollView>
        )}
      </View>

      {/* Modal: tilbakemeldingsskjema */}
      <Modal
        visible={feedbackVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setFeedbackVisible(false)}
      >
        <SafeAreaView style={styles.modalSafe}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => setFeedbackVisible(false)}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Ionicons name="close" size={24} color={colors.lightText} />
            </TouchableOpacity>
            <Text style={styles.modalKategori}>Tilbakemelding</Text>
          </View>

          <View style={styles.feedbackContent}>
            <Text style={styles.feedbackTitle}>Hva tenker du?</Text>
            <Text style={styles.feedbackSubtitle}>
              Har du forslag til forbedringer eller nytt innhold? Vi setter pris
              på alle innspill.
            </Text>
            <TextInput
              style={styles.feedbackInput}
              placeholder="Skriv her..."
              placeholderTextColor={colors.darkGrey}
              multiline
              maxLength={500}
              value={feedbackText}
              onChangeText={setFeedbackText}
              textAlignVertical="top"
            />
            <Text style={styles.feedbackCount}>
              {feedbackText.trim().length}/500
            </Text>
            {/* Send-knapp er deaktivert til brukeren har skrevet noe */}
            <TouchableOpacity
              style={[
                styles.feedbackSendButton,
                (!feedbackText.trim() || feedbackSending) &&
                  styles.feedbackSendButtonDisabled,
              ]}
              disabled={!feedbackText.trim() || feedbackSending}
              onPress={handleSendFeedback}
            >
              <Text style={styles.feedbackSendText}>
                {feedbackSending ? "Sender..." : "Send inn"}
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Modal: artikkelvisning — åpnes når bruker trykker på en artikkel */}
      <Modal
        visible={selectedArticle !== null}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelectedArticle(null)}
      >
        {selectedArticle && (
          <SafeAreaView style={styles.modalSafe}>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                onPress={() => setSelectedArticle(null)}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              >
                <Ionicons
                  name="close"
                  size={24}
                  color={colors.lightText}
                />
              </TouchableOpacity>
              <Text style={styles.modalKategori}>
                {selectedArticle.categoryName}
              </Text>
            </View>

            <ScrollView
              contentContainerStyle={styles.modalContent}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.modalTitle}>{selectedArticle.title}</Text>
              <TiptapRenderer
                document={selectedArticle.content}
                articleTitle={selectedArticle.title}
              />
            </ScrollView>
          </SafeAreaView>
        )}
      </Modal>
    </SafeAreaView>
  );
}

const createStyles = (colors: AppColors) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: theme.spacing.medium,
  },
  searchContainer: {
    marginBottom: theme.spacing.large,
  },
  loader: {
    marginTop: 48,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 100,
    gap: theme.spacing.small,
  },
  categoriesTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.text,
    fontFamily: theme.fonts.heading,
    marginBottom: theme.spacing.small,
  },
  categoryBlock: {
    borderRadius: theme.borderRadius.medium,
    overflow: "hidden",
    backgroundColor: colors.surfaceMuted,
  },
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 18,
  },
  categoryText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: "500",
    flex: 1,
  },
  categoryIcon: {
    marginLeft: 8,
  },
  articleList: {
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: 18,
    paddingBottom: 8,
  },
  articleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 4,
  },
  articleText: {
    fontSize: 15,
    color: colors.text,
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  qaSection: {
    marginTop: theme.spacing.large * 2.5,
    gap: theme.spacing.small,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.text,
    fontFamily: theme.fonts.heading,
  },
  sectionBody: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.darkGrey,
    marginBottom: theme.spacing.small,
  },
  qaButton: {
    borderRadius: theme.borderRadius.medium,
    backgroundColor: colors.surfaceMuted,
    padding: theme.spacing.medium,
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.medium,
  },
  qaTextBlock: {
    flex: 1,
    gap: 3,
  },
  qaTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  qaSubtitle: {
    fontSize: 13,
    color: colors.darkGrey,
  },
  modalSafe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.large,
    paddingVertical: theme.spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: theme.spacing.medium,
  },
  modalKategori: {
    fontSize: 13,
    color: colors.darkGrey,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  modalContent: {
    padding: theme.spacing.large,
    paddingBottom: 48,
  },
  modalImage: {
    width: "100%",
    aspectRatio: 16 / 9,
    borderRadius: theme.borderRadius.medium,
    marginBottom: theme.spacing.large,
    backgroundColor: colors.surfaceMuted,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
    marginBottom: theme.spacing.medium,
    fontFamily: theme.fonts.heading,
  },
  modalPreamble: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
    marginBottom: theme.spacing.large,
    fontWeight: "500",
  },
  modalBody: {
    fontSize: 15,
    color: colors.darkGrey,
    lineHeight: 24,
  },
  errorText: {
    marginTop: 32,
    fontSize: 14,
    color: colors.attention,
    textAlign: "center",
  },
  feedbackButton: {
    borderRadius: theme.borderRadius.medium,
    backgroundColor: colors.surfaceMuted,
    padding: theme.spacing.medium,
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.medium,
  },
  feedbackContent: {
    padding: theme.spacing.large,
    flex: 1,
  },
  feedbackTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.text,
    marginBottom: theme.spacing.small,
    fontFamily: theme.fonts.heading,
  },
  feedbackSubtitle: {
    fontSize: 14,
    color: colors.darkGrey,
    lineHeight: 20,
    marginBottom: theme.spacing.large,
  },
  feedbackInput: {
    backgroundColor: colors.box,
    borderColor: colors.border,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.medium,
    fontSize: 15,
    color: colors.text,
    height: 160,
    borderWidth: 1,
  },
  feedbackCount: {
    fontSize: 12,
    color: colors.darkGrey,
    alignSelf: "flex-end",
    marginTop: 6,
    marginBottom: theme.spacing.large,
  },
  feedbackSendButton: {
    backgroundColor: colors.primary,
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.medium,
    alignItems: "center",
  },
  feedbackSendButtonDisabled: {
    opacity: 0.45,
  },
  feedbackSendText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
