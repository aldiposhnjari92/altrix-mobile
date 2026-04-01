import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  View,
  TouchableOpacityProps,
} from "react-native";

type Variant = "primary" | "secondary" | "outline" | "danger" | "ghost";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

const containerVariant: Record<Variant, string> = {
  primary: "bg-blue-500 active:bg-blue-600",
  secondary: "bg-slate-700 active:bg-slate-600",
  outline: "border border-blue-500 bg-transparent",
  danger: "bg-red-500 active:bg-red-600",
  ghost: "bg-transparent",
};

const textVariant: Record<Variant, string> = {
  primary: "text-white font-semibold",
  secondary: "text-slate-100 font-semibold",
  outline: "text-blue-400 font-semibold",
  danger: "text-white font-semibold",
  ghost: "text-slate-300 font-semibold",
};

const containerSize: Record<Size, string> = {
  sm: "px-4 py-2 rounded-lg",
  md: "px-6 py-3.5 rounded-xl",
  lg: "px-8 py-4 rounded-2xl",
};

const textSize: Record<Size, string> = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
};

export function Button({
  title,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  icon,
  fullWidth = false,
  ...rest
}: ButtonProps) {
  const spinnerColor = variant === "primary" || variant === "danger" ? "#fff" : "#60A5FA";
  return (
    <TouchableOpacity
      {...rest}
      disabled={disabled || loading}
      className={`flex-row items-center justify-center ${containerVariant[variant]} ${containerSize[size]} ${fullWidth ? "w-full" : ""} ${disabled || loading ? "opacity-50" : ""}`}
    >
      {loading ? (
        <ActivityIndicator color={spinnerColor} size="small" />
      ) : (
        <>
          {icon ? <View className="mr-2">{icon}</View> : null}
          <Text className={`${textVariant[variant]} ${textSize[size]}`}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}
