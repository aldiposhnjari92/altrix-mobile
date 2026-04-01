import React from "react";
import { View, Text } from "react-native";

type Variant = "success" | "warning" | "danger" | "critical" | "info" | "neutral";

interface BadgeProps {
  label: string;
  variant?: Variant;
  size?: "xs" | "sm";
}

const styles: Record<Variant, { wrap: string; text: string; dot: string }> = {
  success:  { wrap: "bg-emerald-900/60", text: "text-emerald-400", dot: "bg-emerald-400" },
  warning:  { wrap: "bg-amber-900/60",   text: "text-amber-400",   dot: "bg-amber-400" },
  danger:   { wrap: "bg-red-900/60",     text: "text-red-400",     dot: "bg-red-400" },
  critical: { wrap: "bg-red-900/80",     text: "text-red-300",     dot: "bg-red-400" },
  info:     { wrap: "bg-blue-900/60",    text: "text-blue-400",    dot: "bg-blue-400" },
  neutral:  { wrap: "bg-slate-700/60",   text: "text-slate-400",   dot: "bg-slate-400" },
};

export function Badge({ label, variant = "neutral", size = "sm" }: BadgeProps) {
  const s = styles[variant];
  const textClass = size === "xs" ? "text-[10px]" : "text-xs";
  return (
    <View className={`flex-row items-center ${s.wrap} px-2.5 py-1 rounded-full`}>
      <View className={`w-1.5 h-1.5 rounded-full ${s.dot} mr-1.5`} />
      <Text className={`${s.text} ${textClass} font-semibold`}>{label}</Text>
    </View>
  );
}
