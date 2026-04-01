import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../store/authContext";

const FEATURES = [
  { icon: "cloud-outline" as const, label: "Cloud Services" },
  { icon: "shield-checkmark-outline" as const, label: "Cybersecurity" },
  { icon: "headset-outline" as const, label: "24/7 Support" },
  { icon: "analytics-outline" as const, label: "IT Consulting" },
];

export default function WelcomeScreen() {
  const { user, firebaseUser, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (user) {
      router.replace("/(app)/home");
    } else if (firebaseUser) {
      // Signed in but profile not yet created (first-time Google user)
      router.replace("/(auth)/onboarding");
    } else {
      router.replace("/(auth)/login");
    }
  }, [user, firebaseUser, loading]);

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: "#0A0F1E", alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator color="#3B82F6" size="large" />
      </View>
    );
  }

  return (
    <LinearGradient
      colors={["#0A0F1E", "#0D1830", "#0A0F1E"]}
      className="flex-1"
    >
      <SafeAreaView className="flex-1 px-6">
        {/* Logo */}
        <View className="items-center mt-10">
          <View className="w-16 h-16 rounded-2xl bg-blue-500 items-center justify-center mb-3">
            <Text className="text-white text-3xl font-black">A</Text>
          </View>
          <Text className="text-white text-2xl font-black tracking-widest">ALTRIX</Text>
          <Text className="text-blue-400 text-xs tracking-[4px] mt-0.5">ENTERPRISE IT</Text>
        </View>

        {/* Hero */}
        <View className="flex-1 items-center justify-center">
          <View className="w-60 h-60 rounded-full bg-blue-500/10 items-center justify-center mb-8">
            <View className="w-44 h-44 rounded-full bg-blue-500/15 items-center justify-center">
              <View className="w-28 h-28 rounded-full bg-blue-500/20 items-center justify-center">
                <Ionicons name="hardware-chip-outline" size={56} color="#60A5FA" />
              </View>
            </View>
          </View>

          <Text className="text-white text-3xl font-bold text-center leading-tight mb-3">
            IT Solutions for{"\n"}Modern Business
          </Text>
          <Text className="text-slate-400 text-base text-center leading-6 px-4">
            Streamline operations, strengthen security, and scale your technology with confidence.
          </Text>

          <View className="flex-row flex-wrap justify-center gap-2 mt-6">
            {FEATURES.map((f) => (
              <View
                key={f.label}
                className="flex-row items-center bg-slate-800/70 border border-slate-700/50 rounded-full px-3 py-1.5"
              >
                <Ionicons name={f.icon} size={13} color="#60A5FA" style={{ marginRight: 5 }} />
                <Text className="text-slate-300 text-xs font-medium">{f.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* CTA */}
        <View className="pb-8 gap-3">
          <TouchableOpacity
            onPress={() => router.push("/(auth)/register")}
            className="bg-blue-500 rounded-2xl py-4 items-center active:bg-blue-600"
          >
            <Text className="text-white font-bold text-base tracking-wide">Get Started — It's Free</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/(auth)/login")}
            className="border border-slate-600 rounded-2xl py-4 items-center active:bg-slate-800/50"
          >
            <Text className="text-slate-300 font-semibold text-base">Sign In</Text>
          </TouchableOpacity>
          <Text className="text-slate-600 text-xs text-center mt-1">
            Trusted by 500+ businesses worldwide
          </Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
