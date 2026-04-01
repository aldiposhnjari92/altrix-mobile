import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
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
import { register } from "../../lib/auth";

export default function RegisterScreen() {
  const [form, setForm] = useState({
    company: "",
    displayName: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
  });
  const [errors, setErrors] = useState<Partial<typeof form>>({});
  const [loading, setLoading] = useState(false);

  function set(key: keyof typeof form) {
    return (val: string) => setForm((f) => ({ ...f, [key]: val }));
  }

  function validate() {
    const e: Partial<typeof form> = {};
    if (!form.company.trim()) e.company = "Company name is required";
    if (!form.displayName.trim()) e.displayName = "Your name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 8) e.password = "Minimum 8 characters";
    if (form.confirm !== form.password) e.confirm = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleRegister() {
    if (!validate()) return;
    setLoading(true);
    try {
      await register(
        form.email.trim(),
        form.password,
        form.displayName.trim(),
        form.company.trim(),
        form.phone.trim() || undefined
      );
      router.replace("/(app)/home");
    } catch (err: any) {
      const msg =
        err.code === "auth/email-already-in-use"
          ? "An account with this email already exists."
          : "Registration failed. Please try again.";
      Alert.alert("Registration Failed", msg);
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
            {/* Back button */}
            <TouchableOpacity
              onPress={() => router.back()}
              className="m-5 w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/50 items-center justify-center"
            >
              <Ionicons name="arrow-back" size={20} color="#94A3B8" />
            </TouchableOpacity>

            <View className="px-6 pb-10">
              {/* Header */}
              <View className="mb-8">
                <View className="w-14 h-14 rounded-2xl bg-blue-500 items-center justify-center mb-5">
                  <Text className="text-white text-2xl font-black">A</Text>
                </View>
                <Text className="text-white text-3xl font-bold mb-1">Create Account</Text>
                <Text className="text-slate-400 text-base">
                  Get started with Altrix for free
                </Text>
              </View>

              {/* Section: Company */}
              <Text className="text-slate-500 text-xs font-semibold tracking-widest mb-3 uppercase">
                Company Info
              </Text>
              <Input
                label="Company Name"
                placeholder="Acme Corporation"
                iconName="business-outline"
                value={form.company}
                onChangeText={set("company")}
                error={errors.company}
              />
              <Input
                label="Your Full Name"
                placeholder="Jane Smith"
                iconName="person-outline"
                value={form.displayName}
                onChangeText={set("displayName")}
                error={errors.displayName}
              />

              {/* Section: Contact */}
              <Text className="text-slate-500 text-xs font-semibold tracking-widest mb-3 mt-2 uppercase">
                Contact Details
              </Text>
              <Input
                label="Work Email"
                placeholder="you@company.com"
                iconName="mail-outline"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={form.email}
                onChangeText={set("email")}
                error={errors.email}
              />
              <Input
                label="Phone (optional)"
                placeholder="+1 555 000 0000"
                iconName="call-outline"
                keyboardType="phone-pad"
                value={form.phone}
                onChangeText={set("phone")}
              />

              {/* Section: Security */}
              <Text className="text-slate-500 text-xs font-semibold tracking-widest mb-3 mt-2 uppercase">
                Security
              </Text>
              <Input
                label="Password"
                placeholder="Min. 8 characters"
                iconName="lock-closed-outline"
                isPassword
                value={form.password}
                onChangeText={set("password")}
                error={errors.password}
                hint="Use a mix of letters, numbers, and symbols"
              />
              <Input
                label="Confirm Password"
                placeholder="Repeat your password"
                iconName="lock-closed-outline"
                isPassword
                value={form.confirm}
                onChangeText={set("confirm")}
                error={errors.confirm}
              />

              {/* Submit */}
              <Button
                title="Create Account"
                onPress={handleRegister}
                loading={loading}
                fullWidth
                size="lg"
              />

              <Text className="text-slate-600 text-xs text-center mt-4 px-4 leading-5">
                By creating an account you agree to our Terms of Service and Privacy Policy.
              </Text>

              {/* Login link */}
              <View className="flex-row justify-center mt-5">
                <Text className="text-slate-400 text-sm">Already have an account? </Text>
                <TouchableOpacity onPress={() => router.back()}>
                  <Text className="text-blue-400 text-sm font-semibold">Sign In</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}
