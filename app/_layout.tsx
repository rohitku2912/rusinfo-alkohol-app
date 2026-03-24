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
        name="drikklogg"
        options={{
          title: 'Drikklogg',
          tabBarIcon: ({ color }) => (
            <Ionicons name="beer" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="dagbok"
        options={{
          title: 'Dagbok',
          tabBarIcon: ({ color }) => (
            <Ionicons name="book" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="prestasjoner"
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

      {/* Skjul onboarding fra tab-baren */}
      <Tabs.Screen
        name="onboarding/index"
        options={{ href: null, headerShown: false, tabBarStyle: { display: 'none' } }}
      />
      <Tabs.Screen
        name="onboarding/info"
        options={{ href: null, headerShown: false, tabBarStyle: { display: 'none' } }}
      />
      <Tabs.Screen
        name="onboarding/maal"
        options={{ href: null, headerShown: false, tabBarStyle: { display: 'none' } }}
      />
      <Tabs.Screen
        name="onboarding/inspirasjon"
        options={{ href: null, headerShown: false, tabBarStyle: { display: 'none' } }}
      />
    </Tabs>
  );
}