import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Svg, {
  Circle,
  Line,
  Polyline,
  Text as SvgText,
} from "react-native-svg";
import theme from "../../theme/constantStyling";

type TriggerEntry = {
  trigger: string;
  protectionFactors: string[];
  count: number;
  dates?: string[];
};

type Props = {
  triggerEntries: TriggerEntry[];
};

type RankingItem = {
  label: string;
  value: number;
};

type ActivityDay = {
  date: Date;
  count: number;
};

function FrequencyLineChart({ days }: { days: ActivityDay[] }) {
  const maxValue = Math.max(...days.map((day) => day.count), 1);
  const points = days.map((day, index) => {
    const x = 15 + index * 45;
    const y = 70 - (day.count / maxValue) * 55;
    return { ...day, x, y };
  });

  return (
    <View style={styles.lineChart}>
      <Svg
        accessibilityLabel="Linjediagram over triggerregistreringer de siste syv dagene"
        height={88}
        viewBox="0 0 300 88"
        width="100%"
      >
        {[15, 42.5, 70].map((y) => (
          <Line
            key={y}
            stroke="#e4e9e5"
            strokeDasharray="3 5"
            strokeWidth={1}
            x1={15}
            x2={285}
            y1={y}
            y2={y}
          />
        ))}
        <Polyline
          fill="none"
          points={points.map((point) => `${point.x},${point.y}`).join(" ")}
          stroke={theme.colors.primary}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={3}
        />
        {points.map((point) => (
          <Circle
            key={`${point.x}-${point.y}`}
            cx={point.x}
            cy={point.y}
            fill={theme.colors.box}
            r={4.5}
            stroke={theme.colors.primary}
            strokeWidth={3}
          />
        ))}
        {points
          .filter((point) => point.count > 0)
          .map((point) => (
            <SvgText
              key={`label-${point.x}`}
              fill={theme.colors.primary}
              fontSize={9}
              fontWeight="700"
              textAnchor="middle"
              x={point.x}
              y={Math.max(point.y - 8, 9)}
            >
              {point.count}
            </SvgText>
          ))}
      </Svg>
      <View style={styles.lineChartLabels}>
        {days.map((day) => (
          <Text key={day.date.toISOString()} style={styles.dayLabel}>
            {day.date
              .toLocaleDateString("nb-NO", { weekday: "short" })
              .replace(".", "")}
          </Text>
        ))}
      </View>
    </View>
  );
}

function SummaryCard({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: number;
}) {
  return (
    <View style={styles.summaryCard}>
      <View style={styles.summaryIcon}>
        <Ionicons name={icon} size={18} color={theme.colors.primary} />
      </View>
      <Text style={styles.summaryValue}>{value}</Text>
      <Text style={styles.summaryLabel}>{label}</Text>
    </View>
  );
}

function Ranking({
  items,
  total,
  emptyText,
  singularUnit,
  pluralUnit,
}: {
  items: RankingItem[];
  total: number;
  emptyText: string;
  singularUnit: string;
  pluralUnit: string;
}) {
  if (items.length === 0) {
    return <Text style={styles.empty}>{emptyText}</Text>;
  }

  const largestValue = Math.max(...items.map((item) => item.value), 1);

  return (
    <View style={styles.ranking}>
      {items.map((item, index) => {
        const percentage =
          total > 0 ? Math.round((item.value / total) * 100) : 0;

        return (
          <View key={item.label} style={styles.rankingItem}>
            <View style={styles.rankingHeader}>
              <View style={styles.rankingTitle}>
                <Text style={styles.rank}>{index + 1}</Text>
                <Text numberOfLines={2} style={styles.rankingLabel}>
                  {item.label}
                </Text>
              </View>
              <Text style={styles.rankingValue}>
                {item.value} {item.value === 1 ? singularUnit : pluralUnit}
                {total > 0 ? ` · ${percentage}%` : ""}
              </Text>
            </View>
            <View style={styles.barTrack}>
              <View
                style={[
                  styles.barFill,
                  {
                    width: `${Math.max(
                      (item.value / largestValue) * 100,
                      5,
                    )}%`,
                  },
                ]}
              />
            </View>
          </View>
        );
      })}
    </View>
  );
}

export default function TriggerStats({ triggerEntries }: Props) {
  const totalRegistrations = triggerEntries.reduce(
    (total, entry) => total + entry.count,
    0,
  );

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const allRegistrationDates = triggerEntries
    .flatMap((entry) => entry.dates ?? [])
    .map((date) => new Date(date))
    .filter((date) => !Number.isNaN(date.getTime()));
  const datedRegistrations = allRegistrationDates.length;

  const dateKey = (date: Date) =>
    `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  const startOfLastSevenDays = new Date(today);
  startOfLastSevenDays.setDate(today.getDate() - 6);
  const startOfLastThirtyDays = new Date(today);
  startOfLastThirtyDays.setDate(today.getDate() - 29);

  const lastSevenDays = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(startOfLastSevenDays);
    date.setDate(startOfLastSevenDays.getDate() + index);

    return {
      date,
      count: allRegistrationDates.filter(
        (registration) => dateKey(registration) === dateKey(date),
      ).length,
    };
  });
  const registrationsLastSevenDays = lastSevenDays.reduce(
    (total, day) => total + day.count,
    0,
  );
  const registrationsLastThirtyDays = allRegistrationDates.filter(
    (date) => date >= startOfLastThirtyDays && date <= now,
  );
  const activeDaysLastThirtyDays = new Set(
    registrationsLastThirtyDays.map(dateKey),
  ).size;
  const firstRegistration = [...allRegistrationDates].sort(
    (first, second) => first.getTime() - second.getTime(),
  )[0];
  const trackedDays = firstRegistration
    ? Math.min(
        30,
        Math.max(
          1,
          Math.floor(
            (today.getTime() -
              new Date(
                firstRegistration.getFullYear(),
                firstRegistration.getMonth(),
                firstRegistration.getDate(),
              ).getTime()) /
              86_400_000,
          ) + 1,
        ),
      )
    : 0;
  const weeklyAverage =
    trackedDays > 0
      ? (registrationsLastThirtyDays.length / trackedDays) * 7
      : 0;
  const factorMap = new Map<string, { label: string; count: number }>();

  triggerEntries.forEach((entry) => {
    entry.protectionFactors.forEach((factor) => {
      const normalized = factor.trim().toLocaleLowerCase("nb-NO");
      if (!normalized) return;

      const existing = factorMap.get(normalized);
      factorMap.set(normalized, {
        label: existing?.label ?? factor.trim(),
        count: (existing?.count ?? 0) + 1,
      });
    });
  });

  const topTriggers: RankingItem[] = [...triggerEntries]
    .sort((first, second) => second.count - first.count)
    .slice(0, 5)
    .map((entry) => ({ label: entry.trigger, value: entry.count }));

  const topFactors: RankingItem[] = [...factorMap.values()]
    .sort((first, second) => second.count - first.count)
    .slice(0, 5)
    .map((factor) => ({ label: factor.label, value: factor.count }));

  const topTrigger = topTriggers[0];
  const topTriggerPercentage =
    topTrigger && totalRegistrations > 0
      ? Math.round((topTrigger.value / totalRegistrations) * 100)
      : 0;

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.summaryRow}>
        <SummaryCard
          icon="checkmark-circle-outline"
          label="Registreringer"
          value={totalRegistrations}
        />
        <SummaryCard
          icon="flash-outline"
          label="Triggere"
          value={triggerEntries.length}
        />
        <SummaryCard
          icon="shield-checkmark-outline"
          label="Tiltak"
          value={factorMap.size}
        />
      </View>

      {topTrigger ? (
        <View style={styles.insightCard}>
          <View style={styles.insightIcon}>
            <Ionicons
              name="bulb-outline"
              size={22}
              color={theme.colors.primary}
            />
          </View>
          <View style={styles.insightText}>
            <Text style={styles.insightEyebrow}>DITT MØNSTER</Text>
            <Text style={styles.insightTitle}>{topTrigger.label}</Text>
            <Text style={styles.insightDescription}>
              Dette er triggeren du har registrert oftest og står for{" "}
              {topTriggerPercentage}% av registreringene dine.
            </Text>
          </View>
        </View>
      ) : (
        <View style={styles.welcomeCard}>
          <Ionicons
            name="analytics-outline"
            size={28}
            color={theme.colors.primary}
          />
          <Text style={styles.welcomeTitle}>Oversikten bygges over tid</Text>
          <Text style={styles.welcomeText}>
            Når du registrerer triggere, vil du se mønstre og tiltak som kan
            hjelpe deg.
          </Text>
        </View>
      )}

      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionIcon}>
            <Ionicons
              name="calendar-outline"
              size={19}
              color={theme.colors.primary}
            />
          </View>
          <View style={styles.sectionHeading}>
            <Text style={styles.sectionTitle}>Hvor ofte du registrerer</Text>
            <Text style={styles.sectionSubtitle}>
              Aktiviteten din den siste tiden
            </Text>
          </View>
        </View>

        {datedRegistrations > 0 ? (
          <>
            <View style={styles.frequencySummary}>
              <View style={styles.frequencyStat}>
                <Text style={styles.frequencyValue}>
                  {registrationsLastSevenDays}
                </Text>
                <Text style={styles.frequencyLabel}>siste 7 dager</Text>
              </View>
              <View style={styles.frequencyDivider} />
              <View style={styles.frequencyStat}>
                <Text style={styles.frequencyValue}>
                  {activeDaysLastThirtyDays}
                </Text>
                <Text style={styles.frequencyLabel}>aktive dager</Text>
              </View>
              <View style={styles.frequencyDivider} />
              <View style={styles.frequencyStat}>
                <Text style={styles.frequencyValue}>
                  {weeklyAverage.toLocaleString("nb-NO", {
                    maximumFractionDigits: 1,
                  })}
                </Text>
                <Text style={styles.frequencyLabel}>i snitt per uke</Text>
              </View>
            </View>

            <FrequencyLineChart days={lastSevenDays} />
          </>
        ) : (
          <Text style={styles.empty}>
            Nye registreringer vil vise hvor ofte du logger triggere. Eldre
            registreringer har ikke lagret dato.
          </Text>
        )}
      </View>

      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionIcon}>
            <Ionicons
              name="stats-chart-outline"
              size={19}
              color={theme.colors.primary}
            />
          </View>
          <View style={styles.sectionHeading}>
            <Text style={styles.sectionTitle}>Vanligste triggere</Text>
            <Text style={styles.sectionSubtitle}>Dine fem mest registrerte</Text>
          </View>
        </View>
        <Ranking
          items={topTriggers}
          total={totalRegistrations}
          emptyText="Ingen triggere registrert enda."
          singularUnit="gang"
          pluralUnit="ganger"
        />
      </View>

      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionIcon}>
            <Ionicons
              name="shield-checkmark-outline"
              size={19}
              color={theme.colors.primary}
            />
          </View>
          <View style={styles.sectionHeading}>
            <Text style={styles.sectionTitle}>Tiltak som hjelper</Text>
            <Text style={styles.sectionSubtitle}>
              Tiltak knyttet til flest ulike triggere
            </Text>
          </View>
        </View>
        <Ranking
          items={topFactors}
          total={triggerEntries.length}
          emptyText="Ingen tiltak registrert enda."
          singularUnit="trigger"
          pluralUnit="triggere"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: theme.spacing.medium,
    paddingBottom: 120,
    paddingTop: theme.spacing.small,
  },
  summaryRow: {
    flexDirection: "row",
    gap: theme.spacing.small,
  },
  summaryCard: {
    alignItems: "center",
    backgroundColor: theme.colors.box,
    borderColor: "#d6e0da",
    borderRadius: theme.borderRadius.medium,
    borderWidth: 1,
    flex: 1,
    minHeight: 108,
    paddingHorizontal: 6,
    paddingVertical: 12,
  },
  summaryIcon: {
    alignItems: "center",
    backgroundColor: "#EAF4EE",
    borderRadius: 18,
    height: 34,
    justifyContent: "center",
    marginBottom: 5,
    width: 34,
  },
  summaryValue: {
    color: theme.colors.text,
    fontSize: 23,
    fontWeight: "800",
  },
  summaryLabel: {
    color: theme.colors.darkGrey,
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
  },
  insightCard: {
    backgroundColor: "#EAF4EE",
    borderColor: "rgba(94, 156, 118, 0.35)",
    borderRadius: theme.borderRadius.medium,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    padding: theme.spacing.medium,
  },
  insightIcon: {
    alignItems: "center",
    backgroundColor: theme.colors.box,
    borderRadius: 22,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  insightText: {
    flex: 1,
  },
  insightEyebrow: {
    color: theme.colors.primary,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  insightTitle: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: "800",
    marginTop: 2,
  },
  insightDescription: {
    color: theme.colors.darkGrey,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 4,
  },
  welcomeCard: {
    alignItems: "center",
    backgroundColor: "#EAF4EE",
    borderColor: "rgba(94, 156, 118, 0.35)",
    borderRadius: theme.borderRadius.medium,
    borderWidth: 1,
    padding: theme.spacing.large,
  },
  welcomeTitle: {
    color: theme.colors.text,
    fontSize: 17,
    fontWeight: "800",
    marginTop: theme.spacing.small,
  },
  welcomeText: {
    color: theme.colors.darkGrey,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 4,
    textAlign: "center",
  },
  sectionCard: {
    backgroundColor: theme.colors.box,
    borderColor: "#d6e0da",
    borderRadius: theme.borderRadius.medium,
    borderWidth: 1,
    padding: theme.spacing.medium,
  },
  sectionHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    marginBottom: theme.spacing.medium,
  },
  sectionIcon: {
    alignItems: "center",
    backgroundColor: "#EAF4EE",
    borderRadius: 18,
    height: 36,
    justifyContent: "center",
    width: 36,
  },
  sectionHeading: {
    flex: 1,
  },
  sectionTitle: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "800",
  },
  sectionSubtitle: {
    color: theme.colors.darkGrey,
    fontSize: 12,
    marginTop: 2,
  },
  frequencySummary: {
    alignItems: "stretch",
    backgroundColor: "#f6f8f6",
    borderRadius: theme.borderRadius.small,
    flexDirection: "row",
    paddingVertical: 12,
  },
  frequencyStat: {
    alignItems: "center",
    flex: 1,
    paddingHorizontal: 4,
  },
  frequencyValue: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: "800",
  },
  frequencyLabel: {
    color: theme.colors.darkGrey,
    fontSize: 10,
    fontWeight: "600",
    marginTop: 2,
    textAlign: "center",
  },
  frequencyDivider: {
    alignSelf: "center",
    backgroundColor: "#dce3dd",
    height: 30,
    width: 1,
  },
  lineChart: {
    marginTop: theme.spacing.medium,
  },
  lineChartLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dayLabel: {
    color: theme.colors.darkGrey,
    flex: 1,
    fontSize: 10,
    fontWeight: "600",
    textAlign: "center",
  },
  ranking: {
    gap: 14,
  },
  rankingItem: {
    gap: 7,
  },
  rankingHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    justifyContent: "space-between",
  },
  rankingTitle: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    gap: 8,
  },
  rank: {
    color: theme.colors.primary,
    fontSize: 11,
    fontWeight: "800",
    width: 14,
  },
  rankingLabel: {
    color: theme.colors.text,
    flex: 1,
    fontSize: 13,
    fontWeight: "700",
  },
  rankingValue: {
    color: theme.colors.darkGrey,
    fontSize: 11,
    fontWeight: "600",
  },
  barTrack: {
    backgroundColor: theme.colors.lightGrey,
    borderRadius: 999,
    height: 8,
    marginLeft: 22,
    overflow: "hidden",
  },
  barFill: {
    backgroundColor: theme.colors.primary,
    borderRadius: 999,
    height: "100%",
  },
  empty: {
    color: theme.colors.darkGrey,
    fontSize: 13,
    paddingVertical: theme.spacing.medium,
    textAlign: "center",
  },
});
