import { flushPendingDemographics } from "@/lib/firestore/demographics";
import { Ionicons } from "@expo/vector-icons";
import * as Network from "expo-network";
import { Tabs } from "expo-router";
import { useEffect } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AchievementProvider from "../features/achievements/AchievementProvider";
import theme from "../theme/constantStyling";

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  useEffect(() => {
    void flushPendingDemographics();

    const subscription = Network.addNetworkStateListener((state) => {
      if (state.isConnected && state.isInternetReachable !== false) {
        void flushPendingDemographics();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <AchievementProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: theme.colors.primary,

          headerShown: false,
          tabBarStyle: {
            position: "absolute",
            width: "90%",
            marginLeft: "5%",
            height: 58,
            borderRadius: 24,
            bottom: Math.max(insets.bottom, 12),
            borderWidth: 2,
            paddingTop: 6,
            paddingBottom: 8,
          },

          sceneStyle: {
            paddingTop: insets.top,
            backgroundColor: theme.colors.background,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Hjem",
            tabBarIcon: ({ color }) => (
              <Ionicons name="home" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="overView"
          options={{
            title: "Oversikt",
            tabBarIcon: ({ color }) => (
              <Ionicons name="bar-chart" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="diary"
          options={{
            title: "Dagbok",
            tabBarIcon: ({ color }) => (
              <Ionicons name="book" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="achievements"
          options={{
            title: "Prestasjoner",
            tabBarIcon: ({ color }) => (
              <Ionicons name="trophy" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="info"
          options={{
            title: "Info",
            tabBarIcon: ({ color }) => (
              <Ionicons name="information-circle" size={24} color={color} />
            ),
          }}
        />
      </Tabs>
    </AchievementProvider>
  );
}
