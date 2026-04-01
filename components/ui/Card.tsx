import React from "react";
import { View, ViewProps } from "react-native";

interface CardProps extends ViewProps {
  children: React.ReactNode;
  variant?: "default" | "elevated" | "bordered";
}

export function Card({ children, variant = "default", className = "", ...props }: CardProps) {
  const base = "bg-[#111827] rounded-2xl p-4";
  const variantClass = variant === "bordered" ? "border border-slate-700/50" : "";
  return (
    <View {...props} className={`${base} ${variantClass} ${className}`}>
      {children}
    </View>
  );
}
