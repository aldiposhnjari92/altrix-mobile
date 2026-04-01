import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../store/authContext";
import { logout } from "../../lib/auth";

type IoniconName = keyof typeof Ionicons.glyphMap;

const PLAN_COLORS = {
  basic:        { text: "text-slate-400",   bg: "bg-slate-700/60",   label: "Basic" },
  professional: { text: "text-blue-400",    bg: "bg-blue-900/50",    label: "Professional" },
  enterprise:   { text: "text-amber-400",   bg: "bg-amber-900/50",   label: "Enterprise" },
} as const;

interface SettingRowProps {
  icon: IoniconName;
  label: string;
  value?: string;
  iconBg?: string;
  iconColor?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  danger?: boolean;
}

function SettingRow({
  icon,
  label,
  value,
  iconBg = "bg-slate-700",
  iconColor = "#94A3B8",
  onPress,
  rightElement,
  danger = false,
}: SettingRowProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress && !rightElement}
      className="flex-row items-center px-4 py-3.5"
    >
      <View className={`w-9 h-9 rounded-xl ${iconBg} items-center justify-center mr-3`}>
        <Ionicons name={icon} size={18} color={danger ? "#EF4444" : iconColor} />
      </View>
      <View className="flex-1">
        <Text className={`text-sm font-semibold ${danger ? "text-red-400" : "text-slate-200"}`}>
          {label}
        </Text>
        {value ? <Text className="text-slate-500 text-xs mt-0.5">{value}</Text> : null}
      </View>
      {rightElement ?? (
        onPress ? <Ionicons name="chevron-forward" size={16} color="#334155" /> : null
      )}
    </TouchableOpacity>
  );
}

function Divider() {
  return <View className="h-px bg-slate-700/40 mx-4" />;
}

export default function ProfileScreen() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  const plan = user?.subscription ?? "basic";
  const planStyle = PLAN_COLORS[plan];

  async function handleLogout() {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          setLoggingOut(true);
          try {
            await logout();
            router.replace("/");
          } finally {
            setLoggingOut(false);
          }
        },
      },
    ]);
  }

  return (
    <View className="flex-1 bg-[#0A0F1E]">
      <SafeAreaView className="flex-1" edges={["top"]}>
        {/* Header */}
        <View className="px-5 pt-2 pb-4">
          <Text className="text-white text-2xl font-bold">Profile</Text>
          <Text className="text-slate-400 text-sm">Manage your account & settings</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
          {/* Company Card */}
          <View className="mx-5 mb-4 bg-[#111827] border border-slate-700/40 rounded-2xl p-5">
            <View className="flex-row items-center mb-4">
              {/* Avatar */}
              <View className="w-16 h-16 rounded-2xl bg-blue-500 items-center justify-center mr-4">
                <Text className="text-white text-2xl font-black">
                  {(user?.company?.[0] ?? "A").toUpperCase()}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="text-white text-lg font-bold" numberOfLines={1}>
                  {user?.company ?? "Your Company"}
                </Text>
                <Text className="text-slate-400 text-sm" numberOfLines={1}>
                  {user?.displayName ?? "Account Owner"}
                </Text>
                <View className="flex-row items-center mt-1.5">
                  <View className={`${planStyle.bg} px-2.5 py-0.5 rounded-full`}>
                    <Text className={`${planStyle.text} text-xs font-bold`}>
                      {planStyle.label} Plan
                    </Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity className="w-9 h-9 rounded-xl bg-slate-700/60 items-center justify-center">
                <Ionicons name="pencil-outline" size={16} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            {/* Info rows */}
            <View className="gap-2">
              {[
                { icon: "mail-outline" as IoniconName,  label: user?.email ?? "—" },
                { icon: "call-outline" as IoniconName,  label: user?.phone || "No phone added" },
                { icon: "person-outline" as IoniconName, label: user?.role === "admin" ? "Administrator" : "Client" },
              ].map(({ icon, label }) => (
                <View key={icon} className="flex-row items-center">
                  <Ionicons name={icon} size={14} color="#475569" style={{ marginRight: 8 }} />
                  <Text className="text-slate-400 text-sm" numberOfLines={1}>{label}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Stats row */}
          <View className="flex-row mx-5 mb-4 gap-3">
            {[
              { label: "Tickets",   value: "8",  icon: "receipt-outline" as IoniconName,     color: "#3B82F6" },
              { label: "Resolved",  value: "12", icon: "checkmark-circle-outline" as IoniconName, color: "#10B981" },
              { label: "Services",  value: "4",  icon: "cube-outline" as IoniconName,          color: "#8B5CF6" },
            ].map((s) => (
              <View key={s.label} className="flex-1 bg-[#111827] border border-slate-700/40 rounded-xl p-3 items-center">
                <Ionicons name={s.icon} size={20} color={s.color} />
                <Text className="text-white font-bold text-lg mt-1">{s.value}</Text>
                <Text className="text-slate-500 text-xs">{s.label}</Text>
              </View>
            ))}
          </View>

          {/* Preferences */}
          <View className="mx-5 mb-4 bg-[#111827] border border-slate-700/40 rounded-2xl overflow-hidden">
            <Text className="text-slate-500 text-xs font-semibold tracking-widest uppercase px-4 pt-4 pb-2">
              Preferences
            </Text>
            <SettingRow
              icon="notifications-outline"
              iconBg="bg-blue-900/50"
              iconColor="#3B82F6"
              label="Push Notifications"
              value={notifications ? "Enabled" : "Disabled"}
              rightElement={
                <Switch
                  value={notifications}
                  onValueChange={setNotifications}
                  trackColor={{ false: "#1E293B", true: "#2563EB" }}
                  thumbColor={notifications ? "#FFFFFF" : "#475569"}
                />
              }
            />
            <Divider />
            <SettingRow
              icon="moon-outline"
              iconBg="bg-slate-700"
              label="Dark Mode"
              value="Always on"
              onPress={() => {}}
            />
            <Divider />
            <SettingRow
              icon="language-outline"
              iconBg="bg-slate-700"
              label="Language"
              value="English (US)"
              onPress={() => {}}
            />
          </View>

          {/* Account */}
          <View className="mx-5 mb-4 bg-[#111827] border border-slate-700/40 rounded-2xl overflow-hidden">
            <Text className="text-slate-500 text-xs font-semibold tracking-widest uppercase px-4 pt-4 pb-2">
              Account
            </Text>
            <SettingRow
              icon="card-outline"
              iconBg="bg-emerald-900/50"
              iconColor="#10B981"
              label="Subscription & Billing"
              value={planStyle.label + " Plan"}
              onPress={() => {}}
            />
            <Divider />
            <SettingRow
              icon="people-outline"
              iconBg="bg-violet-900/50"
              iconColor="#8B5CF6"
              label="Team Members"
              value="Manage access"
              onPress={() => {}}
            />
            <Divider />
            <SettingRow
              icon="lock-closed-outline"
              iconBg="bg-slate-700"
              label="Security"
              value="Change password, 2FA"
              onPress={() => {}}
            />
          </View>

          {/* Support */}
          <View className="mx-5 mb-4 bg-[#111827] border border-slate-700/40 rounded-2xl overflow-hidden">
            <Text className="text-slate-500 text-xs font-semibold tracking-widest uppercase px-4 pt-4 pb-2">
              Support
            </Text>
            <SettingRow icon="help-circle-outline"  iconBg="bg-slate-700" label="Help Center"    onPress={() => {}} />
            <Divider />
            <SettingRow icon="chatbubble-outline"   iconBg="bg-slate-700" label="Live Chat"      onPress={() => {}} />
            <Divider />
            <SettingRow icon="star-outline"         iconBg="bg-slate-700" label="Rate the App"   onPress={() => {}} />
            <Divider />
            <SettingRow icon="information-circle-outline" iconBg="bg-slate-700" label="About Altrix" value="v1.0.0" onPress={() => {}} />
          </View>

          {/* Sign Out */}
          <View className="mx-5 mb-4 bg-[#111827] border border-red-900/30 rounded-2xl overflow-hidden">
            <SettingRow
              icon="log-out-outline"
              iconBg="bg-red-900/40"
              label={loggingOut ? "Signing out..." : "Sign Out"}
              onPress={handleLogout}
              danger
            />
          </View>

          <Text className="text-slate-700 text-xs text-center">
            Altrix Enterprise IT · v1.0.0
          </Text>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
