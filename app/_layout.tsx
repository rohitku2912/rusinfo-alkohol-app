import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function Layout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#2E7D32' }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Hjem',
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="drink-log"
        options={{
          title: 'Drikklogg',
          tabBarIcon: ({ color }) => (
            <Ionicons name="beer" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="diary"
        options={{
          title: 'Dagbok',
          tabBarIcon: ({ color }) => (
            <Ionicons name="book" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="achievements"
        options={{
          title: 'Prestasjoner',
          tabBarIcon: ({ color }) => (
            <Ionicons name="trophy" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="info"
        options={{
          title: 'Info',
          tabBarIcon: ({ color }) => (
            <Ionicons name="information-circle" size={24} color={color} />
          ),
        }}
      />

      {/* Hide onboarding screens from tab bar */}
      <Tabs.Screen
        name="onboarding/index"
        options={{ href: null, headerShown: false, tabBarStyle: { display: 'none' } }}
      />
      <Tabs.Screen
        name="onboarding/info"
        options={{ href: null, headerShown: false, tabBarStyle: { display: 'none' } }}
      />
      <Tabs.Screen
        name="onboarding/goal"
        options={{ href: null, headerShown: false, tabBarStyle: { display: 'none' } }}
      />
      <Tabs.Screen
        name="onboarding/inspiration"
        options={{ href: null, headerShown: false, tabBarStyle: { display: 'none' } }}
      />
    </Tabs>
  );
}
