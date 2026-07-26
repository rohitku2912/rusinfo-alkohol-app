import theme from "@/app/theme/constantStyling";
import { Ionicons } from "@expo/vector-icons";
import { useRef } from "react";
import {
  Linking,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import HelpButton from "../help/HelpButton";
import CallAFriend from "./CallAFriend";
import EmergencyPlan from "./EmergencyPlan";
import PersonalGoal from "./PersonalGoal";

type Props = {
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
};

export default function EmergencyModal({ isVisible, setIsVisible }: Props) {
  const scrollRef = useRef<ScrollView>(null);
  const sectionOffsets = useRef({ plan: 0, motivation: 0 });
  const closeModal = () => setIsVisible(false);

  const revealEditor = (section: "plan" | "motivation" | "phone") => {
    setTimeout(() => {
      if (section === "phone") {
        scrollRef.current?.scrollToEnd({ animated: true });
        return;
      }

      scrollRef.current?.scrollTo({
        animated: true,
        y: Math.max(sectionOffsets.current[section] - 12, 0),
      });
    }, 250);
  };

  return (
    <Modal
      animationType="slide"
      onRequestClose={closeModal}
      presentationStyle="overFullScreen"
      transparent
      visible={isVisible}
    >
      <View style={styles.overlay}>
        <Pressable
          accessibilityLabel="Lukk"
          onPress={closeModal}
          style={styles.backdrop}
        />

        <View style={styles.sheet}>
            <View style={styles.handle} />

            <View style={styles.header}>
              <View style={styles.headerAction}>
                <HelpButton helpKey="emergencybutton" />
              </View>
              <View style={styles.headerText}>
                <Text style={styles.title}>Hjelp og støtte</Text>
                <Text style={styles.subtitle}>
                  Din personlige plan når ting blir vanskelig.
                </Text>
              </View>
              <Pressable
                accessibilityLabel="Lukk"
                hitSlop={10}
                onPress={closeModal}
                style={[styles.headerAction, styles.closeButton]}
              >
                <Ionicons name="close" size={22} color={theme.colors.text} />
              </Pressable>
            </View>

            <ScrollView
              automaticallyAdjustKeyboardInsets
              contentContainerStyle={styles.scrollContent}
              keyboardDismissMode="interactive"
              keyboardShouldPersistTaps="handled"
              ref={scrollRef}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.acuteSection}>
              <View style={styles.acuteHeading}>
                <Ionicons
                  name="information-circle-outline"
                  size={21}
                  color={theme.colors.attention}
                />
                <Text style={styles.acuteTitle}>Hvis du trenger akutt hjelp</Text>
              </View>

              <Text style={styles.acuteText}>
                Er situasjonen kritisk og står det om liv og helse, ring{" "}
                <Text style={styles.acuteNumber}>113</Text>.
              </Text>
              <Text style={styles.acuteText}>
                Hvis hjelpen ikke kan vente, men situasjonen ikke er
                livstruende, ring legevakten på{" "}
                <Text style={styles.acuteNumber}>116 117</Text>.
              </Text>
              <Text style={styles.acuteText}>
                Trenger du noen å snakke med, kan du ringe Mental Helse anonymt
                på <Text style={styles.acuteNumber}>116 123</Text>.
              </Text>
              <Text style={styles.acuteFootnote}>
                Er du usikker, ring heller én gang for mye enn én gang for lite.
              </Text>
              </View>

              <View style={styles.rusinfoSection}>
                <View style={styles.rusinfoIcon}>
                  <Ionicons
                    name="call-outline"
                    size={20}
                    color={theme.colors.primary}
                  />
                </View>
                <View style={styles.rusinfoContent}>
                  <Text style={styles.rusinfoTitle}>Spør RUSinfo</Text>
                  <Text style={styles.rusinfoText}>
                    Ring for anonym informasjon og veiledning om alkohol, andre
                    rusmidler og rusbruk. RUSinfo er ikke en akuttjeneste.
                  </Text>
                  <Text style={styles.rusinfoHours}>
                    Hverdager kl. 11–14.30 og 15–18
                  </Text>
                  <Pressable
                    accessibilityLabel="Ring RUSinfo på 915 08 588"
                    accessibilityRole="button"
                    onPress={() => void Linking.openURL("tel:91508588")}
                    style={styles.rusinfoCallButton}
                  >
                    <Ionicons
                      name="call"
                      size={16}
                      color={theme.colors.lightText}
                    />
                    <Text style={styles.rusinfoNumber}>915 08 588</Text>
                  </Pressable>
                </View>
              </View>

              <View style={styles.personalHeading}>
                <Text style={styles.personalTitle}>Din personlige støtte</Text>
                <Text style={styles.personalDescription}>
                  Bruk planen, motivasjonen og kontakten du har lagret.
                </Text>
              </View>

              <View
                onLayout={(event) => {
                  sectionOffsets.current.plan = event.nativeEvent.layout.y;
                }}
              >
                <EmergencyPlan onEditingStart={() => revealEditor("plan")} />
              </View>
              <View
                onLayout={(event) => {
                  sectionOffsets.current.motivation =
                    event.nativeEvent.layout.y;
                }}
              >
                <PersonalGoal
                  onEditingStart={() => revealEditor("motivation")}
                />
              </View>
              <CallAFriend onEditingStart={() => revealEditor("phone")} />
            </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(15, 23, 42, 0.4)",
  },
  sheet: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: "94%",
    minHeight: "78%",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 10,
  },
  handle: {
    alignSelf: "center",
    backgroundColor: "#b8c0b8",
    borderRadius: 999,
    height: 4,
    marginBottom: 6,
    marginTop: 10,
    width: 42,
  },
  header: {
    alignItems: "center",
    borderBottomColor: "#d6e0da",
    borderBottomWidth: 1,
    flexDirection: "row",
    paddingBottom: theme.spacing.medium,
    paddingHorizontal: theme.spacing.medium,
    paddingTop: theme.spacing.small,
  },
  headerAction: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 40,
    width: 40,
  },
  headerText: {
    flex: 1,
    paddingHorizontal: theme.spacing.small,
  },
  title: {
    color: theme.colors.text,
    fontSize: 23,
    fontWeight: "800",
    textAlign: "center",
  },
  subtitle: {
    color: theme.colors.darkGrey,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 2,
    textAlign: "center",
  },
  closeButton: {
    backgroundColor: theme.colors.box,
    borderRadius: 20,
  },
  scrollContent: {
    gap: theme.spacing.medium,
    paddingBottom: theme.spacing.large,
    paddingHorizontal: theme.spacing.medium,
    paddingTop: theme.spacing.medium,
  },
  acuteSection: {
    backgroundColor: theme.colors.box,
    borderColor: "#e4d8d8",
    borderLeftColor: theme.colors.attention,
    borderLeftWidth: 4,
    borderRadius: theme.borderRadius.medium,
    borderWidth: 1,
    padding: theme.spacing.medium,
  },
  acuteHeading: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    marginBottom: 10,
  },
  acuteTitle: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "800",
  },
  acuteText: {
    color: theme.colors.darkGrey,
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 7,
  },
  acuteNumber: {
    color: theme.colors.attention,
    fontWeight: "800",
  },
  acuteFootnote: {
    color: theme.colors.darkGrey,
    fontSize: 11,
    fontWeight: "600",
    lineHeight: 16,
    marginTop: 2,
  },
  rusinfoSection: {
    backgroundColor: "#EAF4EE",
    borderColor: "rgba(94, 156, 118, 0.35)",
    borderRadius: theme.borderRadius.medium,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    padding: theme.spacing.medium,
  },
  rusinfoIcon: {
    alignItems: "center",
    backgroundColor: theme.colors.box,
    borderRadius: 20,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  rusinfoContent: {
    flex: 1,
  },
  rusinfoTitle: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "800",
  },
  rusinfoText: {
    color: theme.colors.darkGrey,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 4,
  },
  rusinfoHours: {
    color: theme.colors.darkGrey,
    fontSize: 11,
    fontWeight: "600",
    marginTop: 6,
  },
  rusinfoCallButton: {
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: theme.colors.primary,
    borderRadius: 999,
    flexDirection: "row",
    gap: 7,
    marginTop: 10,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  rusinfoNumber: {
    color: theme.colors.lightText,
    fontSize: 14,
    fontWeight: "800",
  },
  personalHeading: {
    paddingHorizontal: 2,
    paddingTop: theme.spacing.small,
  },
  personalTitle: {
    color: theme.colors.text,
    fontSize: 19,
    fontWeight: "800",
  },
  personalDescription: {
    color: theme.colors.darkGrey,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 3,
  },
});
