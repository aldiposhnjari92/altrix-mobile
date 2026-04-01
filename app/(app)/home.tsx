import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Badge } from "../../components/ui/Badge";
import { useAuth } from "../../store/authContext";

type IoniconName = keyof typeof Ionicons.glyphMap;

const STATS = [
  {
    label: "Open Tickets",
    value: "3",
    icon: "receipt-outline" as IoniconName,
    color: "#F59E0B",
    bg: "bg-amber-900/40",
  },
  {
    label: "Active Services",
    value: "4",
    icon: "cube-outline" as IoniconName,
    color: "#3B82F6",
    bg: "bg-blue-900/40",
  },
  {
    label: "Resolved",
    value: "12",
    icon: "checkmark-circle-outline" as IoniconName,
    color: "#10B981",
    bg: "bg-emerald-900/40",
  },
];

const QUICK_ACTIONS = [
  {
    icon: "add-circle-outline" as IoniconName,
    label: "New Ticket",
    color: "#3B82F6",
    bg: "bg-blue-500/15",
    route: "/(app)/tickets/new" as const,
  },
  {
    icon: "apps-outline" as IoniconName,
    label: "Services",
    color: "#8B5CF6",
    bg: "bg-violet-500/15",
    route: "/(app)/services" as const,
  },
  {
    icon: "headset-outline" as IoniconName,
    label: "Support",
    color: "#10B981",
    bg: "bg-emerald-500/15",
    route: "/(app)/tickets" as const,
  },
  {
    icon: "document-text-outline" as IoniconName,
    label: "Reports",
    color: "#F59E0B",
    bg: "bg-amber-500/15",
    route: "/(app)/profile" as const,
  },
];

const RECENT_TICKETS = [
  {
    id: "1",
    title: "VPN connection drops every 30 minutes",
    category: "Network",
    priority: "high" as const,
    status: "in-progress" as const,
    time: "2h ago",
  },
  {
    id: "2",
    title: "Email client not syncing on mobile",
    category: "Software",
    priority: "medium" as const,
    status: "open" as const,
    time: "5h ago",
  },
  {
    id: "3",
    title: "Laptop battery replacement needed",
    category: "Hardware",
    priority: "low" as const,
    status: "open" as const,
    time: "1d ago",
  },
];

const priorityVariant = {
  low: "neutral",
  medium: "warning",
  high: "danger",
  critical: "critical",
} as const;

const statusVariant = {
  open: "info",
  "in-progress": "warning",
  resolved: "success",
  closed: "neutral",
} as const;

const statusLabel = {
  open: "Open",
  "in-progress": "In Progress",
  resolved: "Resolved",
  closed: "Closed",
} as const;

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function HomeScreen() {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const companyName = user?.company ?? "Your Company";
  const firstName = user?.displayName?.split(" ")[0] ?? "there";

  function onRefresh() {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  }

  return (
    <View className="flex-1 bg-[#0A0F1E]">
      <SafeAreaView className="flex-1" edges={["top"]}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 pt-2 pb-4">
          <View>
            <Text className="text-slate-400 text-sm">
              {getGreeting()}, {firstName} 👋
            </Text>
            <Text className="text-white text-xl font-bold">{companyName}</Text>
          </View>
          <View className="flex-row gap-2">
            <TouchableOpacity className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700/50 items-center justify-center">
              <Ionicons name="search-outline" size={18} color="#94A3B8" />
            </TouchableOpacity>
            <TouchableOpacity className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700/50 items-center justify-center">
              <Ionicons
                name="notifications-outline"
                size={18}
                color="#94A3B8"
              />
              {/* Unread dot */}
              <View className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#3B82F6"
            />
          }
        >
          {/* Stats */}
          <View className="flex-row px-5 gap-3 mb-6">
            {STATS.map((s) => (
              <View
                key={s.label}
                className="flex-1 bg-[#111827] border border-slate-700/40 rounded-2xl p-3.5 items-center"
              >
                <View
                  className={`w-9 h-9 rounded-xl ${s.bg} items-center justify-center mb-2`}
                >
                  <Ionicons name={s.icon} size={18} color={s.color} />
                </View>
                <Text className="text-white text-xl font-bold">{s.value}</Text>
                <Text className="text-slate-500 text-[10px] text-center mt-0.5">
                  {s.label}
                </Text>
              </View>
            ))}
          </View>

          {/* Quick Actions */}
          <View className="px-5 mb-6">
            <Text className="text-white text-base font-bold mb-3">
              Quick Actions
            </Text>
            <View className="flex-row gap-3">
              {QUICK_ACTIONS.map((a) => (
                <TouchableOpacity
                  key={a.label}
                  onPress={() => router.push(a.route)}
                  className={`flex-1 ${a.bg} border border-slate-700/30 rounded-2xl py-4 items-center`}
                >
                  <Ionicons name={a.icon} size={22} color={a.color} />
                  <Text className="text-slate-300 text-[11px] font-semibold mt-1.5 text-center">
                    {a.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Recent Tickets */}
          <View className="px-5 mb-6">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-white text-base font-bold">
                Recent Tickets
              </Text>
              <TouchableOpacity onPress={() => router.push("/(app)/tickets")}>
                <Text className="text-blue-400 text-sm font-medium">
                  See all
                </Text>
              </TouchableOpacity>
            </View>
            <View className="gap-3">
              {RECENT_TICKETS.map((t) => (
                <TouchableOpacity
                  key={t.id}
                  className="bg-[#111827] border border-slate-700/40 rounded-2xl p-4"
                >
                  <View className="flex-row items-start justify-between mb-2">
                    <Text
                      className="text-white text-sm font-semibold flex-1 mr-2"
                      numberOfLines={1}
                    >
                      {t.title}
                    </Text>
                    <Badge
                      label={
                        t.priority.charAt(0).toUpperCase() + t.priority.slice(1)
                      }
                      variant={priorityVariant[t.priority]}
                      size="xs"
                    />
                  </View>
                  <View className="flex-row items-center gap-2">
                    <Badge
                      label={statusLabel[t.status]}
                      variant={statusVariant[t.status]}
                      size="xs"
                    />
                    <View className="w-1 h-1 rounded-full bg-slate-600" />
                    <Text className="text-slate-500 text-xs">{t.category}</Text>
                    <View className="w-1 h-1 rounded-full bg-slate-600" />
                    <Text className="text-slate-500 text-xs">{t.time}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Active Services Summary */}
          <View className="px-5 mb-8">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-white text-base font-bold">
                Active Services
              </Text>
              <TouchableOpacity onPress={() => router.push("/(app)/services")}>
                <Text className="text-blue-400 text-sm font-medium">
                  Browse all
                </Text>
              </TouchableOpacity>
            </View>
            {[
              {
                name: "Cloud Infrastructure",
                icon: "cloud" as IoniconName,
                color: "#3B82F6",
                status: "Operational",
              },
              {
                name: "Cybersecurity",
                icon: "shield-checkmark" as IoniconName,
                color: "#10B981",
                status: "Protected",
              },
              {
                name: "IT Helpdesk",
                icon: "headset" as IoniconName,
                color: "#8B5CF6",
                status: "Available",
              },
            ].map((svc) => (
              <View
                key={svc.name}
                className="bg-[#111827] border border-slate-700/40 rounded-xl px-4 py-3.5 mb-2 flex-row items-center"
              >
                <View className="w-9 h-9 rounded-xl bg-slate-700/60 items-center justify-center mr-3">
                  <Ionicons name={svc.icon} size={18} color={svc.color} />
                </View>
                <View className="flex-1">
                  <Text className="text-slate-200 text-sm font-semibold">
                    {svc.name}
                  </Text>
                  <Text className="text-slate-500 text-xs">{svc.status}</Text>
                </View>
                <View className="w-2 h-2 rounded-full bg-emerald-400" />
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
