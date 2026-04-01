import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { createProfile } from "../../lib/auth";
import { useAuth } from "../../store/authContext";

export default function OnboardingScreen() {
  const { firebaseUser, refreshUser } = useAuth();

  const [displayName, setDisplayName] = useState(firebaseUser?.displayName ?? "");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ displayName?: string; company?: string }>({});

  const initials = (displayName || firebaseUser?.email || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  function validate() {
    const e: typeof errors = {};
    if (!displayName.trim()) e.displayName = "Your name is required";
    if (!company.trim()) e.company = "Company name is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit() {
    if (!validate() || !firebaseUser) return;
    setLoading(true);
    try {
      await createProfile(firebaseUser.uid, {
        email: firebaseUser.email ?? "",
        displayName: displayName.trim(),
        company: company.trim(),
        phone: phone.trim() || undefined,
      });
      await refreshUser();
      router.replace("/(app)/home");
    } catch {
      Alert.alert("Error", "Could not save your profile. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <LinearGradient colors={["#0A0F1E", "#0D1830", "#0A0F1E"]} style={{ flex: 1 }}>
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View className="px-6 pb-10 pt-8">
              {/* Logo */}
              <View className="items-center mb-8">
                <View className="w-14 h-14 rounded-2xl bg-blue-500 items-center justify-center mb-3">
                  <Text className="text-white text-2xl font-black">A</Text>
                </View>
                <Text className="text-white text-2xl font-black tracking-widest">ALTRIX</Text>
              </View>

              {/* Avatar + welcome */}
              <View className="items-center mb-8">
                <View className="w-20 h-20 rounded-full bg-slate-700 border-2 border-blue-500 items-center justify-center mb-4">
                  <Text className="text-white text-2xl font-bold">{initials}</Text>
                </View>
                <Text className="text-white text-2xl font-bold text-center">
                  Almost there! 🎉
                </Text>
                <Text className="text-slate-400 text-sm text-center mt-2 leading-5">
                  Tell us about your company so we can{"\n"}personalise your Altrix experience.
                </Text>
              </View>

              {/* Google account badge */}
              {firebaseUser?.email ? (
                <View className="flex-row items-center bg-slate-800/60 border border-slate-700/50 rounded-xl px-4 py-3 mb-6">
                  <View className="w-8 h-8 rounded-full bg-blue-500/20 items-center justify-center mr-3">
                    <Ionicons name="person-circle-outline" size={18} color="#60A5FA" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-slate-400 text-xs">Signed in as</Text>
                    <Text className="text-white text-sm font-medium" numberOfLines={1}>
                      {firebaseUser.email}
                    </Text>
                  </View>
                </View>
              ) : null}

              {/* Form */}
              <Text className="text-slate-500 text-xs font-semibold tracking-widest mb-3 uppercase">
                Your Details
              </Text>
              <Input
                label="Full Name"
                placeholder="Jane Smith"
                iconName="person-outline"
                value={displayName}
                onChangeText={setDisplayName}
                error={errors.displayName}
              />

              <Text className="text-slate-500 text-xs font-semibold tracking-widest mb-3 mt-2 uppercase">
                Company
              </Text>
              <Input
                label="Company Name"
                placeholder="Acme Corporation"
                iconName="business-outline"
                value={company}
                onChangeText={setCompany}
                error={errors.company}
              />
              <Input
                label="Phone (optional)"
                placeholder="+1 555 000 0000"
                iconName="call-outline"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />

              <Button
                title="Get Started"
                onPress={handleSubmit}
                loading={loading}
                fullWidth
                size="lg"
              />

              <Text className="text-slate-600 text-xs text-center mt-4">
                You can update these details anytime from your profile.
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}
