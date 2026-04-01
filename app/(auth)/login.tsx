import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { AntDesign } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import {
  useAuthRequest,
  makeRedirectUri,
  ResponseType,
} from "expo-auth-session";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { login, googleSignIn, checkHasProfile } from "../../lib/auth";

WebBrowser.maybeCompleteAuthSession();

// ─── Google OAuth setup ────────────────────────────────────────────────────
// 1. Firebase Console → Authentication → Sign-in method → Google → Enable
// 2. Copy "Web client ID" from the Web SDK configuration panel
// 3. Add your app's redirect URI (shown in console logs on first run) to
//    Google Cloud Console → Credentials → OAuth 2.0 Client → Authorised redirect URIs
const GOOGLE_WEB_CLIENT_ID = "YOUR_WEB_CLIENT_ID.apps.googleusercontent.com";
// ──────────────────────────────────────────────────────────────────────────

const GOOGLE_DISCOVERY = {
  authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
  tokenEndpoint: "https://oauth2.googleapis.com/token",
  revocationEndpoint: "https://oauth2.googleapis.com/revoke",
};

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const redirectUri = makeRedirectUri({ scheme: "altrix" });

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: GOOGLE_WEB_CLIENT_ID,
      scopes: ["openid", "profile", "email"],
      redirectUri,
      responseType: ResponseType.Token,
    },
    GOOGLE_DISCOVERY
  );

  useEffect(() => {
    if (response?.type === "success") {
      const accessToken = response.params?.access_token;
      if (accessToken) handleGoogleToken(accessToken);
    } else if (response?.type === "error") {
      Alert.alert("Google Sign-In Failed", response.error?.message ?? "Please try again.");
    }
  }, [response]);

  async function handleGoogleToken(accessToken: string) {
    setGoogleLoading(true);
    try {
      const result = await googleSignIn(accessToken);
      const hasProfile = await checkHasProfile(result.user.uid);
      router.replace(hasProfile ? "/(app)/home" : "/(auth)/onboarding");
    } catch {
      Alert.alert("Sign-In Failed", "Google sign-in failed. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  }

  function validate() {
    const e: typeof errors = {};
    if (!email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email";
    if (!password) e.password = "Password is required";
    else if (password.length < 6) e.password = "Minimum 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleLogin() {
    if (!validate()) return;
    setLoading(true);
    try {
      const result = await login(email.trim(), password);
      const hasProfile = await checkHasProfile(result.user.uid);
      router.replace(hasProfile ? "/(app)/home" : "/(auth)/onboarding");
    } catch (err: any) {
      const msg =
        err.code === "auth/invalid-credential"
          ? "Invalid email or password."
          : "Sign in failed. Please try again.";
      Alert.alert("Sign In Failed", msg);
    } finally {
      setLoading(false);
    }
  }

  const busy = loading || googleLoading;

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
            <View className="flex-1 px-6 pb-8 pt-6">
              {/* Header */}
              <View className="mb-8">
                <View className="w-14 h-14 rounded-2xl bg-blue-500 items-center justify-center mb-5">
                  <Text className="text-white text-2xl font-black">A</Text>
                </View>
                <Text className="text-white text-3xl font-bold mb-1">Welcome back</Text>
                <Text className="text-slate-400 text-base">Sign in to your Altrix account</Text>
              </View>

              {/* Google button */}
              <TouchableOpacity
                onPress={() => promptAsync()}
                disabled={!request || busy}
                className="flex-row items-center justify-center bg-white rounded-xl py-3.5 mb-5 active:opacity-80"
                style={{ opacity: !request || busy ? 0.6 : 1 }}
              >
                {googleLoading ? (
                  <ActivityIndicator color="#1E293B" size="small" />
                ) : (
                  <>
                    <AntDesign name="google" size={18} color="#EA4335" />
                    <Text className="text-slate-800 font-semibold text-base ml-2.5">
                      Continue with Google
                    </Text>
                  </>
                )}
              </TouchableOpacity>

              {/* Divider */}
              <View className="flex-row items-center mb-5">
                <View className="flex-1 h-px bg-slate-700/60" />
                <Text className="text-slate-600 text-xs mx-3 font-medium">
                  OR SIGN IN WITH EMAIL
                </Text>
                <View className="flex-1 h-px bg-slate-700/60" />
              </View>

              {/* Email/password form */}
              <Input
                label="Email Address"
                placeholder="you@company.com"
                iconName="mail-outline"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={setEmail}
                error={errors.email}
              />
              <Input
                label="Password"
                placeholder="Enter your password"
                iconName="lock-closed-outline"
                isPassword
                value={password}
                onChangeText={setPassword}
                error={errors.password}
              />

              <TouchableOpacity className="self-end mb-6">
                <Text className="text-blue-400 text-sm font-medium">Forgot password?</Text>
              </TouchableOpacity>

              <Button
                title="Sign In"
                onPress={handleLogin}
                loading={loading}
                disabled={googleLoading}
                fullWidth
                size="lg"
              />

              <View className="flex-row justify-center mt-6">
                <Text className="text-slate-400 text-sm">Don't have an account? </Text>
                <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
                  <Text className="text-blue-400 text-sm font-semibold">Create one</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}
