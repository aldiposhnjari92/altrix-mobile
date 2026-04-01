import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SERVICES, SERVICE_CATEGORIES } from "../../constants/services";
import { Service } from "../../types";

type IoniconName = keyof typeof Ionicons.glyphMap;

const CATEGORY_ICONS: Record<string, IoniconName> = {
  Cloud: "cloud-outline",
  Security: "shield-checkmark-outline",
  Network: "git-network-outline",
  Support: "headset-outline",
  Data: "server-outline",
  Software: "code-slash-outline",
  Consulting: "analytics-outline",
  Managed: "settings-outline",
};

const CATEGORY_COLORS: Record<string, string> = {
  Cloud: "#3B82F6",
  Security: "#10B981",
  Network: "#8B5CF6",
  Support: "#F59E0B",
  Data: "#06B6D4",
  Software: "#EC4899",
  Consulting: "#F97316",
  Managed: "#6366F1",
};

function ServiceCard({ service }: { service: Service }) {
  const [expanded, setExpanded] = useState(false);
  const color = CATEGORY_COLORS[service.category] ?? "#3B82F6";
  const icon = (CATEGORY_ICONS[service.category] ??
    "cube-outline") as IoniconName;

  return (
    <TouchableOpacity
      onPress={() => setExpanded((e) => !e)}
      className="bg-[#111827] border border-slate-700/40 rounded-2xl p-4 mb-3"
      activeOpacity={0.85}
    >
      {/* Top row */}
      <View className="flex-row items-start">
        <View
          className="w-11 h-11 rounded-xl items-center justify-center mr-3"
          style={{ backgroundColor: `${color}20` }}
        >
          <Ionicons name={icon} size={22} color={color} />
        </View>
        <View className="flex-1">
          <View className="flex-row items-center justify-between">
            <Text
              className="text-white text-base font-bold flex-1 mr-2"
              numberOfLines={1}
            >
              {service.name}
            </Text>
            {service.popular ? (
              <View className="bg-blue-500/20 px-2 py-0.5 rounded-full">
                <Text className="text-blue-400 text-[10px] font-bold">
                  POPULAR
                </Text>
              </View>
            ) : null}
          </View>
          <Text
            className="text-slate-400 text-xs mt-0.5 leading-4"
            numberOfLines={expanded ? undefined : 2}
          >
            {service.description}
          </Text>
        </View>
      </View>

      {/* Pricing */}
      {service.pricing ? (
        <View className="flex-row items-center mt-3">
          <Text className="text-blue-400 text-sm font-bold">
            {service.pricing}
          </Text>
        </View>
      ) : null}

      {/* Expanded features */}
      {expanded ? (
        <View className="mt-3 pt-3 border-t border-slate-700/50">
          <Text className="text-slate-400 text-xs font-semibold tracking-widest uppercase mb-2">
            What&apos;s included
          </Text>
          {service.features.map((f) => (
            <View key={f} className="flex-row items-center mb-1.5">
              <Ionicons
                name="checkmark-circle"
                size={14}
                color={color}
                style={{ marginRight: 8 }}
              />
              <Text className="text-slate-300 text-sm">{f}</Text>
            </View>
          ))}
          <TouchableOpacity className="mt-3 rounded-xl py-3 items-center border border-blue-500/50 bg-blue-500/10">
            <Text className="text-blue-400 font-semibold text-sm">
              Request This Service
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {/* Expand chevron */}
      <View className="absolute bottom-4 right-4">
        <Ionicons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={16}
          color="#475569"
        />
      </View>
    </TouchableOpacity>
  );
}

export default function ServicesScreen() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = useMemo(() => {
    return SERVICES.filter((s) => {
      const matchCat =
        activeCategory === "All" || s.category === activeCategory;
      const matchSearch =
        !search.trim() ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.description.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [search, activeCategory]);

  return (
    <View className="flex-1 bg-[#0A0F1E]">
      <SafeAreaView className="flex-1" edges={["top"]}>
        {/* Header */}
        <View className="px-5 pt-2 pb-4">
          <Text className="text-white text-2xl font-bold mb-1">
            IT Services
          </Text>
          <Text className="text-slate-400 text-sm">
            {SERVICES.length} services available for your business
          </Text>
        </View>

        {/* Search */}
        <View className="mx-5 mb-4 flex-row items-center bg-slate-800/80 border border-slate-700/50 rounded-xl px-4">
          <Ionicons
            name="search-outline"
            size={18}
            color="#475569"
            style={{ marginRight: 10 }}
          />
          <TextInput
            className="flex-1 text-slate-100 text-base py-3.5"
            placeholder="Search services..."
            placeholderTextColor="#475569"
            value={search}
            onChangeText={setSearch}
          />
          {search ? (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Ionicons name="close-circle" size={18} color="#475569" />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Category filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-4"
          style={{ flexGrow: 0 }}
          contentContainerStyle={{
            paddingHorizontal: 20,
            gap: 8,
            alignItems: "center", // keeps items aligned nicely
          }}
        >
          {SERVICE_CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full border ${
                activeCategory === cat
                  ? "bg-blue-500 border-blue-500"
                  : "bg-slate-800/60 border-slate-700/50"
              }`}
            >
              <Text
                className={`text-sm font-semibold ${
                  activeCategory === cat ? "text-white" : "text-slate-400"
                }`}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Results count */}
        <Text className="text-slate-500 text-xs px-5 mb-3">
          {filtered.length} result{filtered.length !== 1 ? "s" : ""}
        </Text>

        {/* Services list */}
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        >
          {filtered.length === 0 ? (
            <View className="items-center py-16">
              <Ionicons name="search-outline" size={48} color="#334155" />
              <Text className="text-slate-600 text-base mt-3">
                No services found
              </Text>
              <Text className="text-slate-700 text-sm mt-1">
                Try a different search or category
              </Text>
            </View>
          ) : (
            filtered.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
