import { Ionicons } from "@expo/vector-icons";
import { Tabs, router } from "expo-router";
import React, { useEffect } from "react";
import { useAuth } from "../../store/authContext";

type IoniconName = keyof typeof Ionicons.glyphMap;

interface TabConfig {
  name: string;
  title: string;
  icon: IoniconName;
  activeIcon: IoniconName;
}

const TABS: TabConfig[] = [
  { name: "home", title: "Home", icon: "home-outline", activeIcon: "home" },
  {
    name: "services",
    title: "Services",
    icon: "apps-outline",
    activeIcon: "apps",
  },
  {
    name: "tickets",
    title: "Tickets",
    icon: "receipt-outline",
    activeIcon: "receipt",
  },
  {
    name: "profile",
    title: "Profile",
    icon: "person-outline",
    activeIcon: "person",
  },
];

export default function AppLayout() {
  const { user, firebaseUser, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!firebaseUser) {
      router.replace("/(auth)/login");
    } else if (!user) {
      router.replace("/(auth)/onboarding");
    }
  }, [user, firebaseUser, loading]);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#0A0F1E",
          borderTopColor: "#1E293B",
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarActiveTintColor: "#3B82F6",
        tabBarInactiveTintColor: "#475569",
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
      }}
    >
      {TABS.map(({ name, title, icon, activeIcon }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title,
            tabBarIcon: ({ focused, color }) => (
              <Ionicons
                name={focused ? activeIcon : icon}
                size={22}
                color={color}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
