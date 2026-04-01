import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  iconName?: keyof typeof Ionicons.glyphMap;
  isPassword?: boolean;
}

export function Input({
  label,
  error,
  hint,
  iconName,
  isPassword = false,
  ...props
}: InputProps) {
  const [show, setShow] = useState(false);
  const borderColor = error ? "border-red-500" : "border-slate-700";

  return (
    <View className="mb-4">
      {label ? (
        <Text className="text-slate-300 text-sm font-medium mb-1.5">{label}</Text>
      ) : null}
      <View
        className={`flex-row items-center bg-slate-800/80 border ${borderColor} rounded-xl px-4`}
      >
        {iconName ? (
          <Ionicons
            name={iconName}
            size={18}
            color="#64748B"
            style={{ marginRight: 10 }}
          />
        ) : null}
        <TextInput
          className="flex-1 text-slate-100 text-base py-3.5"
          placeholderTextColor="#475569"
          secureTextEntry={isPassword && !show}
          {...props}
        />
        {isPassword ? (
          <TouchableOpacity onPress={() => setShow((s) => !s)} className="pl-2">
            <Ionicons
              name={show ? "eye-off-outline" : "eye-outline"}
              size={18}
              color="#64748B"
            />
          </TouchableOpacity>
        ) : null}
      </View>
      {error ? (
        <Text className="text-red-400 text-xs mt-1 ml-1">{error}</Text>
      ) : null}
      {hint && !error ? (
        <Text className="text-slate-500 text-xs mt-1 ml-1">{hint}</Text>
      ) : null}
    </View>
  );
}
