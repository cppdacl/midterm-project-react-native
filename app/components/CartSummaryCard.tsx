import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useCart } from "../providers/CartContext";
import { useCheckout } from "../providers/CheckoutContext";
import { useTheme } from "../providers/ThemeContext";
import { useRouter } from "expo-router";

export default function CartSummaryCard() {
  const { items } = useCart();
  const { selectedItems, selectAll, clearSelection } = useCheckout();
  const { theme } = useTheme();
  const router = useRouter();

  const allSelected = items.length > 0 && selectedItems.length === items.length;

  const totalPrice = items
    .filter((i) => selectedItems.includes(i.id))
    .reduce((sum, i) => sum + i.price * i.quantity, 0);

  const isCheckoutDisabled = items.length === 0 || selectedItems.length === 0;

  const toggleSelectAll = () => {
    if (allSelected) clearSelection();
    else selectAll(items.map((i) => i.id));
  };

  return (
    <View
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: theme.card,
        borderTopWidth: 1,
        borderColor: theme.border,
        padding: 25,
        paddingTop: 15,
        paddingBottom: 35,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <TouchableOpacity
        onPress={toggleSelectAll}
        style={{
          width: 24,
          height: 24,
          borderWidth: 1,
          borderColor: theme.border,
          borderRadius: 6,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: allSelected ? theme.primary : theme.inputBackground,
        }}
      >
        {allSelected && (
          <Text style={{ color: theme.text, fontWeight: "700" }}>✓</Text>
        )}
      </TouchableOpacity>

      <Text
        style={{
          flex: 1,
          marginLeft: 12,
          fontSize: 16,
          fontWeight: "600",
          color: theme.text,
        }}
      >
        Total: ₱ {totalPrice.toLocaleString()}
      </Text>

      <TouchableOpacity
        disabled={isCheckoutDisabled}
        onPress={() => router.push("/checkout")}
        style={{
          backgroundColor: isCheckoutDisabled ? theme.border : theme.primary,
          paddingVertical: 10,
          paddingHorizontal: 16,
          borderRadius: 10,
        }}
      >
        <Text
          style={{
            color: isCheckoutDisabled ? theme.placeholder : theme.cardText,
            fontWeight: "600",
            fontSize: 16,
          }}
        >
          Checkout
        </Text>
      </TouchableOpacity>
    </View>
  );
}
