import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import BackButton from "@/app/components/ui/backButton";
import theme from "@/app/theme/constantStyling";
import HelpButton from "../help/HelpButton";
import { accessories, lockedAccessoryImage } from "./accessories";
import {
  getSelectedAccessories,
  getUnlockedAccessories,
  saveSelectedAccessories,
} from "./accessoriesStorage";
import { avatars } from "./avatar";
import AvatarRenderer from "./avatarRenderer";
import { getSelectedAvatar, saveSelectedAvatar } from "./avatarStorage";

type PickerMode = "avatar" | "accessory";

export default function AvatarScreen() {
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>([]);
  const [unlockedAccessories, setUnlockedAccessories] = useState<string[]>([]);
  const [pickerMode, setPickerMode] = useState<PickerMode>("avatar");
  const router = useRouter();
  const previewAvatarId = selectedAvatar ?? avatars[0]?.id;

  useEffect(() => {
    loadAvatarData();
  }, []);

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
          <BackButton onPress={() => router.back()} />
        </View>
        <Text style={styles.title}>Avatar</Text>
        <View style={styles.helpButton}>
          <HelpButton helpKey="avatar" />
        </View>
      </View>

      <View style={styles.currentAvatarSection}>
        {previewAvatarId && (
          <AvatarRenderer
            avatarId={previewAvatarId}
            accessoryIds={selectedAccessories}
            size={180}
          />
        )}
      </View>

      <View style={styles.modeRow}>
        <Pressable
          onPress={() => setPickerMode("avatar")}
          style={[
            styles.modeButton,
            pickerMode === "avatar" && styles.modeButtonActive,
          ]}
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
          onPress={() => setPickerMode("accessory")}
          style={[
            styles.modeButton,
            pickerMode === "accessory" && styles.modeButtonActive,
          ]}
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

                  {isSelected && <Text style={styles.selectedText}>Valgt</Text>}
                </TouchableOpacity>
              );
            })
          : accessories.map((accessory) => {
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
                  <Image
                    source={isUnlocked ? accessory.image : lockedAccessoryImage}
                    style={[styles.image, !isUnlocked && styles.lockImage]}
                  />

                  <Text style={[styles.name, !isUnlocked && styles.lockedName]}>
                    {isUnlocked ? accessory.name : "Låst"}
                  </Text>

                  {isSelected && <Text style={styles.selectedText}>Valgt</Text>}
                </TouchableOpacity>
              );
            })}
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
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
    color: theme.colors.text,
    textAlign: "center",
  },

  currentAvatarSection: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.background,

    paddingVertical: 18,
    marginBottom: 16,
  },

  modeRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },

  modeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: theme.colors.box,
    borderWidth: 1,
    borderColor: "#DCE2D4",
  },

  modeButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },

  modeButtonText: {
    color: theme.colors.text,
    fontWeight: "700",
  },

  modeButtonTextActive: {
    color: theme.colors.lightText,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingBottom: 40,
  },

  card: {
    width: "47%",
    backgroundColor: theme.colors.box,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#DCE2D4",
  },

  cardSelected: {
    borderColor: theme.colors.primary,
    borderWidth: 2,
  },

  cardLocked: {
    backgroundColor: theme.colors.lightGrey,
    opacity: 0.75,
  },

  image: {
    width: 90,
    height: 90,
    marginBottom: 10,
  },

  lockImage: {
    opacity: 0.85,
  },

  name: {
    color: theme.colors.text,
    fontWeight: "600",
    textAlign: "center",
  },

  lockedName: {
    color: theme.colors.darkGrey,
  },

  selectedText: {
    marginTop: 6,
    color: theme.colors.primary,
    fontWeight: "700",
  },
});
