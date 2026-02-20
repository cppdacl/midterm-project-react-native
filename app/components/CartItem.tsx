import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useCart } from "../providers/CartContext";
import { useTheme } from "../providers/ThemeContext";
import { useCheckout } from "../providers/CheckoutContext";
import { Ionicons } from "@expo/vector-icons";

export default function CartItem({ item }: any) {
  const { increase, decrease } = useCart();
  const { theme } = useTheme();
  const { selectedItems, toggleItem } = useCheckout();

  const isSelected = selectedItems.includes(item.id);

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
      <TouchableOpacity
        onPress={() => toggleItem(item.id)}
        style={{
          width: 24,
          height: 24,
          borderWidth: 1,
          borderColor: theme.border,
          borderRadius: 6,
          justifyContent: "center",
          alignItems: "center",
          marginRight: 12,
          backgroundColor: isSelected ? theme.primary : theme.inputBackground,
        }}
      >
        {isSelected && (
          <Text style={{ color: theme.cardText, fontWeight: "700" }}>✓</Text>
        )}
      </TouchableOpacity>

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
          {item.name}
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

      <View
        style={{
          width: 100,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          borderWidth: 1,
          borderColor: theme.border,
          borderRadius: 20,
          overflow: "hidden",
          marginLeft: 12,
          backgroundColor: theme.inputBackground,
        }}
      >
        <TouchableOpacity
          onPress={() => decrease(item.id)}
          style={{
            width: 36,
            height: 36,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{ fontSize: 18, color: theme.primary, fontWeight: "600" }}
          >
            –
          </Text>
        </TouchableOpacity>

        <View
          style={{
            width: 28,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 16, color: theme.text, fontWeight: "600" }}>
            {item.quantity}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => increase(item.id)}
          style={{
            width: 36,
            height: 36,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{ fontSize: 18, color: theme.primary, fontWeight: "600" }}
          >
            +
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
