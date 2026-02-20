import React, { useState } from "react";
import { View, FlatList, Text, TouchableOpacity, Modal } from "react-native";
import { useCart } from "../providers/CartContext";
import { useCheckout } from "../providers/CheckoutContext";
import { useTheme } from "../providers/ThemeContext";
import { useRouter } from "expo-router";
import CheckoutItem from "../components/CheckoutItem";
import { Ionicons } from "@expo/vector-icons";
import { useToast } from "../providers/ToastContext";

export default function CheckoutScreen() {
  const { items, clearCart } = useCart();
  const { selectedItems, clearSelection } = useCheckout();
  const { theme } = useTheme();
  const { showToast } = useToast();

  const router = useRouter();

  const checkoutItems = items.filter((i) => selectedItems.includes(i.id));

  const subtotal = checkoutItems.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0,
  );
  const estimatedShipping = checkoutItems.length * 50;
  const total = subtotal + estimatedShipping;

  const formatDate = (daysToAdd: number) => {
    const date = new Date();
    date.setDate(date.getDate() + daysToAdd);
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  };

  const getEstimatedDelivery = () => {
    if (checkoutItems.length === 0) return "N/A";

    let minDay = Infinity;
    let maxDay = -Infinity;

    checkoutItems.forEach((item) => {
      if (item.shipping.minShippingDay < minDay)
        minDay = item.shipping.minShippingDay;
      if (item.shipping.maxShippingDay > maxDay)
        maxDay = item.shipping.maxShippingDay;
    });

    if (minDay === Infinity || maxDay === -Infinity) return "N/A";
    return minDay === maxDay
      ? formatDate(minDay)
      : `${formatDate(minDay)} – ${formatDate(maxDay)}`;
  };

  const estimatedDelivery = getEstimatedDelivery();

  const handlePlaceOrder = () => {
    clearCart();
    clearSelection();
    router.push("./");
    showToast("Order Placed!");
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.background,
        paddingHorizontal: 12,
        paddingTop: 64,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <Ionicons
          name="chevron-back"
          size={28}
          color={theme.text}
          onPress={() => router.push("/cart")}
        />
        <Text
          style={{
            fontSize: 32,
            fontWeight: "700",
            color: theme.text,
            marginLeft: 12,
          }}
        >
          Checkout
        </Text>
      </View>

      {checkoutItems.length === 0 ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ fontSize: 18, color: "#6B7280" }}>
            No items selected for checkout.
          </Text>
        </View>
      ) : (
        <FlatList
          data={checkoutItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <CheckoutItem item={item} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 200 }}
          ListFooterComponent={
            <View style={{ marginTop: 12 }}>
              <View
                style={{
                  backgroundColor: theme.card,
                  padding: 16,
                  borderRadius: 14,
                  marginBottom: 80,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 6,
                  }}
                >
                  <Text style={{ color: theme.text }}>Subtotal</Text>
                  <Text style={{ color: theme.text }}>
                    ₱ {subtotal.toLocaleString()}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 6,
                  }}
                >
                  <Text style={{ color: theme.text }}>Estimated Shipping</Text>
                  <Text style={{ color: theme.text }}>
                    ₱ {estimatedShipping.toLocaleString()}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 6,
                  }}
                >
                  <Text style={{ color: theme.text }}>Estimated Delivery</Text>
                  <Text style={{ color: theme.text }}>{estimatedDelivery}</Text>
                </View>

                <View
                  style={{
                    borderTopWidth: 1,
                    borderColor: theme.border,
                    marginTop: 8,
                    paddingTop: 8,
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "700",
                      fontSize: 16,
                      color: theme.text,
                    }}
                  >
                    Total
                  </Text>
                  <Text
                    style={{
                      fontWeight: "700",
                      fontSize: 16,
                      color: theme.text,
                    }}
                  >
                    ₱ {total.toLocaleString()}
                  </Text>
                </View>
              </View>
            </View>
          }
        />
      )}

      {checkoutItems.length > 0 && (
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: 20,
            paddingBottom: 35,
            backgroundColor: theme.card,
            borderTopWidth: 1,
            borderColor: theme.border,
            marginBottom: 0,
          }}
        >
          <TouchableOpacity
            onPress={handlePlaceOrder}
            style={{
              backgroundColor: "#7C3AED",
              paddingVertical: 14,
              borderRadius: 12,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white", fontSize: 18, fontWeight: "700" }}>
              Place Order
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
