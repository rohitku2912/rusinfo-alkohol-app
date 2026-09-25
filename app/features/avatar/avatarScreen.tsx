import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  LayoutChangeEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import BackButton from "@/app/components/ui/backButton";
import theme from "@/app/theme/constantStyling";
import { AppColors, useAppTheme } from "@/app/theme/ThemeProvider";
import ShowAchievements from "../achievements/ShowAchievements";
import { accessories, lockedAccessoryImage } from "./accessories";
import {
  getSelectedAccessories,
  getUnlockedAccessories,
  saveSelectedAccessories,
} from "./accessoriesStorage";
import { avatars } from "./avatar";
import AvatarRenderer from "./avatarRenderer";
import { getSelectedAvatar, saveSelectedAvatar } from "./avatarStorage";

type PickerMode = "avatar" | "accessory" | "achievements";

export default function AvatarScreen() {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const { showAchievements } = useLocalSearchParams<{
    showAchievements?: string;
  }>();
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>([]);
  const [unlockedAccessories, setUnlockedAccessories] = useState<string[]>([]);
  const [pickerMode, setPickerMode] = useState<PickerMode>("avatar");
  const router = useRouter();
  const scrollY = useRef(new Animated.Value(0)).current;
  const pickerPosition = useRef(new Animated.Value(0)).current;
  const [pickerWidth, setPickerWidth] = useState(0);
  const previewAvatarId = selectedAvatar ?? avatars[0]?.id;

  const selectPickerMode = (mode: "avatar" | "accessory") => {
    setPickerMode(mode);
    Animated.spring(pickerPosition, {
      toValue: mode === "avatar" ? 0 : 1,
      damping: 18,
      stiffness: 180,
      mass: 0.8,
      useNativeDriver: true,
    }).start();
  };

  const measurePicker = (event: LayoutChangeEvent) => {
    setPickerWidth(event.nativeEvent.layout.width);
  };
  const sortedAccessories = [...accessories].sort((a, b) => {
    const aIsUnlocked = unlockedAccessories.includes(a.id);
    const bIsUnlocked = unlockedAccessories.includes(b.id);

    return Number(bIsUnlocked) - Number(aIsUnlocked);
  });

  useEffect(() => {
    loadAvatarData();
  }, []);

  useEffect(() => {
    if (showAchievements === "1") {
      setPickerMode("achievements");
    }
  }, [showAchievements]);

  async function loadAvatarData() {
    const avatarId = await getSelectedAvatar();
    const accessoryIds = await getSelectedAccessories();
    const unlockedAccessoryIds = await getUnlockedAccessories();

    setSelectedAvatar(avatarId);
    setUnlockedAccessories(unlockedAccessoryIds);
    setSelectedAccessories(
      accessoryIds.filter((accessoryId) =>
        unlockedAccessoryIds.includes(accessoryId),
      ),
    );
  }

  async function handleSelectAvatar(id: string) {
    await saveSelectedAvatar(id);
    setSelectedAvatar(id);
  }

  async function handleSelectAccessory(id: string) {
    const accessory = accessories.find((item) => item.id === id);

    if (!accessory || !unlockedAccessories.includes(id)) {
      return;
    }

    const updatedAccessories = selectedAccessories.includes(id)
      ? selectedAccessories.filter((accessoryId) => accessoryId !== id)
      : [
          ...selectedAccessories.filter((accessoryId) => {
            const selectedAccessory = accessories.find(
              (item) => item.id === accessoryId,
            );

            return selectedAccessory?.position !== accessory.position;
          }),
          id,
        ];

    await saveSelectedAccessories(updatedAccessories);
    setSelectedAccessories(updatedAccessories);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.backButton}>
          <BackButton
            onPress={() =>
              pickerMode === "achievements"
                ? selectPickerMode("avatar")
                : router.back()
            }
          />
        </View>
        <Text style={styles.title}>
          {pickerMode === "achievements" ? "Prestasjoner" : "Avatar"}
        </Text>
        {pickerMode !== "achievements" && (
          <View style={styles.achievementsButton}>
            <Pressable onPress={() => setPickerMode("achievements")}>
              <Text style={styles.achievementsButtonText}>Prestasjoner</Text>
            </Pressable>
          </View>
        )}
      </View>

      {pickerMode === "achievements" ? (
        <ShowAchievements scrollY={scrollY} />
      ) : (
        <>
          <View style={styles.currentAvatarSection}>
            {previewAvatarId && (
              <AvatarRenderer
                avatarId={previewAvatarId}
                accessoryIds={selectedAccessories}
                size={180}
              />
            )}
          </View>

          <View onLayout={measurePicker} style={styles.modeRow}>
            {pickerWidth > 0 && (
              <Animated.View
                pointerEvents="none"
                style={[
                  styles.modeSlider,
                  {
                    width: (pickerWidth - 8) / 2,
                    transform: [
                      {
                        translateX: pickerPosition.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, (pickerWidth - 8) / 2],
                        }),
                      },
                    ],
                  },
                ]}
              />
            )}
            <Pressable
              accessibilityRole="tab"
              accessibilityState={{ selected: pickerMode === "avatar" }}
              onPress={() => selectPickerMode("avatar")}
              style={styles.modeButton}
            >
              <Text
                style={[
                  styles.modeButtonText,
                  pickerMode === "avatar" && styles.modeButtonTextActive,
                ]}
              >
                Velg avatar
              </Text>
            </Pressable>

            <Pressable
              accessibilityRole="tab"
              accessibilityState={{ selected: pickerMode === "accessory" }}
              onPress={() => selectPickerMode("accessory")}
              style={styles.modeButton}
            >
              <Text
                style={[
                  styles.modeButtonText,
                  pickerMode === "accessory" && styles.modeButtonTextActive,
                ]}
              >
                Velg tilbehør
              </Text>
            </Pressable>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.grid}
          >
            {pickerMode === "avatar"
              ? avatars.map((avatar) => {
                  const isSelected = selectedAvatar === avatar.id;

                  return (
                    <TouchableOpacity
                      key={avatar.id}
                      onPress={() => handleSelectAvatar(avatar.id)}
                      style={[styles.card, isSelected && styles.cardSelected]}
                    >
                      <Image source={avatar.image} style={styles.image} />

                      <Text style={styles.name}>{avatar.name}</Text>

                      {isSelected && (
                        <Text style={styles.selectedText}>Valgt</Text>
                      )}
                    </TouchableOpacity>
                  );
                })
              : sortedAccessories.map((accessory) => {
                  const isSelected = selectedAccessories.includes(accessory.id);
                  const isUnlocked = unlockedAccessories.includes(accessory.id);

                  return (
                    <TouchableOpacity
                      key={accessory.id}
                      onPress={() => handleSelectAccessory(accessory.id)}
                      disabled={!isUnlocked}
                      style={[
                        styles.card,
                        !isUnlocked && styles.cardLocked,
                        isSelected && styles.cardSelected,
                      ]}
                    >
                      <View style={styles.accessoryImageWrap}>
                        <Image
                          source={accessory.image}
                          style={[
                            styles.image,
                            styles.accessoryImage,
                            !isUnlocked && styles.lockedAccessoryImage,
                          ]}
                        />

                        {!isUnlocked && (
                          <Image
                            source={lockedAccessoryImage}
                            style={styles.lockOverlay}
                          />
                        )}
                      </View>

                      <Text
                        style={[styles.name, !isUnlocked && styles.lockedName]}
                      >
                        {accessory.name}
                      </Text>

                      {isSelected && (
                        <Text style={styles.selectedText}>Valgt</Text>
                      )}
                    </TouchableOpacity>
                  );
                })}
          </ScrollView>
        </>
      )}
    </View>
  );
}
const createStyles = (colors: AppColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
    position: "relative",
    minHeight: 40,
  },

  backButton: {
    position: "absolute",
    left: 0,
  },

  helpButton: {
    position: "absolute",
    right: 0,
  },

  title: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.text,
    textAlign: "center",
  },

  currentAvatarSection: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,

    paddingVertical: 18,
    marginBottom: 16,
  },

  modeRow: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: theme.borderRadius.medium,
    flexDirection: "row",
    marginBottom: 16,
    overflow: "hidden",
    padding: 4,
    position: "relative",
  },
  modeSlider: {
    backgroundColor: colors.primarySoft,
    borderColor: "rgba(94, 156, 118, 0.22)",
    borderRadius: theme.borderRadius.medium,
    borderWidth: 1,
    bottom: 4,
    left: 4,
    position: "absolute",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    top: 4,
  },

  modeButton: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    minHeight: 44,
    paddingVertical: 12,
    zIndex: 1,
  },

  modeButtonText: {
    color: colors.text,
    fontWeight: "700",
  },

  modeButtonTextActive: {
    color: colors.primary,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingBottom: theme.spacing.small,
  },

  card: {
    width: "47%",
    backgroundColor: colors.box,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },

  cardSelected: {
    borderColor: colors.primary,
    borderWidth: 2,
  },

  cardLocked: {
    backgroundColor: colors.box,
  },

  image: {
    width: 90,
    height: 90,
    marginBottom: 10,
  },

  accessoryImageWrap: {
    width: 90,
    height: 90,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  accessoryImage: {
    marginBottom: 0,
  },

  lockedAccessoryImage: {
    opacity: 0.35,
  },

  lockOverlay: {
    position: "absolute",
    width: 60,
    height: 60,
    opacity: 0.9,
  },

  name: {
    color: colors.text,
    fontWeight: "600",
    textAlign: "center",
  },

  lockedName: {
    color: colors.darkGrey,
  },

  selectedText: {
    marginTop: 6,
    color: colors.primary,
    fontWeight: "700",
  },
  achievementsButton: {
    position: "absolute",
    right: 0,
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: colors.box,
    borderWidth: 1,
    borderColor: colors.border
  },
  achievementsButtonText: {
    color: colors.text,
    fontWeight: "700",
  },
});
