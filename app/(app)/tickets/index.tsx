import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Badge } from "../../../components/ui/Badge";
import { subscribeToUserTickets } from "../../../lib/tickets";
import { useAuth } from "../../../store/authContext";
import { Ticket, TicketStatus } from "../../../types";

type IoniconName = keyof typeof Ionicons.glyphMap;

const FILTER_TABS: { label: string; value: TicketStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Open", value: "open" },
  { label: "In Progress", value: "in-progress" },
  { label: "Resolved", value: "resolved" },
  { label: "Closed", value: "closed" },
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

const CATEGORY_ICONS: Record<string, IoniconName> = {
  hardware: "hardware-chip-outline",
  software: "code-slash-outline",
  network: "git-network-outline",
  security: "shield-outline",
  cloud: "cloud-outline",
  other: "help-circle-outline",
};

const STAT_CARDS: {
  status: TicketStatus;
  label: string;
  icon: IoniconName;
  bg: string;
  border: string;
  textColor: string;
  iconColor: string;
  numColor: string;
}[] = [
  {
    status: "open",
    label: "Open",
    icon: "folder-open-outline",
    bg: "bg-blue-500/10",
    border: "border-blue-500/25",
    textColor: "text-blue-400",
    iconColor: "#60A5FA",
    numColor: "text-white",
  },
  {
    status: "in-progress",
    label: "In Progress",
    icon: "sync-outline",
    bg: "bg-amber-500/10",
    border: "border-amber-500/25",
    textColor: "text-amber-400",
    iconColor: "#FCD34D",
    numColor: "text-white",
  },
  {
    status: "resolved",
    label: "Resolved",
    icon: "checkmark-circle-outline",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/25",
    textColor: "text-emerald-400",
    iconColor: "#34D399",
    numColor: "text-white",
  },
  {
    status: "closed",
    label: "Closed",
    icon: "archive-outline",
    bg: "bg-slate-700/30",
    border: "border-slate-600/30",
    textColor: "text-slate-400",
    iconColor: "#94A3B8",
    numColor: "text-slate-300",
  },
];

function formatRelativeTime(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

function StatCard({
  card,
  count,
  onPress,
}: {
  card: (typeof STAT_CARDS)[number];
  count: number;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      className={`flex-1 ${card.bg} border ${card.border} rounded-2xl p-4`}
    >
      <View className="flex-row items-center justify-between mb-3">
        <Ionicons name={card.icon} size={20} color={card.iconColor} />
      </View>
      <Text className={`text-3xl font-bold ${card.numColor} mb-1`}>
        {count}
      </Text>
      <Text className={`text-xs font-medium ${card.textColor}`}>
        {card.label}
      </Text>
    </TouchableOpacity>
  );
}

function TicketCard({ ticket }: { ticket: Ticket }) {
  const catIcon = CATEGORY_ICONS[ticket.category] ?? "help-circle-outline";
  return (
    <TouchableOpacity
      className="bg-[#111827] border border-slate-700/40 rounded-2xl p-4 mb-3"
      activeOpacity={0.85}
    >
      {/* Priority bar */}
      <View
        className={`absolute left-0 top-4 bottom-4 w-1 rounded-r-full ${
          ticket.priority === "critical"
            ? "bg-red-500"
            : ticket.priority === "high"
              ? "bg-orange-500"
              : ticket.priority === "medium"
                ? "bg-amber-500"
                : "bg-slate-600"
        }`}
      />
      <View className="pl-3">
        <Text
          className="text-white text-sm font-semibold mb-1 leading-5"
          numberOfLines={2}
        >
          {ticket.title}
        </Text>
        <Text
          className="text-slate-500 text-xs mb-3 leading-4"
          numberOfLines={1}
        >
          {ticket.description}
        </Text>
        <View className="flex-row items-center gap-2 flex-wrap">
          <Badge
            label={statusLabel[ticket.status]}
            variant={statusVariant[ticket.status]}
            size="xs"
          />
          <Badge
            label={
              ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)
            }
            variant={priorityVariant[ticket.priority]}
            size="xs"
          />
          <View className="flex-row items-center">
            <Ionicons
              name={catIcon}
              size={11}
              color="#475569"
              style={{ marginRight: 3 }}
            />
            <Text className="text-slate-500 text-[10px] capitalize">
              {ticket.category}
            </Text>
          </View>
          <Text className="text-slate-600 text-[10px] ml-auto">
            {formatRelativeTime(ticket.createdAt)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function TicketsScreen() {
  const { firebaseUser } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<TicketStatus | "all">("all");

  useEffect(() => {
    if (!firebaseUser) {
      setLoading(false);
      return;
    }
    const unsubscribe = subscribeToUserTickets(firebaseUser.uid, (data) => {
      setTickets(data);
      setLoading(false);
    });
    return unsubscribe;
  }, [firebaseUser]);

  const countOf = (s: TicketStatus) =>
    tickets.filter((t) => t.status === s).length;
  const filtered =
    activeFilter === "all"
      ? tickets
      : tickets.filter((t) => t.status === activeFilter);

  return (
    <View className="flex-1 bg-[#0A0F1E]">
      <SafeAreaView className="flex-1" edges={["top"]}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 pt-2 pb-4">
          <View>
            <Text className="text-white text-2xl font-bold">
              Support Tickets
            </Text>
            <Text className="text-slate-400 text-sm">
              {tickets.length} total · {countOf("open")} open
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push("/(app)/tickets/new")}
            className="flex-row items-center bg-blue-500 rounded-xl px-4 py-2.5 active:bg-blue-600"
          >
            <Ionicons
              name="add"
              size={18}
              color="white"
              style={{ marginRight: 4 }}
            />
            <Text className="text-white font-semibold text-sm">New</Text>
          </TouchableOpacity>
        </View>

        {/* Stats grid */}
        <View className="px-5 mb-5">
          <View className="flex-row gap-3 mb-3">
            {STAT_CARDS.slice(0, 2).map((card) => (
              <StatCard
                key={card.status}
                card={card}
                count={countOf(card.status)}
                onPress={() => setActiveFilter(card.status)}
              />
            ))}
          </View>
          <View className="flex-row gap-3">
            {STAT_CARDS.slice(2).map((card) => (
              <StatCard
                key={card.status}
                card={card}
                count={countOf(card.status)}
                onPress={() => setActiveFilter(card.status)}
              />
            ))}
          </View>
        </View>

        {/* Filter tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-4"
          style={{ flexGrow: 0 }}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
        >
          {FILTER_TABS.map((tab) => {
            const count =
              tab.value === "all"
                ? tickets.length
                : countOf(tab.value as TicketStatus);
            const active = activeFilter === tab.value;
            return (
              <TouchableOpacity
                key={tab.value}
                onPress={() => setActiveFilter(tab.value)}
                className={`flex-row items-center px-4 py-2 rounded-full border ${
                  active
                    ? "bg-blue-500 border-blue-500"
                    : "bg-slate-800/60 border-slate-700/50"
                }`}
              >
                <Text
                  className={`text-sm font-semibold ${active ? "text-white" : "text-slate-400"}`}
                >
                  {tab.label}
                </Text>
                <View
                  className={`ml-1.5 px-1.5 py-0.5 rounded-full ${
                    active ? "bg-white/25" : "bg-slate-700/80"
                  }`}
                >
                  <Text
                    className={`text-[10px] font-bold ${active ? "text-white" : "text-slate-400"}`}
                  >
                    {count}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Ticket list */}
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        >
          {loading ? (
            <View className="items-center py-20">
              <ActivityIndicator color="#3B82F6" size="large" />
              <Text className="text-slate-500 text-sm mt-3">
                Loading tickets...
              </Text>
            </View>
          ) : filtered.length === 0 ? (
            <View className="items-center py-20">
              <Ionicons name="receipt-outline" size={48} color="#1E293B" />
              <Text className="text-slate-600 text-base mt-3">
                No tickets here
              </Text>
              <Text className="text-slate-700 text-sm mt-1">
                {activeFilter === "all"
                  ? "Create your first ticket"
                  : "Filtered results will appear here"}
              </Text>
            </View>
          ) : (
            filtered.map((t) => <TicketCard key={t.id} ticket={t} />)
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
