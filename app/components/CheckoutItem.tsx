import React from "react";
import { View, Text, Image } from "react-native";
import { useTheme } from "../providers/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

export default function CheckoutItem({ item }: any) {
  const { theme } = useTheme();

  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: theme.card,
        borderRadius: 14,
        padding: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: theme.border,
        alignItems: "center",
      }}
    >
      <Image
        source={{ uri: item.image }}
        style={{
          width: 70,
          height: 70,
          borderRadius: 12,
          backgroundColor: theme.inputBackground,
        }}
        resizeMode="cover"
      />

      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text
          numberOfLines={2}
          style={{ fontSize: 15, fontWeight: "600", color: theme.text }}
        >
          {item.quantity}x {item.name}
        </Text>

        <Text
          style={{
            fontSize: 14,
            fontWeight: "600",
            color: theme.text,
            marginTop: 6,
          }}
        >
          ₱ {item.price.toLocaleString()}
        </Text>

        <View
          style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}
        >
          <Ionicons
            name="boat-outline"
            size={14}
            color={theme.placeholder}
            style={{ marginRight: 4, marginLeft: -1 }}
          />
          <Text style={{ fontSize: 12, color: theme.placeholder }}>
            {item.shipping.minShippingDay}–{item.shipping.maxShippingDay} Days |{" "}
            {item.shipping.location}
          </Text>
        </View>
      </View>
    </View>
  );
}
