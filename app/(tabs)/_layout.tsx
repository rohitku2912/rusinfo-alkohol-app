import { flushPendingDemographics } from "@/lib/firestore/demographics";
import { Ionicons } from "@expo/vector-icons";
import * as Network from "expo-network";
import { Tabs } from "expo-router";
import { useEffect } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#2E7D32",
        tabBarStyle: {
          position: "absolute",
          width: "90%",
          marginLeft: "5%",
          height: 64,
          backgroundColor: "#fffaf3",
          borderRadius: 24,
          bottom: Math.max(insets.bottom, 12),
          borderTopWidth: 0,
          borderWidth: 1,
          borderColor: "rgba(0, 0, 0, 0.08)",
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
        name="drink-log"
        options={{
          title: "Drikklogg",
          tabBarIcon: ({ color }) => (
            <Ionicons name="beer" size={24} color={color} />
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
  );
}
