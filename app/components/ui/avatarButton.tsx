import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Image, Pressable } from "react-native";

import { useAchievements } from "@/app/features/achievements/AchievementProvider";
import { avatars } from "@/app/features/avatar/avatar";
import AvatarRenderer from "@/app/features/avatar/avatarRenderer";
import { getSelectedAvatar } from "@/app/features/avatar/avatarStorage";

export default function AvatarButton() {
  const router = useRouter();
  const { accessoryVersion } = useAchievements();
  const [avatarId, setAvatarId] = useState<string | null>(null);
  const [focusVersion, setFocusVersion] = useState(0);

  useFocusEffect(
    useCallback(() => {
      getSelectedAvatar().then(setAvatarId);
      setFocusVersion((version) => version + 1);
    }, []),
  );

  useEffect(() => {
    getSelectedAvatar().then(setAvatarId);
  }, [accessoryVersion]);

  const avatar = avatars.find((a) => a.id === avatarId);

  const displayAvatar = avatar ?? {
    image: require("../../../assets/images/avatars/user-2.png"),
  };

  return (
    <Pressable onPress={() => router.push("/features/avatar/avatarScreen")}>
      {avatar ? (
        <AvatarRenderer
          key={`${avatar.id}-${accessoryVersion}-${focusVersion}`}
          avatarId={avatar.id}
          size={60}
        />
      ) : (
        <Image
          source={displayAvatar.image}
          style={{
            width: 60,
            height: 60,
            borderRadius: 20,
          }}
        />
      )}
    </Pressable>
  );
}
