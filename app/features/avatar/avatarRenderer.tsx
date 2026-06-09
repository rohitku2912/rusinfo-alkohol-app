import { View, Image, StyleSheet } from "react-native";
import { useEffect, useState } from "react";

import { avatars } from "./avatar";
import { Accessory, accessories } from "./accessories";
import {
  getSelectedAccessories,
  getUnlockedAccessories,
} from "./accessoriesStorage";

type Props = {
  avatarId: string;
  accessoryIds?: string[];
  size?: number;
};

const BASE_SIZE = 220;
const ACCESSORY_SIZE_BY_POSITION: Record<Accessory["position"], number> = {
  head: 118,
  face: 142,
  body: 96,
};

export default function AvatarRenderer({
  avatarId,
  accessoryIds,
  size = BASE_SIZE,
}: Props) {
  const [unlocked, setUnlocked] = useState<string[]>([]);

  const avatar = avatars.find((a) => a.id === avatarId);
  const scale = size / BASE_SIZE;

  useEffect(() => {
    if (!accessoryIds) {
      loadAccessories();
    }
  }, [accessoryIds]);

  async function loadAccessories() {
    const selected = await getSelectedAccessories();
    const unlockedAccessories = await getUnlockedAccessories();

    setUnlocked(
      selected.filter((accessoryId) =>
        unlockedAccessories.includes(accessoryId)
      )
    );
  }

  if (!avatar) return null;

  const visibleAccessoryIds = accessoryIds ?? unlocked;
  const activeAccessories = accessories.filter((acc) =>
    visibleAccessoryIds.includes(acc.id)
  );

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* BASE AVATAR */}
      <Image source={avatar.image} style={styles.avatar} />

      {/* ACCESSORIES OVERLAY */}
      {activeAccessories.map((acc) => {
        const anchor = avatar.anchors?.[acc.position];

        if (!anchor) return null;

        return (
          <Image
            key={acc.id}
            source={acc.image}
            style={[
              styles.accessory,
              getAccessoryStyle(
                acc,
                anchor.top,
                anchor.left,
                anchor.scale,
                scale,
              ),
            ]}
          />
        );
      })}
    </View>
  );
}

function getAccessoryStyle(
  accessory: Accessory,
  anchorTop: number,
  anchorLeft: number,
  anchorScale = 1,
  rendererScale: number,
) {
  const size =
    (accessory.size ?? ACCESSORY_SIZE_BY_POSITION[accessory.position]) *
    anchorScale;
  const top = anchorTop + (accessory.offsetTop ?? 0);
  const left = anchorLeft + (accessory.offsetLeft ?? 0);

  return {
    width: size * rendererScale,
    height: size * rendererScale,
    top: (top - size / 2) * rendererScale,
    left: (left - size / 2) * rendererScale,
  };
}

const styles = StyleSheet.create({
    container: {
      width: 220,
      height: 220,
      position: "relative",
      alignSelf: "center",
    },
  
    avatar: {
      width: "100%",
      height: "100%",
      position: "absolute",
    },
  
    accessory: {
      position: "absolute",
    },
  });
