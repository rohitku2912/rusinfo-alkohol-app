import { flushPendingDemographics } from "@/lib/firestore/demographics";
import { Ionicons } from "@expo/vector-icons";
import * as Network from "expo-network";
import { Tabs } from "expo-router";
import { useEffect } from "react";

export default function TabsLayout() {
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
    <Tabs screenOptions={{tabBarActiveTintColor: "#2E7D32" }}>
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
