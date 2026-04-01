import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "../../../components/ui/Button";
import { TicketCategory, TicketPriority } from "../../../types";

type IoniconName = keyof typeof Ionicons.glyphMap;

const CATEGORIES: { value: TicketCategory; label: string; icon: IoniconName; color: string }[] = [
  { value: "hardware", label: "Hardware",  icon: "hardware-chip-outline", color: "#F97316" },
  { value: "software", label: "Software",  icon: "code-slash-outline",    color: "#8B5CF6" },
  { value: "network",  label: "Network",   icon: "git-network-outline",   color: "#3B82F6" },
  { value: "security", label: "Security",  icon: "shield-outline",        color: "#10B981" },
  { value: "cloud",    label: "Cloud",     icon: "cloud-outline",         color: "#06B6D4" },
  { value: "other",    label: "Other",     icon: "help-circle-outline",   color: "#94A3B8" },
];

const PRIORITIES: { value: TicketPriority; label: string; desc: string; color: string; bg: string }[] = [
  { value: "low",      label: "Low",      desc: "Minor issue, no urgency",         color: "#94A3B8", bg: "bg-slate-700/50" },
  { value: "medium",   label: "Medium",   desc: "Affects work but has workaround", color: "#F59E0B", bg: "bg-amber-900/40" },
  { value: "high",     label: "High",     desc: "Blocking productivity",           color: "#F97316", bg: "bg-orange-900/40" },
  { value: "critical", label: "Critical", desc: "System down, immediate action",   color: "#EF4444", bg: "bg-red-900/50" },
];

export default function NewTicketScreen() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<TicketCategory | null>(null);
  const [priority, setPriority] = useState<TicketPriority | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; description?: string; category?: string; priority?: string }>({});

  function validate() {
    const e: typeof errors = {};
    if (!title.trim())       e.title       = "Please provide a title";
    if (!description.trim()) e.description = "Please describe the issue";
    if (!category)           e.category    = "Select a category";
    if (!priority)           e.priority    = "Select a priority level";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setLoading(true);
    try {
      // createTicket(userId, { title, description, category, priority }) — wire up after Firebase setup
      await new Promise((r) => setTimeout(r, 1200)); // simulate network
      Alert.alert(
        "Ticket Submitted",
        "Your support ticket has been created. Our team will respond shortly.",
        [{ text: "OK", onPress: () => router.back() }]
      );
    } catch {
      Alert.alert("Error", "Failed to submit ticket. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="flex-1 bg-[#0A0F1E]">
      <SafeAreaView className="flex-1" edges={["top"]}>
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          {/* Header */}
          <View className="flex-row items-center px-5 pt-2 pb-4">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700/50 items-center justify-center mr-3"
            >
              <Ionicons name="arrow-back" size={20} color="#94A3B8" />
            </TouchableOpacity>
            <View>
              <Text className="text-white text-xl font-bold">New Ticket</Text>
              <Text className="text-slate-400 text-xs">Describe your issue</Text>
            </View>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}
          >
            {/* Title */}
            <Text className="text-slate-300 text-sm font-medium mb-1.5">Issue Title</Text>
            <View className={`bg-slate-800/80 border rounded-xl px-4 mb-1 ${errors.title ? "border-red-500" : "border-slate-700"}`}>
              <TextInput
                className="text-slate-100 text-base py-3.5"
                placeholder="Brief summary of the issue"
                placeholderTextColor="#475569"
                value={title}
                onChangeText={setTitle}
                maxLength={100}
              />
            </View>
            {errors.title ? <Text className="text-red-400 text-xs mb-3 ml-1">{errors.title}</Text> : <View className="mb-4" />}

            {/* Category */}
            <Text className="text-slate-300 text-sm font-medium mb-2">Category</Text>
            <View className="flex-row flex-wrap gap-2 mb-1">
              {CATEGORIES.map((c) => {
                const active = category === c.value;
                return (
                  <TouchableOpacity
                    key={c.value}
                    onPress={() => setCategory(c.value)}
                    className={`flex-row items-center px-3 py-2 rounded-xl border ${
                      active ? "border-transparent" : "border-slate-700/50 bg-slate-800/50"
                    }`}
                    style={active ? { backgroundColor: `${c.color}20`, borderColor: `${c.color}60` } : undefined}
                  >
                    <Ionicons name={c.icon} size={15} color={active ? c.color : "#64748B"} style={{ marginRight: 6 }} />
                    <Text className={`text-sm font-semibold ${active ? "" : "text-slate-400"}`}
                      style={active ? { color: c.color } : undefined}
                    >
                      {c.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            {errors.category ? <Text className="text-red-400 text-xs mb-3 ml-1">{errors.category}</Text> : <View className="mb-4" />}

            {/* Priority */}
            <Text className="text-slate-300 text-sm font-medium mb-2">Priority</Text>
            <View className="gap-2 mb-1">
              {PRIORITIES.map((p) => {
                const active = priority === p.value;
                return (
                  <TouchableOpacity
                    key={p.value}
                    onPress={() => setPriority(p.value)}
                    className={`flex-row items-center px-4 py-3 rounded-xl border ${
                      active
                        ? `${p.bg} border-transparent`
                        : "border-slate-700/50 bg-slate-800/50"
                    }`}
                    style={active ? { borderColor: `${p.color}40` } : undefined}
                  >
                    <View
                      className="w-3 h-3 rounded-full mr-3"
                      style={{ backgroundColor: p.color }}
                    />
                    <View className="flex-1">
                      <Text className={`text-sm font-bold ${active ? "" : "text-slate-300"}`}
                        style={active ? { color: p.color } : undefined}
                      >
                        {p.label}
                      </Text>
                      <Text className="text-slate-500 text-xs">{p.desc}</Text>
                    </View>
                    {active ? (
                      <Ionicons name="checkmark-circle" size={20} color={p.color} />
                    ) : null}
                  </TouchableOpacity>
                );
              })}
            </View>
            {errors.priority ? <Text className="text-red-400 text-xs mb-3 ml-1">{errors.priority}</Text> : <View className="mb-4" />}

            {/* Description */}
            <Text className="text-slate-300 text-sm font-medium mb-1.5">Description</Text>
            <View className={`bg-slate-800/80 border rounded-xl px-4 mb-1 ${errors.description ? "border-red-500" : "border-slate-700"}`}>
              <TextInput
                className="text-slate-100 text-base py-3.5"
                placeholder="Provide as much detail as possible — what happened, when did it start, who is affected, steps to reproduce..."
                placeholderTextColor="#475569"
                multiline
                numberOfLines={5}
                textAlignVertical="top"
                value={description}
                onChangeText={setDescription}
                style={{ minHeight: 120 }}
              />
            </View>
            {errors.description ? (
              <Text className="text-red-400 text-xs mb-3 ml-1">{errors.description}</Text>
            ) : (
              <Text className="text-slate-600 text-xs mb-4 ml-1">
                {description.length}/1000 characters
              </Text>
            )}

            {/* Submit */}
            <Button
              title="Submit Ticket"
              onPress={handleSubmit}
              loading={loading}
              fullWidth
              size="lg"
            />

            <Text className="text-slate-600 text-xs text-center mt-3">
              Average response time: under 2 hours
            </Text>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
